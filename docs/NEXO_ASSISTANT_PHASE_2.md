# NEXO Assistant Phase 2

Esta fase entrega el nucleo logico del futuro Asistente NEXO. No agrega interfaz, estilos, boton flotante, endpoint real, CRM, guardado permanente ni integracion con IA.

## Dependencias

```text
assets/js/config.js
  -> assets/js/nexo-assistant-config.js
  -> assets/data/nexo-knowledge.js

assets/js/data.js
  -> assets/data/nexo-knowledge.js

assets/data/nexo-knowledge.js
  -> assets/js/nexo-assistant-engine.js
```

`assets/js/main.js` no se importa en esta fase. Se usa solo como referencia del recomendador publico existente.

## Orden Futuro De Carga

Cuando se integre a la pagina en una fase posterior, el orden compatible con sitio estatico sera:

```html
<script src="assets/js/config.js" defer></script>
<script src="assets/js/data.js" defer></script>
<script src="assets/js/nexo-assistant-config.js" defer></script>
<script src="assets/data/nexo-knowledge.js" defer></script>
<script src="assets/js/nexo-assistant-engine.js" defer></script>
```

No se requiere framework, bundler ni proceso de compilacion. Los archivos exponen:

- `window.NEXO_ASSISTANT_CONFIG`
- `window.NEXO_ASSISTANT_KNOWLEDGE`
- `window.NEXO_ASSISTANT_ENGINE`

## Archivos

- `assets/js/nexo-assistant-config.js`: configuracion central del asistente.
- `assets/data/nexo-knowledge.js`: adaptador de conocimiento basado en `config.js` y `data.js`.
- `assets/js/nexo-assistant-engine.js`: motor puro de contexto, intenciones, recomendaciones, respuestas demo, resumen y validaciones.
- `tests/nexo-assistant-engine.test.js`: pruebas con Node y `assert`, sin frameworks externos.
- `docs/NEXO_ASSISTANT_PHASE_2.md`: documentacion de esta fase.

## Fuente De Verdad

| Dato | Fuente oficial | Uso en asistente |
| --- | --- | --- |
| Marca, zona, WhatsApp y redes | `assets/js/config.js` | Configuracion y enlaces oficiales |
| Paquetes, nombres y precios | `assets/js/data.js` | Adaptador de planes |
| Extras, pagos, entregas y notas | `assets/js/data.js` | Adaptador de extras |
| FAQ | `assets/js/data.js` | Conocimiento consultivo |
| Portafolio | `assets/js/data.js` | Filtro de publicados activos |
| Reglas del recomendador publico | `assets/js/main.js` | Referencia de comportamiento |

La prueba `source of truth: package names and prices stay synced with data.js` falla si los nombres o precios de paquetes se desalinean de la fuente oficial.

## Datos Duplicados O Normalizados

`nexo-knowledge.js` evita copiar manualmente nombres, precios, pagos y entregas cuando ya existen en `data.js`.

Solo mantiene normalizaciones del asistente:

- limites numericos de secciones, servicios, paginas, rondas y meses de publicacion;
- regla estricta de dominio para Profesional: conexion solo si el cliente ya cuenta con uno;
- precio de renovacion mostrado como `$399 MXN`;
- reglas comerciales, materiales requeridos, plantillas por giro y claims prohibidos.

Estas piezas existen para que el motor pueda validar reglas comerciales sin depender de texto libre.

## API Publica Del Motor

`window.NEXO_ASSISTANT_ENGINE` expone una superficie estable:

- `ALLOWED_ACTIONS`
- `INTENTS`
- `defaultLeadContext`
- `createLeadContext`
- `sanitizeLeadContext`
- `mergeLeadContext`
- `clearLeadContext`
- `getMissingLeadFields`
- `detectIntent`
- `isAllowedAction`
- `sanitizeSuggestedActions`
- `getPublicPortfolio`
- `recommendPlan`
- `calculateLeadScore`
- `classifyLeadScore`
- `generateBusinessStructure`
- `generateVisualDirection`
- `generateDemoResponse`
- `buildLeadSummary`
- `validateUserMessage`
- `validateLeadContext`
- `validatePlanRecommendation`
- `validateUrl`
- `validateDemoResponse`
- `validateSummary`

No expone helpers internos de normalizacion ni sanitizado de bajo nivel.

## Estado Del Prospecto

El contexto normalizado incluye negocio, giro, ciudad, local fisico, sucursales, canales actuales, WhatsApp, sitio existente, servicios, preguntas, objetivos, funciones, urgencia, materiales, plan recomendado, razones y lead score.

