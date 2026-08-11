(function () {
  "use strict";

  var statePanel = document.getElementById("state-panel");
  var readySections = document.querySelectorAll(".render-ready");
  var stateKicker = document.getElementById("state-kicker");
  var stateTitle = document.getElementById("state-title");
  var stateCopy = document.getElementById("state-copy");
  var producerStatus = document.getElementById("producer-status");
  var producerStatusNote = document.getElementById("producer-status-note");
  var requestedState = new URLSearchParams(window.location.search).get("state");
  var stateMessages = {
    loading: ["LOADING", "Загружаем результат", "Проверяем доступность результата. Подождите немного."],
    empty: ["EMPTY", "В результате нет сценария", "Вернитесь в AI Publisher и создайте анализ с временной разметкой."],
    invalid: ["INVALID", "Результат не прошёл проверку", "Содержимое или файл результата нельзя безопасно показать или скачать."],
    error: ["ERROR", "Временная ошибка результата", "Повторите попытку позже или вернитесь в AIS FLOWS."],
    missing: ["MISSING", "Результат не найден", "Ссылка не ведёт к доступному результату. Вернитесь в AI Publisher и создайте новый результат."],
    expired: ["EXPIRED", "Срок результата закончился", "Этот результат больше не хранится. Вернитесь в AI Publisher и создайте новый результат."],
    deleted: ["DELETED", "Результат удалён", "Содержимое и файлы этого результата больше недоступны."],
    unsupported_schema: ["UNSUPPORTED_SCHEMA", "Версия результата не поддерживается", "AI Publisher должен подготовить результат в поддерживаемой версии схемы."]
  };
  var unavailableStates = Object.keys(stateMessages);
  var pageState = requestedState === "unsupported" ? "unsupported_schema" : requestedState;

  function setProducerStatus(status) {
    var isReady = status === "ready";
    producerStatus.textContent = isReady ? "READY" : "PARTIAL";
    producerStatus.className = "status-pill " + (isReady ? "status-ready" : "status-partial");
    producerStatusNote.textContent = isReady ? "Результат готов" : "Есть ограничения источника";
  }

  function showUnavailable(state) {
    var message = stateMessages[state];
    readySections.forEach(function (section) { section.hidden = true; });
    statePanel.hidden = false;
    stateKicker.textContent = "AI Publisher · " + message[0];
    stateTitle.textContent = message[1];
    stateCopy.textContent = message[2];
    document.body.dataset.pageState = state;
  }

  if (pageState && unavailableStates.indexOf(pageState) !== -1) {
    showUnavailable(pageState);
  } else {
    setProducerStatus(pageState === "ready" ? "ready" : "partial");
    document.body.dataset.pageState = pageState === "ready" ? "ready" : "partial";
  }

  var copyButton = document.getElementById("copy-script");
  var copyState = document.getElementById("copy-state");
  var table = document.getElementById("timescript");

  function cellValue(row, field) {
    var cell = row.querySelector("[data-field='" + field + "']");
    return cell ? cell.textContent.trim() : "—";
  }

  function scriptText() {
    return Array.prototype.map.call(table.tBodies[0].rows, function (row) {
      return [
        "Время: " + cellValue(row, "time"),
        "Что видно: " + cellValue(row, "visible"),
        "Текст в кадре: " + cellValue(row, "text"),
        "Речь / звук: " + cellValue(row, "sound"),
        "Заметка момента: " + cellValue(row, "note")
      ].join("\n");
    }).join("\n\n");
  }

  function announce(message, kind) {
    copyState.textContent = message;
    copyState.dataset.result = kind;
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.setAttribute("aria-hidden", "true");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    var copied = false;
    try { copied = document.execCommand("copy"); } catch (error) { copied = false; }
    area.remove();
    return copied;
  }

  function copyScript() {
    var text = scriptText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        announce("Сценарий скопирован.", "success");
      }).catch(function () {
        var fallbackSucceeded = fallbackCopy(text);
        announce(fallbackSucceeded ? "Сценарий скопирован." : "Не удалось скопировать. Повторите попытку.", fallbackSucceeded ? "success" : "error");
      });
    } else {
      var fallbackSucceeded = fallbackCopy(text);
      announce(fallbackSucceeded ? "Сценарий скопирован." : "Не удалось скопировать. Повторите попытку.", fallbackSucceeded ? "success" : "error");
    }
  }

  if (copyButton && table && statePanel.hidden) {
    copyButton.addEventListener("click", copyScript);
  }
}());
