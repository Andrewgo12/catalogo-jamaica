# Catálogo Jamaica - Plataforma Estática de Alta Gama 🌿 (Versión Pro)

Bienvenido a la documentación técnica exhaustiva del **Catálogo Natural Jamaica**. Este proyecto es una Single Page Application (SPA) completamente estática, rápida y gratuita, pensada para alojarse en **GitHub Pages**.

Esta versión ampliada incluye **todas las funcionalidades de grado profesional** conversadas: Filtros de categorías, Favoritos (Wishlist), historial de navegación (botón Atrás del móvil no saca al usuario del sitio), carga inteligente (Skeleton y Lazy loading) y analítica anónima basada en clics.

---

## Estructura de Archivos

Al iniciar o clonar el repositorio, debes tener la siguiente estructura de archivos:

```text
catalogo-jamaica/
│
├── index.html       # Interfaz visual de la tienda
├── style.css        # Hoja de estilos (Grid, responsividad, animaciones)
├── script.js        # Lógica de carrito, Modales con History API, Favoritos y Panel Admin
├── productos.json   # Tu base de datos "estática" de productos
└── img/             # Carpeta para almacenar imágenes en formato WebP/JPG
```

---

## 1. Archivo `productos.json` (Base de Datos)

Se añadió la propiedad `"categoria"` para hacer funcionar los filtros y `"oferta"` para destacar productos.

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
    "disponible": true,
    "categoria": "capilar",
    "oferta": false
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
    "disponible": true,
    "categoria": "intimo",
    "oferta": true
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
    "disponible": false,
    "categoria": "capilar",
    "oferta": false
  }
]
```

---

## 2. Archivo `index.html` (Estructura y Panel Oculto)

Se agregan categorías, soporte de Lazy Loading, estructura para Favs (Wishlist) y estados vacíos.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <!-- SEO Básico y Open Graph -->
    <title>Jamaica - Catálogo de Productos Naturales</title>
    <meta name="description" content="Catálogo virtual de Jamaica Natural. Pide por WhatsApp rápidamente.">
    <meta property="og:title" content="Jamaica - Catálogo Natural">
    <meta property="og:description" content="Productos de belleza natural y cuidado corporal de alta gama.">
    <meta property="og:image" content="https://tudominio.com/img/logo-share.jpg">
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

    <!-- ZONA DE BÚSQUEDA Y CATEGORÍAS -->
    <div class="filtros-container">
        <input type="text" id="buscador" placeholder="🔍 Buscar por nombre o código (Ej. 01)..." onkeyup="buscarProductos()">
        
        <div class="categorias-scroll">
            <button class="cat-btn activo" onclick="filtrarCategoria('todos')">Todos</button>
            <button class="cat-btn" onclick="filtrarCategoria('capilar')">Capilar</button>
            <button class="cat-btn" onclick="filtrarCategoria('intimo')">Cuidado Íntimo</button>
            <button class="cat-btn" onclick="filtrarCategoria('favoritos')">❤️ Mis Favoritos</button>
        </div>
    </div>

    <!-- CONTENEDOR CATÁLOGO DE PRODUCTOS -->
    <main id="catalogo" class="catalogo-grid">
        <!-- Skeleton Loaders iniciales -->
        <div class="card skeleton"><div class="skel-img"></div><div class="skel-text"></div></div>
        <div class="card skeleton"><div class="skel-img"></div><div class="skel-text"></div></div>
        <div class="card skeleton"><div class="skel-img"></div><div class="skel-text"></div></div>
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
                    <img id="modal-img" src="" alt="Producto" loading="lazy">
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
                    
                    <button class="btn-principal" id="btn-add-modal">Agregar al Carrito</button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL RESUMEN DEL CARRITO (CHECKOUT WPP) -->
    <div id="modal-carrito" class="modal" style="display: none;">
        <div class="modal-content modal-carrito-content">
            <span class="close" onclick="cerrarCarrito()">&times;</span>
            <h2>🛒 Tu Pedido</h2>
            <div id="carrito-lista"></div>
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
        <span id="admin-trigger" style="cursor: pointer; opacity: 0.1; font-size:10px;">⚙️</span>
    </footer>

    <!-- PANEL ADMINISTRADOR (Oculto) -->
    <div id="admin-panel" class="modal" style="display: none;">
        <div class="modal-content admin-box">
            <span class="close" onclick="cerrarAdmin()">&times;</span>
            <h3>🛡️ Panel de Registro de Producto</h3>
            
            <div id="login-admin">
                <input type="password" id="admin-pass" placeholder="Ingresa Clave (jamaica123)">
                <button onclick="checkAccesoAdmin()" class="btn-secundario">Entrar</button>
            </div>

            <div id="form-registro" style="display: none;">
                <label>ID / Ref (Ej: 04):</label><input type="text" id="p-id">
                <label>Título:</label><input type="text" id="p-titulo">
                <label>Descripción:</label><textarea id="p-desc"></textarea>
                <label>Precio (Sin Puntos):</label><input type="number" id="p-precio">
                <label>Categoría:</label>
                <select id="p-categoria" style="width:100%; margin-bottom:15px; padding:10px;">
                    <option value="capilar">Capilar</option>
                    <option value="intimo">Cuidado Íntimo</option>
                    <option value="facial">Facial</option>
                </select>
                <label>Imagen (Ruta URL):</label><input type="text" id="p-imagen" value="img/nueva.jpg">
                <label>Beneficios (Separados por coma):</label><textarea id="p-beneficios"></textarea>
                
                <button class="btn-secundario" onclick="generarJSONProducto()">Generar Código JSON</button>
                <textarea id="output-json" readonly style="height: 150px; font-family: monospace;"></textarea>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

---

## 3. Archivo `style.css` (Diseños Avanzados y Animaciones)

Se incluyen estilos para Skeleton screen, botones de favoritos, scroll horizontal de categorías y badgets de ofertas.

```css
:root {
    --principal: #A67C52;
    --acento: #D9799B;
    --fondo: #faf7f2;
    --texto: #333333;
    --wpp: #25D366;
    --favorito: #ff4757;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--fondo); color: var(--texto); -webkit-tap-highlight-color: transparent; }

/* ENCABEZADOS Y FILTROS */
.header { text-align: center; padding: 25px 15px; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.header h1 { color: var(--principal); letter-spacing: 2px; text-transform: uppercase;}

.filtros-container { max-width: 1200px; margin: 20px auto 0; padding: 0 20px; text-align: center; }
.filtros-container input { width: 100%; max-width: 400px; padding: 12px 15px; border-radius: 20px; border: 1px solid #ddd; outline: none; transition: 0.3s; margin-bottom: 15px; }
.filtros-container input:focus { border-color: var(--principal); }

/* CATEGORÍAS TIPO PILL - SCROLL HORIZONTAL EN MÓVIL */
.categorias-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; justify-content: center; }
.categorias-scroll::-webkit-scrollbar { height: 4px; }
.categorias-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
.cat-btn { padding: 8px 16px; border: 1px solid var(--principal); border-radius: 20px; background: transparent; color: var(--principal); cursor: pointer; white-space: nowrap; transition: 0.3s; font-weight: 500;}
.cat-btn.activo, .cat-btn:hover { background: var(--principal); color: white; }

/* GRILLA Y TARJETAS */
.catalogo-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px;
    padding: 30px 20px; max-width: 1200px; margin: 0 auto; min-height: 50vh;
}
.card {
    background: white; border-radius: 15px; overflow: hidden; position: relative;
    box-shadow: 0 4px 15px rgba(0,0,0,0.06); transition: transform 0.3s ease; display: flex; flex-direction: column;
}
.card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.12); }
.card img { width: 100%; height: 260px; object-fit: cover; }
.foto-agotado { filter: grayscale(100%); opacity: 0.7;}

