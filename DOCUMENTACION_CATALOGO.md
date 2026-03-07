# Catálogo Jamaica - Plataforma Estática de Alta Gama 🌿

Bienvenido a la documentación técnica del **Catálogo Natural Jamaica**. Este proyecto es una Single Page Application (SPA) completamente estática, rápida y gratuita, pensada para alojarse en **GitHub Pages**. Permite mostrar productos, armar un carrito de compras y generar pedidos que llegan estructurados a WhatsApp, sin necesidad de servidores, bases de datos complejas ni pagos mensuales.

## Características Principales
- 🚀 **100% Estática**: Servida mediante HTML, CSS y JS puro (Vanilla JavaScript).
- 📲 **Carrito de Compras y Pedidos por WhatsApp**: Permite a los clientes seleccionar productos y generar un mensaje proforma de pedido con subtotales y gran total para enviar directamente al WhatsApp del comercio.
- 🔐 **Panel de Administración Oculto**: Herramienta en la misma página (oculta bajo clave) para generar el código JSON de nuevos productos sin tocar directamente el código de diseño.
- 📱 **Diseño Netamente Responsivo**: Adaptable a todos los dispositivos (iPhone, Android, Tablets, Laptops, Monitores grandes).
- 🔍 **Zoom Dinámico e Interacciones**: Animaciones suaves, alertas de carga (toasts) y zoom para detalle de productos.
- 💾 **Persistencia con LocalStorage**: El carrito de los clientes no se borra al refrescar la página.

---

## Estructura de Archivos

Al iniciar o clonar el repositorio, debes tener la siguiente estructura de archivos:

```text
catalogo-jamaica/
│
├── index.html       # Interfaz visual de la tienda
├── style.css        # Hoja de estilos (Grid, responsividad, tema)
├── script.js        # Lógica de carrito, WhatsApp, modales y renderizado
├── productos.json   # Tu base de datos "estática" de productos
└── img/             # Carpeta para almacenar imágenes optimizadas (WebP/JPG)
```

---

## 1. Archivo `productos.json` (Base de Datos)

Crea este archivo primero. Es de donde el sistema extrae los productos dinámicamente.

```json
[
  {
    "id": "01",
    "titulo": "Termo-Protector Receta Natural",
    "descripcion": "Protección y suavidad para tu cabello con aloe vera, extracto de coco y keratina.",
    "precio": 35000,
    "imagen": "img/termo.jpg",
    "beneficios": [
      "Defiende contra daño por calor hasta 230°C",
      "Previene el frizz y puntas abiertas",
      "Sin siliconas ni parabenos"
    ],
    "disponible": true
  },
  {
    "id": "02",
    "titulo": "Aceite Bifásico Íntimo",
    "descripcion": "Frescura íntima y cuidado total para dejar tu piel suave y sedosa.",
    "precio": 28000,
    "imagen": "img/aceite.jpg",
    "beneficios": [
      "Suaviza e hidrata",
      "Agradable aroma",
      "Ingredientes 100% naturales no testados en animales"
    ],
    "disponible": true
  },
  {
    "id": "03",
    "titulo": "Acondicionador de Cebolla y Romero",
    "descripcion": "Fortalece y repara para un cabello saludable y renovado.",
    "precio": 30000,
    "imagen": "img/cebolla.jpg",
    "beneficios": [
      "Reduce significativamente la caída",
      "Hidrata profundamente",
      "Libre de crueldad animal y sulfatos pesados"
    ],
    "disponible": true
  }
]
```

---

## 2. Archivo `index.html` (Estructura y Panel Oculto)

