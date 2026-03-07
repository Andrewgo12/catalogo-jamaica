# Documentación del Proyecto: Catálogo Jamaica

Este documento detalla la arquitectura, características y guía de mantenimiento de la aplicación web tipo catálogo "Jamaica - Natural Beauty".

## 1. Arquitectura y Tecnologías
La aplicación es una "Progressive Web App" (PWA) construida de forma estática (Static Site) con un enfoque en alto rendimiento y diseño modular, sin dependencias complejas (como Node.js, React o bases de datos SQL). Todo se ejecuta en el navegador del cliente.

### Tecnologías Nucleares:
*   **Estructura:** HTML5 Semántico
*   **Estilos:** CSS3 Modular (Variables, Flexbox, CSS Grid, Glassmorphism). Diseño inspirado en Tailwind y Magic UI.
*   **Lógica:** Vanilla JavaScript (ESM - ECMAScript Modules).
*   **Base de Datos Relacional:** `productos.json` (Archivo estático actualizado vía panel de administración).
*   **Almacenamiento Local:** `localStorage` (Para persistencia del carrito, favoritos y tracking básico de analytics).
*   **Capacidad PWA:** `manifest.json` y `sw.js` permiten la instalación en móviles y caché para carga offline.

### Estructura de Archivos
```text
/catalogo-jamaica
├── index.html            # Interfaz principal unificada y llamadas a módulos
├── productos.json        # Base de datos central de productos
├── manifest.json         # Configuración para instalación PWA
├── sw.js                 # Service Worker para manejo de caché y modo offline
│
├── css/
│   ├── base.css          # Variables globales, fuentes, fondos y smooth scroll
│   ├── layout.css        # Cuadrículas, header, footer y contenedores de filtro
│   ├── components.css    # Skeletons, botones, badges y tarjetas de bento grid
│   └── modals.css        # Superposiciones de vidrio (glassmorphism) y alertas
│
├── js/
│   ├── app.js            # Punto de entrada (orquestador de inicialización)
│   ├── state.js          # Variables globales (carrito, db, favoritos)
│   ├── ui.js             # Helpers de notificaciones (Toasts) e History API
│   ├── products.js       # Renderizado, filtrado y lógica del modal de producto
│   ├── cart.js           # Añadir al carrito, resumen y exportación a WhatsApp
│   ├── pdf.js            # Lógica externa para imprimir catálogo HD (html2pdf)
│   └── admin.js          # Panel secreto para inyección de código JSON
│
└── img/                  # Directorio de imágenes en alta y baja resolución
```

## 2. Características Principales (UI/UX)
1.  **Doble Resolución de Imagen:** Las tarjetas principales cargan imágenes `.png` ligeras (sin fondo) para velocidad, mientras que al hacer clic en "Info" se despliega en modal la versión fotográfica `.jpeg` original en máxima resolución.
2.  **Generador PDF Nativo:** Permite al cliente generar en tiempo real un documento de varias páginas con todo el catálogo fotográfico HD.
3.  **Animaciones "Magic UI":** Interfaces de vidrio (Glassmorphism), transiciones fluidas de 0.3s y reescalados (hovers) inspirados en el ecosistema Apple/iOS.
4.  **Notificaciones Toast:** Todas las interacciones ("Agregado al pedido", "Copiado", "Descargando") dan retroalimentación no intrusiva.
5.  **PWA (App Instalable):** Al entrar desde Android (Chrome) o iOS (Safari), el celular sugerirá instalarla como aplicación nativa en la pantalla de inicio. Carga rápidamente al tener `sw.js` interceptando recursos cacheados.

## 3. Funcionamiento de Datos y Negocio
1.  **Wishlist (Favoritos):** Los corazones permiten guardar productos. La preferencia nunca caduca (almacenado en `localStorage`).
2.  **Checkout por WhatsApp:** El carrito unifica el pedido (`cant x total`) y formatea limpiamente la petición para abrir la app de WhatsApp del comercio (`window.open`).
3.  **Panel de Administración Secreto:** Al hacer clic en el punto invisible situado debajo de los derechos de autor ("© 2026 Jamaica..[.]"), se abrirá el panel.
    *   Ingresando la clave `jamaica123`, el dueño puede llenar un formulario rápido y se auto-copiará al portapapeles el bloque de código `.json` exacto requerido para añadir ese nuevo ítem.

## 4. Mantenimiento y Actualizaciones
*   **Actualizar un Precio:** Abre `productos.json`, busca la `id` de referencia, cambia el valor de `precio` a número entero (sin puntos, ej: `25000`) y guarda el archivo.
*   **Ocultar Producto (Agotado):** Cambia en `productos.json` el estatus `disponible: true` por `disponible: false`. Aparecerá deshabilitado y en gris.
*   **Subir a GitHub:** Con solo hacer commit y push a la rama principal de GitHub Pages (o Netlify/Vercel), los cambios estarán en vivo. No hay paso de "Build" complejo gracias a Vanilla JS Modular.
