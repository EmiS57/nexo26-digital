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
    includedLabel: "Dominio .com estándar por 1 año incluido",
    compareNote: "El dominio incluido corresponde a una opción .com estándar disponible con valor máximo de $400 MXN durante el primer año. Renovaciones y servicios especiales se pagan por separado.",
    fullRule: "Si el cliente ya cuenta con un dominio activo, se incluye su conexión. Si todavía no cuenta con uno, NEXO26 gestiona el registro de un dominio .com estándar disponible, con un costo máximo incluido de $400 MXN durante el primer año.",
    conditions: [
      "Sujeto a disponibilidad.",
      "El nombre debe ser aprobado por el cliente antes del registro.",
      "Se registra después de recibir el pago o anticipo correspondiente.",
      "Debe quedar registrado utilizando los datos y correo del cliente.",
      "NEXO26 puede conservar acceso técnico únicamente para configurarlo.",
      "Dominios premium no están incluidos.",
      "Extensiones distintas a .com pueden generar diferencia de precio.",
      "Si el costo supera $400 MXN, el cliente cubre la diferencia.",
      "Transferencias, recuperaciones, conflictos de propiedad y cambio de dominio después del registro no están incluidos.",
      "La renovación a partir del segundo año se paga por separado y depende del proveedor."
    ]
  },

  webPackages: [
    {
      id: "esencial",
      name: "NEXO Esencial",
      price: "$999 MXN",
      badge: "Pago completo",
      payment: "Pago completo antes de iniciar.",
      delivery: "Primera versión en 48-72 horas hábiles después de pago y materiales completos.",
      summary: "Para negocios que necesitan una presencia clara, rápida y lista para compartir.",
      domain: "URL administrada por NEXO26",
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
        "URL administrada por NEXO26",
        "Publicación durante 12 meses"
      ],
      notes: [
        "Dominio propio disponible como servicio adicional.",
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
      domain: "Dominio .com estándar por 1 año incluido",
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
        "Dominio .com estándar por 1 año incluido",
        "Dos rondas de revisión",
        "Publicación durante 12 meses"
      ],
      notes: [
        "Si el cliente ya cuenta con dominio activo, se incluye su conexión.",
        "Si todavía no cuenta con uno, NEXO26 gestiona un dominio .com estándar disponible con valor máximo incluido de $400 MXN durante el primer año."
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
      domain: "Dominio .com estándar por 1 año incluido",
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
        "Dominio .com estándar por 1 año incluido",
        "Tres rondas de revisión",
        "Publicación durante 12 meses"
      ],
      notes: [
        "Funciones especiales o integraciones avanzadas se cotizan por separado.",
        "El dominio incluido está sujeto a disponibilidad, aprobación escrita del nombre y valor máximo de $400 MXN durante el primer año."
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
      domain: "Dominio .com estándar por 1 año incluido",
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
        "Dominio .com estándar por 1 año incluido"
      ],
      notes: [
        "No incluye inventarios complejos, automatizaciones avanzadas ni costos de pasarela.",
        "El dominio incluido está sujeto a disponibilidad, aprobación escrita del nombre y valor máximo de $400 MXN durante el primer año."
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
        "Disponible como servicio adicional para NEXO Esencial u otros proyectos compatibles.",
        "Transferencias, recuperaciones y conflictos de propiedad no están incluidos."
      ]
    }
  ],

  projects: [
    {
      title: "Barbería Premium",
      displayTitle: "Barbería Premium",
      category: "Belleza y bienestar",
      filter: "Belleza y bienestar",
      type: "Demostración",
      video: "assets/videos/projects/barberia-premium-demo.mp4",
      poster: "assets/img/projects/posters/barberia-premium-poster.webp",
      description: "Landing enfocada en servicios, estilo visual, reservas y contacto rápido por WhatsApp.",
      features: ["Servicios", "Reservas", "WhatsApp", "Vista móvil"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un negocio de belleza o cuidado personal y me interesa una página similar a la demostración de Barbería Premium. Me gustaría conocer qué opción podría adaptarse a mi negocio."
    },
    {
      title: "Clínica Veterinaria 24 Horas",
      displayTitle: "Concepto veterinario 01",
      category: "Veterinarias y salud",
      filter: "Veterinarias y salud",
      type: "Concepto visual",
      video: "assets/videos/projects/veterinaria-demo-01.mp4",
      poster: "assets/img/projects/posters/veterinaria-01-poster.webp",
      description: "Demostración para organizar consultas, servicios, horarios, ubicación, preguntas frecuentes y contacto por WhatsApp.",
      features: ["Servicios veterinarios", "Horarios", "Ubicación", "Preguntas frecuentes", "WhatsApp", "Vista móvil"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un negocio relacionado con servicios veterinarios y me interesa una página similar a esta demostración. Me gustaría conocer qué opción podría adaptarse a mi negocio."
    },
    {
      title: "Asador Argentino La Estancia",
      displayTitle: "Asador Argentino",
      category: "Restaurantes",
      filter: "Restaurantes",
      type: "Concepto visual",
      video: "assets/videos/projects/asador-argentino-demo.mp4",
      poster: "assets/img/projects/posters/asador-argentino-poster.webp",
      description: "Concepto visual para restaurante con menú, reservaciones, ubicación y WhatsApp directo.",
      features: ["Menú", "Reservaciones", "Ubicación", "WhatsApp"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un restaurante o negocio de alimentos y me interesa una página similar al concepto de Asador Argentino. Me gustaría conocer qué opción podría adaptarse a mi negocio."
    },
    {
      title: "Servicio Local Express",
      displayTitle: "Servicio Local Express",
      category: "Servicios",
      filter: "Servicios",
      type: "Concepto visual",
      video: "assets/videos/projects/servicio-local-express-demo.mp4",
      poster: "assets/img/projects/posters/servicio-local-express-poster.webp",
      description: "Página informativa para presentar paquetes, beneficios, proceso y contacto de forma clara.",
      features: ["Paquetes", "Beneficios", "Proceso", "Contacto"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un negocio de servicios y me interesa una página similar a Servicio Local Express. Me gustaría conocer qué opción podría adaptarse a mi negocio."
    },
    {
      title: "VistaElite Óptica",
      displayTitle: "VistaElite Óptica",
      category: "Comercio",
      filter: "Comercio",
      type: "Concepto visual",
      video: "assets/videos/projects/vistaelite-optica-demo.mp4",
      poster: "assets/img/projects/posters/vistaelite-optica-poster.webp",
      description: "Concepto para óptica con servicios, galería, ubicación, formulario visual y botón de WhatsApp.",
      features: ["Servicios", "Galería", "Ubicación", "Formulario visual", "WhatsApp"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un negocio de comercio o salud visual y me interesa una página similar a VistaElite Óptica. Me gustaría conocer qué opción podría adaptarse a mi negocio."
    },
    {
      title: "Clínica Veterinaria 24 Horas",
      displayTitle: "Concepto veterinario 02",
      category: "Veterinarias y salud",
      filter: "Veterinarias y salud",
      type: "Demostración",
      video: "assets/videos/projects/veterinaria-demo-02.mp4",
      poster: "assets/img/projects/posters/veterinaria-02-poster.webp",
      description: "Página adaptada a celular que reúne la información principal y facilita la consulta mediante WhatsApp.",
      features: ["Servicios veterinarios", "Horarios", "Ubicación", "Preguntas frecuentes", "WhatsApp", "Vista móvil"],
      cta: "Quiero algo similar",
      whatsappMessage: "Hola, tengo un negocio relacionado con servicios veterinarios y me interesa una página similar a esta demostración. Me gustaría conocer qué opción podría adaptarse a mi negocio."
    }
  ],

  filters: ["Todos", "Belleza y bienestar", "Restaurantes", "Veterinarias y salud", "Comercio", "Servicios"],

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
      answer: "NEXO Profesional, NEXO A Medida y NEXO Tienda Inicial incluyen durante el primer año un dominio .com estándar disponible con valor máximo de $400 MXN. Si el cliente ya posee un dominio activo, se incluye su conexión. Dominios premium, extensiones especiales, transferencias, recuperaciones y renovaciones posteriores se pagan por separado."
    },
    {
      question: "¿A nombre de quién queda registrado el dominio?",
      answer: "El dominio se registra con los datos y correo del cliente. NEXO26 puede conservar acceso técnico para configurarlo, pero la propiedad debe permanecer con el negocio."
    },
    {
      question: "¿Qué ocurre después del primer año del dominio?",
      answer: "El cliente cubre directamente la renovación del dominio. El costo depende del proveedor y de la extensión utilizada. NEXO26 puede apoyar con la configuración o renovación técnica cuando sea necesario."
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