Las funciones puras crean objetos nuevos y no mutan los argumentos.

## Intenciones

El motor reconoce saludos, servicios, planes, precio, tiempos, dominio, actualizaciones, requisitos, portafolio, analisis, recomendacion, estructura, direccion visual, resumen, cotizacion, humano, WhatsApp, reinicio y fallback.

La respuesta publica no muestra confidence, matched terms, lead score ni reglas internas.

## Recomendacion

- NEXO Esencial: hasta 6 servicios, presentacion sencilla, WhatsApp y claridad basica.
- NEXO Profesional: hasta 10 servicios, galeria, mapa, FAQ, testimonios, analitica, QR, promociones o local fisico.
- NEXO A Medida: mas de 10 servicios, varias sucursales, paginas por sede, equipo, portafolio o secciones especiales.
- Actualizacion: si ya existe una pagina, no recomienda comenzar desde cero automaticamente.

La recomendacion nunca es definitiva. El alcance se confirma antes de cotizar.

## Lead Score

El score va de 0 a 10 y usa senales no sensibles: local fisico, sucursales, WhatsApp, canales activos, servicios, objetivos, funciones, urgencia y materiales.

Clasificacion:

- 0-3: Exploracion
- 4-6: Prospecto posible
- 7-8: Prospecto calificado
- 9-10: Prioridad alta

El score no modifica precios y no se muestra al visitante.

## Acciones Permitidas

La lista cerrada es:

- `show_services`
- `show_plans`
- `start_analysis`
- `continue_analysis`
- `show_portfolio`
- `show_plan_details`
- `generate_structure`
- `build_summary`
- `copy_summary`
- `open_whatsapp`
- `request_human`
- `restart`

Las acciones fuera de lista se eliminan.

## Seguridad

El motor no usa:

- `innerHTML`
- `eval`
- `new Function`
- `document.write`
- `localStorage`
- `fetch`
- `XMLHttpRequest`
- claves API
- tokens
- secretos

No abre URLs automaticamente, no envia mensajes, no guarda conversaciones, no registra datos personales en consola y trata HTML del usuario como texto.

## Portafolio

El portafolio se obtiene desde `data.js` con:

```js
project.status === "published" &&
project.published !== false &&
project.active !== false
```

Piezas publicas esperadas:

- Barberia Premium
- Concepto veterinario 01
- Asador Argentino
- Servicio Local Express
- VistaElite Optica
- Concepto veterinario 02

Los conceptos privados y draft quedan excluidos.

## Resumen Y WhatsApp

`buildLeadSummary` devuelve objeto estructurado, texto legible y URL:

```text
https://wa.me/5215517973390?text=...
```

El texto se codifica con `encodeURIComponent`. El motor solo crea la URL; no abre WhatsApp ni envia informacion.

## Casos De Prueba

La suite cubre 42 casos:

- 28 casos obligatorios del brief;
- reglas comerciales por paquete;
- extras;
- sincronizacion con fuente oficial;
- portafolio publico real;
- resumen decodificado de WhatsApp;
- harness de navegador sin Node ni bundler;
- API publica;
- pureza e inmutabilidad;
- seguridad de archivos del motor.

## Como Ejecutar Pruebas

```powershell
node tests/nexo-assistant-engine.test.js
node --check assets/js/nexo-assistant-config.js
node --check assets/data/nexo-knowledge.js
node --check assets/js/nexo-assistant-engine.js
node --check assets/js/config.js
node --check assets/js/data.js
node --check assets/js/main.js
git diff --check
```

## Limitaciones Del Modo Demo

- No usa IA real.
- No aprende fuera de la sesion.
- No guarda conversaciones.
- No consulta disponibilidad real.
- No cotiza de forma definitiva.
- No abre WhatsApp automaticamente.
- No ejecuta acciones externas.

## Que No Hace Todavia

- Interfaz visual.
- Boton flotante.
- Panel de chat.
- Persistencia temporal.
- Endpoint real.
- CRM.
- Analitica del asistente.
- Deploy.

## Riesgos Pendientes

- Resolver copy final del dominio antes de conectar interfaz publica.
- Definir si la UI mostrara o no alternativas por paquete.
- Definir fallback si se conecta una IA real y el endpoint falla.
- Definir politica de datos antes de guardar cualquier conversacion.

## Condiciones Para Iniciar Fase 3

- Fase 2 comprometida localmente.
- 28 o mas pruebas pasando.
- 0 errores de sintaxis.
- 0 secretos.
- Landing publica sin cambios.
- Referencias privadas ausentes del arbol publico.
- Drafts intactos.
- Aprobacion explicita para crear interfaz.
