(() => {
  const pageId = document.body.dataset.page;
  const assetBase = pageId === "static-lesson" ? "../" : "./";
  const progressKey = "ais_flows_course_progress_v1";
  const statusLabels = {
    draft: "В работе",
    published: "Опубликовано",
    preview_pending: "Материал готовится",
    not_public: "Не опубликовано",
  };
  const typeLabels = {
    understand: "Понять",
    do: "Сделать",
    verify: "Проверить",
    build: "Собрать",
  };

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const normalize = (value) => String(value || "")
    .toLocaleLowerCase("ru")
    .replaceAll("ё", "е")
    .trim();

  const readProgress = () => {
    try {
      const value = JSON.parse(localStorage.getItem(progressKey) || "[]");
      return new Set(Array.isArray(value) ? value.filter((item) => typeof item === "string") : []);
    } catch {
      return new Set();
    }
  };

  const writeProgress = (progress) => {
    try {
      localStorage.setItem(progressKey, JSON.stringify([...progress]));
    } catch {
      // The UI remains usable when storage is unavailable.
    }
  };

  let progress = readProgress();
  let content = null;
  let courseMap = null;

  const lessonById = (id) => content.lessons.find((lesson) => lesson.id === id);
  const blockById = (id) => content.blocks.find((block) => block.id === Number(id));
  const lessonHref = (lessonOrId) => {
    const lesson = typeof lessonOrId === "string" ? lessonById(lessonOrId) : lessonOrId;
    if (lesson?.visibility === "not_public") return null;
    return lesson?.human_lesson_url || `./lesson.html?id=${encodeURIComponent(lesson?.id || lessonOrId)}`;
  };

  const statusChip = (status) => `<span class="status-chip" data-status="${escapeHtml(status)}">${escapeHtml(statusLabels[status] || status)}</span>`;
  const typeChip = (type) => `<span class="type-chip">${escapeHtml(typeLabels[type] || type)}</span>`;

  const updateProgressUi = () => {
    if (!content) return;
    const validIds = new Set(content.lessons.map((lesson) => lesson.id));
    progress = new Set([...progress].filter((id) => validIds.has(id)));
    const count = progress.size;
    const total = content.lessons.length;
    const percent = total ? Math.round((count / total) * 100) : 0;
    document.querySelectorAll("[data-progress-summary]").forEach((node) => {
      node.textContent = `${count} из ${total} уроков пройдено`;
    });
    document.querySelectorAll("[data-progress-bar]").forEach((node) => {
      node.style.width = `${percent}%`;
    });
    document.querySelectorAll("[data-reset-progress]").forEach((button) => {
      button.disabled = count === 0;
    });
  };

  const bindProgressReset = () => {
    document.querySelectorAll("[data-reset-progress]").forEach((button) => {
      if (button.dataset.progressResetBound === "true") return;
      button.dataset.progressResetBound = "true";
      button.addEventListener("click", () => {
        if (!progress.size) return;
        if (!window.confirm("Сбросить отметки всех пройденных уроков в этом браузере?")) return;
        progress.clear();
        writeProgress(progress);
        if (pageId === "home") renderHomeBlocks();
        if (pageId === "catalog") renderCatalogResults();
        if (pageId === "lesson") renderLesson();
        updateProgressUi();
      });
    });
  };

  const renderSequence = () => {
    document.querySelectorAll("[data-sequence]").forEach((container) => {
      const compact = container.classList.contains("hero-route-list");
      container.innerHTML = courseMap.sequence.map((step) => compact
        ? `<div class="hero-route-step"><span>${String(step.order).padStart(2, "0")}</span><span>${escapeHtml(step.label_ru)}</span></div>`
        : `<a class="sequence-step" href="${escapeHtml(lessonHref(step.lesson_id))}"><b>${String(step.order).padStart(2, "0")}</b><span>${escapeHtml(step.label_ru)}</span></a>`
      ).join("");
    });
  };

  const renderHomeBlocks = () => {
    const grid = document.querySelector("[data-block-grid]");
    if (!grid) return;
    grid.innerHTML = content.blocks.map((block) => {
      const completed = block.lesson_ids.filter((id) => progress.has(id)).length;
      const firstLesson = block.lesson_ids.map(lessonById).find((lesson) => lessonHref(lesson));
      return `<article class="block-card">
        <span class="block-index">Блок ${String(block.id).padStart(2, "0")} · ${completed}/${block.lesson_ids.length}</span>
        <h3>${escapeHtml(block.title_ru)}</h3>
        <p>${escapeHtml(block.summary_ru)}</p>
        <div class="block-output"><span>Результат</span>${escapeHtml(block.result_ru)}</div>
        <div class="block-links">${firstLesson ? `<a href="${escapeHtml(lessonHref(firstLesson))}">Начать блок</a>` : '<span class="release-status">Материалы готовятся</span>'}<a href="./route.html?block=${block.id}">Зависимости</a></div>
      </article>`;
    }).join("");
  };

  const renderHome = () => {
    document.querySelector("[data-course-eyebrow]").textContent = content.course.eyebrow;
    document.querySelector("[data-course-promise]").textContent = content.course.promise;
    document.querySelector("[data-course-summary]").textContent = content.course.summary;
    document.querySelector("[data-course-status]").textContent = content.course.status_label;
    const firstLesson = document.querySelector("[data-first-lesson]");
    firstLesson.href = lessonHref(content.course.first_lesson_id);
    renderHomeBlocks();
  };

  let catalogState = { query: "", block: "all", type: "all" };

  const renderCatalogResults = () => {
    const results = document.querySelector("[data-catalog-results]");
    if (!results) return;
    const query = normalize(catalogState.query);
    const filtered = content.lessons.filter((lesson) => {
      const haystack = normalize([lesson.title_ru, lesson.summary_ru, ...lesson.keywords_ru].join(" "));
      return (!query || haystack.includes(query))
        && (catalogState.block === "all" || lesson.block === Number(catalogState.block))
        && (catalogState.type === "all" || lesson.type === catalogState.type);
    });
    document.querySelector("[data-catalog-count]").textContent = `${filtered.length} из ${content.lessons.length} уроков`;
    const empty = document.querySelector("[data-catalog-empty]");
    empty.hidden = filtered.length !== 0;
    results.hidden = filtered.length === 0;
    results.innerHTML = content.blocks.map((block) => {
      const lessons = filtered.filter((lesson) => lesson.block === block.id);
      if (!lessons.length) return "";
      return `<section class="catalog-block-group" aria-labelledby="catalog-block-${block.id}">
        <header class="catalog-block-header">
          <span class="catalog-block-number">${String(block.id).padStart(2, "0")}</span>
          <div><p>Блок ${block.id} из ${content.blocks.length}</p><h2 id="catalog-block-${block.id}">${escapeHtml(block.title_ru)}</h2></div>
          <span class="catalog-block-count">${lessons.length} ${lessons.length === 1 ? "урок" : "урока"}</span>
        </header>
        <div class="catalog-lesson-list">${lessons.map((lesson) => {
          const complete = progress.has(lesson.id);
          const href = lessonHref(lesson);
          const body = `<span class="catalog-lesson-number">${String(lesson.order).padStart(2, "0")}</span>
            <span class="catalog-lesson-copy"><span>Урок ${lesson.order} из ${content.lessons.length}</span><strong>${escapeHtml(lesson.title_ru)}</strong><small>${escapeHtml(lesson.summary_ru)}</small></span>
            <span class="catalog-lesson-action">${href ? (complete ? "Пройден" : "Открыть") : "Не опубликован"}${href ? '<b aria-hidden="true">→</b>' : ""}</span>`;
          return href ? `<a class="catalog-lesson-row${complete ? " is-complete" : ""}" href="${escapeHtml(href)}">
            ${body}
          </a>` : `<div class="catalog-lesson-row is-unavailable" aria-disabled="true">${body}</div>`;
        }).join("")}</div>
      </section>`;
    }).join("");
  };

  const clearCatalogFilters = () => {
    const search = document.querySelector("[data-catalog-search]");
    const block = document.querySelector("[data-block-filter]");
    const type = document.querySelector("[data-type-filter]");
    search.value = "";
    block.value = "all";
    type.value = "all";
    catalogState = { query: "", block: "all", type: "all" };
    renderCatalogResults();
    search.focus();
  };

  const renderCatalog = () => {
    const blockFilter = document.querySelector("[data-block-filter]");
    blockFilter.insertAdjacentHTML("beforeend", content.blocks.map((block) => `<option value="${block.id}">${block.id}. ${escapeHtml(block.title_ru)}</option>`).join(""));
    const search = document.querySelector("[data-catalog-search]");
    const typeFilter = document.querySelector("[data-type-filter]");
    search.addEventListener("input", () => { catalogState.query = search.value; renderCatalogResults(); });
    blockFilter.addEventListener("change", () => { catalogState.block = blockFilter.value; renderCatalogResults(); });
    typeFilter.addEventListener("change", () => { catalogState.type = typeFilter.value; renderCatalogResults(); });
    document.querySelector("[data-clear-filters]").addEventListener("click", clearCatalogFilters);
    document.querySelector("[data-empty-reset]").addEventListener("click", clearCatalogFilters);
    renderCatalogResults();
  };

  const routeDependencyLabel = (ids, emptyLabel) => ids.length
    ? ids.map((id) => `Блок ${id}`).join(", ")
    : emptyLabel;

  const renderRouteDetail = (blockId) => {
    const block = blockById(blockId) || content.blocks[0];
    document.querySelectorAll("[data-route-block]").forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.routeBlock) === block.id));
    });
    const detail = document.querySelector("[data-route-detail]");
    const firstLesson = block.lesson_ids.map(lessonById).find((lesson) => lessonHref(lesson));
    detail.innerHTML = `<header class="route-detail-header">
        <span class="route-detail-number">${String(block.id).padStart(2, "0")}</span>
        <div><p class="eyebrow">Блок ${block.id} из ${content.blocks.length}</p><h2>${escapeHtml(block.title_ru)}</h2><p>${escapeHtml(block.summary_ru)}</p></div>
      </header>
      ${firstLesson ? `<a class="button primary route-start" href="${escapeHtml(lessonHref(firstLesson))}">Начать этот блок</a>` : '<span class="release-status">Материалы блока готовятся</span>'}
      <div class="route-outcomes">
        <article><span>1</span><div><strong>Зачем это нужно</strong><p>${escapeHtml(block.understand_ru)}</p></div></article>
        <article><span>2</span><div><strong>Что вы сделаете</strong><p>${escapeHtml(block.do_ru)}</p></div></article>
        <article><span>3</span><div><strong>Что будет готово</strong><p>${escapeHtml(block.result_ru)}</p></div></article>
      </div>
      <div class="route-lesson-heading"><strong>Уроки блока</strong><span>${block.lesson_ids.length} по порядку</span></div>
      <div class="route-lessons">${block.lesson_ids.map((id) => {
        const lesson = lessonById(id);
        const href = lessonHref(lesson);
        return href ? `<a class="route-lesson-link" href="${escapeHtml(href)}"><span class="route-lesson-number">${String(lesson.order).padStart(2, "0")}</span><strong>${escapeHtml(lesson.title_ru)}</strong><span>Открыть →</span></a>` : `<div class="route-lesson-link is-unavailable" aria-disabled="true"><span class="route-lesson-number">${String(lesson.order).padStart(2, "0")}</span><strong>${escapeHtml(lesson.title_ru)}</strong><span>Не опубликован</span></div>`;
      }).join("")}</div>
      <p class="route-dependencies">Перед этим: ${escapeHtml(routeDependencyLabel(block.prerequisites, "можно начинать сразу"))}. Дальше: ${escapeHtml(routeDependencyLabel(block.unlocks, "курс завершён"))}.</p>`;
    history.replaceState(null, "", `${location.pathname}?block=${block.id}`);
  };

  const renderRoute = () => {
    const nav = document.querySelector("[data-route-blocks]");
    nav.innerHTML = content.blocks.map((block) => `<button class="route-block-button" type="button" data-route-block="${block.id}" aria-pressed="false"><span>${String(block.id).padStart(2, "0")}</span><span><small>Блок ${block.id} из ${content.blocks.length}</small><strong>${escapeHtml(block.title_ru)}</strong></span></button>`).join("");
    nav.querySelectorAll("[data-route-block]").forEach((button) => button.addEventListener("click", () => renderRouteDetail(button.dataset.routeBlock)));
    const requested = Number(new URLSearchParams(location.search).get("block"));
    renderRouteDetail(blockById(requested) ? requested : 1);
  };

  const listHtml = (items, ordered = false) => {
    const tag = ordered ? "ol" : "ul";
    return `<${tag}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
  };

  const updateLessonButton = (lesson) => {
    const button = document.querySelector("[data-complete-lesson]");
    if (!button) return;
    const complete = progress.has(lesson.id);
    button.setAttribute("aria-pressed", String(complete));
    button.textContent = complete ? "Урок отмечен как пройденный" : "Отметить как пройденный";
  };

  const renderLesson = () => {
    const root = document.querySelector("[data-lesson-root]");
    const requestedId = new URLSearchParams(location.search).get("id") || content.course.first_lesson_id;
    const lesson = lessonById(requestedId);
    if (!lesson || lesson.visibility === "not_public") {
      root.innerHTML = `<div class="error-state"><div class="error-panel"><h1>${lesson ? "Урок пока не опубликован" : "Такого урока нет в текущем каталоге"}</h1><p>Откройте каталог: там отображаются только доступные маршруты и честные статусы.</p><a class="button primary" href="./catalog.html">Открыть каталог</a></div></div>`;
      document.title = `${lesson ? "Урок не опубликован" : "Урок не найден"} · AIS FLOWS`;
      return;
    }
    const block = blockById(lesson.block);
    const ordered = [...content.lessons].filter((item) => item.visibility !== "not_public").sort((a, b) => a.order - b.order);
    const index = ordered.findIndex((item) => item.id === lesson.id);
    const previous = index > 0 ? ordered[index - 1] : null;
    const next = index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null;
    const prereqTitles = lesson.prerequisites.map((id) => lessonById(id)?.title_ru).filter(Boolean);
    const artifact = lesson.artifact;
    const artifactHtml = artifact.url
      ? `<a class="button" href="${escapeHtml(artifact.url)}">Открыть материал</a>`
      : `<span class="status-chip" data-status="${escapeHtml(artifact.status)}">${escapeHtml(statusLabels[artifact.status])}</span>`;
    root.innerHTML = `<nav class="lesson-breadcrumbs" aria-label="Хлебные крошки"><a href="./index.html">Курс</a><span>/</span><a href="./route.html?block=${block.id}">Блок ${block.id}</a><span>/</span><span>${escapeHtml(lesson.title_ru)}</span></nav>
      <header class="lesson-header"><div class="lesson-position"><span>Блок ${block.id} из ${content.blocks.length}</span><b>Урок ${lesson.order} из ${content.lessons.length}</b>${progress.has(lesson.id) ? '<span class="complete-chip">Пройден</span>' : ""}</div><h1>${escapeHtml(lesson.title_ru)}</h1><p class="lesson-summary">${escapeHtml(lesson.summary_ru)}</p></header>
      <div class="lesson-layout">
        <div class="lesson-flow">
          <section class="lesson-step" data-step="1"><p class="eyebrow">Сначала</p><h2>Разберитесь, зачем это нужно</h2><p>${escapeHtml(lesson.why_ru)}</p>${listHtml(lesson.understand_ru)}</section>
          <section class="lesson-step" data-step="2"><p class="eyebrow">Затем</p><h2>Сделайте по порядку</h2>${listHtml(lesson.do_steps_ru, true)}</section>
          <section class="lesson-step" data-step="3"><p class="eyebrow">Перед продолжением</p><h2>Проверьте результат</h2>${listHtml(lesson.check_ru)}</section>
          <section class="lesson-step" data-step="4"><p class="eyebrow">Итог урока</p><h2>Сохраните готовый результат</h2><div class="result-box"><strong>${escapeHtml(lesson.result_ru)}</strong></div><div class="artifact-state"><div><strong>${escapeHtml(artifact.label_ru)}</strong><p>${artifact.url ? "Материал можно открыть по ссылке." : "Ссылка появится после подготовки материала."}</p></div>${artifactHtml}</div></section>
          <section class="lesson-step" data-step="5"><p class="eyebrow">Следующий шаг</p><h2>${next ? escapeHtml(next.title_ru) : "Курс завершён"}</h2><p>${next ? "Откройте следующий урок и продолжайте по порядку." : "Все уроки пройдены. Сохраните результат и повторите маршрут на новом проекте."}</p>${next ? `<a class="button primary" href="${escapeHtml(lessonHref(next))}">Перейти к следующему уроку</a>` : '<a class="button primary" href="./route.html">Вернуться к маршруту</a>'}</section>
          <nav class="lesson-navigation" aria-label="Переходы между уроками">${previous ? `<a class="lesson-nav-link" href="${escapeHtml(lessonHref(previous))}"><span>Назад</span><strong>${escapeHtml(previous.title_ru)}</strong></a>` : '<a class="lesson-nav-link" href="./catalog.html"><span>Назад</span><strong>Каталог курса</strong></a>'}${next ? `<a class="lesson-nav-link next" href="${escapeHtml(lessonHref(next))}"><span>Дальше</span><strong>${escapeHtml(next.title_ru)}</strong></a>` : '<a class="lesson-nav-link next" href="./route.html"><span>Дальше</span><strong>Карта курса</strong></a>'}</nav>
        </div>
        <aside class="lesson-aside"><h2>Перед началом</h2><dl><div><dt>Раздел курса</dt><dd>${block.id}. ${escapeHtml(block.title_ru)}</dd></div><div><dt>Что понадобится</dt><dd>${escapeHtml(lesson.inputs_ru.join(" · "))}</dd></div><div><dt>Что пройти раньше</dt><dd>${prereqTitles.length ? escapeHtml(prereqTitles.join(" · ")) : "Ничего. Можно начинать."}</dd></div></dl><button class="button complete-button" type="button" data-complete-lesson aria-pressed="false"></button><button class="text-button" type="button" data-reset-progress>Сбросить весь прогресс</button></aside>
      </div>`;
    document.title = `${lesson.title_ru} · AIS FLOWS`;
    updateLessonButton(lesson);
    root.querySelector("[data-complete-lesson]").addEventListener("click", () => {
      if (progress.has(lesson.id)) progress.delete(lesson.id);
      else progress.add(lesson.id);
      writeProgress(progress);
      renderLesson();
      updateProgressUi();
      bindProgressReset();
    });
    bindProgressReset();
  };

  const renderGlossaryList = (query = "") => {
    const list = document.querySelector("[data-glossary-list]");
    const needle = normalize(query);
    const terms = content.glossary.filter((item) => !needle || normalize([item.term_ru, item.common_ru, item.ais_ru].join(" ")).includes(needle));
    list.innerHTML = terms.length ? terms.map((item) => `<article class="glossary-item"><h2>${escapeHtml(item.term_ru)}</h2><p><strong>Обычно</strong>${escapeHtml(item.common_ru)}</p><p><strong>В AIS FLOWS</strong>${escapeHtml(item.ais_ru)}</p><a href="${escapeHtml(lessonHref(item.lesson_id))}">Первый урок по теме</a></article>`).join("") : '<div class="empty-state"><h2>Термин не найден</h2><p>Попробуйте более короткое слово. Полный словарь остаётся доступен после очистки поиска.</p></div>';
  };

  const renderGlossary = () => {
    const search = document.querySelector("[data-glossary-search]");
    search.addEventListener("input", () => renderGlossaryList(search.value));
    renderGlossaryList();
  };

  const renderStaticLesson = () => {
    const lessonId = document.body.dataset.lessonId;
    const button = document.querySelector("[data-static-complete]");
    if (!button || !lessonById(lessonId)) return;
    const update = () => {
      const complete = progress.has(lessonId);
      button.setAttribute("aria-pressed", String(complete));
      button.textContent = complete ? "Урок отмечен как пройденный" : "Отметить как пройденный";
    };
    button.addEventListener("click", () => {
      if (progress.has(lessonId)) progress.delete(lessonId);
      else progress.add(lessonId);
      writeProgress(progress);
      update();
    });
    update();
  };

  const showLoadError = () => {
    const main = document.querySelector("main");
    main.innerHTML = `<div class="error-state"><div class="error-panel"><h1>Данные курса не загрузились</h1><p>Откройте раздел через локальный HTTP preview. Страницы курса читают единый JSON-каталог и не дублируют содержание внутри HTML.</p><a class="button" href="./course-content.json">Проверить JSON</a></div></div>`;
  };

  const start = async () => {
    try {
      const [contentResponse, mapResponse] = await Promise.all([fetch(`${assetBase}course-content.json`), fetch(`${assetBase}course-map.json`)]);
      if (!contentResponse.ok || !mapResponse.ok) throw new Error("Course data request failed");
      [content, courseMap] = await Promise.all([contentResponse.json(), mapResponse.json()]);
      renderSequence();
      if (pageId === "home") renderHome();
      if (pageId === "catalog") renderCatalog();
      if (pageId === "route") renderRoute();
      if (pageId === "lesson") renderLesson();
      if (pageId === "glossary") renderGlossary();
      if (pageId === "static-lesson") renderStaticLesson();
      updateProgressUi();
      bindProgressReset();
    } catch (error) {
      console.error("AIS FLOWS course load error", error);
      showLoadError();
    }
  };

  start();
})();
