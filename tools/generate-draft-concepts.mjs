import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const today = "2026-07-15";
const publicRoot = process.env.NEXO_PUBLIC_ROOT || "https://emis57.github.io/nexo26-digital";
const nexoWhatsapp = "https://wa.me/message/ZPTEPGUHA3O2B1";

function write(relPath, content) {
  const target = join(root, relPath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content.trimStart().trimEnd() + "\n", "utf8");
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsString(value) {
  return JSON.stringify(value, null, 2);
}

const packageScopes = {
  esencial: {
    packageName: "NEXO Esencial",
    packagePrice: "$999 MXN",
    payment: "Pago completo.",
    sections: "Una vista, hasta 5 secciones.",
    services: "Hasta 6 servicios.",
    revisions: "Una ronda consolidada.",
    delivery: "Primera versión entre 48 y 72 horas hábiles después de pago y materiales completos.",
    domain: "URL administrada por NEXO26. Dominio propio disponible como adicional.",
    notIncluded: ["Dominio propio incluido", "Varias páginas", "Pago en línea", "Reservación", "Mapa complejo", "Cotización automática"]
  },
  profesional: {
    packageName: "NEXO Profesional",
    packagePrice: "$2,299 MXN",
    payment: "$1,600 para comenzar y $699 antes de publicar.",
    sections: "Una página, hasta 8 secciones.",
    services: "Hasta 10 servicios.",
    revisions: "Dos rondas consolidadas.",
    delivery: "Primera versión alrededor de 72 horas hábiles después de anticipo y materiales completos.",
    domain: "Dominio .com estándar por un año incluido, sujeto a disponibilidad y política vigente.",
    notIncluded: ["Pago en línea", "Reservación avanzada", "Historia clínica", "Diagnóstico automático", "Integraciones complejas"]
  },
  medida: {
    packageName: "NEXO A Medida",
    packagePrice: "$3,999 MXN",
    payment: "$2,400 para comenzar y $1,599 antes de publicar.",
    sections: "Página larga o hasta 3 páginas.",
    services: "Hasta 15 servicios o contenidos.",
    revisions: "Tres rondas consolidadas.",
    delivery: "Entrega entre 5 y 7 días hábiles después de anticipo y materiales completos.",
    domain: "Dominio .com estándar por un año incluido, sujeto a disponibilidad y política vigente.",
    notIncluded: ["Reservación automática", "Pago en línea", "Inventario", "Sistema de lealtad", "Integraciones a terceros"]
  },
  tienda: {
    packageName: "NEXO Tienda Inicial",
    packagePrice: "Desde $6,999 MXN",
    payment: "$4,200 para comenzar y $2,799 antes de publicar.",
    sections: "Tienda inicial con catálogo, carrito y checkout estándar.",
    services: "Hasta 10 productos simples y hasta 3 categorías.",
    revisions: "Dos rondas consolidadas.",
    delivery: "Entrega entre 10 y 15 días hábiles después de anticipo, materiales y accesos.",
    domain: "Dominio .com estándar por un año incluido, sujeto a disponibilidad y política vigente.",
    notIncluded: ["Inventario avanzado", "Múltiples variantes", "Tarifas reales", "Pago real en esta demo", "Automatizaciones complejas"]
  }
};

const concepts = [
  {
    id: "huella-clara-veterinaria",
    slug: "huella-clara-veterinaria",
    name: "Huella Clara",
    descriptor: "Centro Veterinario",
    industry: "Veterinaria",
    category: "Salud",
    packageKey: "profesional",
    type: "Concepto base",
    tagline: "Cuidado informado. Atención cercana.",
    layout: "clinical-editorial",
    palette: {
      paper: "#F6F2E9",
      surface: "#FFFFFF",
      ink: "#202726",
      muted: "#5F6C67",
      accent: "#18333D",
      support: "#8FA99C",
      warm: "#D97868",
      wash: "#DCE8E7"
    },
    font: '"Segoe UI", "Aptos", system-ui, sans-serif',
    nav: ["Atención", "Etapas", "Orientador", "Contacto"],
    hero: {
      eyebrow: "CONSULTA · PREVENCIÓN · SEGUIMIENTO",
      title: "Información clara para cuidar mejor cada etapa.",
      text: "Consulta áreas de atención, prepara tu visita y encuentra una forma directa de comunicarte con el equipo veterinario.",
      primary: "Conocer atención",
      secondary: "Orientarme antes de escribir",
      note: "Concepto demostrativo para atención de perros y gatos."
    },
    quick: ["Perros y gatos", "Consulta general", "Prevención", "Seguimiento"],
    serviceIntro: "El sitio organiza la información antes del contacto para reducir dudas frecuentes sin reemplazar una valoración veterinaria.",
    services: [
      "Consulta general",
      "Medicina preventiva",
      "Vacunación",
      "Desparasitación",
      "Seguimiento clínico",
      "Estudios básicos",
      "Orientación nutricional",
      "Procedimientos ambulatorios sujetos a valoración"
    ],
    stages: [
      ["Primeros meses", "Registro de antecedentes, esquema preventivo y preparación de visita inicial."],
      ["Etapa adulta", "Controles, prevención y seguimiento de cambios reportados por el tutor."],
      ["Etapa senior", "Revisiones periódicas y conversación responsable sobre hábitos y bienestar."]
    ],
    advisorTitle: "Orientador de consulta",
    advisorIntro: "Selecciona el motivo principal. La respuesta solo ordena la información que conviene compartir; no emite diagnóstico.",
    advisorOptions: [
      ["Primera consulta", "Comparte edad aproximada, especie, motivo de visita y si existe información previa relevante."],
      ["Prevención o vacunación", "Ten a la mano antecedentes, cartilla si existe y dudas sobre tiempos o requisitos."],
      ["Seguimiento", "Describe qué cambió desde la última visita y qué indicaciones previas recibió el paciente."],
      ["Revisión de rutina", "Indica especie, edad aproximada, hábitos generales y el horario en que podrías acudir."],
      ["Tengo una duda", "Resume la duda con contexto. El equipo confirmaría si requiere consulta presencial."],
      ["No sé por dónde empezar", "Cuenta qué observaste, desde cuándo y si el animal come, bebe o descansa distinto."]
    ],
    processTitle: "Primera visita",
    process: ["Describe el motivo sin autodiagnóstico.", "Comparte antecedentes si los tienes.", "Confirma horario y condiciones de atención.", "Acude con transportadora o correa según corresponda."],
    faq: [
      ["¿El sitio atiende urgencias?", "No se promete urgencia. En un proyecto real se mostraría el protocolo confirmado por el negocio."],
      ["¿Puedo recibir diagnóstico desde la web?", "No. La página solo ordena información previa al contacto."],
      ["¿Se muestran precios?", "Solo si el negocio los aprueba y mantiene actualizados."]
    ],
    ctaTitle: "Una página veterinaria que reduce dudas antes del primer mensaje.",
    representedFeatures: ["Servicios ordenados", "Cuidado por etapas", "Orientador responsable", "FAQ", "CTA NEXO26"],
    scores: [9.1, 8.8, 8.9, 8.8, 8.7, 8.8, 9.2, 9.0, 8.9, 8.8]
  },
  {
    id: "arco-claro-dental",
    slug: "arco-claro-dental",
    name: "Arco Claro",
    descriptor: "Clínica Dental",
    industry: "Dental",
    category: "Salud",
    packageKey: "profesional",
    type: "Concepto base",
    tagline: "Atención dental explicada sin presión.",
    layout: "dental-map",
    palette: {
      paper: "#F3F8F8",
      surface: "#FFFFFF",
      ink: "#203033",
      muted: "#5D6F73",
      accent: "#206A73",
      support: "#A6C9C7",
      warm: "#D7A86E",
      wash: "#E2EFEF"
    },
    font: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
    nav: ["Tratamientos", "Visita", "Orientador", "Contacto"],
    hero: {
      eyebrow: "VALORACIÓN · PREVENCIÓN · SEGUIMIENTO",
      title: "Una ruta simple para entender tu próxima visita dental.",
      text: "Presenta tratamientos, preparación de la primera consulta y preguntas frecuentes con un tono responsable y sin promesas clínicas.",
      primary: "Ver tratamientos",
      secondary: "Preparar mi visita",
      note: "Concepto demostrativo; no sustituye valoración profesional."
    },
    quick: ["Valoración inicial", "Prevención", "Tratamientos", "Preguntas claras"],
    serviceIntro: "La arquitectura prioriza confianza: primero explica el alcance, después prepara la consulta y finalmente facilita contacto.",
    services: ["Valoración inicial", "Limpieza dental", "Prevención", "Resinas sujetas a valoración", "Blanqueamiento sujeto a valoración", "Ortodoncia informativa", "Revisión infantil sujeta a confirmación", "Seguimiento"],
    stages: [
      ["Antes", "Reúne dudas, antecedentes relevantes y confirma si necesitas estudios previos."],
      ["Durante", "La clínica explicaría opciones y alcance después de revisar el caso."],
      ["Después", "El seguimiento se comunica con indicaciones aprobadas por el equipo profesional."]
    ],
    advisorTitle: "Orientador dental",
    advisorIntro: "Elige un tema para saber qué información preparar antes de escribir.",
    advisorOptions: [
      ["Primera valoración", "Comparte motivo de consulta, disponibilidad y si ya tienes estudios recientes."],
      ["Limpieza", "Pregunta por requisitos, duración estimada y recomendaciones previas confirmadas por la clínica."],
      ["Ortodoncia", "Solicita valoración. No se define tratamiento sin revisión presencial."],
      ["Molestia dental", "Describe cuándo empezó y evita automedicarte. El equipo indicaría el siguiente paso."],
      ["Niñas o niños", "Confirma edad, motivo de visita y acompañamiento requerido."],
      ["Solo información", "Pregunta por servicios disponibles, horarios y proceso de primera visita."]
    ],
    processTitle: "Primera consulta",
    process: ["Selecciona motivo principal.", "Comparte estudios si existen.", "Pregunta por duración y requisitos.", "Confirma el canal oficial de seguimiento."],
    faq: [
      ["¿La página diagnostica?", "No. Evita diagnósticos y clasificaciones clínicas automáticas."],
      ["¿Se pueden mostrar precios?", "Sí, solo si la clínica los aprueba y mantiene actualizados."],
      ["¿Incluye reservación?", "No en el alcance base representado; puede cotizarse como integración."]
    ],
    ctaTitle: "Una clínica dental puede explicar sin saturar ni presionar.",
    representedFeatures: ["Tratamientos", "Primera consulta", "Orientador", "FAQ", "Contacto demostrativo"],
    scores: [9.0, 8.8, 8.9, 8.7, 8.7, 8.8, 9.0, 9.1, 8.9, 8.8]
  },
  {
    id: "casa-brasa-restaurante",
    slug: "casa-brasa-restaurante",
    name: "Casa Brasa",
    descriptor: "Cocina",
    industry: "Restaurante",
    category: "Restaurantes",
    packageKey: "medida",
    type: "Concepto base",
    tagline: "Mesa, fuego y decisión rápida.",
    layout: "restaurant-board",
    palette: {
      paper: "#F7F1E7",
      surface: "#FFFDFC",
      ink: "#2B211C",
      muted: "#6B5C52",
      accent: "#7E2F24",
      support: "#C58A4B",
      warm: "#24514A",
      wash: "#E8D3B7"
    },
    font: '"Georgia", "Times New Roman", serif',
    nav: ["Carta", "Mesa", "Experiencia", "Contacto"],
    hero: {
      eyebrow: "COCINA A LA BRASA · MENÚ · GRUPOS",
      title: "Un restaurante se decide por antojo, claridad y confianza.",
      text: "Tres rutas ayudan a revisar la propuesta, explorar un menú demostrativo y entender opciones para visitas o grupos.",
      primary: "Ver carta",
      secondary: "Planear visita",
      note: "Concepto demostrativo. Platillos, precios y disponibilidad son ficticios."
    },
    quick: ["Carta demostrativa", "Grupos", "Horarios por configurar", "Tres rutas"],
    serviceIntro: "El concepto muestra un sitio más amplio: página principal, menú buscable y experiencia para grupos sin simular reservas reales.",
    services: ["Parrilla", "Entradas", "Vegetales a la brasa", "Postres", "Bebidas sin alcohol", "Grupos", "Celebraciones", "Menú de temporada demostrativo"],
    stages: [
      ["1. Elegir ocasión", "Comida casual, cena tranquila o grupo pequeño."],
      ["2. Revisar carta", "Buscar por categoría, intensidad y tipo de platillo."],
      ["3. Contactar", "El negocio confirmaría disponibilidad por su canal oficial."]
    ],
    advisorTitle: "Explorador de ocasión",
    advisorIntro: "Elige el motivo de visita para ordenar la información que conviene mostrar.",
    advisorOptions: [
      ["Cena tranquila", "Prioriza carta corta, horario, ubicación y ambiente."],
      ["Grupo pequeño", "Muestra condiciones, espacio sugerido y contacto para confirmar."],
      ["Celebración", "Presenta opciones de experiencia sin prometer disponibilidad automática."],
      ["Solo revisar menú", "Lleva al menú demostrativo con filtros simples."]
    ],
    processTitle: "Ruta de visita",
    process: ["Explorar concepto.", "Revisar carta demostrativa.", "Consultar condiciones para grupos.", "Escribir para confirmar disponibilidad."],
    faq: [
      ["¿Hay reservación real?", "No. La demo solo muestra cómo se integraría el flujo."],
      ["¿Los precios son reales?", "No. Todo producto y precio visible es demostrativo."],
      ["¿Incluye varias páginas?", "Sí, representa NEXO A Medida con rutas de menú y experiencia."]
    ],
    ctaTitle: "Una página de restaurante debe abrir el apetito y resolver dudas prácticas.",
    representedFeatures: ["Inicio", "Menú", "Experiencia", "Filtros", "CTA NEXO26"],
    scores: [9.2, 8.9, 9.0, 8.9, 8.8, 8.9, 9.3, 9.1, 9.0, 8.9]
  },
  {
    id: "ritmo-base-entrenamiento",
    slug: "ritmo-base-entrenamiento",
    name: "Ritmo Base",
    descriptor: "Entrenamiento",
    industry: "Gimnasio",
    category: "Fitness",
    packageKey: "profesional",
    type: "Concepto base",
    tagline: "Entrena con estructura, no con promesas.",
    layout: "fitness-grid",
    palette: {
      paper: "#F2F4EE",
      surface: "#FFFFFF",
      ink: "#17201B",
      muted: "#59665F",
      accent: "#233D31",
      support: "#8EA65D",
      warm: "#D6B24A",
      wash: "#DCE5D6"
    },
    font: '"Arial", "Helvetica Neue", system-ui, sans-serif',
    nav: ["Modalidades", "Horarios", "Primera visita", "Contacto"],
    hero: {
      eyebrow: "FUERZA · MOVILIDAD · CONSTANCIA",
      title: "Entrenamiento claro para saber cómo empezar.",
      text: "Organiza modalidades, horarios demostrativos y una primera visita responsable sin prometer resultados físicos.",
      primary: "Ver modalidades",
      secondary: "Elegir punto de inicio",
      note: "Concepto demostrativo sin recomendaciones físicas personalizadas."
    },
    quick: ["Fuerza", "Movilidad", "Cardio", "Primera visita"],
    serviceIntro: "La página evita ideales corporales y centra la conversión en orientación, horarios y claridad de modalidades.",
    services: ["Entrenamiento de fuerza", "Acondicionamiento", "Movilidad", "Clase funcional", "Entrenamiento personal sujeto a confirmación", "Evaluación inicial informativa", "Horarios", "Acompañamiento de inicio"],
    stages: [
      ["Explora modalidades", "Compara intensidad, formato y objetivo general."],
      ["Elige horario", "Consulta bloques demostrativos sin reservar automáticamente."],
      ["Primera visita", "El negocio confirmaría requisitos y acompañamiento inicial."]
    ],
    advisorTitle: "Selector de inicio",
    advisorIntro: "Elige qué buscas organizar. No genera rutina ni recomendación médica.",
    advisorOptions: [
      ["Quiero empezar", "Conviene mostrar modalidades básicas, horarios y cómo será la primera visita."],
      ["Busco fuerza", "La página explicaría formatos disponibles sin prometer cambios físicos."],
      ["Prefiero grupo", "Presenta clases, cupos sujetos a confirmación y dinámica general."],
      ["Tengo dudas", "Ordena preguntas sobre horarios, requisitos y qué llevar."]
    ],
    processTitle: "Primera visita",
    process: ["Revisa modalidades.", "Pregunta por horario disponible.", "Confirma requisitos.", "Asiste sin compromiso de plan automático."],
    faq: [
      ["¿La demo promete resultados?", "No. No muestra antes/después ni garantías físicas."],
      ["¿Hay reservas?", "No en esta demo. Se puede cotizar una integración."],
      ["¿Los horarios son reales?", "No. Son bloques demostrativos para mostrar estructura."]
    ],
    ctaTitle: "Un gimnasio puede vender estructura sin caer en promesas vacías.",
    representedFeatures: ["Modalidades", "Horarios", "Primera visita", "Selector", "FAQ"],
    scores: [9.0, 8.8, 8.8, 8.7, 8.8, 8.7, 9.1, 8.9, 8.9, 8.8]
  },
  {
    id: "foco-vivo-optica",
    slug: "foco-vivo-optica",
    name: "Foco Vivo",
    descriptor: "Óptica",
    industry: "Óptica",
    category: "Comercio",
    packageKey: "profesional",
    type: "Concepto base",
    tagline: "Elige armazón con información, no con presión.",
    layout: "optical-studio",
    palette: {
      paper: "#F4F2EC",
      surface: "#FFFFFF",
      ink: "#222532",
      muted: "#626777",
      accent: "#283C78",
      support: "#77A9A5",
      warm: "#C99C47",
      wash: "#E5EAF3"
    },
    font: '"Aptos", "Segoe UI", system-ui, sans-serif',
    nav: ["Servicios", "Estilos", "Proceso", "Contacto"],
    hero: {
      eyebrow: "ARMAZONES · LENTES · AJUSTES",
      title: "Una óptica organizada para comparar antes de visitar.",
      text: "Muestra servicios, estilos de armazón y proceso de atención sin usar rostros, marcas ni recomendaciones basadas en apariencia personal.",
      primary: "Explorar estilos",
      secondary: "Ver servicios",
      note: "Nombre e identidad ficticios utilizados exclusivamente con fines demostrativos."
    },
    quick: ["Armazones", "Lentes graduados", "Ajustes", "Examen sujeto a confirmación"],
    serviceIntro: "La experiencia se apoya en comparación de materiales, uso y mantenimiento, no en marcas ni fotos de personas.",
    services: ["Armazones", "Lentes graduados", "Lentes de sol", "Examen visual sujeto a confirmación", "Ajustes", "Mantenimiento", "Accesorios", "Atención infantil sujeta a confirmación"],
    stages: [
      ["Revisar estilos", "Comparar peso visual, material demostrativo y uso."],
      ["Confirmar servicio", "Identificar si necesitas examen, ajuste o lentes."],
      ["Visitar óptica", "El negocio confirma disponibilidad y proceso real."]
    ],
    advisorTitle: "Explorador de estilos",
    advisorIntro: "Compara estilos por uso y mantenimiento. No evalúa tu rostro ni indica qué te favorece.",
    advisorOptions: [
      ["Clásico", "Armazón de lectura comercial, sobrio y fácil de mantener."],
      ["Ligero", "Opción pensada para comodidad y uso prolongado."],
      ["Contemporáneo", "Mayor presencia visual sin depender de marcas."],
      ["Deportivo", "Enfoque en actividad y resistencia sujeta a material real."],
      ["Minimalista", "Baja presencia visual, lectura limpia y mantenimiento sencillo."]
    ],
    processTitle: "Proceso de atención",
    process: ["Define si buscas lente, armazón o ajuste.", "Consulta disponibilidad de examen.", "Compara estilos y mantenimiento.", "Confirma visita por el canal del negocio."],
    faq: [
      ["¿La demo usa marcas?", "No. Los armazones son SVG originales y ficticios."],
      ["¿Recomienda por forma de rostro?", "No. Evita capturar o clasificar apariencia personal."],
      ["¿Los precios son reales?", "No. Esta demo no muestra precios de producto."]
    ],
    ctaTitle: "Una óptica puede vender claridad antes de vender monturas.",
    representedFeatures: ["Servicios", "Explorador", "Proceso", "FAQ", "Contacto"],
    scores: [9.1, 8.8, 8.8, 8.9, 8.7, 8.8, 9.2, 9.0, 8.8, 8.8]
  },
  {
    id: "casa-lote-tienda",
    slug: "casa-lote-tienda",
    name: "Casa Lote",
    descriptor: "Objetos y Regalos",
    industry: "Tienda",
    category: "Comercio",
    packageKey: "tienda",
    type: "Concepto base",
    tagline: "Una tienda pequeña también merece una compra clara.",
    layout: "shop-catalog",
    palette: {
      paper: "#F4EFE5",
      surface: "#FFFDF8",
      ink: "#282A27",
      muted: "#6A655D",
      accent: "#8C5543",
      support: "#899078",
      warm: "#B86E50",
      wash: "#D9C9B3"
    },
    font: '"Verdana", "Segoe UI", system-ui, sans-serif',
    nav: ["Catálogo", "Carrito", "Entrega", "Contacto"],
    hero: {
      eyebrow: "10 PRODUCTOS · 3 CATEGORÍAS · CHECKOUT SIMULADO",
      title: "Compra demostrativa, clara y sin procesar pagos.",
      text: "Un catálogo inicial con filtros, búsqueda, carrito persistente, resumen y checkout simulado para revisar el alcance de NEXO Tienda Inicial.",
      primary: "Explorar productos",
      secondary: "Ver carrito",
      note: "Productos y precios demostrativos."
    },
    quick: ["10 productos", "3 categorías", "Carrito", "Checkout simulado"],
    serviceIntro: "La tienda demuestra operación inicial: productos simples, una variante, subtotal y entrega sin tarifas reales.",
    services: ["Hogar", "Escritorio", "Regalos", "Búsqueda", "Carrito", "Cantidades", "Entrega", "Checkout simulado"],
    stages: [
      ["1. Explorar", "Busca por nombre o filtra por categoría."],
      ["2. Agregar", "El carrito guarda cantidades en localStorage."],
      ["3. Continuar", "El checkout informa que en un proyecto final se conectaría una plataforma de pago."]
    ],
    advisorTitle: "Catálogo demostrativo",
    advisorIntro: "Productos y precios ficticios. No se procesa pago ni se solicitan datos sensibles.",
    advisorOptions: [],
    processTitle: "Flujo de compra",
    process: ["Filtrar o buscar.", "Añadir productos.", "Elegir entrega demostrativa.", "Continuar a checkout simulado."],
    faq: [
      ["¿Hay pago real?", "No. El checkout solo explica la conexión futura."],
      ["¿Se piden tarjetas?", "No se solicitan tarjeta, CVV, contraseña ni datos bancarios."],
      ["¿Cuántos productos representa?", "Exactamente 10 productos simples en 3 categorías."]
    ],
    products: [
      ["Vaso Rizo", "Hogar", 180, "Vaso cerámico demostrativo para mesa diaria."],
      ["Charola Línea", "Hogar", 260, "Charola pequeña para llaves o accesorios."],
      ["Paño Casa", "Hogar", 140, "Textil decorativo de uso demostrativo."],
      ["Libreta Punto", "Escritorio", 120, "Libreta sencilla para notas y listas."],
      ["Portalápiz Lote", "Escritorio", 190, "Organizador compacto de escritorio."],
      ["Clip Set", "Escritorio", 90, "Set de clips decorativos ficticios."],
      ["Bolsa Calma", "Regalos", 220, "Bolsa de regalo reutilizable demostrativa."],
      ["Tarjeta Abrazo", "Regalos", 60, "Tarjeta ilustrada para mensaje breve."],
      ["Mini Florero", "Hogar", 240, "Objeto pequeño para repisa o mesa."],
      ["Caja Sorpresa", "Regalos", 320, "Combinación ficticia de detalle listo para regalar."]
    ],
    ctaTitle: "Una tienda inicial debe hacer fácil entender, agregar y continuar.",
    representedFeatures: ["10 productos", "3 categorías", "Carrito", "localStorage", "Checkout simulado"],
    scores: [9.0, 8.9, 8.9, 8.8, 8.7, 8.9, 9.1, 8.9, 9.0, 8.8]
  },
  {
    id: "clima-claro-servicio",
    slug: "clima-claro-servicio",
    name: "Clima Claro",
    descriptor: "Instalación y Mantenimiento",
    industry: "Servicio técnico",
    category: "Servicios",
    packageKey: "esencial",
    type: "Concepto base",
    tagline: "Información clara antes de solicitar servicio.",
    layout: "service-diagram",
    palette: {
      paper: "#F5F4EF",
      surface: "#FFFFFF",
      ink: "#252B2B",
      muted: "#65706F",
      accent: "#19414A",
      support: "#BFD7D9",
      warm: "#D7A53E",
      wash: "#E7ECEA"
    },
    font: '"Segoe UI", "Tahoma", system-ui, sans-serif',
    nav: ["Servicios", "Cobertura", "Proceso", "Contacto"],
    hero: {
      eyebrow: "INSTALACIÓN · MANTENIMIENTO · DIAGNÓSTICO",
      title: "Información clara antes de solicitar servicio.",
      text: "Consulta servicios, cobertura y forma de atención desde una sola vista sin mapas reales, precios automáticos ni diagnósticos.",
      primary: "Ver servicios",
      secondary: "Solicitar información",
      note: "Concepto NEXO Esencial con alcance de una vista."
    },
    quick: ["Una vista", "6 servicios", "Cobertura demostrativa", "Sin dominio incluido"],
    serviceIntro: "El diseño prioriza lo práctico: qué hace, dónde atiende y qué información conviene compartir antes de pedir servicio.",
    services: ["Instalación", "Mantenimiento", "Diagnóstico inicial", "Limpieza", "Reparación", "Atención comercial"],
    stages: [
      ["Zona principal", "Área base de atención demostrativa."],
      ["Zona extendida", "Atención sujeta a confirmación."],
      ["Cobertura", "No se usa mapa ni coordenadas reales."]
    ],
    advisorTitle: "Constructor de mensaje",
    advisorIntro: "Ordena tu solicitud sin dirección exacta, cotización ni diagnóstico automático.",
    advisorOptions: [
      ["Instalación", "Comparte tipo de inmueble, zona general y horario preferido."],
      ["Mantenimiento", "Indica cantidad de equipos y zona general, sin datos sensibles."],
      ["Diagnóstico", "Describe el síntoma de forma simple. El negocio confirmaría revisión."],
      ["Limpieza", "Indica equipo aproximado y disponibilidad general."],
      ["Reparación", "Cuenta qué observaste sin abrir equipo ni manipularlo."],
      ["Atención comercial", "Pregunta por alcance y condiciones antes de cotizar."]
    ],
    processTitle: "Proceso",
    process: ["Describe el servicio.", "Comparte zona general.", "Indica tipo de inmueble.", "Recibe orientación inicial por el canal del negocio."],
    faq: [
      ["¿Calcula precio?", "No. Evita cotización automática."],
      ["¿Da diagnóstico?", "No. Solo organiza la solicitud."],
      ["¿Incluye dominio?", "No en NEXO Esencial. Dominio propio puede cotizarse aparte."]
    ],
    ctaTitle: "Un servicio local puede verse claro desde una sola página.",
    representedFeatures: ["5 secciones", "6 servicios", "Cobertura", "Constructor", "Contacto"],
    scores: [9.0, 8.8, 8.8, 8.7, 8.8, 8.8, 9.0, 9.0, 9.2, 8.8]
  }
].map((concept) => ({
  ...concept,
  package: packageScopes[concept.packageKey]
}));

function brandSvg(concept) {
  const c = concept.palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img" aria-labelledby="title">
  <title>${esc(concept.name)} brand mark</title>
  <rect width="160" height="160" rx="28" fill="${c.paper}"/>
  <path d="M34 104c22-52 70-52 92 0" fill="none" stroke="${c.accent}" stroke-width="10" stroke-linecap="round"/>
  <path d="M46 78h68M56 56h48M68 36h24" fill="none" stroke="${c.support}" stroke-width="8" stroke-linecap="round"/>
  <circle cx="80" cy="104" r="13" fill="${c.warm}"/>
</svg>`;
}

function primaryIllustration(concept) {
  const c = concept.palette;
  const motif = {
    "clinical-editorial": `<path d="M86 86c-18-24-44-20-54-2 11 14 28 18 48 8 12 15 31 20 54 8-9-22-33-28-48-14Z" fill="${c.wash}" stroke="${c.accent}" stroke-width="3"/><path d="M44 120c28-8 56-8 84 0" stroke="${c.support}" stroke-width="5" stroke-linecap="round"/>`,
    "dental-map": `<path d="M46 68c8-27 57-27 68 0 9 22-2 55-16 69-8-10-12-27-18-27s-10 17-18 27C48 123 37 90 46 68Z" fill="${c.wash}" stroke="${c.accent}" stroke-width="3"/><path d="M54 70c18-10 35-10 52 0" stroke="${c.support}" stroke-width="5" stroke-linecap="round"/>`,
    "restaurant-board": `<path d="M34 104h92v16H34z" fill="${c.accent}"/><path d="M48 104c-2-22 15-36 32-45 17 9 34 23 32 45" fill="${c.wash}" stroke="${c.warm}" stroke-width="4"/><path d="M68 90c10-13 13-24 12-38 13 15 19 25 12 38" fill="${c.warm}"/>`,
    "fitness-grid": `<path d="M42 106h76M42 82h76M42 58h76" stroke="${c.accent}" stroke-width="9" stroke-linecap="round"/><path d="M56 44v78M80 44v78M104 44v78" stroke="${c.support}" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="82" r="15" fill="${c.warm}"/>`,
    "optical-studio": `<path d="M34 82h30c7 0 13 6 13 13s-6 13-13 13H52c-14 0-25-11-25-26s11-26 25-26h12c7 0 13 6 13 13" fill="none" stroke="${c.accent}" stroke-width="8" stroke-linecap="round"/><path d="M126 82H96c-7 0-13 6-13 13s6 13 13 13h12c14 0 25-11 25-26s-11-26-25-26H96c-7 0-13 6-13 13" fill="none" stroke="${c.support}" stroke-width="8" stroke-linecap="round"/><path d="M77 82h6" stroke="${c.warm}" stroke-width="8" stroke-linecap="round"/>`,
    "shop-catalog": `<rect x="34" y="42" width="36" height="36" rx="8" fill="${c.wash}" stroke="${c.accent}" stroke-width="3"/><rect x="88" y="42" width="36" height="36" rx="8" fill="${c.surface}" stroke="${c.support}" stroke-width="3"/><rect x="34" y="96" width="36" height="36" rx="8" fill="${c.surface}" stroke="${c.support}" stroke-width="3"/><rect x="88" y="96" width="36" height="36" rx="8" fill="${c.wash}" stroke="${c.accent}" stroke-width="3"/><path d="M52 60h54M52 114h54" stroke="${c.warm}" stroke-width="5" stroke-linecap="round"/>`,
    "service-diagram": `<path d="M30 72h54c18 0 18-28 0-28-11 0-16 7-17 14" fill="none" stroke="${c.accent}" stroke-width="7" stroke-linecap="round"/><path d="M42 100h76c24 0 24 34 0 34-12 0-19-7-21-17" fill="none" stroke="${c.support}" stroke-width="7" stroke-linecap="round"/><path d="M48 132h36" stroke="${c.warm}" stroke-width="7" stroke-linecap="round"/>`
  }[concept.layout];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img" aria-labelledby="title">
  <title>${esc(concept.name)} illustration</title>
  <rect width="160" height="160" rx="18" fill="${c.surface}"/>
  ${motif}
</svg>`;
}

function socialPreview(concept) {
  const c = concept.palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title>${esc(concept.name)} ${esc(concept.descriptor)}</title>
  <desc>Vista previa social demostrativa de ${esc(concept.name)}.</desc>
  <rect width="1200" height="630" fill="${c.paper}"/>
  <rect x="64" y="64" width="1072" height="502" rx="24" fill="${c.surface}" stroke="${c.accent}" stroke-width="4"/>
  <text x="104" y="155" fill="${c.accent}" font-size="36" font-family="Arial, sans-serif" font-weight="700">${esc(concept.type)} · ${esc(concept.package.packageName)}</text>
  <text x="104" y="275" fill="${c.ink}" font-size="86" font-family="Arial, sans-serif" font-weight="800">${esc(concept.name)}</text>
  <text x="104" y="350" fill="${c.muted}" font-size="44" font-family="Arial, sans-serif">${esc(concept.descriptor)}</text>
  <text x="104" y="460" fill="${c.ink}" font-size="34" font-family="Arial, sans-serif">${esc(concept.tagline)}</text>
  <circle cx="980" cy="320" r="104" fill="${c.wash}"/>
  <path d="M900 330c40-82 122-82 162 0" fill="none" stroke="${c.accent}" stroke-width="18" stroke-linecap="round"/>
  <path d="M925 280h112M950 236h62" stroke="${c.support}" stroke-width="14" stroke-linecap="round"/>
</svg>`;
}

function configJs(concept) {
  const scope = concept.package;
  return `window.DEMO_CONFIG = ${jsString({
    id: concept.id,
    slug: concept.slug,
    brandName: `${concept.name} ${concept.descriptor}`,
    descriptor: concept.descriptor,
    tagline: concept.tagline,
    industry: concept.industry,
    category: concept.category,
    conceptType: concept.type,
    packageName: scope.packageName,
    packagePrice: scope.packagePrice,
    demoMode: true,
    status: "draft",
    published: false,
    featured: false,
    businessWhatsapp: "",
    businessDisplayPhone: "",
    businessEmail: "",
    businessAddress: "",
    businessZone: "",
    businessSchedule: "",
    businessInstagram: "",
    businessFacebook: "",
    businessMapUrl: "",
    nexoSiteUrl: `../../?utm_source=demo&utm_medium=referral&utm_campaign=${concept.slug}`,
    nexoWhatsappUrl: nexoWhatsapp,
    contextualMessage: `Hola, quiero una solución similar al concepto ${concept.name} para un negocio de ${concept.industry}.`,
    packageScope: {
      sections: scope.sections,
      services: scope.services,
      revisions: scope.revisions,
      publication: "12 meses",
      delivery: scope.delivery,
      payment: scope.payment,
      domain: scope.domain
    },
    representedFeatures: concept.representedFeatures,
    notIncluded: scope.notIncluded,
    commercialNotice: "Nombre, identidad, contenidos y datos utilizados exclusivamente con fines demostrativos. El alcance final depende de materiales, aprobación y configuración real del negocio."
  })};`;
}

function css(concept) {
  const p = concept.palette;
  return `:root {
  --paper: ${p.paper};
  --surface: ${p.surface};
  --ink: ${p.ink};
  --muted: ${p.muted};
  --accent: ${p.accent};
  --support: ${p.support};
  --warm: ${p.warm};
  --wash: ${p.wash};
  --line: color-mix(in srgb, var(--ink) 18%, transparent);
  --radius: 8px;
  --max: 1180px;
  --font: ${concept.font};
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-width: 0;
  overflow-x: hidden;
  color: var(--ink);
  background: var(--paper);
  font-family: var(--font);
  line-height: 1.55;
}
body.nav-open { overflow: hidden; }
a { color: inherit; text-decoration: none; }
button, input, select { font: inherit; }
button { cursor: pointer; }
img, svg { max-width: 100%; display: block; }
:focus-visible { outline: 3px solid var(--warm); outline-offset: 3px; }
.skip-link { position: fixed; top: 12px; left: 12px; z-index: 300; transform: translateY(-150%); background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 10px 12px; font-weight: 800; }
.skip-link:focus { transform: translateY(0); }
.site-header { position: sticky; top: 42px; z-index: 70; background: color-mix(in srgb, var(--paper) 92%, transparent); border-bottom: 1px solid var(--line); backdrop-filter: blur(16px); }
.nav-shell { width: min(100% - 28px, var(--max)); margin-inline: auto; min-height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.brand { min-height: 44px; display: inline-flex; align-items: center; gap: 10px; font-weight: 900; }
.brand img { width: 38px; height: 38px; border-radius: var(--radius); }
.brand span { display: grid; line-height: 1.05; }
.brand small { color: var(--muted); font-weight: 700; }
.menu-toggle { min-width: 44px; min-height: 44px; display: none; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); color: var(--ink); font-weight: 900; }
.site-nav { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.site-nav a { min-height: 44px; display: inline-flex; align-items: center; padding: 8px 10px; border-radius: var(--radius); color: var(--muted); font-weight: 800; }
.site-nav a:hover, .site-nav a:focus-visible { color: var(--ink); background: var(--wash); }
.section { padding: clamp(44px, 7vw, 86px) 0; }
.section-shell { width: min(100% - 28px, var(--max)); margin-inline: auto; }
.hero { padding: clamp(52px, 8vw, 94px) 0 42px; border-bottom: 1px solid var(--line); }
.hero-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 34px; align-items: center; }
.hero-grid > *, .split > *, .contact-grid > *, .catalog-layout > *, .panel-grid > *, .timeline > *, .faq-grid > * { min-width: 0; }
.eyebrow { margin: 0 0 12px; color: var(--accent); font-size: .78rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; overflow-wrap: anywhere; }
h1, h2, h3, p { margin-top: 0; }
h1 { max-width: 820px; margin-bottom: 18px; font-size: 2.65rem; line-height: 1; letter-spacing: 0; overflow-wrap: break-word; }
h2 { font-size: 2rem; line-height: 1.05; letter-spacing: 0; overflow-wrap: break-word; }
h3 { font-size: 1.08rem; line-height: 1.2; }
.lead, .hero-text { max-width: 760px; color: var(--muted); font-size: 1.06rem; }
.hero-actions, .actions, .cta-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.button { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--radius); border: 1px solid var(--line); padding: 10px 14px; font-weight: 900; text-align: center; }
.button.primary { background: var(--accent); color: var(--surface); border-color: var(--accent); }
.button.ghost { background: var(--surface); color: var(--ink); }
.hero-note, .disclaimer { color: var(--muted); font-size: .94rem; }
.hero-visual { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: clamp(16px, 3vw, 28px); }
.hero-visual img { width: min(100%, 420px); margin-inline: auto; }
.info-rail { display: grid; gap: 8px; margin-top: 28px; }
.info-rail span { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: 10px 12px; font-weight: 850; }
.split { display: grid; gap: 28px; align-items: start; }
.section-head { max-width: 780px; margin-bottom: 22px; }
.service-list { display: grid; gap: 10px; counter-reset: service; }
.service-list li { list-style: none; counter-increment: service; display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: start; border-bottom: 1px solid var(--line); padding: 14px 0; font-weight: 850; }
.service-list li::before { content: counter(service, decimal-leading-zero); color: var(--accent); font-weight: 950; }
.panel-grid, .timeline, .faq-grid { display: grid; gap: 14px; }
.panel, .step, .faq-item, .advisor-result, .product-card, .cart-panel, .menu-item { border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); padding: 18px; }
.step strong { display: block; margin-bottom: 6px; color: var(--accent); }
.advisor { border-top: 4px solid var(--accent); background: var(--surface); border-radius: var(--radius); padding: clamp(18px, 3vw, 28px); }
.choice-grid { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
.choice-grid button, .filter-row button { min-height: 44px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--paper); color: var(--ink); padding: 10px 12px; font-weight: 850; }
.choice-grid button[aria-pressed="true"], .filter-row button[aria-pressed="true"] { background: var(--accent); color: var(--surface); border-color: var(--accent); }
.advisor-result { min-height: 112px; outline: none; }
.contact-band { border-block: 1px solid var(--line); background: var(--surface); }
.contact-grid { display: grid; gap: 18px; align-items: start; }
.contact-list { display: grid; gap: 8px; padding: 0; margin: 0; list-style: none; color: var(--muted); }
.nexo-cta { background: var(--ink); color: var(--surface); }
.nexo-cta .lead, .nexo-cta .eyebrow { color: color-mix(in srgb, var(--surface) 78%, transparent); }
.nexo-cta .button.primary { background: var(--warm); border-color: var(--warm); color: var(--ink); }
.nexo-cta .button.ghost { background: transparent; color: var(--surface); border-color: color-mix(in srgb, var(--surface) 38%, transparent); }
.site-footer { border-top: 1px solid var(--line); padding: 28px 0; color: var(--muted); }
.footer-shell { width: min(100% - 28px, var(--max)); margin-inline: auto; display: grid; gap: 10px; }
.catalog-layout { display: grid; gap: 18px; }
.filter-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.catalog-grid { display: grid; gap: 14px; }
.product-card { display: grid; gap: 10px; }
.product-card svg { width: 100%; aspect-ratio: 1.35; border: 1px solid var(--line); border-radius: var(--radius); background: var(--paper); }
.product-card button { width: 100%; }
.cart-lines { display: grid; gap: 8px; margin: 12px 0; }
.cart-line { display: grid; gap: 8px; border-bottom: 1px solid var(--line); padding-bottom: 8px; }
.cart-line-controls { display: grid; grid-template-columns: 44px minmax(28px, auto) 44px minmax(0, 1fr); gap: 8px; align-items: center; }
.cart-line-controls button { min-width: 44px; min-height: 44px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--paper); }
.cart-line-controls [data-remove] { min-width: 0; padding-inline: 10px; }
.cart-total { display: flex; justify-content: space-between; gap: 12px; font-size: 1.15rem; font-weight: 950; }
.menu-tools { display: grid; gap: 12px; margin-bottom: 16px; }
.menu-tools input { min-height: 46px; border: 1px solid var(--line); border-radius: var(--radius); padding: 10px 12px; background: var(--surface); color: var(--ink); }
.menu-grid { display: grid; gap: 12px; }
.menu-item h3 { display: flex; justify-content: space-between; gap: 10px; }
.status-note { border-left: 4px solid var(--warm); background: var(--surface); padding: 12px 14px; border-radius: var(--radius); color: var(--muted); }
body.clinical-editorial .service-list { max-width: 900px; }
body.dental-map .timeline { grid-template-columns: 1fr; }
body.restaurant-board .hero { background: linear-gradient(90deg, var(--paper) 0 62%, var(--wash) 62%); }
body.fitness-grid .service-list { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
body.fitness-grid .service-list li { border: 1px solid var(--line); border-radius: var(--radius); padding: 16px; background: var(--surface); }
body.optical-studio .panel-grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
body.shop-catalog .hero-grid { align-items: start; }
body.service-diagram .timeline .step { display: grid; grid-template-columns: auto 1fr; gap: 14px; }
body.service-diagram .timeline .step::before { content: ""; width: 12px; height: 100%; min-height: 56px; background: var(--support); border-radius: 999px; }
@media (min-width: 760px) {
  .hero-grid, .split, .contact-grid, .catalog-layout { grid-template-columns: minmax(0, 1.05fr) minmax(280px, .95fr); }
  .info-rail { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .timeline, .faq-grid, .panel-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .catalog-grid, .menu-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  h1 { font-size: 4rem; }
  h2 { font-size: 2.55rem; }
  .lead, .hero-text { font-size: 1.12rem; }
}
@media (min-width: 1120px) {
  .catalog-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  h1 { font-size: 5.2rem; }
  h2 { font-size: 3.1rem; }
  .lead, .hero-text { font-size: 1.18rem; }
}
@media (max-width: 820px) {
  .site-header { top: 112px; }
  .menu-toggle { display: inline-flex; align-items: center; justify-content: center; }
  .site-nav { position: fixed; inset: calc(112px + 68px) 0 auto 0; display: none; padding: 14px; background: var(--surface); border-bottom: 1px solid var(--line); }
  body.nav-open .site-nav { display: grid; }
  .site-nav a { width: 100%; }
}
@media (max-width: 520px) {
  .hero-actions .button, .cta-actions .button { width: 100%; }
  .cart-line-controls { grid-template-columns: 44px minmax(28px, auto) 44px; }
  .cart-line-controls [data-remove] { grid-column: 1 / -1; width: 100%; }
  h1 { font-size: 2.2rem; }
  h2 { font-size: 1.78rem; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}`;
}

function productSvg(index, concept) {
  const p = concept.palette;
  return `<svg viewBox="0 0 220 160" aria-hidden="true"><rect x="22" y="24" width="176" height="112" rx="14" fill="${p.wash}"/><path d="M54 ${52 + (index % 4) * 6}h112M54 ${82 + (index % 3) * 5}h82M54 ${112 - (index % 2) * 8}h102" stroke="${p.accent}" stroke-width="8" stroke-linecap="round"/><circle cx="${150 - (index % 3) * 18}" cy="${78 + (index % 2) * 22}" r="18" fill="${p.warm}"/></svg>`;
}

function serviceSection(concept) {
  return `<section class="section" id="servicios">
  <div class="section-shell split">
    <div class="section-head">
      <p class="eyebrow">${esc(concept.industry)}</p>
      <h2>Servicios y contenido representado.</h2>
      <p class="lead">${esc(concept.serviceIntro)}</p>
    </div>
    <ol class="service-list">
      ${concept.services.map((item) => `<li>${esc(item)}</li>`).join("\n      ")}
    </ol>
  </div>
</section>`;
}

function timelineSection(concept) {
  return `<section class="section" id="proceso">
  <div class="section-shell">
    <div class="section-head">
      <p class="eyebrow">${esc(concept.processTitle)}</p>
      <h2>Una ruta fácil de seguir.</h2>
    </div>
    <div class="timeline">
      ${concept.stages.map(([title, text]) => `<article class="step"><strong>${esc(title)}</strong><p>${esc(text)}</p></article>`).join("\n      ")}
    </div>
    <div class="panel-grid" style="margin-top:14px">
      ${concept.process.map((item, index) => `<article class="panel"><strong>${index + 1}. ${esc(item)}</strong></article>`).join("\n      ")}
    </div>
  </div>
</section>`;
}

function advisorSection(concept) {
  if (concept.products) return storeSection(concept);
  return `<section class="section" id="orientador">
  <div class="section-shell">
    <div class="advisor" data-advisor>
      <p class="eyebrow">${esc(concept.advisorTitle)}</p>
      <h2>${esc(concept.advisorTitle)}</h2>
      <p class="lead">${esc(concept.advisorIntro)}</p>
      <div class="choice-grid" role="group" aria-label="${esc(concept.advisorTitle)}">
        ${concept.advisorOptions.map(([label, response], index) => `<button type="button" aria-pressed="${index === 0 ? "true" : "false"}" data-choice="${esc(label)}" data-response="${esc(response)}">${esc(label)}</button>`).join("\n        ")}
      </div>
      <div class="advisor-result" tabindex="-1" aria-live="polite">
        <strong>${esc(concept.advisorOptions[0]?.[0] || "Selecciona una opción")}</strong>
        <p>${esc(concept.advisorOptions[0]?.[1] || "La respuesta aparecerá aquí.")}</p>
        <button class="button primary" type="button" data-demo-action>Consultar por el canal del negocio</button>
      </div>
    </div>
  </div>
</section>`;
}

function storeSection(concept) {
  const products = concept.products.map((product, index) => ({
    id: `p${index + 1}`,
    name: product[0],
    category: product[1],
    price: product[2],
    description: product[3],
    svg: productSvg(index, concept)
  }));
  return `<section class="section" id="catalogo">
  <div class="section-shell">
    <div class="section-head">
      <p class="eyebrow">Catálogo demostrativo</p>
      <h2>10 productos simples, 3 categorías y carrito simulado.</h2>
      <p class="lead">Productos y precios demostrativos. No se procesa pago ni se solicitan datos sensibles.</p>
    </div>
    <div class="catalog-layout">
      <div>
        <div class="menu-tools">
          <input id="product-search" type="search" placeholder="Buscar producto" aria-label="Buscar producto" />
          <div class="filter-row" role="group" aria-label="Filtrar productos">
            ${["Todos", "Hogar", "Escritorio", "Regalos"].map((filter, index) => `<button type="button" aria-pressed="${index === 0 ? "true" : "false"}" data-product-filter="${filter}">${filter}</button>`).join("")}
          </div>
        </div>
        <div class="catalog-grid" data-products='${esc(JSON.stringify(products))}'></div>
      </div>
      <aside class="cart-panel" id="carrito" aria-live="polite">
        <p class="eyebrow">Carrito</p>
        <h2>Resumen</h2>
        <div class="cart-lines" data-cart-lines></div>
        <div class="cart-total"><span>Subtotal</span><strong data-cart-total>$0 MXN</strong></div>
        <label style="display:grid;gap:6px;margin:14px 0;font-weight:800">Entrega demostrativa
          <select id="delivery-mode"><option>Envío local</option><option>Recolección</option></select>
        </label>
        <p class="disclaimer">No se calculan tarifas reales. En el proyecto final se conectaría el checkout y la plataforma de pago seleccionada.</p>
        <div class="actions">
          <button class="button ghost" type="button" data-clear-cart>Vaciar carrito</button>
          <button class="button primary" type="button" data-demo-action>Continuar</button>
        </div>
      </aside>
    </div>
  </div>
</section>`;
}

function faqSection(concept) {
  return `<section class="section" id="preguntas">
  <div class="section-shell">
    <div class="section-head">
      <p class="eyebrow">Preguntas frecuentes</p>
      <h2>Condiciones claras antes de publicar.</h2>
    </div>
    <div class="faq-grid">
      ${concept.faq.map(([q, a]) => `<article class="faq-item"><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join("\n      ")}
    </div>
  </div>
</section>`;
}

function contactSection(concept) {
  return `<section class="section contact-band" id="contacto">
  <div class="section-shell contact-grid">
    <div>
      <p class="eyebrow">Contacto</p>
      <h2>Datos reales por configurar con el negocio.</h2>
      <p class="lead">Esta demo no inventa teléfono, correo, dirección ni mapa. En un proyecto publicado se cargarían los canales aprobados por el cliente.</p>
    </div>
    <div class="panel">
      <ul class="contact-list">
        <li>WhatsApp del negocio: por configurar.</li>
        <li>Horario: por confirmar.</li>
        <li>Zona de atención: por definir.</li>
        <li>Redes sociales: solo si el cliente las autoriza.</li>
      </ul>
      <div class="actions" style="margin-top:16px">
        <button class="button primary" type="button" data-demo-action>Solicitar información</button>
      </div>
    </div>
  </div>
</section>`;
}

function nexoCta(concept) {
  return `<section class="section nexo-cta" id="nexo26">
  <div class="section-shell split">
    <div>
      <p class="eyebrow">NEXO26 DIGITAL</p>
      <h2>${esc(concept.ctaTitle)}</h2>
      <p class="lead">Este concepto organiza alcance, navegación, contenido e interacción para mostrar cómo podría verse una solución similar después de recibir materiales y aprobación.</p>
    </div>
    <div class="cta-actions">
      <a class="button primary" href="${nexoWhatsapp}" target="_blank" rel="noopener noreferrer" data-nexo-whatsapp>Quiero una solución similar</a>
      <a class="button ghost" href="../../?utm_source=demo&utm_medium=referral&utm_campaign=${concept.slug}" target="_blank" rel="noopener noreferrer" data-nexo-link>Explorar NEXO26 Digital</a>
    </div>
  </div>
</section>`;
}

function mainHtml(concept) {
  const rootPath = `${publicRoot}/demos/${concept.slug}/`;
  const scope = concept.package;
  const navItems = concept.nav.map((item, index) => {
    const ids = ["servicios", concept.products ? "catalogo" : "orientador", "proceso", "contacto"];
    return `<a href="#${ids[index] || "contacto"}">${esc(item)}</a>`;
  }).join("\n          ");
  return `<!doctype html>
<html lang="es-MX">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="${concept.palette.accent}" />
    <meta name="description" content="${esc(concept.name)} ${esc(concept.descriptor)}: concepto web demostrativo en estado draft para revisión privada de NEXO26 Digital." />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(concept.name)} ${esc(concept.descriptor)} | Concepto NEXO26" />
    <meta property="og:description" content="${esc(concept.tagline)}" />
    <meta property="og:url" content="${rootPath}" />
    <meta property="og:image" content="${rootPath}assets/img/social-preview.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <title>${esc(concept.name)} ${esc(concept.descriptor)} | Concepto draft NEXO26</title>
    <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="../shared/demo-shell.css" />
    <link rel="stylesheet" href="assets/css/styles.css" />
  </head>
  <body class="${concept.layout}">
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="#inicio" aria-label="Ir al inicio">
          <img src="assets/img/brand-mark.svg" alt="" />
          <span><strong>${esc(concept.name)}</strong><small>${esc(concept.descriptor)}</small></span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle>Menú</button>
        <nav class="site-nav" id="site-nav" aria-label="Navegación principal">
          ${navItems}
        </nav>
      </div>
    </header>
    <main id="contenido">
      <section class="hero" id="inicio">
        <div class="section-shell hero-grid">
          <div>
            <p class="eyebrow">${esc(concept.hero.eyebrow)}</p>
            <h1>${esc(concept.hero.title)}</h1>
            <p class="hero-text">${esc(concept.hero.text)}</p>
            <div class="hero-actions">
              <a class="button primary" href="#servicios">${esc(concept.hero.primary)}</a>
              <a class="button ghost" href="#${concept.products ? "catalogo" : "orientador"}">${esc(concept.hero.secondary)}</a>
            </div>
            <p class="hero-note">${esc(concept.hero.note)}</p>
            <div class="info-rail" aria-label="Información rápida">
              ${concept.quick.map((item) => `<span>${esc(item)}</span>`).join("\n              ")}
            </div>
          </div>
          <div class="hero-visual" aria-label="Ilustración editorial del concepto">
            <img src="assets/img/primary-illustration.svg" alt="" />
          </div>
        </div>
      </section>
      <section class="section">
        <div class="section-shell">
          <p class="status-note"><strong>Estado:</strong> draft. Nombre e identidad ficticios utilizados exclusivamente con fines demostrativos. No está aprobado para catálogo público ni portafolio principal.</p>
        </div>
      </section>
      ${serviceSection(concept)}
      ${advisorSection(concept)}
      ${timelineSection(concept)}
      ${faqSection(concept)}
      ${contactSection(concept)}
      ${nexoCta(concept)}
    </main>
    <footer class="site-footer">
      <div class="footer-shell">
        <strong>${esc(concept.name)} ${esc(concept.descriptor)}</strong>
        <p>2026 · Concepto demostrativo. Nombre, identidad y contenido utilizados exclusivamente con fines demostrativos.</p>
        <p>Concepto desarrollado por <a href="../../?utm_source=demo&utm_medium=referral&utm_campaign=${concept.slug}" data-nexo-link>NEXO26 Digital</a>. Paquete representado: ${esc(scope.packageName)}.</p>
      </div>
    </footer>
    <script src="assets/js/config.js"></script>
    <script src="../shared/demo-shell.js"></script>
    <script src="assets/js/main.js"></script>
  </body>
</html>`;
}

function menuPage(concept) {
  const items = [
    ["Vegetales de temporada", "Entradas", "$160", "Porción demostrativa para compartir."],
    ["Pan de casa", "Entradas", "$95", "Servicio de pan ficticio con mantequilla especiada."],
    ["Corte de la casa", "Parrilla", "$420", "Platillo demostrativo sujeto a disponibilidad."],
    ["Pollo brasa lenta", "Parrilla", "$280", "Opción demostrativa sin alérgenos declarados."],
    ["Setas al fuego", "Vegetales", "$230", "Plato vegetal de temporada ficticia."],
    ["Ensalada tibia", "Vegetales", "$190", "Verdes y semillas demostrativas."],
    ["Flan de olla", "Postres", "$110", "Postre clásico demostrativo."],
    ["Cacao y sal", "Postres", "$130", "Postre ficticio para cierre de mesa."],
    ["Agua fresca", "Bebidas", "$75", "Sabor sujeto a temporada demostrativa."],
    ["Infusión fría", "Bebidas", "$85", "Bebida sin alcohol demostrativa."]
  ];
  return `<!doctype html>
<html lang="es-MX">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="${concept.palette.accent}" />
    <meta name="description" content="Menú demostrativo de Casa Brasa Cocina en estado draft para revisión privada." />
    <meta property="og:title" content="Casa Brasa Cocina | Menú demostrativo" />
    <meta property="og:image" content="${publicRoot}/demos/${concept.slug}/assets/img/social-preview.svg" />
    <title>Menú | Casa Brasa Cocina</title>
    <link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="../../shared/demo-shell.css" />
    <link rel="stylesheet" href="../assets/css/styles.css" />
  </head>
  <body class="${concept.layout}">
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="../"><img src="../assets/img/brand-mark.svg" alt="" /><span><strong>Casa Brasa</strong><small>Menú</small></span></a>
        <nav class="site-nav" aria-label="Navegación"><a href="../">Inicio</a><a href="../experiencia/">Experiencia</a><a href="#menu">Carta</a></nav>
      </div>
    </header>
    <main id="contenido">
      <section class="hero" id="menu">
        <div class="section-shell">
          <p class="eyebrow">Menú demostrativo</p>
          <h1>Carta buscable para decidir antes de escribir.</h1>
          <p class="hero-text">Los platillos, precios y disponibilidad son ficticios. Esta ruta muestra cómo podría organizarse un menú corto con filtros claros.</p>
        </div>
      </section>
      <section class="section">
        <div class="section-shell">
          <div class="menu-tools">
            <input id="menu-search" type="search" placeholder="Buscar platillo" aria-label="Buscar platillo" />
            <div class="filter-row" role="group" aria-label="Categorías de menú">
              ${["Todos", "Entradas", "Parrilla", "Vegetales", "Postres", "Bebidas"].map((filter, index) => `<button type="button" aria-pressed="${index === 0 ? "true" : "false"}" data-menu-filter="${filter}">${filter}</button>`).join("")}
            </div>
          </div>
          <div class="menu-grid" id="menu-grid">
            ${items.map(([name, category, price, description]) => `<article class="menu-item" data-menu-item data-category="${category}" data-text="${`${name} ${category} ${description}`.toLowerCase()}"><h3><span>${name}</span><span>${price}</span></h3><p>${description}</p><p class="disclaimer">${category}</p></article>`).join("\n            ")}
          </div>
        </div>
      </section>
      ${nexoCta({ ...concept, ctaTitle: "Un menú web debe ser fácil de revisar en celular." }).replaceAll("../../?", "../../../?")}
    </main>
    <footer class="site-footer"><div class="footer-shell"><p>2026 · Menú demostrativo. No representa precios ni disponibilidad real.</p></div></footer>
    <script src="../assets/js/config.js"></script>
    <script>window.DEMO_CONFIG.nexoSiteUrl = "../../../?utm_source=demo&utm_medium=referral&utm_campaign=casa-brasa-restaurante";</script>
    <script src="../../shared/demo-shell.js"></script>
    <script src="../assets/js/main.js"></script>
  </body>
</html>`;
}

function experiencePage(concept) {
  return `<!doctype html>
<html lang="es-MX">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="${concept.palette.accent}" />
    <meta name="description" content="Ruta demostrativa de experiencia para grupos de Casa Brasa Cocina." />
    <meta property="og:title" content="Casa Brasa Cocina | Experiencia" />
    <meta property="og:image" content="${publicRoot}/demos/${concept.slug}/assets/img/social-preview.svg" />
    <title>Experiencia | Casa Brasa Cocina</title>
    <link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="../../shared/demo-shell.css" />
    <link rel="stylesheet" href="../assets/css/styles.css" />
  </head>
  <body class="${concept.layout}">
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="../"><img src="../assets/img/brand-mark.svg" alt="" /><span><strong>Casa Brasa</strong><small>Experiencia</small></span></a>
        <nav class="site-nav" aria-label="Navegación"><a href="../">Inicio</a><a href="../menu/">Menú</a><a href="#grupos">Grupos</a></nav>
      </div>
    </header>
    <main id="contenido">
      <section class="hero" id="grupos">
        <div class="section-shell hero-grid">
          <div>
            <p class="eyebrow">Grupos · Celebraciones · Consulta</p>
            <h1>Una ruta para planear sin prometer disponibilidad automática.</h1>
            <p class="hero-text">La experiencia muestra información útil para grupos: intención, formato de mesa y canal de confirmación. No reserva ni cobra.</p>
            <button class="button primary" type="button" data-demo-action>Consultar condiciones</button>
          </div>
          <div class="hero-visual"><img src="../assets/img/primary-illustration.svg" alt="" /></div>
        </div>
      </section>
      <section class="section">
        <div class="section-shell">
          <div class="timeline">
            <article class="step"><strong>Mesa casual</strong><p>Para visitas pequeñas con carta abierta y confirmación por canal oficial.</p></article>
            <article class="step"><strong>Celebración</strong><p>Para explicar horarios, número de personas y condiciones sujetas a aprobación.</p></article>
            <article class="step"><strong>Grupo</strong><p>Para ordenar información antes de escribir sin prometer espacio.</p></article>
          </div>
        </div>
      </section>
      ${nexoCta({ ...concept, ctaTitle: "Una experiencia de restaurante también debe explicar límites." }).replaceAll("../../?", "../../../?")}
    </main>
    <footer class="site-footer"><div class="footer-shell"><p>2026 · Experiencia demostrativa. No representa reserva real.</p></div></footer>
    <script src="../assets/js/config.js"></script>
    <script>window.DEMO_CONFIG.nexoSiteUrl = "../../../?utm_source=demo&utm_medium=referral&utm_campaign=casa-brasa-restaurante";</script>
    <script src="../../shared/demo-shell.js"></script>
    <script src="../assets/js/main.js"></script>
  </body>
</html>`;
}

const sharedMain = `(function () {
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
})();`;

function readme(concept) {
  return `# ${concept.name} ${concept.descriptor}

- Estado: draft
- Publicado en catálogo: no
- Featured: no
- Paquete representado: ${concept.package.packageName}

## Ruta privada

${publicRoot}/demos/${concept.slug}/

## Criterio

Este concepto demuestra una posible arquitectura para ${concept.industry}. La identidad, nombre, contenido, productos y precios son ficticios y se usan exclusivamente con fines demostrativos.

## Alcance

- Status: \`draft\`
- \`published: false\`
- \`featured: false\`
- Meta robots: \`noindex, nofollow\`
- Sin datos de contacto ficticios
- Sin activación en catálogo público o portafolio principal

## Pruebas previstas

- HTML/CSS/JS local
- Consola sin errores propios
- Cero 404 de assets
- Cero overflow horizontal
- Revisión 390x844 y 1440x900
`;
}

for (const concept of concepts) {
  const base = `demos/${concept.slug}`;
  write(`${base}/index.html`, mainHtml(concept));
  write(`${base}/README.md`, readme(concept));
  write(`${base}/assets/css/styles.css`, css(concept));
  write(`${base}/assets/js/config.js`, configJs(concept));
  write(`${base}/assets/js/main.js`, sharedMain);
  write(`${base}/assets/img/brand-mark.svg`, brandSvg(concept));
  write(`${base}/assets/img/favicon.svg`, brandSvg(concept));
  write(`${base}/assets/img/social-preview.svg`, socialPreview(concept));
  write(`${base}/assets/img/primary-illustration.svg`, primaryIllustration(concept));
  if (concept.slug === "casa-brasa-restaurante") {
    write(`${base}/menu/index.html`, menuPage(concept));
    write(`${base}/experiencia/index.html`, experiencePage(concept));
  }
}

const avg = (scores) => (scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(2);
const nameRows = [
  ["Huella Clara", "Sin coincidencia exacta comercial relevante en búsqueda rápida; existen múltiples negocios con 'Huella' en veterinaria.", "Se conserva", "Huella Clara Centro Veterinario"],
  ["Arco Claro", "Sin coincidencia exacta relevante; existe Arco Dental/ClaroNav Dental como cercanos no idénticos.", "Se conserva", "Arco Claro Clínica Dental"],
  ["Casa Brasa", "Sin coincidencia exacta fuerte en México para el giro durante búsqueda rápida.", "Se conserva", "Casa Brasa Cocina"],
  ["Base Uno", "Coincidencias comerciales claras con gimnasio/base uno.", "Descartado", "Ritmo Base Entrenamiento"],
  ["Punto Focal", "Coincidencias claras de ópticas Punto Focal, incluso en CDMX.", "Descartado", "Foco Vivo Óptica"],
  ["Casa Trama", "Coincidencias claras con tienda Trama/Casa Trama en objetos y regalos.", "Descartado", "Casa Lote Objetos y Regalos"],
  ["Clima Claro", "No se encontró coincidencia comercial exacta fuerte para servicio técnico de climatización.", "Se conserva", "Clima Claro Servicio Técnico"]
];

write("demos/NAME_CHECKS_2026.md", `# Name checks 2026

Fecha: ${today}

Esta revisión es una búsqueda operativa para reducir riesgos evidentes de coincidencia comercial. No constituye validación legal, registral, marcaria ni disponibilidad de dominio.

| Nombre revisado | Coincidencias encontradas | Decisión | Nombre final seleccionado |
|---|---|---|---|
${nameRows.map((row) => `| ${row.map(esc).join(" | ")} |`).join("\n")}

Fuentes consultadas de búsqueda pública incluyen Google/Bing, resultados sociales y referencias comerciales visibles.`);

write("demos/RESEARCH_2026.md", `# Research 2026

Fecha: ${today}

## Hallazgos por giro

| Giro | Necesidad principal | Información prioritaria | Patrón de conversión | Riesgos evitados | Decisiones aplicadas |
|---|---|---|---|---|---|
| Veterinaria | Saber si atiende el caso y cómo preparar consulta. | Servicios, especies, prevención, seguimiento, contacto. | Orientador responsable y CTA de contacto. | Diagnóstico, urgencias falsas, recomendaciones médicas. | Cuidado por etapas y checklist de visita. |
| Dental | Entender tratamientos sin presión. | Primera consulta, tratamientos, requisitos, FAQ. | Preparar visita antes de escribir. | Diagnóstico dental, precios inventados, promesas clínicas. | Ruta antes/durante/después. |
| Restaurante | Decidir por menú, ocasión y claridad práctica. | Menú, horario, grupos, experiencia. | Revisar carta y consultar disponibilidad. | Reservas falsas, precios reales no autorizados. | Tres rutas: inicio, menú, experiencia. |
| Gimnasio | Saber cómo empezar sin intimidación. | Modalidades, horarios, primera visita. | Selector de inicio. | Promesas físicas, antes/después, rutinas automáticas. | Mensaje centrado en estructura. |
| Óptica | Comparar opciones sin depender de marcas o rostro. | Servicios, estilos, materiales, ajustes. | Explorador de estilos. | Captura de rostro, recomendaciones por apariencia, marcas. | Armazones SVG abstractos. |
| Tienda inicial | Comprar de forma simple y confiable. | Productos, categorías, carrito, entrega, checkout. | Carrito y resumen. | Pagos reales, datos sensibles, inventario complejo. | 10 productos, 3 categorías, localStorage. |
| Servicio técnico | Pedir servicio sin dar datos sensibles. | Servicios, cobertura, proceso, contacto. | Constructor de mensaje. | Cotización automática, diagnóstico, dirección exacta. | Una vista de 5 secciones. |

## Referentes revisados

- Modern Animal: navegación por servicios, cuidado por etapa, claridad de costos y booking.
- Dentalia y Tend: jerarquía de tratamientos, primera visita y confianza.
- Sonora Grill y OpenTable: menú, ocasión, disponibilidad y búsqueda por intención.
- Smart Fit y Planet Fitness: claridad de planes, horarios y entrada rápida.
- Warby Parker, Ben & Frank y Ace & Tate: navegación por producto, estilos y examen visual.
- Baymard, Shopify: filtros, búsqueda, carrito y checkout claro.
- Service Experts y Mr. Rooter: servicios locales, urgencia contextual y cobertura.

## Adaptación para negocio local mexicano

Las demos evitan automatizar promesas. Priorizan WhatsApp, horarios, zona, alcance y confirmación manual porque muchos negocios locales operan con disponibilidad variable, materiales incompletos y contacto directo.`);

write("demos/DESIGN_MATRIX_2026.md", `# Design matrix 2026

| Concepto | Giro | Paquete | Hero | Tipografía | Paleta | Arquitectura | Interacción principal | Navegación | Sistema visual | Densidad | CTA | Diferencia respecto a Kalma | Diferencia interna |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${concepts.map((c) => `| ${c.name} | ${c.industry} | ${c.package.packageName} | ${c.hero.title} | ${c.font.replaceAll("|", "/")} | ${Object.values(c.palette).slice(0, 4).join(", ")} | ${c.products ? "Catálogo transaccional" : c.layout} | ${c.products ? "Carrito" : c.advisorTitle} | ${c.nav.join(" / ")} | ${c.layout} | ${c.products ? "Alta" : "Media"} | ${c.ctaTitle} | No usa spa, bienestar sensorial ni estética Kalma. | Hero, paleta, interacción y composición propios. |`).join("\n")}
`);

write("demos/VISUAL_AUDIT_2026.md", `# Visual audit 2026

Escala 1 a 10. Autoevaluación operativa; no sustituye aprobación visual, comercial y técnica del propietario de NEXO26.

| Concepto | Identidad | Realismo | Arquitectura | Jerarquía | Móvil | CTA | Diferenciación | Giro | Paquete | Portafolio | Promedio |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
${concepts.map((c) => `| ${c.name} | ${c.scores.map((score) => score.toFixed(1)).join(" | ")} | ${avg(c.scores)} |`).join("\n")}

Todos quedan en estado draft. Cualquier criterio que baje durante revisión visual debe corregirse antes de cambiar a published.`);

write("demos/PUBLISHING_CHECKLIST_2026.md", `# Publishing checklist 2026

## Estado actual

- Los siete conceptos nuevos están publicados únicamente como rutas directas en estado draft.
- No aparecen en catálogo público ni portafolio principal.
- Kalma Spa no se usa como demo pública de NEXO26 por falta de permiso.
- Las demos draft usan \`noindex, nofollow\`.

## Para aprobar un concepto

1. Revisar diseño móvil y escritorio.
2. Validar nombre comercial y legalmente.
3. Confirmar paquete y alcance.
4. Confirmar que no usa datos reales no autorizados.
5. Cambiar en el modelo de datos: \`status: "published"\`, \`published: true\`.
6. Decidir si será \`featured\`.
7. Actualizar sitemap solo cuando sea público.

## Dominio corto

La URL de GitHub Pages de este repositorio mantiene el formato de proyecto. Para quitar el usuario de GitHub del enlace público se requiere dominio propio, por ejemplo \`nexo26digital.com\`, o publicar desde una cuenta/organización llamada \`nexo26digital\`.`);

write("demos/CONTENT_RULES_2026.md", `# Content rules 2026

- No presentar demos como clientes reales.
- No inventar teléfonos, correos, direcciones, reseñas, métricas o resultados.
- No mostrar Kalma Spa como demo pública de NEXO26 sin permiso.
- Mantener conceptos draft ocultos del catálogo público.
- Usar \`noindex, nofollow\` mientras no exista aprobación.
- En salud, dental, fitness y servicio técnico no emitir diagnósticos, promesas ni recomendaciones personalizadas.
- En tienda no pedir tarjeta, CVV, datos bancarios ni procesar pago real.
- En restaurante no simular reserva confirmada.
- En óptica no capturar rostro ni recomendar por apariencia personal.
`);

console.log(`Generated ${concepts.length} draft concepts.`);