Este archivo maneja tanto la vista del cliente como tu herramienta de administración secreta (en el _footer_).

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <!-- SEO Básico y Open Graph para previsualización al enviar por Wpp -->
    <title>Jamaica - Catálogo de Productos Naturales</title>
    <meta property="og:title" content="Jamaica - Catálogo Natural">
    <meta property="og:description" content="Productos de belleza natural y cuidado corporal de alta gama.">
    <!-- <link rel="icon" href="img/favicon.png" type="image/x-icon"> -->
    
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- CAJA DE NOTIFICACIONES (Toast) -->
    <div id="toast-notificacion">Mensaje base</div>

    <!-- CABECERA PRINCIPAL -->
    <header class="header">
        <h1>🌿 Jamaica</h1>
    </header>

    <!-- FILTRO BÁSICO (Opcional, expandible a futuro) -->
    <div class="filtros-container">
        <input type="text" id="buscador" placeholder="🔍 Buscar por nombre o código (Ej. 01)..." onkeyup="buscarProductos()">
    </div>

    <!-- CONTENEDOR CATÁLOGO DE PRODUCTOS -->
    <main id="catalogo" class="catalogo-grid">
        <!-- El contenido se renderiza por JS -->
    </main>

    <!-- BOTÓN CARRITO FLOTANTE -->
    <div id="cart-float" class="cart-float" onclick="abrirResumenCarrito()">
        🛒 <span id="cart-count">0</span>
    </div>

    <!-- MODAL DETALLE DE PRODUCTO -->
    <div id="modal-detalle" class="modal" style="display: none;">
        <div class="modal-content">
            <span class="close" onclick="cerrarModal()">&times;</span>
            <div class="modal-body-content">
                <div class="zoom-img">
                    <!-- Evento onmousemove para efecto zoom nativo si se desea programar, o solo hover en css -->
                    <img id="modal-img" src="" alt="Producto">
                </div>
                <div class="info-producto">
                    <h2 id="modal-titulo">Cargando...</h2>
                    <span id="modal-ref" class="ref-text"></span>
                    <p id="modal-desc" class="desc-text"></p>
                    <p class="precio-destacado" id="modal-precio"></p>
                    
                    <h3>Beneficios:</h3>
                    <ul id="modal-beneficios"></ul>
                    
                    <div class="selector-cantidad">
                        <button onclick="cambiarCantModal(-1)">-</button>
                        <input type="number" id="cant-prod" value="1" min="1" readonly>
                        <button onclick="cambiarCantModal(1)">+</button>
                    </div>
                    
                    <button class="btn-principal" id="btn-add-modal" onclick="">Agregar al Carrito</button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL RESUMEN DEL CARRITO (CHECKOUT WPP) -->
    <div id="modal-carrito" class="modal" style="display: none;">
        <div class="modal-content modal-carrito-content">
            <span class="close" onclick="cerrarCarrito()">&times;</span>
            <h2>🛒 Tu Pedido</h2>
            <div id="carrito-lista">
                <!-- Se inyecta la lista del carrito vía JS -->
            </div>
            <div class="resumen-total">
                <h3>Total a pagar: <span id="carrito-total-texto">$ 0</span></h3>
                <button class="btn-wpp" onclick="generarPedidoWpp()">📲 Enviar Pedido por WhatsApp</button>
                <button class="btn-limpiar" onclick="vaciarCarrito()">🗑️ Vaciar Carrito</button>
            </div>
        </div>
    </div>

    <!-- FOOTER E ICONO OCULTO PARA PANEL ADMIN -->
    <footer class="footer">
        <p>&copy; 2026 Jamaica Natural.</p>
        <!-- Engranaje oculto con opacidad mínima -->
        <span id="admin-trigger" style="cursor: pointer; opacity: 0.1; font-size:10px;">⚙️</span>
    </footer>

    <!-- PANEL ADMINISTRADOR (Oculto inicialmente) -->
    <div id="admin-panel" class="modal" style="display: none;">
        <div class="modal-content admin-box">
            <span class="close" onclick="cerrarAdmin()">&times;</span>
            <h3>🛡️ Panel de Registro de Producto</h3>
            
            <div id="login-admin">
                <input type="password" id="admin-pass" placeholder="Ingresa Clave (ej: jamaica123)">
                <button onclick="checkAccesoAdmin()">Entrar</button>
            </div>

            <div id="form-registro" style="display: none;">
                <label>ID / Ref (Ej: 04):</label>
                <input type="text" id="p-id">
                
                <label>Título:</label>
                <input type="text" id="p-titulo">
                
                <label>Descripción:</label>
                <textarea id="p-desc"></textarea>
                
                <label>Precio (Sin Puntos):</label>
                <input type="number" id="p-precio" placeholder="Ej: 35000">
                
                <label>Imagen (Ruta):</label>
                <input type="text" id="p-imagen" value="img/nueva.jpg">
                
                <label>Beneficios (Separados por coma):</label>
                <textarea id="p-beneficios" placeholder="Hidrata, Repara, etc."></textarea>
                
                <button class="btn-secundario" onclick="generarJSONProducto()">Generar Bloque de Código JSON</button>
                
                <p>Copia este texto y pégalo al final de tu productos.json:</p>
                <textarea id="output-json" readonly style="height: 150px; font-family: monospace;"></textarea>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

