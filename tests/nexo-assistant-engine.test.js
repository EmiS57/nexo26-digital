"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function createBrowserHarness() {
  const sandbox = { URL, encodeURIComponent, decodeURIComponent };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  const context = vm.createContext(sandbox);
  [
    "assets/js/config.js",
    "assets/js/data.js",
    "assets/js/nexo-assistant-config.js",
    "assets/data/nexo-knowledge.js",
    "assets/js/nexo-assistant-engine.js"
  ].forEach((file) => {
    const code = fs.readFileSync(path.join(process.cwd(), file), "utf8");
    vm.runInContext(code, context, { filename: file });
  });
  return context;
}

const browser = createBrowserHarness();
const sourceData = browser.NEXO_DATA;
const knowledgeApi = browser.NEXO_ASSISTANT_KNOWLEDGE_UTILS;
const engine = browser.NEXO_ASSISTANT_ENGINE;
const knowledge = knowledgeApi.createNexoKnowledge({ config: browser.NEXO_CONFIG, data: sourceData });

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function planFor(context) {
  return engine.recommendPlan(engine.createLeadContext(context), knowledge);
}

function sourcePlan(sourceId) {
  return sourceData.webPackages.find((item) => item.id === sourceId);
}

function planById(planId) {
  return knowledge.plans.find((item) => item.id === planId);
}

function response(message, leadContext = {}) {
  return engine.generateDemoResponse({ message, leadContext, knowledge });
}

function assertNoUnsafeValues(text) {
  assert.ok(!/(undefined|null|\[object Object\]|true|false)/i.test(text), text);
}

function decodedWhatsAppText(url) {
  const parsed = new URL(url);
  return decodeURIComponent(parsed.searchParams.get("text") || "");
}

test("01 required: simple business with 4 services recommends Essential", () => {
  const rec = planFor({ businessType: "servicio tecnico", serviceCount: 4, goals: ["Presentar servicios"] });
  assert.equal(rec.planId, "essential");
  assert.equal(rec.planName, "NEXO Esencial");
});

test("02 required: clinic with 8 treatments, map and gallery recommends Professional", () => {
  const rec = planFor({ businessType: "clinica dental", serviceCount: 8, hasPhysicalLocation: true, requestedFeatures: ["mapa", "galeria"] });
  assert.equal(rec.planId, "professional");
});

test("03 required: business with 3 branches and pages by branch recommends A Medida", () => {
  const rec = planFor({ businessType: "gimnasio", branches: 3, requestedFeatures: ["pagina por sede", "sucursales"] });
  assert.equal(rec.planId, "custom");
});

test("04 required: business with 12 categories and team recommends A Medida", () => {
  const rec = planFor({ businessType: "inmobiliaria", serviceCount: 12, requestedFeatures: ["equipo"] });
  assert.equal(rec.planId, "custom");
});

test("05 required: business with 6 services and FAQ recommends Professional with reason", () => {
  const rec = planFor({ businessType: "optica", serviceCount: 6, requestedFeatures: ["preguntas frecuentes"] });
  assert.equal(rec.planId, "professional");
  assert.ok(rec.reasons.some((reason) => normalize(reason).includes("preguntas")));
});

test("06 required: existing website update does not recommend new build automatically", () => {
  const rec = planFor({ hasWebsite: true, websiteCondition: "pagina existente desactualizada", requestedFeatures: ["actualizar"] });
  assert.equal(rec.planId, "update");
  assert.ok(normalize(rec.reasons.join(" ")).includes("actualizar"));
});

test("07 required: price question maps to ask_price", () => {
  assert.equal(engine.detectIntent("Cuanto cuesta?", {}).intent, "ask_price");
});

test("08 required: speaking with Emilio maps to request_human", () => {
  assert.equal(engine.detectIntent("Quiero hablar con Emilio", {}).intent, "request_human");
});

test("09 required: package uncertainty maps to start_analysis", () => {
  assert.equal(engine.detectIntent("No se que paquete necesito", {}).intent, "start_analysis");
});

test("10 required: domain question maps to ask_domain", () => {
  assert.equal(engine.detectIntent("Incluye dominio?", {}).intent, "ask_domain");
});

test("11 required: unknown text produces safe fallback", () => {
  const result = response("Esto no tiene mucho sentido xyz");
  assert.equal(result.intent, "unknown");
  assert.ok(result.reply.length > 20);
  assert.equal(result.requiresHuman, false);
  assert.ok(result.suggestedActions.every(engine.isAllowedAction));
});

test("12 required: disallowed action is removed", () => {
  assert.deepEqual(engine.sanitizeSuggestedActions(["open_whatsapp", "delete_files", "restart"]), ["open_whatsapp", "restart"]);
});

