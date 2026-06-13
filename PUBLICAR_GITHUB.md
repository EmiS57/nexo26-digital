# Publicar NEXO26 Digital en GitHub Pages

Repositorio recomendado:

```txt
nexo26-digital
```

## Opción 1: publicar con comandos Git

Desde la carpeta final del sitio:

```bash
git init
git add .
git commit -m "Publicar landing NEXO26 Digital"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/nexo26-digital.git
git push -u origin main
```

Después activa GitHub Pages manualmente.

## Crear el repositorio

1. Entra a GitHub.
2. Crea un repositorio nuevo llamado `nexo26-digital`.
3. Déjalo público.
4. No agregues archivos iniciales si vas a subir con Git.

## Subir desde la interfaz web

1. Abre el repositorio `nexo26-digital`.
2. Elige `Add file`.
3. Selecciona `Upload files`.
4. Sube todos los archivos y carpetas de esta carpeta final.
5. Confirma que `index.html` quede en la raíz del repositorio.
6. Confirma que `assets/videos/` y `assets/img/` también se suban.

## Activar GitHub Pages

1. Entra al repositorio `nexo26-digital`.
2. Abre `Settings`.
3. Entra a `Pages`.
4. En `Build and deployment`, elige `Deploy from a branch`.
5. Selecciona la rama `main`.
6. En carpeta, selecciona `/root`.
7. Guarda los cambios.

GitHub mostrará el enlace publicado después de unos minutos.

## Qué hacer si no carga la página

- Revisa que `index.html` esté en la raíz del repositorio.
- Revisa que GitHub Pages esté usando la rama `main`.
- Espera unos minutos y recarga.
- Abre el enlace en una ventana privada para descartar caché.

## Qué hacer si no salen los videos

- Revisa que los archivos estén en `assets/videos/`.
- Confirma que los nombres coincidan exactamente:
  - `asador-argentino-demo.mp4`
  - `barberia-premium-demo.mp4`
  - `servicio-local-express-demo.mp4`
  - `vistaelite-optica-demo.mp4`
- Revisa mayúsculas, acentos y espacios. Las rutas deben coincidir exactamente.
- Si un video pesa mucho, espera a que termine de subir antes de probar.

## Qué hacer si WhatsApp muestra preview viejo

- WhatsApp puede guardar caché del preview por un tiempo.
- Cambia temporalmente el nombre de la imagen preview en `index.html` si necesitas forzar actualización.
- También puedes compartir el link con un parámetro temporal, por ejemplo:

```txt
https://TU-USUARIO.github.io/nexo26-digital/?v=2
```

## Cómo cambiar el dominio después

1. Compra o configura tu dominio.
2. En GitHub Pages, entra a `Custom domain`.
3. Escribe tu dominio.
4. Configura los registros DNS que indique GitHub.
5. Activa `Enforce HTTPS` cuando esté disponible.

## Cómo probar el link final

- Abre el enlace publicado en celular.
- Prueba el botón de WhatsApp.
- Prueba el formulario.
- Reproduce los videos.
- Comparte el enlace por WhatsApp y revisa que aparezca el preview de NEXO26 Digital.