---

## 3. Archivo `style.css` (Diseño y Adaptabilidad)

Implementa la paleta de colores de la marca (dorados, tierra y acentos rosa suaves para aspecto "Premium Natural").

```css
/* VARIABLES GLOBALES Y RESET */
:root {
    --principal: #A67C52;    /* Tono Dorado / Ocre Natural */
    --acento: #D9799B;      /* Rosa / Salmón suave */
    --fondo: #faf7f2;       /* Blanco roto / Beige para dar calidez */
    --texto: #333333;       
    --wpp: #25D366;         /* Verde WhatsApp */
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--fondo); color: var(--texto); }

/* ENCABEZADOS Y FILTROS */
.header { text-align: center; padding: 25px 15px; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.header h1 { color: var(--principal); letter-spacing: 2px; text-transform: uppercase;}

.filtros-container { max-width: 1200px; margin: 20px auto 0; padding: 0 20px; text-align: center; }
.filtros-container input { width: 100%; max-width: 400px; padding: 12px 15px; border-radius: 20px; border: 1px solid #ddd; outline: none; transition: 0.3s; }
.filtros-container input:focus { border-color: var(--principal); }

/* GRILLA DE PRODUCTOS (RESPONSIVA) */
.catalogo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 50vh;
}

/* TARJETAS DE PRODUCTO (CARDS) */
.card {
    background: white; border-radius: 15px; overflow: hidden; position: relative;
    box-shadow: 0 4px 15px rgba(0,0,0,0.06); transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex; flex-direction: column;
}
.card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.12); }
.card img { width: 100%; height: 260px; object-fit: cover; }
.ref-badge { position: absolute; top: 12px; left: 12px; background: var(--principal); color: white; padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; z-index: 10; }
.badge-agotado { background: #555; }
.card-info { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
.card-info h3 { font-size: 1.1rem; margin-bottom: 10px; color: #222; }
.card-info .precio { font-size: 1.3rem; font-weight: 600; color: var(--principal); margin-bottom: 15px; }
.botones-card { margin-top: auto; display: flex; gap: 10px; }
.btn-ver, .btn-add { flex: 1; padding: 10px 0; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s;}
.btn-ver { background: #f0f0f0; color: var(--texto); }
.btn-ver:hover { background: #e0e0e0; }
.btn-add { background: var(--acento); color: white; }
.btn-add:hover { background: #c66687; opacity: 0.9; }
.foto-agotado { filter: grayscale(100%); opacity: 0.7;}

/* CARRITO FLOTANTE */
.cart-float { position: fixed; bottom: 25px; right: 25px; background: var(--principal); color: white; width: 65px; height: 65px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; box-shadow: 0 8px 20px rgba(166,124,82,0.4); z-index: 999; transition: transform 0.2s; }
.cart-float:hover { transform: scale(1.05); }
.cart-float span { position: absolute; top: 3px; right: 3px; background: var(--acento); color: white; font-size: 0.75rem; padding: 4px 8px; border-radius: 50%; font-weight: bold; border: 2px solid white; }

/* MODALES */
.modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
.modal-content { background: white; padding: 25px; border-radius: 15px; position: relative; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; }
.close { position: absolute; top: 15px; right: 20px; font-size: 1.8rem; cursor: pointer; color: #666; transition: 0.2s;}
.close:hover { color: red; }

/* INTERIOR MODAL DE PRODUCTO */
.modal-body-content { display: flex; gap: 30px; }
.zoom-img { flex: 1; overflow: hidden; border-radius: 10px; }
.zoom-img img { width: 100%; height: 100%; max-height: 400px; object-fit: contain; border-radius: 10px; transition: transform 0.4s ease; cursor: crosshair; }
.zoom-img img:hover { transform: scale(1.4); } 
.info-producto { flex: 1; display:flex; flex-direction:column; justify-content: center;}
.precio-destacado { font-size: 1.6rem; color: var(--principal); font-weight: bold; margin: 15px 0; }
.ref-text { display: inline-block; background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin: 8px 0; }
ul#modal-beneficios { list-style: none; margin-bottom: 20px; }
ul#modal-beneficios li { padding-left: 25px; position: relative; margin-bottom: 8px; line-height: 1.4; }
ul#modal-beneficios li::before { content: '✅'; position: absolute; left: 0; font-size: 0.9rem; }
.selector-cantidad { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.selector-cantidad button { background: #eee; border: none; width: 35px; height: 35px; font-size: 1.2rem; border-radius: 5px; cursor: pointer; }
.selector-cantidad input { width: 50px; text-align: center; height: 35px; border: 1px solid #ddd; border-radius: 5px; font-weight: bold; }
.btn-principal { background: var(--acento); color: white; padding: 15px; text-transform: uppercase; font-weight: bold; font-size: 1rem; border: none; border-radius: 8px; cursor: pointer; transition: 0.3s; }
.btn-principal:hover { background: #c66687; }

/* MODAL CARRITO */
.modal-carrito-content { max-width: 500px; }
.item-carrito { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; padding: 15px 0; }
.item-info h4 { font-size: 1rem; color: #333; margin-bottom: 4px;}
.resumen-total { margin-top: 25px; border-top: 2px dashed #ccc; padding-top: 20px; }
.resumen-total h3 { text-align: right; color: var(--principal); font-size: 1.5rem; margin-bottom: 20px; }
.btn-wpp { background: var(--wpp); color: white; width: 100%; border: none; padding: 15px; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; margin-bottom: 10px; transition: 0.3s; }
.btn-wpp:hover { background: #1ebe56; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(37,211,102,0.3); }
.btn-limpiar { background: none; border: 1px solid #ccc; color: #666; width: 100%; padding: 10px; border-radius: 8px; cursor: pointer; }
.btn-limpiar:hover { background: #fee; color: red; border-color: red;}
.item-acciones { display: flex; align-items: center; gap: 10px; }
.btn-eliminar-item { background: none; border: none; color: red; font-size: 1.2rem; cursor: pointer; }

/* PANEL ADMIN */
.admin-box input, .admin-box textarea { width: 100%; margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
.admin-box label { font-size: 0.85rem; color: #666; margin-bottom: 5px; display: block; }
.btn-secundario { background: #333; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; width: 100%; margin-bottom: 15px; }

/* TOAST NOTIFICACION */
#toast-notificacion { position: fixed; top: -100px; left: 50%; transform: translateX(-50%); background: #333; color: white; padding: 12px 25px; border-radius: 30px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: 0.4s ease; z-index: 2000; text-align: center; font-size: 0.9rem;}
#toast-notificacion.show { top: 30px; }
#toast-notificacion.error { background: #E74C3C; }
#toast-notificacion.success { background: #27AE60; }

/* MEDIA QUERIES (Móvil) */
@media (max-width: 768px) {
    .modal-body-content { flex-direction: column; gap: 15px; }
    .zoom-img img { max-height: 250px; }
    .cart-float { bottom: 15px; right: 15px; width: 55px; height: 55px; font-size: 1.2rem;}
    .precio-destacado { font-size: 1.4rem; }
    ul#modal-beneficios li { font-size: 0.9rem; }
}

/* FOOTER */
.footer { text-align: center; padding: 30px 15px; background: white; margin-top: 50px; color: #888; font-size: 0.9rem; position: relative;}
```

