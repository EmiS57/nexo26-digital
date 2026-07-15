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
