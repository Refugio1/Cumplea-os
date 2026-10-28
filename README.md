# Pide un deseo · Sitio de cumpleaños

Sitio completo con 32 fotos, pastel interactivo, animaciones al hacer scroll y explosiones de confeti al abrir y cambiar fotos.

## Subir a GitHub y publicar

1. Descomprime el archivo ZIP.
2. Crea un repositorio en GitHub y sube todo el contenido extraído, incluida la carpeta assets. El archivo index.html debe quedar en la raíz del repositorio.
3. Abre Settings > Pages. En Source, selecciona Deploy from a branch.
4. Selecciona la rama main, la carpeta /(root) y pulsa Save. Si usas otra rama, selecciona esa rama.
5. Cuando termine la publicación, encontrarás el enlace del sitio en Settings > Pages.

Sube los archivos descomprimidos: GitHub Pages no publica el contenido de un ZIP sin extraerlo.

Guía oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Usar en tu computadora

Abre index.html en tu navegador. No requiere instalación ni servicios externos.

- Haz clic o toca la vela para apagarla.
- Usa Volver a encender para repetir.
- Abre cualquier foto para verla completa y disfrutar el confeti.
- Avanza con los botones, las flechas del teclado o un deslizamiento en celular.
- Cierra el visor con el botón de cierre o con Esc.

## Archivos

- index.html: contenido del sitio.
- styles.css y motion.css: diseño y animaciones.
- app.js: galería y pastel.
- motion.js: animaciones al hacer scroll.
- photo-effects.js: confeti y animaciones de las fotos.
- assets/: las 32 fotos optimizadas y su catálogo.
- favicon.svg: icono del sitio.
- .nojekyll: indica a GitHub Pages que sirva los archivos estáticos directamente.

Las rutas son relativas para funcionar también en un sitio de proyecto de GitHub Pages. Se respeta la preferencia del dispositivo de reducir el movimiento.
