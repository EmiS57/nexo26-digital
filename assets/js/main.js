(function () {
  "use strict";

  const config = window.NEXO_CONFIG || {};
  const data = window.NEXO_DATA || {};
  const root = document.documentElement;
  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add("js");

  const selectors = {
    header: "[data-header]",
    menu: "[data-menu]",
    menuToggle: "[data-menu-toggle]",
    whatsappLink: "[data-whatsapp-link]"
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const allServices = [
    ...(data.webPackages || []),
    ...(data.commerceServices || []),
    ...(data.supportServices || [])
  ];

  const serviceById = allServices.reduce((map, service) => {
    map[service.id] = service;
    return map;
  }, {});

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizePhone(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function defaultMessage(topic) {
    return `Hola, quiero recibir información de ${config.brandName || "NEXO26 Digital"}${topic ? ` sobre ${topic}` : ""}.`;
  }

  function buildWhatsAppHref(message) {
    const phone = normalizePhone(config.whatsappNumber);
    const text = encodeURIComponent(message || defaultMessage(""));

    if (phone) {
      return `https://wa.me/${phone}?text=${text}`;
    }

    const publicLink = config.whatsappPublicLink || "";
    if (!publicLink) {
      return "#contacto";
    }

    try {
      const url = new URL(publicLink);
      const isDirectMessageLink = url.pathname.includes("/message/");
      if (!isDirectMessageLink && message) {
        url.searchParams.set("text", message);
      }
      return url.toString();
    } catch (error) {
      return publicLink;
    }
  }

  function setWhatsAppLinks() {
    $$(selectors.whatsappLink).forEach((link) => {
      const topic = link.dataset.topic || "";
      link.href = buildWhatsAppHref(defaultMessage(topic));
      link.target = "_blank";
      link.rel = "noreferrer";
    });
  }

  function setContactData() {
    const phone = config.displayPhone || config.whatsappNumber || "";
    const phoneRows = $$("[data-contact-phone]");
    const emailRows = $$("[data-contact-email]");

    phoneRows.forEach((row) => {
      if (!phone) {
        row.hidden = true;
        return;
      }
      row.hidden = false;
      row.href = buildWhatsAppHref(defaultMessage("contacto"));
      const text = $("[data-phone-text]", row);
      if (text) text.textContent = phone;
    });

    emailRows.forEach((row) => {
      if (!config.email) {
        row.hidden = true;
        return;
      }
      row.hidden = false;
      row.href = `mailto:${config.email}`;
      const text = $("[data-email-text]", row);
      if (text) text.textContent = config.email;
    });

    const instagramLink = $("[data-instagram-link]");
    if (instagramLink && config.instagram) {
      instagramLink.href = config.instagram;
    }
  }

  function renderCollections() {
    const target = $("#collections-grid");
    if (!target || !data.collections) return;

    target.innerHTML = data.collections
      .map((collection) => {
        const items = collection.items.map((item) => `<li>${escapeHTML(item)}</li>`).join("");
        return `
          <article class="collection-card">
            <h3>${escapeHTML(collection.name)}</h3>
            <p>${escapeHTML(collection.summary)}</p>
            <ul>${items}</ul>
          </article>
        `;
      })
      .join("");
  }

  function featureList(items) {
    return `<ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
  }

  function renderPackageCard(pack) {
    const badge = pack.badge ? `<span class="card-badge">${escapeHTML(pack.badge)}</span>` : "";
    const notes = pack.notes && pack.notes.length
      ? `<div class="card-notes">${pack.notes.map((note) => `<p>${escapeHTML(note)}</p>`).join("")}</div>`
      : "";

    return `
      <article class="pricing-card ${pack.id === "profesional" ? "is-featured" : ""}">
        <div class="card-top">
          ${badge}
          <h3>${escapeHTML(pack.name)}</h3>
          <p>${escapeHTML(pack.summary)}</p>
        </div>
        <div class="price-block">
          <strong>${escapeHTML(pack.price)}</strong>
          <span>${escapeHTML(pack.payment)}</span>
        </div>
        <p class="delivery-text">${escapeHTML(pack.delivery)}</p>
        ${featureList(pack.includes)}
        ${notes}
        <a class="button button-card" href="${buildWhatsAppHref(defaultMessage(pack.name))}" target="_blank" rel="noreferrer">${escapeHTML(pack.cta)}</a>
      </article>
    `;
  }

  function renderServiceCard(service) {
    const notes = service.notes && service.notes.length
      ? `<div class="card-notes">${service.notes.map((note) => `<p>${escapeHTML(note)}</p>`).join("")}</div>`
      : "";

    return `
      <article class="service-card">
        <span class="card-badge">${escapeHTML(service.badge || "Servicio")}</span>
        <h3>${escapeHTML(service.name)}</h3>
        <p>${escapeHTML(service.summary)}</p>
        <div class="price-block compact">
          <strong>${escapeHTML(service.price)}</strong>
          <span>${escapeHTML(service.payment)}</span>
        </div>
        <p class="delivery-text">${escapeHTML(service.delivery)}</p>
        ${featureList(service.includes)}
        ${notes}
        <a class="button button-card" href="${buildWhatsAppHref(defaultMessage(service.name))}" target="_blank" rel="noreferrer">${escapeHTML(service.cta)}</a>
      </article>
    `;
  }

  function renderServices() {
    const webTarget = $("#web-packages");
    const commerceTarget = $("#commerce-services");
    const supportTarget = $("#support-services");

    if (webTarget) {
      webTarget.innerHTML = (data.webPackages || []).map(renderPackageCard).join("");
    }
    if (commerceTarget) {
      commerceTarget.innerHTML = (data.commerceServices || []).map(renderServiceCard).join("");
    }
    if (supportTarget) {
      supportTarget.innerHTML = (data.supportServices || []).map(renderServiceCard).join("");
    }
  }

  function renderPackageTabs() {
    const tabs = $("#package-tabs");
    if (!tabs || !data.webPackages) return;
    tabs.innerHTML = data.webPackages
      .map((pack, index) => `
        <button class="compare-tab" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}" data-package="${pack.id}">
          ${escapeHTML(pack.name)}
        </button>
      `)
      .join("");

    tabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-package]");
      if (!button) return;
      $$(".compare-tab", tabs).forEach((tab) => tab.setAttribute("aria-selected", "false"));
      button.setAttribute("aria-selected", "true");
      renderPackageCompare(button.dataset.package);
    });

    renderPackageCompare(data.webPackages[0].id);
  }

  function renderPackageCompare(packageId) {
    const target = $("#package-compare");
    const pack = (data.webPackages || []).find((item) => item.id === packageId);
    if (!target || !pack) return;
    const policyNote = data.domainPolicy && data.domainPolicy.compareNote ? data.domainPolicy.compareNote : "";

    target.innerHTML = `
      <div>
        <h4>${escapeHTML(pack.name)}</h4>
        <p>${escapeHTML(pack.summary)}</p>
      </div>
      <div>
        <strong>${escapeHTML(pack.price)}</strong>
        <span>${escapeHTML(pack.delivery)}</span>
      </div>
      <div class="compare-domain">
        <span>Dominio</span>
        <strong>${escapeHTML(pack.domain || "Por definir")}</strong>
      </div>
      ${featureList(pack.includes.slice(0, 5))}
      ${policyNote ? `<p class="compare-note">${escapeHTML(policyNote)}</p>` : ""}
    `;
  }

  function renderPortfolio(filter = "Todos") {
    const target = $("#portfolio-grid");
    if (!target || !data.projects) return;

    const availableProjects = data.projects.filter((project) => project.active !== false && project.video);
    const projects = filter === "Todos"
      ? availableProjects
      : availableProjects.filter((project) => project.filter === filter);

    if (!projects.length) {
      target.innerHTML = `
        <div class="empty-state">
          <h3>No hay demos en esta categoría todavía.</h3>
          <p>Esta sección está preparada para sumar nuevos conceptos cuando exista material real.</p>
        </div>
      `;
      return;
    }

    target.innerHTML = projects
      .map((project) => {
        const poster = project.poster ? ` poster="${escapeHTML(project.poster)}"` : "";
        const features = project.features && project.features.length
          ? `<ul class="portfolio-features">${project.features.map((feature) => `<li>${escapeHTML(feature)}</li>`).join("")}</ul>`
          : "";
        const message = project.whatsappMessage || defaultMessage(`un proyecto similar a ${project.displayTitle}`);
        const typeClass = String(project.type || "").toLowerCase().replace(/\s+/g, "-");

        return `
          <article class="portfolio-card">
            <video class="demo-video" controls muted playsinline preload="metadata"${poster} aria-label="Demostración de ${escapeHTML(project.displayTitle)}">
              <source src="${escapeHTML(project.video)}" type="video/mp4" />
              Tu navegador no puede reproducir esta demostración.
            </video>
            <div class="portfolio-content">
              <span class="card-badge project-type-${escapeHTML(typeClass)}">${escapeHTML(project.type)}</span>
              <h3>${escapeHTML(project.displayTitle)}</h3>
              <p class="portfolio-category">${escapeHTML(project.category)}</p>
              <p>${escapeHTML(project.description)}</p>
              ${features}
              <a class="button button-card" href="${buildWhatsAppHref(message)}" target="_blank" rel="noreferrer">${escapeHTML(project.cta || "Quiero algo similar")}</a>
            </div>
          </article>
        `;
      })
      .join("");

    enhancePortfolioVideos(target);
  }

  function enhancePortfolioVideos(scope = document) {
    const videos = $$("video.demo-video", scope);
    videos.forEach((video) => {
      video.defaultMuted = true;
      video.muted = true;
      video.addEventListener("play", () => {
        videos.forEach((otherVideo) => {
          if (otherVideo !== video && !otherVideo.paused) {
            otherVideo.pause();
          }
        });
      });
      video.addEventListener("error", () => {
        const card = video.closest(".portfolio-card");
        if (card) card.classList.add("is-media-missing");
      });
    });
  }

  function renderPortfolioFilters() {
    const filters = $("#portfolio-filters");
    if (!filters || !data.filters) return;
    const availableProjects = (data.projects || []).filter((project) => project.active !== false && project.video);
    const visibleFilters = data.filters.filter((filter) => filter === "Todos" || availableProjects.some((project) => project.filter === filter));

    filters.innerHTML = visibleFilters
      .map((filter, index) => `
        <button class="filter-button" type="button" aria-pressed="${index === 0 ? "true" : "false"}" data-filter="${escapeHTML(filter)}">
          ${escapeHTML(filter)}
        </button>
      `)
      .join("");

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      $$(".filter-button", filters).forEach((item) => item.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      renderPortfolio(button.dataset.filter);
    });

    renderPortfolio("Todos");
  }

  function renderFaqs() {
    const target = $("#faq-list");
    if (!target || !data.faqs) return;

    target.innerHTML = data.faqs
      .map((faq, index) => {
        const buttonId = `faq-button-${index + 1}`;
        const panelId = `faq-panel-${index + 1}`;
        return `
          <article class="faq-item">
            <h3>
              <button type="button" id="${buttonId}" aria-expanded="false" aria-controls="${panelId}">
                ${escapeHTML(faq.question)}
                <span aria-hidden="true"></span>
              </button>
            </h3>
            <div class="faq-panel" id="${panelId}" role="region" aria-labelledby="${buttonId}" hidden>
              <p>${escapeHTML(faq.answer)}</p>
            </div>
          </article>
        `;
      })
      .join("");

    target.addEventListener("click", (event) => {
      const button = event.target.closest("button[aria-controls]");
      if (!button) return;
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  }

  function getCheckedValue(form, name) {
    const input = $(`input[name="${name}"]:checked`, form);
    return input ? input.value : "";
  }

  function getCheckedValues(form, name) {
    return $$(`input[name="${name}"]:checked`, form).map((input) => input.value);
  }

  function recommendationReason(serviceId, goal, volume, current) {
    const currentText = current.length ? current.join(", ") : "información todavía sin organizar";
    const base = {
      esencial: "Porque necesitas una presencia clara para explicar lo importante sin ampliar demasiado el alcance.",
      profesional: "Porque quieres ordenar más información y mejorar cómo se presentan tus servicios.",
      medida: "Porque el alcance requiere más secciones, más contenido o una estructura personalizada.",
      "tienda-inicial": "Porque el objetivo principal es vender productos con una operación inicial más ordenada.",
      pagos: "Porque ya existe una página o flujo que necesita una ruta básica de cobro.",
      reservaciones: "Porque necesitas facilitar solicitudes de cita o reserva desde un punto visible.",
      "presencia-local": "Porque tu perfil local puede ayudar a que la información básica sea más clara.",
      actualizacion: "Porque lo que necesitas resolver parece un ajuste puntual de contenido.",
      dominio: "Porque ya cuentas o necesitas contar con una dirección propia conectada a una página compatible."
    };

    return `${base[serviceId] || "Porque coincide con lo que quieres resolver."} Información actual: ${currentText}. Volumen estimado: ${volume || "por definir"}.`;
  }

  function confirmationList(serviceId) {
    const shared = ["Material disponible", "Alcance final", "Tiempo real según entrega de información"];
    const specific = {
      "tienda-inicial": ["Cantidad de productos", "Método de pago", "Forma de entrega"],
      pagos: ["Plataforma de pago activa", "Accesos", "Tipo de cobro"],
      reservaciones: ["Herramienta de agenda", "Servicios disponibles", "Horarios"],
      "presencia-local": ["Perfil verificado", "Acceso al perfil", "Datos actuales"],
      dominio: ["Proveedor del dominio", "Accesos", "Estado del dominio"],
      actualizacion: ["Página compatible", "Cambios exactos", "Materiales nuevos"]
    };
    return [...(specific[serviceId] || []), ...shared];
  }

  function recommendService(form) {
    const goal = getCheckedValue(form, "goal");
    const volume = getCheckedValue(form, "volume");
    const current = getCheckedValues(form, "current");
    let serviceId = (data.recommendations || {})[goal] || "esencial";

    if (goal === "servicios" && (volume === "intermedia" || current.includes("Página existente"))) {
      serviceId = "profesional";
    }
    if ((goal === "organizar" && volume === "amplia") || volume === "amplia") {
      serviceId = goal === "vender" ? "tienda-inicial" : "medida";
    }
    if (goal === "dominio") serviceId = "dominio";
    if (goal === "pagos") serviceId = "pagos";
    if (goal === "reservas") serviceId = "reservaciones";

    return {
      service: serviceById[serviceId] || serviceById.esencial,
      goal,
      volume,
      current
    };
  }

  function renderRecommendation() {
    const form = $("#recommender-form");
    const target = $("#recommendation-result");
    if (!form || !target) return;

    const result = recommendService(form);
    const service = result.service;
    const confirmItems = confirmationList(service.id).map((item) => `<li>${escapeHTML(item)}</li>`).join("");
    const reason = recommendationReason(service.id, result.goal, result.volume, result.current);
    const message = `Hola, quiero recibir una recomendación de ${config.brandName || "NEXO26 Digital"}. Me interesa ${service.name}. Busco ${result.goal}. Volumen: ${result.volume}. Actualmente tengo: ${result.current.join(", ") || "sin definir"}.`;

    target.innerHTML = `
      <span class="card-badge">Recomendación inicial</span>
      <h3>${escapeHTML(service.name)}</h3>
      <p>${escapeHTML(reason)}</p>
      <div class="recommendation-meta">
        <div><span>Precio inicial</span><strong>${escapeHTML(service.price)}</strong></div>
        <div><span>Pago</span><strong>${escapeHTML(service.payment)}</strong></div>
        <div><span>Tiempo estimado</span><strong>${escapeHTML(service.delivery)}</strong></div>
      </div>
      <h4>Qué confirmamos antes de cotizar</h4>
      <ul>${confirmItems}</ul>
      <a class="button button-primary" href="${buildWhatsAppHref(message)}" target="_blank" rel="noreferrer">Enviar recomendación por WhatsApp</a>
    `;
  }

  function initRecommender() {
    const form = $("#recommender-form");
    if (!form) return;
    form.addEventListener("change", renderRecommendation);
    renderRecommendation();
  }

  function initContactForm() {
    const form = $("#contact-form");
    const status = $("#form-status");
    if (!form) return;

    const requiredFields = ["name", "businessName", "giro", "city", "need", "currentInfo"];

    function setError(field, message) {
      const input = form.elements[field];
      const error = document.getElementById(`${field}-error`);
      if (!input || !error) return;
      input.setAttribute("aria-invalid", message ? "true" : "false");
      error.textContent = message;
    }

    function validate() {
      let valid = true;
      requiredFields.forEach((field) => {
        const input = form.elements[field];
        const value = input ? String(input.value || "").trim() : "";
        if (!value) {
          valid = false;
          setError(field, "Completa este campo para armar el mensaje.");
        } else {
          setError(field, "");
        }
      });
      return valid;
    }

    requiredFields.forEach((field) => {
      const input = form.elements[field];
      if (!input) return;
      input.addEventListener("input", () => setError(field, ""));
      input.addEventListener("change", () => setError(field, ""));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (status) status.textContent = "";

      if (!validate()) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const businessName = String(formData.get("businessName") || "").trim();
      const giro = String(formData.get("giro") || "").trim();
      const city = String(formData.get("city") || "").trim();
      const need = String(formData.get("need") || "").trim();
      const currentInfo = String(formData.get("currentInfo") || "").trim();
      const message = String(formData.get("message") || "").trim();

      const whatsappMessage = [
        `Hola, soy ${name}.`,
        `Mi negocio se llama ${businessName}.`,
        `Giro: ${giro}.`,
        `Zona: ${city}.`,
        `Quiero resolver: ${need}.`,
        `Actualmente manejo mi información así: ${currentInfo}.`,
        message ? `Mensaje adicional: ${message}.` : "",
        `Me interesa recibir una recomendación de ${config.brandName || "NEXO26 Digital"}.`
      ].filter(Boolean).join(" ");

      window.open(buildWhatsAppHref(whatsappMessage), "_blank", "noopener,noreferrer");

      if (status) {
        status.textContent = normalizePhone(config.whatsappNumber)
          ? "Se abrió WhatsApp con tu mensaje preparado."
          : "Se abrió el enlace principal de WhatsApp. Puedes enviar ahí tu información.";
      }
    });
  }

  function initMenu() {
    const header = $(selectors.header);
    const menu = $(selectors.menu);
    const toggle = $(selectors.menuToggle);
    if (!header || !menu || !toggle) return;

    let lastFocusedElement = null;

    function closeMenu(restoreFocus = true) {
      body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      if (restoreFocus && lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }

    function openMenu() {
      lastFocusedElement = document.activeElement;
      body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      const firstLink = $("a", menu);
      if (firstLink) firstLink.focus();
    }

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu(false);
      } else {
        openMenu();
      }
    });

    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && body.classList.contains("nav-open")) {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!body.classList.contains("nav-open")) return;
      if (!header.contains(event.target)) closeMenu(false);
    });
  }

  function initHeaderState() {
    const header = $(selectors.header);
    if (!header) return;

    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function initActiveNav() {
    const navLinks = $$(".site-nav a[href^='#']");
    const sections = navLinks
      .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${id}`;
          if (isCurrent) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 });

    sections.forEach((section) => observer.observe(section));
  }

  function initSmoothScroll() {
    $$("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.getElementById(id.slice(1));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      });
    });
  }

  function initReveal() {
    const elements = $$(".reveal");
    if (!elements.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    elements.forEach((element) => observer.observe(element));
  }

  function setYear() {
    const year = $("#current-year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function init() {
    setYear();
    setContactData();
    setWhatsAppLinks();
    renderCollections();
    renderServices();
    renderPackageTabs();
    renderPortfolioFilters();
    renderFaqs();
    initRecommender();
    initContactForm();
    initMenu();
    initHeaderState();
    initActiveNav();
    initSmoothScroll();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
