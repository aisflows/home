(function () {
  "use strict";
  var labels = {"en":{"copied":"Timescript copied.","copyFailed":"Could not copy. Try again.","publicationCopied":"Copied: {label}.","publicationDownloaded":"Package downloaded: {label}.","publicationCopyFailed":"Could not copy. Try again.","states":{"loading":["LOADING","Loading result","Checking whether this result is available."],"empty":["EMPTY","There is no timescript","Return to AI Publisher and create an analysis with timed rows."],"invalid":["INVALID","The result did not pass validation","Its content cannot be shown or downloaded safely."],"error":["ERROR","Temporary result error","Try again later or return to AIS FLOWS."],"missing":["MISSING","Result not found","This link does not lead to an available result."],"expired":["EXPIRED","Result expired","This result is no longer stored."],"deleted":["DELETED","Result deleted","The result and its files are no longer available."],"unsupported_schema":["UNSUPPORTED_SCHEMA","Unsupported result version","AI Publisher must prepare a supported result version."]}},"ru":{"copied":"Сценарий скопирован.","copyFailed":"Не удалось скопировать. Повторите попытку.","publicationCopied":"Скопировано: {label}.","publicationDownloaded":"Пакет скачан: {label}.","publicationCopyFailed":"Не удалось скопировать. Повторите попытку.","states":{"loading":["ЗАГРУЗКА","Загружаем результат","Проверяем доступность результата."],"empty":["ПУСТО","В результате нет сценария","Вернитесь в AI Publisher и создайте анализ с временной разметкой."],"invalid":["НЕКОРРЕКТНО","Результат не прошёл проверку","Содержимое нельзя безопасно показать или скачать."],"error":["ОШИБКА","Временная ошибка результата","Повторите попытку позже или вернитесь в AIS FLOWS."],"missing":["НЕ НАЙДЕНО","Результат не найден","Ссылка не ведёт к доступному результату."],"expired":["СРОК ИСТЁК","Срок результата закончился","Этот результат больше не хранится."],"deleted":["УДАЛЕНО","Результат удалён","Содержимое и файлы этого результата больше недоступны."],"unsupported_schema":["ВЕРСИЯ НЕ ПОДДЕРЖИВАЕТСЯ","Версия результата не поддерживается","AI Publisher должен подготовить результат в поддерживаемой версии схемы."]}}};
  var localeKey = document.body.dataset.localeKey;
  var locale = labels[localeKey];
  var statePanel = document.getElementById("state-panel");
  var readySections = document.querySelectorAll(".render-ready");
  var params = new URLSearchParams(window.location.search);
  var requestedState = params.get("state");
  var pageState = requestedState === "unsupported" ? "unsupported_schema" : requestedState;
  var allowedAvailability = ["analysis-only", "analysis-publications", "publications-only"];
  var availability = params.get("availability") || "analysis-publications";
  if (!allowedAvailability.includes(availability)) { availability = "analysis-publications"; }
  document.body.dataset.resultAvailability = availability;
  if (locale && pageState && Object.hasOwn(locale.states, pageState)) {
    readySections.forEach(function (section) { section.hidden = true; });
    statePanel.hidden = false;
    document.getElementById("state-kicker").textContent = "AI Publisher · " + locale.states[pageState][0];
    document.getElementById("state-title").textContent = locale.states[pageState][1];
    document.getElementById("state-copy").textContent = locale.states[pageState][2];
  }
  var header = document.querySelector(".result-header");
  function syncHeader() { if (header) { header.classList.toggle("is-scrolled", window.scrollY > 8); } }
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
  var modeTabs = Array.prototype.slice.call(document.querySelectorAll("[data-result-mode-tab]"));
  var modePanels = Array.prototype.slice.call(document.querySelectorAll("[data-result-mode-panel]"));
  var modeSwitch = document.querySelector(".result-mode-switch");
  function modeAvailable(mode) { return ["analysis", "publications"].includes(mode) && (availability === "analysis-publications" || availability === mode + "-only"); }
  function setResultMode(mode, updateUrl) {
    if (!modeAvailable(mode) || pageState) { return; }
    modeTabs.forEach(function (tab) { var active = tab.dataset.resultModeTab === mode; tab.hidden = !modeAvailable(tab.dataset.resultModeTab); tab.classList.toggle("is-active", active); tab.setAttribute("aria-selected", String(active)); tab.tabIndex = active ? 0 : -1; });
    modePanels.forEach(function (panel) { panel.hidden = panel.dataset.resultModePanel !== mode; });
    document.body.dataset.activeResultMode = mode;
    if (updateUrl && window.history && window.history.replaceState) { var next = new URL(window.location.href); next.searchParams.set("mode", mode); window.history.replaceState({}, "", next); }
  }
  if (!pageState) {
    modeTabs.forEach(function (tab) { tab.hidden = !modeAvailable(tab.dataset.resultModeTab); tab.addEventListener("click", function () { setResultMode(tab.dataset.resultModeTab, true); }); });
    var visibleTabs = modeTabs.filter(function (tab) { return !tab.hidden; });
    modeSwitch.dataset.singleMode = String(visibleTabs.length === 1);
    modeSwitch.addEventListener("keydown", function (event) { if (!["ArrowLeft", "ArrowRight"].includes(event.key) || visibleTabs.length < 2) { return; } event.preventDefault(); var current = visibleTabs.indexOf(document.activeElement); var delta = event.key === "ArrowRight" ? 1 : -1; visibleTabs[(current + delta + visibleTabs.length) % visibleTabs.length].focus(); });
    var requestedMode = params.get("mode");
    var initialResultMode = document.documentElement.dataset.initialResultMode;
    var initialMode = modeAvailable(requestedMode) ? requestedMode : (modeAvailable(initialResultMode) ? initialResultMode : (availability === "publications-only" ? "publications" : "analysis"));
    setResultMode(initialMode, false);
  }
  document.documentElement.dataset.resultRuntimeReady = "true";
  var copyButton = document.getElementById("copy-script");
  var copyState = document.getElementById("copy-state");
  var table = document.getElementById("timescript");
  function cellValue(row, field) { var cell = row.querySelector("[data-field='" + field + "']"); return cell ? cell.textContent.trim() : "—"; }
  function scriptText() { return Array.prototype.map.call(table.tBodies[0].rows, function (row) { return [cellValue(row, "time"), cellValue(row, "visible"), cellValue(row, "text"), cellValue(row, "sound"), cellValue(row, "note")].join("\n"); }).join("\n\n"); }
  function fallbackCopy(value) { var area = document.createElement("textarea"); area.value = value; area.setAttribute("readonly", ""); area.setAttribute("aria-hidden", "true"); area.style.position = "fixed"; area.style.left = "-9999px"; document.body.appendChild(area); area.select(); var copied = false; try { copied = document.execCommand("copy"); } catch (error) { copied = false; } area.remove(); return copied; }
  function copyValue(value, success, failure) { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(value).then(success).catch(function () { fallbackCopy(value) ? success() : failure(); }); } else { fallbackCopy(value) ? success() : failure(); } }
  function copyScript() { copyValue(scriptText(), function () { copyState.textContent = locale.copied; copyState.dataset.result = "success"; }, function () { copyState.textContent = locale.copyFailed; copyState.dataset.result = "error"; }); }
  if (copyButton && table && statePanel.hidden) { copyButton.addEventListener("click", copyScript); }
  var activePlatform = "YouTube Shorts";
  var publicationState = document.getElementById("publication-action-state");
  function localized(template, label) { return template.replace("{label}", label); }
  function platformGroup(platform) { return Array.prototype.find.call(document.querySelectorAll("[data-publication-platform]"), function (group) { return group.dataset.publicationPlatform === platform; }); }
  function publicationFields(platform) { var group = platformGroup(platform); return group ? Array.prototype.slice.call(group.querySelectorAll("[data-publication-field]")) : []; }
  function publicationPackage(platform) { return ["VISUAL DEMO FIXTURE", "Not published", "Platform: " + platform, ""].concat(publicationFields(platform).map(function (field) { return field.dataset.publicationField.replaceAll("-", " ").toUpperCase() + "\n" + field.textContent.trim(); })).join("\n\n"); }
  function announcePublication(message, kind) { publicationState.textContent = message; publicationState.dataset.result = kind; }
  function copyPublication(value, label) { copyValue(value, function () { announcePublication(localized(locale.publicationCopied, label), "success"); }, function () { announcePublication(locale.publicationCopyFailed, "error"); }); }
  function downloadPublication(platform) { var value = publicationPackage(platform); var blob = new Blob([value], { type: "text/plain;charset=utf-8" }); var url = URL.createObjectURL(blob); var link = document.createElement("a"); link.href = url; link.download = "ais-flows-" + platform.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-visual-demo.txt"; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); announcePublication(localized(locale.publicationDownloaded, platform), "success"); }
  function setPlatformFields(platform) { document.querySelectorAll("[data-publication-platform]").forEach(function (group) { group.hidden = group.dataset.publicationPlatform !== platform; }); }
  function setPlatform(platform) { activePlatform = platform; document.querySelectorAll("[data-platform-item]").forEach(function (item) { var active = item.dataset.platformItem === platform; item.classList.toggle("is-active", active); var tab = item.querySelector("[data-platform-tab]"); tab.setAttribute("aria-selected", String(active)); tab.tabIndex = active ? 0 : -1; }); setPlatformFields(platform); document.querySelectorAll("[data-active-platform]").forEach(function (node) { node.textContent = platform; }); announcePublication("", "idle"); }
  var platformTabs = Array.prototype.slice.call(document.querySelectorAll("[data-platform-tab]"));
  platformTabs.forEach(function (tab) { tab.addEventListener("click", function () { setPlatform(tab.dataset.platformTab); }); });
  document.querySelector(".platform-tabs").addEventListener("keydown", function (event) { if (!["ArrowLeft", "ArrowRight"].includes(event.key)) { return; } var index = platformTabs.indexOf(document.activeElement); if (index < 0) { return; } event.preventDefault(); var next = platformTabs[(index + (event.key === "ArrowRight" ? 1 : -1) + platformTabs.length) % platformTabs.length]; setPlatform(next.dataset.platformTab); next.focus(); });
  document.querySelectorAll("[data-copy-field]").forEach(function (button) { button.addEventListener("click", function () { var group = button.closest("[data-publication-platform]"); var field = group.querySelector("[data-publication-field='" + button.dataset.copyField + "']"); copyPublication(field.textContent.trim(), button.dataset.copyLabel); }); });
  document.querySelectorAll("[data-platform-copy]").forEach(function (button) { button.addEventListener("click", function () { copyPublication(publicationPackage(button.dataset.platformCopy), button.dataset.platformCopy + " package"); }); });
  document.querySelectorAll("[data-platform-download]").forEach(function (button) { button.addEventListener("click", function () { downloadPublication(button.dataset.platformDownload); }); });
  document.getElementById("copy-publication-pack").addEventListener("click", function () { copyPublication(publicationPackage(activePlatform), activePlatform + " package"); });
  document.getElementById("download-publication-pack").addEventListener("click", function () { downloadPublication(activePlatform); });
  setPlatform(activePlatform);
}());
