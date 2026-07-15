# NEXO26 Digital

Sitio estático oficial de NEXO26 Digital: páginas web y soluciones digitales para negocios de la Megalópolis de México.

## Cómo abrir el proyecto localmente

Opción rápida:

1. Abre `index.html` en tu navegador.

Opción recomendada para revisar rutas y videos:

```powershell
python -m http.server 4291 --bind 127.0.0.1
```

Después entra a:

```text
http://127.0.0.1:4291/
```

## Estructura principal

```text
index.html
assets/css/styles.css
assets/js/config.js
assets/js/data.js
assets/js/main.js
assets/img/
assets/videos/projects/
```

## Cómo cambiar WhatsApp

Edita `assets/js/config.js`.

- `whatsappPublicLink`: enlace público principal de WhatsApp.
- `whatsappNumber`: número en formato internacional sin espacios si quieres mensajes prellenados por `wa.me`.
- `displayPhone`: número visible en el sitio. Si queda vacío, no se muestra.

Si `whatsappNumber` está vacío, el sitio usa `whatsappPublicLink`.

## Cómo cambiar precios, textos y servicios

Edita `assets/js/data.js`.

Ahí viven:

- Paquetes de páginas web.
- Servicios de ventas y reservaciones.
- Servicios de presencia y soporte.
- FAQs.
- Demos de portafolio.
- Reglas del recomendador.

## Cómo agregar videos de demos

Coloca los videos dentro de:

```text
assets/videos/projects/
```

Los demos actuales usan estos nombres:

```text
asador-argentino-demo.mp4
barberia-premium-demo.mp4
servicio-local-express-demo.mp4
vistaelite-optica-demo.mp4
```

Si cambias el nombre de un video, actualiza su ruta en `assets/js/data.js`.

Cada video se renderiza con:

```html
<video class="demo-video" controls preload="metadata" playsinline muted>
```

No se usa autoplay.

## Cómo cambiar colores

Edita las variables CSS al inicio de:

```text
assets/css/styles.css
```

Los colores principales están definidos como `--nexo-black`, `--nexo-paper`, `--nexo-gold` y variables relacionadas.

## Cómo ocultar o mostrar redes sociales

Edita `assets/js/config.js`.

- Instagram se muestra con `instagram`.
- Facebook está preparado como dato de configuración, pero si queda vacío no debe mostrarse.
- Teléfono y correo sólo aparecen si `displayPhone` o `email` tienen valor.

## Cómo publicar en GitHub Pages

1. Confirma que `index.html` esté en la raíz del repositorio.
2. Haz commit de los cambios.
3. Sube a la rama `main`.
4. En GitHub, entra a Settings > Pages.
5. Selecciona Deploy from a branch.
6. Branch: `main`.
7. Folder: `/root`.
8. Guarda los cambios.

El sitio está preparado para publicarse en:

```text
https://emis57.github.io/nexo26-digital/
```

## Datos pendientes de confirmar

Antes de usar el sitio como versión definitiva, confirma en `assets/js/config.js`:

- Número de WhatsApp si se quiere mensaje prellenado.
- Teléfono visible, si debe mostrarse.
- Correo visible, si debe mostrarse.
- ID de analítica, si se va a instalar.
