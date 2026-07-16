(function () {
  "use strict";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const body = document.body;

  function initMenu() {
    const toggle = $("[data-menu-toggle]");
    const nav = $("#site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      body.classList.toggle("nav-open", !open);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        toggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
      }
    });
  }

  function initChoices() {
    $$("[data-advisor]").forEach((advisor) => {
      const buttons = $$("[data-choice]", advisor);
      const result = $(".advisor-result", advisor);
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
          if (!result) return;
          result.innerHTML = "<strong>" + button.dataset.choice + "</strong><p>" + button.dataset.response + "</p><button class='button primary' type='button' data-demo-action>Consultar por el canal del negocio</button>";
          result.focus({ preventScroll: true });
          document.dispatchEvent(new CustomEvent("demo-actions-refresh"));
        });
      });
    });
  }

  function initMenuFilter() {
    const grid = $("#menu-grid");
    if (!grid) return;
    const input = $("#menu-search");
    const items = $$("[data-menu-item]", grid);
    const filters = $$("[data-menu-filter]");
    let active = "Todos";
    function apply() {
      const term = input ? input.value.trim().toLowerCase() : "";
      items.forEach((item) => {
        const byFilter = active === "Todos" || item.dataset.category === active;
        const bySearch = !term || item.dataset.text.includes(term);
        item.hidden = !(byFilter && bySearch);
      });
    }
    filters.forEach((button) => {
      button.addEventListener("click", () => {
        active = button.dataset.menuFilter;
        filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        apply();
      });
    });
    if (input) input.addEventListener("input", apply);
    apply();
  }

  function initStore() {
    const grid = $("[data-products]");
    if (!grid) return;
    const products = JSON.parse(grid.dataset.products || "[]");
    const search = $("#product-search");
    const filters = $$("[data-product-filter]");
    const lines = $("[data-cart-lines]");
    const total = $("[data-cart-total]");
    const clear = $("[data-clear-cart]");
    const key = "nexo-demo-cart-" + (window.DEMO_CONFIG && window.DEMO_CONFIG.slug || "store");
    let active = "Todos";
    let cart = {};
    try { cart = JSON.parse(localStorage.getItem(key) || "{}"); } catch (error) { cart = {}; }
    function money(value) { return "$" + value.toLocaleString("es-MX") + " MXN"; }
    function save() { localStorage.setItem(key, JSON.stringify(cart)); }
    function renderProducts() {
      const term = search ? search.value.trim().toLowerCase() : "";
      const visible = products.filter((product) => (active === "Todos" || product.category === active) && (!term || product.name.toLowerCase().includes(term) || product.description.toLowerCase().includes(term)));
      grid.innerHTML = visible.map((product) => "<article class='product-card'>" + product.svg + "<h3>" + product.name + "</h3><p>" + product.description + "</p><p class='disclaimer'>" + product.category + " · " + money(product.price) + " · Disponible ficticio</p><button class='button primary' type='button' data-add='" + product.id + "'>Añadir al carrito</button></article>").join("");
    }
    function renderCart() {
      const ids = Object.keys(cart).filter((id) => cart[id] > 0);
      if (!ids.length) {
        lines.innerHTML = "<p class='disclaimer'>El carrito está vacío.</p>";
        total.textContent = money(0);
        return;
      }
      let subtotal = 0;
      lines.innerHTML = ids.map((id) => {
        const product = products.find((item) => item.id === id);
        if (!product) return "";
        subtotal += product.price * cart[id];
        return "<div class='cart-line'><strong>" + product.name + "</strong><span>" + money(product.price) + "</span><div class='cart-line-controls'><button type='button' data-minus='" + id + "'>-</button><span>" + cart[id] + "</span><button type='button' data-plus='" + id + "'>+</button><button type='button' data-remove='" + id + "'>Quitar</button></div></div>";
      }).join("");
      total.textContent = money(subtotal);
    }
    grid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add]");
      if (!button) return;
      cart[button.dataset.add] = (cart[button.dataset.add] || 0) + 1;
      save();
      renderCart();
    });
    lines.addEventListener("click", (event) => {
      const plus = event.target.closest("[data-plus]");
      const minus = event.target.closest("[data-minus]");
      const remove = event.target.closest("[data-remove]");
      const id = plus?.dataset.plus || minus?.dataset.minus || remove?.dataset.remove;
      if (!id) return;
      if (plus) cart[id] = (cart[id] || 0) + 1;
      if (minus) cart[id] = Math.max(0, (cart[id] || 0) - 1);
      if (remove || cart[id] === 0) delete cart[id];
      save();
      renderCart();
    });
    if (clear) clear.addEventListener("click", () => { cart = {}; save(); renderCart(); });
    filters.forEach((button) => button.addEventListener("click", () => {
      active = button.dataset.productFilter;
      filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      renderProducts();
    }));
    if (search) search.addEventListener("input", renderProducts);
    renderProducts();
    renderCart();
  }

  function init() {
    initMenu();
    initChoices();
    initMenuFilter();
    initStore();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
