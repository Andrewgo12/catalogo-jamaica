# Jamaica - Natural Beauty Catálogo

Catálogo virtual de productos de belleza natural y cuidado personal.

## 🌟 Características

- **PWA Instalable**: Instala como aplicación nativa en móviles
- **Diseño Responsivo**: Adaptable a todos los dispositivos
- **Catálogo Interactivo**: Búsqueda, filtrado y favoritos
- **Carrito de Compras**: Checkout vía WhatsApp
- **Generador PDF**: Descarga catálogo completo en PDF
- **Panel Admin**: Gestión de productos (clave: `jamaica123`)

## 📁 Estructura del Proyecto

```
├── index.html          # Página principal
├── productos.json      # Base de datos de productos
├── manifest.json       # Configuración PWA
├── sw.js              # Service Worker (offline)
├── css/               # Estilos modulares
├── js/                # Lógica JavaScript
├── img/               # Imágenes de productos
│   ├── miniaturas/    # Miniaturas PNG (sin fondo)
│   └── *.jpeg         # Imágenes completas
└── README.md          # Este archivo
```

## 🚀 Deploy en GitHub Pages

1. **Sube a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/catalogo-jamaica.git
   git push -u origin main
   ```

2. **Activa GitHub Pages**:
   - Ve a Settings > Pages
   - Selecciona `main` branch
   - Elige `/root` folder
   - Guarda y espera unos minutos

3. **Visita tu sitio**:
   ```
   https://tu-usuario.github.io/catalogo-jamaica/
   ```

## 📝 Mantenimiento

### **Actualizar productos**:
1. Edita `productos.json`
2. Agrega nuevas imágenes a `img/` y `img/miniaturas/`
3. Haz commit y push

### **Panel Admin**:
- Haz clic en el punto invisible debajo del footer
- Clave: `jamaica123`
- Genera JSON para nuevos productos

### **Imágenes**:
- **JPEG**: Para vistas detalladas (alta calidad)
- **PNG**: Para miniaturas (sin fondo, tamaño optimizado)

## 🛠 Tecnologías

- **Frontend**: HTML5, CSS3, Vanilla JavaScript ES6+
- **PWA**: Service Worker, Web App Manifest
- **Estilos**: CSS Grid, Flexbox, Glassmorphism
- **Datos**: JSON estático + localStorage

## 📱 PWA Features

- Instalable en pantalla de inicio
- Funciona offline (caché inteligente)
- Notificaciones push (futuro)
- Diseño adaptativo móvil-first

---

**Jamaica Natural Beauty** © 2026