/* ETIQUETAS Y FAVORITOS */
.ref-badge { position: absolute; top: 12px; left: 12px; background: var(--principal); color: white; padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; z-index: 10; }
.badge-agotado { background: #555; }
.oferta-badge { position: absolute; top: 12px; right: 12px; background: var(--acento); color: white; padding: 5px 10px; border-radius: 6px; font-weight: bold; font-size: 0.8rem; z-index: 10;}

.btn-fav { position: absolute; bottom: 180px; right: 15px; background: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer; transition: 0.3s; z-index: 10; }
.btn-fav.es-fav { color: var(--favorito); }
.btn-fav:active { transform: scale(0.8); }

/* CONTENIDO TARJETA */
.card-info { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
.card-info h3 { font-size: 1.1rem; margin-bottom: 10px; color: #222; }
.card-info .precio { font-size: 1.3rem; font-weight: 600; color: var(--principal); margin-bottom: 15px; }
.botones-card { margin-top: auto; display: flex; gap: 10px; }
.btn-ver, .btn-add { flex: 1; padding: 10px 0; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s;}
.btn-ver { background: #f0f0f0; color: var(--texto); }
.btn-ver:hover { background: #e0e0e0; }
.btn-add { background: var(--acento); color: white; }
.btn-add:hover { background: #c66687; }
.btn-add:disabled { background: #ccc; cursor: not-allowed; }

/* SKELETON LOADER (Carga Simulada) */
.skeleton { background: #fff; }
.skeleton .skel-img { width: 100%; height: 260px; background: #eee; animation: pulse 1.5s infinite ease-in-out; }
.skeleton .skel-text { width: 80%; height: 20px; background: #eee; margin: 20px; border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
@keyframes pulse { 0% { background-color: #eee; } 50% { background-color: #e0e0e0; } 100% { background-color: #eee; } }

/* ESTADO VACÍO */
.empty-state { grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: #777; font-size: 1.2rem; }

/* MODALES Y CARRITO FLOTANTE */
.cart-float { position: fixed; bottom: 25px; right: 25px; background: var(--principal); color: white; width: 65px; height: 65px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; box-shadow: 0 8px 20px rgba(166,124,82,0.4); z-index: 999; transition: 0.2s; }
.cart-float span { position: absolute; top: 3px; right: 3px; background: var(--acento); font-size: 0.75rem; padding: 4px 8px; border-radius: 50%; border: 2px solid white; font-weight: bold; }

.modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
.modal-content { background: white; padding: 25px; border-radius: 15px; position: relative; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; }
.close { position: absolute; top: 15px; right: 20px; font-size: 1.8rem; cursor: pointer; color: #666; }

.modal-body-content { display: flex; gap: 30px; }
.zoom-img { flex: 1; overflow: hidden; border-radius: 10px; }
.zoom-img img { width: 100%; height: 100%; max-height: 400px; object-fit: contain; transition: transform 0.4s ease; cursor: crosshair; }
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
.btn-principal { background: var(--acento); color: white; padding: 15px; text-transform: uppercase; font-weight: bold; font-size: 1rem; border: none; border-radius: 8px; cursor: pointer; }
.btn-principal:hover { background: #c66687; }

/* CARRITO CHECKOUT */
.modal-carrito-content { max-width: 500px; }
.item-carrito { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; padding: 15px 0; }
.item-info h4 { font-size: 1rem; margin-bottom: 4px;}
.resumen-total { margin-top: 25px; border-top: 2px dashed #ccc; padding-top: 20px; }
.resumen-total h3 { text-align: right; color: var(--principal); font-size: 1.5rem; margin-bottom: 20px; }
.btn-wpp { background: var(--wpp); color: white; width: 100%; border: none; padding: 15px; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; margin-bottom: 10px; transition: 0.3s; }
.btn-wpp:hover { background: #1ebe56; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(37,211,102,0.3); }
.btn-limpiar { background: none; border: 1px solid #ccc; color: #666; width: 100%; padding: 10px; border-radius: 8px; cursor: pointer; }

/* PANEL ADMIN */
.admin-box input, .admin-box textarea, .admin-box select { width: 100%; margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
.admin-box label { font-size: 0.85rem; color: #666; margin-bottom: 5px; display: block; }
.btn-secundario { background: #333; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; width: 100%; margin-bottom: 15px; }

/* TOAST */
#toast-notificacion { position: fixed; top: -100px; left: 50%; transform: translateX(-50%); background: #333; color: white; padding: 12px 25px; border-radius: 30px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: 0.4s ease; z-index: 2000; font-size: 0.9rem;}
#toast-notificacion.show { top: 30px; }

@media (max-width: 768px) {
    .modal-body-content { flex-direction: column; gap: 15px; }
    .zoom-img img { max-height: 250px; }
    .categorias-scroll { justify-content: flex-start; padding-left: 10px; }
}

.footer { text-align: center; padding: 30px 15px; background: white; margin-top: 50px; color: #888; font-size: 0.9rem;}
```

---

## 4. Archivo `script.js` (Ecosistema Completo con UX/UI Avanzada)

Incorpora **Favoritos, Clic Tracking, Historial de Navegación Móvil (History API)** y renderización dinámica sin recargas.

```javascript
/* =========================================
   1. ESTADO GLOBAL DE LA APP ⚙️
========================================= */
const TelefonoEmpresa = "573001234567"; // Número real
const ClaveAdmin = "jamaica123";

let dbProductos = []; 
let carrito = [];
let favoritos = [];
let categoriaActual = 'todos';
let productoSeleccionadoTemporal = null; 

/* =========================================
   2. INICIALIZACIÓN Y FETCH 🚀
========================================= */
window.onload = () => {
    recuperarEstadoLocal(); // Carrito y Favoritos
    cargarBaseDatos();
    configurarHistoryAPI();
};

async function cargarBaseDatos() {
    try {
        const respuesta = await fetch('productos.json');
        dbProductos = await respuesta.json();
        renderizarCatalogo(dbProductos);
    } catch (error) {
        mostrarToast("Error cargando el catálogo.", "error");
        document.getElementById('catalogo').innerHTML = '<p class="empty-state">Error al conectar con la base de datos.</p>';
    }
}

function recuperarEstadoLocal() {
    const carritoGuardado = localStorage.getItem('jamaica_carrito');
    if (carritoGuardado) carrito = JSON.parse(carritoGuardado);
    
    const favGuardados = localStorage.getItem('jamaica_favs');
    if (favGuardados) favoritos = JSON.parse(favGuardados);
    
    actualizarInterfazCarritoResumen();
}

/* =========================================
   3. RENDERIZADO, FILTROS Y BÚSQUEDA 🔎
========================================= */
function renderizarCatalogo(lista) {
    const contenedor = document.getElementById('catalogo');
    
    if(lista.length === 0) {
        contenedor.innerHTML = `<div class="empty-state">No se encontraron productos en esta categoría o búsqueda. 🥀</div>`;
        return;
    }
    
    contenedor.innerHTML = lista.map(p => {
        const agotado = p.disponible === false;
        const claseAgotado = agotado ? 'foto-agotado' : '';
        const txtBoton = agotado ? 'Agotado 🚫' : 'Añadir ➕';
        const funcBoton = agotado ? '' : `agregarRapido('${p.id}')`;
        const badgeHTML = agotado ? `<div class="ref-badge badge-agotado">REF: ${p.id}</div>` 
                                  : `<div class="ref-badge">REF: ${p.id}</div>`;
        const ofertaHTML = p.oferta ? `<div class="oferta-badge">✨ Oferta</div>` : '';
        
        const esFav = favoritos.includes(p.id) ? 'es-fav' : '';
        const corazon = favoritos.includes(p.id) ? '❤️' : '🤍';

        return `
            <div class="card">
                ${badgeHTML}
                ${ofertaHTML}
                <button class="btn-fav ${esFav}" onclick="toggleFavorito('${p.id}')" id="fav-${p.id}">${corazon}</button>
                <img src="${p.imagen}" alt="${p.titulo}" class="${claseAgotado}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=Error'">
                <div class="card-info">
                    <h3>${p.titulo}</h3>
                    <p class="precio">${formatearMoneda(p.precio)}</p>
                    <div class="botones-card">
                        <button class="btn-ver" onclick="abrirSombraDetalle('${p.id}')">👁️ Detalles</button>
                        <button class="btn-add" onclick="${funcBoton}" ${agotado ? 'disabled' : ''}>${txtBoton}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filtrarCategoria(cat) {
    categoriaActual = cat;
    
    // Actualizar botones visuales
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('activo'));
    event.target.classList.add('activo');
    
    // Limpiar buscador
    document.getElementById('buscador').value = '';

    let filtrados = dbProductos;
    if (cat === 'favoritos') {
        filtrados = dbProductos.filter(p => favoritos.includes(p.id));
    } else if (cat !== 'todos') {
        filtrados = dbProductos.filter(p => p.categoria === cat);
    }
    
    renderizarCatalogo(filtrados);
}

function buscarProductos() {
    const termino = document.getElementById('buscador').value.toLowerCase();
    
    // Reiniciar visualmente las categorias a 'Todos' si busca
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('activo'));
    document.querySelector("button[onclick=\"filtrarCategoria('todos')\"]").classList.add('activo');
    categoriaActual = 'todos';

    const filtrados = dbProductos.filter(p => 
        p.titulo.toLowerCase().includes(termino) || p.id.toLowerCase().includes(termino)
    );
    renderizarCatalogo(filtrados);
}

/* =========================================
   4. FAVORITOS Y ANALÍTICA (TRACKING) ❤️
========================================= */
function toggleFavorito(id) {
    const idx = favoritos.indexOf(id);
    if (idx > -1) {
        favoritos.splice(idx, 1);
        mostrarToast("Eliminado de Favoritos");
    } else {
        favoritos.push(id);
        mostrarToast("¡Añadido a Favoritos! ❤️");
    }
    
    localStorage.setItem('jamaica_favs', JSON.stringify(favoritos));
    
    // Si estoy viendo la vista de favoritos, re-renderizar
    if(categoriaActual === 'favoritos') {
        filtrarCategoria('favoritos');
    } else {
        // Solo actualizar el icono
        const btn = document.getElementById(`fav-${id}`);
        if(btn) {
            btn.classList.toggle('es-fav');
            btn.innerText = favoritos.includes(id) ? '❤️' : '🤍';
        }
    }
}

// Analítica ciega guardada en localStorage del cliente
function registrarInteraccion(id) {
    let clicks = JSON.parse(localStorage.getItem('jamaica_analytics') || '{}');
    clicks[id] = (clicks[id] || 0) + 1;
    localStorage.setItem('jamaica_analytics', JSON.stringify(clicks));
}

/* =========================================
   5. HISTORY API Y MODALES MÓVILES 📱
========================================= */
function configurarHistoryAPI() {
    window.addEventListener('popstate', function(event) {
        // Si el usuario presiona Atrás en el móvil
        if(document.getElementById('modal-detalle').style.display === 'flex') {
            document.getElementById('modal-detalle').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if(document.getElementById('modal-carrito').style.display === 'flex') {
            cerrarCarrito(false);
        }
    });
}

function abrirSombraDetalle(id) {
    const prod = dbProductos.find(p => p.id === id);
    if (!prod) return;

    registrarInteraccion(id); // Guarda tracking local
    
    productoSeleccionadoTemporal = id;
    document.getElementById('cant-prod').value = 1; 
    
    document.getElementById('modal-img').src = prod.imagen;
    document.getElementById('modal-titulo').innerText = prod.titulo;
    document.getElementById('modal-ref').innerText = `Referencia: ${prod.id}`;
    document.getElementById('modal-desc').innerText = prod.descripcion;
    document.getElementById('modal-precio').innerText = formatearMoneda(prod.precio);
    
    const listaB = document.getElementById('modal-beneficios');
    listaB.innerHTML = prod.beneficios.map(b => `<li>${b}</li>`).join('');
    
    const btnAdd = document.getElementById('btn-add-modal');
    if (prod.disponible === false) {
        btnAdd.innerText = "Agotado Temporalmente";
        btnAdd.style.background = "#888";
        btnAdd.disabled = true;
    } else {
        btnAdd.innerText = "Agregar al Carrito";
        btnAdd.style.background = ""; 
        btnAdd.disabled = false;
        btnAdd.onclick = () => {
            agregarLogica(id, parseInt(document.getElementById('cant-prod').value));
            cerrarModal(); 
        };
    }
    
    document.getElementById('modal-detalle').style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
    
    // Cambiar URL sin recargar para soportar el botón atrás
    history.pushState({ modalOpen: true }, '', `#producto-${id}`);
}

function cerrarModal() {
    document.getElementById('modal-detalle').style.display = 'none';
    document.body.style.overflow = 'auto'; 
    history.back(); // Limpia el Hash URI originado
}

function cambiarCantModal(delta) {
    const input = document.getElementById('cant-prod');
    let val = parseInt(input.value) + delta;
    input.value = val < 1 ? 1 : val;
}

/* =========================================
   6. CARRITO Y CHECKOUT LOGIC 🛒
========================================= */
function agregarRapido(id) { agregarLogica(id, 1); }

function agregarLogica(id, cantNum) {
    const prodBD = dbProductos.find(p => p.id === id);
    if (!prodBD) return;

    const existeIndex = carrito.findIndex(item => item.id === id);
    if (existeIndex >= 0) carrito[existeIndex].cantidad += cantNum;
    else carrito.push({ id: prodBD.id, titulo: prodBD.titulo, precio: prodBD.precio, cantidad: cantNum });

    localStorage.setItem('jamaica_carrito', JSON.stringify(carrito));
    actualizarInterfazCarritoResumen();
    mostrarToast(`Se agregó ${cantNum}x ${prodBD.titulo} al pedido`);
    
    const cajaCart = document.getElementById('cart-float');
    cajaCart.style.transform = 'scale(1.2)';
    setTimeout(() => cajaCart.style.transform = 'scale(1)', 200);
}

function actualizarInterfazCarritoResumen() {
    const cont = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById('cart-count').innerText = cont;
    document.getElementById('cart-float').style.border = cont > 0 ? "3px solid var(--wpp)" : "none";
}

function abrirResumenCarrito() {
    const elemList = document.getElementById('carrito-lista');
    let total = 0;

    if (carrito.length === 0) {
        elemList.innerHTML = "<p style='text-align:center; padding: 20px;'>Tu carrito está vacío 🌱</p>";
    } else {
        elemList.innerHTML = carrito.map((item, index) => {
            const sub = item.precio * item.cantidad;
            total += sub;
            return `
                <div class="item-carrito">
                    <div class="item-info">
                        <h4>REF: ${item.id} - ${item.titulo}</h4>
                        <p>${item.cantidad} x ${formatearMoneda(item.precio)}</p>
                    </div>
                    <div class="item-acciones">
                        <strong>${formatearMoneda(sub)}</strong>
                        <button class="btn-eliminar-item" onclick="eliminarFila(${index})">❌</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    document.getElementById('carrito-total-texto').innerText = formatearMoneda(total);
    history.pushState({ modalOpen: true }, '', `#checkout`);
    document.getElementById('modal-carrito').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function cerrarCarrito(goBack = true) {
    document.getElementById('modal-carrito').style.display = 'none';
    document.body.style.overflow = 'auto';
    if(goBack) history.back();
}

function eliminarFila(index) {
    carrito.splice(index, 1);
    localStorage.setItem('jamaica_carrito', JSON.stringify(carrito));
    actualizarInterfazCarritoResumen();
    abrirResumenCarrito(); // Re-dibuja
}

function vaciarCarrito() {
    if(confirm("¿Seguro que deseas vaciar el pedido completo?")) {
        carrito = [];
        localStorage.removeItem('jamaica_carrito');
        actualizarInterfazCarritoResumen();
        cerrarCarrito();
        mostrarToast("Carrito vaciado correctamente");
    }
}

function generarPedidoWpp() {
    if (carrito.length === 0) return mostrarToast("Tu pedido está vacío", "error");

    let msj = "Hola Jamaica 🌿. Quiero realizar el siguiente pedido por favor:\n\n";
    let total = 0;

    carrito.forEach(p => {
        const sub = p.precio * p.cantidad;
        total += sub;
        msj += `🛍️ *REF ${p.id}* - ${p.titulo}\n    ↳ Cant: ${p.cantidad} = *${formatearMoneda(sub)}*\n\n`;
    });

    msj += `--- \n💰 *TOTAL A PAGAR: ${formatearMoneda(total)}*`;
    window.open(`https://wa.me/${TelefonoEmpresa}?text=${encodeURIComponent(msj)}`, '_blank');
}

function formatearMoneda(valor) { return "$" + valor.toLocaleString('es-CO'); }

function mostrarToast(msg, tipo = "success") {
    const toast = document.getElementById('toast-notificacion');
    toast.innerText = msg;
    toast.className = 'show ' + tipo;
    setTimeout(() => { toast.className = toast.className.replace('show', '').trim(); }, 3000);
}

/* =========================================
   7. PANEL ADMIN (BACKDOOR) ⚙️
========================================= */
document.getElementById('admin-trigger').onclick = () => document.getElementById('admin-panel').style.display = 'flex';

function cerrarAdmin() { document.getElementById('admin-panel').style.display = 'none'; }

function checkAccesoAdmin() {
    if (document.getElementById('admin-pass').value === ClaveAdmin) {
        document.getElementById('login-admin').style.display = 'none';
        document.getElementById('form-registro').style.display = 'block';
    } else {
        alert("Acceso denegado.");
    }
}

function generarJSONProducto() {
    const obj = {
        id: document.getElementById('p-id').value.trim(),
        titulo: document.getElementById('p-titulo').value.trim(),
        descripcion: document.getElementById('p-desc').value.trim(),
        precio: parseInt(document.getElementById('p-precio').value),
        imagen: document.getElementById('p-imagen').value.trim(),
        beneficios: document.getElementById('p-beneficios').value.split(',').map(s => s.trim()).filter(Boolean),
        disponible: true,
        categoria: document.getElementById('p-categoria').value,
        oferta: false
    };

    if(!obj.id || !obj.titulo || isNaN(obj.precio)) return alert("ID, Título y Precio obligatorios.");

    document.getElementById('output-json').value = ",\n" + JSON.stringify(obj, null, 2);
    mostrarToast("¡Código copiable generado!");
}
```

---

## 🎯 Mejoras implementadas en la Versión Pro (VS la versión inicial)
1. **Píldoras de Categoría & Búsqueda Real-time**: Código para filtrar arreglos (Capilar, Íntimo, Favoritos, etc).
2. **Favoritos Persistentes**: Nuevo botón tipo "Corazón" que se vincula con `localStorage`.
3. **Control del "Atrás" en Celulares**: Si el cliente oprime "atrás" en su celular (Android Nav o Swipe en iOS) estando en el carrito, se cierra el modal en lugar de salirse de la página misteriosamente (Historial manipulado por `history.pushState`).
4. **Skeleton Screens**: En lo que el `fetch` hace su trabajo, la estructura en `index.html` ya contiene 3 tarjetas en "gris".
5. **Carga Perezosa de Imágenes (Lazy Load)**: Propiedad `loading="lazy"` asignada nativamente al HTML para ahorrar datos e interacción en iPhones antiguos.
6. **Estados Vacíos Explicativos (Empty states)**: Mensajes amigables si no existe producto o si tu carrito visual está en ceros.

### Pasos
Guarda el archivo `DOCUMENTACION_CATALOGO.md` generado con todo esto en la carpeta `c:\Users\kevin\Desktop\catalogo-jamaica` y haz `git push`. Tu proyecto es oficialmente *Level Senior E-commerce Layout* sin usar bases de datos de pago.
