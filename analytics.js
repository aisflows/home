(() => {
  const ANALYTICS_CONFIG = Object.freeze({
    provider: "umami",
    websiteId: "48b4db88-8e85-436c-96f3-fc975d3b2f36",
    scriptUrl: "https://cloud.umami.is/script.js",
    domains: ["aisflows.github.io"],
    status: "public_home_collection_verified",
  });
  const loopbackHosts = new Set(["127.0.0.1", "localhost"]);
  const testConfig = loopbackHosts.has(window.location.hostname)
    && window.AIS_FLOWS_ANALYTICS_TEST_CONFIG?.allowLocalMock === true
    ? window.AIS_FLOWS_ANALYTICS_TEST_CONFIG
    : null;
  const config = {
    ...ANALYTICS_CONFIG,
    ...(testConfig || {}),
  };
  const EVENT_SCHEMA_VERSION = "2.0.0";
  const supportedEvents = new Set([
    "page_view",
    "section_view",
    "product_open",
    "release_open",
    "download",
    "media_open",
    "external_link",
    "request_form_open",
    "request_submit_success",
    "request_submit_error",
  ]);
  const eventAliases = new Map([
    ["featured_media_play", "media_open"],
    ["request_form_submit_success", "request_submit_success"],
    ["request_form_submit_error", "request_submit_error"],
  ]);
  const eventQueue = window.AIS_FLOWS_ANALYTICS_EVENTS = window.AIS_FLOWS_ANALYTICS_EVENTS || [];
  const providerQueue = [];
  const pageId = document.body?.dataset.pageId || "unknown-page";
  const language = document.documentElement.lang || "en";
  const validWebsiteId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(config.websiteId);
  const validScriptUrl = config.scriptUrl === ANALYTICS_CONFIG.scriptUrl
    || (testConfig && /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?\/mock-umami\.js$/.test(config.scriptUrl));
  const domainAllowed = config.domains.includes(window.location.hostname)
    || Boolean(testConfig && loopbackHosts.has(window.location.hostname));
  const configured = config.provider === "umami" && validWebsiteId && validScriptUrl;
  let providerState = configured
    ? (domainAllowed ? "loading" : "domain-not-allowed")
    : (config.websiteId ? "configuration-invalid" : "website-id-required");

  const safeToken = (value, maxLength = 80) => {
    if (value === null || value === undefined || value === "") return null;
    const token = String(value);
    return token.length <= maxLength && /^[A-Za-z0-9][A-Za-z0-9._:~-]*$/.test(token)
      ? token
      : null;
  };
  const trackingContext = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: safeToken(params.get("utm_source"), 64),
      utm_medium: safeToken(params.get("utm_medium"), 64),
      utm_campaign: safeToken(params.get("utm_campaign"), 64),
      referrer_host: document.referrer ? (() => {
        try { return new URL(document.referrer).hostname; } catch { return null; }
      })() : null,
    };
  };
  const destinationHost = (value) => {
    if (!value) return null;
    try { return new URL(value, window.location.href).hostname || null; } catch { return null; }
  };
  const providerPayload = (event) => ({
    action_id: event.action_id,
    object_id: event.object_id,
    result: event.result,
    locale: event.language,
    destination_host: event.destination_host,
  });
  const sendToProvider = (event) => {
    if (event.event_name === "page_view") return;
    if (providerState !== "ready" || typeof window.umami?.track !== "function") {
      providerQueue.push(event);
      return;
    }
    window.umami.track(event.event_name, providerPayload(event));
  };
  const flushProviderQueue = () => {
    if (providerState !== "ready" || typeof window.umami?.track !== "function") return;
    providerQueue.splice(0).forEach((event) => {
      if (event.event_name !== "page_view") window.umami.track(event.event_name, providerPayload(event));
    });
  };
  const track = (eventName, details = {}) => {
    const canonicalEventName = eventAliases.get(eventName) || eventName;
    if (!supportedEvents.has(canonicalEventName)) return null;
    const event = Object.freeze({
      schema_version: EVENT_SCHEMA_VERSION,
      collection_status: ANALYTICS_CONFIG.status,
      event_id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      event_name: canonicalEventName,
      occurred_at: new Date().toISOString(),
      page_id: safeToken(pageId) || "unknown-page",
      language: language === "ru" ? "ru" : "en",
      action_id: safeToken(details.action_id),
      object_id: safeToken(details.object_id),
      destination_host: destinationHost(details.destination_url),
      result: safeToken(details.result, 64),
      ...trackingContext(),
    });
    eventQueue.push(event);
    window.dispatchEvent(new CustomEvent("aisflows:event", { detail: event }));
    if (configured && domainAllowed) sendToProvider(event);
    return event;
  };
  const status = () => ({
    provider: config.provider,
    configured,
    domainAllowed,
    providerState,
    websiteIdPresent: Boolean(config.websiteId),
    collectionStatus: ANALYTICS_CONFIG.status,
  });

  window.AISFlowsAnalytics = { track, status };
  track("page_view", { action_id: "page_view" });

  if (configured && domainAllowed) {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = config.scriptUrl;
    script.dataset.aisflowsUmami = "true";
    script.dataset.websiteId = config.websiteId;
    script.dataset.domains = config.domains.join(",");
    script.dataset.doNotTrack = "true";
    script.dataset.excludeSearch = "true";
    script.addEventListener("load", () => {
      providerState = typeof window.umami?.track === "function" ? "ready" : "provider-api-missing";
      flushProviderQueue();
    });
    script.addEventListener("error", () => {
      providerState = "load-error";
    });
    document.head.append(script);
  }

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
