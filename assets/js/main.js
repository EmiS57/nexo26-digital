(function () {
  "use strict";

  const config = window.NEXO_CONFIG || {};
  const data = window.NEXO_DATA || {};
  const root = document.documentElement;
  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let portfolioVideoObserver = null;

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

  const NEXO_WHATSAPP_NUMBER = normalizePhone(config.whatsappNumber);
  const NEXO_WHATSAPP_PUBLIC_LINK = config.whatsappPublicLink || "";

  const whatsappMessages = {
    general: "Hola, estuve revisando la página de NEXO26 Digital y me gustaría recibir orientación para crear una página para mi negocio.",
    footerWhatsapp: "Hola, estuve revisando la página de NEXO26 Digital y me gustaría recibir más información.",
    solicitarInformacion: "Hola, estuve revisando la página de NEXO26 Digital y me gustaría recibir información sobre sus páginas para negocios.",
    cotizarProyecto: "Hola, me gustaría cotizar una página para mi negocio. ¿Qué información necesitan para orientarme?",
    hablarNegocio: "Hola, tengo un negocio y me gustaría explicarles lo que necesito para que me recomienden una opción adecuada.",
    actualizarPagina: "Hola, ya cuento con una página y me interesa saber si pueden ayudarme a actualizarla o mejorarla.",
    dominio: "Hola, me interesa recibir información sobre la conexión o gestión de un dominio para mi página."
  };

  const packageMessages = {
    esencial: "Hola, vi el paquete NEXO Esencial en su página y me gustaría recibir más información para aplicarlo a mi negocio.",
    profesional: "Hola, vi el paquete NEXO Profesional en su página y me gustaría saber cómo podría aplicarse a mi negocio.",
    medida: "Hola, vi la opción NEXO A Medida y me gustaría platicarles lo que necesito para recibir una propuesta."
  };

  const serviceMessages = {
    "tienda-inicial": "Hola, me interesa revisar una tienda inicial para mi negocio y quisiera saber qué información necesitan para orientarme.",
    pagos: "Hola, me interesa agregar pagos a mi página o sitio. ¿Qué información necesitan para revisar si es compatible?",
    reservaciones: "Hola, me interesa facilitar reservaciones o solicitudes de cita desde mi página. ¿Qué opciones podrían recomendarme?",
    "presencia-local": "Hola, me interesa mejorar la presencia local de mi negocio y revisar mi perfil de Google.",
    actualizacion: whatsappMessages.actualizarPagina,
    renovacion: "Hola, me interesa recibir información sobre renovación técnica o continuidad de publicación para una página.",
    dominio: whatsappMessages.dominio
  };

  function defaultMessage(topic) {
    return topic
      ? `Hola, estuve revisando la página de ${config.brandName || "NEXO26 Digital"} y me gustaría recibir orientación sobre ${topic}.`
      : whatsappMessages.general;
  }

  function messageByIntent(intent, fallback = whatsappMessages.general) {
    const key = String(intent || "").replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    return whatsappMessages[key] || fallback;
  }

  function buildWhatsAppHref(message) {
    const cleanMessage = String(message || whatsappMessages.general).trim();
    const text = encodeURIComponent(cleanMessage);

    if (NEXO_WHATSAPP_NUMBER) {
      return `https://wa.me/${NEXO_WHATSAPP_NUMBER}?text=${text}`;
    }

    if (!NEXO_WHATSAPP_PUBLIC_LINK) {
      return "#contacto";
    }

    try {
      const url = new URL(NEXO_WHATSAPP_PUBLIC_LINK);
      if (cleanMessage) {
        url.searchParams.set("text", cleanMessage);
      }
      return url.toString();
    } catch (error) {
      return NEXO_WHATSAPP_PUBLIC_LINK;
    }
  }

  function openNexoWhatsApp(message) {
    window.open(buildWhatsAppHref(message), "_blank", "noopener,noreferrer");
  }

  window.openNexoWhatsApp = openNexoWhatsApp;

  function setWhatsAppLinks() {
    $$(selectors.whatsappLink).forEach((link) => {
      const explicitMessage = link.dataset.whatsappMessage || "";
      const intent = link.dataset.whatsappIntent || "";
      const topic = link.dataset.topic || "";
      const message = explicitMessage || messageByIntent(intent, topic ? defaultMessage(topic) : whatsappMessages.general);
      link.href = buildWhatsAppHref(message);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
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
      row.target = "_blank";
      row.rel = "noopener noreferrer";
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

    $$("[data-instagram-link]").forEach((link) => {
      if (!config.instagram) return;
      link.href = config.instagram;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    $$("[data-facebook-link]").forEach((link) => {
      if (!config.facebook) return;
      link.href = config.facebook;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
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
        <a class="button button-card" href="${escapeHTML(buildWhatsAppHref(packageMessages[pack.id] || defaultMessage(pack.name)))}" target="_blank" rel="noopener noreferrer">${escapeHTML(pack.cta)}</a>
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
        <a class="button button-card" href="${escapeHTML(buildWhatsAppHref(serviceMessages[service.id] || defaultMessage(service.name)))}" target="_blank" rel="noopener noreferrer">${escapeHTML(service.cta)}</a>
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

  function renderEcosystems() {
    const target = $("#ecosystems-grid");
    if (!target || !Array.isArray(data.ecosystems)) return;

    const ecosystems = data.ecosystems.filter((item) => item && item.name && item.problem && item.objective && item.route);
    if (!ecosystems.length) {
      target.hidden = true;
      return;
    }

    target.innerHTML = ecosystems
      .map((item) => {
        const sections = (item.sections || []).map((section) => `<li>${escapeHTML(section)}</li>`).join("");
        const functions = (item.functions || []).map((feature) => `<li>${escapeHTML(feature)}</li>`).join("");
        const cta = item.cta || "Revisar este ecosistema";
        const message = item.whatsappMessage || defaultMessage(`un ecosistema NEXO para ${item.name}`);

        return `
          <article class="ecosystem-card">
            <div class="ecosystem-card-main">
              <p class="eyebrow">${escapeHTML(item.name)}</p>
              <h3>${escapeHTML(item.audience || item.name)}</h3>
              <span>Problema habitual</span>
              <p>${escapeHTML(item.problem)}</p>
            </div>
            <div class="ecosystem-card-details">
              <div>
                <span>Objetivo de la pagina</span>
                <p>${escapeHTML(item.objective)}</p>
              </div>
              <div>
                <span>Ruta recomendada</span>
                <p>${escapeHTML(item.route)}</p>
              </div>
              <div>
                <span>Secciones relevantes</span>
                <ul>${sections}</ul>
              </div>
              <div>
                <span>Funciones clave</span>
                <ul>${functions}</ul>
              </div>
              <div>
                <span>Estilo visual</span>
                <p>${escapeHTML(item.style)}</p>
              </div>
              <a class="button button-card" href="${escapeHTML(buildWhatsAppHref(message))}" target="_blank" rel="noopener noreferrer">${escapeHTML(cta)}</a>
            </div>
          </article>
        `;
      })
      .join("");
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

    const availableProjects = data.projects.filter((project) => project.active !== false && project.status === "published" && project.published !== false && (project.video || project.liveUrl));
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
        const title = project.displayTitle || project.name || project.title || "Concepto";
        const poster = project.poster ? ` poster="${escapeHTML(project.poster)}"` : "";
        const overlay = `
          <div class="portfolio-overlay" aria-hidden="true">
            <span>${escapeHTML(project.type)}</span>
            <strong>Vista previa</strong>
          </div>
        `;
        const media = project.video
          ? `
            <div class="portfolio-media">
              <video class="demo-video" controls muted playsinline preload="metadata"${poster} aria-label="Demostración de ${escapeHTML(title)}">
                <source src="${escapeHTML(project.video)}" type="video/mp4" />
                Tu navegador no puede reproducir esta demostración.
              </video>
              ${overlay}
            </div>
          `
          : `
            <a class="portfolio-media portfolio-preview-link" href="${escapeHTML(project.liveUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Explorar concepto ${escapeHTML(title)}">
              <img class="portfolio-preview" src="${escapeHTML(project.poster)}" alt="" loading="lazy" />
              ${overlay}
            </a>
          `;
        const features = project.features && project.features.length
          ? `<ul class="portfolio-features">${project.features.map((feature) => `<li>${escapeHTML(feature)}</li>`).join("")}</ul>`
          : "";
        const message = project.whatsappMessage || defaultMessage(`un proyecto similar a ${title}`);
        const typeClass = String(project.type || "").toLowerCase().replace(/\s+/g, "-");
        const liveLink = project.liveUrl
          ? `<a class="button button-card button-outline" href="${escapeHTML(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Explorar concepto</a>`
          : "";
        const packageLabel = project.package ? `<p class="portfolio-package">${escapeHTML(project.package)}</p>` : "";

        return `
          <article class="portfolio-card">
            ${media}
            <div class="portfolio-content">
              <div class="portfolio-meta">
                <span class="card-badge project-type-${escapeHTML(typeClass)}">${escapeHTML(project.type)}</span>
                <span>${escapeHTML(project.category)}</span>
              </div>
              <h3>${escapeHTML(title)}</h3>
              ${packageLabel}
              <p>${escapeHTML(project.description)}</p>
              ${features}
              <div class="portfolio-actions">
                ${liveLink}
                <a class="button button-card" href="${escapeHTML(buildWhatsAppHref(message))}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.cta || "Quiero algo similar")}</a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    enhancePortfolioVideos(target);
  }

  function enhancePortfolioVideos(scope = document) {
    const videos = $$("video.demo-video", scope);
    const isInViewport = (video) => {
      const rect = video.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    };
    const pauseIfOffscreen = (video) => {
      if (!isInViewport(video) && !video.paused) {
        video.pause();
      }
    };

    videos.forEach((video) => {
      video.defaultMuted = true;
      video.muted = true;
      video.addEventListener("play", () => {
        videos.forEach((otherVideo) => {
          if (otherVideo !== video && !otherVideo.paused) {
            otherVideo.pause();
          }
        });
        pauseIfOffscreen(video);
      });
      video.addEventListener("error", () => {
        const card = video.closest(".portfolio-card");
        if (card) card.classList.add("is-media-missing");
      });
    });

    if ("IntersectionObserver" in window) {
      if (portfolioVideoObserver) portfolioVideoObserver.disconnect();
      portfolioVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
          }
        });
      }, { threshold: 0.18 });
      videos.forEach((video) => portfolioVideoObserver.observe(video));
    }
  }

  function renderPortfolioFilters() {
    const filters = $("#portfolio-filters");
    if (!filters || !data.filters) return;
    const availableProjects = (data.projects || []).filter((project) => project.active !== false && project.status === "published" && project.published !== false && (project.video || project.liveUrl));
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

  function inputLabel(input, fallback = "Sin definir") {
    if (!input) return fallback;
    const label = input.closest("label");
    const text = label ? label.textContent.replace(/\s+/g, " ").trim() : "";
    return text || input.value || fallback;
  }

  function getCheckedLabel(form, name, fallback = "Sin definir") {
    return inputLabel($(`input[name="${name}"]:checked`, form), fallback);
  }

  function getCheckedLabels(form, name) {
    return $$(`input[name="${name}"]:checked`, form)
      .map((input) => inputLabel(input, ""))
      .filter(Boolean);
  }

  function safeMessageValue(value, fallback = "Sin definir") {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    const invalidValues = ["undefined", "null", "[object Object]", "true", "false"];
    return text && !invalidValues.includes(text) ? text : fallback;
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

  function buildRecommendationMessage(details) {
    const current = details.current.length ? details.current.join(", ") : "Sin definir";
    return [
      "Hola, utilicé el recomendador de NEXO26 Digital.",
      "",
      `Mi objetivo principal es: ${safeMessageValue(details.goal)}.`,
      `Cantidad aproximada de información: ${safeMessageValue(details.volume)}.`,
      `Actualmente tengo: ${safeMessageValue(current)}.`,
      `La recomendación que recibí fue: ${safeMessageValue(details.recommendation)}.`,
      "",
      "Me gustaría recibir más información para aplicarlo a mi negocio."
    ].join("\n");
  }

  function buildAlternativePackageMessage(pack) {
    const selectedPackage = safeMessageValue(pack && pack.name, "NEXO26");
    const packageId = pack && pack.id ? pack.id : "";
    return [
      packageMessages[packageId] || defaultMessage(selectedPackage),
      "",
      `Seleccioné ${selectedPackage} como alternativa desde el recomendador de NEXO26 Digital.`
    ].join("\n");
  }

  function recommendationSummary(result) {
    return [
      { label: "Objetivo", value: result.goalLabel },
      { label: "Información", value: result.volumeLabel },
      { label: "Actualmente tienes", value: result.currentLabels.length ? result.currentLabels.join(", ") : "Sin definir" }
    ].filter((item) => item.value);
  }

  function recommendService(form) {
    const goal = getCheckedValue(form, "goal");
    const volume = getCheckedValue(form, "volume");
    const current = getCheckedValues(form, "current");
    const goalLabel = getCheckedLabel(form, "goal");
    const volumeLabel = getCheckedLabel(form, "volume");
    const currentLabels = getCheckedLabels(form, "current");
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
      current,
      goalLabel,
      volumeLabel,
      currentLabels
    };
  }

  function renderRecommendation() {
    const form = $("#recommender-form");
    const target = $("#recommendation-result");
    if (!form || !target) return;

    const result = recommendService(form);
    const service = result.service;
    const confirmItems = confirmationList(service.id).map((item) => `<li>${escapeHTML(item)}</li>`).join("");
    const reason = recommendationReason(service.id, result.goal, result.volumeLabel, result.currentLabels);
    const message = buildRecommendationMessage({
      goal: result.goalLabel,
      volume: result.volumeLabel,
      current: result.currentLabels,
      recommendation: service.name
    });
    const summaryItems = recommendationSummary(result)
      .map((item) => `
        <div>
          <span>${escapeHTML(item.label)}</span>
          <strong>${escapeHTML(item.value)}</strong>
        </div>
      `)
      .join("");
    const alternatives = (data.webPackages || [])
      .filter((pack) => pack.id !== service.id)
      .map((pack) => `
        <a class="button button-outline recommendation-alt" href="${escapeHTML(buildWhatsAppHref(buildAlternativePackageMessage(pack)))}" target="_blank" rel="noopener noreferrer">
          Consultar ${escapeHTML(pack.name)}
        </a>
      `)
      .join("");

    target.innerHTML = `
      <span class="card-badge">Recomendación inicial</span>
      <h3>${escapeHTML(service.name)}</h3>
      <p>${escapeHTML(reason)}</p>
      <div class="recommendation-summary" aria-label="Resumen de respuestas">
        ${summaryItems}
      </div>
      <div class="recommendation-meta">
        <div><span>Precio inicial</span><strong>${escapeHTML(service.price)}</strong></div>
        <div><span>Pago</span><strong>${escapeHTML(service.payment)}</strong></div>
        <div><span>Tiempo estimado</span><strong>${escapeHTML(service.delivery)}</strong></div>
      </div>
      <h4>Qué confirmamos antes de cotizar</h4>
      <ul>${confirmItems}</ul>
      <a class="button button-primary" href="${escapeHTML(buildWhatsAppHref(message))}" target="_blank" rel="noopener noreferrer">Enviar recomendación por WhatsApp</a>
      ${alternatives ? `<div class="recommendation-actions" aria-label="Consultar otro paquete">${alternatives}</div>` : ""}
    `;
    target.classList.remove("is-ready");
    requestAnimationFrame(() => target.classList.add("is-ready"));
  }

  function initRecommender() {
    const form = $("#recommender-form");
    if (!form) return;
    const fieldsets = $$("fieldset", form);
    const prevButton = $("[data-recommender-prev]", form);
    const nextButton = $("[data-recommender-next]", form);
    const stepText = $("[data-recommender-step]", form);
    const progress = $("[data-recommender-progress]", form);
    let currentStep = 0;

    function updateStep() {
      fieldsets.forEach((fieldset, index) => {
        const isActive = index === currentStep;
        fieldset.classList.toggle("is-active", isActive);
        fieldset.setAttribute("aria-hidden", String(!isActive));
      });

      if (stepText) stepText.textContent = `Pregunta ${currentStep + 1} de ${fieldsets.length}`;
      if (progress) progress.style.width = `${((currentStep + 1) / fieldsets.length) * 100}%`;
      if (prevButton) prevButton.disabled = currentStep === 0;
      if (nextButton) nextButton.textContent = currentStep === fieldsets.length - 1 ? "Ver recomendación" : "Siguiente";
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        currentStep = Math.max(0, currentStep - 1);
        updateStep();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (currentStep < fieldsets.length - 1) {
          currentStep += 1;
          updateStep();
          return;
        }
        const result = $("#recommendation-result");
        if (result) result.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
      });
    }

    form.addEventListener("change", renderRecommendation);
    updateStep();
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
    const header = $(selectors.header);
    const sections = navLinks
      .map((link) => {
        const id = link.getAttribute("href").slice(1);
        const section = document.getElementById(id);
        return section ? { id, link, section } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    function setActive(id) {
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${id}`) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    function updateActiveNav() {
      const headerOffset = header ? header.getBoundingClientRect().height : 0;
      const marker = window.scrollY + headerOffset + Math.max(window.innerHeight * 0.24, 120);
      let current = null;

      sections
        .slice()
        .sort((a, b) => a.section.offsetTop - b.section.offsetTop)
        .forEach((item) => {
        if (item.section.offsetTop <= marker) {
          current = item;
        }
      });

      if (current) setActive(current.id);
    }

    updateActiveNav();
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    window.addEventListener("resize", updateActiveNav);
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

  function initReadingProgress() {
    const progress = $("[data-reading-progress]");
    if (!progress) return;

    function updateProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
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
    renderEcosystems();
    renderPackageTabs();
    renderPortfolioFilters();
    renderFaqs();
    initRecommender();
    initContactForm();
    initMenu();
    initHeaderState();
    initActiveNav();
    initReadingProgress();
    initSmoothScroll();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
