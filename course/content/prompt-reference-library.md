# 13. Библиотека Примеров Промптов

Статус: черновик приложения к курсу.

Эта глава нужна, чтобы курс не висел в воздухе.

До этого мы много говорили: подготовьте сцену, соберите референсы, не пишите один огромный промпт. Всё правильно. Но человеку всё равно нужен момент: **"покажите уже нормальный пример"**.

Вот здесь и лежат примеры.

Это не папка "копируй и вставляй". Это витрина: смотрим пример, разбираем, почему он работает, забираем принцип и не копируем чужой ролик.


## 13.1. Что Уже Есть В Библиотеке

| Тип примера | Где лежит | Для чего |
| --- | --- | --- |
| Промпт для стартового изображения | `05_IMAGE_AND_VIDEO_PROMPTS.md` | Понять, как описывать один кадр |
| Промпт для видео | `05_IMAGE_AND_VIDEO_PROMPTS.md` | Понять, как описывать изменение во времени |
| Большой Seedance-промпт для действия | ниже в этой главе | Разобрать сложный промпт с локацией, персонажем, таймингом и звуком |
| Промпт карты персонажа | ниже в этой главе | Подготовить персонажа в нескольких ракурсах |
| Обходы ошибки `Face detected` | ниже в этой главе | Понять обходы, когда модель не принимает лицо |
| Универсальный промпт улучшения | `05`, `10`, `AIS_FLOWS_GENERATION_GUIDE/02_PROMPT_RULES.md` | Улучшать удачный кадр без перерисовки |
| Адаптер промпта под Seedance | `AIS_FLOWS_GENERATION_GUIDE/13_PROMPT_REFERENCE_LIBRARY.md` | Переписывать чужой промпт под свои референсы |
| Большой Seedance-гайд | ниже в этой главе | Понять роли `@`-референсов, камеру, физику, звук, тайминг и итерации |
| Карточка правил Seedance | ниже в этой главе | Получить конкретные правила длины, камеры, видео из изображения, правки существующего видео, диалога, референсов и фиксов |
| Owner Instagram / SeaArt prompt cards | `AIS_FLOWS_GENERATION_GUIDE/_source_intake/video_prompt_reference_research_2026-06-28/prompt_card_database_2026-06-28/prompt_cards_owner_instagram_seaart_2026-07-01.md` | Разобрать свежие примеры: action, kitchen fight, pizza ad, sports broadcast; понять роли референсов, variable timing, hero takes, movement reference и negative prompt |
| Промпт улучшения изображения | ниже в этой главе | Не сводить upscale к одному промпту: люди, предметка, кожа, реставрация, 2D->3D |
| Работа с прикреплёнными материалами | по ходу курса | Не терять полезное из картинок, документов, превью и UI-скриншотов |
| Словарь ракурсов и движений камеры | `AIS_FLOWS_GENERATION_GUIDE/19_CAMERA_ANGLES_AND_MOVEMENTS_REFERENCE.md` | Выбрать крупность, угол и движение камеры по смыслу кадра |
| Архив prompt references и route taxonomy | `AIS_FLOWS_GENERATION_GUIDE/00_PROMPT_REFERENCE_ARCHIVE_MAP.md` | Понять, где лежат Seedance/Kling/Veo/Gemini Omni референсы, как они делятся по route и почему их нельзя сваливать в одну кучу |

Эта глава даёт читателю рабочую витрину и объяснение механики. Полные длинные готовые промпты не превращаем в public-ready рецепт: сначала разбираем, что в них работает, потом адаптируем под свою сцену.

Важное правило формы: когда результат нужен для генерации, пример должен в итоге превращаться в `Prompt to paste` / цельный prompt body. Таблицы, роли, статус источника, acceptance check и reject-if помогают понять prompt, но не должны становиться главным видимым ответом, если человек просит готовый prompt для модели.

Рабочая внешняя форма:

```text
Выдано: [image prompt to paste / video prompt to paste / controlled segment prompt / storyboard prompt].

Prompt to paste:
[чистый текст для генератора]

Settings / inputs:
[модель, режим, длительность/формат, референсы и роли, start/final frame, audio/SFX]

Negative constraints:
[только полезные ограничения]

Validation / likely failure:
[проверка снаружи prompt body]

Source status:
[known / draft / not proven]
```

Если для готовности не хватает референса, тайминга, роли, audio/SFX или финального кадра, это `DRAFT PROMPT SKELETON - not ready for generation`. Если пример затрагивает известных актёров, публичных людей, узнаваемые франшизы, official costumes или copied scene composition, positive prompt переписывается в сторону original fictional unknown performers and concrete archetypes; negative `do not copy IP` alone is not enough.

## 13.1A. Как Читать Архив Референсов Промптов

