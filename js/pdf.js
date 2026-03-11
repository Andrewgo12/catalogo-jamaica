// js/pdf.js: Controlador Sólido del modal de descargas de Catálogo

export function abrirModalPDF() {
    const modal = document.getElementById('modal-pdf');
    if (!modal) {
        console.error("Error: Modal PDF no encontrado en el DOM");
        return;
    }
    
    // Abrimos el modal y bloqueamos el scroll del body
    document.body.classList.add('modal-open');
    modal.style.display = 'flex'; // Asegurar display
    
    // Pequeño retardo para que la transición CSS de opacidad funcione
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Añadir listener para cerrar con la tecla Escape
    document.addEventListener('keydown', cerrarConEsc);
}

export function cerrarModalPDF() {
    const modal = document.getElementById('modal-pdf');
    if (!modal) return;
    
    // Removemos la clase de animación
    modal.classList.remove('show');
    modal.style.display = ''; // Limpiamos el flex forzado
    
    // Devolvemos el scroll al body inmediatamente
    document.body.classList.remove('modal-open');
    
    // Removemos el listener del Escape para limpiar memoria
    document.removeEventListener('keydown', cerrarConEsc);
}

// Función auxiliar para cerrar si se presiona ESC
function cerrarConEsc(e) {
    if (e.key === 'Escape') {
        cerrarModalPDF();
    }
}
