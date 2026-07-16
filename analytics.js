(() => {
  const endpoint = String(window.AIS_FLOWS_ANALYTICS_ENDPOINT || "").trim();
  const eventQueue = window.AIS_FLOWS_ANALYTICS_EVENTS = window.AIS_FLOWS_ANALYTICS_EVENTS || [];
  const pageId = document.body?.dataset.pageId || "unknown-page";
  const language = document.documentElement.lang || "en";
  const safeSessionId = () => {
    try {
      const key = "aisflows_analytics_session";
      const existing = sessionStorage.getItem(key);
      if (existing) return existing;
      const value = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(key, value);
      return value;
    } catch (error) {
      return null;
    }
  };
  const trackingContext = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || null,
      utm_medium: params.get("utm_medium") || null,
      utm_campaign: params.get("utm_campaign") || null,
      referrer_host: document.referrer ? (() => {
        try { return new URL(document.referrer).hostname; } catch (error) { return null; }
      })() : null,
    };
  };
  const track = (eventName, details = {}) => {
    const event = {
      event_id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      event_name: eventName,
      occurred_at: new Date().toISOString(),
      page_id: pageId,
      language,
      session_id: safeSessionId(),
      action_id: details.action_id || null,
      object_id: details.object_id || null,
      destination_url: details.destination_url || null,
      result: details.result || null,
      ...trackingContext(),
    };
    eventQueue.push(event);
    window.dispatchEvent(new CustomEvent("aisflows:event", { detail: event }));
    if (endpoint && navigator.doNotTrack !== "1") {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
        keepalive: true,
      }).catch(() => {});
    }
    return event;
  };

  window.AISFlowsAnalytics = { track };
  track("page_view", { action_id: "page_view" });

  document.addEventListener("click", (event) => {
    const target = event.target.closest?.("[data-analytics-event]");
    if (!target) return;
    track(target.dataset.analyticsEvent, {
      action_id: target.dataset.actionId || target.dataset.analyticsEvent,
      object_id: target.dataset.objectId || null,
      destination_url: target.href || null,
    });
  });

  if ("IntersectionObserver" in window) {
    const observed = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || observed.has(entry.target)) return;
        observed.add(entry.target);
        track("section_view", { object_id: entry.target.id || entry.target.dataset.sectionId || null });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    document.querySelectorAll("section[id]").forEach((section) => observer.observe(section));
  }
})();