---

## 4. Archivo `script.js` (Motor Completo del E-Commerce)

Esta es la lógica ("El Controlador") del sistema, diseñada con programación funcional y modular basada en el patrón MVC.

```javascript
/* =========================================
   1. ESTADO GLOBAL DE LA APP ⚙️
========================================= */
const TelefonoEmpresa = "573001234567"; // IMPORTANTE: Cambia al número real SIN +
const ClaveAdmin = "jamaica123";

let dbProductos = []; // Base de datos copiada en runtime
let carrito = [];
let productoSeleccionadoTemporal = null; // Guarda id al abrir modal

/* =========================================
   2. INICIALIZACIÓN Y CARGA 🚀
========================================= */
window.onload = () => {
    cargarBaseDatos();
    recuperarCarrito();
};

async function cargarBaseDatos() {
    try {
        const respuesta = await fetch('productos.json');
        dbProductos = await respuesta.json();
        renderizarCatalogo(dbProductos);
    } catch (error) {
        console.error("Error cargando productos.json:", error);
        mostrarToast("Hubo un error cargando el catálogo.", "error");
    }
}

function renderizarCatalogo(lista) {
    const contenedor = document.getElementById('catalogo');
    if(lista.length === 0) {
        contenedor.innerHTML = `<h3 style="text-align:center; color:#666; grid-column:1/-1;">No se encontraron productos...</h3>`;
        return;
    }
    
    contenedor.innerHTML = lista.map(p => {
        const estadoVenta = p.disponible !== false ? '' : 'foto-agotado';
        const txtBoton = p.disponible !== false ? 'Añadir ➕' : 'Agotado 🚫';
        const funcBoton = p.disponible !== false ? `agregarRapido('${p.id}')` : '';
        const clBadge = p.disponible !== false ? '' : 'badge-agotado';
        
        return `
            <div class="card">
                <div class="ref-badge ${clBadge}">REF: ${p.id}</div>
                <img src="${p.imagen}" alt="${p.titulo}" class="${estadoVenta}" onerror="this.src='https://via.placeholder.com/300?text=Sin+Imagen'">
                <div class="card-info">
                    <h3>${p.titulo}</h3>
                    <p class="precio">${formatearMoneda(p.precio)}</p>
                    <div class="botones-card">
                        <button class="btn-ver" onclick="abrirSombraDetalle('${p.id}')">👁️ Detalles</button>
                        <button class="btn-add" onclick="${funcBoton}" ${p.disponible === false ? 'disabled' : ''}>${txtBoton}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function buscarProductos() {
    const termino = document.getElementById('buscador').value.toLowerCase();
    const filtrados = dbProductos.filter(p => 
        p.titulo.toLowerCase().includes(termino) || p.id.toLowerCase().includes(termino)
    );
    renderizarCatalogo(filtrados);
}

