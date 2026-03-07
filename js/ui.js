// js/ui.js: Utilidades de Interfaz de Usuario
import { State } from './state.js';
import { cerrarModal } from './products.js';
import { cerrarCarrito } from './cart.js';

export function mostrarToast(msg, tipo = "success") {
    const toast = document.getElementById('toast-notificacion');
    document.getElementById('toast-msg').innerText = msg;
    toast.className = ''; // Limpiar clases previas (success/error)
    if (tipo === "error") {
        toast.classList.add('toast-error');
        toast.querySelector('svg').innerHTML = `<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>`;
    } else {
        toast.classList.add('toast-success');
        toast.querySelector('svg').innerHTML = `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`;
    }
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

export function configurarHistoryAPI() {
    window.addEventListener('popstate', function (event) {
        if (document.getElementById('modal-detalle').classList.contains('show')) cerrarModal(false);
        if (document.getElementById('modal-carrito').classList.contains('show')) cerrarCarrito(false);
    });
}

// Cierra cualquier modal abierto si el usuario hace clic en el overlay difuminado (fondo)
export function inicializarCloseOnClickOutside() {
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            if (e.target.id === 'modal-detalle') cerrarModal();
            else if (e.target.id === 'modal-carrito') cerrarCarrito();
            else {
                e.target.classList.remove('show');
            }
        }
    });
}
