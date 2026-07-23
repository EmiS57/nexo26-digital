(function (root, factory) {
  "use strict";

  const api = factory(root.NEXO_CONFIG || {}, root.NEXO_DATA || {});
  root.NEXO_ASSISTANT_KNOWLEDGE = api.knowledge;
  root.NEXO_ASSISTANT_KNOWLEDGE_UTILS = Object.freeze({
    createNexoKnowledge: api.createNexoKnowledge,
    createKnowledge: api.createKnowledge,
    getPublicPortfolio: api.getPublicPortfolio
  });
})(typeof window !== "undefined" ? window : globalThis, function buildKnowledgeApi(siteConfig, siteData) {
  "use strict";

  const PLAN_MAP = Object.freeze([
    Object.freeze({ id: "essential", sourceId: "esencial" }),
    Object.freeze({ id: "professional", sourceId: "profesional" }),
    Object.freeze({ id: "custom", sourceId: "medida" })
  ]);

  const PLAN_RULES = Object.freeze({
    essential: Object.freeze({
      sections: 5,
      services: 6,
      pages: 1,
      revisions: 1,
      publicationMonths: 12,
      domainRule: "Sin dominio incluido",
      ruleIncludes: Object.freeze([
        "Una vista",
        "Hasta 5 secciones",
        "Hasta 6 servicios o categorias",
        "Boton directo a WhatsApp",
        "Una ronda de cambios",
        "12 meses de publicacion"
      ])
    }),
    professional: Object.freeze({
      sections: 8,
      services: 10,
      pages: 1,
      revisions: 2,
      publicationMonths: 12,
      domainRule: "Conexion de dominio unicamente si el cliente ya cuenta con uno",
      ruleIncludes: Object.freeze([
        "Una vista",
        "Hasta 8 secciones",
        "Hasta 10 servicios o categorias",
        "Encabezado comercial",
        "Galeria",
        "Hasta 5 testimonios",
        "Hasta 6 preguntas frecuentes",
        "Mapa",
        "Codigo QR",
        "Analitica basica",
        "Conexion de dominio si el cliente ya cuenta con uno",
        "Dos rondas de cambios",
        "12 meses de publicacion"
      ])
    }),
    custom: Object.freeze({
      sections: 12,
      services: 15,
      pages: 3,
      revisions: 3,
      publicationMonths: 12,
      domainRule: "Condiciones de dominio a confirmar segun alcance",
      ruleIncludes: Object.freeze([
        "Hasta 3 paginas",
        "Hasta 12 secciones",
        "Hasta 15 servicios o categorias",
        "Equipo",
        "Portafolio",
        "Mayor personalizacion",
        "Tres rondas de cambios",
        "12 meses de publicacion"
      ])
    })
  });

  const EXTRA_MAP = Object.freeze([
    Object.freeze({ id: "updates", sourceId: "actualizacion", displayName: "Actualizaciones" }),
    Object.freeze({ id: "renewal", sourceId: "renovacion", displayName: "Renovacion tecnica anual", displayPrice: "$399 MXN" }),
    Object.freeze({ id: "domain", sourceId: "dominio", displayName: "Conexion o gestion de dominio" }),
    Object.freeze({ id: "payments", sourceId: "pagos", displayName: "Integracion de pagos" }),
    Object.freeze({ id: "reservations", sourceId: "reservaciones", displayName: "Integracion de reservaciones" })
  ]);

  const COMMERCIAL_RULES = Object.freeze([
    "Los tiempos comienzan despues del pago y materiales completos.",
    "No se realizan demos personalizadas antes del pago.",
    "No se inicia sin pago o anticipo.",
    "No existen cambios ilimitados.",
    "No se garantizan ventas.",
    "No se garantiza SEO avanzado.",
    "El dominio no esta incluido automaticamente.",
    "No se mezclan funciones de paquetes sin cotizacion.",
    "La publicacion incluida es por 12 meses.",
    "Las integraciones especiales se cotizan por separado.",
    "Las funciones no confirmadas deben escalarse a Emilio.",
    "El motor no debe inventar descuentos."
  ]);

  const REQUIRED_MATERIALS = Object.freeze([
    "Nombre del negocio",
    "Giro o tipo de negocio",
    "Servicios o categorias",
    "Ubicacion o zona de atencion",
    "Telefono de WhatsApp",
    "Logo si existe",
    "Fotos reales si existen",
    "Redes sociales o perfil de Google si aplica",
    "Testimonios si se usaran",
    "Dominio y accesos si el cliente ya cuenta con uno"
  ]);

  const PROCESS = Object.freeze([
    "Se confirma el paquete y alcance.",
    "El cliente envia pago o anticipo y materiales completos.",
    "NEXO26 organiza contenido, estructura y direccion visual.",
    "Se entrega una primera version segun el tiempo del paquete.",
    "Se aplican las rondas de cambios incluidas.",
    "Se publica el sitio y queda listo para compartir."
  ]);

  const PROHIBITED_CLAIMS = Object.freeze([
    "ventas garantizadas",
    "clientes garantizados",
    "seo avanzado garantizado",
    "primer lugar en google",
    "cambios ilimitados",
    "demo personalizada gratis",
    "descuento automatico",
    "contratacion confirmada",
    "dominio gratis",
    "inicio sin anticipo",
    "disponibilidad inmediata garantizada",
    "garantizan ventas",
    "garantia de ventas"
  ]);

  const BUSINESS_TEMPLATES = Object.freeze({
    veterinaria: Object.freeze(["Encabezado comercial", "Servicios veterinarios", "Horarios", "Ubicacion", "Preguntas frecuentes", "WhatsApp"]),
    dental: Object.freeze(["Encabezado comercial", "Tratamientos", "Primera visita", "Galeria o instalaciones", "Preguntas frecuentes", "WhatsApp"]),
    spa: Object.freeze(["Encabezado sensorial", "Servicios", "Experiencias", "Ubicacion", "Preguntas frecuentes", "WhatsApp"]),
    belleza: Object.freeze(["Encabezado visual", "Servicios", "Galeria", "Reservas o WhatsApp", "Testimonios", "Ubicacion"]),
    gimnasio: Object.freeze(["Encabezado directo", "Modalidades", "Horarios", "Primera visita", "Preguntas frecuentes", "WhatsApp"]),
    restaurante: Object.freeze(["Encabezado apetitoso", "Menu o especialidades", "Ubicacion", "Reservaciones", "Galeria", "WhatsApp"]),
    optica: Object.freeze(["Encabezado claro", "Servicios", "Estilos o productos", "Proceso de atencion", "Ubicacion", "WhatsApp"]),
    tienda: Object.freeze(["Encabezado comercial", "Categorias", "Productos destacados", "Proceso de compra", "Entrega", "WhatsApp"]),
    tecnico: Object.freeze(["Encabezado de servicio", "Servicios", "Cobertura", "Proceso", "Preguntas frecuentes", "WhatsApp"]),
    consultorio: Object.freeze(["Encabezado profesional", "Servicios", "Proceso de atencion", "Ubicacion", "FAQ responsable", "WhatsApp"]),
    inmobiliaria: Object.freeze(["Encabezado comercial", "Tipos de propiedad", "Proceso", "Zonas", "Formulario visual", "WhatsApp"]),
    entrenamiento: Object.freeze(["Encabezado de inicio", "Programas", "Horarios", "Primera sesion", "Preguntas frecuentes", "WhatsApp"]),
    sucursales: Object.freeze(["Encabezado general", "Sucursales", "Servicios por sede", "Mapa o zonas", "Equipo", "WhatsApp"]),
    otro: Object.freeze(["Encabezado comercial", "Servicios", "Beneficios", "Proceso", "Preguntas frecuentes", "WhatsApp"])
  });

  const DUPLICATION_AUDIT = Object.freeze([
    Object.freeze({
      field: "plans.scope",
      reason: "Normaliza limites comerciales numericos que en data.js viven como texto para poder probar reglas del motor."
    }),
    Object.freeze({
      field: "plans.professional.scope.domain",
      reason: "La regla del asistente para esta fase es mas estricta: conexion solo si el cliente ya cuenta con dominio. No modifica la landing publica."
    }),
    Object.freeze({
      field: "extras.renewal.price",
      reason: "El asistente usa el precio comercial de cierre $399 MXN; data.js conserva texto publico mas amplio."
    }),
    Object.freeze({
      field: "commercialRules/templates/materials/prohibitedClaims",
      reason: "Son reglas del asistente que no existen como estructura en data.js."
    })
  ]);

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.keys(value).forEach((key) => deepFreeze(value[key]));
    return value;
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function findById(items, id) {
    return (items || []).find((item) => item && item.id === id) || {};
  }

  function buildCompanyKnowledge(config) {
    return {
      name: config.brandName || "NEXO26 Digital",
      tagline: "Paginas web express para negocios locales",
      serviceArea: config.serviceArea || "Megalopolis de Mexico",
      currency: config.currency || "MXN",
      source: "assets/js/config.js"
    };
  }

  function buildPlanKnowledge(data) {
    const webPackages = data.webPackages || [];
    return PLAN_MAP.map((mapping) => {
      const source = findById(webPackages, mapping.sourceId);
      const rules = PLAN_RULES[mapping.id];
      return {
        id: mapping.id,
        sourceId: mapping.sourceId,
        name: source.name || "",
        price: source.price || "",
        payment: source.payment || "",
        delivery: source.delivery || "",
        summary: source.summary || "",
        cta: source.cta || "",
        scope: {
          views: rules.pages === 1 ? "Una vista" : `Hasta ${rules.pages} paginas`,
          sections: rules.sections,
          services: rules.services,
          pages: rules.pages,
          revisions: rules.revisions,
          publicationMonths: rules.publicationMonths,
          domain: rules.domainRule
        },
        includes: clone(source.includes || rules.ruleIncludes),
        commercialIncludes: clone(rules.ruleIncludes),
        notes: clone(source.notes || []),
        source: "assets/js/data.js"
      };
    });
  }

  function buildExtrasKnowledge(data) {
    const sourceServices = [...(data.supportServices || []), ...(data.commerceServices || [])];
    return EXTRA_MAP.map((mapping) => {
      const source = findById(sourceServices, mapping.sourceId);
      return {
        id: mapping.id,
        sourceId: mapping.sourceId,
        name: mapping.displayName || source.name || "",
        price: mapping.displayPrice || source.price || "",
        sourcePrice: source.price || "",
        payment: source.payment || "",
        delivery: source.delivery || "",
        description: source.summary || "",
        includes: clone(source.includes || []),
        notes: clone(source.notes || []),
        source: "assets/js/data.js"
      };
    });
  }

  function getPublicPortfolio(projects) {
    return (projects || [])
      .filter((project) => project && project.status === "published" && project.published !== false && project.active !== false)
      .map((project) => ({
        id: project.id,
        name: project.displayTitle || project.title || project.name,
        slug: project.id,
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

  function buildOfficialLinks(config) {
    return {
      whatsappNumber: config.whatsappNumber || "5215517973390",
      whatsappPublicLink: config.whatsappPublicLink || "",
      instagram: config.instagram || "",
      facebook: config.facebook || "",
      website: config.canonicalUrl || ""
    };
  }

  function createNexoKnowledge({ config = siteConfig, data = siteData } = {}) {
    const knowledge = {
      company: buildCompanyKnowledge(config),
      plans: buildPlanKnowledge(data),
      extras: buildExtrasKnowledge(data),
      commercialRules: clone(COMMERCIAL_RULES),
      requiredMaterials: clone(REQUIRED_MATERIALS),
      process: clone(PROCESS),
      faq: clone(data.faqs || []),
      businessTemplates: clone(BUSINESS_TEMPLATES),
      publicPortfolio: getPublicPortfolio(data.projects || []),
      officialLinks: buildOfficialLinks(config),
      prohibitedClaims: clone(PROHIBITED_CLAIMS),
      duplicationAudit: clone(DUPLICATION_AUDIT),
      sourceMap: {
        company: "assets/js/config.js",
        officialLinks: "assets/js/config.js",
        plans: "assets/js/data.js + normalized assistant scope rules",
        extras: "assets/js/data.js + normalized assistant display rules",
        portfolio: "assets/js/data.js filtered by status/published/active",
        faq: "assets/js/data.js",
        recommendationRules: "assets/js/main.js used as behavioral reference"
      }
    };

    return deepFreeze(knowledge);
  }

  function createKnowledge(config = siteConfig, data = siteData) {
    return createNexoKnowledge({ config, data });
  }

  const knowledge = createNexoKnowledge({ config: siteConfig, data: siteData });

  return Object.freeze({
    knowledge,
    createNexoKnowledge,
    createKnowledge,
    getPublicPortfolio,
    buildCompanyKnowledge,
    buildPlanKnowledge,
    buildExtrasKnowledge,
    buildOfficialLinks,
    normalizeText
  });
});
