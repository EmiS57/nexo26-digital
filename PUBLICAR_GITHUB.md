# Publicar NEXO26 Digital en GitHub Pages

Repositorio:

```text
https://github.com/emis57/nexo26-digital
```

Sitio esperado:

```text
https://emis57.github.io/nexo26-digital/
```

## Revisión antes de publicar

1. Confirmar que `index.html` está en la raíz.
2. Confirmar que `.nojekyll` existe.
3. Confirmar que los videos están en `assets/videos/projects/`.
4. Confirmar que `assets/js/config.js` tiene los datos de contacto correctos.
5. Revisar que no haya teléfonos, correos o precios antiguos escritos directamente en HTML.
6. Abrir el sitio en móvil y escritorio.
7. Probar menú, filtros, recomendador, FAQ y formulario.

## Comandos de publicación

```powershell
git status
git add .
git commit -m "Actualizar sitio NEXO26 Digital"
git push origin main
```

## Activar GitHub Pages

En GitHub:

```text
Settings > Pages > Deploy from a branch > Branch main > Folder /root > Save
```

## Después del push

Revisa Actions o Pages hasta que el despliegue termine. Después abre:

```text
https://emis57.github.io/nexo26-digital/
```

Si el navegador conserva una versión anterior, prueba con recarga forzada.

## URL corta sin usuario de GitHub

GitHub Pages publica este repositorio como proyecto, por eso la URL tecnica conserva el usuario:

```text
https://emis57.github.io/nexo26-digital/
```

Para retirar `emis57` del enlace visible se necesita una de estas opciones:

- Configurar un dominio propio, por ejemplo `https://nexo26digital.com/`.
- Publicar desde una cuenta u organizacion cuyo usuario sea `nexo26digital`.

No crear ni subir archivo `CNAME` hasta confirmar propiedad del dominio y DNS. Mientras tanto, usar enlaces relativos dentro del sitio para que los CTAs internos no repitan el usuario de GitHub.
