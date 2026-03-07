// js/state.js: Estado y variables globales
export const TelefonoEmpresa = "573001234567"; // Modifica aquí tu número real
export const ClaveAdmin = "jamaica123";

export const State = {
    dbProductos: [],
    carrito: [],
    favoritos: [],
    categoriaActual: 'todos',
    productoSeleccionadoTemporal: null
};

// Utils 
export function formatearMoneda(valor) {
    return "$" + valor.toLocaleString('es-CO');
}