test("13 required: invented plan is rejected", () => {
  assert.equal(engine.validatePlanRecommendation({ planId: "enterprise" }, knowledge), false);
});

test("14 required: arbitrary external URL is rejected", () => {
  assert.equal(engine.validateUrl("https://evil.example.com/pay"), false);
});

test("15 required: message above 800 chars is truncated in controlled way", () => {
  const validated = engine.validateUserMessage("a".repeat(1000));
  assert.equal(validated.sanitized.length, 800);
  assert.equal(validated.truncated, true);
});

test("16 required: user HTML is treated as text", () => {
  const validated = engine.validateUserMessage("<script>alert(1)</script><b>Hola</b>");
  assert.equal(validated.sanitized.includes("<"), false);
  assert.equal(validated.sanitized.includes(">"), false);
  assert.ok(validated.sanitized.includes("script"));
});

test("17 required: empty fields do not appear in summary", () => {
  const lead = engine.createLeadContext({ businessType: "clinica dental", city: "Nezahualcoyotl", serviceCount: 8, goals: ["Presentar tratamientos"] });
  const summary = engine.buildLeadSummary(lead, planFor(lead), knowledge);
  assert.ok(!summary.text.includes("Nombre:"));
  assert.ok(!summary.text.includes("Sucursales:"));
  assertNoUnsafeValues(summary.text);
});

test("18 required: drafts are excluded from portfolio", () => {
  const portfolioIds = knowledgeApi.getPublicPortfolio(sourceData.projects).map((item) => item.id);
  const draftIds = sourceData.projects.filter((item) => item.status === "draft" || item.published === false).map((item) => item.id);
  draftIds.forEach((id) => assert.equal(portfolioIds.includes(id), false, `${id} should be excluded`));
});

test("19 required: portfolio keeps the approved public set only", () => {
  const portfolioIds = Array.from(knowledgeApi.getPublicPortfolio(sourceData.projects), (item) => item.id);
  assert.deepEqual(portfolioIds, ["barberia-premium", "veterinaria-demo-01", "asador-argentino", "servicio-local-express", "vistaelite-optica", "veterinaria-demo-02"]);
});

test("20 required: only published active projects are included", () => {
  knowledgeApi.getPublicPortfolio(sourceData.projects).forEach((project) => {
    const source = sourceData.projects.find((item) => item.id === project.id);
    assert.equal(source.status, "published");
    assert.notEqual(source.published, false);
    assert.notEqual(source.active, false);
  });
});

test("21 required: exploratory prospect gets low score", () => {
  const score = engine.calculateLeadScore(engine.createLeadContext({ businessType: "tienda" }));
  assert.ok(score <= 3);
  assert.equal(engine.classifyLeadScore(score), "Exploracion");
});

test("22 required: branches, urgency and materials get high score", () => {
  const score = engine.calculateLeadScore(engine.createLeadContext({
    businessType: "restaurante",
    city: "CDMX",
    hasPhysicalLocation: true,
    branches: 3,
    usesWhatsApp: true,
    currentChannels: ["WhatsApp", "Instagram"],
    serviceCount: 12,
    goals: ["Ordenar informacion"],
    requestedFeatures: ["galeria", "sucursales"],
    urgency: "esta semana",
    availableMaterials: ["logo", "fotos", "menu"]
  }));
  assert.ok(score >= 9);
  assert.equal(engine.classifyLeadScore(score), "Prioridad alta");
});

test("23 required: lead score never modifies prices", () => {
  const rec = planFor({ businessType: "restaurante", branches: 3, serviceCount: 12, requestedFeatures: ["sucursales", "equipo"] });
  assert.equal(planById(rec.planId).price, "$3,999 MXN");
});

test("24 required: response does not promise sales", () => {
  const result = response("Me garantizan ventas?");
  assert.ok(!/ventas aseguradas|clientes garantizados|te garantizamos/i.test(result.reply));
});

test("25 required: response does not promise advanced SEO", () => {
  const result = response("Quiero SEO avanzado garantizado");
  assert.equal(result.requiresHuman, true);
  assert.ok(!/primer lugar garantizado|seo avanzado incluido/i.test(result.reply));
});

test("26 required: response does not offer domain included in Essential", () => {
  const result = response("Incluye dominio?");
  assert.ok(result.reply.includes("NEXO Esencial no incluye dominio"));
});

test("27 required: response does not offer unlimited changes", () => {
  const result = response("Puedo pedir cambios ilimitados?");
  assert.ok(!/cambios ilimitados incluidos|sin limite de cambios/i.test(result.reply));
});

test("28 required: out-of-scope integration escalates", () => {
  const result = response("Quiero una automatizacion avanzada con API y webhooks");
  assert.equal(result.requiresHuman, true);
  assert.ok(normalize(result.reply).includes("emilio") || normalize(result.reply).includes("confirm"));
});

