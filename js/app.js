// js/app.js: Entry Point de la Aplicación
import { State } from './state.js';
import { configurarHistoryAPI, inicializarCloseOnClickOutside } from './ui.js';
import { cargarBaseDatos, buscarProductos, filtrarCategoria, handleFiltrarCategoria, cerrarModal, cambiarCantModal } from './products.js';
import { abrirResumenCarrito, vaciarCarrito, generarPedidoWpp, cerrarCarrito } from './cart.js';
import { abrirModalPDF, cerrarModalPDF } from './pdf.js';
import { inicializarAdminListeners, cerrarAdmin, checkAccesoAdmin, generarJSONProducto } from './admin.js';

// Inicialización
window.onload = () => {
    recuperarEstadoLocal();
    cargarBaseDatos();
    configurarHistoryAPI();
    inicializarCloseOnClickOutside();
    inicializarAdminListeners();
    exponerGlobalesAPI();
    inicializarScrollHeader();
};

function inicializarScrollHeader() {
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

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
    window.filtrarCategoria = handleFiltrarCategoria;
    window.cerrarModal = cerrarModal;
    window.cambiarCantModal = cambiarCantModal;

    window.abrirResumenCarrito = abrirResumenCarrito;
    window.cerrarCarrito = cerrarCarrito;
    window.vaciarCarrito = vaciarCarrito;
    window.generarPedidoWpp = generarPedidoWpp;

    window.abrirModalPDF = abrirModalPDF;
    window.cerrarModalPDF = cerrarModalPDF;

    window.cerrarAdmin = cerrarAdmin;
    window.checkAccesoAdmin = checkAccesoAdmin;
    window.generarJSONProducto = generarJSONProducto;

    // Funciones de Fullscreen
    window.abrirFullscreenImagen = abrirFullscreenImagen;
    window.cerrarFullscreen = cerrarFullscreen;
    window.zoomIn = zoomIn;
    window.zoomOut = zoomOut;
    window.resetZoom = resetZoom;
}

// Variables globales para zoom
let currentZoom = 1;
const zoomStep = 0.2;
const maxZoom = 3;
const minZoom = 0.5;

// Función para abrir modal fullscreen
function abrirFullscreenImagen(imageSrc = null, imageAlt = '') {
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenModal = document.getElementById('modal-fullscreen');

    if (fullscreenImg && fullscreenModal) {
        // Si no se proporciona imagen, usar la del modal actual
        if (!imageSrc) {
            const modalImg = document.getElementById('modal-img');
            if (modalImg) {
                fullscreenImg.src = modalImg.src;
                fullscreenImg.alt = modalImg.alt;
            }
        } else {
            fullscreenImg.src = imageSrc;
            fullscreenImg.alt = imageAlt;
        }

        // Reset zoom
        currentZoom = 1;
        actualizarZoom();

        // Prevenir scroll del body
        document.body.classList.add('modal-open');

        // Animación de entrada
        setTimeout(() => {
            fullscreenModal.classList.add('show');
        }, 10);
    }
}

// Función para cerrar modal fullscreen
function cerrarFullscreen() {
    const fullscreenModal = document.getElementById('modal-fullscreen');

    if (fullscreenModal) {
        fullscreenModal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
}

// Función de zoom in
function zoomIn() {
    if (currentZoom < maxZoom) {
        currentZoom += zoomStep;
        actualizarZoom();
    }
}

// Función de zoom out
function zoomOut() {
    if (currentZoom > minZoom) {
        currentZoom -= zoomStep;
        actualizarZoom();
    }
}

// Función para reset zoom
function resetZoom() {
    currentZoom = 1;
    actualizarZoom();
}

// Función para actualizar el zoom de la imagen
function actualizarZoom() {
    const fullscreenImg = document.getElementById('fullscreen-img');
    if (fullscreenImg) {
        fullscreenImg.style.transform = `scale(${currentZoom})`;
    }
}

// Event listeners para teclado
document.addEventListener('keydown', (e) => {
    const fullscreenModal = document.getElementById('modal-fullscreen');

    if (fullscreenModal && fullscreenModal.classList.contains('show')) {
        switch (e.key) {
            case 'Escape':
                cerrarFullscreen();
                break;
            case '+':
            case '=':
                zoomIn();
                break;
            case '-':
            case '_':
                zoomOut();
                break;
            case '0':
                resetZoom();
                break;
        }
    }
});

// Event listener para cerrar con clic fuera de la imagen
document.addEventListener('click', (e) => {
    const fullscreenModal = document.getElementById('modal-fullscreen');
    const fullscreenImg = document.getElementById('fullscreen-img');

    if (fullscreenModal && fullscreenModal.classList.contains('show')) {
        if (e.target === fullscreenModal) {
            cerrarFullscreen();
        }
    }
});
