// js/admin.js: Panel Trasero Administrativo
import { ClaveAdmin } from './state.js';
import { mostrarToast } from './ui.js';

export function inicializarAdminListeners() {
    const trigger = document.getElementById('admin-trigger');
    if (trigger) {
        trigger.onclick = () => {
            const modal = document.getElementById('admin-panel');
            setTimeout(() => modal.classList.add('show'), 10);
        };
    }
}

export function cerrarAdmin() {
    const modal = document.getElementById('admin-panel');
    modal.classList.remove('show');
}

export function checkAccesoAdmin() {
    if (document.getElementById('admin-pass').value === ClaveAdmin) {
        document.getElementById('login-admin').classList.add('d-none');
        document.getElementById('form-registro').classList.remove('d-none');
    } else {
        alert("Acceso denegado.");
    }
}

export function generarJSONProducto() {
    const obj = {
        id: document.getElementById('p-id').value.trim(),
        titulo: document.getElementById('p-titulo').value.trim(),
        descripcion: document.getElementById('p-desc').value.trim(),
        precio: parseInt(document.getElementById('p-precio').value),
        imagen_detalle: document.getElementById('p-img-det').value.trim(),
        beneficios: document.getElementById('p-beneficios').value.split(',').map(s => s.trim()).filter(Boolean),
        disponible: true,
        categoria: document.getElementById('p-categoria').value,
        oferta: false
    };

    if (!obj.id || !obj.titulo || isNaN(obj.precio)) return alert("Revisa los campos.");

    const finalJSON = ",\n" + JSON.stringify(obj, null, 2);
    document.getElementById('output-json').value = finalJSON;

    // Auto-copiar al portapapeles
    navigator.clipboard.writeText(finalJSON).then(() => {
        mostrarToast("Código copiado al portapapeles 🎉");
    }).catch(err => {
        mostrarToast("Generado (cópialo manualmente)");
    });
}
