(function () {
  "use strict";

  const products = [
  {
    "id": "p1",
    "category": "Hogar",
    "name": "Charola Clara",
    "price": 420,
    "description": "Charola geométrica para mesa o recibidor.",
    "variant": "Arcilla mate",
    "availability": "Disponibilidad ficticia claramente marcada"
  },
  {
    "id": "p2",
    "category": "Hogar",
    "name": "Vaso Bajo",
    "price": 180,
    "description": "Pieza simple para uso cotidiano.",
    "variant": "Hueso",
    "availability": "Disponibilidad ficticia claramente marcada"
  },
  {
    "id": "p3",
    "category": "Hogar",
    "name": "Portavelas Línea",
    "price": 260,
    "description": "Volumen pequeño con perforación lateral.",
    "variant": "Oliva suave",
    "availability": "Disponibilidad ficticia claramente marcada"
  },
  {
    "id": "p4",
    "category": "Escritorio",
    "name": "Base Nota",
    "price": 150,
    "description": "Soporte compacto para tarjetas o notas.",
    "variant": "Carbón",
    "availability": "Disponibilidad ficticia claramente marcada"
  },
  {
    "id": "p5",
    "category": "Escritorio",
    "name": "Organizador Doble",
    "price": 390,
    "description": "Dos niveles para objetos pequeños.",
    "variant": "Arcilla mate",
    "availability": "Disponibilidad ficticia claramente marcada"
  },
  {
    "id": "p6",
    "category": "Escritorio",
    "name": "Clip Peso",
    "price": 120,
    "description": "Pieza de escritorio con peso ligero.",
    "variant": "Hueso",
    "availability": "Disponibilidad ficticia claramente marcada"
  },
  {
    "id": "p7",
    "category": "Regalos",
    "name": "Set Punto",
    "price": 520,
    "description": "Tres piezas pequeñas para obsequio.",
    "variant": "Mixto",
    "availability": "Disponibilidad ficticia claramente marcada"
  },
  {
    "id": "p8",
    "category": "Regalos",
    "name": "Caja Breve",
    "price": 310,
    "description": "Contenedor rígido para detalles.",
    "variant": "Oliva suave",
    "availability": "Disponibilidad ficticia claramente marcada"
  },
  {
    "id": "p9",
    "category": "Hogar",
    "name": "Gancho Umbral",
    "price": 240,
    "description": "Gancho mural demostrativo.",
    "variant": "Carbón",
    "availability": "Disponibilidad ficticia claramente marcada"
  },
  {
    "id": "p10",
    "category": "Regalos",
    "name": "Objeto Mini",
    "price": 160,
    "description": "Pieza decorativa de edición ficticia.",
    "variant": "Arcilla mate",
    "availability": "Disponibilidad ficticia claramente marcada"
  }
];
  const storageKey = "surco-lento-cart";
  const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  let cart = loadCart();
  let activeFilter = "Todos";

  function loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveCart() {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }

  function renderProducts() {
    const grid = $("#product-grid");
    if (!grid) return;
    const visible = products.filter((product) => activeFilter === "Todos" || product.category === activeFilter);
    grid.innerHTML = visible.map((product) => '<article class="product-card"><span>' + product.category + '</span><h3>' + product.name + '</h3><p>' + product.description + '</p><p>Variante única: ' + product.variant + '</p><p>' + product.availability + '</p><strong>' + money.format(product.price) + '</strong><button class="button primary full" type="button" data-add-product="' + product.id + '">Añadir</button></article>').join("");
    $$("[data-add-product]", grid).forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.addProduct;
        cart[id] = (cart[id] || 0) + 1;
        saveCart();
        renderCart();
      });
    });
  }

  function renderCart() {
    const itemsTarget = $("#cart-items");
    const empty = $("#cart-empty");
    const subtotalTarget = $("#cart-subtotal");
    if (!itemsTarget || !subtotalTarget) return;
    const rows = Object.entries(cart).map(([id, qty]) => {
      const product = products.find((item) => item.id === id);
      if (!product || qty < 1) return "";
      return '<div class="cart-row"><div><strong>' + product.name + '</strong><p>' + money.format(product.price) + ' · Cantidad ' + qty + '</p></div><div class="qty-controls"><button type="button" data-dec="' + id + '" aria-label="Quitar una unidad">-</button><span>' + qty + '</span><button type="button" data-inc="' + id + '" aria-label="Agregar una unidad">+</button></div></div>';
    }).filter(Boolean);
    const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
      const product = products.find((item) => item.id === id);
      return sum + (product ? product.price * qty : 0);
    }, 0);
    itemsTarget.innerHTML = rows.join("");
    empty.hidden = rows.length > 0;
    subtotalTarget.textContent = money.format(subtotal);
    $$("[data-inc]", itemsTarget).forEach((button) => button.addEventListener("click", () => {
      cart[button.dataset.inc] = (cart[button.dataset.inc] || 0) + 1;
      saveCart();
      renderCart();
    }));
    $$("[data-dec]", itemsTarget).forEach((button) => button.addEventListener("click", () => {
      const id = button.dataset.dec;
      cart[id] = Math.max((cart[id] || 0) - 1, 0);
      if (!cart[id]) delete cart[id];
      saveCart();
      renderCart();
    }));
  }

  function bindFilters() {
    $$("[data-shop-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.shopFilter;
        $$("[data-shop-filter]").forEach((item) => item.setAttribute("aria-pressed", item === button ? "true" : "false"));
        renderProducts();
      });
    });
  }

  function bindCheckout() {
    const clear = $("#clear-cart");
    const checkout = $("#checkout-button");
    if (clear) clear.addEventListener("click", () => {
      cart = {};
      saveCart();
      renderCart();
    });
    if (checkout) checkout.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("demo-actions-refresh"));
      const action = document.querySelector("[data-demo-action]");
      if (action) action.click();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindFilters();
    bindCheckout();
    renderProducts();
    renderCart();
  });
})();