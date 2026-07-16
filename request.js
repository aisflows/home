(() => {
  const endpoint = String(window.AIS_FLOWS_REQUEST_ENDPOINT || "").trim();
  const modal = document.getElementById("request-modal");
  const forms = [...document.querySelectorAll("[data-request-form]")];
  const focusableSelector = "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])";
  const track = (name, details) => window.AISFlowsAnalytics?.track(name, details);

  const setStatus = (form, message, state) => {
    const status = form.querySelector("[data-request-status]");
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state || "idle";
  };

  const updateContactLabel = (form) => {
    const method = form.elements.contact_method?.value;
    const label = form.querySelector("[data-contact-label]");
    const field = form.elements.contact_value;
    if (!label || !field) return;
    const isTelegram = method === "telegram";
    label.textContent = isTelegram ? (form.dataset.telegramLabel || "Telegram username or URL") : (form.dataset.emailLabel || "Email");
    field.placeholder = isTelegram ? "@username or https://t.me/..." : "name@example.com";
    field.type = isTelegram ? "text" : "email";
    field.pattern = isTelegram ? "(@?[A-Za-z0-9_]{5,32}|https://t\\.me/[A-Za-z0-9_./-]+)" : "[^\\s@]+@[^\\s@]+\\.[^\\s@]+";
  };

  const validateForm = (form) => {
    const method = form.elements.contact_method?.value;
    const contact = String(form.elements.contact_value?.value || "").trim();
    const materials = String(form.elements.materials_url?.value || "").trim();
    const type = String(form.elements.request_type?.value || "");
    const validTypes = ["project_video", "audio_music", "app_tool", "hiring_collaboration", "product_support", "other"];
    if (!validTypes.includes(type)) return "Select a request type.";
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return "Enter a valid email.";
    if (method === "telegram" && !/^@?[A-Za-z0-9_]{5,32}$|^https:\/\/t\.me\/[A-Za-z0-9_./-]+$/.test(contact)) return "Enter a Telegram username or HTTPS URL.";
    if (materials && !/^https?:\/\/[^\s]+$/i.test(materials)) return "Materials URL must use HTTP or HTTPS.";
    return "";
  };

  const fallbackLink = (form) => {
    const link = form.querySelector("[data-request-fallback]");
    if (!link) return;
    const subject = encodeURIComponent(form.dataset.emailSubject || "AIS FLOWS project request");
    const body = encodeURIComponent(form.dataset.emailBody || "Hello AIS FLOWS,\n\nI would like to discuss a project.\n\nRequest type: ");
    link.href = `mailto:hitmesound@gmail.com?subject=${subject}&body=${body}`;
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = validateForm(form);
    if (error) {
      setStatus(form, error, "invalid");
      track("request_form_submit_error", { action_id: "request_submit", object_id: "validation" });
      return;
    }
    if (!endpoint) {
      setStatus(form, form.dataset.receiverUnavailable || "Request receiver is not configured yet. Use the email fallback below.", "receiver-unavailable");
      track("request_form_submit_error", { action_id: "request_submit", object_id: "receiver-unavailable", result: "receiver-unavailable" });
      return;
    }
    const payload = {
      request_type: form.elements.request_type.value,
      summary: String(form.elements.summary.value || "").trim(),
      contact_method: form.elements.contact_method.value,
      contact_value: String(form.elements.contact_value.value || "").trim(),
      materials_url: String(form.elements.materials_url.value || "").trim() || null,
      honeypot: String(form.elements.website.value || ""),
      locale: document.documentElement.lang || "en",
      source_page: window.location.pathname,
      idempotency_key: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };
    const submit = form.querySelector("[data-request-submit]");
    if (submit) submit.disabled = true;
    setStatus(form, form.dataset.sending || "Sending...", "sending");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if ((response.status === 200 || response.status === 201) && data.request_id) {
        setStatus(form, form.dataset.success || "Request sent.", "success");
        track("request_form_submit_success", { action_id: "request_submit", object_id: data.request_id, result: "success" });
        form.reset();
        updateContactLabel(form);
      } else if (response.status === 429) {
        setStatus(form, form.dataset.rateLimited || "Please wait and try again later.", "rate-limited");
        track("request_form_submit_error", { action_id: "request_submit", object_id: "rate-limited", result: "429" });
      } else {
        setStatus(form, form.dataset.sendError || "The request could not be sent. Use the email fallback below.", "error");
        track("request_form_submit_error", { action_id: "request_submit", object_id: "receiver", result: String(response.status) });
      }
    } catch (submitError) {
      setStatus(form, form.dataset.offline || "Network unavailable. Use the email fallback below.", submitError.name === "AbortError" ? "timeout" : "offline");
      track("request_form_submit_error", { action_id: "request_submit", object_id: "network", result: submitError.name });
    } finally {
      window.clearTimeout(timer);
      if (submit) submit.disabled = false;
    }
  };

  forms.forEach((form) => {
    form.dataset.receiverState = endpoint ? "configured-unverified" : "unavailable";
    const submit = form.querySelector("[data-request-submit]");
    if (submit && !endpoint) submit.disabled = true;
    form.elements.contact_method?.addEventListener("change", () => updateContactLabel(form));
    form.addEventListener("submit", submitForm);
    fallbackLink(form);
    updateContactLabel(form);
  });

  if (!modal) return;
  let lastTrigger = null;
  const closeModal = (force = false) => {
    const form = modal.querySelector("[data-request-form]");
    const dirty = form && [...form.elements].some((field) => {
      if (field.type === "hidden" || field.name === "website") return false;
      if (field.name === "contact_method") return field.value !== "email";
      return Boolean(field.value);
    });
    if (!force && dirty && !window.confirm(modal.dataset.unsavedWarning || "Discard this request draft?")) return;
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("open");
    document.body.classList.remove("modal-open");
    if (lastTrigger) lastTrigger.focus();
  };
  const openModal = (trigger) => {
    lastTrigger = trigger;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (typeof modal.showModal === "function") modal.showModal();
    const title = modal.querySelector("h2, [data-request-title]");
    title?.focus?.();
    modal.querySelector("input, select, textarea, button")?.focus();
    track("request_form_open", { action_id: "request_open", object_id: "request" });
  };
  document.querySelectorAll("[data-open-request]").forEach((trigger) => trigger.addEventListener("click", () => openModal(trigger)));
  modal.querySelectorAll("[data-close-request]").forEach((control) => control.addEventListener("click", () => closeModal()));
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.matches(".request-modal-backdrop")) closeModal();
  });
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== "Tab") return;
    const items = [...modal.querySelectorAll(focusableSelector)].filter((item) => item.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
