(function (root, factory) {
  "use strict";

  const api = factory(root);
  root.NEXO_ASSISTANT_UI = api;

  function boot() {
    if (!root.document || !root.NEXO_ASSISTANT_CONFIG || root.NEXO_ASSISTANT_CONFIG.enabled === false) return;
    if (!root.NEXO_ASSISTANT_ENGINE || !root.NEXO_ASSISTANT_KNOWLEDGE) return;
    api.mount({ root, document: root.document });
  }

  if (root.document) {
    if (root.document.readyState === "loading") {
      root.document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  }
})(typeof window !== "undefined" ? window : globalThis, function createNexoAssistantUI(root) {
  "use strict";

  const VERSION = "phase-3-demo";
  const MAX_ACTIONS = 5;
  const DEFAULT_WHATSAPP = "5215517973390";
  const FOCUSABLE = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  const INITIAL_ACTIONS = Object.freeze([
    Object.freeze({ action: "start_analysis", label: "Analizar mi negocio" }),
    Object.freeze({ action: "show_plans", label: "Ver paquetes" }),
    Object.freeze({ action: "show_services", label: "Ver servicios" }),
    Object.freeze({ action: "show_portfolio", label: "Ver proyectos" }),
    Object.freeze({ action: "request_human", label: "Hablar con una persona" })
  ]);

  const ACTION_LABELS = Object.freeze({
    show_services: "Ver servicios",
    show_plans: "Ver paquetes",
    ask_timeline: "Ver tiempos",
    ask_domain: "Dominio",
    ask_requirements: "Requisitos",
    ask_portfolio: "Ver proyectos",
    start_analysis: "Analizar mi negocio",
    continue_analysis: "Continuar análisis",
    show_portfolio: "Ver proyectos",
    show_plan_details: "Ver detalle",
    generate_structure: "Crear estructura",
    generate_visual_direction: "Dirección visual",
    build_summary: "Preparar resumen",
    open_whatsapp: "Continuar por WhatsApp",
    request_human: "Hablar con una persona",
    restart: "Reiniciar"
  });

  const GUIDED_STEPS = Object.freeze([
    Object.freeze({
      id: "business",
      label: "Giro del negocio",
      question: "Que tipo de negocio tienes?",
      type: "text",
      fields: Object.freeze(["businessType"]),
      placeholder: "Ej. barberia, clinica dental, restaurante, gimnasio"
    }),
    Object.freeze({
      id: "goal",
      label: "Objetivo",
      question: "Que quieres resolver primero?",
      type: "checks",
      fields: Object.freeze(["goals"]),
      options: Object.freeze(["Presentar servicios", "Ordenar informacion", "Recibir citas o reservas", "Vender productos", "Mejorar confianza"])
    }),
    Object.freeze({
      id: "service-count",
      label: "Servicios",
      question: "Cuantos servicios o categorias quieres mostrar?",
      type: "number-single",
      fields: Object.freeze(["serviceCount"]),
      placeholder: "Ej. 6"
    }),
    Object.freeze({
      id: "materials",
      label: "Materiales",
      question: "Ya tienes fotos, textos o logo?",
      type: "checks",
      fields: Object.freeze(["availableMaterials"]),
      options: Object.freeze(["Logo", "Fotos", "Textos", "Lista de servicios", "Ubicacion", "Nada organizado"])
    }),
    Object.freeze({
      id: "domain",
      label: "Dominio",
      question: "Ya tienes dominio propio?",
      type: "domain",
      fields: Object.freeze(["hasDomain", "domainStatus"])
    }),
    Object.freeze({
      id: "deadline",
      label: "Fecha aproximada",
      question: "Para cuando te gustaria tener una primera version?",
      type: "urgency",
      fields: Object.freeze(["urgency"])
    }),
    Object.freeze({
      id: "name",
      label: "Nombre",
      question: "Cual es tu nombre?",
      type: "text",
      fields: Object.freeze(["name"]),
      placeholder: "Tu nombre"
    }),
    Object.freeze({
      id: "contact",
      label: "Contacto",
      question: "Que medio de contacto prefieres?",
      type: "text",
      fields: Object.freeze(["contactMethod"]),
      placeholder: "Ej. WhatsApp, llamada o correo"
    }),
    Object.freeze({
      id: "comment",
      label: "Comentario",
      question: "Quieres agregar algun comentario adicional?",
      type: "text",
      fields: Object.freeze(["additionalComment"]),
      placeholder: "Ej. Tengo fotos listas y quiero revisar NEXO Profesional"
    })
  ]);

  function text(value, limit) {
    const clean = String(value == null ? "" : value)
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return typeof limit === "number" ? clean.slice(0, limit) : clean;
  }

  function uniqueList(values) {
    const seen = [];
    (Array.isArray(values) ? values : [values]).forEach((value) => {
      const clean = text(value, 120);
      if (clean && !seen.some((item) => item.toLowerCase() === clean.toLowerCase())) seen.push(clean);
    });
    return seen;
  }

  function createElement(doc, tag, className, attrs) {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === false || value == null) return;
      if (key === "text") {
        node.textContent = String(value);
      } else if (key === "dataset") {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          node.dataset[dataKey] = String(dataValue);
        });
      } else if (key === "hidden") {
        node.hidden = Boolean(value);
      } else {
        node.setAttribute(key, String(value));
      }
    });
    return node;
  }

  function appendChildren(parent, children) {
    children.filter(Boolean).forEach((child) => parent.appendChild(child));
    return parent;
  }

  function button(doc, label, className, attrs) {
    return createElement(doc, "button", className || "nexo-assistant-action", Object.assign({ type: "button", text: label }, attrs || {}));
  }

  function list(doc, items, className) {
    const ul = createElement(doc, "ul", className || "nexo-assistant-list");
    uniqueList(items).forEach((item) => {
      ul.appendChild(createElement(doc, "li", "", { text: item }));
    });
    return ul;
  }

  function createInitialState(engine) {
    return {
      open: false,
      messages: [],
      leadContext: engine && engine.createLeadContext ? engine.createLeadContext({}) : {},
      currentRecommendation: null,
      guided: {
        active: false,
        index: 0
      },
      lastScrollY: 0
    };
  }

  function createLeadPatchForStep(step, container) {
    const patch = {};
    if (!step || !container) return patch;
    if (step.type === "text") {
      patch[step.fields[0]] = text((container.querySelector("[data-step-field]") || {}).value, 120);
    }
    if (step.type === "pair") {
      step.fields.forEach((field) => {
        const input = container.querySelector(`[data-step-field='${field}']`);
        patch[field] = text(input && input.value, 120);
      });
    }
    if (step.type === "numbers") {
      step.fields.forEach((field) => {
        const input = container.querySelector(`[data-step-field='${field}']`);
        const value = Number(input && input.value);
        if (Number.isFinite(value) && value > 0) patch[field] = value;
      });
    }
    if (step.type === "number-single") {
      const field = step.fields[0];
      const input = container.querySelector(`[data-step-field='${field}']`);
      const value = Number(input && input.value);
      if (Number.isFinite(value) && value > 0) patch[field] = value;
    }
    if (step.type === "channels") {
      patch.currentChannels = Array.from(container.querySelectorAll("[data-channel]:checked")).map((input) => input.value);
      const whatsapp = container.querySelector("[name='nexo-uses-whatsapp']:checked");
      if (whatsapp) patch.usesWhatsApp = whatsapp.value === "yes";
    }
    if (step.type === "website") {
      const hasWebsite = container.querySelector("[name='nexo-has-website']:checked");
      if (hasWebsite) patch.hasWebsite = hasWebsite.value === "yes";
      const condition = container.querySelector("[data-step-field='websiteCondition']");
      patch.websiteCondition = text(condition && condition.value, 160);
    }
    if (step.type === "checks") {
      patch[step.fields[0]] = Array.from(container.querySelectorAll("[data-check-option]:checked")).map((input) => input.value);
    }
    if (step.type === "materials") {
      patch.availableMaterials = Array.from(container.querySelectorAll("[data-material]:checked")).map((input) => input.value);
      const urgency = container.querySelector("[name='nexo-urgency']:checked");
      if (urgency) patch.urgency = urgency.value;
    }
    if (step.type === "domain") {
      const domain = container.querySelector("[name='nexo-has-domain']:checked");
      if (domain) {
        patch.hasDomain = domain.value === "yes";
        patch.domainStatus = domain.value === "yes" ? "Ya cuenta con dominio propio" : "No cuenta con dominio propio";
      }
    }
    if (step.type === "urgency") {
      const urgency = container.querySelector("[name='nexo-deadline']:checked");
      if (urgency) patch.urgency = urgency.value;
    }
    return patch;
  }

  function createWhatsAppUrl(number, message) {
    return `https://wa.me/${text(number || DEFAULT_WHATSAPP, 20)}?text=${encodeURIComponent(String(message || ""))}`;
  }

  function planOrder(planId) {
    return ["essential", "professional", "custom"].indexOf(planId);
  }

  function getPlan(knowledge, planId) {
    return ((knowledge && knowledge.plans) || []).find((plan) => plan.id === planId) || null;
  }

  function getAlternativePlan(knowledge, recommendation, direction) {
    const plans = (knowledge && knowledge.plans) || [];
    const index = planOrder(recommendation && recommendation.planId);
    if (index < 0) return null;
    const target = direction === "lower" ? index - 1 : index + 1;
    return plans.find((plan) => planOrder(plan.id) === target) || null;
  }

  function createController(options) {
    const doc = options.document;
    const win = options.root || root;
    const engine = options.engine || win.NEXO_ASSISTANT_ENGINE;
    const knowledge = options.knowledge || win.NEXO_ASSISTANT_KNOWLEDGE;
    const config = options.config || win.NEXO_ASSISTANT_CONFIG || {};
    const state = createInitialState(engine);
    const nodes = {};
    let previousFocus = null;
    let guidedNode = null;

    function mount() {
      if (!doc || !doc.body || !engine || !knowledge) return null;
      const existing = doc.getElementById("nexo-assistant-root");
      if (existing) return api;

      nodes.root = createElement(doc, "div", "nexo-assistant-root", { id: "nexo-assistant-root" });
      nodes.launcher = button(doc, "Abrir NEXO Asistente", "nexo-assistant-launcher", {
        "aria-label": "Abrir NEXO Asistente",
        "aria-haspopup": "dialog",
        "aria-expanded": "false",
        "aria-controls": "nexo-assistant-panel"
      });
      const mark = createElement(doc, "span", "nexo-assistant-launcher-mark", { text: "NX26", "aria-hidden": "true" });
      const copy = createElement(doc, "span", "nexo-assistant-launcher-copy", { text: "NEXO Asistente" });
      nodes.launcher.textContent = "";
      appendChildren(nodes.launcher, [mark, copy]);

      nodes.backdrop = createElement(doc, "div", "nexo-assistant-backdrop", { hidden: true, "aria-hidden": "true" });
      nodes.panel = createElement(doc, "section", "nexo-assistant-panel", {
        id: "nexo-assistant-panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "nexo-assistant-title",
        "aria-describedby": "nexo-assistant-description",
        hidden: true
      });

      nodes.header = createHeader();
      nodes.messages = createElement(doc, "div", "nexo-assistant-messages", {
        role: "log",
        "aria-live": "polite",
        "aria-relevant": "additions"
      });
      nodes.composer = createComposer();
      appendChildren(nodes.panel, [nodes.header, nodes.messages, nodes.composer]);
      appendChildren(nodes.root, [nodes.launcher, nodes.backdrop, nodes.panel]);
      doc.body.appendChild(nodes.root);

      nodes.launcher.addEventListener("click", open);
      nodes.backdrop.addEventListener("click", close);
      nodes.panel.addEventListener("keydown", trapFocus);
      doc.addEventListener("keydown", handleDocumentKey);

      resetConversation(false);
      return api;
    }

    function createHeader() {
      const header = createElement(doc, "header", "nexo-assistant-header");
      const titleBlock = createElement(doc, "div", "nexo-assistant-title-block");
      const mode = createElement(doc, "span", "nexo-assistant-mode", { text: "Modo demo" });
      const title = createElement(doc, "h2", "", { id: "nexo-assistant-title", text: "NEXO Asistente" });
      const desc = createElement(doc, "p", "", { id: "nexo-assistant-description", text: "Orientación inicial para tu negocio" });
      appendChildren(titleBlock, [mode, title, desc]);

      const controls = createElement(doc, "div", "nexo-assistant-header-actions");
      const reset = button(doc, "Reiniciar", "nexo-assistant-icon-button", { "aria-label": "Reiniciar conversación" });
      reset.textContent = "";
      reset.appendChild(createElement(doc, "span", "", { text: "↻", "aria-hidden": "true" }));
      const closeButton = button(doc, "Cerrar", "nexo-assistant-icon-button", { "aria-label": "Cerrar NEXO Asistente" });
      closeButton.textContent = "";
      closeButton.appendChild(createElement(doc, "span", "", { text: "×", "aria-hidden": "true" }));
      reset.addEventListener("click", () => resetConversation(true));
      closeButton.addEventListener("click", close);
      appendChildren(controls, [reset, closeButton]);
      return appendChildren(header, [titleBlock, controls]);
    }

    function createComposer() {
      const wrapper = createElement(doc, "div", "nexo-assistant-composer");
      const label = createElement(doc, "label", "sr-only", { for: "nexo-assistant-input", text: "Escribe tu mensaje para NEXO Asistente" });
      nodes.input = createElement(doc, "textarea", "nexo-assistant-input", {
        id: "nexo-assistant-input",
        rows: "2",
        maxlength: String(config.maxMessageLength || 800),
        placeholder: "Escribe tu pregunta o cuéntame de tu negocio",
        "aria-describedby": "nexo-assistant-input-help"
      });
      nodes.counter = createElement(doc, "span", "nexo-assistant-counter", {
        id: "nexo-assistant-input-help",
        text: "Límite de 800 caracteres",
        hidden: true
      });
      nodes.send = button(doc, "Enviar", "nexo-assistant-send", { "aria-label": "Enviar mensaje" });
      nodes.status = createElement(doc, "p", "nexo-assistant-status", { "aria-live": "polite" });
      const privacy = createElement(doc, "p", "nexo-assistant-privacy", {
        text: "La información que escribas se utiliza únicamente para preparar esta orientación y el resumen que tú decidas enviar por WhatsApp."
      });
      const clear = button(doc, "Borrar conversación", "nexo-assistant-clear");
      clear.addEventListener("click", () => resetConversation(true));
      nodes.input.addEventListener("input", updateCounter);
      nodes.input.addEventListener("keydown", handleInputKey);
      nodes.send.addEventListener("click", sendCurrentInput);
      return appendChildren(wrapper, [label, nodes.input, nodes.send, nodes.counter, nodes.status, privacy, clear]);
    }

    function open() {
      if (state.open) return;
      previousFocus = doc.activeElement;
      state.open = true;
      state.lastScrollY = typeof win.scrollY === "number" ? win.scrollY : 0;
      nodes.panel.hidden = false;
      nodes.backdrop.hidden = false;
      nodes.launcher.setAttribute("aria-expanded", "true");
      doc.body.classList.add("nexo-assistant-open");
      const focusInput = () => {
        if (nodes.input && nodes.input.focus) nodes.input.focus();
      };
      if (win.setTimeout) {
        win.setTimeout(focusInput, 30);
      } else {
        focusInput();
      }
    }

    function close() {
      if (!state.open) return;
      state.open = false;
      nodes.panel.hidden = true;
      nodes.backdrop.hidden = true;
      nodes.launcher.setAttribute("aria-expanded", "false");
      doc.body.classList.remove("nexo-assistant-open");
      if (previousFocus && previousFocus.focus) previousFocus.focus();
      if (win.scrollTo) win.scrollTo({ top: state.lastScrollY, left: 0 });
    }

    function handleDocumentKey(event) {
      if (event.key === "Escape" && state.open) close();
    }

    function trapFocus(event) {
      if (event.key !== "Tab") return;
      const focusable = Array.from(nodes.panel.querySelectorAll(FOCUSABLE)).filter((item) => !item.hidden && item.offsetParent !== null);
      if (!focusable.length) return;
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

    function updateCounter() {
      const max = Number(config.maxMessageLength || 800);
      const length = nodes.input.value.length;
      nodes.counter.hidden = length < max - 80;
      nodes.counter.textContent = `${length}/${max} caracteres`;
      nodes.status.textContent = length >= max ? "Llegaste al límite de 800 caracteres." : "";
    }

    function handleInputKey(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendCurrentInput();
      }
    }

    function sendCurrentInput() {
      sendMessage(nodes.input.value);
      nodes.input.value = "";
      updateCounter();
    }

    function sendMessage(message) {
      const max = Number(config.maxMessageLength || 800);
      const clean = text(message, max + 1);
      if (!clean) {
        nodes.status.textContent = "Escribe una pregunta o comparte un dato de tu negocio.";
        return null;
      }
      if (clean.length > max) {
        addNotice("Tu mensaje supera el límite de 800 caracteres. Recórtalo un poco para poder revisarlo.");
        return null;
      }
      addMessage("visitor", clean);
      const response = engine.generateDemoResponse({
        message: clean,
        leadContext: state.leadContext,
        conversation: state.messages,
        knowledge
      });
      state.leadContext = engine.mergeLeadContext(state.leadContext, response.collectedData || {});
      addMessage("assistant", response.reply);
      if (response.recommendedPlan) {
        state.currentRecommendation = engine.recommendPlan(state.leadContext, knowledge);
        renderRecommendation(state.currentRecommendation);
      }
      renderActions(response.suggestedActions || INITIAL_ACTIONS.map((item) => item.action));
      return response;
    }

    function addMessage(sender, message) {
      const article = createElement(doc, "article", `nexo-assistant-message nexo-assistant-message--${sender}`);
      const label = createElement(doc, "span", "nexo-assistant-message-label", { text: sender === "assistant" ? "NEXO Asistente" : "Tú" });
      const bubble = createElement(doc, "p", "nexo-assistant-bubble", { text: message });
      appendChildren(article, [label, bubble]);
      nodes.messages.appendChild(article);
      state.messages.push({ sender, message: text(message, 1200) });
      scrollMessages();
      return article;
    }

    function addNotice(message) {
      const notice = createElement(doc, "p", "nexo-assistant-notice", { text: message });
      nodes.messages.appendChild(notice);
      scrollMessages();
      return notice;
    }

    function renderActions(actions) {
      removeActionGroups();
      const safeActions = engine.sanitizeSuggestedActions(actions || []).slice(0, MAX_ACTIONS);
      const group = createElement(doc, "div", "nexo-assistant-actions", { "data-action-group": "true" });
      safeActions.forEach((action) => {
        const label = ACTION_LABELS[action] || action;
        const actionButton = button(doc, label, "nexo-assistant-action", { dataset: { action } });
        actionButton.addEventListener("click", () => handleAction(action));
        group.appendChild(actionButton);
      });
      nodes.messages.appendChild(group);
      scrollMessages();
    }

    function removeActionGroups() {
      Array.from(nodes.messages.querySelectorAll("[data-action-group='true']")).forEach((node) => node.remove());
    }

    function handleAction(action) {
      const safeAction = engine.isAllowedAction(action) ? action : "";
      if (!safeAction) return;
      if (safeAction === "start_analysis" || safeAction === "continue_analysis") {
        startGuidedAnalysis();
        return;
      }
      if (safeAction === "show_plans" || safeAction === "show_plan_details") {
        renderPackages();
        return;
      }
      if (safeAction === "show_portfolio" || safeAction === "ask_portfolio") {
        renderPortfolio();
        return;
      }
      if (safeAction === "generate_structure") {
        renderStructure();
        return;
      }
      if (safeAction === "generate_visual_direction") {
        renderVisualDirection();
        return;
      }
      if (safeAction === "build_summary" || safeAction === "open_whatsapp") {
        renderSummary();
        return;
      }
      if (safeAction === "request_human") {
        renderHumanContact();
        return;
      }
      if (safeAction === "restart") {
        resetConversation(true);
      }
    }

    function renderWelcome() {
      addMessage(
        "assistant",
        "Hola, soy el asistente digital de NEXO26. Puedo explicarte nuestros servicios, ayudarte a identificar qué opción podría ajustarse a tu negocio y preparar un resumen para continuar por WhatsApp."
      );
      renderActions(INITIAL_ACTIONS.map((item) => item.action));
    }

    function resetConversation(showNotice) {
      if (!nodes.messages) return;
      nodes.messages.textContent = "";
      state.messages = [];
      state.leadContext = engine.createLeadContext({});
      state.currentRecommendation = null;
      state.guided = { active: false, index: 0 };
      guidedNode = null;
      if (showNotice) addNotice("Conversación borrada. Podemos empezar de nuevo.");
      renderWelcome();
    }

    function renderPackages() {
      removeActionGroups();
      addMessage("assistant", "Estos son los paquetes base. La cotización final depende del alcance, materiales y funciones.");
      const grid = createElement(doc, "div", "nexo-assistant-card-grid");
      (knowledge.plans || []).forEach((plan) => {
        const card = createElement(doc, "article", `nexo-assistant-info-card ${plan.id === "professional" ? "is-featured" : ""}`);
        const title = createElement(doc, "h3", "", { text: plan.name });
        const price = createElement(doc, "p", "nexo-assistant-price", { text: plan.price });
        const summary = createElement(doc, "p", "", { text: plan.summary });
        const details = list(doc, [
          plan.payment,
          plan.delivery,
          plan.scope && plan.scope.domain,
          plan.scope && `${plan.scope.revisions} ronda${plan.scope.revisions === 1 ? "" : "s"} de cambios`
        ]);
        const cta = button(doc, `Preparar resumen de ${plan.name}`, "nexo-assistant-card-button");
        cta.addEventListener("click", () => prepareWhatsAppForPlan(plan.id));
        appendChildren(card, [title, price, summary, details, cta]);
        grid.appendChild(card);
      });
      nodes.messages.appendChild(grid);
      renderActions(["start_analysis", "build_summary", "request_human"]);
      scrollMessages();
    }

    function renderPortfolio() {
      removeActionGroups();
      addMessage("assistant", "Estos proyectos publicados muestran enfoques reales para distintos giros. Los conceptos en borrador no se muestran aquí.");
      const grid = createElement(doc, "div", "nexo-assistant-card-grid");
      engine.getPublicPortfolio(knowledge).slice(0, 6).forEach((project) => {
        const card = createElement(doc, "article", "nexo-assistant-info-card");
        appendChildren(card, [
          createElement(doc, "h3", "", { text: project.name }),
          createElement(doc, "p", "nexo-assistant-tag", { text: project.industry || project.category || "Proyecto publicado" }),
          createElement(doc, "p", "", { text: project.description || "Concepto visual publicado de NEXO26 Digital." })
        ]);
        const cta = button(doc, "Preparar resumen similar", "nexo-assistant-card-button");
        cta.addEventListener("click", () => prepareContextualWhatsApp(`Hola, vi el proyecto ${project.name} y me gustaria solicitar algo similar para mi negocio.`));
        card.appendChild(cta);
        grid.appendChild(card);
      });
      nodes.messages.appendChild(grid);
      renderActions(["start_analysis", "show_plans", "request_human"]);
      scrollMessages();
    }

    function renderRecommendation(recommendation) {
      const rec = recommendation || engine.recommendPlan(state.leadContext, knowledge);
      const plan = getPlan(knowledge, rec.planId);
      const card = createElement(doc, "article", "nexo-assistant-recommendation");
      appendChildren(card, [
        createElement(doc, "p", "nexo-assistant-tag", { text: "Orientación inicial" }),
        createElement(doc, "h3", "", { text: plan ? `Podría ajustarse ${plan.name}` : "Conviene revisar una actualización" }),
        createElement(doc, "p", "nexo-assistant-price", { text: plan ? plan.price : "Alcance por revisar" }),
        createElement(doc, "p", "", { text: "No es una cotización definitiva; falta confirmar materiales, funciones y alcance." })
      ]);
      if (rec.reasons && rec.reasons.length) {
        card.appendChild(list(doc, rec.reasons, "nexo-assistant-list"));
      }
      if (rec.limitations && rec.limitations.length) {
        card.appendChild(createElement(doc, "p", "nexo-assistant-warning", { text: rec.limitations.join(" ") }));
      }
      const alternatives = createElement(doc, "div", "nexo-assistant-alt-row");
      const lower = getAlternativePlan(knowledge, rec, "lower");
      const higher = getAlternativePlan(knowledge, rec, "higher");
      if (lower) {
        const lowerButton = button(doc, `Alternativa economica: ${lower.name}`, "nexo-assistant-action");
        lowerButton.addEventListener("click", () => prepareWhatsAppForPlan(lower.id));
        alternatives.appendChild(lowerButton);
      }
      if (higher) {
        const higherButton = button(doc, `Alternativa completa: ${higher.name}`, "nexo-assistant-action");
        higherButton.addEventListener("click", () => prepareWhatsAppForPlan(higher.id));
        alternatives.appendChild(higherButton);
      }
      const summaryButton = button(doc, "Preparar resumen", "nexo-assistant-card-button");
      summaryButton.addEventListener("click", renderSummary);
      appendChildren(card, [alternatives, summaryButton]);
      nodes.messages.appendChild(card);
      scrollMessages();
    }

    function renderStructure() {
      removeActionGroups();
      const structure = engine.generateBusinessStructure(state.leadContext, knowledge);
      addMessage("assistant", "Puedo darte una estructura inicial para ordenar la información de tu negocio.");
      const card = createElement(doc, "article", "nexo-assistant-info-card");
      card.appendChild(createElement(doc, "h3", "", { text: structure.title }));
      (structure.sections || []).forEach((section) => {
        const sectionNode = createElement(doc, "div", "nexo-assistant-section-row");
        appendChildren(sectionNode, [
          createElement(doc, "strong", "", { text: section.name }),
          createElement(doc, "p", "", { text: section.purpose })
        ]);
        card.appendChild(sectionNode);
      });
      card.appendChild(createElement(doc, "p", "nexo-assistant-warning", { text: "Esta es una orientación inicial, no una maqueta personalizada ni una propuesta final." }));
      nodes.messages.appendChild(card);
      renderActions(["generate_visual_direction", "build_summary", "request_human"]);
      scrollMessages();
    }

    function renderVisualDirection() {
      removeActionGroups();
      const visual = engine.generateVisualDirection(state.leadContext);
      addMessage("assistant", "También puedo sugerir una dirección visual breve para que el sitio se sienta confiable y claro.");
      const card = createElement(doc, "article", "nexo-assistant-info-card");
      appendChildren(card, [
        createElement(doc, "h3", "", { text: "Dirección visual sugerida" }),
        list(doc, [
          `Estilo: ${visual.style}`,
          `Paleta: ${visual.palette}`,
          `Fotografías: ${visual.photography}`,
          `Tono: ${visual.tone}`,
          `Jerarquía: ${visual.hierarchy}`,
          `CTA: ${visual.cta}`,
          `Evitar: ${(visual.avoid || []).slice(0, 4).join(", ")}`
        ])
      ]);
      nodes.messages.appendChild(card);
      renderActions(["generate_structure", "build_summary", "request_human"]);
      scrollMessages();
    }

    function renderSummary() {
      removeActionGroups();
      const recommendation = state.currentRecommendation || engine.recommendPlan(state.leadContext, knowledge);
      state.currentRecommendation = recommendation;
      const summary = engine.buildLeadSummary(state.leadContext, recommendation, knowledge);
      addMessage("assistant", "Preparé un resumen para WhatsApp. No se enviará nada hasta que tú pulses el botón.");
      const card = createElement(doc, "article", "nexo-assistant-summary");
      const pre = createElement(doc, "pre", "nexo-assistant-summary-text", { text: summary.text });
      const link = createElement(doc, "a", "nexo-assistant-card-button", {
        href: summary.whatsappUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        text: "Continuar por WhatsApp"
      });
      const modify = button(doc, "Modificar informacion", "nexo-assistant-action");
      modify.addEventListener("click", () => {
        state.guided.index = 0;
        startGuidedAnalysis();
      });
      const human = createElement(doc, "a", "nexo-assistant-action", {
        href: createWhatsAppUrl(officialNumber(), "Hola, quiero hablar con una persona de NEXO26 Digital para revisar mi proyecto."),
        target: "_blank",
        rel: "noopener noreferrer",
        text: "Continuar por WhatsApp"
      });
      appendChildren(card, [pre, link, modify, human]);
      nodes.messages.appendChild(card);
      renderActions(["generate_structure", "generate_visual_direction", "restart"]);
      scrollMessages();
    }

    function renderHumanContact() {
      removeActionGroups();
      addMessage("assistant", "Claro. Puedo dejarte un mensaje contextual para hablar con una persona y revisar el alcance sin prometer condiciones automáticas.");
      const card = createElement(doc, "article", "nexo-assistant-info-card");
      const href = createWhatsAppUrl(officialNumber(), "Hola, quiero hablar con una persona de NEXO26 Digital para orientar mi negocio.");
      const link = createElement(doc, "a", "nexo-assistant-card-button", {
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        text: "Continuar por WhatsApp"
      });
      card.appendChild(createElement(doc, "p", "", { text: "Se abrirá WhatsApp en una nueva pestaña cuando pulses el botón." }));
      card.appendChild(link);
      nodes.messages.appendChild(card);
      renderActions(["start_analysis", "show_plans", "build_summary"]);
      scrollMessages();
    }

    function startGuidedAnalysis() {
      removeActionGroups();
      state.guided.active = true;
      if (!state.guided.index) state.guided.index = 0;
      renderGuidedStep();
    }

    function renderGuidedStep() {
      if (guidedNode) guidedNode.remove();
      const step = GUIDED_STEPS[state.guided.index];
      guidedNode = createElement(doc, "article", "nexo-assistant-step-card", { "data-guided-step": step.id });
      appendChildren(guidedNode, [
        createElement(doc, "p", "nexo-assistant-progress", { text: `Paso ${state.guided.index + 1} de ${GUIDED_STEPS.length}` }),
        createElement(doc, "h3", "", { text: step.label }),
        createElement(doc, "p", "", { text: step.question }),
        createStepControl(step),
        createStepActions()
      ]);
      nodes.messages.appendChild(guidedNode);
      scrollMessages();
    }

    function createStepControl(step) {
      const wrap = createElement(doc, "div", "nexo-assistant-step-control");
      if (step.type === "text") {
        wrap.appendChild(createElement(doc, "input", "", {
          type: "text",
          value: state.leadContext[step.fields[0]] || "",
          placeholder: step.placeholder,
          "data-step-field": step.fields[0]
        }));
      }
      if (step.type === "pair") {
        step.fields.forEach((field, index) => {
          wrap.appendChild(createElement(doc, "input", "", {
            type: "text",
            value: state.leadContext[field] || "",
            placeholder: step.placeholders[index],
            "data-step-field": field
          }));
        });
      }
      if (step.type === "numbers") {
        [
          ["branches", "Ubicaciones", state.leadContext.branches || ""],
          ["serviceCount", "Servicios aproximados", state.leadContext.serviceCount || ""]
        ].forEach(([field, placeholder, value]) => {
          wrap.appendChild(createElement(doc, "input", "", {
            type: "number",
            min: "1",
            max: "99",
            value,
            placeholder,
            "data-step-field": field
          }));
        });
      }
      if (step.type === "number-single") {
        wrap.appendChild(createElement(doc, "input", "", {
          type: "number",
          min: "1",
          max: "99",
          value: state.leadContext[step.fields[0]] || "",
          placeholder: step.placeholder,
          "data-step-field": step.fields[0]
        }));
      }
      if (step.type === "channels") {
        ["WhatsApp", "Instagram", "Facebook", "Google Maps", "Solo recomendaciones"].forEach((option) => {
          wrap.appendChild(checkOption(option, "channel", state.leadContext.currentChannels || []));
        });
        wrap.appendChild(radioGroup("nexo-uses-whatsapp", [
          ["yes", "Sí uso WhatsApp"],
          ["no", "No lo uso todavía"]
        ], state.leadContext.usesWhatsApp === true ? "yes" : state.leadContext.usesWhatsApp === false ? "no" : ""));
      }
      if (step.type === "website") {
        wrap.appendChild(radioGroup("nexo-has-website", [
          ["yes", "Sí, ya tengo"],
          ["no", "No tengo página"]
        ], state.leadContext.hasWebsite === true ? "yes" : state.leadContext.hasWebsite === false ? "no" : ""));
        wrap.appendChild(createElement(doc, "input", "", {
          type: "text",
          value: state.leadContext.websiteCondition || "",
          placeholder: "Ej. está desactualizada, no carga bien, falta ordenar contenido",
          "data-step-field": "websiteCondition"
        }));
      }
      if (step.type === "checks") {
        step.options.forEach((option) => {
          wrap.appendChild(checkOption(option, "check", state.leadContext[step.fields[0]] || []));
        });
      }
      if (step.type === "materials") {
        ["Logo", "Fotos", "Servicios", "Precios", "Ubicación", "Nada organizado"].forEach((option) => {
          wrap.appendChild(checkOption(option, "material", state.leadContext.availableMaterials || []));
        });
        wrap.appendChild(radioGroup("nexo-urgency", [
          ["Sin prisa", "Sin prisa"],
          ["Esta semana", "Esta semana"],
          ["Urgente", "Urgente"]
        ], state.leadContext.urgency || ""));
      }
      if (step.type === "domain") {
        wrap.appendChild(radioGroup("nexo-has-domain", [
          ["yes", "Si, ya tengo dominio"],
          ["no", "No tengo dominio todavia"]
        ], state.leadContext.hasDomain === true ? "yes" : state.leadContext.hasDomain === false ? "no" : ""));
      }
      if (step.type === "urgency") {
        wrap.appendChild(radioGroup("nexo-deadline", [
          ["Sin prisa", "Sin prisa"],
          ["Esta semana", "Esta semana"],
          ["En 2 semanas", "En 2 semanas"],
          ["Lo antes posible", "Lo antes posible"]
        ], state.leadContext.urgency || ""));
      }
      return wrap;
    }

    function checkOption(option, kind, selectedValues) {
      const label = createElement(doc, "label", "nexo-assistant-check");
      const input = createElement(doc, "input", "", {
        type: "checkbox",
        value: option
      });
      input.checked = (selectedValues || []).some((value) => String(value).toLowerCase() === option.toLowerCase());
      input.dataset[kind === "channel" ? "channel" : kind === "material" ? "material" : "checkOption"] = "true";
      label.appendChild(input);
      label.appendChild(createElement(doc, "span", "", { text: option }));
      return label;
    }

    function radioGroup(name, options, selected) {
      const group = createElement(doc, "div", "nexo-assistant-radio-group");
      options.forEach(([value, labelText]) => {
        const label = createElement(doc, "label", "nexo-assistant-check");
        const input = createElement(doc, "input", "", { type: "radio", name, value });
        input.checked = selected === value;
        label.appendChild(input);
        label.appendChild(createElement(doc, "span", "", { text: labelText }));
        group.appendChild(label);
      });
      return group;
    }

    function createStepActions() {
      const actions = createElement(doc, "div", "nexo-assistant-step-actions");
      const previous = button(doc, "Anterior", "nexo-assistant-action");
      const skip = button(doc, "Omitir", "nexo-assistant-action");
      const cancel = button(doc, "Cancelar análisis", "nexo-assistant-action");
      const next = button(doc, state.guided.index === GUIDED_STEPS.length - 1 ? "Ver recomendación" : "Continuar", "nexo-assistant-card-button");
      previous.disabled = state.guided.index === 0;
      previous.addEventListener("click", () => {
        collectStep();
        state.guided.index = Math.max(0, state.guided.index - 1);
        renderGuidedStep();
      });
      skip.addEventListener("click", () => {
        if (state.guided.index >= GUIDED_STEPS.length - 1) {
          finishGuidedAnalysis();
          return;
        }
        state.guided.index += 1;
        renderGuidedStep();
      });
      cancel.addEventListener("click", () => {
        if (guidedNode) guidedNode.remove();
        guidedNode = null;
        state.guided.active = false;
        addNotice("Análisis cancelado. Puedes escribir una pregunta o ver paquetes.");
        renderActions(["show_plans", "request_human", "restart"]);
      });
      next.addEventListener("click", () => {
        collectStep();
        if (state.guided.index >= GUIDED_STEPS.length - 1) {
          finishGuidedAnalysis();
          return;
        }
        state.guided.index += 1;
        renderGuidedStep();
      });
      return appendChildren(actions, [previous, skip, cancel, next]);
    }

    function collectStep() {
      const step = GUIDED_STEPS[state.guided.index];
      const patch = createLeadPatchForStep(step, guidedNode);
      state.leadContext = engine.mergeLeadContext(state.leadContext, patch);
    }

    function finishGuidedAnalysis() {
      if (guidedNode) guidedNode.remove();
      guidedNode = null;
      state.guided.active = false;
      state.currentRecommendation = engine.recommendPlan(state.leadContext, knowledge);
      addMessage("assistant", "Con la información compartida, ya puedo darte una orientación inicial.");
      renderRecommendation(state.currentRecommendation);
      renderActions(["generate_structure", "generate_visual_direction", "build_summary", "request_human"]);
    }

    function renderWhatsAppContinuation(message, href, preview) {
      removeActionGroups();
      addMessage("assistant", message);
      const card = createElement(doc, "article", "nexo-assistant-summary");
      const notice = createElement(doc, "p", "", { text: "No se enviara nada desde esta pagina. WhatsApp se abrira solo si pulsas el boton." });
      const children = [notice];
      if (preview) {
        children.push(createElement(doc, "pre", "nexo-assistant-summary-text", { text: preview }));
      }
      children.push(createElement(doc, "a", "nexo-assistant-card-button", {
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        text: "Continuar por WhatsApp"
      }));
      appendChildren(card, children);
      nodes.messages.appendChild(card);
      renderActions(["start_analysis", "show_plans", "restart"]);
      scrollMessages();
    }

    function prepareWhatsAppForPlan(planId) {
      const plan = getPlan(knowledge, planId);
      const recommendation = {
        planId,
        planName: plan ? plan.name : "Proyecto por revisar",
        reasons: [`Me interesa revisar ${plan ? plan.name : "este alcance"}.`]
      };
      const summary = engine.buildLeadSummary(state.leadContext, recommendation, knowledge);
      renderWhatsAppContinuation(
        `Listo. Prepare un resumen para revisar ${plan ? plan.name : "este alcance"} por WhatsApp.`,
        summary.whatsappUrl,
        summary.text
      );
    }

    function prepareContextualWhatsApp(message) {
      const clean = text(message, 500);
      renderWhatsAppContinuation(
        "Listo. Prepare un mensaje contextual para continuar por WhatsApp.",
        createWhatsAppUrl(officialNumber(), clean),
        clean
      );
    }

    function officialNumber() {
      return (knowledge.officialLinks && knowledge.officialLinks.whatsappNumber) || config.officialWhatsappNumber || DEFAULT_WHATSAPP;
    }

    function scrollMessages() {
      if (nodes.messages) nodes.messages.scrollTop = nodes.messages.scrollHeight;
    }

    function destroy() {
      doc.removeEventListener("keydown", handleDocumentKey);
      if (nodes.root && nodes.root.remove) nodes.root.remove();
    }

    const api = Object.freeze({
      mount,
      open,
      close,
      destroy,
      resetConversation,
      sendMessage,
      handleAction,
      getState: () => state,
      getNodes: () => nodes
    });

    return api;
  }

  function mount(options) {
    const controller = createController(options || { root, document: root.document });
    controller.mount();
    return controller;
  }

  return Object.freeze({
    version: VERSION,
    initialActions: INITIAL_ACTIONS,
    guidedSteps: GUIDED_STEPS,
    createInitialState,
    createLeadPatchForStep,
    createWhatsAppUrl,
    createController,
    mount
  });
});