У нас появляется не одна "папка промптов", а архив с разметкой.

Почему так: короткий prompt для оживления одного изображения, большой multi-shot prompt, storyboard prompt, prompt для правки готового видео и prompt для движения по нарисованному пути - это разные задачи. Если смешать их в одну кучу, агент начнёт писать красиво, но не туда.

В guide это разнесено через:

```text
AIS_FLOWS_GENERATION_GUIDE/00_PROMPT_REFERENCE_ARCHIVE_MAP.md
AIS_FLOWS_GENERATION_GUIDE/_source_intake/video_prompt_reference_research_2026-06-28/16_MODEL_PROMPT_TAXONOMY_AND_ROUTING_2026-06-28.md
AIS_FLOWS_GENERATION_GUIDE/_source_intake/video_prompt_reference_research_2026-06-28/17_PROMPT_ARCHIVE_SOURCE_EXPANSION_2026-06-28.md
```

Человеческий способ читать такой архив:

```text
1. Сначала понять модель или семейство моделей: Seedance, Kling, Veo, Gemini Omni.
2. Затем понять режим: text-to-video, image-to-video, first/last frame, storyboard, multi-reference, edit, audio/dialogue.
3. Затем понять сложность: один шот, несколько шотов, длинный сегмент, много референсов, звук, монтаж.
4. Потом смотреть prompt reference как пример языка и структуры.
5. В свою работу переносить механику, а не чужой ролик.
```

📌 **Вывод:** референс нужен не для того, чтобы копировать чужую сцену. Он нужен, чтобы понять, на каком языке модель уже научились просить: как задают роли изображений, как пишут shot blocks, как держат персонажа, свет, камеру, звук и ограничения.

## 13.2. Пример Для Изображения

Задача: получить один кадр.

```text
Главный объект: люксовый стеклянный флакон духов на чёрной глянцевой поверхности.
Состояние: флакон стоит вертикально, чистый силуэт, без лишних предметов.
Композиция: вид сверху под небольшим углом, флакон в центре нижней трети кадра.
Освещение: холодная мягкая подсветка, тонкие отражения по граням стекла.
Материалы: прозрачное стекло, тёмная среда, чистое отражение.
Что сохранить: форма флакона, чистое место для будущего титра или этикетки.
Что не добавлять: случайный текст, лишние бутылки, яркие цвета.
```

Generator-facing версия этого же примера:

```text
Prompt to paste:
A luxury glass perfume bottle standing upright on shallow glossy black water, clean silhouette, slightly elevated top-front view, centered in the lower third of the frame. Cold soft side light creates thin reflections along the glass edges, transparent glass and dark liquid are readable, minimal black background, clean empty space for a future title or label. Photoreal live-action product still, sharp stop-frame clarity, no extra bottles, no random text, no bright colors, no synthetic CGI render look.
```

Почему работает:

- мы не просим видео;
- не пишем длительность;
- не заставляем камеру летать;
- понятно, что должно быть видно;
- понятно, что нельзя добавлять.

📌 **Вывод:** промпт изображения отвечает на вопрос "что видно в одном кадре?".

## 13.3. Пример Для Видео

Задача: оживить кадр.

```text
Управляемый отрезок: капля падает в локацию рядом с флаконом.
Начало: флакон стоит на чёрной глянцевой поверхности, вода спокойная.
Главное действие: одна капля падает сверху, по поверхности расходятся мягкие круги.
Камера: стабильная, лёгкое приближение.
Что сохраняется: форма флакона, тёмная среда, холодная мягкая подсветка, чистый фон без лишних предметов.
Финальное состояние: круги на воде становятся читаемым пространством для логотипа.
Риски: не ломать флакон, не добавлять лишний текст, не делать кислотную подсветку.
```

Generator-facing версия:

```text
Prompt to paste:
Preserve the exact perfume bottle silhouette, dark glossy water, cold soft side light, and clean black background from the starting frame. One single water drop falls beside the bottle, creating slow circular ripples across the water. Camera stays stable with a subtle push-in from the same front angle. Keep the bottle upright and unchanged, reflections clean, no random text, no extra bottles, no acid-colored light, stable readable final frame.
```

Почему работает:

- есть начало;
- есть одно главное действие;
- есть камера;
- есть финал;
- есть список того, что нельзя ломать.

📌 **Вывод:** промпт видео отвечает на вопрос "что меняется, пока зритель смотрит?".

## 13.4. Большой Seedance-Промпт: Как Его Читать

Он устроен так:

```text
@Image1 = локация
@Image2 = персонаж

[0s-3s] действие
[3s-6s] действие
[6s-10s] действие

Global = общие правила, которые держат весь ролик
Audio = звук
```

Почему это хороший пример:

