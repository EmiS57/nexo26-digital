(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function setPressed(buttons, active) {
    buttons.forEach((button) => button.setAttribute("aria-pressed", button === active ? "true" : "false"));
  }

  function initAdvisor() {
    $$("[data-advisor]").forEach((advisor) => {
      const result = $(".advisor-result", advisor);
      const buttons = $$("[data-advisor-option]", advisor);
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          setPressed(buttons, button);
          if (!result) return;
          result.innerHTML = "<strong>" + button.dataset.advisorOption + "</strong><p>" + button.dataset.advisorResponse + "</p><button class=\"button primary\" type=\"button\" data-demo-action>Consultar por el canal del negocio</button>";
          result.focus({ preventScroll: true });
          document.dispatchEvent(new CustomEvent("demo-actions-refresh"));
        });
      });
    });
  }

  function initMenuTools() {
    const search = $("#menu-search");
    const grid = $("#menu-grid");
    if (!grid) return;
    const items = $$("[data-menu-item]", grid);
    const filters = $$("[data-menu-filter]");
    let active = "Todos";
    function apply() {
      const term = search ? search.value.trim().toLowerCase() : "";
      items.forEach((item) => {
        const byCat = active === "Todos" || item.dataset.category === active;
        const byTerm = !term || item.dataset.text.includes(term);
        item.hidden = !(byCat && byTerm);
      });
    }
    filters.forEach((button) => {
      button.addEventListener("click", () => {
        active = button.dataset.menuFilter;
        setPressed(filters, button);
        apply();
      });
    });
    if (search) search.addEventListener("input", apply);
    apply();
  }

  function init() {
    initAdvisor();
    initMenuTools();
  }

  window.DemoUtils = { $, $$, initAdvisor, initMenuTools };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();