/* =========================================
   3. FORMATEO Y UTILIDADES 🛠️
========================================= */
function formatearMoneda(valor) {
    return "$" + valor.toLocaleString('es-CO');
}

function mostrarToast(mensaje, tipo = "success") {
    const toast = document.getElementById('toast-notificacion');
    toast.innerText = mensaje;
    toast.className = tipo === 'success' ? 'show success' : 'show error';
    setTimeout(() => { toast.className = toast.className.replace('show', '').trim(); }, 3000);
}

/* =========================================
   4. MODAL DETALLES DEL PRODUCTO 🔍
========================================= */
function abrirSombraDetalle(id) {
    const prod = dbProductos.find(p => p.id === id);
    if (!prod) return;

    productoSeleccionadoTemporal = prod.id;
    document.getElementById('cant-prod').value = 1; // Resetear cantidad a 1
    
    document.getElementById('modal-img').src = prod.imagen;
    document.getElementById('modal-titulo').innerText = prod.titulo;
    document.getElementById('modal-ref').innerText = `Referencia: ${prod.id}`;
    document.getElementById('modal-desc').innerText = prod.descripcion;
    document.getElementById('modal-precio').innerText = formatearMoneda(prod.precio);
    
    const listaB = document.getElementById('modal-beneficios');
    listaB.innerHTML = prod.beneficios.map(b => `<li>${b}</li>`).join('');
    
    // Configurar el botón de agregar
    const btnAdd = document.getElementById('btn-add-modal');
    if (prod.disponible === false) {
        btnAdd.innerText = "Agotado Temporalmente";
        btnAdd.style.background = "#888";
        btnAdd.disabled = true;
    } else {
        btnAdd.innerText = "Agregar al Carrito";
        btnAdd.style.background = ""; // resetea a CSS base
        btnAdd.disabled = false;
        btnAdd.onclick = () => procesarAgregarDesdeModal();
    }
    
    document.getElementById('modal-detalle').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Bloquea scroll del fondo
}

function cerrarModal() {
    document.getElementById('modal-detalle').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura scroll
}

function cambiarCantModal(delta) {
    const input = document.getElementById('cant-prod');
    let nuevoValor = parseInt(input.value) + delta;
    if (nuevoValor < 1) nuevoValor = 1;
    input.value = nuevoValor;
}

function procesarAgregarDesdeModal() {
    const cant = parseInt(document.getElementById('cant-prod').value);
    agregarLogica(productoSeleccionadoTemporal, cant);
    cerrarModal();
}

function agregarRapido(id) {
    agregarLogica(id, 1);
}

