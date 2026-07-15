# CONTENT GUIDE

Guía rápida para mantener el contenido del sitio de NEXO26 Digital sin romper la estructura.

## Voz de marca

Usa una voz profesional, directa y clara.

Preferir:

- Diseñamos.
- Desarrollamos.
- Revisamos.
- Definimos.
- Recomendamos.

Evitar:

- Prometer ventas, clientes, citas o posicionamiento.
- Usar frases absolutas como resultados garantizados.
- Reducir la marca a un servicio barato.

## Propuesta principal

Idea central:

```text
Tu negocio, más claro. Tu atención, más profesional.
```

NEXO26 Digital ayuda a presentar, organizar y conectar información digital para que los clientes entiendan qué ofrece un negocio y sepan cómo contactarlo, comprar o reservar.

## Área de atención

Usar:

```text
Megalópolis de México
```

No inventar oficina física, dirección o cobertura más específica si no está confirmada.

## Contacto

El contacto vive en:

```text
assets/js/config.js
```

No escribas teléfonos ni correos directamente en `index.html`. Si el dato no está confirmado, déjalo vacío en la configuración.

## Precios y servicios

Todos los precios y alcances viven en:

```text
assets/js/data.js
```

Antes de cambiar precios, revisa:

- Nombre del servicio.
- Precio.
- Forma de pago.
- Tiempo estimado.
- Qué incluye.
- Condiciones o exclusiones.
- Texto del botón.

## Demos

Los proyectos del portafolio están en `assets/js/data.js` dentro de `projects`.

Cada demo debe tener:

- Título.
- Categoría.
- Tipo: concepto visual o demostración.
- Ruta de video.
- Ruta de poster.
- Descripción.
- `liveUrl` si existe una ruta pública o local funcional.
- Paquete representado.
- Mensaje contextual para WhatsApp.

No presentes un demo como cliente pagado si sólo es un concepto visual.

## Conceptos por giro

Los conceptos base viven en `demos/`.

Antes de publicar o agregar un concepto:

- Verifica el nombre con búsqueda exacta y documenta el resultado en `demos/NAME_CHECKS.md`.
- Define el paquete representado y respeta sus límites.
- Usa `robots: noindex, nofollow` en cada concepto hasta aprobación explícita.
- Usa rutas relativas compatibles con GitHub Pages.
- No inventes teléfono, dirección, reseñas, métricas, resultados ni integraciones.
- Configura UTM hacia NEXO26 con `utm_campaign=slug`.
- Si una acción del negocio no tiene integración real, debe abrir modal demostrativo.

## FAQs

Las preguntas frecuentes viven en `assets/js/data.js` dentro de `faqs`.

Mantén respuestas cortas, honestas y específicas.

## Imágenes

Carpetas sugeridas:

```text
assets/img/brand/
assets/img/logo/
assets/img/projects/
assets/img/previews/
assets/img/icons/
```

La imagen social principal es:

```text
assets/img/previews/nexo26-preview.jpg
```
