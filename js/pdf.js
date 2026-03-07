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

    let html = `
        <div style="text-align:center; margin-bottom: 3rem;">
            <h1 style="color:#0f172a; margin-bottom: 0.5rem; font-size: 2.5rem; font-weight: 800;">Catálogo Jamaica</h1>
            <p style="color: #78716c; font-size: 1.2rem; margin: 0;">Natural Beauty - Productos de Alta Calidad</p>
            <div style="width: 100px; height: 4px; background: linear-gradient(90deg, #f43f5e, #ec4899); margin: 1rem auto; border-radius: 2px;"></div>
        </div>
    `;

    State.dbProductos.filter(p => p.disponible !== false).forEach((p, index) => {
        const esPar = index % 2 === 0;
        html += `
            <div style="display: flex; margin-bottom: 40px; border-bottom: 2px solid #f3f4f6; padding-bottom: 30px; page-break-inside: avoid; background: ${esPar ? '#fafafa' : '#ffffff'}; border-radius: 20px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="flex: 0 0 400px; margin-right: 30px;">
                    <div style="position: relative; overflow: hidden; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                        <img src="${p.imagen_detalle}" style="width: 400px; height: 400px; object-fit: cover; display: block;" crossorigin="anonymous">
                        <div style="position: absolute; top: 15px; right: 15px; background: #f43f5e; color: white; padding: 8px 16px; border-radius: 25px; font-weight: bold; font-size: 0.9rem; box-shadow: 0 4px 10px rgba(244, 63, 94, 0.3);">
                            REF: ${p.id}
                        </div>
                    </div>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                    <div style="margin-bottom: 20px;">
                        <h2 style="font-size: 2rem; margin-bottom: 8px; color:#0f172a; font-weight: 700; line-height: 1.2;">${p.titulo}</h2>
                        <div style="display: inline-block; background: linear-gradient(90deg, #10b981, #059669); color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-bottom: 15px;">
                            ${p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1)}
                        </div>
                    </div>
                    
                    <p style="font-size: 1.1rem; color: #4b5563; margin-bottom: 20px; line-height: 1.6;">${p.descripcion}</p>
                    
                    <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 15px; margin-bottom: 20px; border-left: 5px solid #0ea5e9;">
                        <p style="font-size: 2rem; font-weight: 800; color: #0f172a; margin: 0; text-align: center;">${formatearMoneda(p.precio)}</p>
                        <p style="font-size: 0.9rem; color: #64748b; margin: 5px 0 0 0; text-align: center;">Precio especial</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="font-size: 1.3rem; color:#0f172a; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center;">
                            <span style="margin-right: 8px;">✨</span> Beneficios Destacados
                        </h4>
                        <div style="background: #fef3c7; padding: 15px; border-radius: 12px; border-left: 4px solid #f59e0b;">
                            <ul style="padding-left: 20px; color: #92400e; font-size: 1rem; margin: 0; list-style-type: none;">
                                ${p.beneficios.map(b => `<li style="margin-bottom: 8px; position: relative; padding-left: 25px;">• ${b}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: auto;">
                        <div style="background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center;">
                            ✓ En Stock
                        </div>
                        <div style="background: #fce7f3; color: #9f1239; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center;">
                            🌿 Natural
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    const opt = {
        margin: 15,
        filename: 'Catalogo-Jamaica.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 3, 
            useCORS: true,
            logging: false,
            allowTaint: true,
            backgroundColor: '#ffffff',
            imageTimeout: 15000,
            removeContainer: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'landscape',
            compress: false,
            precision: 16
        }
    };

    html2pdf().set(opt).from(container).save().then(() => {
        mostrarToast("PDF descargado con éxito");
    }).catch(err => {
        mostrarToast("Error al generar PDF", "error");
        console.error(err);
    });
}