/* =========================================
   5. SISTEMA DEL CARRITO 🛒
========================================= */
function agregarLogica(id, cantNum) {
    const prodBD = dbProductos.find(p => p.id === id);
    if (!prodBD) return;

    const existeIndex = carrito.findIndex(item => item.id === id);
    
    if (existeIndex >= 0) {
        carrito[existeIndex].cantidad += cantNum;
    } else {
        carrito.push({
            id: prodBD.id,
            titulo: prodBD.titulo,
            precio: prodBD.precio,
            cantidad: cantNum
        });
    }

    guardarCarrito();
    animarBotonFlotante();
    mostrarToast(`Se agregó ${cantNum}x ${prodBD.titulo} al carrito.`);
}

function actualizarInterfazCarritoResumen() {
    const contador = carrito.reduce((acc, obj) => acc + obj.cantidad, 0);
    document.getElementById('cart-count').innerText = contador;
    
    const cajaCart = document.getElementById('cart-float');
    if (contador > 0) {
        cajaCart.style.border = "3px solid var(--wpp)"; // Indicador visual de que tiene items
    } else {
        cajaCart.style.border = "none";
    }
}

function persistirDatos() {
    localStorage.setItem('jamaica_carrito', JSON.stringify(carrito));
}

function guardarCarrito() {
    persistirDatos();
    actualizarInterfazCarritoResumen();
}

function recuperarCarrito() {
    const guardado = localStorage.getItem('jamaica_carrito');
    if (guardado) {
        carrito = JSON.parse(guardado);
        actualizarInterfazCarritoResumen();
    }
}

function animarBotonFlotante() {
    const btn = document.getElementById('cart-float');
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
}

