(function () {
  "use strict";

  const config = window.DEMO_CONFIG || {};
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  let lastFocus = null;

  function encodeMessage(message) {
    return encodeURIComponent(message || config.contextualMessage || "Hola, quiero una solución similar de NEXO26 Digital.");
  }

  function nexoWhatsappHref() {
    const base = config.nexoWhatsappUrl || "https://wa.me/message/ZPTEPGUHA3O2B1";
    if (base.includes("/message/")) return base;
    return base + (base.includes("?") ? "&" : "?") + "text=" + encodeMessage(config.contextualMessage);
  }

  function list(items) {
    return (items || []).map((item) => "<li>" + item + "</li>").join("");
  }

  function injectShell() {
    if (!config.slug) return;
    const shell = document.createElement("aside");
    shell.className = "demo-shell";
    shell.innerHTML = '<div class="demo-shell-bar"><p>Concepto base · ' + config.packageName + '</p><button type="button" class="demo-scope-toggle" aria-expanded="false" aria-controls="demo-scope-panel">Ver alcance</button><a href="' + nexoWhatsappHref() + '" target="_blank" rel="noopener noreferrer" data-shell-whatsapp>Quiero una solución similar</a></div><section class="demo-scope-panel" id="demo-scope-panel" hidden tabindex="-1"><div><p class="scope-label">Paquete representado</p><h2>' + config.packageName + '</h2><p class="scope-price">' + config.packagePrice + '</p></div><dl><div><dt>Pago</dt><dd>' + config.packageScope.payment + '</dd></div><div><dt>Secciones</dt><dd>' + config.packageScope.sections + '</dd></div><div><dt>Servicios</dt><dd>' + config.packageScope.services + '</dd></div><div><dt>Rondas</dt><dd>' + config.packageScope.revisions + '</dd></div><div><dt>Entrega</dt><dd>' + config.packageScope.delivery + '</dd></div><div><dt>Publicación</dt><dd>' + config.packageScope.publication + '</dd></div><div><dt>Dominio</dt><dd>' + config.packageScope.domain + '</dd></div></dl><div class="scope-columns"><div><h3>Funciones representadas</h3><ul>' + list(config.representedFeatures) + '</ul></div><div><h3>No incluido en este alcance</h3><ul>' + list(config.notIncluded) + '</ul></div></div><p class="scope-notice">' + config.commercialNotice + '</p><div class="scope-actions"><a class="button primary" href="' + nexoWhatsappHref() + '" target="_blank" rel="noopener noreferrer">Quiero una solución similar</a><a class="button ghost" href="' + config.nexoSiteUrl + '" target="_blank" rel="noopener noreferrer">Explorar NEXO26 Digital</a></div></section>';
    document.body.insertBefore(shell, document.body.firstChild.nextSibling);
    const toggle = $(".demo-scope-toggle", shell);
    const panel = $("#demo-scope-panel", shell);
    function closePanel(restore = true) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      if (restore && lastFocus) lastFocus.focus();
    }
    function openPanel() {
      lastFocus = document.activeElement;
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      panel.focus();
    }
    toggle.addEventListener("click", () => panel.hidden ? openPanel() : closePanel(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) closePanel();
    });
    document.addEventListener("click", (event) => {
      if (!panel.hidden && !shell.contains(event.target)) closePanel(false);
    });
  }

  function ensureActionDialog() {
    let dialog = $("#demo-action-dialog");
    if (dialog) return dialog;
    dialog = document.createElement("div");
    dialog.className = "demo-action-dialog";
    dialog.id = "demo-action-dialog";
    dialog.hidden = true;
    dialog.innerHTML = '<div class="dialog-backdrop" data-dialog-close></div><section role="dialog" aria-modal="true" aria-labelledby="demo-action-title" tabindex="-1"><h2 id="demo-action-title">Acción demostrativa</h2><p>En un proyecto publicado, esta acción se conectaría con el WhatsApp, formulario, pago o sistema de reservación configurado para el negocio.</p><div class="dialog-actions"><button class="button ghost" type="button" data-dialog-close>Cerrar</button><a class="button primary" href="' + nexoWhatsappHref() + '" target="_blank" rel="noopener noreferrer">Quiero una solución similar</a></div></section>';
    document.body.appendChild(dialog);
    dialog.addEventListener("click", (event) => {
      if (event.target.matches("[data-dialog-close]")) closeDialog();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !dialog.hidden) closeDialog();
    });
    return dialog;
  }

  function openDialog() {
    const dialog = ensureActionDialog();
    lastFocus = document.activeElement;
    dialog.hidden = false;
    const panel = $("section", dialog);
    if (panel) panel.focus();
  }

  function closeDialog() {
    const dialog = $("#demo-action-dialog");
    if (!dialog) return;
    dialog.hidden = true;
    if (lastFocus) lastFocus.focus();
  }

  function bindActions() {
    $$("[data-demo-action]").forEach((button) => {
      if (button.dataset.boundDemoAction) return;
      button.dataset.boundDemoAction = "true";
      button.addEventListener("click", openDialog);
    });
    $$("[data-nexo-whatsapp]").forEach((link) => {
      link.href = nexoWhatsappHref();
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
    $$("[data-nexo-link]").forEach((link) => {
      link.href = config.nexoSiteUrl || link.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  function init() {
    injectShell();
    bindActions();
    document.addEventListener("demo-actions-refresh", bindActions);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();