test("29 commercial: Essential respects price, payment, domain, revision and delivery rules", () => {
  const plan = planById("essential");
  assert.equal(plan.price, "$999 MXN");
  assert.ok(normalize(plan.payment).includes("pago completo"));
  assert.equal(plan.scope.domain, "Sin dominio incluido");
  assert.equal(plan.scope.revisions, 1);
  assert.ok(/48\s*(a|-|–|—)\s*72/.test(plan.delivery));
});

test("30 commercial: Professional respects price, payment, domain, revisions and delivery", () => {
  const plan = planById("professional");
  assert.equal(plan.price, "$2,299 MXN");
  assert.ok(plan.payment.includes("$1,600"));
  assert.ok(plan.payment.includes("$699"));
  assert.equal(plan.scope.revisions, 2);
  assert.ok(normalize(plan.scope.domain).includes("cliente ya cuenta"));
  assert.ok(normalize(plan.delivery).includes("72"));
});

test("31 commercial: A Medida respects price, payment, revisions and delivery", () => {
  const plan = planById("custom");
  assert.equal(plan.price, "$3,999 MXN");
  assert.ok(plan.payment.includes("$2,400"));
  assert.ok(plan.payment.includes("$1,599"));
  assert.equal(plan.scope.revisions, 3);
  assert.ok(/5\s*(a|-|–|—)\s*7/.test(plan.delivery));
});

test("32 commercial: extras respect approved prices", () => {
  const extras = Object.fromEntries(knowledge.extras.map((item) => [item.id, item]));
  assert.equal(extras.updates.price, "Desde $200 MXN");
  assert.equal(extras.renewal.price, "$399 MXN");
  assert.ok(normalize(extras.domain.price).includes("desde $350 mxn"));
  assert.ok(normalize(extras.domain.price).includes("costo del dominio"));
});

test("33 source of truth: package names and prices stay synced with data.js", () => {
  const mapping = { essential: "esencial", professional: "profesional", custom: "medida" };
  Object.entries(mapping).forEach(([planId, sourceId]) => {
    const plan = planById(planId);
    const source = sourcePlan(sourceId);
    assert.equal(plan.name, source.name);
    assert.equal(plan.price, source.price);
  });
});

test("34 portfolio: returns the six approved public demos by slug", () => {
  const expected = ["barberia-premium", "veterinaria-demo-01", "asador-argentino", "servicio-local-express", "vistaelite-optica", "veterinaria-demo-02"];
  const actual = Array.from(knowledgeApi.getPublicPortfolio(sourceData.projects), (item) => item.slug);
  assert.deepEqual(actual, expected);
});

test("35 portfolio: returns the six approved public demos by name", () => {
  const names = Array.from(knowledgeApi.getPublicPortfolio(sourceData.projects), (item) => item.name);
  assert.deepEqual(names, ["Barberia Premium", "Concepto veterinario 01", "Asador Argentino", "Servicio Local Express", "VistaElite Optica", "Concepto veterinario 02"].map((item) => {
    const found = names.find((name) => normalize(name) === normalize(item));
    return found;
  }));
});

test("36 WhatsApp summary: complete Bunker Gym summary decodes cleanly", () => {
  const lead = engine.createLeadContext({
    name: "Bunker Gym",
    businessName: "Bunker Gym",
    businessType: "Gimnasio",
    city: "Nezahualcoyotl",
    branches: 3,
    serviceCount: 12,
    goals: ["Reunir informacion de todas las sedes"],
    requestedFeatures: ["Mapas", "horarios", "planes", "galeria", "promociones"],
    usesWhatsApp: true,
    currentChannels: ["WhatsApp", "Instagram"],
    availableMaterials: ["logo", "fotos"]
  });
  const rec = engine.recommendPlan(lead, knowledge);
  const summary = engine.buildLeadSummary(lead, rec, knowledge);
  assert.equal(rec.planId, "custom");
  assert.ok(summary.whatsappUrl.startsWith("https://wa.me/5215517973390?text="));
  const decoded = decodedWhatsAppText(summary.whatsappUrl);
  assert.ok(decoded.includes("Bunker Gym"));
  assert.ok(decoded.includes("Sucursales: 3"));
  assert.ok(decoded.includes("Servicios: 12 servicios o categorias aproximadas"));
  assert.ok(decoded.includes("Paquete de interes: NEXO A Medida"));
  assertNoUnsafeValues(decoded);
});

