// js/landing.js: Gestión de Landing Page y Experiencia de Carga

let landingPage = null;
let enterButton = null;
let isLoading = false;

// Inicializar landing page
export function initLandingPage() {
    // Crear landing page dinámicamente
    landingPage = document.createElement('div');
    landingPage.innerHTML = `
        <div class="landing-overlay" id="landing-page">
            <div class="landing-content">
                <!-- Logo animado -->
                <div class="logo-container">
                    <div class="logo-circle">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="logo-icon">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </div>
                </div>

                <!-- Título principal -->
                <h1 class="landing-title">
                    <span class="title-jamaica">Jamaica</span>
                    <span class="title-nature">Natural Beauty</span>
                </h1>

                <!-- Subtítulo -->
                <p class="landing-subtitle">
                    Distribuidores y vendedores de productos naturales<br>
                    para el cuidado personal
                </p>

                <!-- Línea decorativa -->
                <div class="divider"></div>

                <!-- Características -->
                <div class="features">
                    <div class="feature-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                        </svg>
                        <span>100% Natural</span>
                    </div>
                    <div class="feature-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span>Calidad Premium</span>
                    </div>
                    <div class="feature-item">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                        <span>Cuidado Personal</span>
                    </div>
                </div>

                <!-- Mensaje de carga -->
                <div class="loading-section">
                    <div class="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p class="loading-text">Preparando tu experiencia natural...</p>
                </div>

                <!-- Botón de entrada -->
                <button id="enter-btn" class="enter-button">
                    <span>Explorar Catálogo</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // Agregar al body
    document.body.appendChild(landingPage);
    enterButton = document.getElementById('enter-btn');

    // Event listener para el botón
    enterButton.addEventListener('click', iniciarExperiencia);

    // Auto-iniciar después de 3 segundos si no hay interacción
    setTimeout(() => {
        if (!isLoading) {
            iniciarExperiencia();
        }
    }, 5000);
}

// Iniciar experiencia principal
function iniciarExperiencia() {
    if (isLoading) return;
    isLoading = true;

    const landingOverlay = document.getElementById('landing-page');
    if (!landingOverlay) return;

    // Cambiar texto de carga
    const loadingText = landingOverlay.querySelector('.loading-text');
    const enterBtn = landingOverlay.querySelector('.enter-button');
    
    if (loadingText) {
        loadingText.textContent = 'Cargando productos naturales...';
    }
    
    if (enterBtn) {
        enterBtn.style.opacity = '0.5';
        enterBtn.style.cursor = 'not-allowed';
        enterBtn.disabled = true;
    }

    // Simular carga y luego ocultar
    setTimeout(() => {
        landingOverlay.classList.add('fade-out');
        
        setTimeout(() => {
            if (landingPage && landingPage.parentNode) {
                landingPage.parentNode.removeChild(landingPage);
            }
            
            // Notificar que la experiencia ha comenzado
            if (window.experienciaIniciada) {
                window.experienciaIniciada();
            }
        }, 1000);
    }, 2000);
}

// Cerrar landing page manualmente
export function cerrarLandingPage() {
    if (landingPage && landingPage.parentNode) {
        landingPage.parentNode.removeChild(landingPage);
    }
}

// Verificar si se debe mostrar landing page
export function shouldShowLandingPage() {
    // Verificar si es la primera visita del día
    const lastVisit = localStorage.getItem('jamaica_last_visit');
    const today = new Date().toDateString();
    
    if (lastVisit === today) {
        return false; // Ya visitó hoy, no mostrar
    }
    
    // Guardar visita de hoy
    localStorage.setItem('jamaica_last_visit', today);
    return true; // Primera visita del día
}

// Forzar mostrar landing page (para desarrollo)
export function forceShowLandingPage() {
    localStorage.removeItem('jamaica_last_visit');
    location.reload();
}
