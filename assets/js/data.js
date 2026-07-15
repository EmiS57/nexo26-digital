window.NEXO_DATA = {
  collections: [
    {
      name: "Páginas web",
      summary: "Para presentar servicios, horarios, ubicación, galería, preguntas frecuentes y contacto en un solo lugar.",
      items: ["NEXO Esencial", "NEXO Profesional", "NEXO A Medida"]
    },
    {
      name: "Ventas y reservaciones",
      summary: "Para negocios que necesitan mostrar productos, recibir pagos o facilitar solicitudes de cita.",
      items: ["NEXO Tienda Inicial", "Integración de pagos", "Integración de reservaciones"]
    },
    {
      name: "Presencia y soporte",
      summary: "Para mejorar información local, actualizar contenido, mantener publicación o conectar un dominio compatible.",
      items: ["NEXO Presencia Local", "Actualización de contenido", "Renovación técnica anual", "Conexión de dominio"]
    }
  ],

  webPackages: [
    {
      id: "esencial",
      name: "NEXO Esencial",
      price: "$999 MXN",
      badge: "Pago completo",
      payment: "Pago completo antes de iniciar.",
      delivery: "Primera versión en 48-72 horas hábiles después de pago y materiales completos.",
      summary: "Para negocios que necesitan una presencia clara, rápida y lista para compartir.",
      cta: "Consultar NEXO Esencial",
      includes: [
        "Una sola vista",
        "Hasta 5 secciones",
        "Hasta 6 servicios",
        "Adaptación de logo y fotos entregadas",
        "Hasta dos colores base",
        "Horarios, ubicación, redes y WhatsApp",
        "Diseño adaptable a celular",
        "Una revisión consolidada",
        "Dirección administrada por NEXO26",
        "Publicación durante 12 meses"
      ],
      notes: [
        "No incluye conexión de dominio en el precio base.",
        "Funciones adicionales se cotizan por separado."
      ]
    },
    {
      id: "profesional",
      name: "NEXO Profesional",
      price: "$2,299 MXN",
      badge: "RECOMENDADO",
      payment: "$1,600 MXN para comenzar y $699 MXN antes de publicar.",
      delivery: "Aproximadamente 72 horas hábiles después de anticipo y materiales completos.",
      summary: "Para negocios que necesitan explicar mejor sus servicios y verse más completos.",
      cta: "Consultar NEXO Profesional",
      includes: [
        "Hasta 8 secciones",
        "Hasta 10 servicios",
        "Encabezado comercial",
        "Adaptación visual",
        "Mejora ligera de textos",
        "Galería",
        "Hasta 5 testimonios entregados por el cliente",
        "Hasta 6 preguntas frecuentes",
        "WhatsApp, mapa, redes y QR",
        "Analítica básica",
        "Conexión de dominio propio incluida si el cliente ya lo tiene activo y entrega acceso",
        "Dos rondas de revisión",
        "Publicación durante 12 meses"
      ],
      notes: [
        "Este paquete sí contempla conexión de dominio propio.",
        "Si el dominio todavía no existe, la compra o renovación se revisa por separado."
      ]
    },
    {
      id: "medida",
      name: "NEXO A Medida",
      price: "$3,999 MXN",
      badge: "Proyecto ampliado",
      payment: "$2,400 MXN para comenzar y $1,599 MXN antes de publicar.",
      delivery: "5-7 días hábiles después de anticipo y materiales completos.",
      summary: "Para negocios que requieren más estructura, contenido y secciones específicas.",
      cta: "Consultar NEXO A Medida",
      includes: [
        "Página larga o hasta 3 páginas",
        "Hasta 12 secciones",
        "Hasta 15 servicios",
        "Estructura personalizada",
        "Sección de equipo",
        "Portafolio o galería de hasta 20 fotos",
        "Testimonios y preguntas frecuentes",
        "Promociones",
        "QR y analítica básica",
        "Conexión de dominio si el cliente ya lo tiene activo y entrega acceso",
        "Tres rondas de revisión",
        "Publicación durante 12 meses"
      ],
      notes: [
        "Funciones especiales o integraciones avanzadas se cotizan por separado.",
        "Los materiales deben ser proporcionados o aprobados por el cliente."
      ]
    }
  ],

  commerceServices: [
    {
      id: "tienda-inicial",
      name: "NEXO Tienda Inicial",
      price: "Desde $6,999 MXN",
      badge: "Venta digital",
      payment: "$4,200 MXN para comenzar y $2,799 MXN antes de publicar. Proyectos personalizados: 60/40.",
      delivery: "10-15 días hábiles después de anticipo, accesos y materiales completos.",
      summary: "Para negocios que quieren iniciar una tienda sencilla con productos, carrito y pago estándar.",
      cta: "Revisar mi tienda",
      includes: [
        "Hasta 10 productos simples",
        "Hasta 3 categorías",
        "Catálogo, carrito y checkout estándar",
        "PayPal o Mercado Pago",
        "Configuración simple de entrega",
        "Diseño adaptable a celular",
        "WhatsApp y analítica básica",
        "Dos rondas de revisión",
        "Publicación durante 12 meses",
        "Conexión de dominio si el cliente ya lo tiene activo y entrega acceso"
      ],
      notes: [
        "No incluye inventarios complejos, automatizaciones avanzadas ni costos de pasarela.",
        "Las comisiones de proveedores son responsabilidad del cliente."
      ]
    },
    {
      id: "pagos",
      name: "Integración de pagos",
      price: "Desde $1,299 MXN",
      badge: "Servicio adicional",
      payment: "Pago completo antes de iniciar.",
      delivery: "2-5 días hábiles según plataforma y accesos.",
      summary: "Para agregar una ruta básica de cobro a una página o sitio compatible.",
      cta: "Consultar integración de pagos",
      includes: [
        "Una página o sitio",
        "Una plataforma: PayPal o Mercado Pago",
        "Hasta 3 botones, links de pago o checkout alojado",
        "Adaptación visual",
        "Prueba técnica",
        "Una ronda de corrección técnica"
      ],
      notes: [
        "Requiere sitio estable, HTTPS, accesos y cuenta activa.",
        "No incluye SDK, API, webhooks, checkout personalizado, carrito, inventario, suscripciones ni montos dinámicos."
      ]
    },
    {
      id: "reservaciones",
      name: "Integración de reservaciones",
      price: "Desde $1,299 MXN",
      badge: "Servicio adicional",
      payment: "Pago completo antes de iniciar.",
      delivery: "2-5 días hábiles según herramienta y accesos.",
      summary: "Para facilitar solicitudes de cita o reserva usando una herramienta externa compatible.",
      cta: "Consultar reservaciones",
      includes: [
        "Integración en una página o sitio compatible",
        "Botón o bloque de reserva",
        "Hasta 5 servicios o modalidades base",
        "Adaptación visual",
        "Prueba en celular",
        "Una ronda de corrección técnica"
      ],
      notes: [
        "Requiere herramienta, calendario o cuenta activa del cliente.",
        "No incluye agenda personalizada, recordatorios complejos, cobros anticipados ni sincronizaciones avanzadas."
      ]
    }
  ],

  supportServices: [
    {
      id: "presencia-local",
      name: "NEXO Presencia Local",
      price: "$1,299 MXN",
      badge: "Perfil local",
      payment: "Pago completo antes de iniciar.",
      delivery: "2-5 días hábiles para preparar y enviar cambios.",
      summary: "Para negocios con un perfil de Google activo, verificado y accesible que necesita mejor organización.",
      cta: "Revisar mi perfil de Google",
      includes: [
        "Una ubicación o perfil",
        "Hasta 10 servicios",
        "Hasta 15 fotos proporcionadas por el cliente",
        "Descripción, categorías, horarios, contacto, dirección y sitio",
        "Una ronda de revisión",
        "Resumen final con evidencia y recomendaciones"
      ],
      notes: [
        "La aprobación, publicación y permanencia dependen de Google.",
        "No garantiza posicionamiento ni aprobaciones de plataforma."
      ]
    },
    {
      id: "actualizacion",
      name: "Actualización de contenido",
      price: "Desde $200 MXN",
      badge: "Soporte puntual",
      payment: "Pago completo antes de aplicar cambios.",
      delivery: "Según volumen y disponibilidad de materiales.",
      summary: "Para cambios pequeños en páginas administradas o compatibles.",
      cta: "Solicitar actualización",
      includes: [
        "Hasta 3 cambios pequeños",
        "O hasta 3 reemplazos de imagen",
        "Aplicable principalmente a páginas administradas por NEXO26"
      ],
      notes: [
        "No incluye rediseño, nueva navegación, nueva estructura, sección completa ni reconstrucción."
      ]
    },
    {
      id: "renovacion",
      name: "Renovación técnica anual",
      price: "Desde $399 MXN al año",
      badge: "Continuidad",
      payment: "Pago anual.",
      delivery: "Revisión y continuidad según infraestructura vigente.",
      summary: "Para mantener publicada una página dentro de infraestructura administrada por NEXO26.",
      cta: "Consultar renovación",
      includes: [
        "Continuidad de publicación durante el periodo contratado",
        "Revisión técnica básica",
        "Aviso de renovación antes del vencimiento"
      ],
      notes: [
        "No incluye dominio ni cambios de contenido.",
        "Infraestructura de mayor costo puede requerir ajuste."
      ]
    },
    {
      id: "dominio",
      name: "Conexión de dominio",
      price: "Desde $350 MXN más costo del dominio",
      badge: "Dominio",
      payment: "Pago completo antes de iniciar.",
      delivery: "Según proveedor, accesos y propagación.",
      summary: "Para conectar un dominio activo del cliente a una página compatible.",
      cta: "Conectar mi dominio",
      includes: [
        "Revisión de dominio activo",
        "Conexión a página compatible",
        "Prueba básica de funcionamiento"
      ],
      notes: [
        "Incluida en NEXO Profesional, NEXO A Medida y NEXO Tienda Inicial sólo si el dominio existe, está activo y se entregan accesos.",
        "No incluye compra, renovación, transferencia, recuperación ni resolución de conflictos de propiedad."
      ]
    }
  ],

  projects: [
    {
      title: "Asador Argentino La Estancia",
      displayTitle: "Asador Argentino",
      category: "Restaurantes",
      filter: "Restaurantes",
      type: "Concepto visual",
      video: "assets/videos/projects/asador-argentino-demo.mp4",
      poster: "assets/img/projects/asador-argentino-poster.jpg",
      description: "Concepto visual para restaurante con menú, reservaciones, ubicación y WhatsApp directo."
    },
    {
      title: "Barbería Premium",
      displayTitle: "Barbería Premium",
      category: "Belleza y bienestar",
      filter: "Belleza y bienestar",
      type: "Demostración",
      video: "assets/videos/projects/barberia-premium-demo.mp4",
      poster: "assets/img/projects/barberia-premium-poster.jpg",
      description: "Landing enfocada en servicios, estilo visual, reservas y contacto rápido por WhatsApp."
    },
    {
      title: "Servicio Local Express",
      displayTitle: "Servicio Local Express",
      category: "Servicios",
      filter: "Servicios",
      type: "Concepto visual",
      video: "assets/videos/projects/servicio-local-express-demo.mp4",
      poster: "assets/img/projects/servicio-local-express-poster.jpg",
      description: "Página informativa para presentar paquetes, beneficios, proceso y contacto de forma clara."
    },
    {
      title: "VistaElite Óptica",
      displayTitle: "VistaElite Óptica",
      category: "Salud",
      filter: "Salud",
      type: "Concepto visual",
      video: "assets/videos/projects/vistaelite-optica-demo.mp4",
      poster: "assets/img/projects/vistaelite-optica-poster.jpg",
      description: "Concepto para óptica con servicios, galería, ubicación, formulario visual y botón de WhatsApp."
    }
  ],

  filters: ["Todos", "Belleza y bienestar", "Restaurantes", "Salud", "Servicios", "Comercio"],

  recommendations: {
    servicios: "esencial",
    organizar: "profesional",
    amplio: "medida",
    vender: "tienda-inicial",
    pagos: "pagos",
    reservas: "reservaciones",
    google: "presencia-local",
    actualizar: "actualizacion",
    dominio: "dominio"
  },

  faqs: [
    {
      question: "¿Qué hace NEXO26 Digital?",
      answer: "Diseñamos páginas web y soluciones digitales para ordenar la información de un negocio, mejorar su presentación y facilitar contacto, compra o reserva."
    },
    {
      question: "¿Qué necesito para comenzar?",
      answer: "Necesitamos saber qué quieres resolver, el giro del negocio, materiales disponibles, datos de contacto, servicios, horarios, ubicación y cualquier acceso necesario."
    },
    {
      question: "¿Cuándo empieza el tiempo de entrega?",
      answer: "Los tiempos empiezan a contar cuando recibimos el pago correspondiente y los materiales completos para trabajar."
    },
    {
      question: "¿Qué pasa si no tengo logo o fotos?",
      answer: "Podemos adaptar una presencia visual básica con el material disponible. Si se requiere identidad visual, fotografía o contenido más amplio, se cotiza por separado."
    },
    {
      question: "¿El precio incluye dominio?",
      answer: "NEXO Profesional, NEXO A Medida y NEXO Tienda Inicial incluyen conexión de dominio propio siempre que el cliente ya tenga un dominio activo y entregue accesos. Si el dominio todavía no existe, la compra o renovación se revisa por separado."
    },
    {
      question: "¿Puedo usar mi propio dominio?",
      answer: "Sí, siempre que el dominio esté activo, sea compatible y se tengan accesos suficientes para configurarlo."
    },
    {
      question: "¿Qué pasa después de los 12 meses de publicación?",
      answer: "Puede contratarse renovación técnica anual para mantener la página publicada dentro de la infraestructura administrada por NEXO26."
    },
    {
      question: "¿Puedo pedir cambios?",
      answer: "Sí. Cada servicio incluye rondas o cambios definidos. Cambios extra, nuevas secciones, rediseños o funciones adicionales se cotizan por separado."
    },
    {
      question: "¿Pueden vender productos en mi sitio?",
      answer: "Sí, mediante NEXO Tienda Inicial o una solución a medida, según catálogo, forma de pago, entrega y operación del negocio."
    },
    {
      question: "¿Pueden conectar pagos?",
      answer: "Sí, podemos integrar opciones básicas como PayPal o Mercado Pago cuando la página, la cuenta y los accesos lo permiten."
    },
    {
      question: "¿Pueden ayudar con mi perfil de Google?",
      answer: "Sí, con NEXO Presencia Local podemos revisar y organizar información de un perfil activo, verificado y accesible. Las aprobaciones dependen de Google."
    },
    {
      question: "¿Garantizan ventas, citas o posicionamiento?",
      answer: "No. Creamos herramientas digitales para mejorar presentación, claridad y contacto, pero no garantizamos ventas, tráfico, citas, posicionamiento ni aprobaciones de plataformas externas."
    }
  ]
};
