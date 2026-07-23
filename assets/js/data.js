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

  domainPolicy: {
    essentialLabel: "URL administrada por NEXO26",
    includedLabel: "Conexión de dominio solo si ya existe",
    compareNote: "El dominio propio no forma parte del precio base. Si ya existe y es compatible, puede conectarse en los alcances indicados. El registro o compra de dominio se cotiza como extra desde $350 MXN más costo del dominio.",
    fullRule: "NEXO Esencial no incluye dominio. NEXO Profesional contempla conexión de dominio solo si ya existe y se entregan accesos suficientes. Los dominios nuevos, transferencias, recuperaciones o cambios de propiedad se cotizan por separado.",
    conditions: [
      "La conexión requiere dominio activo, compatible y con accesos suficientes.",
      "El registro de un dominio nuevo se cotiza como servicio adicional.",
      "El costo del dominio lo cubre el cliente según proveedor, extensión y disponibilidad.",
      "Transferencias, recuperaciones, conflictos de propiedad y cambios de dominio no están incluidos.",
      "NEXO26 puede conservar acceso técnico únicamente para configurarlo cuando el cliente lo autorice.",
      "Renovaciones posteriores del dominio dependen del proveedor y se pagan por separado."
    ]
  },

  webPackages: [
    {
      id: "esencial",
      name: "NEXO Esencial",
      price: "$999 MXN",
      badge: "Pago completo",
      payment: "Pago completo para comenzar",
      delivery: "48 a 72 horas después de pago y materiales completos",
      summary: "Para negocios que necesitan una presencia clara, rápida y lista para compartir.",
      domain: "Sin dominio incluido",
      cta: "Consultar NEXO Esencial",
      includes: [
        "Una vista",
        "Hasta 5 secciones",
        "Hasta 6 servicios o categorías",
        "Botón directo a WhatsApp",
        "Una ronda de cambios",
        "12 meses de publicación",
        "Sin dominio incluido"
      ],
      notes: [
        "Dominio desde $350 MXN más costo del dominio.",
        "Funciones adicionales se cotizan por separado."
      ]
    },
    {
      id: "profesional",
      name: "NEXO Profesional",
      price: "$2,299 MXN",
      badge: "RECOMENDADO",
      payment: "$1,600 MXN para comenzar y $699 MXN antes de publicar.",
      delivery: "Aproximadamente 72 horas después de anticipo y materiales completos",
      summary: "Para negocios que necesitan explicar mejor sus servicios y verse más completos.",
      domain: "Conexión de dominio solo si ya existe",
      cta: "Consultar NEXO Profesional",
      includes: [
        "Una vista",
        "Hasta 8 secciones",
        "Hasta 10 servicios o categorías",
        "Encabezado comercial",
        "Galería",
        "Hasta 5 testimonios",
        "Hasta 6 FAQ",
        "Mapa",
        "Código QR",
        "Analítica básica",
        "Conexión de dominio solo si ya existe",
        "Dos rondas de cambios",
        "12 meses de publicación"
      ],
      notes: [
        "La conexión aplica si el dominio está activo, es compatible y se entregan accesos suficientes.",
        "Dominio desde $350 MXN más costo del dominio."
      ]
    },
    {
      id: "medida",
      name: "NEXO A Medida",
      price: "$3,999 MXN",
      badge: "Proyecto ampliado",
      payment: "$2,400 MXN para comenzar y $1,599 MXN antes de publicar.",
      delivery: "5 a 7 días después de anticipo y materiales completos",
      summary: "Para negocios que requieren más estructura, contenido y secciones específicas.",
      domain: "Dominio cotizable como extra",
      cta: "Consultar NEXO A Medida",
      includes: [
        "Hasta 3 páginas",
        "Hasta 12 secciones",
        "Hasta 15 servicios o categorías",
        "Equipo",
        "Portafolio",
        "Mayor personalización",
        "Tres rondas de cambios",
        "12 meses de publicación"
      ],
      notes: [
        "Funciones especiales o integraciones avanzadas se cotizan por separado.",
        "Dominio desde $350 MXN más costo del dominio."
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
      domain: "Dominio cotizable como extra",
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
        "Publicación durante 12 meses"
      ],
      notes: [
        "No incluye inventarios complejos, automatizaciones avanzadas ni costos de pasarela.",
        "Dominio desde $350 MXN más costo del dominio."
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
      price: "$399 MXN",
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
        "Disponible como servicio adicional para NEXO Esencial u otros proyectos compatibles.",
        "Transferencias, recuperaciones y conflictos de propiedad no están incluidos."
      ]
    }
  ],

  ecosystems: [
    {
      id: "salud-confianza",
      name: "Salud y confianza",
      audience: "Consultorios, clinicas, opticas, veterinarias y servicios de cuidado responsable.",
      problem: "La gente necesita entender servicios, horarios, ubicacion y limites antes de escribir.",
      objective: "Construir confianza inicial, explicar alcances con claridad y llevar al cliente a una consulta informada por WhatsApp.",
      route: "NEXO Profesional como base; NEXO A Medida si hay varias sedes, equipo o especialidades.",
      sections: ["Encabezado de confianza", "Servicios", "Proceso de atencion", "Ubicacion", "Preguntas frecuentes", "WhatsApp"],
      functions: ["FAQ responsable", "Mapa o zona", "Galeria real", "Mensaje con contexto"],
      style: "Limpio, claro y profesional; blanco, negro suave y acentos discretos.",
      cta: "Adaptar este ecosistema a mi negocio",
      whatsappMessage: "Hola, tengo un negocio de salud o cuidado responsable y me interesa revisar un ecosistema NEXO para explicar servicios, ubicacion y contacto por WhatsApp."
    },
    {
      id: "belleza-bienestar",
      name: "Belleza y bienestar",
      audience: "Barberias, salones, estudios de cuidado personal, terapeutas y experiencias de bienestar.",
      problem: "El cliente quiere ver estilo, servicios, disponibilidad de contacto y confianza antes de pedir informacion.",
      objective: "Presentar servicios, estilo y preguntas comunes para que el cliente llegue a WhatsApp con una idea clara de lo que busca.",
      route: "NEXO Profesional para servicios, galeria y FAQ; A Medida si necesita experiencias, agenda externa o mas contenido.",
      sections: ["Encabezado visual", "Servicios", "Galeria", "Experiencias", "Preguntas frecuentes", "WhatsApp"],
      functions: ["Galeria editorial", "Servicios destacados", "Preguntas comunes", "CTA por WhatsApp"],
      style: "Editorial, sobrio y sensorial sin lujo falso ni imagenes irreales.",
      cta: "Adaptar este ecosistema a mi negocio",
      whatsappMessage: "Hola, tengo un negocio de belleza o bienestar y me interesa revisar un ecosistema NEXO con servicios, galeria, FAQ y WhatsApp."
    },
    {
      id: "fitness-movimiento",
      name: "Fitness y movimiento",
      audience: "Gimnasios, estudios, entrenadores, academias y espacios de movimiento.",
      problem: "Programas, horarios, sedes y primera visita suelen quedar dispersos en redes o mensajes repetidos.",
      objective: "Ordenar programas, modalidad, horarios y primer contacto para reducir dudas repetidas antes de la visita.",
      route: "NEXO Profesional para una sede; A Medida para varias sedes, programas amplios o paginas por modalidad.",
      sections: ["Programas", "Horarios", "Primera visita", "Instalaciones", "FAQ", "WhatsApp"],
      functions: ["Comparacion de programas", "Horarios claros", "Solicitud inicial", "Mapa o zonas"],
      style: "Activo y directo con contraste alto; energia visual sin promesas fisicas.",
      cta: "Adaptar este ecosistema a mi negocio",
      whatsappMessage: "Hola, tengo un negocio de fitness o movimiento y me interesa revisar un ecosistema NEXO para ordenar programas, horarios y contacto."
    },
    {
      id: "gastronomia-experiencias",
      name: "Gastronomia y experiencias",
      audience: "Restaurantes, cafeterias, barras, experiencias privadas y marcas de alimentos.",
      problem: "Menu, ubicacion, horarios, reservaciones y eventos necesitan estar claros antes de la visita.",
      objective: "Ayudar al visitante a entender la propuesta, revisar menu o experiencia y elegir la ruta correcta para reservar o preguntar.",
      route: "NEXO Profesional para presencia clara; A Medida si hay menu amplio, eventos, experiencias o varias paginas.",
      sections: ["Especialidad", "Menu", "Ubicacion", "Reservaciones", "Eventos", "WhatsApp"],
      functions: ["Menu navegable", "Consulta para grupos", "Galeria real", "CTA de reserva externa"],
      style: "Editorial y apetecible con fotos reales; sin claims genericos de agencia.",
      cta: "Adaptar este ecosistema a mi negocio",
      whatsappMessage: "Hola, tengo un negocio gastronomico y me interesa revisar un ecosistema NEXO para menu, ubicacion, reservaciones y WhatsApp."
    },
    {
      id: "servicios-comercio",
      name: "Servicios y comercio",
      audience: "Servicios locales, tecnicos, tiendas, oficios, comercios y negocios con catalogo inicial.",
      problem: "El visitante necesita saber que se ofrece, cuanto alcance tiene el servicio y como pedir una cotizacion.",
      objective: "Organizar servicios, cobertura, categorias y requisitos para que la solicitud llegue con contexto comercial util.",
      route: "NEXO Esencial para informacion directa; NEXO Profesional o Tienda Inicial si hay catalogo, pagos o mas categorias.",
      sections: ["Servicios o categorias", "Cobertura", "Proceso", "Productos", "FAQ", "WhatsApp"],
      functions: ["Cotizacion guiada", "Catalogo inicial", "Cobertura", "Mensaje preparado"],
      style: "Practico, creible y escaneable; negro, blanco y acento de marca.",
      cta: "Adaptar este ecosistema a mi negocio",
      whatsappMessage: "Hola, tengo un negocio de servicios o comercio y me interesa revisar un ecosistema NEXO para ordenar informacion, catalogo o cotizaciones por WhatsApp."
    }
  ],

  projects: [
    {
      id: "barberia-premium",
      name: "Barbería Premium",
      title: "Barbería Premium",
      displayTitle: "Barbería Premium",
      industry: "Belleza y bienestar",
      category: "Belleza y bienestar",
      filter: "Belleza y bienestar",
      type: "Demostración",
      package: "NEXO Profesional",
      video: "assets/videos/projects/barberia-premium-demo.mp4",
      poster: "assets/img/projects/posters/barberia-premium-poster.webp",
      liveUrl: "",
      description: "Landing enfocada en servicios, estilo visual, reservas y contacto rápido por WhatsApp.",
      features: ["Servicios", "Reservas", "WhatsApp", "Vista móvil"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un negocio de belleza o cuidado personal y me interesa una página similar a la demostración de Barbería Premium. Me gustaría conocer qué opción podría adaptarse a mi negocio.",
      status: "published",
      featured: false
    },
    {
      id: "nubo-veterinaria",
      name: "NUBO Centro Veterinario",
      title: "NUBO Centro Veterinario",
      displayTitle: "NUBO Centro Veterinario",
      industry: "Veterinaria",
      category: "Salud",
      filter: "Salud",
      type: "Concepto base",
      package: "NEXO Profesional",
      video: "",
      poster: "demos/nubo-veterinaria/assets/img/social-preview.svg",
      liveUrl: "demos/nubo-veterinaria/",
      description: "Concepto para veterinaria con áreas de atención, prevención, orientador de consulta y contacto demostrativo.",
      features: ["Atención", "Prevención", "Orientador", "FAQ", "Contacto"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo una veterinaria o servicio de salud animal y me interesa una página similar al concepto NUBO Centro Veterinario.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "claria-dental",
      name: "CLARIA Estudio Dental",
      title: "CLARIA Estudio Dental",
      displayTitle: "CLARIA Estudio Dental",
      industry: "Dental",
      category: "Salud",
      filter: "Salud",
      type: "Concepto base",
      package: "NEXO Profesional",
      video: "",
      poster: "demos/claria-dental/assets/img/social-preview.svg",
      liveUrl: "demos/claria-dental/",
      description: "Concepto para consultorio dental con tratamientos, primera consulta, orientador y FAQ responsable.",
      features: ["Tratamientos", "Primera consulta", "Orientador", "Ubicación", "FAQ"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un consultorio dental y me interesa una página similar al concepto CLARIA Estudio Dental.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "lumbre-cauce",
      name: "LUMBRE CAUCE",
      title: "LUMBRE CAUCE",
      displayTitle: "LUMBRE CAUCE",
      industry: "Restaurante",
      category: "Restaurantes",
      filter: "Restaurantes",
      type: "Concepto base",
      package: "NEXO A Medida",
      video: "",
      poster: "demos/lumbre-cauce/assets/img/social-preview.svg",
      liveUrl: "demos/lumbre-cauce/",
      description: "Concepto de restaurante con inicio, menú buscable y página de experiencia para grupos o eventos.",
      features: ["Inicio", "Menú", "Experiencia", "Eventos", "Consulta"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un restaurante y me interesa una página similar al concepto LUMBRE CAUCE.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "eje-norte",
      name: "EJE NORTE Entrenamiento",
      title: "EJE NORTE Entrenamiento",
      displayTitle: "EJE NORTE Entrenamiento",
      industry: "Gimnasio",
      category: "Fitness",
      filter: "Fitness",
      type: "Concepto base",
      package: "NEXO Profesional",
      video: "",
      poster: "demos/eje-norte/assets/img/social-preview.svg",
      liveUrl: "demos/eje-norte/",
      description: "Concepto para gimnasio con modalidades, horarios, primera visita y orientador sin promesas físicas.",
      features: ["Modalidades", "Instalaciones", "Horarios", "Orientador", "FAQ"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un gimnasio o estudio de entrenamiento y me interesa una página similar al concepto EJE NORTE.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "senda-nitida",
      name: "SENDA NÍTIDA Óptica",
      title: "SENDA NÍTIDA Óptica",
      displayTitle: "SENDA NÍTIDA Óptica",
      industry: "Óptica",
      category: "Comercio",
      filter: "Comercio",
      type: "Concepto base",
      package: "NEXO Profesional",
      video: "",
      poster: "demos/senda-nitida/assets/img/social-preview.svg",
      liveUrl: "demos/senda-nitida/",
      description: "Concepto para óptica con servicios, explorador de estilos, proceso, ajustes y contacto responsable.",
      features: ["Estilos", "Servicios", "Examen visual", "Ajustes", "FAQ"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo una óptica y me interesa una página similar al concepto SENDA NÍTIDA.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "surco-lento",
      name: "SURCO LENTO Objetos",
      title: "SURCO LENTO Objetos",
      displayTitle: "SURCO LENTO Objetos",
      industry: "Tienda",
      category: "Comercio",
      filter: "Comercio",
      type: "Concepto base",
      package: "NEXO Tienda Inicial",
      video: "",
      poster: "demos/surco-lento/assets/img/social-preview.svg",
      liveUrl: "demos/surco-lento/",
      description: "Tienda inicial con tres categorías, diez productos ficticios, carrito persistente y checkout simulado sin cobro.",
      features: ["Catálogo", "Carrito", "Checkout simulado", "localStorage", "Entrega"],
      cta: "Quiero una tienda similar",
      whatsappMessage: "Hola, quiero una tienda inicial similar al concepto SURCO LENTO Objetos.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "nodo-termia",
      name: "NODO TERMIA Servicio Técnico",
      title: "NODO TERMIA Servicio Técnico",
      displayTitle: "NODO TERMIA Servicio Técnico",
      industry: "Servicio técnico",
      category: "Servicios",
      filter: "Servicios",
      type: "Concepto base",
      package: "NEXO Esencial",
      video: "",
      poster: "demos/nodo-termia/assets/img/social-preview.svg",
      liveUrl: "demos/nodo-termia/",
      description: "Concepto esencial para servicio local con servicios, cobertura, proceso y contacto demostrativo.",
      features: ["Servicios", "Cobertura", "Proceso", "WhatsApp", "Alcance esencial"],
      cta: "Quiero una página sencilla",
      whatsappMessage: "Hola, tengo un negocio de servicio técnico y me interesa una página sencilla similar al concepto NODO TERMIA.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "huella-clara-veterinaria",
      name: "Huella Clara Centro Veterinario",
      title: "Huella Clara Centro Veterinario",
      displayTitle: "Huella Clara",
      industry: "Veterinaria",
      category: "Salud",
      filter: "Salud",
      type: "Concepto base",
      package: "NEXO Profesional",
      video: "",
      poster: "demos/huella-clara-veterinaria/assets/img/social-preview.svg",
      liveUrl: "demos/huella-clara-veterinaria/",
      description: "Concepto veterinario con servicios, cuidado por etapas, orientador responsable y contacto demostrativo.",
      features: ["Atención", "Etapas", "Orientador", "FAQ", "Contacto"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo una veterinaria y me interesa una página similar al concepto Huella Clara.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "arco-claro-dental",
      name: "Arco Claro Clínica Dental",
      title: "Arco Claro Clínica Dental",
      displayTitle: "Arco Claro",
      industry: "Dental",
      category: "Salud",
      filter: "Salud",
      type: "Concepto base",
      package: "NEXO Profesional",
      video: "",
      poster: "demos/arco-claro-dental/assets/img/social-preview.svg",
      liveUrl: "demos/arco-claro-dental/",
      description: "Concepto dental con tratamientos, primera consulta, orientador y FAQ sin diagnósticos automáticos.",
      features: ["Tratamientos", "Visita", "Orientador", "FAQ", "Contacto"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo una clínica dental y me interesa una página similar al concepto Arco Claro.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "casa-brasa-restaurante",
      name: "Casa Brasa Cocina",
      title: "Casa Brasa Cocina",
      displayTitle: "Casa Brasa",
      industry: "Restaurante",
      category: "Restaurantes",
      filter: "Restaurantes",
      type: "Concepto base",
      package: "NEXO A Medida",
      video: "",
      poster: "demos/casa-brasa-restaurante/assets/img/social-preview.svg",
      liveUrl: "demos/casa-brasa-restaurante/",
      description: "Concepto de restaurante con inicio, menú buscable y ruta de experiencia para grupos o celebraciones.",
      features: ["Inicio", "Menú", "Experiencia", "Filtros", "Consulta"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un restaurante y me interesa una página similar al concepto Casa Brasa.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "ritmo-base-entrenamiento",
      name: "Ritmo Base Entrenamiento",
      title: "Ritmo Base Entrenamiento",
      displayTitle: "Ritmo Base",
      industry: "Gimnasio",
      category: "Fitness",
      filter: "Fitness",
      type: "Concepto base",
      package: "NEXO Profesional",
      video: "",
      poster: "demos/ritmo-base-entrenamiento/assets/img/social-preview.svg",
      liveUrl: "demos/ritmo-base-entrenamiento/",
      description: "Concepto para gimnasio con modalidades, horarios demostrativos y selector de inicio sin promesas físicas.",
      features: ["Modalidades", "Horarios", "Primera visita", "Selector", "FAQ"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un gimnasio y me interesa una página similar al concepto Ritmo Base.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "foco-vivo-optica",
      name: "Foco Vivo Óptica",
      title: "Foco Vivo Óptica",
      displayTitle: "Foco Vivo",
      industry: "Óptica",
      category: "Comercio",
      filter: "Comercio",
      type: "Concepto base",
      package: "NEXO Profesional",
      video: "",
      poster: "demos/foco-vivo-optica/assets/img/social-preview.svg",
      liveUrl: "demos/foco-vivo-optica/",
      description: "Concepto para óptica con servicios, explorador de estilos, proceso y contacto responsable.",
      features: ["Servicios", "Estilos", "Proceso", "Ajustes", "FAQ"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo una óptica y me interesa una página similar al concepto Foco Vivo.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "casa-lote-tienda",
      name: "Casa Lote Objetos y Regalos",
      title: "Casa Lote Objetos y Regalos",
      displayTitle: "Casa Lote",
      industry: "Tienda",
      category: "Comercio",
      filter: "Comercio",
      type: "Concepto base",
      package: "NEXO Tienda Inicial",
      video: "",
      poster: "demos/casa-lote-tienda/assets/img/social-preview.svg",
      liveUrl: "demos/casa-lote-tienda/",
      description: "Tienda inicial con diez productos ficticios, tres categorías, carrito persistente y checkout simulado sin cobro.",
      features: ["Catálogo", "Carrito", "Checkout simulado", "localStorage", "Entrega"],
      cta: "Quiero una tienda similar",
      whatsappMessage: "Hola, quiero una tienda inicial similar al concepto Casa Lote.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "clima-claro-servicio",
      name: "Clima Claro Servicio Técnico",
      title: "Clima Claro Servicio Técnico",
      displayTitle: "Clima Claro",
      industry: "Servicio técnico",
      category: "Servicios",
      filter: "Servicios",
      type: "Concepto base",
      package: "NEXO Esencial",
      video: "",
      poster: "demos/clima-claro-servicio/assets/img/social-preview.svg",
      liveUrl: "demos/clima-claro-servicio/",
      description: "Concepto esencial para climatización con seis servicios, cobertura demostrativa y constructor de mensaje.",
      features: ["Servicios", "Cobertura", "Proceso", "Constructor", "Contacto"],
      cta: "Quiero una página sencilla",
      whatsappMessage: "Hola, tengo un servicio técnico y me interesa una página sencilla similar al concepto Clima Claro.",
      status: "draft",
      published: false,
      featured: false
    },
    {
      id: "veterinaria-demo-01",
      name: "Concepto veterinario 01",
      title: "Clínica Veterinaria 24 Horas",
      displayTitle: "Concepto veterinario 01",
      industry: "Veterinaria",
      category: "Veterinarias y salud",
      filter: "Veterinarias y salud",
      type: "Concepto visual",
      package: "NEXO Profesional",
      video: "assets/videos/projects/veterinaria-demo-01.mp4",
      poster: "assets/img/projects/posters/veterinaria-01-poster.webp",
      liveUrl: "",
      description: "Demostración para organizar consultas, servicios, horarios, ubicación, preguntas frecuentes y contacto por WhatsApp.",
      features: ["Servicios veterinarios", "Horarios", "Ubicación", "Preguntas frecuentes", "WhatsApp", "Vista móvil"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un negocio relacionado con servicios veterinarios y me interesa una página similar a esta demostración. Me gustaría conocer qué opción podría adaptarse a mi negocio.",
      status: "published",
      featured: false
    },
    {
      id: "asador-argentino",
      name: "Asador Argentino",
      title: "Asador Argentino La Estancia",
      displayTitle: "Asador Argentino",
      industry: "Restaurante",
      category: "Restaurantes",
      filter: "Restaurantes",
      type: "Concepto visual",
      package: "NEXO A Medida",
      video: "assets/videos/projects/asador-argentino-demo.mp4",
      poster: "assets/img/projects/posters/asador-argentino-poster.webp",
      liveUrl: "",
      description: "Concepto visual para restaurante con menú, reservaciones, ubicación y WhatsApp directo.",
      features: ["Menú", "Reservaciones", "Ubicación", "WhatsApp"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un restaurante o negocio de alimentos y me interesa una página similar al concepto de Asador Argentino. Me gustaría conocer qué opción podría adaptarse a mi negocio.",
      status: "published",
      featured: false
    },
    {
      id: "servicio-local-express",
      name: "Servicio Local Express",
      title: "Servicio Local Express",
      displayTitle: "Servicio Local Express",
      industry: "Servicios",
      category: "Servicios",
      filter: "Servicios",
      type: "Concepto visual",
      package: "NEXO Esencial",
      video: "assets/videos/projects/servicio-local-express-demo.mp4",
      poster: "assets/img/projects/posters/servicio-local-express-poster.webp",
      liveUrl: "",
      description: "Página informativa para presentar paquetes, beneficios, proceso y contacto de forma clara.",
      features: ["Paquetes", "Beneficios", "Proceso", "Contacto"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un negocio de servicios y me interesa una página similar a Servicio Local Express. Me gustaría conocer qué opción podría adaptarse a mi negocio.",
      status: "published",
      featured: false
    },
    {
      id: "vistaelite-optica",
      name: "VistaElite Óptica",
      title: "VistaElite Óptica",
      displayTitle: "VistaElite Óptica",
      industry: "Óptica",
      category: "Comercio",
      filter: "Comercio",
      type: "Concepto visual",
      package: "NEXO Profesional",
      video: "assets/videos/projects/vistaelite-optica-demo.mp4",
      poster: "assets/img/projects/posters/vistaelite-optica-poster.webp",
      liveUrl: "",
      description: "Concepto para óptica con servicios, galería, ubicación, formulario visual y botón de WhatsApp.",
      features: ["Servicios", "Galería", "Ubicación", "Formulario visual", "WhatsApp"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un negocio de comercio o salud visual y me interesa una página similar a VistaElite Óptica. Me gustaría conocer qué opción podría adaptarse a mi negocio.",
      status: "published",
      featured: false
    },
    {
      id: "veterinaria-demo-02",
      name: "Concepto veterinario 02",
      title: "Clínica Veterinaria 24 Horas",
      displayTitle: "Concepto veterinario 02",
      industry: "Veterinaria",
      category: "Veterinarias y salud",
      filter: "Veterinarias y salud",
      type: "Demostración",
      package: "NEXO Profesional",
      video: "assets/videos/projects/veterinaria-demo-02.mp4",
      poster: "assets/img/projects/posters/veterinaria-02-poster.webp",
      liveUrl: "",
      description: "Página adaptada a celular que reúne la información principal y facilita la consulta mediante WhatsApp.",
      features: ["Servicios veterinarios", "Horarios", "Ubicación", "Preguntas frecuentes", "WhatsApp", "Vista móvil"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un negocio relacionado con servicios veterinarios y me interesa una página similar a esta demostración. Me gustaría conocer qué opción podría adaptarse a mi negocio.",
      status: "published",
      featured: false
    }
  ],

  filters: ["Todos", "Belleza y bienestar", "Restaurantes", "Veterinarias y salud", "Salud", "Fitness", "Comercio", "Servicios"],

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
      answer: "NEXO Esencial no incluye dominio. NEXO Profesional contempla conexión de dominio solo si ya existe y se entregan accesos suficientes. En otros alcances, el dominio puede cotizarse como servicio adicional desde $350 MXN más costo del dominio."
    },
    {
      question: "¿A nombre de quién queda registrado el dominio?",
      answer: "Si se cotiza y registra un dominio nuevo, debe quedar con los datos y correo del cliente. NEXO26 puede conservar acceso técnico para configurarlo cuando el cliente lo autorice, pero la propiedad debe permanecer con el negocio."
    },
    {
      question: "¿Qué ocurre después del primer año del dominio?",
      answer: "El cliente cubre directamente cualquier renovación de dominio. El costo depende del proveedor y de la extensión utilizada. NEXO26 puede apoyar con configuración o renovación técnica cuando sea necesario."
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