- локация и персонаж не смешаны в кашу;
- движение разбито по времени;
- камера не меняет характер каждые две секунды;
- физика описана конкретно: падение, инерция ткани, волосы, удар, пыль;
- звук не оставлен на "ну сделай как-нибудь".

Что брать:

```text
структуру
разделение референсов
тайминг-блоки
global constraints
audio layer
```

Что не брать:

```text
чужую локацию
чужого персонажа
чужую одежду
чужой сюжет
```

Короткий пример, чтобы было понятно, как устроен приём:

```text
@Image1 = референс локации
@Image2 = референс персонажа

[0s-3s] handheld vertical opening action
[3s-6s] continuous chase / descent
[6s-10s] next physical movement block

Общее правило: один непрерывный дубль, персонаж из `@Image2` сохраняет внешность, локация из `@Image1` сохраняется, физика реалистичная.
Аудио: шаги, ветер, удары, дыхание, ткань, гравий; без музыки, без диалога.
```

Почему это не просто "длинный промпт": в нём каждый слой делает работу. `@Image1` держит место, `@Image2` держит персонажа, тайминг-блоки держат движение, общее правило не даёт сцене развалиться, а аудио задаёт звук без случайной музыки.

⏸ **Пауза:** хороший чужой промпт - это не рецепт чужого ролика. Это рентген: смотрим, как устроен скелет.

## 13.4A. Viral Seedance-Примеры: Что В Них Полезного

В viral Seedance-примерах полезно смотреть не на чужой мир, а на устройство промпта.

В этом типе примеров обычно важно смотреть на такие слои:

Что там есть:

- инструкция: сделать персонажа в 4 ракурсах, дать карточку правил агенту, переписать промпт под своё фото, в Dreamina сначала загрузить локацию, потом персонажа, затем промпт;
- несколько больших Seedance-промптов с видео и файлами;
- повторяющаяся схема: `@Image` для референсов, один персонаж, тайминг-блоки, физика движения, единая камера, звук.

Человеческий вывод простой: сильный prompt здесь работает не потому, что он длинный. Он работает потому, что у него есть роли.

```text
@Image1 / @Image2 = кто за что отвечает
[0s-3s] / [3s-6s] = что происходит по времени
Global = что держится весь ролик
Audio = что слышно
```

Что брать:

```text
структуру референсов
тайминг-блоки
same-character lock
single-take continuity
физику движения
слой звука
```

Что не брать буквально:

```text
Counter-Strike
Harry Potter
Dark Souls
Lord of the Rings
чужой внешний вид персонажа
чужие локации и fandom-детали
```

📌 **Вывод:** берём механику промпта, а чужие IP-миры, персонажей и локации переписываем в собственные безопасные сцены.

## 13.4B. Большой Seedance-Гайд: Что В Нём Полезного

Большой Seedance-гайд полезен не как ссылка сама по себе, а как пример layered-подхода.

Что оттуда брать:

- режимы работы: несколько референсов с ролями, первый и последний кадр, несколько ключевых кадров;
- порядок промпта: кто/что, действие, камера, сцена/свет, стиль, ограничения;
- роли `@Image`, `@Video`, `@Audio`;
- конкретную камеру и физику вместо “сделай кинематографично”;
- звук как отдельный слой;
- extension-логику: продолжать то, что происходит дальше;
- правило итераций: менять одну переменную за раз.

Что не брать:

- советы по обходу фильтров;
- чужие IP-миры и fandom-сцены;
- чужие лица, костюмы и персонажей.

📌 **Вывод:** это не “ещё один документ”. Это пример того, как собирать Seedance-подобный промпт слоями.

## 13.4C. Карточка Правил Seedance: Что В Ней Полезно

Короткая карточка правил полезна как быстрый список ограничений модели.

Главные правила:

- сначала определить режим: видео из текста, видео из изображения, несколько референсов с ролями, первый и последний кадр, несколько ключевых кадров или правка существующего видео;
- строить промпт в понятном порядке: главный объект / герой, действие, сцена и свет, камера, вид кадра, ограничения;
- важное ставить в первые 2-3 инструкции;
- для одного ролика из текста держаться примерно 60-120 слов;
- для видео из изображения писать только движение, камеру, свет и что сохранить;
- на один шот давать одно главное действие и одно движение камеры;
- свет описывать всегда;
- `@Image`, `@Video`, `@Audio` давать с ролями;
- для лица начинать с одного сильного hero-кадра;
- реплики делать короткими, а говорящего держать в стабильном кадре;
- для правки существующего видео явно писать, что менять и что не трогать.

Что не берём:

- совет по обходу фильтров переводом промпта;
- любые точные сцены, если они завязаны на чужой IP или чужую идентичность.

📌 **Вывод:** карточка правил нужна не для коллекции ссылок, а для workflow, диагностики ошибок и шаблонов.

