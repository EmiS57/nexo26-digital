(function (root, factory) {
  "use strict";

  const api = factory({
    config: root.NEXO_ASSISTANT_CONFIG || {},
    knowledge: root.NEXO_ASSISTANT_KNOWLEDGE || {}
  });

  root.NEXO_ASSISTANT_ENGINE = api;
})(typeof window !== "undefined" ? window : globalThis, function createAssistantEngine(dependencies) {
  "use strict";

  const assistantConfig = dependencies.config || {};
  const defaultKnowledge = dependencies.knowledge || {};
  const DEFAULT_MAX_MESSAGE_LENGTH = Number(assistantConfig.maxMessageLength || 800);

  const ALLOWED_ACTIONS = Object.freeze([
    "show_services",
    "show_plans",
    "start_analysis",
    "continue_analysis",
    "show_portfolio",
    "show_plan_details",
    "generate_structure",
    "generate_visual_direction",
    "build_summary",
    "copy_summary",
    "open_whatsapp",
    "request_human",
    "restart"
  ]);

  const INTENTS = Object.freeze([
    "greeting",
    "show_services",
    "show_plans",
    "ask_price",
    "ask_timeline",
    "ask_domain",
    "ask_updates",
    "ask_requirements",
    "ask_portfolio",
    "start_analysis",
    "continue_analysis",
    "recommend_plan",
    "generate_structure",
    "generate_visual_direction",
    "build_summary",
    "request_quote",
    "request_human",
    "open_whatsapp",
    "restart",
    "unknown"
  ]);

  const defaultLeadContext = Object.freeze({
    name: "",
    businessName: "",
    businessType: "",
    city: "",
    hasPhysicalLocation: null,
    branches: null,
    currentChannels: Object.freeze([]),
    usesWhatsApp: null,
    hasWebsite: null,
    websiteCondition: "",
    serviceCount: null,
    commonQuestions: Object.freeze([]),
    goals: Object.freeze([]),
    requestedFeatures: Object.freeze([]),
    urgency: "",
    availableMaterials: Object.freeze([]),
    hasDomain: null,
    domainStatus: "",
    contactMethod: "",
    additionalComment: "",
    recommendedPlan: "",
    recommendationReasons: Object.freeze([]),
    leadScore: 0
  });

  const PLAN_LABELS = Object.freeze({
    essential: "NEXO Esencial",
    professional: "NEXO Profesional",
    custom: "NEXO A Medida",
    update: "Actualizacion de contenido"
  });

  const NUMBER_WORDS = Object.freeze({
    una: 1,
    un: 1,
    dos: 2,
    tres: 3,
    cuatro: 4,
    cinco: 5,
    seis: 6,
    siete: 7,
    ocho: 8,
    nueve: 9,
    diez: 10,
    once: 11,
    doce: 12
  });

  const FEATURE_SYNONYMS = Object.freeze({
    gallery: ["galeria", "fotos", "imagenes", "portafolio visual"],
    map: ["mapa", "ubicacion", "google maps", "local fisico"],
    faq: ["faq", "preguntas", "preguntas frecuentes", "dudas"],
    testimonials: ["testimonios", "resenas", "opiniones"],
    analytics: ["analitica", "analytics", "medicion"],
    qr: ["qr", "codigo qr"],
    promotions: ["promociones", "ofertas", "paquetes"],
    team: ["equipo", "personal", "staff"],
    portfolio: ["portafolio", "proyectos", "trabajos"],
    catalog: ["catalogo", "productos", "categorias"],
    payments: ["pagos", "cobros", "mercado pago", "paypal", "checkout"],
    reservations: ["reservas", "reservaciones", "citas", "agenda"],
    multiPage: ["varias paginas", "3 paginas", "por sede", "sucursales", "pagina por sede"],
    customSections: ["secciones especiales", "personalizado", "a medida", "estructura especial"],
    update: ["actualizar", "redisenar", "mejorar pagina", "cambios", "pagina existente"],
    seoAdvanced: ["seo avanzado", "primer lugar", "posicionamiento garantizado"],
    crm: ["crm", "automatizacion", "api", "webhook"]
  });

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function asArray(value) {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null || value === "") return [];
    return [value];
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\w\s$.,!?/-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function sanitizeText(value, maxLength = DEFAULT_MAX_MESSAGE_LENGTH) {
    const text = String(value || "")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
      .replace(/[<>]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!maxLength || text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim();
  }

  function toPositiveNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) return null;
    return number;
  }

  function toNullableBoolean(value) {
    if (value === true || value === false || value === null) return value;
    const normalized = normalizeText(value);
    if (["si", "yes", "true", "1"].includes(normalized)) return true;
    if (["no", "false", "0"].includes(normalized)) return false;
    return null;
  }

  function cleanArray(value, maxItems = 12) {
    return asArray(value)
      .map((item) => sanitizeText(item, 120))
      .filter(Boolean)
      .filter((item, index, arr) => arr.findIndex((other) => normalizeText(other) === normalizeText(item)) === index)
      .slice(0, maxItems);
  }

  function createLeadContext(seed = {}) {
    return sanitizeLeadContext(Object.assign({}, clone(defaultLeadContext), clone(seed || {})));
  }

  function sanitizeLeadContext(context = {}) {
    return {
      name: sanitizeText(context.name, 80),
      businessName: sanitizeText(context.businessName, 120),
      businessType: sanitizeText(context.businessType, 120),
      city: sanitizeText(context.city, 100),
      hasPhysicalLocation: toNullableBoolean(context.hasPhysicalLocation),
      branches: toPositiveNumber(context.branches),
      currentChannels: cleanArray(context.currentChannels),
      usesWhatsApp: toNullableBoolean(context.usesWhatsApp),
      hasWebsite: toNullableBoolean(context.hasWebsite),
      websiteCondition: sanitizeText(context.websiteCondition, 180),
      serviceCount: toPositiveNumber(context.serviceCount),
      commonQuestions: cleanArray(context.commonQuestions),
      goals: cleanArray(context.goals),
      requestedFeatures: cleanArray(context.requestedFeatures),
      urgency: sanitizeText(context.urgency, 80),
      availableMaterials: cleanArray(context.availableMaterials),
      hasDomain: toNullableBoolean(context.hasDomain),
      domainStatus: sanitizeText(context.domainStatus, 120),
      contactMethod: sanitizeText(context.contactMethod, 140),
      additionalComment: sanitizeText(context.additionalComment, 300),
      recommendedPlan: sanitizeText(context.recommendedPlan, 80),
      recommendationReasons: cleanArray(context.recommendationReasons),
      leadScore: Math.max(0, Math.min(10, Number(context.leadScore || 0)))
    };
  }

  function mergeLeadContext(base = {}, patch = {}) {
    const current = sanitizeLeadContext(base);
    const incoming = sanitizeLeadContext(patch);
    const merged = Object.assign({}, current);

    Object.keys(incoming).forEach((key) => {
      const value = incoming[key];
      if (Array.isArray(value)) {
        merged[key] = cleanArray([...(current[key] || []), ...value]);
        return;
      }
      if (value !== "" && value !== null && value !== undefined) {
        merged[key] = value;
      }
    });

    return sanitizeLeadContext(merged);
  }

  function clearLeadContext() {
    return createLeadContext();
  }

  function getMissingLeadFields(context = {}) {
    const lead = sanitizeLeadContext(context);
    const missing = [];
    if (!lead.businessType) missing.push("businessType");
    if (!lead.city) missing.push("city");
    if (!lead.serviceCount) missing.push("serviceCount");
    if (!lead.goals.length) missing.push("goals");
    if (!lead.currentChannels.length) missing.push("currentChannels");
    if (lead.usesWhatsApp === null) missing.push("usesWhatsApp");
    if (!lead.availableMaterials.length) missing.push("availableMaterials");
    return missing;
  }

  function matchTerms(normalizedMessage, terms) {
    return terms.filter((term) => normalizedMessage.includes(normalizeText(term)));
  }

  function detectIntent(message, context = {}) {
    const normalized = normalizeText(message);
    if (!normalized) return { intent: "unknown", confidence: 0, matchedTerms: [] };

    const rules = [
      ["restart", ["reiniciar", "empezar de nuevo", "borrar", "otra vez"]],
      ["request_human", ["hablar con emilio", "persona", "humano", "asesor", "alguien", "llamarme", "api", "webhook", "crm", "automatizacion avanzada"]],
      ["open_whatsapp", ["abrir whatsapp", "mandar whatsapp", "enviar por whatsapp", "whatsapp directo"]],
      ["request_quote", ["cotizar", "cotizacion", "propuesta", "precio final", "quiero contratar", "tienda con pagos", "pagos en linea"]],
      ["start_analysis", ["no se que paquete", "no se cual", "ayudame a elegir", "analiza mi negocio", "diagnostico", "orientame"]],
      ["continue_analysis", ["siguiente", "continuar", "ya te dije", "tambien tengo", "agrega esto"]],
      ["ask_domain", ["dominio", "dominio propio", "incluye dominio", "conectar dominio"]],
      ["ask_price", ["cuanto cuesta", "precio", "costo", "inversion", "desde cuanto", "tarifa"]],
      ["ask_timeline", ["tiempo", "entrega", "cuando", "cuanto tardan", "48", "72"]],
      ["ask_updates", ["actualizacion", "actualizar", "cambios", "renovacion", "mantenimiento"]],
      ["ask_requirements", ["que necesitas", "requisitos", "materiales", "que mando", "informacion necesitan"]],
      ["ask_portfolio", ["portafolio", "demos", "ejemplos", "trabajos", "conceptos"]],
      ["show_plans", ["paquetes", "planes", "opciones", "nexo esencial", "nexo profesional", "nexo a medida"]],
      ["show_services", ["servicios", "que hacen", "soluciones", "que incluye"]],
      ["generate_structure", ["estructura", "secciones", "como quedaria", "orden de pagina"]],
      ["generate_visual_direction", ["estilo visual", "colores", "direccion visual", "diseno", "look"]],
      ["build_summary", ["resumen", "recap", "mensaje preparado", "resumir"]],
      ["recommend_plan", ["recomienda", "recomendacion", "que paquete me conviene", "cual me conviene"]],
      ["greeting", ["hola", "buenas", "que tal", "hey", "oye"]]
    ];

    let best = { intent: "unknown", confidence: 0.24, matchedTerms: [] };
    rules.forEach(([intent, terms]) => {
      const matches = matchTerms(normalized, terms);
      if (!matches.length) return;
      const density = matches.join(" ").length / Math.max(normalized.length, 1);
      const confidence = Math.min(0.98, 0.62 + matches.length * 0.12 + density * 0.2);
      if (confidence > best.confidence) {
        best = { intent, confidence: Number(confidence.toFixed(2)), matchedTerms: matches };
      }
    });

    if (best.intent === "unknown" && context && getMissingLeadFields(context).length < 4) {
      return { intent: "continue_analysis", confidence: 0.45, matchedTerms: [] };
    }

    return best;
  }

  function isAllowedAction(action) {
    return ALLOWED_ACTIONS.includes(String(action || ""));
  }

  function sanitizeSuggestedActions(actions = []) {
    return cleanArray(actions, ALLOWED_ACTIONS.length).filter(isAllowedAction);
  }

  function getPlan(knowledge, planId) {
    return (knowledge.plans || []).find((plan) => plan.id === planId) || null;
  }

  function getExtra(knowledge, extraId) {
    return (knowledge.extras || []).find((extra) => extra.id === extraId || extra.sourceId === extraId) || null;
  }

  function getPublicPortfolio(source = defaultKnowledge) {
    const projects = Array.isArray(source) ? source : source.projects || source.publicPortfolio || [];
    return projects
      .filter((project) => {
        if (!project) return false;
        return project.status === undefined ? true : project.status === "published";
      })
      .filter((project) => project && project.published !== false && project.active !== false)
      .map((project) => ({
        id: project.id,
        name: project.displayTitle || project.title || project.name,
        slug: project.slug || project.id,
        industry: project.industry || project.category || "",
        category: project.category || "",
        type: project.type || "",
        package: project.package || "",
        description: project.description || "",
        features: clone(project.features || []),
        video: project.video || "",
        poster: project.poster || "",
        liveUrl: project.liveUrl || "",
        cta: project.cta || "Quiero algo similar"
      }));
  }

  function includesAny(values, groupName) {
    const terms = FEATURE_SYNONYMS[groupName] || [];
    const text = normalizeText(asArray(values).join(" "));
    return terms.some((term) => text.includes(normalizeText(term)));
  }

  function collectNeedMatches(context) {
    const values = [
      ...asArray(context.goals),
      ...asArray(context.requestedFeatures),
      context.websiteCondition,
      ...asArray(context.commonQuestions)
    ];
    return Object.keys(FEATURE_SYNONYMS).filter((key) => includesAny(values, key));
  }

  function buildAlternatives(planId, knowledge) {
    const byPlan = {
      essential: ["professional"],
      professional: ["essential", "custom"],
      custom: ["professional"],
      update: ["essential", "professional"]
    };
    return (byPlan[planId] || ["essential", "professional"])
      .map((id) => getPlan(knowledge, id))
      .filter(Boolean)
      .map((plan) => ({ planId: plan.id, planName: plan.name, price: plan.price }));
  }

  function limitationsForNeeds(matches) {
    const limitations = [];
    if (matches.includes("payments")) limitations.push("La integracion de pagos se cotiza por separado y requiere plataforma compatible.");
    if (matches.includes("reservations")) limitations.push("Las reservaciones avanzadas dependen de una herramienta externa compatible.");
    if (matches.includes("seoAdvanced")) limitations.push("No se garantiza SEO avanzado ni primeros lugares en Google.");
    if (matches.includes("crm")) limitations.push("CRM, APIs, webhooks o automatizaciones se cotizan por separado.");
    return limitations;
  }

  function recommendPlan(leadContext = {}, knowledge = defaultKnowledge) {
    const lead = sanitizeLeadContext(leadContext);
    const matches = collectNeedMatches(lead);
    const services = lead.serviceCount || 0;
    const branches = lead.branches || 0;
    const reasons = [];
    let planId = "essential";
    let confidence = 0.72;

    if (lead.hasWebsite && (matches.includes("update") || normalizeText(lead.websiteCondition).includes("existente"))) {
      const update = getExtra(knowledge, "updates") || { name: "Actualizacion de contenido", price: "Desde $200 MXN" };
      return {
        planId: "update",
        planName: update.name,
        confidence: 0.78,
        reasons: [
          "Ya existe una pagina o sitio, asi que conviene revisar si basta con actualizar antes de proponer una pagina desde cero."
        ],
        matchedNeeds: matches,
        limitations: limitationsForNeeds(matches),
        alternatives: buildAlternatives("update", knowledge)
      };
    }

    const commerceNeedsReview = matches.includes("payments") && normalizeText(lead.businessType).includes("tienda");
    const customNeeded = services > 10 || branches >= 3 || matches.includes("multiPage") || matches.includes("team") || matches.includes("portfolio") || matches.includes("customSections") || commerceNeedsReview;
    const professionalNeeded = services > 6 || lead.hasPhysicalLocation === true || matches.includes("gallery") || matches.includes("map") || matches.includes("faq") || matches.includes("testimonials") || matches.includes("analytics") || matches.includes("qr") || matches.includes("promotions");

    if (customNeeded) {
      planId = "custom";
      confidence = 0.88;
      if (services > 10) reasons.push("Maneja mas de 10 servicios o categorias.");
      if (branches >= 3 || matches.includes("multiPage")) reasons.push("La informacion por sucursal o pagina requiere una estructura mas amplia.");
      if (matches.includes("team")) reasons.push("Necesita presentar equipo o perfiles.");
      if (matches.includes("portfolio")) reasons.push("El portafolio requiere mas espacio y jerarquia.");
      if (matches.includes("customSections")) reasons.push("Hay secciones especiales que salen del alcance estandar.");
      if (commerceNeedsReview) reasons.push("Una tienda con pagos requiere revisar alcance comercial e integracion compatible.");
    } else if (professionalNeeded) {
      planId = "professional";
      confidence = 0.84;
      if (services > 6) reasons.push("Tiene mas informacion que una pagina esencial.");
      if (lead.hasPhysicalLocation === true || matches.includes("map")) reasons.push("Conviene mostrar ubicacion o mapa.");
      if (matches.includes("gallery")) reasons.push("La galeria ayuda a explicar visualmente el negocio.");
      if (matches.includes("faq")) reasons.push("Las preguntas frecuentes ayudan a reducir dudas antes del mensaje.");
      if (matches.includes("testimonials")) reasons.push("Los testimonios pueden reforzar confianza si el cliente los proporciona.");
      if (matches.includes("analytics") || matches.includes("qr")) reasons.push("Analitica basica o QR entran mejor en un alcance profesional.");
    } else {
      planId = "essential";
      confidence = 0.76;
      reasons.push("El alcance parece enfocado en presentar informacion basica y facilitar contacto por WhatsApp.");
      if (services && services <= 6) reasons.push("El numero de servicios cabe en el alcance esencial.");
      if (!matches.includes("gallery") && !matches.includes("map") && !matches.includes("faq")) {
        reasons.push("No se detectaron necesidades avanzadas como galeria amplia, mapa o FAQ extensas.");
      }
    }

    const plan = getPlan(knowledge, planId) || { id: planId, name: PLAN_LABELS[planId] || "NEXO Digital", price: "" };
    return {
      planId,
      planName: plan.name,
      confidence,
      reasons,
      matchedNeeds: matches,
      limitations: limitationsForNeeds(matches),
      alternatives: buildAlternatives(planId, knowledge)
    };
  }

  function calculateLeadScore(leadContext = {}) {
    const lead = sanitizeLeadContext(leadContext);
    let score = 0;
    if (lead.businessType) score += 1;
    if (lead.city) score += 0.5;
    if (lead.hasPhysicalLocation === true) score += 1;
    if ((lead.branches || 0) > 1) score += lead.branches >= 3 ? 1.5 : 1;
    if (lead.usesWhatsApp === true || lead.currentChannels.some((item) => normalizeText(item).includes("whatsapp"))) score += 1;
    if ((lead.serviceCount || 0) >= 5) score += 1;
    if ((lead.serviceCount || 0) > 10) score += 0.5;
    if (lead.currentChannels.length) score += 1;
    if (lead.goals.length) score += 1;
    if (lead.requestedFeatures.length) score += 1;
    if (normalizeText(lead.urgency).match(/pronto|esta semana|urgente|ya|rapido/)) score += 1;
    if (lead.availableMaterials.length >= 2) score += 1;
    if (lead.commonQuestions.length) score += 0.5;
    return Math.max(0, Math.min(10, Number(score.toFixed(1))));
  }

  function classifyLeadScore(score) {
    const value = Math.max(0, Math.min(10, Number(score || 0)));
    if (value <= 3) return "Exploracion";
    if (value <= 6) return "Prospecto posible";
    if (value <= 8) return "Prospecto calificado";
    return "Prioridad alta";
  }

  function templateKeyForBusiness(context = {}) {
    const lead = sanitizeLeadContext(context);
    const text = normalizeText([lead.businessType, ...lead.goals, ...lead.requestedFeatures].join(" "));
    if ((lead.branches || 0) > 1 || text.includes("sucursal")) return "sucursales";
    if (text.includes("veterin")) return "veterinaria";
    if (text.includes("dental") || text.includes("dentista")) return "dental";
    if (text.includes("spa")) return "spa";
    if (text.includes("belleza") || text.includes("salon") || text.includes("barber")) return "belleza";
    if (text.includes("gimnasio") || text.includes("fitness")) return "gimnasio";
    if (text.includes("restaurante") || text.includes("comida") || text.includes("asador")) return "restaurante";
    if (text.includes("optica") || text.includes("lentes")) return "optica";
    if (text.includes("tienda") || text.includes("producto")) return "tienda";
    if (text.includes("tecnico") || text.includes("reparacion") || text.includes("clima")) return "tecnico";
    if (text.includes("consultorio") || text.includes("clinica")) return "consultorio";
    if (text.includes("inmobiliaria") || text.includes("propiedad")) return "inmobiliaria";
    if (text.includes("entrenamiento")) return "entrenamiento";
    return "otro";
  }

  function purposeForSection(sectionName) {
    const normalized = normalizeText(sectionName);
    if (normalized.includes("encabezado")) return "Presentar la propuesta principal y abrir camino al contacto.";
    if (normalized.includes("servicio") || normalized.includes("tratamiento")) return "Explicar que ofrece el negocio sin saturar al visitante.";
    if (normalized.includes("galeria") || normalized.includes("foto")) return "Mostrar evidencia visual real del lugar, producto o trabajo.";
    if (normalized.includes("ubicacion") || normalized.includes("mapa") || normalized.includes("zona")) return "Facilitar la decision de visita o cobertura.";
    if (normalized.includes("pregunta") || normalized.includes("faq")) return "Resolver dudas frecuentes antes del primer mensaje.";
    if (normalized.includes("whatsapp")) return "Llevar la conversacion a un canal directo.";
    if (normalized.includes("sucursal")) return "Ordenar informacion por sede para evitar confusion.";
    return "Aclarar informacion importante para mejorar la primera impresion.";
  }

  function generateBusinessStructure(leadContext = {}, knowledge = defaultKnowledge) {
    const lead = sanitizeLeadContext(leadContext);
    const templates = knowledge.businessTemplates || {};
    const key = templateKeyForBusiness(lead);
    const sections = (templates[key] || templates.otro || [])
      .map((name) => ({ name, purpose: purposeForSection(name) }));

    return {
      title: `Estructura sugerida para ${lead.businessType ? "un negocio de " + lead.businessType : "un negocio local"}`,
      sections,
      notes: [
        "Esta estructura se ajusta despues de revisar materiales, servicios y alcance real.",
        "No es una maqueta final ni una demo personalizada antes del pago."
      ],
      disclaimer: "Esta es una orientacion inicial. La estructura final depende del paquete, materiales y nivel de personalizacion confirmado."
    };
  }

  function generateVisualDirection(leadContext = {}) {
    const lead = sanitizeLeadContext(leadContext);
    const key = templateKeyForBusiness(lead);
    const directions = {
      veterinaria: ["limpio y cercano", "blanco calido, verde suave y azul grisaceo", "equipo, instalaciones y mascotas reales"],
      dental: ["clinico, claro y tranquilo", "blanco, gris suave y azul mineral", "consultorio, equipo y detalles de confianza"],
      spa: ["sereno y editorial", "marfil, verde oliva y tonos tierra suaves", "espacios reales, texturas y servicios"],
      belleza: ["premium sobrio", "negro, marfil y acento dorado moderado", "resultados reales permitidos, local y herramientas"],
      gimnasio: ["directo y energico sin exagerar", "negro, gris concreto y acento calido", "instalaciones, clases y ambiente real"],
      restaurante: ["apetitoso y claro", "carbon, crema y acentos calidos", "platillos reales, fachada y mesa"],
      optica: ["nitido y profesional", "marfil, tinta y azul sobrio", "monturas reales, examen visual y mostrador"],
      tienda: ["comercial y ordenado", "fondo claro, acento de marca y contraste alto", "productos reales, categorias y detalle"],
      tecnico: ["practico y confiable", "blanco, carbon y petrol discreto", "herramientas, trabajos y cobertura"],
      consultorio: ["profesional y responsable", "blanco, gris y acento sobrio", "espacio real, proceso y trato"],
      inmobiliaria: ["editorial y organizado", "marfil, negro suave y acento metalico", "propiedades reales, zonas y proceso"],
      entrenamiento: ["claro y activo", "neutros, verde o naranja medido", "entrenamientos reales sin promesas fisicas"],
      sucursales: ["sistema claro por sede", "neutros fuertes con acento por categoria", "fachadas, mapas y equipos por ubicacion"],
      otro: ["moderno, sobrio y local", "negro o marfil con acento de marca", "fotos reales del negocio, equipo o servicio"]
    };
    const [style, palette, photography] = directions[key] || directions.otro;
    return {
      style,
      palette,
      photography,
      hierarchy: "Primero propuesta, despues servicios, pruebas de confianza, ubicacion y WhatsApp.",
      tone: "Profesional, directo y confiable; sin promesas de resultados garantizados.",
      callsToAction: ["Hablar por WhatsApp", "Solicitar orientacion", "Ver paquete recomendado"],
      avoid: [
        "neon tecnologico sin razon",
        "robots u hologramas",
        "personas generadas por IA",
        "lujo falso",
        "promesas de ventas o SEO garantizado"
      ]
    };
  }

  function validateUserMessage(message, maxLength = DEFAULT_MAX_MESSAGE_LENGTH) {
    const original = String(message || "");
    const sanitized = sanitizeText(original, maxLength);
    return {
      valid: sanitized.length > 0,
      sanitized,
      truncated: sanitized.length < original.replace(/\s+/g, " ").trim().length
    };
  }

  function validateLeadContext(context = {}) {
    const sanitized = sanitizeLeadContext(context);
    return {
      valid: Boolean(sanitized),
      sanitized,
      missingFields: getMissingLeadFields(sanitized)
    };
  }

  function validatePlanRecommendation(recommendation = {}, knowledge = defaultKnowledge) {
    const validPlanIds = [
      ...(knowledge.plans || []).map((plan) => plan.id),
      ...(knowledge.extras || []).map((extra) => extra.id),
      ...(knowledge.extras || []).map((extra) => extra.sourceId),
      "update"
    ].filter(Boolean);
    return validPlanIds.includes(recommendation.planId);
  }

  function validateActions(actions = []) {
    return sanitizeSuggestedActions(actions);
  }

  function validateUrl(url, config = assistantConfig) {
    try {
      const parsed = new URL(url);
      const allowed = config.allowedUrlHosts || ["wa.me", "api.whatsapp.com", "emis57.github.io", "www.instagram.com", "www.facebook.com"];
      return parsed.protocol === "https:" && allowed.includes(parsed.hostname);
    } catch (error) {
      return false;
    }
  }

  function containsProhibitedClaim(text, knowledge = defaultKnowledge) {
    const normalized = normalizeText(text);
    return (knowledge.prohibitedClaims || []).some((claim) => normalized.includes(normalizeText(claim)));
  }

  function validateDemoResponse(response = {}, knowledge = defaultKnowledge) {
    const actions = validateActions(response.suggestedActions || []);
    const reply = sanitizeText(response.reply || "", 1400);
    const planOk = !response.recommendedPlan ||
      response.recommendedPlan === "update" ||
      (knowledge.plans || []).some((plan) => plan.id === response.recommendedPlan || plan.name === response.recommendedPlan);
    return {
      valid: Boolean(reply) && planOk && actions.length === (response.suggestedActions || []).filter(isAllowedAction).length && !containsProhibitedClaim(reply, knowledge),
      reply,
      actions,
      planOk
    };
  }

  function getPlanLine(plan) {
    return `${plan.name}: ${plan.price}. ${plan.payment}`;
  }

  function listPlans(knowledge = defaultKnowledge) {
    return (knowledge.plans || []).map(getPlanLine).join(" ");
  }

  function listRequirements(knowledge = defaultKnowledge) {
    return (knowledge.requiredMaterials || []).slice(0, 7).join(", ");
  }

  function publicPortfolioText(knowledge = defaultKnowledge) {
    const items = (knowledge.publicPortfolio || []).slice(0, 6);
    if (!items.length) return "Por ahora no tengo demos publicas disponibles en la base de conocimiento.";
    return items.map((project) => `${project.name} (${project.industry || project.category})`).join("; ");
  }

  function extractLeadSignals(message) {
    const text = normalizeText(message);
    const patch = {};
    const countMatch = text.match(/(\d+)\s+(servicios|tratamientos|categorias|productos)/);
    const branchMatch = text.match(/(\d+)\s+(sucursales|sedes|ubicaciones)/);
    if (countMatch) patch.serviceCount = Number(countMatch[1]);
    if (branchMatch) patch.branches = Number(branchMatch[1]);
    Object.entries(NUMBER_WORDS).forEach(([word, value]) => {
      if (!patch.branches && text.includes(word) && /(sucursales|sedes|ubicaciones|gimnasios|clinicas|locales)/.test(text)) {
        patch.branches = value;
      }
      if (!patch.serviceCount && text.includes(word) && /(servicios|tratamientos|categorias|productos)/.test(text)) {
        patch.serviceCount = value;
      }
    });
    if (text.includes("whatsapp")) {
      patch.usesWhatsApp = true;
      patch.currentChannels = ["WhatsApp"];
    }
    if (text.includes("pagina existente") || text.includes("ya tengo pagina") || text.includes("mi sitio")) patch.hasWebsite = true;
    if (text.includes("desactualizada") || text.includes("actualizar") || text.includes("actualizacion")) {
      patch.hasWebsite = true;
      patch.websiteCondition = "Pagina existente desactualizada";
      patch.requestedFeatures = [...(patch.requestedFeatures || []), "actualizar"];
    }
    if (text.includes("local") || text.includes("ubicacion") || text.includes("consultorio") || text.includes("restaurante")) patch.hasPhysicalLocation = true;

    const businessTypes = ["veterinaria", "dental", "spa", "salon", "gimnasio", "restaurante", "optica", "tienda", "servicio tecnico", "consultorio", "inmobiliaria", "entrenamiento"];
    const foundType = businessTypes.find((type) => text.includes(type));
    if (foundType) patch.businessType = foundType;

    const requestedFeatures = Object.keys(FEATURE_SYNONYMS)
      .filter((key) => includesAny(message, key))
      .map((key) => FEATURE_SYNONYMS[key][0]);
    if (requestedFeatures.length) patch.requestedFeatures = requestedFeatures;
    if (patch.businessType === "tienda" && text.includes("pagos")) {
      patch.requestedFeatures = [...(patch.requestedFeatures || []), "catalogo", "pagos"];
    }

    const goals = [];
    if (text.includes("presentar") || text.includes("servicios")) goals.push("Presentar servicios");
    if (text.includes("vender") || text.includes("productos")) goals.push("Vender productos");
    if (text.includes("citas") || text.includes("reservas")) goals.push("Recibir citas o reservas");
    if (text.includes("ordenar") || text.includes("informacion")) goals.push("Ordenar informacion");
    if (goals.length) patch.goals = goals;

    if (text.includes("esta semana") || text.includes("rapido") || text.includes("urgente")) patch.urgency = "Quiere comenzar pronto";
    if (text.includes("logo") || text.includes("fotos") || text.includes("materiales")) patch.availableMaterials = ["Logo o fotos"];
    if (text.includes("tengo dominio") || text.includes("dominio propio")) {
      patch.hasDomain = true;
      patch.domainStatus = "Ya cuenta con dominio propio";
    }
    if (text.includes("no tengo dominio") || text.includes("sin dominio")) {
      patch.hasDomain = false;
      patch.domainStatus = "No cuenta con dominio propio";
    }
    return patch;
  }

  function buildLeadSummary(leadContext = {}, recommendation = null, knowledge = defaultKnowledge) {
    const lead = sanitizeLeadContext(leadContext);
    const rec = recommendation || recommendPlan(lead, knowledge);
    const plan = getPlan(knowledge, rec.planId);
    const domainLabel = lead.domainStatus || (lead.hasDomain === true ? "Ya cuenta con dominio propio" : lead.hasDomain === false ? "No cuenta con dominio propio" : "");
    const planName = sanitizeText(rec.planName || (plan && plan.name) || "", 120);
    const fields = [
      ["Giro", lead.businessType],
      ["Objetivo", lead.goals.join(", ")],
      ["Paquete de interes", planName],
      ["Servicios", lead.serviceCount ? `${lead.serviceCount} servicios o categorias aproximadas` : ""],
      ["Materiales disponibles", lead.availableMaterials.join(", ")],
      ["Dominio", domainLabel],
      ["Fecha aproximada", lead.urgency],
      ["Nombre", lead.name],
      ["Medio de contacto", lead.contactMethod],
      ["Comentario", lead.additionalComment],
      ["Negocio", lead.businessName],
      ["Ciudad", lead.city],
      ["Sucursales", lead.branches ? String(lead.branches) : ""],
      ["Canales actuales", lead.currentChannels.join(", ")],
      ["Funciones", lead.requestedFeatures.join(", ")],
    ].filter(([, value]) => {
      const clean = sanitizeText(value, 300);
      return clean && !["undefined", "null", "[object Object]", "true", "false"].includes(clean);
    });

    const textLines = [
      "Hola, quiero informacion sobre una pagina con NEXO26.",
      "",
      ...fields.map(([label, value]) => `${label}: ${sanitizeText(value, 300)}`),
      "",
      plan ? `Inversion: ${plan.price}` : "",
      "",
      "Me gustaria recibir orientacion para continuar."
    ].filter((line) => line !== "");

    const text = textLines.join("\n");
    const officialNumber = (knowledge.officialLinks && knowledge.officialLinks.whatsappNumber) || assistantConfig.officialWhatsappNumber || "5215517973390";
    const whatsappUrl = `https://wa.me/${officialNumber}?text=${encodeURIComponent(text)}`;

    return {
      lead: fields.reduce((map, [label, value]) => Object.assign(map, { [label]: sanitizeText(value, 300) }), {}),
      recommendation: {
        planId: rec.planId,
        planName: rec.planName,
        reasons: cleanArray(rec.reasons || rec.recommendationReasons || [])
      },
      text,
      whatsappUrl
    };
  }

  function responseBase(intent, reply, leadContext, recommendation, options = {}) {
    const lead = sanitizeLeadContext(leadContext);
    const leadScore = calculateLeadScore(lead);
    const actions = sanitizeSuggestedActions(options.suggestedActions || []);
    return {
      reply: sanitizeText(reply, 1400),
      intent,
      recommendedPlan: recommendation ? recommendation.planId : "",
      recommendationReasons: recommendation ? cleanArray(recommendation.reasons || []) : [],
      leadScore,
      requiresHuman: Boolean(options.requiresHuman),
      suggestedActions: actions,
      collectedData: lead,
      missingFields: getMissingLeadFields(lead)
    };
  }

  function generateDemoResponse(input = {}) {
    const knowledge = input.knowledge || defaultKnowledge;
    const messageValidation = validateUserMessage(input.message || "");
    const contextWithSignals = mergeLeadContext(input.leadContext || {}, extractLeadSignals(messageValidation.sanitized));
    const intentData = detectIntent(messageValidation.sanitized, contextWithSignals);
    const intent = intentData.intent;
    const matchedNeeds = collectNeedMatches(contextWithSignals);
    let recommendation = null;
    let reply = "";
    let suggestedActions = [];
    let requiresHuman = false;

    if (!messageValidation.valid) {
      reply = "Puedo ayudarte si me compartes que tipo de negocio tienes y que necesitas resolver primero.";
      suggestedActions = ["start_analysis", "show_plans"];
      return responseBase("unknown", reply, contextWithSignals, null, { suggestedActions });
    }

    switch (intent) {
      case "greeting":
        reply = (input.conversation || []).length
          ? "Aqui sigo. Podemos revisar paquetes, tiempos, demos o preparar una recomendacion inicial."
          : "Hola, soy el asistente digital de NEXO26 Digital. Puedo orientarte sobre paquetes, requisitos, demos o ayudarte a identificar una opcion para tu negocio.";
        suggestedActions = ["start_analysis", "show_plans"];
        break;
      case "show_services":
        reply = "NEXO26 trabaja paginas web informativas, presencia local, actualizaciones, conexion de dominio e integraciones puntuales como pagos o reservaciones cuando el sitio es compatible.";
        suggestedActions = ["show_plans", "start_analysis"];
        break;
      case "show_plans":
      case "ask_price":
        reply = `Estos son los paquetes base: ${listPlans(knowledge)} Los precios no son definitivos hasta confirmar alcance, materiales y funciones.`;
        suggestedActions = ["start_analysis", "show_plan_details"];
        break;
      case "ask_timeline":
        reply = "Los tiempos empiezan despues del pago o anticipo y materiales completos. Esencial: 48 a 72 horas. Profesional: primera version aproximada en 72 horas. A Medida: 5 a 7 dias.";
        suggestedActions = ["show_plans", "start_analysis"];
        break;
      case "ask_domain":
        reply = "NEXO Esencial no incluye dominio. NEXO Profesional contempla conexion si el cliente ya cuenta con uno. La gestion o registro de dominio no se asume automaticamente y se confirma segun alcance, disponibilidad y costo.";
        suggestedActions = ["show_plan_details", "request_human"];
        break;
      case "ask_updates":
        reply = "Las actualizaciones empiezan desde $200 MXN para cambios pequenos en paginas compatibles. Si ya tienes pagina, primero conviene revisar si necesitas ajuste puntual, rediseño o una nueva estructura.";
        suggestedActions = ["start_analysis", "request_human"];
        break;
      case "ask_requirements":
        reply = `Para iniciar normalmente se necesita: ${listRequirements(knowledge)}. El alcance se confirma antes de pagar.`;
        suggestedActions = ["start_analysis", "show_plans"];
        break;
      case "ask_portfolio":
        reply = `Demos publicas disponibles: ${publicPortfolioText(knowledge)}. Los conceptos draft no se muestran como portafolio publico.`;
        suggestedActions = ["show_portfolio", "request_quote"];
        break;
      case "start_analysis":
      case "continue_analysis":
        reply = "Para orientarte mejor necesito saber giro del negocio, ciudad, numero aproximado de servicios, si usas WhatsApp, si tienes local fisico y que quieres resolver primero.";
        suggestedActions = ["continue_analysis", "show_plans"];
        break;
      case "recommend_plan":
        recommendation = recommendPlan(contextWithSignals, knowledge);
        reply = `Por lo que compartiste, revisaria ${recommendation.planName} como punto de partida. Razones: ${recommendation.reasons.join(" ")} ${recommendation.limitations.join(" ")} Esto no es una cotizacion definitiva; falta confirmar alcance y materiales.`;
        suggestedActions = ["build_summary", "request_quote"];
        requiresHuman = recommendation.limitations.length > 0;
        break;
      case "generate_structure": {
        const structure = generateBusinessStructure(contextWithSignals, knowledge);
        reply = `${structure.title}. Secciones iniciales: ${structure.sections.map((section) => section.name).join(", ")}. ${structure.disclaimer}`;
        suggestedActions = ["generate_structure", "build_summary"];
        break;
      }
      case "generate_visual_direction": {
        const visual = generateVisualDirection(contextWithSignals);
        reply = `Direccion visual sugerida: estilo ${visual.style}, paleta ${visual.palette}, fotos de ${visual.photography}. Conviene evitar ${visual.avoid.slice(0, 3).join(", ")}.`;
        suggestedActions = ["generate_structure", "build_summary"];
        break;
      }
      case "build_summary":
        recommendation = recommendPlan(contextWithSignals, knowledge);
        reply = `Puedo preparar un resumen para WhatsApp con el negocio, objetivo, funciones y paquete sugerido: ${recommendation.planName}.`;
        suggestedActions = ["build_summary", "open_whatsapp"];
        break;
      case "request_quote":
      case "open_whatsapp":
        recommendation = recommendPlan(contextWithSignals, knowledge);
        reply = recommendation.limitations.length
          ? `Puedo generar una URL de WhatsApp con tu resumen preparado. ${recommendation.limitations.join(" ")} Es mejor que Emilio confirme el alcance antes de cotizar.`
          : "Puedo generar una URL de WhatsApp con tu resumen preparado. No la abrire automaticamente desde el motor demo.";
        suggestedActions = ["build_summary", "open_whatsapp"];
        requiresHuman = recommendation.limitations.length > 0;
        break;
      case "request_human":
        reply = "Esa parte conviene revisarla con Emilio para confirmar detalles sin inventar condiciones. Puedo dejar listo un resumen para enviarlo por WhatsApp.";
        suggestedActions = ["build_summary", "open_whatsapp"];
        requiresHuman = true;
        break;
      case "restart":
        reply = "Listo. Podemos reiniciar el analisis y empezar por giro, ciudad, servicios y objetivo principal.";
        suggestedActions = ["restart", "start_analysis"];
        break;
      default:
        if (containsProhibitedClaim(messageValidation.sanitized, knowledge)) {
          reply = "No puedo prometer ventas, SEO avanzado ni resultados garantizados. Si quieres, puedo orientarte sobre presentacion, claridad y contacto por WhatsApp.";
          requiresHuman = true;
        } else if (matchedNeeds.includes("crm") || matchedNeeds.includes("payments") || matchedNeeds.includes("reservations")) {
          recommendation = recommendPlan(contextWithSignals, knowledge);
          reply = "Esa funcion requiere revisar compatibilidad y alcance antes de prometerla. Puedo preparar un resumen para que Emilio lo confirme por WhatsApp.";
          requiresHuman = true;
        } else if (contextWithSignals.businessType || contextWithSignals.serviceCount || contextWithSignals.branches || contextWithSignals.hasWebsite) {
          recommendation = recommendPlan(contextWithSignals, knowledge);
          reply = `Con lo que compartiste, revisaria ${recommendation.planName} como orientacion inicial. ${recommendation.reasons.join(" ")} Falta confirmar ciudad, materiales y alcance antes de cotizar.`;
          requiresHuman = recommendation.limitations.length > 0;
          suggestedActions = ["build_summary", "request_human"];
          break;
        } else {
          reply = assistantConfig.fallbackMessages && assistantConfig.fallbackMessages.unknown
            ? assistantConfig.fallbackMessages.unknown
            : "Puedo orientarte con paquetes, tiempos, requisitos, demos o un resumen para WhatsApp.";
        }
        suggestedActions = ["start_analysis", "show_plans", "request_human"];
        break;
    }

    const response = responseBase(intent, reply, contextWithSignals, recommendation, { suggestedActions, requiresHuman });
    const validated = validateDemoResponse(response, knowledge);
    return Object.assign({}, response, {
      reply: validated.reply,
      suggestedActions: validated.actions
    });
  }

  function validateSummary(summary = {}) {
    const text = sanitizeText(summary.text || "", 2500);
    return {
      valid: Boolean(text) && !/(undefined|null|\[object Object\]|true|false)/i.test(text) && validateUrl(summary.whatsappUrl || "", assistantConfig),
      text
    };
  }

  return Object.freeze({
    ALLOWED_ACTIONS,
    INTENTS,
    defaultLeadContext,
    createLeadContext,
    sanitizeLeadContext,
    mergeLeadContext,
    clearLeadContext,
    getMissingLeadFields,
    detectIntent,
    isAllowedAction,
    sanitizeSuggestedActions,
    getPublicPortfolio,
    recommendPlan,
    calculateLeadScore,
    classifyLeadScore,
    generateBusinessStructure,
    generateVisualDirection,
    generateDemoResponse,
    buildLeadSummary,
    validateUserMessage,
    validateLeadContext,
    validatePlanRecommendation,
    validateUrl,
    validateDemoResponse,
    validateSummary
  });
});
