# NEXO26 Digital

Sitio estático oficial de NEXO26 Digital: páginas web express para negocios locales.

## Descripción

NEXO26 Digital ofrece páginas informativas profesionales para negocios locales que necesitan mejorar su presentación, mostrar sus servicios y facilitar el contacto por WhatsApp.

Servicio principal:

- Página Express Preventa
- Desde $699 MXN
- Entrega estimada: 48–72 horas
- Zona: CDMX / Estado de México

## Archivos del sitio

```txt
index.html
styles.css
script.js
README.md
PUBLICAR_GITHUB.md
CHECKLIST_OPERACION.md
.nojekyll
assets/
  videos/
  img/
```

## Cómo abrir localmente

Puedes abrir `index.html` directamente en el navegador.

Para probarlo con un servidor local:

```bash
python -m http.server 8000
```

Después abre:

```txt
http://localhost:8000
```

## WhatsApp

Los botones principales usan:

```txt
https://wa.link/398qm4
```

El formulario usa el número directo en `script.js`:

```js
const WHATSAPP_NUMBER = "525517973390";
```

## Videos de demos

Los videos deben estar en:

```txt
assets/videos/
```

Nombres esperados:

- `asador-argentino-demo.mp4`
- `barberia-premium-demo.mp4`
- `servicio-local-express-demo.mp4`
- `vistaelite-optica-demo.mp4`

Si cambias el nombre de un video, actualiza la ruta en `index.html`.

## Imágenes para preview

La vista previa para WhatsApp/Facebook usa:

```txt
assets/img/nexo26-preview.jpg
```

El favicon usa:

```txt
assets/img/favicon.png
```

También se incluyen SVG fuente editables en `assets/img/`.

## Publicación

Este sitio está preparado para GitHub Pages. `index.html` debe estar en la raíz del repositorio.

Consulta `PUBLICAR_GITHUB.md` para los pasos completos de publicación.
