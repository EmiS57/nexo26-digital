# Demos NEXO26 Digital

Catálogo de conceptos base por giro. Cada demo usa identidad ficticia, rutas relativas compatibles con GitHub Pages y un shell compartido para explicar alcance.

## Agregar un nuevo concepto

1. Verifica el nombre con búsqueda exacta y documenta el resultado en `NAME_CHECKS.md`.
2. Define giro, paquete representado, funciones incluidas y funciones no incluidas.
3. Crea `demos/slug/index.html`, `assets/css/styles.css`, `assets/js/config.js`, `assets/js/main.js`, `assets/img/favicon.svg` y `assets/img/social-preview.svg`.
4. Usa rutas relativas, nunca rutas de Windows, localhost ni rutas absolutas desde la raíz del dominio.
5. Configura `window.DEMO_CONFIG` con UTM `utm_campaign=slug`.
6. Agrega el concepto al catálogo y al portafolio solo si tiene URL publicada o ruta local funcional.

## Conceptos incluidos

| Concepto | Slug | Paquete | Giro |
| --- | --- | --- | --- |
| Kalma Spa | ../kalma-spa-demo/ | NEXO Profesional | Belleza y bienestar |
| NUBO Centro Veterinario | nubo-veterinaria | NEXO Profesional | Veterinaria |
| CLARIA Estudio Dental | claria-dental | NEXO Profesional | Dental |
| LUMBRE CAUCE | lumbre-cauce | NEXO A Medida | Restaurante |
| EJE NORTE Entrenamiento | eje-norte | NEXO Profesional | Gimnasio |
| SENDA NÍTIDA Óptica | senda-nitida | NEXO Profesional | Óptica |
| SURCO LENTO Objetos | surco-lento | NEXO Tienda Inicial | Tienda |
| NODO TERMIA Servicio Técnico | nodo-termia | NEXO Esencial | Servicio técnico |

## Shell compartido

El shell vive en `demos/shared/` y agrega:

- Franja de concepto base.
- Botón `Ver alcance`.
- Panel accesible de alcance.
- Modal demostrativo para acciones de negocio.
- CTA contextual hacia NEXO26.
