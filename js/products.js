// js/products.js: Lógica de Productos (Renderizado, Búsquedas, Favoritos)
import { State, formatearMoneda } from './state.js';
import { mostrarToast } from './ui.js';
import { agregarRapido, agregarLogica } from './cart.js';

export async function cargarBaseDatos() {
    try {
        const respuesta = await fetch('productos.json');
        State.dbProductos = await respuesta.json();
        setTimeout(() => renderizarCatalogo(State.dbProductos), 300);
    } catch (error) {
        mostrarToast("Error de conexión", "error");
        document.getElementById('catalogo').innerHTML = '<p class="empty-state">No se pudieron cargar los productos en este momento.</p>';
    }
}

export function renderizarCatalogo(lista) {
    const contenedor = document.getElementById('catalogo');

    if (lista.length === 0) {
        contenedor.innerHTML = `<div class="empty-state">No se encontraron productos en esta categoría o búsqueda.</div>`;
        return;
    }

    contenedor.innerHTML = lista.map(p => {
        const agotado = p.disponible === false;
        const claseAgotado = agotado ? 'foto-agotado' : '';
        const txtBoton = agotado ? 'Agotado' : 'Agregar';
        const badgeHTML = agotado ? `<div class="ref-badge badge-agotado">REF: ${p.id}</div>`
            : `<div class="ref-badge">REF: ${p.id}</div>`;
        const ofertaHTML = p.oferta && !agotado ? `<div class="oferta-badge">🔥 Oferta</div>` : '';

        const esFav = State.favoritos.includes(p.id) ? 'es-fav' : '';

        const favIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="${State.favoritos.includes(p.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        const viewIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        const addIcon = agotado ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>`
            : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

        let precioTexto = "";
        let btnTexto = txtBoton;
        if (p.presentaciones && p.presentaciones.length > 0) {
            precioTexto = `Desde ${formatearMoneda(p.presentaciones[0].precio)}`;
            if (!agotado) btnTexto = 'Opciones';
        } else {
            precioTexto = formatearMoneda(p.precio);
        }

        return `
            <div class="card">
                ${badgeHTML}
                ${ofertaHTML}
                
                <div class="card-img-container">
                    <img src="${p.imagen_miniatura}" alt="${p.titulo}" class="${claseAgotado}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=Beauty'">
                </div>
                
                <button class="btn-fav ${esFav}" data-id="${p.id}" id="fav-${p.id}" aria-label="Favorito">
                    ${favIcon}
                </button>
                
                <div class="card-info">
                    <h3>${p.titulo}</h3>
                    <p class="desc-cortada">${p.descripcion}</p>
                    <p class="precio">${precioTexto}</p>
                    
                    <div class="botones-card">
                        <button class="btn btn-ver btn-info-prod" data-id="${p.id}">${viewIcon} Info</button>
                        <button class="btn btn-add btn-quick-add" data-id="${p.id}" ${agotado ? 'disabled' : ''}>${addIcon} ${btnTexto}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Asignar listeners después de renderizar
    asignarListenersTarjetas();
}

function asignarListenersTarjetas() {
    document.querySelectorAll('.btn-fav').forEach(btn => {
        btn.onclick = () => toggleFavorito(btn.dataset.id);
    });
    document.querySelectorAll('.btn-info-prod').forEach(btn => {
        btn.onclick = () => abrirSombraDetalle(btn.dataset.id);
    });
    document.querySelectorAll('.btn-quick-add').forEach(btn => {
        btn.onclick = () => {
            const prod = State.dbProductos.find(p => p.id === btn.dataset.id);
            if (prod && prod.presentaciones && prod.presentaciones.length > 0) {
                abrirSombraDetalle(prod.id);
            } else {
                agregarRapido(btn.dataset.id);
            }
        };
    });
}

export function filtrarCategoria(cat) {
    State.categoriaActual = cat;

    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('activo'));
    const selector = document.querySelector(`.cat-btn[data-cat="${cat}"]`);
    if (selector) selector.classList.add('activo');

    document.getElementById('buscador').value = '';

    let filtrados = State.dbProductos;
    if (cat === 'favoritos') {
        filtrados = State.dbProductos.filter(p => State.favoritos.includes(p.id));
    } else if (cat !== 'todos') {
        filtrados = State.dbProductos.filter(p => p.categoria === cat);
    }

    renderizarCatalogo(filtrados);
}

export function buscarProductos() {
    const termino = document.getElementById('buscador').value.toLowerCase();

    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('activo'));
    const btnTodos = document.querySelector(".cat-btn[data-cat='todos']");
    if (btnTodos) btnTodos.classList.add('activo');
    State.categoriaActual = 'todos';

    const filtrados = State.dbProductos.filter(p =>
        p.titulo.toLowerCase().includes(termino) || p.id.toLowerCase().includes(termino) || p.categoria.toLowerCase().includes(termino)
    );
    renderizarCatalogo(filtrados);
}

export function toggleFavorito(id) {
    const idx = State.favoritos.indexOf(id);
    if (idx > -1) {
        State.favoritos.splice(idx, 1);
        mostrarToast("Eliminado de Favoritos");
    } else {
        State.favoritos.push(id);
        mostrarToast("¡Añadido a Favoritos!");
    }

    localStorage.setItem('jamaica_favs_v2', JSON.stringify(State.favoritos));

    if (State.categoriaActual === 'favoritos') {
        filtrarCategoria('favoritos');
    } else {
        const btn = document.getElementById(`fav-${id}`);
        if (btn) {
            btn.classList.toggle('es-fav');
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="${State.favoritos.includes(id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        }
    }
}

export function registrarInteraccion(id) {
    let clicks = JSON.parse(localStorage.getItem('jamaica_analytics') || '{}');
    clicks[id] = (clicks[id] || 0) + 1;
    localStorage.setItem('jamaica_analytics', JSON.stringify(clicks));
}

// Lógica del Modal
export function abrirSombraDetalle(id) {
    const prod = State.dbProductos.find(p => p.id === id);
    if (!prod) return;

    registrarInteraccion(id);

    State.productoSeleccionadoTemporal = id;
    document.getElementById('cant-prod').value = 1;

    document.getElementById('modal-img').src = prod.imagen_detalle;
    document.getElementById('modal-titulo').innerText = prod.titulo;
    document.getElementById('modal-ref').innerText = `Ref. ${prod.id}`;
    document.getElementById('modal-desc').innerText = prod.descripcion;

    const listaB = document.getElementById('modal-beneficios');
    listaB.innerHTML = prod.beneficios.map(b => `<li>${b}</li>`).join('');

    let precioSeleccionado = prod.precio;
    let tamañoSeleccionado = null;

    const contPresentaciones = document.getElementById('modal-presentaciones-container');
    const selectPresentacion = document.getElementById('presentacion-select');
    const modalPrecio = document.getElementById('modal-precio');

    if (prod.presentaciones && prod.presentaciones.length > 0) {
        contPresentaciones.style.display = 'block';
        selectPresentacion.innerHTML = prod.presentaciones.map((pres, i) => 
            `<option value="${i}">${pres.tamaño} - ${formatearMoneda(pres.precio)}</option>`
        ).join('');
        
        precioSeleccionado = prod.presentaciones[0].precio;
        tamañoSeleccionado = prod.presentaciones[0].tamaño;
        modalPrecio.innerText = formatearMoneda(precioSeleccionado);

        selectPresentacion.onchange = (e) => {
            const index = Number(e.target.value);
            precioSeleccionado = prod.presentaciones[index].precio;
            tamañoSeleccionado = prod.presentaciones[index].tamaño;
            modalPrecio.innerText = formatearMoneda(precioSeleccionado);
        };
    } else {
        contPresentaciones.style.display = 'none';
        modalPrecio.innerText = formatearMoneda(prod.precio);
    }

    const btnAdd = document.getElementById('btn-add-modal');
    if (prod.disponible === false) {
        btnAdd.innerText = "Agotado Temporalmente";
        btnAdd.disabled = true;
    } else {
        btnAdd.innerText = "Agregar a mi pedido";
        btnAdd.disabled = false;
        btnAdd.onclick = () => {
            agregarLogica(id, parseInt(document.getElementById('cant-prod').value), tamañoSeleccionado, precioSeleccionado);
            cerrarModal();
        };
    }

    const modal = document.getElementById('modal-detalle');
    setTimeout(() => modal.classList.add('show'), 10);
    document.body.classList.add('modal-open');
    history.pushState({ modalOpen: true }, '', `#producto-${id}`);
}

export function cerrarModal(goBack = true) {
    const modal = document.getElementById('modal-detalle');
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    if (goBack) history.back();
}

export function cambiarCantModal(delta) {
    const input = document.getElementById('cant-prod');
    let val = parseInt(input.value) + delta;
    input.value = val < 1 ? 1 : val;
}

export function handleFiltrarCategoria(cat) {
    filtrarCategoria(cat);
}
