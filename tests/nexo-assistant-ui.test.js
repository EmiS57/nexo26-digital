"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

class FakeClassList {
  constructor(node) {
    this.node = node;
  }

  values() {
    return String(this.node.className || "").split(/\s+/).filter(Boolean);
  }

  add(name) {
    const values = new Set(this.values());
    values.add(name);
    this.node.className = Array.from(values).join(" ");
  }

  remove(name) {
    this.node.className = this.values().filter((item) => item !== name).join(" ");
  }

  contains(name) {
    return this.values().includes(name);
  }
}

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.children = [];
    this.attributes = {};
    this.dataset = {};
    this.eventListeners = {};
    this.className = "";
    this.classList = new FakeClassList(this);
    this.hidden = false;
    this.disabled = false;
    this.checked = false;
    this.value = "";
    this.scrollTop = 0;
    this.scrollHeight = 0;
    this._textContent = "";
  }

  set textContent(value) {
    this._textContent = String(value || "");
    if (this._textContent === "") this.children = [];
  }

  get textContent() {
    return [this._textContent, ...this.children.map((child) => child.textContent)].join("");
  }

  get offsetParent() {
    return this.hidden ? null : {};
  }

  setAttribute(name, value) {
    const clean = String(value);
    this.attributes[name] = clean;
    if (name === "id") this.id = clean;
    if (name === "class") this.className = clean;
    if (name === "href") this.href = clean;
    if (name === "name") this.name = clean;
    if (name === "value") this.value = clean;
    if (name === "type") this.type = clean;
    if (name.startsWith("data-")) {
      const key = name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      this.dataset[key] = clean;
    }
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    this.scrollHeight += 1;
    return child;
  }

  remove() {
    if (!this.parentNode) return;
    this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
    this.parentNode = null;
  }

  addEventListener(type, handler) {
    this.eventListeners[type] = this.eventListeners[type] || [];
    this.eventListeners[type].push(handler);
  }

  removeEventListener(type, handler) {
    this.eventListeners[type] = (this.eventListeners[type] || []).filter((item) => item !== handler);
  }

  dispatchEvent(event) {
    const evt = Object.assign({ target: this, preventDefault() { this.defaultPrevented = true; } }, event);
    (this.eventListeners[evt.type] || []).forEach((handler) => handler(evt));
    return !evt.defaultPrevented;
  }

  click() {
    this.dispatchEvent({ type: "click" });
  }

  focus() {
    this.ownerDocument.activeElement = this;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const result = [];
    const selectors = selector.split(",").map((item) => item.trim()).filter(Boolean);
    const visit = (node) => {
      node.children.forEach((child) => {
        if (selectors.some((part) => matchesSelector(child, part))) result.push(child);
        visit(child);
      });
    };
    visit(this);
    return result;
  }
}

class FakeDocument {
  constructor() {
    this.readyState = "complete";
    this.eventListeners = {};
    this.body = new FakeElement("body", this);
    this.activeElement = this.body;
  }

  createElement(tagName) {
    return new FakeElement(tagName, this);
  }

  getElementById(id) {
    return find(this.body, (node) => node.id === id);
  }

  querySelector(selector) {
    return this.body.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }

  addEventListener(type, handler) {
    this.eventListeners[type] = this.eventListeners[type] || [];
    this.eventListeners[type].push(handler);
  }

  removeEventListener(type, handler) {
    this.eventListeners[type] = (this.eventListeners[type] || []).filter((item) => item !== handler);
  }

  dispatchEvent(event) {
    const evt = Object.assign({ target: this, preventDefault() { this.defaultPrevented = true; } }, event);
    (this.eventListeners[evt.type] || []).forEach((handler) => handler(evt));
  }
}

function matchesSelector(node, selector) {
  if (selector.startsWith(".")) return node.classList.contains(selector.slice(1));
  if (selector.startsWith("#")) return node.id === selector.slice(1);
  if (selector === "a[href]") return node.tagName === "A" && Boolean(node.href || node.attributes.href);
  if (selector === "button:not([disabled])") return node.tagName === "BUTTON" && !node.disabled;
  if (selector === "textarea:not([disabled])") return node.tagName === "TEXTAREA" && !node.disabled;
  if (selector === "input:not([disabled])") return node.tagName === "INPUT" && !node.disabled;
  if (selector === "select:not([disabled])") return node.tagName === "SELECT" && !node.disabled;
  if (selector === "[tabindex]:not([tabindex='-1'])") return node.attributes.tabindex && node.attributes.tabindex !== "-1";

  const checked = selector.endsWith(":checked");
  const base = checked ? selector.replace(":checked", "") : selector;
  if (checked && !node.checked) return false;

  const attrMatch = base.match(/^\[([^=\]]+)(?:=['"]?([^'"\]]+)['"]?)?\]$/);
  if (attrMatch) {
    const [, attr, expected] = attrMatch;
    const value = attr.startsWith("data-")
      ? node.dataset[attr.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())]
      : attr === "name"
        ? node.name || node.attributes.name
        : node.attributes[attr];
    return expected == null ? value != null : value === expected;
  }

  return node.tagName.toLowerCase() === selector.toLowerCase();
}

