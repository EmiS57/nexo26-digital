(function () {
  "use strict";

  const config = window.MAREA_CONFIG || {};
  const state = {
    selectedExperience: "",
    name: "",
    contact: "",
    preferredDate: "",
    preferredTime: "",
    comment: ""
  };

  function text(value, limit) {
    const clean = String(value == null ? "" : value)
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return typeof limit === "number" ? clean.slice(0, limit) : clean;
  }

  function create(tag, className, attrs) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value == null || value === false) return;
      if (key === "text") {
        node.textContent = String(value);
      } else if (key === "dataset") {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          node.dataset[dataKey] = String(dataValue);
        });
      } else {
        node.setAttribute(key, String(value));
      }
    });
    return node;
  }

  function append(parent, children) {
    children.filter(Boolean).forEach((child) => parent.appendChild(child));
    return parent;
  }

  function whatsappUrl(message) {
    const number = text(config.nexoWhatsappNumber || "5215517973390", 20);
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function buildAdaptMessage() {
    return text(config.whatsappMessage, 500);
  }

  function buildSummary() {
    const lines = [
      "Hola, estuve probando el concepto Marea Wellness Studio de NEXO26.",
      "",
      "Me interesa conocer cómo podría adaptarse una página con asistente para mi negocio.",
      "",
      state.selectedExperience ? `Experiencia seleccionada: ${state.selectedExperience}` : "",
      state.name ? `Nombre: ${state.name}` : "",
      state.contact ? `Medio de contacto: ${state.contact}` : "",
      state.preferredDate ? `Fecha preferida: ${state.preferredDate}` : "",
      state.preferredTime ? `Horario preferido: ${state.preferredTime}` : "",
      state.comment ? `Comentario: ${state.comment}` : "",
      "",
      "Giro:",
      "Servicios aproximados:",
      "Funciones que me interesan:",
      "Ciudad o zona:",
      "",
      "Me gustaría recibir orientación."
    ].filter((line) => line !== "");

    return lines.join("\n");
  }

  function renderServices() {
    const target = document.querySelector("[data-services]");
    if (!target) return;
    (config.services || []).forEach((service) => {
      const card = create("article", "service-card");
      append(card, [
        create("h3", "", { text: service.name }),
        create("p", "", { text: service.summary }),
        create("p", "", { text: service.detail })
      ]);
      const meta = create("div", "service-meta");
      meta.appendChild(create("span", "", { text: `Precio: ${service.price}` }));
      meta.appendChild(create("span", "", { text: `Duracion: ${service.duration}` }));
      card.appendChild(meta);
      target.appendChild(card);
    });
  }

  function renderExperiences() {
    const target = document.querySelector("[data-experiences]");
    if (!target) return;
    (config.experiences || []).forEach((item) => {
      target.appendChild(create("li", "", { text: item }));
    });
  }

  function renderFaqs() {
    const target = document.querySelector("[data-faqs]");
    if (!target) return;
    (config.faqs || []).forEach((faq) => {
      const details = create("details", "faq-item");
      details.appendChild(create("summary", "", { text: faq.question }));
      details.appendChild(create("p", "", { text: faq.answer }));
      target.appendChild(details);
    });
  }

  function initMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("is-menu-open", !isOpen);
    });
    nav.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("is-menu-open");
    });
  }

  function message(body, sender) {
    const article = create("article", `marea-message marea-message--${sender}`);
    article.appendChild(create("span", "marea-message__label", { text: sender === "assistant" ? "Asistente Marea" : "Tu" }));
    article.appendChild(create("p", "marea-message__bubble", { text: body }));
    return article;
  }

  function action(label, handler) {
    const button = create("button", "marea-action", { type: "button", text: label });
    button.addEventListener("click", handler);
    return button;
  }

  function scrollAssistant(body) {
    body.scrollTop = body.scrollHeight;
  }

  function renderActions(body) {
    const actions = create("div", "marea-actions");
    append(actions, [
      action("Presentar servicios", () => explainServices(body)),
      action("Cómo funcionaría la atención", () => explainDigitalCare(body)),
      action("Preguntas frecuentes", () => explainFaq(body)),
      action("Recopilar solicitud", () => renderForm(body)),
      action("Solicitar adaptacion", () => renderAdaptation(body))
    ]);
    body.appendChild(actions);
    scrollAssistant(body);
  }

  function clearActionGroups(body) {
    body.querySelectorAll(".marea-actions").forEach((node) => node.remove());
  }

  function addAssistant(body, copy) {
    body.appendChild(message(copy, "assistant"));
    scrollAssistant(body);
  }

  function explainServices(body) {
    clearActionGroups(body);
    addAssistant(
      body,
      "El concepto muestra servicios genéricos de bienestar con precio en consultar y duración adaptable. Todo el contenido final se define con datos reales del negocio."
    );
    renderActions(body);
  }

  function explainDigitalCare(body) {
    clearActionGroups(body);
    addAssistant(
      body,
      "La atención digital funcionaría como una guía: presenta opciones, recopila preferencias y prepara un resumen para WhatsApp. No consulta disponibilidad real ni confirma citas."
    );
    renderActions(body);
  }

  function explainFaq(body) {
    clearActionGroups(body);
    addAssistant(
      body,
      "Este concepto no representa un negocio real. Sirve para mostrar cómo se podría adaptar una página con asistente, información clara y contacto voluntario por WhatsApp."
    );
    renderActions(body);
  }

  function renderForm(body) {
    clearActionGroups(body);
    body.appendChild(message("Vamos a preparar una solicitud demostrativa. Puedes dejar campos vacios si solo quieres ver el flujo.", "assistant"));
    const form = create("form", "marea-form");
    const serviceOptions = ["", ...(config.services || []).map((service) => service.name)];
    append(form, [
      field("Seleccionar experiencia", "select", "selectedExperience", serviceOptions),
      field("Nombre", "text", "name", [], "Nombre opcional"),
      field("Medio de contacto", "text", "contact", [], "WhatsApp o correo de referencia"),
      field("Fecha preferida", "text", "preferredDate", [], "Ej. esta semana"),
      field("Horario preferido", "text", "preferredTime", [], "Ej. por la tarde"),
      field("Comentario", "textarea", "comment", [], "Cuéntanos qué te gustaría adaptar")
    ]);
    const actions = create("div", "marea-form-actions");
    const submit = create("button", "marea-submit", { type: "submit", text: "Mostrar resumen" });
    const cancel = action("Cancelar", () => {
      form.remove();
      addAssistant(body, "Solicitud cancelada. No se guardó información.");
      renderActions(body);
    });
    append(actions, [cancel, submit]);
    form.appendChild(actions);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      Array.from(form.elements).forEach((input) => {
        if (!input.name) return;
        state[input.name] = text(input.value, 300);
      });
      renderSummary(body, form);
    });
    body.appendChild(form);
    scrollAssistant(body);
  }

  function field(labelText, type, name, options, placeholder) {
    const wrapper = create("div", "marea-field");
    const id = `marea-${name}`;
    wrapper.appendChild(create("label", "", { for: id, text: labelText }));
    if (type === "select") {
      const select = create("select", "", { id, name });
      options.forEach((option) => {
        select.appendChild(create("option", "", { value: option, text: option || "Selecciona una opcion" }));
      });
      select.value = state[name] || "";
      wrapper.appendChild(select);
      return wrapper;
    }
    if (type === "textarea") {
      wrapper.appendChild(create("textarea", "", { id, name, rows: "3", placeholder, text: state[name] || "" }));
      return wrapper;
    }
    wrapper.appendChild(create("input", "", { id, name, type, value: state[name] || "", placeholder }));
    return wrapper;
  }

  function renderSummary(body, form) {
    if (form) form.remove();
    const summaryText = buildSummary();
    const card = create("article", "marea-summary");
    append(card, [
      create("p", "marea-note", {
        text: "No se enviará nada hasta que pulses voluntariamente el botón de WhatsApp."
      }),
      create("pre", "", { text: summaryText })
    ]);
    const link = create("a", "marea-link", {
      href: whatsappUrl(summaryText),
      target: "_blank",
      rel: "noopener noreferrer",
      text: "Enviar resumen a NEXO26 por WhatsApp"
    });
    const modify = action("Modificar datos", () => {
      card.remove();
      renderForm(body);
    });
    const restart = action("Reiniciar", () => resetAssistant(body));
    append(card, [link, modify, restart]);
    body.appendChild(card);
    scrollAssistant(body);
  }

  function renderAdaptation(body) {
    clearActionGroups(body);
    const card = create("article", "marea-summary");
    card.appendChild(create("p", "marea-note", {
      text: "Este boton contacta a NEXO26 para adaptar el concepto a otro negocio. No contacta a un estudio ficticio."
    }));
    card.appendChild(create("a", "marea-link", {
      href: whatsappUrl(buildAdaptMessage()),
      target: "_blank",
      rel: "noopener noreferrer",
      text: "Adaptar este ecosistema a mi negocio"
    }));
    body.appendChild(card);
    renderActions(body);
  }

  function resetAssistant(body) {
    Object.keys(state).forEach((key) => {
      state[key] = "";
    });
    body.textContent = "";
    body.appendChild(message(
      "Hola, soy el Asistente Marea. Esta es una demostración conceptual: no consulta disponibilidad real, no confirma citas y no guarda información.",
      "assistant"
    ));
    renderActions(body);
  }

  function initAssistant() {
    const mount = document.querySelector("[data-marea-assistant]");
    if (!mount) return;
    const shell = create("section", "marea-assistant", {
      "aria-labelledby": "marea-assistant-title",
      "aria-describedby": "marea-assistant-desc"
    });
    const header = create("header", "marea-assistant__header");
    append(header, [
      create("h3", "", { id: "marea-assistant-title", text: "Asistente Marea" }),
      create("p", "", { id: "marea-assistant-desc", text: "Demostración de atención digital" })
    ]);
    const body = create("div", "marea-assistant__body", { "aria-live": "polite" });
    append(shell, [header, body]);
    mount.appendChild(shell);
    resetAssistant(body);
  }

  function initWhatsAppLinks() {
    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
      link.setAttribute("href", whatsappUrl(buildAdaptMessage()));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function init() {
    renderServices();
    renderExperiences();
    renderFaqs();
    initMenu();
    initAssistant();
    initWhatsAppLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
