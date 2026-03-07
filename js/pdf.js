// js/pdf.js: Exportador de Catálogo a PDF
import { State, formatearMoneda } from './state.js';
import { mostrarToast } from './ui.js';

export function descargarCatalogoPDF() {
    mostrarToast("Generando PDF, por favor espera...", "success");

    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.background = 'white';
    container.style.color = '#1c1917';
    container.style.fontFamily = 'Inter, sans-serif';

    let html = `<h1 style="text-align:center; color:#0f172a; margin-bottom: 2rem;">Catálogo Jamaica - Natural Beauty</h1>`;

    State.dbProductos.filter(p => p.disponible !== false).forEach(p => {
        html += `
            <div style="display:flex; margin-bottom: 30px; border-bottom: 1px solid #e7e5e4; padding-bottom: 20px; page-break-inside: avoid;">
                <div style="flex: 0 0 200px; margin-right: 20px;">
                    <img src="${p.imagen_detalle}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 16px;" crossorigin="anonymous">
                </div>
                <div style="flex: 1;">
                    <h2 style="font-size: 1.5rem; margin-bottom: 5px; color:#0f172a;">${p.titulo} <span style="font-size: 0.9rem; color: #78716c;">(Ref: ${p.id})</span></h2>
                    <p style="font-size: 1rem; color: #78716c; margin-bottom: 10px;">${p.descripcion}</p>
                    <p style="font-size: 1.25rem; font-weight: bold; color: #0f172a; margin-bottom: 10px;">${formatearMoneda(p.precio)}</p>
                    <h4 style="font-size: 1rem; color:#0f172a; margin-bottom: 5px;">Beneficios:</h4>
                    <ul style="padding-left: 20px; color: #78716c; font-size: 0.9rem;">
                        ${p.beneficios.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    const opt = {
        margin: 10,
        filename: 'Catalogo-Jamaica.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(container).save().then(() => {
        mostrarToast("PDF descargado con éxito");
    }).catch(err => {
        mostrarToast("Error al generar PDF", "error");
        console.error(err);
    });
}