function find(node, predicate) {
  if (predicate(node)) return node;
  for (const child of node.children) {
    const found = find(child, predicate);
    if (found) return found;
  }
  return null;
}

function findText(node, needle) {
  return String(node.textContent).includes(needle);
}

function createBrowserHarness() {
  const sandbox = {
    URL,
    encodeURIComponent,
    decodeURIComponent,
    setTimeout: (fn) => fn()
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  const context = vm.createContext(sandbox);
  [
    "assets/js/config.js",
    "assets/js/data.js",
    "assets/js/nexo-assistant-config.js",
    "assets/data/nexo-knowledge.js",
    "assets/js/nexo-assistant-engine.js",
    "assets/js/nexo-assistant-ui.js"
  ].forEach((file) => {
    const code = fs.readFileSync(path.join(process.cwd(), file), "utf8");
    vm.runInContext(code, context, { filename: file });
  });
  return context;
}

function createMountedController() {
  const context = createBrowserHarness();
  const document = new FakeDocument();
  const opened = [];
  const win = {
    NEXO_ASSISTANT_CONFIG: context.NEXO_ASSISTANT_CONFIG,
    NEXO_ASSISTANT_ENGINE: context.NEXO_ASSISTANT_ENGINE,
    NEXO_ASSISTANT_KNOWLEDGE: context.NEXO_ASSISTANT_KNOWLEDGE,
    setTimeout: (fn) => fn(),
    scrollY: 24,
    scrollTo(value) {
      this.lastScrollTo = value;
    },
    open(url, target, features) {
      opened.push({ url, target, features });
    }
  };
  const controller = context.NEXO_ASSISTANT_UI.createController({
    document,
    root: win,
    engine: context.NEXO_ASSISTANT_ENGINE,
    knowledge: context.NEXO_ASSISTANT_KNOWLEDGE,
    config: context.NEXO_ASSISTANT_CONFIG
  });
  controller.mount();
  return { context, document, win, opened, controller };
}

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

const uiSource = fs.readFileSync(path.join(process.cwd(), "assets/js/nexo-assistant-ui.js"), "utf8");
const cssSource = fs.readFileSync(path.join(process.cwd(), "assets/css/nexo-assistant.css"), "utf8");
const indexSource = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");

test("01 UI: API loads without document, Node or bundler", () => {
  const context = createBrowserHarness();
  assert.ok(context.NEXO_ASSISTANT_UI);
  assert.equal(typeof context.NEXO_ASSISTANT_UI.createController, "function");
});

test("02 UI: initial actions are capped at five", () => {
  const context = createBrowserHarness();
  assert.equal(context.NEXO_ASSISTANT_UI.initialActions.length, 5);
});

test("03 UI: guided analysis uses nine single-question steps", () => {
  const context = createBrowserHarness();
  assert.equal(context.NEXO_ASSISTANT_UI.guidedSteps.length, 9);
  context.NEXO_ASSISTANT_UI.guidedSteps.forEach((step) => {
    assert.ok(step.question.split("?").length <= 2);
  });
});

test("04 UI: WhatsApp helper uses official wa.me format", () => {
  const context = createBrowserHarness();
  const url = context.NEXO_ASSISTANT_UI.createWhatsAppUrl("5215517973390", "Hola NEXO");
  assert.ok(url.startsWith("https://wa.me/5215517973390?text="));
  assert.equal(decodeURIComponent(url.split("text=")[1]), "Hola NEXO");
});

test("05 UI: index includes assistant stylesheet", () => {
  assert.ok(indexSource.includes("assets/css/nexo-assistant.css"));
});

test("06 UI: index loads assistant scripts in required order", () => {
  const order = [
    "assets/js/config.js",
    "assets/js/data.js",
    "assets/js/nexo-assistant-config.js",
    "assets/data/nexo-knowledge.js",
    "assets/js/nexo-assistant-engine.js",
    "assets/js/nexo-assistant-ui.js"
  ].map((item) => indexSource.indexOf(item));
  assert.ok(order.every((index) => index > -1));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
});

test("07 UI: launcher is created", () => {
  const { controller } = createMountedController();
  assert.ok(controller.getNodes().launcher);
  assert.ok(findText(controller.getNodes().launcher, "NEXO Asistente"));
  assert.equal(controller.getNodes().launcher.attributes["aria-label"], "Abrir NEXO Asistente");
});

test("08 UI: launcher opens dialog", () => {
  const { controller } = createMountedController();
  controller.getNodes().launcher.click();
  assert.equal(controller.getNodes().panel.hidden, false);
  assert.equal(controller.getState().open, true);
});

test("09 UI: close button hides dialog", () => {
  const { controller } = createMountedController();
  controller.open();
  controller.close();
  assert.equal(controller.getNodes().panel.hidden, true);
});

test("10 UI: Escape closes dialog", () => {
  const { controller, document } = createMountedController();
  controller.open();
  document.dispatchEvent({ type: "keydown", key: "Escape" });
  assert.equal(controller.getState().open, false);
});

test("11 UI: focus enters input on open", () => {
  const { controller, document } = createMountedController();
  controller.open();
  assert.equal(document.activeElement, controller.getNodes().input);
});

test("12 UI: focus returns to launcher on close", () => {
  const { controller, document } = createMountedController();
  controller.getNodes().launcher.focus();
  controller.open();
  controller.close();
  assert.equal(document.activeElement, controller.getNodes().launcher);
});

test("13 UI: reset clears context and keeps welcome", () => {
  const { controller } = createMountedController();
  controller.sendMessage("Tengo una barberia con 4 servicios");
  controller.resetConversation(true);
  assert.equal(controller.getState().leadContext.businessType, "");
  assert.ok(findText(controller.getNodes().messages, "Hola, soy el asistente digital"));
});

test("14 UI: welcome message appears", () => {
  const { controller } = createMountedController();
  assert.ok(findText(controller.getNodes().messages, "asistente digital de NEXO26"));
});

test("15 UI: initial actions render", () => {
  const { controller } = createMountedController();
  assert.ok(findText(controller.getNodes().messages, "Analizar mi negocio"));
  assert.ok(findText(controller.getNodes().messages, "Ver paquetes"));
  assert.ok(findText(controller.getNodes().messages, "Ver servicios"));
});

test("16 UI: package action renders official plans", () => {
  const { controller } = createMountedController();
  controller.handleAction("show_plans");
  assert.ok(findText(controller.getNodes().messages, "NEXO Esencial"));
  assert.ok(findText(controller.getNodes().messages, "$2,299 MXN"));
});

test("17 UI: guided analysis starts one step at a time", () => {
  const { controller } = createMountedController();
  controller.handleAction("start_analysis");
  assert.ok(findText(controller.getNodes().messages, "Paso 1 de 9"));
  assert.ok(findText(controller.getNodes().messages, "Giro del negocio"));
});

test("18 UI: first guided step has previous disabled", () => {
  const { controller } = createMountedController();
  controller.handleAction("start_analysis");
  const previous = find(controller.getNodes().messages, (node) => node.tagName === "BUTTON" && node.textContent.includes("Anterior"));
  assert.equal(previous.disabled, true);
});

test("19 UI: skip advances guided step", () => {
  const { controller } = createMountedController();
  controller.handleAction("start_analysis");
  const skip = find(controller.getNodes().messages, (node) => node.tagName === "BUTTON" && node.textContent.includes("Omitir"));
  skip.click();
  assert.ok(findText(controller.getNodes().messages, "Paso 2 de 9"));
});

test("20 UI: cancel guided analysis works", () => {
  const { controller } = createMountedController();
  controller.handleAction("start_analysis");
  const cancel = find(controller.getNodes().messages, (node) => node.tagName === "BUTTON" && node.textContent.includes("Cancelar"));
  cancel.click();
  assert.equal(controller.getState().guided.active, false);
  assert.ok(findText(controller.getNodes().messages, "Análisis cancelado"));
});

test("21 UI: free text price question works", () => {
  const { controller } = createMountedController();
  const response = controller.sendMessage("Cuanto cuesta una pagina?");
  assert.equal(response.intent, "ask_price");
  assert.ok(findText(controller.getNodes().messages, "paquetes base"));
});

test("22 UI: free text recommendation renders card", () => {
  const { controller } = createMountedController();
  const response = controller.sendMessage("Tengo una clinica dental con 8 tratamientos, mapa y galeria");
  assert.equal(response.recommendedPlan, "professional");
  assert.ok(findText(controller.getNodes().messages, "NEXO Profesional"));
});

test("23 UI: summary action creates WhatsApp link without opening automatically", () => {
  const { controller, opened } = createMountedController();
  controller.sendMessage("Tengo tres gimnasios y quiero mostrar cada sucursal");
  controller.handleAction("build_summary");
  assert.equal(opened.length, 0);
  const link = find(controller.getNodes().messages, (node) => node.tagName === "A" && node.textContent.includes("Continuar por WhatsApp"));
  assert.ok(link.href.startsWith("https://wa.me/5215517973390?text="));
});

test("24 UI: package CTA prepares WhatsApp link without imperative opening", () => {
  const { controller, opened } = createMountedController();
  controller.handleAction("show_plans");
  assert.equal(opened.length, 0);
  const cta = find(controller.getNodes().messages, (node) => node.tagName === "BUTTON" && node.textContent.includes("Preparar resumen de NEXO Esencial"));
  cta.click();
  assert.equal(opened.length, 0);
  const link = find(controller.getNodes().messages, (node) => node.tagName === "A" && node.textContent.includes("Continuar por WhatsApp"));
  assert.ok(link.href.startsWith("https://wa.me/5215517973390?text="));
});

test("25 UI: 800 character limit is controlled", () => {
  const { controller } = createMountedController();
  const response = controller.sendMessage("x".repeat(801));
  assert.equal(response, null);
  assert.ok(findText(controller.getNodes().messages, "800 caracteres"));
});

test("26 UI: user HTML is shown as text", () => {
  const { controller } = createMountedController();
  controller.sendMessage("<img src=x onerror=alert(1)>");
  assert.ok(findText(controller.getNodes().messages, "<img src=x onerror=alert(1)>"));
});

test("27 UI: portfolio excludes drafts", () => {
  const { controller } = createMountedController();
  controller.handleAction("show_portfolio");
  assert.ok(findText(controller.getNodes().messages, "Barbería Premium"));
  assert.ok(!findText(controller.getNodes().messages, "Casa Lote"));
});

test("28 UI: portfolio renders six public cards", () => {
  const { controller } = createMountedController();
  controller.handleAction("show_portfolio");
  assert.equal(controller.getNodes().messages.querySelectorAll(".nexo-assistant-info-card").length, 6);
});

test("29 UI: structure action renders disclaimer", () => {
  const { controller } = createMountedController();
  controller.handleAction("generate_structure");
  assert.ok(findText(controller.getNodes().messages, "no una maqueta personalizada"));
});

test("30 UI: visual direction action renders concise guidance", () => {
  const { controller } = createMountedController();
  controller.handleAction("generate_visual_direction");
  assert.ok(findText(controller.getNodes().messages, "visual sugerida"));
});

test("31 UI: human action creates contextual WhatsApp link", () => {
  const { controller } = createMountedController();
  controller.handleAction("request_human");
  const link = find(controller.getNodes().messages, (node) => node.tagName === "A" && node.textContent.includes("Continuar por WhatsApp"));
  assert.ok(link.href.includes("5215517973390"));
  assert.equal(link.attributes.rel, "noopener noreferrer");
});

test("32 UI: dialog has required accessibility attributes", () => {
  const { controller } = createMountedController();
  const panel = controller.getNodes().panel;
  assert.equal(panel.attributes.role, "dialog");
  assert.equal(panel.attributes["aria-modal"], "true");
  assert.equal(panel.attributes["aria-labelledby"], "nexo-assistant-title");
  assert.equal(panel.attributes["aria-describedby"], "nexo-assistant-description");
});

test("33 UI: privacy notice is visible", () => {
  const { controller } = createMountedController();
  assert.ok(findText(controller.getNodes().composer, "únicamente para preparar esta orientación"));
});

test("34 UI: score and confidence are not displayed by UI copy", () => {
  assert.ok(!/leadScore|confidence|matchedTerms|matched terms/i.test(uiSource));
});

test("35 UI: no dynamic HTML insertion is used", () => {
  assert.ok(!uiSource.includes("innerHTML"));
});

test("36 UI: no permanent storage, network calls or imperative WhatsApp open", () => {
  assert.ok(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest/i.test(uiSource));
  assert.ok(!/window\.open|win\.open/i.test(uiSource));
});

test("37 UI: CSS uses mobile 100dvh", () => {
  assert.ok(cssSource.includes("height: 100dvh"));
});

test("38 UI: CSS respects safe areas", () => {
  assert.ok(cssSource.includes("env(safe-area-inset-bottom)"));
});

test("39 UI: CSS includes reduced motion", () => {
  assert.ok(cssSource.includes("prefers-reduced-motion: reduce"));
});

test("40 UI: launcher and WhatsApp coexist by fixed offsets", () => {
  assert.ok(cssSource.includes("bottom: calc(92px + env(safe-area-inset-bottom))"));
  assert.ok(cssSource.includes("bottom: calc(86px + env(safe-area-inset-bottom))"));
});

for (const item of tests) {
  item.fn();
  console.log(`ok - ${item.name}`);
}

console.log(`${tests.length} UI tests passed`);
