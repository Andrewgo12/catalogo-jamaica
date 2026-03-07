// js/app.js: Entry Point de la Aplicación
import { State } from './state.js';
import { configurarHistoryAPI, inicializarCloseOnClickOutside } from './ui.js';
import { cargarBaseDatos, buscarProductos, filtrarCategoria, cerrarModal, cambiarCantModal } from './products.js';
import { abrirResumenCarrito, vaciarCarrito, generarPedidoWpp, cerrarCarrito } from './cart.js';
import { descargarCatalogoPDF } from './pdf.js';
import { inicializarAdminListeners, cerrarAdmin, checkAccesoAdmin, generarJSONProducto } from './admin.js';

// Inicialización
window.onload = () => {
    recuperarEstadoLocal();
    cargarBaseDatos();
    configurarHistoryAPI();
    inicializarCloseOnClickOutside();
    inicializarAdminListeners();
    exponerGlobalesAPI();
};

function recuperarEstadoLocal() {
    const carritoGuardado = localStorage.getItem('jamaica_carrito_v2');
    if (carritoGuardado) State.carrito = JSON.parse(carritoGuardado);

    const favGuardados = localStorage.getItem('jamaica_favs_v2');
    if (favGuardados) State.favoritos = JSON.parse(favGuardados);

    // UI update needs to happen after DOM loads, this calls a global function ideally or we import it.
    import('./cart.js').then(module => module.actualizarInterfazCarritoResumen());
}

// Exponer funciones necesarias al scope global (window) porque HTML usa onclick=""
function exponerGlobalesAPI() {
    window.buscarProductos = buscarProductos;
    window.filtrarCategoria = filtrarCategoria;
    window.cerrarModal = cerrarModal;
    window.cambiarCantModal = cambiarCantModal;

    window.abrirResumenCarrito = abrirResumenCarrito;
    window.cerrarCarrito = cerrarCarrito;
    window.vaciarCarrito = vaciarCarrito;
    window.generarPedidoWpp = generarPedidoWpp;

    window.descargarCatalogoPDF = descargarCatalogoPDF;

    window.cerrarAdmin = cerrarAdmin;
    window.checkAccesoAdmin = checkAccesoAdmin;
    window.generarJSONProducto = generarJSONProducto;
}