/* =========================================
   6. CHECKOUT Y WHATSAPP 📞
========================================= */
function abrirResumenCarrito() {
    const modal = document.getElementById('modal-carrito');
    const cajaLista = document.getElementById('carrito-lista');
    let totalAcumulado = 0;

    if (carrito.length === 0) {
        cajaLista.innerHTML = "<p style='text-align:center; padding: 20px;'>No tienes productos en tu carrito aún 🌱</p>";
    } else {
        cajaLista.innerHTML = carrito.map((item, index) => {
            const subtotal = item.precio * item.cantidad;
            totalAcumulado += subtotal;
            return `
                <div class="item-carrito">
                    <div class="item-info">
                        <h4>REF: ${item.id} - ${item.titulo}</h4>
                        <p>${item.cantidad} x ${formatearMoneda(item.precio)}</p>
                    </div>
                    <div class="item-acciones">
                        <strong>${formatearMoneda(subtotal)}</strong>
                        <button class="btn-eliminar-item" onclick="eliminarFila(${index})">❌</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    document.getElementById('carrito-total-texto').innerText = formatearMoneda(totalAcumulado);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
    document.getElementById('modal-carrito').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura scroll general
}

function eliminarFila(indexArray) {
    carrito.splice(indexArray, 1);
    guardarCarrito();
    abrirResumenCarrito(); // Refresca UI
}

function vaciarCarrito() {
    if(confirm("¿Estás seguro de vaciar todo el pedido?")) {
        carrito = [];
        guardarCarrito();
        abrirResumenCarrito();
        mostrarToast("Carrito vaciado");
    }
}

function generarPedidoWpp() {
    if (carrito.length === 0) {
        mostrarToast("Agrega al menos un producto primero.", "error");
        return;
    }

    let mensajeCortesia = "Hola Jamaica 🌿. Quiero realizar el siguiente pedido por favor:\n\n";
    let sumaFinal = 0;

    carrito.forEach(p => {
        const dSubT = p.precio * p.cantidad;
        sumaFinal += dSubT;
        mensajeCortesia += `🛍️ *REF ${p.id}* - ${p.titulo}\n`;
        mensajeCortesia += `    ↳ Cant: ${p.cantidad} x ${formatearMoneda(p.precio)} = *${formatearMoneda(dSubT)}*\n\n`;
    });

    mensajeCortesia += `--- \n💰 *TOTAL A PAGAR: ${formatearMoneda(sumaFinal)}*`;

    const url = `https://wa.me/${TelefonoEmpresa}?text=${encodeURIComponent(mensajeCortesia)}`;
    window.open(url, '_blank');
}

/* =========================================
   7. PANEL ADMINISTRADOR (SECRET BACKDOOR) ⚙️
========================================= */
document.getElementById('admin-trigger').onclick = () => {
    document.getElementById('admin-panel').style.display = 'flex';
};

function cerrarAdmin() {
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('form-registro').style.display = 'none';
    document.getElementById('login-admin').style.display = 'block';
    document.getElementById('admin-pass').value = '';
}

function checkAccesoAdmin() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === ClaveAdmin) {
        document.getElementById('login-admin').style.display = 'none';
        document.getElementById('form-registro').style.display = 'block';
    } else {
        alert("Acceso denegado: Código incorrecto.");
    }
}

function generarJSONProducto() {
    // Extracción
    const _id = document.getElementById('p-id').value.trim();
    const _tit = document.getElementById('p-titulo').value.trim();
    const _desc = document.getElementById('p-desc').value.trim();
    const _pre = parseInt(document.getElementById('p-precio').value);
    const _img = document.getElementById('p-imagen').value.trim();
    const _benString = document.getElementById('p-beneficios').value;
    
    // Validación mínima
    if(!_id || !_tit || isNaN(_pre)) {
        alert("Llena los campos ID, Título y Precio.");
        return;
    }

    // Split mapa
    const arrayBeneficios = _benString.split(',').map(str=> str.trim()).filter(Boolean);

    const objetoGenerado = {
        id: _id,
        titulo: _tit,
        descripcion: _desc,
        precio: _pre,
        imagen: _img,
        beneficios: arrayBeneficios,
        disponible: true
    };

    const outText = document.getElementById('output-json');
    // Genera el estring crudo formateado para agregar coma
    // Ojo, al pegarlo manual se debe cuidar la sintaxis JSON del array maestro
    outText.value = ",\n" + JSON.stringify(objetoGenerado, null, 2);
    outText.select();
    mostrarToast("¡Código generado! Cópialo y pégalo.");
}
```

---

## 🔥 Paso a Paso: Puesta en Producción (GitHub Pages)

Para que tu sitio empiece a generar ventas, debes compilar todo este esfuerzo en los servidores gratuitos de Microsoft GitHub.

1. **Configura el código inicial**:
   - En tu entorno local de VS Code (`c:\Users\kevin\Desktop\catalogo-jamaica`), crea estos cuatro archivos (`index.html`, `style.css`, `script.js` y `productos.json`) pegando el código suministrado arriba.
   - Crea una sub-carpeta llamada `img` y guarda dentro de ella 3 imágenes (ej. `termo.jpg`, `aceite.jpg`, `cebolla.jpg`).

2. **Personaliza tus datos de contacto en `script.js`**:
   - En la línea 4, sustituye la variable `TelefonoEmpresa` con el tuyo real: `const TelefonoEmpresa = "573000000000";` (El 57 es para Colombia. Elimina cualquier signo `+` u espacio extra).

3. **Inyectar el código a GitHub (Git Push)**:
```bash
git add .
git commit -m "Inicialización de la plataforma Jamaica V1"
git branch -M main
git remote add origin https://github.com/Andrewgo12/catalogo-jamaica.git
git push -u origin main
```

4. **Publicar en Internet**:
   - Ingresa a tu repositorio en la plataforma web de GitHub (https://github.com/Andrewgo12/catalogo-jamaica).
   - Ve a `Settings` > `Pages`.
   - Bajo **Build and deployment > Branch**, selecciona `main` y guarda ('Save').
   - Tras unos segundos/minutos, el enlace de tu tienda estará allí activo (ej: `https://andrewgo12.github.io/catalogo-jamaica`).

5. **Ajuste del Dominio Personalizado** (El detalle "Profesional" exigido):
   - Una vez que adquieras tu dominio real (por ejemplo `recetasjamaica.com`), configuras en el registrador u proveedor de hosting (GoDaddy, HostGator) los siguientes DNS:
     - Registro **A** apuntando a IPs estándar de GitHub (ej: `185.199.108.153` o variantes documentadas allí).
     - Registro **CNAME** indicando que el host `www` apunta a `andrewgo12.github.io`.
   - Regresas en GitHub a la pestaña `Settings > Pages`, digitas en el recuadro 'Custom domain' la dirección "www.recetasjamaica.com" y activas la casilla **[x] Enforce HTTPS**. 

---
_Cualquier adición o modificación de productos en el futuro la haces directamente abriendo la rueda dentada invisible del Footer (Clave: `jamaica123`), generas el JSON, lo pegas en `productos.json` usando el Bloc de Notas/VSCode, y corres git push. ¡Un sistema robusto y en costo $0!_
