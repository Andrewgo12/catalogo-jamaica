// js/cart.js: Lógica del Carrito y Checkout
import { State, formatearMoneda, TelefonoEmpresa } from './state.js';
import { mostrarToast } from './ui.js';

export function agregarRapido(id) {
    agregarLogica(id, 1);
}

export function agregarLogica(id, cantNum, tamano = null, precioEspecifico = null) {
    const prodBD = State.dbProductos.find(p => p.id === id);
    if (!prodBD) return;

    let pre = precioEspecifico || prodBD.precio;
    if (!pre && prodBD.presentaciones) pre = prodBD.presentaciones[0].precio;
    const tam = tamano || '';

    const existeIndex = State.carrito.findIndex(item => item.id === id && item.tamano === tam);
    if (existeIndex >= 0) State.carrito[existeIndex].cantidad += cantNum;
    else State.carrito.push({ id: prodBD.id, titulo: prodBD.titulo, precio: pre, cantidad: cantNum, tamano: tam });

    localStorage.setItem('jamaica_carrito_v2', JSON.stringify(State.carrito));
    actualizarInterfazCarritoResumen();
    mostrarToast("Añadido al pedido");

    const cajaCart = document.getElementById('cart-float');
    cajaCart.classList.add('bounce');
    setTimeout(() => cajaCart.classList.remove('bounce'), 300);
}

export function actualizarInterfazCarritoResumen() {
    const cont = State.carrito.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById('cart-count').innerText = cont;
    const cartFloat = document.getElementById('cart-float');
    if (cont > 0) cartFloat.classList.add('has-items');
    else cartFloat.classList.remove('has-items');
}

export function abrirResumenCarrito() {
    const elemList = document.getElementById('carrito-lista');
    let total = 0;

    if (State.carrito.length === 0) {
        elemList.innerHTML = "<p style='text-align:center; padding: 3rem 1rem; color:var(--muted-foreground);'>Tu pedido está en blanco ✨</p>";
    } else {
        elemList.innerHTML = State.carrito.map((item, index) => {
            const sub = item.precio * item.cantidad;
            total += sub;
            const tamTexto = item.tamano ? ` (${item.tamano})` : '';
            return `
                <div class="item-carrito">
                    <div class="item-info">
                        <h4>REF: ${item.id} - ${item.titulo}${tamTexto}</h4>
                        <p>${item.cantidad} und(s) x ${formatearMoneda(item.precio)}</p>
                    </div>
                    <div class="item-acciones">
                        <strong>${formatearMoneda(sub)}</strong>
                        <button class="btn-eliminar-item btn-del-cart" data-index="${index}" aria-label="Eliminar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Asignar listeners a botones de borrado dinámicos
        document.querySelectorAll('.btn-del-cart').forEach(btn => {
            btn.onclick = () => eliminarFila(parseInt(btn.dataset.index));
        });
    }

    document.getElementById('carrito-total-texto').innerText = formatearMoneda(total);
    history.pushState({ modalOpen: true }, '', `#checkout`);

    const modal = document.getElementById('modal-carrito');
    setTimeout(() => modal.classList.add('show'), 10);
    document.body.classList.add('modal-open');
}

export function cerrarCarrito(goBack = true) {
    const modal = document.getElementById('modal-carrito');
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    if (goBack) history.back();
}

export function eliminarFila(index) {
    State.carrito.splice(index, 1);
    localStorage.setItem('jamaica_carrito_v2', JSON.stringify(State.carrito));
    actualizarInterfazCarritoResumen();
    abrirResumenCarrito();
}

export function vaciarCarrito() {
    if (confirm("¿Seguro que deseas vaciar el pedido completo?")) {
        State.carrito = [];
        localStorage.removeItem('jamaica_carrito_v2');
        actualizarInterfazCarritoResumen();
        cerrarCarrito();
        mostrarToast("Pedido reiniciado", "success");
    }
}

export function generarPedidoWpp() {
    if (State.carrito.length === 0) return mostrarToast("Tu pedido está vacío", "error");

    // Obtener la URL base del sitio actual
    const baseUrl = window.location.origin;
    
    let msj = `🌿 *JAMAICA NATURAL BEAUTY* 🌿
━━━━━━━━━━━━━━━━━━━━━━
✨ *MI PEDIDO CONFIRMADO* ✨
━━━━━━━━━━━━━━━━━━━━━━

`;
    
    let total = 0;
    let contador = 0;

    State.carrito.forEach(p => {
        const sub = p.precio * p.cantidad;
        total += sub;
        const tamTexto = p.tamano ? ` (${p.tamano})` : '';
        contador++;
        
        // Buscar el producto completo para obtener la imagen
        const productoCompleto = State.dbProductos.find(prod => prod.id === p.id);
        const imagenPath = productoCompleto ? productoCompleto.imagen_miniatura : '';
        const imagenUrl = imagenPath ? `${baseUrl}/${imagenPath}` : '';
        
        msj += `🛍️ *PRODUCTO ${contador}*
`;
        
        // Agregar imagen si existe la URL
        if (imagenUrl) {
            msj += `📸 ${imagenUrl}
`;
        }
        
        msj += `🏷️ *REF: ${p.id}*
💎 ${p.titulo}${tamTexto}
💰 Precio: ${formatearMoneda(p.precio)}
📦 Cantidad: ${p.cantidad} und(s)
💸 Subtotal: *${formatearMoneda(sub)}*

━━━━━━━━━━━━━━━━━━━━━━

`;
    });

    msj += `💳 *RESUMEN DEL PEDIDO*
━━━━━━━━━━━━━━━━━━━━━━
🛒 Total artículos: ${State.carrito.length} productos
📦 Total unidades: ${State.carrito.reduce((sum, item) => sum + item.cantidad, 0)} und(s)
💰 *TOTAL A PAGAR: ${formatearMoneda(total)}*
━━━━━━━━━━━━━━━━━━━━━━

� *MÉTODOS DE PAGO*
━━━━━━━━━━━━━━━━━━━━━━
📱 *Nequi:* 3107167474
🏦 *Bancolombia:* Cuenta de Ahorro 85103093321

👩‍💼 *VENDEDORA*
━━━━━━━━━━━━━━━━━━━━━━
� *Yuli Aranda*
📞 *3107167474*

📋 *TUS DATOS PERSONALES*
━━━━━━━━━━━━━━━━━━━━━━
👤 Nombre completo:
📞 Tu teléfono:
📍 Dirección de entrega:
🏠 Ciudad y barrio:
💳 Método de pago elegido:
📝 Notas adicionales:

✅ *Por favor envía comprobante de pago junto con tus datos*

━━━━━━━━━━━━━━━━━━━━━━
⭐ *GRACIAS POR PREFERIRNOS* ⭐
🌿 *Jamaica Natural Beauty*
💚 Productos veganos y eco-friendly`;

    window.open(`https://wa.me/${TelefonoEmpresa}?text=${encodeURIComponent(msj)}`, '_blank');
}
