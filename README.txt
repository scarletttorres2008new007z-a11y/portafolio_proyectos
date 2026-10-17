SCARLETT TORRES — PORTFOLIO (HTML/CSS/JS)
==========================================
Estructura:
  index.html            Inicio
  projects.html         Proyectos (con filtros)
  projects/*.html       Un caso de estudio por proyecto (7)
  services.html         Servicios y preguntas frecuentes
  about.html            Sobre mí · CV (el botón "Descargar CV" guarda la página como PDF)
  contact.html          Contacto
  404.html              Página no encontrada
  css/styles.css        Estilos globales
  js/main.js            Datos de contacto, menú móvil, carruseles, filtros y formulario
  assets/shots/         Capturas reales de cada proyecto (computadora y celular)

Tus datos de contacto:
  Abre js/main.js y cambia el bloque CONTACTO (correo, WhatsApp e Instagram).
  Se actualizan solos en todo el sitio. Si pones tu WhatsApp, el formulario
  de contacto te envía los mensajes por WhatsApp; si no, por correo.

Actualizar las capturas:
  tools/capturas.mjs saca las capturas de tus sitios en vivo con Playwright:
    npm i --no-save playwright && npx playwright install chromium
    node tools/capturas.mjs

Cómo usar:
  Abre index.html en tu navegador, o súbelo a cualquier hosting estático
  (Netlify, GitHub Pages, Vercel...). Nada de build, nada de dependencias.
