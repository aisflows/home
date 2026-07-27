(() => {
  const REQUEST_RECEIVER_CONFIG = Object.freeze({
    endpoint: "https://formspree.io/f/mqerwzgq",
    timeoutMs: 15000,
  });
  const isLoopbackHost = ["127.0.0.1", "localhost", "::1"].includes(window.location.hostname);
  const testConfig = isLoopbackHost && window.AIS_FLOWS_REQUEST_TEST_CONFIG
    ? window.AIS_FLOWS_REQUEST_TEST_CONFIG
    : {};
  const receiverConfig = {
    ...REQUEST_RECEIVER_CONFIG,
    ...testConfig,
  };
  const endpoint = String(receiverConfig.endpoint || "").trim();
  const timeoutMs = Number.isFinite(Number(receiverConfig.timeoutMs))
    ? Math.min(Math.max(Number(receiverConfig.timeoutMs), 250), 30000)
    : REQUEST_RECEIVER_CONFIG.timeoutMs;
  const isFormspreeEndpoint = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9_-]+$/.test(endpoint);
  const isLocalTestEndpoint = Boolean(
    isLoopbackHost
    && testConfig.allowLocalMock === true
    && /^https?:\/\/(?:127\.0\.0\.1|localhost|\[::1\])(?::\d+)?\//.test(endpoint),
  );
  const receiverConfigured = isFormspreeEndpoint || isLocalTestEndpoint;
  const modal = document.getElementById("request-modal");
  const forms = [...document.querySelectorAll("[data-request-form]")];
  const pendingForms = new WeakSet();
  const focusableSelector = "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])";
  const track = (name, details) => window.AISFlowsAnalytics?.track(name, details);
  const isRussian = (document.documentElement.lang || "").toLowerCase().startsWith("ru");
  const validationCopy = isRussian ? {
    requestType: "Выберите тип заявки.",
    email: "Укажите корректный email.",
    telegram: "Укажите имя пользователя Telegram или HTTPS-ссылку.",
    materials: "Ссылка на материалы должна начинаться с HTTP или HTTPS.",
  } : {
    requestType: "Select a request type.",
    email: "Enter a valid email.",
    telegram: "Enter a Telegram username or HTTPS URL.",
    materials: "Materials URL must use HTTP or HTTPS.",
  };

  const closeRequestSelect = (root, returnFocus = false) => {
    const trigger = root?.querySelector("[data-request-select-trigger]");
    const list = root?.querySelector("[data-request-select-list]");
    if (!trigger || !list) return;
    trigger.setAttribute("aria-expanded", "false");
    list.hidden = true;
    list.querySelectorAll("[data-active]").forEach((option) => delete option.dataset.active);
    if (returnFocus) {
      trigger.focus({ preventScroll: true });
      root.closest(".request-modal-panel")?.scrollTo({ top: 0 });
    }
  };

  const initRequestSelect = (root) => {
    const trigger = root.querySelector("[data-request-select-trigger]");
    const list = root.querySelector("[data-request-select-list]");
    const input = root.querySelector('input[name="request_type"]');
    const value = root.querySelector("[data-request-select-value]");
    const options = [...root.querySelectorAll(".request-select-option")];
    if (!trigger || !list || !input || !value || !options.length) return;
    const placeholder = value.textContent;

    const focusOption = (index) => {
      const bounded = (index + options.length) % options.length;
      options.forEach((option, optionIndex) => {
        if (optionIndex === bounded) option.dataset.active = "true";
        else delete option.dataset.active;
      });
      options[bounded].focus();
    };
    const openSelect = (edge = "selected") => {
      document.querySelectorAll("[data-request-select]").forEach((other) => {
        if (other !== root) closeRequestSelect(other);
      });
      trigger.setAttribute("aria-expanded", "true");
      list.hidden = false;
      const selectedIndex = Math.max(0, options.findIndex((option) => option.dataset.value === input.value));
      focusOption(edge === "last" ? options.length - 1 : selectedIndex);
    };
    const choose = (option) => {
      input.value = option.dataset.value || "";
      value.textContent = option.textContent.trim();
      trigger.dataset.placeholder = "false";
      options.forEach((item) => item.setAttribute("aria-selected", String(item === option)));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      closeRequestSelect(root, true);
      root.closest(".request-modal-panel")?.scrollTo({ top: 0 });
    };
    const reset = () => {
      input.value = "";
      value.textContent = placeholder;
      trigger.dataset.placeholder = "true";
      options.forEach((option) => option.setAttribute("aria-selected", "false"));
      closeRequestSelect(root);
    };

    trigger.addEventListener("click", () => {
      if (trigger.getAttribute("aria-expanded") === "true") closeRequestSelect(root, true);
      else openSelect();
    });
    trigger.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      openSelect(event.key === "ArrowUp" || event.key === "End" ? "last" : "selected");
    });
    options.forEach((option, index) => {
      option.addEventListener("click", () => choose(option));
      option.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          focusOption(index + (event.key === "ArrowDown" ? 1 : -1));
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          focusOption(event.key === "Home" ? 0 : options.length - 1);
        } else if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          closeRequestSelect(root, true);
        }
      });
    });
    root.closest("form")?.addEventListener("reset", () => window.setTimeout(reset));
  };

  document.querySelectorAll("[data-request-select]").forEach(initRequestSelect);
  document.addEventListener("click", (event) => {
    document.querySelectorAll("[data-request-select]").forEach((root) => {
      if (!root.contains(event.target)) closeRequestSelect(root);
    });
  });

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
    if (!validTypes.includes(type)) return validationCopy.requestType;
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return validationCopy.email;
    if (method === "telegram" && !/^@?[A-Za-z0-9_]{5,32}$|^https:\/\/t\.me\/[A-Za-z0-9_./-]+$/.test(contact)) return validationCopy.telegram;
    if (materials && !/^https?:\/\/[^\s]+$/i.test(materials)) return validationCopy.materials;
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
    if (pendingForms.has(form)) return;
    const error = validateForm(form);
    if (error) {
      setStatus(form, error, "invalid");
      track("request_submit_error", { action_id: "request_submit", object_id: "validation" });
      return;
    }
    if (!receiverConfigured) {
      const invalidConfiguration = Boolean(endpoint);
      setStatus(
        form,
        invalidConfiguration
          ? (form.dataset.configurationError || "The request receiver configuration is invalid. Use the email fallback below.")
          : (form.dataset.receiverUnavailable || "Request receiver is not configured yet. Use the email fallback below."),
        invalidConfiguration ? "configuration-error" : "receiver-unavailable",
      );
      track("request_submit_error", {
        action_id: "request_submit",
        object_id: invalidConfiguration ? "configuration-error" : "receiver-unavailable",
        result: invalidConfiguration ? "configuration-error" : "receiver-unavailable",
      });
      return;
    }
    const correlationKey = crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const payload = {
      request_type: form.elements.request_type.value,
      summary: String(form.elements.summary.value || "").trim(),
      contact_method: form.elements.contact_method.value,
      contact_value: String(form.elements.contact_value.value || "").trim(),
      materials_url: String(form.elements.materials_url.value || "").trim() || null,
      _gotcha: String(form.elements.website.value || ""),
      locale: document.documentElement.lang || "en",
      source_page: window.location.pathname,
      // Formspree stores this as request metadata; no persistent gateway dedupe is claimed.
      idempotency_key: correlationKey,
      human_confirmation: true,
    };
    const submit = form.querySelector("[data-request-submit]");
    pendingForms.add(form);
    if (submit) submit.disabled = true;
    setStatus(form, form.dataset.sending || "Sending...", "sending");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const responseText = await response.text();
      let responseData = null;
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = null;
        }
      }
      if (response.ok) {
        setStatus(form, form.dataset.success || "Request sent.", "success");
        track("request_submit_success", { action_id: "request_submit", object_id: "formspree", result: "success" });
        form.reset();
        updateContactLabel(form);
      } else if (response.status === 429) {
        setStatus(form, form.dataset.rateLimited || "Please wait and try again later.", "rate-limited");
        track("request_submit_error", { action_id: "request_submit", object_id: "rate-limited", result: "429" });
      } else if (response.status >= 400 && response.status < 500) {
        setStatus(form, form.dataset.validationError || "Please check the request details and try again.", "validation-error");
        track("request_submit_error", {
          action_id: "request_submit",
          object_id: "validation",
          result: String(response.status),
          provider_error_count: Array.isArray(responseData?.errors) ? responseData.errors.length : 0,
        });
      } else if (response.status >= 500) {
        setStatus(form, form.dataset.serverError || "The receiver is temporarily unavailable. Use the email fallback below.", "server-error");
        track("request_submit_error", { action_id: "request_submit", object_id: "receiver", result: String(response.status) });
      } else {
        setStatus(form, form.dataset.sendError || "The request could not be sent. Use the email fallback below.", "error");
        track("request_submit_error", { action_id: "request_submit", object_id: "receiver", result: String(response.status) });
      }
    } catch (submitError) {
      const timedOut = submitError.name === "AbortError";
      setStatus(
        form,
        timedOut
          ? (form.dataset.timeout || "The request timed out. Use the email fallback below.")
          : (form.dataset.offline || "Network unavailable. Use the email fallback below."),
        timedOut ? "timeout" : "offline",
      );
      track("request_submit_error", { action_id: "request_submit", object_id: "network", result: submitError.name });
    } finally {
      window.clearTimeout(timer);
      pendingForms.delete(form);
      if (submit) submit.disabled = !receiverConfigured;
    }
  };

  forms.forEach((form) => {
    form.dataset.receiverState = receiverConfigured
      ? "configured-unverified"
      : (endpoint ? "configuration-invalid" : "integration-ready-receiver-id-missing");
    const submit = form.querySelector("[data-request-submit]");
    if (submit) submit.disabled = !receiverConfigured;
    if (receiverConfigured) {
      setStatus(form, form.dataset.receiverReady || "Online request delivery is configured. Email fallback remains available.", "ready");
    } else if (endpoint) {
      setStatus(form, form.dataset.configurationError || "The request receiver configuration is invalid. Use the email fallback below.", "configuration-error");
    }
    form.querySelectorAll('[name="contact_method"]').forEach((control) => control.addEventListener("change", () => updateContactLabel(form)));
    form.addEventListener("submit", submitForm);
    fallbackLink(form);
    updateContactLabel(form);
  });

  if (!modal) return;
  let lastTrigger = null;
  const closeModal = (force = false) => {
    const form = modal.querySelector("[data-request-form]");
    const dirty = form && [...form.elements].some((field) => {
      if (field.name === "request_type") return Boolean(field.value);
      if (field.name === "contact_method") return field.checked && field.value !== "email";
      if (field.type === "hidden" || field.name === "website") return false;
      return Boolean(field.value);
    });
    if (!force && dirty && !window.confirm(modal.dataset.unsavedWarning || "Discard this request draft?")) return;
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("open");
    document.body.classList.remove("modal-open");
    modal.querySelectorAll("[data-request-select]").forEach((root) => closeRequestSelect(root));
    if (lastTrigger) lastTrigger.focus();
  };
  const openModal = (trigger) => {
    lastTrigger = trigger;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (typeof modal.showModal === "function") modal.showModal();
    const title = modal.querySelector("h2, [data-request-title]");
    title?.focus?.();
    modal.querySelector("[data-request-select-trigger], input, textarea, button")?.focus();
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