## 13.4D. Owner Instagram / SeaArt Примеры: Что Мы Из Них Взяли

Новые Instagram/SeaArt/Seedance-примеры сохраняем не как готовые рецепты, а как живые reference cards.

Где лежит разбор:

```text
AIS_FLOWS_GENERATION_GUIDE/_source_intake/video_prompt_reference_research_2026-06-28/prompt_card_database_2026-06-28/prompt_cards_owner_instagram_seaart_2026-07-01.md
```

Что там было:

- fight with monster - большой action prompt на 15 секунд;
- kitchen fight - видео с embedded prompt внутри ролика;
- pizza ad - prompt-only источник для еды/рекламы;
- World Cup / SeaArt scissor kick - prompt PDF совпал с видео и показал sports broadcast логику.

Что повторилось в сильных примерах:

```text
референсы назначены ролями до действия;
тайминг не всегда ровный: 2.0s, 2.5s, 3.0s и другие длительности;
сложное движение лучше держится, когда есть отдельный movement reference;
food/product ad строится через hero takes: bite, prep, bake, final pull;
negative prompt полезен, когда называет конкретные ожидаемые ошибки;
audio/commentary можно писать в блоках, но без runtime-проверки это source claim.
```

Что показали слабые места:

- prompt может хорошо держать общий сюжет, но терять точную микрографию драки;
- "one-take" в тексте не гарантирует настоящий one-take;
- камера может уйти в hero close-up, даже если в prompt написан broadcast camera;
- комментарии, SFX и озвучка не считаются доказанными, пока не проверены в результате;
- public figures, official kits, IP-миры и чужие кампании нельзя превращать в public recipe без safe rewrite.

Как это переводится в AIS FLOWS:

```text
Full Timed Script = что зритель видит по времени.
Camera Timing Map = как камера ведёт зрителя.
Visual Reference Map / Identity Board = реальная карта/board, где видно, какие визуальные источники что фиксируют.
Controlled Segment = как это собрать в prompt для модели.
Prompt to paste = отдельный копируемый английский текст для генератора.
```

📌 **Вывод:** наша структура не слабее этих примеров. Она строже. Но эти примеры усилили model-facing язык: role-lines, variable timing, movement reference, hero takes и failure-specific negative prompts.

## 13.4E. Как Помощник Должен Объяснять Controlled Segment Человеку

Когда человек проверяет сегменты, ему не нужна сухая таблица, которую можно вставить в модель. Ему сначала нужно понять: почему этот кусок выделен, какие референсы нужны, что камера делает, что может сломаться.

Поэтому ответ делится на две части:

```text
1. Карточка сегмента - человеческое объяснение на языке пользователя.
2. Prompt to paste - отдельный copyable prompt body для генератора, по умолчанию на английском.
```

Правильная карточка сегмента:

```text
Сегмент:
Статус:
Режим:
Тип сегмента: одношотный / мультишотный.
Почему так:
Тайминг и покрытые строки:
Внутренние короткие отрезки для ремонта, если сегмент мультишотный:
Что происходит:
Камера:
Стартовый кадр:
Финальный кадр:
Входные референс-материалы / прикрепляемые материалы:
- @Image1 = [точный тип: single input reference image / Visual Reference Map / Identity Board / start frame] - [что именно фиксирует]
- @Image2 = [точный тип] - [что именно фиксирует]
Сохранять:
Ограничения для видеопромпта / причина:
Ожидаемый сбой:
Политика звука:
- Музыка:
- SFX:
- Речь / диалог:

Prompt to paste:
[English generator-facing prompt body]
```

Что важно объяснять человеку:

- почему это один segment, а не два;
- почему режим именно image-to-video, multi-reference, first/last frame или другой;
- нужен ли start frame;
- является ли final frame обязательным, опциональным или только target state;
- какой входной референс-материал за что отвечает и является ли он одиночным кадром, картой/board или другим материалом;
- почему есть avoid rule.

Неправильно:

```text
Плохой ярлык: просто "refs" вместо точного типа материала.
Плохой ярлык: общее сокращение для всех входных материалов вместо отдельных строк ролей входных референс-материалов.
@Image1 = объект / непонятно: одиночный кадр, Reference Map или другой input.
Камера: красиво.
Плохая строка: `same object / тот же объект` без точного входного референс-материала.
```

Правильно:

```text
Входные референс-материалы / прикрепляемые материалы:
- @Image1 = single input reference image: primary subject identity anchor - fixes silhouette, proportions, material and key details.
- @Image2 = single input reference image: environment anchor - fixes location, background/surface, horizon/space and scale.
- @Image3 = single input reference image: lighting/style anchor - fixes light direction, color mood and atmosphere without reducing @Image1 readability.

Важно: эти `@Image1`, `@Image2`, `@Image3` сначала являются role-lines для человека. Они попадают внутрь `Prompt to paste` только если целевой генератор реально видит такие handles. Если человек вручную загружает изображения без prompt-addressable names, copyable prompt должен писать `the attached primary subject identity reference`, `the attached environment reference`, `the attached lighting/style reference`, а точный mapping остаётся над prompt.

То же правило для формата: если aspect ratio, качество, fps, resolution и длительность выбираются в интерфейсе, не вставляйте их внутрь copyable `Prompt to paste`. Референс может содержать такие слова, но AIS FLOWS выносит UI-настройки в Settings / checklist, а prompt body оставляет под сцену, действие, камеру, continuity и ограничения.

Если в референсе есть дробные интервалы вроде 1.5s, 2.5s, 0.8s или 3.75s, это не доказывает, что выбранный генератор умеет создать клип ровно такой длительности. Это может быть язык хореографии, slow motion, музыки, монтажа или внутреннего shot timing. В AIS FLOWS разделяйте `исходный тайминг`, `длительность генерации в интерфейсе` и `цель монтажа / что обрезать`: если UI даёт только целые/preset-длительности, выбирайте поддерживаемую длительность в Settings / checklist, а итог режьте, удерживайте хвостом или перегруппировывайте в монтаже.

Дополнительная проверка содержания: не сокращайте кадр до 2–3 секунд только потому, что ролик короткий. Полная реплика, дыхание, пауза, эмоциональная реакция и развивающееся действие имеют собственную длительность; непрерывному движению камеры или физическому процессу нужно время на начало, развитие и финальное состояние. Сначала выберите длительность по содержанию, затем сопоставьте её с доступным значением интерфейса и монтажной целью.

Сохранять:
- primary subject from @Image1;
- читаемый силуэт корпуса;
- направление света из @Image3.

Ограничения для видеопромпта / причина:
- тяжёлой окклюзии/перекрытия, потому что в этом сегменте @Image1 является входным identity-bearing референс-материалом и должен читаться.

Важно: это ограничение относится к видеопромпту только если текущий видеобит действительно должен сохранять читаемость объекта. Если похожий запрет был нужен только для чистого референс-изображения / start frame / Reference Map, не переносите его в video `Prompt to paste`: видеопромпт следует принятому сценарию, камере и сценическому решению.

Если сегмент состоит из нескольких внутренних shorts, prompt body не должен быть короткой выжимкой. Он должен содержать timed/numbered shot blocks, camera/framing, continuity locks, audio/edit policy и ограничения. Иначе это не полноценный controlled segment prompt, а недокомпилированный summary.
```

📌 **Вывод:** человек должен видеть логику сегмента, а генератор должен получать отдельный чистый prompt. Карточка помогает человеку принять решение. `Prompt to paste` помогает модели сгенерировать видео.

Для video prompt в этой карточке обязательно отделяйте музыку от остального звука. `No music` означает: без score / soundtrack / background music / музыкальной подкладки. Это не значит `no sound`: SFX, ambience, foley, речь, lip sync, ветер, волны, шаги, дыхание и удары могут оставаться, если они нужны по маршруту. Если у проекта уже есть music prompt, готовый трек или музыка будет наложена в монтаже, video prompt по умолчанию не просит генератор делать музыку.

Если сегмент длинный и внутри него несколько маленьких действий, карточка также должна дать адреса для ремонта: `S6-A`, `S6-B`, `S6-C`. Это нужно не для красоты, а для работы после генерации. Если `S6-B` получился плохо, помощник сначала выбирает маршрут: переписать родительский сегмент или заменить только `S6-B`. Для локальной замены он выдаёт не один общий repair prompt, а `Local Replacement Short Package`: image / start-frame prompt для нового кадра `S6-B` и video prompt для оживления этого кадра, сохранив родительские референсы, свет, персонажей, continuity и монтажные границы.

## 13.5. Промпт Карты Персонажа

Если персонаж должен повторяться, иногда нужен лист ракурсов. Ниже пример английского промпта: его можно давать модели как техническую команду, а в курсе рядом объяснять по-русски, что он делает.

Статус старого примера: source/test-only. Для photoreal/live-action персонажа сначала нужен один принятый full-body anchor в том же фотографическом стиле, но это ещё не вся reference map. После anchor нужна карта: identity, body/silhouette, hair/implants, outfit/materials, prompts for details, extra views, preserve/avoid, validation.

Photoreal-safe anchor prompt:

```text
Use the uploaded portrait as the strict identity, face, hair, skin response, outfit material, implant, and lighting reference. Extend the same person into one full-body live-action cinematic portrait first. Preserve the exact face, expression, hairstyle, real skin texture, real costume materials, natural fabric folds, and original cinematic lighting. Full body visible, natural standing pose, photographic realism. No character sheet, no turnaround, no 3D render, no CGI doll, no plastic skin, no gray studio model sheet.
```

