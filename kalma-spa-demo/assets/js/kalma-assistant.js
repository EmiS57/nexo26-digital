(() => {
  "use strict";

  const config = window.KALMA_CONFIG || {};
  const doc = document;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasValue = (value) => typeof value === "string" && value.trim().length > 0;
  const cleanPhone = (value) => String(value || "").replace(/\D/g, "");

  const fallbackAnswer =
    "Esa información debe confirmarla directamente el equipo de Kalma. Puedo ayudarte a comunicarte con ellos.";

  const state = {
    open: false,
    started: false,
    lastFocus: null,
    appointment: createEmptyAppointment(),
    businessStatus: "Pendiente de confirmar."
  };

  let root;
  let launcher;
  let panel;
  let closeButton;
  let messages;
  let actions;
  let statusLine;

  function createEmptyAppointment() {
    return {
      service: "",
      date: "",
      time: "",
      name: "",
      contact: "",
      comments: ""
    };
  }

  function getServices() {
    return Array.isArray(config.services)
      ? config.services.filter((service) => service && service.active !== false)
      : [];
  }

  function buildWhatsAppUrl(message) {
    if (typeof window.buildWhatsAppUrl === "function") {
      return window.buildWhatsAppUrl(message);
    }

    const phone = cleanPhone(config.phone);
    if (!phone) return "";
    return `https://wa.me/${phone}?text=${encodeURIComponent(message || "")}`;
  }

  function createNode(tag, options = {}, children = []) {
    const node = doc.createElement(tag);

    if (options.className) node.className = options.className;
    if (options.text) node.textContent = options.text;
    if (options.type) node.type = options.type;
    if (options.hidden) node.hidden = true;

    Object.entries(options.attrs || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined) node.setAttribute(key, String(value));
    });

    children.forEach((child) => {
      if (typeof child === "string") node.append(doc.createTextNode(child));
      else if (child) node.append(child);
    });

    return node;
  }

  function createChatIcon() {
    const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    const path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M5.5 17.25v2.4c0 .32.36.5.62.31l3.36-2.46h5.77A4.75 4.75 0 0 0 20 12.75v-4A4.75 4.75 0 0 0 15.25 4h-6.5A4.75 4.75 0 0 0 4 8.75v4c0 1.86 1.07 3.47 2.63 4.25-.48.12-.8.16-1.13.25Z"
    );
    path.setAttribute("fill", "currentColor");
    svg.append(path);
    return svg;
  }

  function createInterface() {
    root = createNode("section", {
      className: "kalma-assistant",
      attrs: { "aria-label": "Asistente Virtual Kalma" }
    });

    launcher = createNode(
      "button",
      {
        className: "kalma-assistant__launcher",
        type: "button",
        attrs: {
          "aria-label": "Abrir Asistente Virtual Kalma",
          "aria-controls": "kalma-assistant-panel",
          "aria-expanded": "false"
        }
      },
      [createChatIcon(), createNode("span", { text: "¿Necesitas ayuda?" })]
    );

    panel = createNode("div", {
      className: "kalma-assistant__panel",
      hidden: true,
      attrs: {
        id: "kalma-assistant-panel",
        role: "dialog",
        "aria-modal": "false",
        "aria-labelledby": "kalma-assistant-title",
        "aria-hidden": "true"
      }
    });

    const header = createNode("div", { className: "kalma-assistant__header" });
    const titleGroup = createNode("div", { className: "kalma-assistant__title-group" }, [
      createNode("span", { className: "kalma-assistant__eyebrow", text: "KALMA SPA" }),
      createNode("h2", {
        text: "Asistente Virtual Kalma",
        attrs: { id: "kalma-assistant-title" }
      })
    ]);
    const headerActions = createNode("div", { className: "kalma-assistant__header-actions" });
    const resetButton = createNode("button", {
      className: "kalma-assistant__text-button",
      text: "Reiniciar",
      type: "button"
    });
    closeButton = createNode("button", {
      className: "kalma-assistant__close",
      text: "Cerrar",
      type: "button",
      attrs: { "aria-label": "Cerrar Asistente Virtual Kalma" }
    });

    headerActions.append(resetButton, closeButton);
    header.append(titleGroup, headerActions);

    const notice = createNode("p", {
      className: "kalma-assistant__notice",
      text: "Demostración conceptual. Este asistente todavía no realiza reservaciones reales."
    });
    messages = createNode("div", {
      className: "kalma-assistant__messages",
      attrs: {
        role: "log",
        "aria-live": "polite",
        "aria-relevant": "additions"
      }
    });
    actions = createNode("div", {
      className: "kalma-assistant__actions",
      attrs: { "aria-label": "Opciones del asistente" }
    });
    statusLine = createNode("p", {
      className: "kalma-assistant__status",
      attrs: { role: "status", "aria-live": "polite" }
    });

    panel.append(header, notice, messages, actions, statusLine);
    root.append(launcher, panel);
    doc.body.append(root);

    launcher.addEventListener("click", openAssistant);
    closeButton.addEventListener("click", closeAssistant);
    resetButton.addEventListener("click", restartConversation);
    panel.addEventListener("keydown", handlePanelKeydown);
    doc.addEventListener("keydown", handleDocumentKeydown);
  }

  function openAssistant() {
    if (state.open) return;
    state.open = true;
    state.lastFocus = doc.activeElement instanceof HTMLElement ? doc.activeElement : launcher;
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    launcher.setAttribute("aria-expanded", "true");
    doc.body.classList.add("assistant-open");

    if (!state.started) startConversation();

    window.requestAnimationFrame(() => {
      closeButton.focus({ preventScroll: true });
    });
  }

  function closeAssistant() {
    if (!state.open) return;
    state.open = false;
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");
    launcher.setAttribute("aria-expanded", "false");
    doc.body.classList.remove("assistant-open");

    const target = state.lastFocus || launcher;
    if (target instanceof HTMLElement) target.focus({ preventScroll: true });
  }

  function handleDocumentKeydown(event) {
    if (event.key === "Escape" && state.open) {
      event.preventDefault();
      closeAssistant();
    }
  }

  function handlePanelKeydown(event) {
    if (event.key !== "Tab") return;

    const focusable = getFocusableNodes();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function getFocusableNodes() {
    return Array.from(
      panel.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((node) => !node.hidden && node.offsetParent !== null);
  }

  function startConversation() {
    state.started = true;
    messages.replaceChildren();
    state.businessStatus = "Pendiente de confirmar.";

    addMessage(
      "bot",
      "Hola, soy el asistente virtual de Kalma 😊\nPuedo ayudarte a conocer nuestros servicios, resolver algunas dudas o preparar una solicitud de cita.\n¿Qué te gustaría hacer?"
    );
    showMainMenuActions();
  }

  function restartConversation() {
    state.appointment = createEmptyAppointment();
    state.businessStatus = "Pendiente de confirmar.";
    statusLine.textContent = "La conversación de demostración se reinició.";
    startConversation();
  }

  function addMessage(sender, text, extraContent) {
    const item = createNode("article", {
      className: `kalma-assistant__message is-${sender}`
    });
    const label = createNode("span", {
      className: "sr-only",
      text: sender === "bot" ? "Asistente Kalma:" : "Tú:"
    });
    const bubble = createNode("div", { className: "kalma-assistant__bubble" });

    String(text || "")
      .split("\n")
      .forEach((line, index) => {
        if (index > 0) bubble.append(createNode("br"));
        bubble.append(doc.createTextNode(line));
      });

    if (extraContent) bubble.append(extraContent);
    item.append(label, bubble);
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function addTyping(callback) {
    const typing = createNode("div", {
      className: "kalma-assistant__typing",
      text: "Kalma está escribiendo"
    });
    typing.append(createNode("span"), createNode("span"), createNode("span"));
    messages.append(typing);
    messages.scrollTop = messages.scrollHeight;

    window.setTimeout(() => {
      typing.remove();
      callback();
    }, prefersReducedMotion ? 0 : 320);
  }

  function botReply(text, nextActions, extraContent) {
    clearActions();
    addTyping(() => {
      addMessage("bot", text, extraContent);
      if (nextActions) showActions(nextActions);
    });
  }

  function userSays(text) {
    addMessage("user", text);
  }

  function clearActions() {
    actions.replaceChildren();
    statusLine.textContent = "";
  }

  function showActions(items) {
    clearActions();
    items.forEach((item) => actions.append(createAction(item)));

    const first = actions.querySelector("button, a");
    if (first) window.requestAnimationFrame(() => first.focus({ preventScroll: true }));
  }

  function createAction(item) {
    if (item.href) {
      const link = createNode("a", {
        className: `kalma-assistant__option ${item.variant ? `is-${item.variant}` : ""}`,
        text: item.label,
        attrs: {
          href: item.href,
          target: "_blank",
          rel: "noopener noreferrer",
          "aria-label": item.ariaLabel || item.label
        }
      });
      return link;
    }

    const button = createNode("button", {
      className: `kalma-assistant__option ${item.variant ? `is-${item.variant}` : ""}`,
      text: item.label,
      type: "button",
      attrs: { "aria-label": item.ariaLabel || item.label }
    });
    button.addEventListener("click", item.onSelect);
    return button;
  }

  function showMainMenuActions() {
    showActions(getMainMenuActions());
  }

  function getMainMenuActions() {
    return [
      { label: "Ver servicios", onSelect: () => chooseMainOption("Ver servicios", showServices) },
      { label: "Consultar precios", onSelect: () => chooseMainOption("Consultar precios", showPrices) },
      { label: "Solicitar una cita", onSelect: () => chooseMainOption("Solicitar una cita", () => startAppointment()) },
      { label: "Preguntas frecuentes", onSelect: () => chooseMainOption("Preguntas frecuentes", showFaq) },
      { label: "Hablar con una persona", onSelect: () => chooseMainOption("Hablar con una persona", showHumanHelp) }
    ];
  }

  function chooseMainOption(label, callback) {
    userSays(label);
    callback();
  }

  function showServices() {
    const services = getServices();
    if (services.length === 0) {
      botReply("Por ahora no encontré servicios configurados en la página.", [
        menuAction()
      ]);
      return;
    }

    botReply(
      "Estos son los servicios publicados en la página de Kalma. Elige uno para ver el detalle dentro de esta demo.",
      [
        ...services.map((service) => ({
          label: service.title || service.category || "Servicio",
          onSelect: () => {
            userSays(service.title || service.category || "Servicio");
            showServiceDetail(service);
          }
        })),
        menuAction()
      ]
    );
  }

  function showServiceDetail(service) {
    const card = createServiceCard(service);
    botReply(
      "Este detalle reutiliza la información publicada. Los datos no publicados se muestran como demostración.",
      [
        {
          label: "Solicitar cita",
          variant: "primary",
          onSelect: () => {
            userSays("Solicitar cita");
            startAppointment(service);
          }
        },
        { label: "Ver otro servicio", onSelect: showServices },
        menuAction()
      ],
      card
    );
  }

  function createServiceCard(service) {
    const card = createNode("div", { className: "kalma-assistant__card" });
    card.append(
      createNode("span", {
        className: "kalma-assistant__card-kicker",
        text: service.category || "Experiencia"
      }),
      createNode("strong", { text: service.title || service.category || "Servicio" }),
      createNode("p", {
        text: service.description || "Información publicada en la página de Kalma Spa."
      })
    );

    const list = createNode("dl", { className: "kalma-assistant__facts" });
    addFact(list, "Duración", "Duración de ejemplo. Debe confirmarla el equipo de Kalma.");
    addFact(list, "Precio", "Precio de ejemplo. Debe confirmarlo el equipo de Kalma.");
    card.append(list);
    return card;
  }

  function addFact(list, label, value) {
    list.append(createNode("dt", { text: label }), createNode("dd", { text: value }));
  }

  function showPrices() {
    botReply(
      "El precio puede variar según el servicio y las necesidades de cada persona. Podemos ayudarte a preparar una solicitud para que el equipo de Kalma te proporcione información precisa.",
      [
        { label: "Elegir un servicio", onSelect: showServices },
        {
          label: "Solicitar información",
          variant: "primary",
          onSelect: () => startAppointment()
        },
        menuAction()
      ]
    );
  }

  function startAppointment(service) {
    state.appointment = createEmptyAppointment();
    if (service) state.appointment.service = service.title || service.category || "";

    if (state.appointment.service) {
      askDate();
      return;
    }

    const services = getServices();
    botReply("Perfecto. Primero elige el servicio de interés.", [
      ...services.map((item) => ({
        label: item.title || item.category || "Servicio",
        onSelect: () => {
          const title = item.title || item.category || "Servicio";
          userSays(title);
          state.appointment.service = title;
          askDate();
        }
      })),
      { label: "Cancelar", onSelect: cancelAppointment }
    ]);
  }

  function askDate() {
    botReply("¿Qué día te gustaría solicitar?", [
      { label: "Hoy", onSelect: () => saveDate("Hoy") },
      { label: "Mañana", onSelect: () => saveDate("Mañana") },
      { label: "Esta semana", onSelect: () => saveDate("Esta semana") },
      { label: "Elegir otra fecha", onSelect: askCustomDate },
      { label: "Cancelar", onSelect: cancelAppointment }
    ]);
  }

  function saveDate(value) {
    userSays(value);
    state.appointment.date = value;
    askTime();
  }

  function askCustomDate() {
    userSays("Elegir otra fecha");
    showInput({
      label: "Fecha deseada",
      type: "date",
      button: "Guardar fecha",
      onSubmit: (value) => {
        const readable = formatDate(value);
        state.appointment.date = readable;
        userSays(readable);
        askTime();
      }
    });
  }

  function askTime() {
    botReply("¿Qué horario aproximado prefieres?", [
      { label: "Mañana", onSelect: () => saveTime("Mañana") },
      { label: "Tarde", onSelect: () => saveTime("Tarde") },
      { label: "Horario específico", onSelect: askCustomTime },
      { label: "Cancelar", onSelect: cancelAppointment }
    ]);
  }

  function saveTime(value) {
    userSays(value);
    state.appointment.time = value;
    askName();
  }

  function askCustomTime() {
    userSays("Horario específico");
    showInput({
      label: "Horario aproximado",
      placeholder: "Ej. 4:30 pm",
      button: "Guardar horario",
      onSubmit: (value) => {
        state.appointment.time = value;
        userSays(value);
        askName();
      }
    });
  }

  function askName() {
    promptInput("¿A nombre de quién preparamos la solicitud?", {
      label: "Nombre",
      placeholder: "Nombre del cliente",
      button: "Guardar nombre",
      onSubmit: (value) => {
        state.appointment.name = value;
        userSays(value);
        askContact();
      }
    });
  }

  function askContact() {
    promptInput("Déjame un teléfono o medio de contacto para que el equipo pueda responderte.", {
      label: "Teléfono o medio de contacto",
      placeholder: "Teléfono, WhatsApp o correo",
      button: "Guardar contacto",
      onSubmit: (value) => {
        state.appointment.contact = value;
        userSays(value);
        askComments();
      }
    });
  }

  function askComments() {
    promptInput("¿Quieres agregar algún comentario? Es opcional.", {
      label: "Comentario adicional",
      placeholder: "Ej. Voy acompañada, tengo preferencia de horario...",
      button: "Guardar comentario",
      optional: true,
      multiline: true,
      secondaryAction: {
        label: "Omitir",
        onSelect: () => {
          userSays("Sin comentarios adicionales");
          state.appointment.comments = "Sin comentarios adicionales";
          showAppointmentSummary();
        }
      },
      onSubmit: (value) => {
        state.appointment.comments = value || "Sin comentarios adicionales";
        userSays(state.appointment.comments);
        showAppointmentSummary();
      }
    });
  }

  function promptInput(text, options) {
    clearActions();
    addTyping(() => {
      addMessage("bot", text);
      showInput(options);
    });
  }

  function showInput(options) {
    clearActions();
    const form = createNode("form", { className: "kalma-assistant__form" });
    const label = createNode("label", { text: options.label });
    const field = createNode(options.multiline ? "textarea" : "input", {
      attrs: {
        placeholder: options.placeholder || "",
        autocomplete: "off"
      }
    });
    if (!options.multiline) field.type = options.type || "text";

    const error = createNode("p", {
      className: "kalma-assistant__error",
      attrs: { role: "alert" }
    });
    const button = createNode("button", {
      className: "kalma-assistant__option is-primary",
      text: options.button || "Continuar",
      type: "submit"
    });

    label.append(field);
    form.append(label, error, button);

    if (options.secondaryAction) {
      const secondary = createAction(options.secondaryAction);
      form.append(secondary);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = field.value.trim();
      if (!options.optional && !hasValue(value)) {
        error.textContent = "Para continuar, escribe este dato.";
        field.focus();
        return;
      }
      options.onSubmit(value);
    });

    actions.append(form);
    window.requestAnimationFrame(() => field.focus({ preventScroll: true }));
  }

  function showAppointmentSummary() {
    const summary = createSummaryCard();
    botReply(
      "Revisa el resumen antes de confirmar. Recuerda: esta solicitud no confirma disponibilidad.",
      [
        {
          label: "Confirmar solicitud",
          variant: "primary",
          onSelect: confirmAppointment
        },
        { label: "Modificar datos", onSelect: () => startAppointment() },
        { label: "Cancelar", onSelect: cancelAppointment }
      ],
      summary
    );
  }

  function createSummaryCard() {
    const card = createNode("div", { className: "kalma-assistant__card" }, [
      createNode("strong", { text: "Solicitud de cita" })
    ]);
    const list = createNode("dl", { className: "kalma-assistant__facts" });
    addFact(list, "Nombre", state.appointment.name || "Pendiente");
    addFact(list, "Servicio", state.appointment.service || "Pendiente");
    addFact(list, "Fecha deseada", state.appointment.date || "Pendiente");
    addFact(list, "Horario", state.appointment.time || "Pendiente");
    addFact(list, "Contacto", state.appointment.contact || "Pendiente");
    addFact(list, "Comentarios", state.appointment.comments || "Sin comentarios adicionales");
    card.append(list);
    return card;
  }

  function confirmAppointment() {
    userSays("Confirmar solicitud");
    state.businessStatus = "Pendiente de confirmar.";
    botReply(
      "Gracias. Tu solicitud fue registrada de manera demostrativa. El equipo de Kalma tendría que confirmar la disponibilidad.",
      [
        {
          label: "Enviar por WhatsApp",
          variant: "primary",
          onSelect: openSummaryWhatsApp
        },
        {
          label: "Ver cómo recibiría la solicitud Kalma",
          onSelect: showBusinessView
        },
        { label: "Volver al inicio", onSelect: returnHome }
      ]
    );
  }

  function openSummaryWhatsApp() {
    userSays("Enviar por WhatsApp");
    const url = buildWhatsAppUrl(buildSummaryMessage());
    if (!url) {
      botReply("No encontré un número de WhatsApp configurado para Kalma.", [menuAction()]);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    statusLine.textContent = "Se abrió WhatsApp en una pestaña nueva con el resumen precargado.";
  }

  function buildSummaryMessage() {
    return [
      "Hola, quiero compartir esta solicitud de cita para Kalma Spa:",
      "",
      `Nombre: ${state.appointment.name}`,
      `Servicio: ${state.appointment.service}`,
      `Fecha deseada: ${state.appointment.date}`,
      `Horario: ${state.appointment.time}`,
      `Contacto: ${state.appointment.contact}`,
      `Comentarios: ${state.appointment.comments || "Sin comentarios adicionales"}`,
      "",
      "Nota: solicitud generada desde una demostración conceptual. La disponibilidad debe confirmarla el equipo de Kalma."
    ].join("\n");
  }

  function cancelAppointment() {
    userSays("Cancelar");
    state.appointment = createEmptyAppointment();
    botReply("Cancelé esta solicitud de demostración. Puedes iniciar otra cuando quieras.", [
      { label: "Volver al inicio", onSelect: returnHome }
    ]);
  }

  function showFaq() {
    const questions = getFaqItems();
    botReply("Elige una pregunta para ver la respuesta dentro de esta demo.", [
      ...questions.map((item) => ({
        label: item.question,
        onSelect: () => {
          userSays(item.question);
          botReply(item.answer, [
            { label: "Otra pregunta", onSelect: showFaq },
            menuAction()
          ]);
        }
      })),
      menuAction()
    ]);
  }

  function getFaqItems() {
    const recommendations = config.recommendations || {};
    const recommendationText = hasValue(recommendations.relajarme?.text)
      ? recommendations.relajarme.text
      : "Podemos partir de cómo quieres sentirte hoy: relajarte, cuidar tu piel o compartir una experiencia.";

    return [
      {
        question: "¿Dónde están ubicados?",
        answer: hasValue(config.address)
          ? `Kalma Spa se encuentra en ${config.address}. Zona: ${config.zone || "Vicente Villada, Nezahualcóyotl"}.`
          : fallbackAnswer
      },
      {
        question: "¿Cuál es el horario?",
        answer: hasValue(config.schedule) ? config.schedule : fallbackAnswer
      },
      {
        question: "¿Cómo puedo reservar?",
        answer:
          "Puedes iniciar la conversación por WhatsApp. El equipo del spa confirmará disponibilidad y detalles de la visita."
      },
      {
        question: "¿Qué formas de pago aceptan?",
        answer: fallbackAnswer
      },
      {
        question: "¿Debo llegar con anticipación?",
        answer:
          "Se recomienda consultar antes por WhatsApp para confirmar horarios, servicios disponibles y cualquier indicación de visita."
      },
      {
        question: "¿Puedo cancelar o cambiar mi cita?",
        answer: fallbackAnswer
      },
      {
        question: "¿Qué servicio me recomiendan?",
        answer: recommendationText
      }
    ];
  }

  function showHumanHelp() {
    const message =
      "Hola, estuve revisando los servicios de Kalma y me gustaría recibir atención personalizada.";
    const url = buildWhatsAppUrl(message);

    botReply("Claro. Puedes comunicarte directamente con el equipo de Kalma por WhatsApp.", [
      url
        ? {
            label: "Abrir WhatsApp",
            href: url,
            variant: "primary",
            ariaLabel: "Abrir WhatsApp de Kalma Spa en una pestaña nueva"
          }
        : { label: "WhatsApp no configurado", onSelect: () => {} },
      menuAction()
    ]);
  }

  function showBusinessView() {
    userSays("Ver cómo recibiría la solicitud Kalma");
    const view = createBusinessCard();
    botReply(
      "Vista del negocio. Esto es una simulación interna; no guarda datos ni contacta a nadie.",
      [menuAction()],
      view
    );
  }

  function createBusinessCard() {
    const card = createNode("div", { className: "kalma-assistant__business-card" });
    const status = createNode("strong", {
      className: "kalma-assistant__business-status",
      text: `Estado: ${state.businessStatus}`
    });
    const list = createNode("dl", { className: "kalma-assistant__facts" });
    const appointment = state.appointment;

    card.append(
      createNode("span", { className: "kalma-assistant__card-kicker", text: "Vista del negocio" }),
      createNode("strong", { text: "Nueva solicitud" })
    );
    addFact(list, "Nombre del cliente", appointment.name || "Cliente de ejemplo");
    addFact(list, "Servicio", appointment.service || "Servicio por elegir");
    addFact(list, "Fecha solicitada", appointment.date || "Fecha por confirmar");
    addFact(list, "Horario", appointment.time || "Horario por confirmar");
    addFact(list, "Teléfono", appointment.contact || "Contacto por confirmar");
    addFact(list, "Comentarios", appointment.comments || "Sin comentarios adicionales");

    const buttons = createNode("div", { className: "kalma-assistant__business-actions" });
    [
      ["Confirmar", "Confirmación simulada"],
      ["Reprogramar", "Reprogramación simulada"],
      ["Contactar", "Contacto simulado preparado"],
      ["Marcar como atendida", "Atendida en simulación"]
    ].forEach(([label, nextStatus]) => {
      const button = createNode("button", {
        className: "kalma-assistant__mini-button",
        text: label,
        type: "button"
      });
      button.addEventListener("click", () => {
        state.businessStatus = nextStatus;
        status.textContent = `Estado: ${state.businessStatus}`;
      });
      buttons.append(button);
    });

    card.append(list, status, buttons);
    return card;
  }

  function returnHome() {
    userSays("Volver al inicio");
    botReply("Volvemos al inicio. ¿Qué te gustaría hacer?", getMainMenuActions());
  }

  function menuAction() {
    return {
      label: "Volver al menú",
      onSelect: returnHome
    };
  }

  function formatDate(value) {
    if (!hasValue(value)) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", createInterface, { once: true });
  } else {
    createInterface();
  }
})();