test("37 browser harness: scripts load without Node, bundler or missing references", () => {
  const sandbox = { URL, encodeURIComponent, decodeURIComponent };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  const context = vm.createContext(sandbox);
  [
    "assets/js/config.js",
    "assets/js/data.js",
    "assets/js/nexo-assistant-config.js",
    "assets/data/nexo-knowledge.js",
    "assets/js/nexo-assistant-engine.js"
  ].forEach((file) => {
    const code = fs.readFileSync(path.join(process.cwd(), file), "utf8");
    vm.runInContext(code, context, { filename: file });
  });
  assert.ok(context.NEXO_ASSISTANT_CONFIG);
  assert.ok(context.NEXO_ASSISTANT_KNOWLEDGE);
  assert.ok(context.NEXO_ASSISTANT_ENGINE);
  const demo = context.NEXO_ASSISTANT_ENGINE.generateDemoResponse({ message: "Cuanto cuesta una pagina?", knowledge: context.NEXO_ASSISTANT_KNOWLEDGE });
  assert.equal(demo.intent, "ask_price");
  const lead = context.NEXO_ASSISTANT_ENGINE.createLeadContext({ businessType: "dental", serviceCount: 8, requestedFeatures: ["mapa", "galeria"] });
  const rec = context.NEXO_ASSISTANT_ENGINE.recommendPlan(lead, context.NEXO_ASSISTANT_KNOWLEDGE);
  assert.equal(rec.planId, "professional");
  const summary = context.NEXO_ASSISTANT_ENGINE.buildLeadSummary(lead, rec, context.NEXO_ASSISTANT_KNOWLEDGE);
  assert.ok(summary.whatsappUrl.startsWith("https://wa.me/5215517973390?text="));
});

test("38 public API: exposes a small stable engine surface", () => {
  const expected = [
    "ALLOWED_ACTIONS",
    "INTENTS",
    "defaultLeadContext",
    "createLeadContext",
    "sanitizeLeadContext",
    "mergeLeadContext",
    "clearLeadContext",
    "getMissingLeadFields",
    "detectIntent",
    "isAllowedAction",
    "sanitizeSuggestedActions",
    "getPublicPortfolio",
    "recommendPlan",
    "calculateLeadScore",
    "classifyLeadScore",
    "generateBusinessStructure",
    "generateVisualDirection",
    "generateDemoResponse",
    "buildLeadSummary",
    "validateUserMessage",
    "validateLeadContext",
    "validatePlanRecommendation",
    "validateUrl",
    "validateDemoResponse",
    "validateSummary"
  ].sort();
  assert.deepEqual(Object.keys(engine).sort(), expected);
});

test("39 purity: context functions and recommendation do not mutate arguments", () => {
  const original = { goals: ["Presentar servicios"], currentChannels: ["WhatsApp"], serviceCount: 4 };
  const before = JSON.stringify(original);
  const merged = engine.mergeLeadContext(original, { goals: ["Recibir mensajes"] });
  engine.recommendPlan(original, knowledge);
  assert.equal(JSON.stringify(original), before);
  assert.notEqual(merged, original);
});

test("40 immutability: knowledge objects are frozen and cannot be modified through results", () => {
  assert.equal(Object.isFrozen(knowledge), true);
  assert.equal(Object.isFrozen(knowledge.plans), true);
  assert.equal(Object.isFrozen(knowledge.plans[0]), true);
  assert.throws(() => {
    knowledge.plans[0].price = "$1 MXN";
  }, TypeError);
  const rec = engine.recommendPlan({ businessType: "restaurante", serviceCount: 12 }, knowledge);
  rec.alternatives.push({ planId: "fake", price: "$0" });
  assert.equal(planById("custom").price, "$3,999 MXN");
});

test("41 response privacy: public reply does not expose confidence, matched terms or lead score", () => {
  const result = response("Tengo una clinica dental con 8 tratamientos");
  const visible = normalize(result.reply);
  assert.equal(visible.includes("confidence"), false);
  assert.equal(visible.includes("matched"), false);
  assert.equal(visible.includes("lead score"), false);
});

test("42 security: production assistant files avoid unsafe browser/code APIs", () => {
  const files = ["assets/js/nexo-assistant-config.js", "assets/data/nexo-knowledge.js", "assets/js/nexo-assistant-engine.js"];
  const forbidden = ["innerHTML", "eval(", "new Function", "document.write", "localStorage", "sessionStorage", "fetch(", "XMLHttpRequest", "console.log", "require(", "module.exports", "process.", "Buffer", "__dirname"];
  files.forEach((file) => {
    const code = fs.readFileSync(path.join(process.cwd(), file), "utf8");
    forbidden.forEach((term) => assert.equal(code.includes(term), false, `${file} should not contain ${term}`));
  });
});

let passed = 0;
for (const item of tests) {
  item.fn();
  passed += 1;
  console.log(`ok ${passed} - ${item.name}`);
}

console.log(`\n${passed} tests passed`);