Reference-map output structure:

```text
Observed identity facts:
Owner decisions / inferred full-body facts:
Reference roles:
Anchor full-body prompt:
Face / implant detail prompt:
Outfit / material detail prompt:
Side/back prompts after anchor acceptance:
Must preserve:
Must avoid:
Validation:
```

Если карта генерируется как одно 16:9 изображение-лист, количество панелей - production parameter, а не вечное число. Если owner не указал плотность, сначала спросить или предложить: compact 4-6 panels, standard 8-10 panels, expanded 12-15 panels. В ответе обязательно назвать выбранную плотность и зачем она выбрана.

Source/test-only версия:

```text
Use the uploaded image as the main identity reference for the person.
Create a clean multi-angle character reference sheet on a neutral light gray studio background.
Show the same person from the front, left profile, right profile, 3/4 angle, slight downward head tilt, slight forward lean, clean front portrait, and medium shot.
Maintain the same face, proportions, skin tone, hairstyle, clothing, and expression across all frames.
No text, no UI, no borders, no additional objects.
```

Если модель начинает менять лицо:

```text
identity lock, same person across all frames, no variation, no reinterpretation, exact facial consistency
```

Когда применять:

- человек важен;
- лицо должно повторяться;
- будет несколько сцен;
- модель уже меняла внешность между кадрами.

Когда не применять:

- логотип;
- предметный reveal;
- вода, дым, абстрактная сцена;
- ролик без повторяющегося персонажа.

## 13.6. Обходы Face Detected И Source Prep

Это не гарантия и не способ спорить с правилами платформы. Это примеры подготовки входной картинки, когда модель не принимает лицо или начинает его ломать.

Простой обход:

```text
Move the camera 5 meters away from the model.
```

Смысл: не заставлять видео-модель сразу работать с крупным лицом, если именно лицо вызывает отказ или искажение.

Второй вариант промпта:

```text
Generate this character from the front, back, left side, and right side, all on a white background. Preserve the face as accurately as possible, without distortion.
```

Ещё два визуальных обхода:

- наложить пейзаж на фото с прозрачностью 50-60%;
- наложить сетку на фото.

Что копировать как механизм:

```text
не спорить с rejected face напрямую
сначала сделать более безопасный reference
проверить один чистый кадр
потом добавлять ракурсы только если нужно
```

Что не копировать буквально:

```text
не использовать чужие лица без прав
не считать обход вечным правилом
не тащить сразу десять референсов лица в первую генерацию
```

Важная связка с главой `04`: подготовить можно несколько ракурсов, но в первую Seedance-подобную генерацию лучше дать один самый сильный кадр. Дополнительные ракурсы добавляются как тест, а не как ритуал.

## 13.7. Seedance Prompt Adapter

Когда у вас есть чужой или готовый промпт, нельзя просто вставить его в свою задачу. Модель может принести чужую одежду, лицо, возраст, локацию и даже чужую интонацию сцены.

Нормальный маршрут:

```text
готовый промпт / механизм
+ правила модели или карточку правил
+ свои референсы персонажа и локации
-> агент переписывает промпт под вашу сцену
```

Рабочая команда:

```text
Rewrite this Seedance 2.0 prompt for the attached character and location.
Preserve the core action, camera behavior, mood, and visual idea.
Replace all character-specific details from the original prompt with details visible in my reference.
Do not keep clothing, face, age, body, hair, or identity details from the old prompt unless they match the attached reference.
Keep the prompt within 60-120 words.
Use one camera movement only.
Make the action readable and physically simple.
Make the lighting explicit.
If dialogue is needed, keep each spoken line under 10 words.
```

📌 **Вывод:** агенту не говорим "напиши красиво". Ему дают механизм, правила модели и свои материалы. Тогда он не фантазирует с нуля, а делает адаптацию.

## 13.8. Универсальный Промпт Улучшения Изображения

Для улучшения выбранного изображения. Сам промпт ниже оставлен на английском, потому что это готовая команда для модели.

Универсальный промпт улучшения изображения полезен как стартовая форма.

Там не один промпт, а набор категорий: люди, предметка, крупная кожа/портрет, реставрация, перевод 2D в 3D, мультфильм в реализм.

Быстрая версия:

```text
Enhance the uploaded image without redesigning it. Preserve identity, face structure, expression, pose, clothing, background, framing, and composition. Do not add, replace, or alter objects. Recover sharp facial features, eyes, skin texture, hair detail, edges, and surface detail. Improve clarity, contrast, depth, and cinematic lighting while staying true to the original image.
```

Почему работает:

- он защищает лицо, позу, одежду, фон и композицию;
- запрещает менять объект;
- просит улучшить детали, а не придумать новый кадр.

