# NEXO26 Digital

Sitio estático oficial de NEXO26 Digital: páginas web y soluciones digitales para negocios de la Megalópolis de México.

## Cómo abrir el proyecto localmente

Opción rápida:

1. Abre `index.html` en tu navegador.

Opción recomendada para revisar rutas, videos y consola:

```powershell
python -m http.server <puerto> --bind <loopback-local>
```

Después entra a la URL local que muestre tu servidor en terminal.

## Estructura principal

```text
index.html
assets/css/styles.css
assets/js/config.js
assets/js/data.js
assets/js/main.js
assets/img/projects/posters/
assets/videos/projects/
demos/
```

## Catálogo de conceptos

El catálogo de conceptos vive en:

```text
demos/index.html
```

Cada concepto tiene una ruta propia bajo `demos/slug/`, configuración en `assets/js/config.js`, estilos propios y shell compartido en `demos/shared/`.

Los conceptos son demostrativos: no representan clientes contratados ni resultados garantizados. Salud no diagnostica, la tienda no cobra, restaurante no confirma reservas y servicio técnico no genera cotizaciones automáticas.

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
- Regla comercial de dominio y conexión.

## Cómo agregar videos de demos

Coloca los videos públicos dentro de:

```text
assets/videos/projects/
```

Usa nombres sin espacios ni caracteres especiales, por ejemplo:

```text
veterinaria-demo-01.mp4
veterinaria-demo-02.mp4
```

Formato recomendado:

- MP4.
- Video H.264.
- Pixel format `yuv420p`.
- `faststart`.
- Sin pista de audio.
- Resolución máxima razonable para web, idealmente 1280px de ancho máximo.

Comando recomendado con FFmpeg:

```powershell
ffmpeg -i input.mp4 -vf "scale='min(1280,iw)':-2" -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart -an output.mp4
```

## Cómo comprobar que un video no tiene audio

Con FFmpeg:

```powershell
ffmpeg -hide_banner -i assets/videos/projects/video.mp4
```

El resultado no debe mostrar ninguna línea `Audio:`.

## Cómo generar posters

Los posters públicos se guardan en:

```text
assets/img/projects/posters/
```

Formato recomendado: WebP.

Ejemplo:

```powershell
ffmpeg -ss 00:00:02 -i assets/videos/projects/video.mp4 -frames:v 1 -vf "scale='min(1280,iw)':-2" -compression_level 6 -q:v 70 assets/img/projects/posters/video-poster.webp
```

Evita fotogramas negros, controles visibles o información sensible.

## Cómo añadir un proyecto al portafolio

Edita `assets/js/data.js` dentro de `projects`.

Ejemplo:

```js
{
  title: "Concepto veterinario",
  displayTitle: "Concepto veterinario 01",
  category: "Veterinarias y salud",
  filter: "Veterinarias y salud",
  type: "Concepto visual",
  video: "assets/videos/projects/veterinaria-demo-01.mp4",
  poster: "assets/img/projects/posters/veterinaria-01-poster.webp",
  description: "Página adaptada a celular para organizar servicios, horarios, ubicación y contacto.",
  features: ["Servicios", "Horarios", "Ubicación", "WhatsApp"],
  cta: "Quiero algo similar",
  whatsappMessage: "Hola, tengo un negocio relacionado con servicios veterinarios y me interesa una página similar a esta demostración."
}
```

Usa `type` para clasificar:

- `Proyecto real`
- `Concepto visual`
- `Demostración`

No presentes un concepto como cliente real si no está confirmado.

## Cómo editar la regla del dominio

La regla está centralizada en:

```text
assets/js/data.js
```

Busca `domainPolicy`.

Actualmente:

- NEXO Esencial conserva URL administrada por NEXO26.
- NEXO Profesional contempla conexión de dominio solo si ya existe y se entregan accesos suficientes.
- NEXO A Medida no incluye dominio dentro del precio base.
- NEXO Tienda Inicial no incluye dominio dentro del precio base.

El dominio nuevo, transferencia, recuperación o cambio de propiedad se cotiza como servicio adicional desde $350 MXN más costo del dominio. Si cambia el monto, actualízalo en `domainPolicy.compareNote`, notas, FAQ y servicios de soporte.

## Cómo comprobar rutas en GitHub Pages

Después de publicar, revisa que cada asset responda con código 200:

```text
https://emis57.github.io/nexo26-digital/assets/videos/projects/nombre-del-video.mp4
https://emis57.github.io/nexo26-digital/assets/img/projects/posters/nombre-del-poster.webp
```

No uses rutas de entorno local ni rutas privadas dentro de los archivos públicos.

## URL corta de NEXO26

Los enlaces internos de las demos nuevas hacia NEXO26 deben mantenerse relativos para no repetir el usuario de GitHub en CTAs visibles.

La URL de GitHub Pages para este repositorio conserva el formato `https://emis57.github.io/nexo26-digital/`. Para que el enlace publico quede corto, por ejemplo `https://nexo26digital.com/`, se requiere configurar un dominio propio con DNS y GitHub Pages. No agregues `CNAME` hasta confirmar que el dominio pertenece a NEXO26 y que los registros DNS ya apuntan a GitHub Pages.

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

Comandos:

```powershell
git add .
git commit -m "Actualizar sitio NEXO26 Digital"
git push origin main
```

## Cómo verificar la URL pública

Abre:

```text
https://emis57.github.io/nexo26-digital/
```

Confirma:

- CSS y JavaScript cargan.
- No hay errores de consola.
- Los videos reproducen.
- Ningún video tiene audio.
- Los posters cargan.
- Los filtros del portafolio funcionan.
- El formulario abre WhatsApp.
- No hay scroll horizontal en móvil.

## Datos pendientes de confirmar

Antes de usar el sitio como versión definitiva, confirma en `assets/js/config.js`:

- Número de WhatsApp si se quiere mensaje prellenado.
- Teléfono visible, si debe mostrarse.
- Correo visible, si debe mostrarse.
- ID de analítica, si se va a instalar.
