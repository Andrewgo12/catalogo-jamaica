/* js/state.js: Estado Global y Gestión de Datos */

// ======== CONFIGURACIÓN GLOBAL ========
export const TelefonoEmpresa = "573001234567"; // Modifica aquí tu número real
export const ClaveAdmin = "jamaica123";

// ======== ESTADO GLOBAL ========
export const State = {
    // Base de datos de productos
    dbProductos: [],
    
    // Carrito de compras
    carrito: [],
    
    // Favoritos
    favoritos: [],
    
    // Estado de la UI
    categoriaActual: 'todos',
    productoSeleccionadoTemporal: null,
    modalAbierto: false,
    terminoBusqueda: ''
};

// ======== UTILIDADES ========

// Formatear moneda
export function formatearMoneda(valor) {
    return "$" + valor.toLocaleString('es-CO');
}

// ======== GESTIÓN DE ESTADO ========

// Actualizar estado del carrito
export function actualizarEstadoCarrito(nuevoCarrito) {
    State.carrito = nuevoCarrito;
    guardarEstadoLocal();
}

// Actualizar favoritos
export function actualizarFavoritos(nuevosFavoritos) {
    State.favoritos = nuevosFavoritos;
    guardarEstadoLocal();
}

// Actualizar categoría actual
export function actualizarCategoria(categoria) {
    State.categoriaActual = categoria;
    guardarEstadoLocal();
}

// ======== FAVORITOS ========

// Toggle favorito
export function toggleFavorito(productoId) {
    const index = State.favoritos.indexOf(productoId);
    if (index > -1) {
        State.favoritos.splice(index, 1);
    } else {
        State.favoritos.push(productoId);
    }
    guardarEstadoLocal();
    return State.favoritos.includes(productoId);
}

// Verificar si es favorito
export function esFavorito(productoId) {
    return State.favoritos.includes(productoId);
}

// ======== PERSISTENCIA LOCAL ========

// Guardar estado en localStorage
export function guardarEstadoLocal() {
    try {
        const estadoParaGuardar = {
            carrito: State.carrito,
            favoritos: State.favoritos,
            categoriaActual: State.categoriaActual,
            terminoBusqueda: State.terminoBusqueda
        };
        localStorage.setItem('jamaica_state', JSON.stringify(estadoParaGuardar));
    } catch (error) {
        console.warn('No se pudo guardar el estado local:', error);
    }
}

// Cargar estado desde localStorage
export function cargarEstadoLocal() {
    try {
        const estadoGuardado = localStorage.getItem('jamaica_state');
        if (estadoGuardado) {
            const estado = JSON.parse(estadoGuardado);
            State.carrito = estado.carrito || [];
            State.favoritos = estado.favoritos || [];
            State.categoriaActual = estado.categoriaActual || 'todos';
            State.terminoBusqueda = estado.terminoBusqueda || '';
        }
    } catch (error) {
        console.warn('No se pudo cargar el estado local:', error);
    }
}

// ======== UTILIDADES DE ESTADO ========

// Limpiar estado completo
export function limpiarEstado() {
    State.carrito = [];
    State.favoritos = [];
    State.categoriaActual = 'todos';
    State.terminoBusqueda = '';
    State.productoSeleccionadoTemporal = null;
    localStorage.removeItem('jamaica_state');
}

// Obtener resumen del carrito
export function obtenerResumenCarrito() {
    return State.carrito.reduce((resumen, item) => {
        resumen.totalItems += item.cantidad;
        resumen.totalPrecio += item.precio * item.cantidad;
        return resumen;
    }, {
        totalItems: 0,
        totalPrecio: 0,
        totalProductos: State.carrito.length
    });
}

// Obtener productos filtrados
export function obtenerProductosFiltrados() {
    let productos = State.dbProductos;
    
    // Filtrar por disponibilidad
    productos = productos.filter(p => p.disponible !== false);
    
    // Filtrar por categoría
    if (State.categoriaActual !== 'todos') {
        if (State.categoriaActual === 'favoritos') {
            productos = productos.filter(p => esFavorito(p.id));
        } else {
            productos = productos.filter(p => p.categoria === State.categoriaActual);
        }
    }
    
    // Filtrar por búsqueda
    if (State.terminoBusqueda) {
        const termino = State.terminoBusqueda.toLowerCase();
        productos = productos.filter(p => 
            p.titulo.toLowerCase().includes(termino) ||
            p.descripcion.toLowerCase().includes(termino) ||
            p.categoria.toLowerCase().includes(termino) ||
            p.id.toString().includes(termino)
        );
    }
    
    return productos;
}

// ======== INICIALIZACIÓN ========

// Inicializar estado al cargar la aplicación
export function inicializarEstado() {
    cargarEstadoLocal();
    console.log('Estado inicializado:', State);
}

// Exportar para debugging (solo en desarrollo)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.State = State;
    window.actualizarEstadoCarrito = actualizarEstadoCarrito;
    window.toggleFavorito = toggleFavorito;
    window.obtenerResumenCarrito = obtenerResumenCarrito;
}