Главное правило:

```text
улучшаем победителя
не лечим мёртвый кадр
```

Если кадр плохой по смыслу, усиление качества просто сделает плохой кадр более резким. Это как сфотографировать ошибку в 4K.

Перед использованием prompt-а улучшения нужен winner gate:

```text
Почему это winner:
Что в кадре уже правильно:
Что enhancement должен сохранить:
Что enhancement имеет право улучшить:
Что enhancement не имеет права менять:
```

Если ответ на первый пункт сводится к "красиво", prompt улучшения не запускать. Сначала решить, это failure note, новая генерация или другой маршрут.

## 13.8A. AIS-Safe Адаптированные Seedance-Примеры

Эти примеры не копируют чужие IP-сцены, лица и локации. Они сохраняют механизм: роли референсов, действие, камеру, свет, физику и ограничения.

### Пример 1. Персонаж Движется Через Архитектуру

Задача: перенести механику parkour/action prompt без чужого замка, чужого героя и IP-мира.

Подходит для: видео из изображения или режима с несколькими референсами, когда есть референс персонажа и референс локации.

```text
Same character throughout the shot. A young courier in a weathered teal jacket sprints across a narrow rooftop walkway between two concrete buildings after light rain. Wet fabric and shoe traction are visible. The courier vaults over one low barrier and lands in a stable crouch, facing camera. Camera tracks sideways at medium speed from a fixed side angle, no orbit. Cold morning light, soft reflections on wet concrete, realistic motion, no face morphing, no clothing change, no extra people.
```

Почему это хороший пример:

- одна понятная траектория;
- одна камера;
- физика названа: wet fabric, shoe traction, landing;
- identity защищена первой строкой;
- нет чужой локации, фэндома или чужого персонажа.

Что копировать как механизм:

```text
сначала тот же персонаж; затем локация с физической поверхностью; одно действие; одна камера; свет; запрет на распад внешности
```

Чего не копировать буквально:

```text
не использовать чужой замок/игровую карту/киновселенную;
не подменять своего персонажа деталями из чужого промпта;
не добавлять второе действие "ещё и драка/взрыв/диалог".
```

### Пример 2. Появление Продукта Через Воду

Задача: короткий предметный рекламный кадр, где движение помогает финальному кадру, а не ломает форму продукта.

Подходит для: видео из текста, если продукта ещё нет, или видео из изображения, если есть хороший стартовый кадр.

```text
Preserve the exact bottle silhouette and label placement throughout the shot. A matte black perfume bottle stands on shallow black water under cold soft side light. One single drop falls beside the bottle, sending slow circular ripples outward. Camera makes a slow push-in from a fixed front angle, close product commercial look. Clean reflections, no extra bottles, no random text, no label distortion, stable readable final frame.
```

Почему это хороший пример:

- критичный объект защищён до описания красоты;
- действие одно: капля;
- камера одна: slow push-in;
- финал пригоден для логотипа/монтажа.

Что копировать как механизм:

```text
точно сохранить продукт; одно контролируемое физическое событие; простая камера; зафиксированный финальный кадр
```

Чего не копировать буквально:

```text
не пытаться тем же промптом сделать всю рекламу;
не просить одновременно каплю, дым, вспышки, логотип, руку модели и смену фона;
не апскейлить, если бутылка уже изменила форму.
```

### Пример 3. Переход между первым и последним кадром

Задача: переход между стартовым и финальным кадром без потери смысла.

Подходит для: режима первого и последнего кадра.

```text
Create a smooth transition from @Image1 to @Image2. Keep the same camera angle, product proportions, lighting direction, and background color system. The folded silver fabric in the first frame slowly tightens into a clean circular ripple pattern around the product in the final frame. Motion is elegant and minimal, no sudden cuts, no new objects, no text, no logo deformation. The final frame must match @Image2 composition.
```

Почему это хороший пример:

- модель не угадывает финал, потому что он задан;
- переход описан как физическое изменение;
- запрещены новые объекты и деформация.

Что копировать как механизм:

```text
переход от @Image1 к @Image2; сохранить камеру, свет и пропорции; описывать только мост между кадрами
```

Чего не копировать буквально:

```text
не пересказывать весь стартовый и финальный кадр заново;
не добавлять новый сюжет внутрь перехода;
не менять свет и перспективу ради "кинематографичности".
```

### Пример 4. Точная замена объекта в существующем видео

Задача: изменить существующее видео и не сломать руки, тайминг и камеру.

Подходит для: правки существующего видео.

```text
Replace the small red notebook in @Video1 with the black product box from @Image1. Keep the actor's hands, grip timing, camera movement, lighting direction, shadows, table position, and background unchanged. The box should follow the exact original hand motion and perspective. Do not change the actor's face, clothing, scene layout, or final camera angle.
```

