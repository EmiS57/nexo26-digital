(function (root, factory) {
  "use strict";

  const config = factory(root.NEXO_CONFIG || {});
  root.NEXO_ASSISTANT_CONFIG = config;
})(typeof window !== "undefined" ? window : globalThis, function createAssistantConfig(siteConfig) {
  "use strict";

  const allowedModes = Object.freeze(["demo", "real"]);
  const defaultMode = "demo";

  return Object.freeze({
    enabled: true,
    mode: defaultMode,
    allowedModes,
    assistantName: "NEXO Asistente",
    source: "nexo26-website",
    maxMessageLength: 800,
    maxConversationMessages: 40,
    typingDelay: 350,
    endpoint: "",
    showLeadScore: false,
    showBusinessView: false,
    allowFreeText: true,
    persistSession: false,
    officialWhatsappNumber: siteConfig.whatsappNumber || "5215517973390",
    fallbackMessages: Object.freeze({
      unknown: "Puedo orientarte con paquetes, tiempos, requisitos, dominio, demos o ayudarte a preparar un resumen para WhatsApp.",
      human: "Esa parte conviene revisarla directamente con Emilio para no inventar condiciones.",
      unavailable: "Por ahora puedo ayudarte en modo demo con informacion comercial general de NEXO26 Digital."
    }),
    enabledActions: Object.freeze([
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
    ]),
    allowedUrlHosts: Object.freeze([
      "wa.me",
      "api.whatsapp.com",
      "emis57.github.io",
      "www.instagram.com",
      "instagram.com",
      "www.facebook.com",
      "facebook.com"
    ])
  });
});
