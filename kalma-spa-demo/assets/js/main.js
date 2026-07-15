(() => {
  "use strict";

  const config = window.KALMA_CONFIG || {};
  const doc = document;
  const html = doc.documentElement;

  html.classList.add("js");

  const $ = (selector, root = doc) => root.querySelector(selector);
  const $$ = (selector, root = doc) => Array.from(root.querySelectorAll(selector));
  const hasValue = (value) => typeof value === "string" && value.trim().length > 0;
  const cleanPhone = (value) => String(value || "").replace(/\D/g, "");

  const toAbsoluteUrl = (value) => {
    if (!hasValue(value)) return "";
    try {
      return new URL(value.trim(), window.location.href).href;
    } catch {
      return "";
    }
  };

  function buildWhatsAppUrl(message) {
    const phone = cleanPhone(config.phone);
    if (!phone) return "";
    const safeMessage = hasValue(message)
      ? message.trim()
      : config.defaultWhatsAppMessage || "";
    return `https://wa.me/${phone}?text=${encodeURIComponent(safeMessage)}`;
  }

  window.buildWhatsAppUrl = buildWhatsAppUrl;

  function setText(selector, value) {
    $$(selector).forEach((node) => {
      if (hasValue(value)) node.textContent = value.trim();
    });
  }

  function setMetaContent(selector, value) {
    const node = $(selector);
    if (!node) return;
    if (hasValue(value)) node.setAttribute("content", value.trim());
    else node.removeAttribute("content");
  }

  function setExternalLink(link, href) {
    if (!link) return;
    if (!hasValue(href)) {
      link.hidden = true;
      link.removeAttribute("href");
      return;
    }
    link.hidden = false;
    link.href = href.trim();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  function setupNexoLinks(root = doc) {
    $$("[data-nexo-link]", root).forEach((link) => setExternalLink(link, config.nexoSiteUrl));
  }

  function setupWhatsAppLinks(root = doc) {
    $$("[data-whatsapp-message]", root).forEach((link) => {
      const url = buildWhatsAppUrl(link.getAttribute("data-whatsapp-message"));
      if (!url) {
        link.removeAttribute("href");
        link.setAttribute("aria-disabled", "true");
        link.tabIndex = -1;
        return;
      }

      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-disabled");
      if (link.tabIndex === -1) link.removeAttribute("tabindex");
    });
  }

  function applyConfig() {
    const isDemo = Boolean(config.demoMode);
    const usesPhotography = Boolean(config.usePhotography);
    const brandName = config.brandName || config.businessName || "Kalma Spa";

    doc.body.classList.toggle("is-demo", isDemo);
    doc.body.classList.toggle("uses-photography", usesPhotography);

    setText('[data-config="brandName"]', brandName);
    setText('[data-config="displayPhone"]', config.displayPhone);
    setText('[data-config="schedule"]', config.schedule);
    setText('[data-config="address"]', config.address);
    setText('[data-config="zone"]', config.zone);
    setText("[data-current-year]", String(new Date().getFullYear()));

    setMetaContent("[data-robots]", isDemo ? "noindex, nofollow" : "index, follow");
    setMetaContent("[data-theme-color]", isDemo ? "#FAF7F1" : "#2F2B27");

    const socialTitle = `${brandName} | Un momento para ti`;
    const socialImage = toAbsoluteUrl(config.assets?.socialPreview);
    setMetaContent("[data-og-title]", socialTitle);
    setMetaContent("[data-twitter-title]", socialTitle);
    setMetaContent("[data-og-image]", socialImage);
    setMetaContent("[data-twitter-image]", socialImage);

    const canonical = $("[data-canonical]");
    if (canonical) {
      const href = toAbsoluteUrl(config.canonicalUrl);
      if (href) canonical.href = href;
      else canonical.remove();
    }

    const credit = $("[data-credit]");
    if (credit) {
      credit.textContent = isDemo
        ? "Concepto visual desarrollado por NEXO26 Digital."
        : "Sitio desarrollado por NEXO26 Digital.";
    }

    $$("[data-hide-if-empty]").forEach((node) => {
      const key = node.getAttribute("data-hide-if-empty");
      node.hidden = !hasValue(config[key]);
    });

    $$("[data-email-link]").forEach((link) => {
      if (!hasValue(config.email)) {
        link.hidden = true;
        link.closest("[data-hide-if-empty]")?.setAttribute("hidden", "");
        return;
      }
      link.href = `mailto:${config.email.trim()}`;
      link.textContent = config.email.trim();
      link.hidden = false;
    });

    $$('[data-social="instagram"]').forEach((link) => setExternalLink(link, config.instagram));
    $$('[data-social="facebook"]').forEach((link) => setExternalLink(link, config.facebook));
    setupNexoLinks();

    const mapLink = $("[data-map-link]");
    const mapFallback = $("[data-map-fallback]");
    if (hasValue(config.mapUrl)) {
      setExternalLink(mapLink, config.mapUrl);
      if (mapFallback) mapFallback.hidden = true;
    } else {
      if (mapLink) mapLink.hidden = true;
      if (mapFallback) mapFallback.hidden = false;
    }

    renderQuickInfo();
    renderStructuredData();
  }

  function renderQuickInfo() {
    const target = $("[data-quick-info]");
    if (!target || !Array.isArray(config.quickInfo)) return;

    const items = config.quickInfo.filter(
      (item) => item && (hasValue(item.value) || hasValue(item.detail))
    );
    if (items.length === 0) return;

    target.replaceChildren(
      ...items.map((item) => {
        const article = doc.createElement("article");
        const label = doc.createElement("span");
        const value = doc.createElement("strong");
        const detail = doc.createElement("p");

        label.textContent = item.label || "Información";
        value.textContent = item.value || item.detail || "Consulta";
        detail.textContent = item.detail || "";
        article.append(label, value, detail);
        return article;
      })
    );
  }

  function renderStructuredData() {
    const target = $("[data-json-ld]");
    if (!target) return;

    if (config.demoMode || config.enableStructuredData !== true) {
      target.textContent = "{}";
      return;
    }

    const data = {
      "@context": "https://schema.org",
      "@type": "HealthAndBeautyBusiness",
      name: config.brandName || config.businessName || "Kalma Spa",
      telephone: hasValue(config.displayPhone) ? config.displayPhone : undefined,
      email: hasValue(config.email) ? config.email : undefined,
      address: hasValue(config.address) ? config.address : undefined,
      openingHours:
        Array.isArray(config.structuredOpeningHours) && config.structuredOpeningHours.length > 0
          ? config.structuredOpeningHours
          : undefined,
      url: hasValue(config.canonicalUrl) ? config.canonicalUrl : undefined,
      image: hasValue(config.assets?.logo) ? toAbsoluteUrl(config.assets.logo) : undefined,
      sameAs: [config.instagram, config.facebook].filter(hasValue)
    };

    Object.keys(data).forEach((key) => {
      if (data[key] === undefined || (Array.isArray(data[key]) && data[key].length === 0)) {
        delete data[key];
      }
    });

    target.textContent = JSON.stringify(data, null, 2);
  }

  function renderServices() {
    const target = $("[data-services]");
    if (!target || !Array.isArray(config.services)) return;

    const services = config.services.filter((service) => service && service.active !== false);
    if (services.length === 0) return;

    target.setAttribute("role", "list");
    target.replaceChildren(
      ...services.map((service) => {
        const article = doc.createElement("article");
        article.className = "service-item reveal";
        article.setAttribute("role", "listitem");

        const number = doc.createElement("span");
        number.className = "service-number";
        number.textContent = service.number || "";

        const body = doc.createElement("div");
        body.className = "service-body";

        const category = doc.createElement("p");
        category.className = "service-category";
        category.textContent = service.category || "Experiencia";

        const title = doc.createElement("h3");
        title.textContent = service.title || service.category || "Experiencia";

        const text = doc.createElement("p");
        text.textContent = service.description || "";

        const link = doc.createElement("a");
        link.href = "#contacto";
        link.textContent = service.cta || "Consultar";
        link.setAttribute("data-whatsapp-message", service.message || config.defaultWhatsAppMessage);

        body.append(category, title, text, link);
        article.append(number, body);
        return article;
      })
    );

    setupWhatsAppLinks(target);
  }

  function renderSensory() {
    const target = $("[data-sensory-list]");
    if (!target || !Array.isArray(config.sensory)) return;

    target.replaceChildren(
      ...config.sensory.map((item, index) => {
        const article = doc.createElement("article");
        article.className = `sensory-item reveal sensory-${index + 1}`;
        article.tabIndex = 0;

        const number = doc.createElement("span");
        number.textContent = item.number || String(index + 1).padStart(2, "0");

        const title = doc.createElement("h3");
        title.textContent = item.title || "";

        const text = doc.createElement("p");
        text.textContent = item.text || "";

        article.append(number, title, text);
        return article;
      })
    );
  }

  function setupHeader() {
    const header = $("[data-site-header]");
    if (!header) return;

    let scheduled = false;
    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 18);
      scheduled = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  function setupMobileNav() {
    const header = $("[data-site-header]");
    const toggle = $("[data-nav-toggle]");
    const nav = $("[data-primary-nav]");
    if (!header || !toggle || !nav) return;

    let lastFocused = null;

    const focusable = () =>
      [toggle, ...$$("a[href], button:not([disabled])", nav)].filter(
        (node) => !node.hidden && node.offsetParent !== null
      );

    const close = () => {
      header.classList.remove("is-open");
      nav.classList.remove("is-open");
      doc.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
      if (lastFocused instanceof HTMLElement) lastFocused.focus({ preventScroll: true });
    };

    const open = () => {
      lastFocused = doc.activeElement;
      header.classList.add("is-open");
      nav.classList.add("is-open");
      doc.body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Cerrar menú");
      const firstLink = $("a", nav);
      if (firstLink) window.requestAnimationFrame(() => firstLink.focus({ preventScroll: true }));
    };

    toggle.addEventListener("click", () => {
      header.classList.contains("is-open") ? close() : open();
    });

    $$("a", nav).forEach((link) => {
      link.addEventListener("click", () => {
        if (header.classList.contains("is-open")) close();
      });
    });

    doc.addEventListener("pointerdown", (event) => {
      if (!header.classList.contains("is-open")) return;
      if (header.contains(event.target)) return;
      close();
    });

    doc.addEventListener("keydown", (event) => {
      if (!header.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function setupActiveLinks() {
    const links = $$("[data-section-link]");
    const sections = links
      .map((link) => $(link.getAttribute("href")))
      .filter(Boolean);
    if (!("IntersectionObserver" in window) || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function setupMomentSelector() {
    const root = $("[data-moment-selector]");
    if (!root || !config.recommendations) return;

    const buttons = $$("[data-moment]", root);
    const category = $("[data-recommendation-category]", root);
    const text = $("[data-recommendation-text]", root);
    const cta = $("[data-selector-cta]", root);
    const shape = $("[data-selector-shape]", root);

    const select = (key) => {
      const recommendation = config.recommendations[key];
      if (!recommendation) return;

      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.moment === key));
      });

      if (category) category.textContent = recommendation.category || recommendation.label || "";
      if (text) text.textContent = recommendation.text || "";
      if (shape) shape.dataset.variant = recommendation.shape || "flow";
      if (cta) {
        cta.setAttribute("data-whatsapp-message", recommendation.message);
        setupWhatsAppLinks(root);
      }
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => select(button.dataset.moment));
    });

    const firstPressed = buttons.find((button) => button.getAttribute("aria-pressed") === "true");
    select(firstPressed?.dataset.moment || buttons[0]?.dataset.moment);
  }

  function setupFaq() {
    $$("[data-faq-list] .faq-item").forEach((item) => {
      const button = $("button[aria-controls]", item);
      const panel = button ? $(`#${button.getAttribute("aria-controls")}`, item) : null;
      if (!button || !panel) return;

      button.addEventListener("click", () => {
        const nextState = button.getAttribute("aria-expanded") !== "true";
        item.classList.toggle("is-open", nextState);
        button.setAttribute("aria-expanded", String(nextState));
        panel.setAttribute("aria-hidden", String(!nextState));
      });
    });
  }

  function setupFloatingButton() {
    const button = $(".floating-whatsapp");
    const footer = $(".site-footer");
    const finalActions = $(".final-cta .hero-actions");
    if (!button || !footer || !("IntersectionObserver" in window)) return;

    const dockedTargets = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) dockedTargets.add(entry.target);
          else dockedTargets.delete(entry.target);
        });
        button.classList.toggle("is-docked", dockedTargets.size > 0);
      },
      { threshold: 0.08 }
    );
    observer.observe(footer);
    if (finalActions) observer.observe(finalActions);
  }

  function setupReveals() {
    const nodes = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    nodes.forEach((node) => observer.observe(node));
  }

  function init() {
    applyConfig();
    renderServices();
    renderSensory();
    setupWhatsAppLinks();
    setupHeader();
    setupMobileNav();
    setupActiveLinks();
    setupMomentSelector();
    setupFaq();
    setupFloatingButton();
    setupReveals();
  }

  init();
})();