Почему это хороший пример:

- сказано, что заменить;
- сказано, что оставить;
- защищены руки, тайминг, свет и перспектива.

Что копировать как механизм:

```text
заменить X на Y; сохранить руки, тайминг, свет, камеру и раскладку; не делать лишний редизайн
```

Чего не копировать буквально:

```text
не писать "make it better";
не оставлять модель решать, что можно менять;
не править видео, если нужный объект не имеет чистого reference image.
```

## 13.9. Чего Пока Не Хватает

Эта библиотека ещё не полная.

Нужно добрать:

- шаблоны UGC-промптов;
- Miro/video assets для постов, где без них нельзя восстановить workflow;
- больше примеров под редактирование видео в Gemini/Omni-подобных инструментах, если источники дадут реальные промпты;
- реальные AIS FLOWS промпты из Video Lab после наших тестов.

📌 **Вывод:** курс не должен опираться на один ролик. Один глубокий кейс нужен, но рядом должна расти библиотека примеров под разные задачи.



## 13.10. Форматные Слова Не Магические Заклинания

Из Seedance-источников сохраняем важную мысль: короткие форматы съёмки вроде `UGC`, `bodycam`, `FPV`, `ASMR` могут быстро задать видеоязык. Но это работает только тогда, когда вы понимаете, какую камеру просит формат: `UGC` - телефонная/social-съёмка, `bodycam` - камера на теле, `FPV` - движение от первого лица, `ASMR product` - крупный тактильный продуктовый кадр. Полная расшифровка форматов находится в главе 05.

Но это не заклинания. Если написать только:

```text
UGC, cinematic, viral, beautiful
```

модель может сделать что угодно. Иногда даже красиво. Но “что угодно” — плохой production-план.

Лучше так:

```text
Формат: UGC-style handheld phone video.
Кто в кадре: молодой основатель показывает прототип на столе.
Действие: он быстро поворачивает экран к камере и показывает результат.
Камера: лёгкая ручная тряска, без резких зумов.
Свет: мягкий дневной свет из окна.
Реплика: “Вот почему это сработало.”
Ограничение: не менять лицо, не добавлять лишний текст на экране.
```

Что переносить:

```text
слово формата + кто/что в кадре + действие + камера + свет + короткая реплика + ограничения
```

Статус: `утверждение источника / нужно проверить`. Полный UGC-мануал из поста 23 пока считается отсутствующим исходником, пока его не экспортируем.

## 13.11. Камера: Не Список Слов, А Выбор Смысла

Источник `6 - Camera Angles & Movements` полезен как словарь операторского языка. Там собраны типы крупности, углы, творческие ракурсы и движения камеры. В курс он попадает не как “скопируйте эти промпты”, а как способ точнее выбрать камеру.

Мини-логика:

```text
close-up -> эмоция или деталь;
macro -> материал, рука, глаз, капля, продуктовая фактура;
high angle -> уязвимость или маленький человек в пространстве;
low angle -> сила, угроза, героизация;
POV -> взгляд глазами героя;
over-the-shoulder -> наблюдение или диалог;
static -> стабильность, речь, lipsync, точный продукт;
push-in -> усилить внимание;
tracking -> идти за действием;
orbit -> показать объект/героя вокруг, но риск сломать лицо или продукт.
```

Главное правило:

```text
один короткий segment - одна camera logic.
```

Если prompt звучит так:

```text
POV, bodycam, luxury ad, orbit, macro, cinematic, handheld
```

это не “богатый prompt”. Это конфликт камер. Лучше выбрать один смысл:

```text
Camera: static eye-level medium shot.
Purpose: keep the speaker's face and short line readable.
```

или:

```text
Camera: slow push-in from a fixed front angle.
Purpose: build attention on the product without changing its shape.
```

Полная рабочая таблица лежит в guide-файле:

```text
AIS_FLOWS_GENERATION_GUIDE/19_CAMERA_ANGLES_AND_MOVEMENTS_REFERENCE.md
```

## 13.12. Как Хранить Внешние Примеры

У каждого внешнего примера отмечайте:

```text
Источник:
Что в нём подтверждено:
Какой механизм мы забираем:
Что является только авторской интерпретацией:
Что нужно проверить заново:
```

Промпт из чужого ролика — это пример конструкции, а не доказательство результата на любой модели.

Если пример записан как JSON, сначала определите его роль:

- внутренняя производственная схема;
- реальное тело запроса к конкретному API;
- набор полей интерфейса;
- просто удобная форма заметок.

🎬 **Мини-пример.** Поля `scene`, `camera`, `lighting` могут отлично организовать мысль. Но пока текущая документация сервиса не подтверждает такой API, этот JSON остаётся внутренним шаблоном, а не готовым запросом.












