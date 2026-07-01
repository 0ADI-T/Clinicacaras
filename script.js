// ==========================================
// CLÍNICA CARAS – SCRIPT PRINCIPAL
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

    // ----- ELEMENTOS DEL DOM -----
    const header = document.getElementById('header');
    const hamburguesa = document.getElementById('hamburguesa');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const btnEscribenos = document.getElementById('btnEscribenos');
    const modal = document.getElementById('modalFormulario');
    const modalCerrar = document.getElementById('modalCerrar');
    const formModal = document.getElementById('formModal');

    // ----- 1. MENÚ HAMBURGUESA (MÓVIL) -----
    if (hamburguesa && navMenu) {
        hamburguesa.addEventListener('click', function () {
            hamburguesa.classList.toggle('activo');
            navMenu.classList.toggle('abierto');
            document.body.style.overflow = navMenu.classList.contains('abierto') ? 'hidden' : '';
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburguesa.classList.remove('activo');
                navMenu.classList.remove('abierto');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !hamburguesa.contains(e.target) && navMenu.classList.contains('abierto')) {
                hamburguesa.classList.remove('activo');
                navMenu.classList.remove('abierto');
                document.body.style.overflow = '';
            }
        });
    }

    // ----- 2. EFECTO DEL HEADER AL HACER SCROLL -----
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('activo');
        } else {
            header.classList.remove('activo');
        }
    });

    // ----- 3. MODAL (ABRIR / CERRAR) -----
    function abrirModal() {
        if (modal) {
            modal.classList.add('activo');
            document.body.style.overflow = 'hidden';   // Evita scroll detrás del modal
        }
    }

    function cerrarModal() {
        if (modal) {
            modal.classList.remove('activo');
            document.body.style.overflow = '';
        }
    }

    if (btnEscribenos) {
        btnEscribenos.addEventListener('click', abrirModal);
    }

    if (modalCerrar) {
        modalCerrar.addEventListener('click', cerrarModal);
    }

    // ----- 4. ENVIAR FORMULARIO DEL MODAL -----
    if (formModal) {
        formModal.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = formModal.querySelector('input[type="text"]').value.trim();
            const email = formModal.querySelector('input[type="email"]').value.trim();
            const telefono = formModal.querySelector('input[type="tel"]').value.trim();
            const especialidad = formModal.querySelector('select').value;

            if (!nombre || !email || !telefono || !especialidad) {
                mostrarNotificacion('Por favor, completa todos los campos.', 'error');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                mostrarNotificacion('Ingresa un correo electrónico válido.', 'error');
                return;
            }

            mostrarNotificacion('¡Gracias ' + nombre.split(' ')[0] + '! Te contactaremos pronto.', 'success');
            formModal.reset();
            cerrarModal();
        });
    }

    // ----- 5. SISTEMA DE NOTIFICACIONES TOAST -----
    function mostrarNotificacion(mensaje, tipo) {
        const existente = document.querySelector('.toast-notificacion');
        if (existente) existente.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notificacion';
        toast.innerHTML = `
            <span class="toast-icono">
                <i class="fa-solid ${tipo === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
            </span>
            <span>${mensaje}</span>
            <button class="toast-cerrar">&times;</button>
        `;

        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: tipo === 'success' ? '#b8921c' : '#a55b6c',
            color: tipo === 'success' ? '#0c1621' : '#fff',
            padding: '16px 22px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: "'Raleway', sans-serif",
            fontSize: '0.9rem',
            fontWeight: '500',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            zIndex: '9999',
            animation: 'toastEntrada 0.4s ease',
            maxWidth: '420px',
            lineHeight: '1.4'
        });

        toast.querySelector('.toast-cerrar').style.cssText = `
            background: none;
            border: none;
            color: inherit;
            font-size: 1.3rem;
            cursor: pointer;
            margin-left: auto;
            opacity: 0.7;
        `;

        toast.querySelector('.toast-cerrar').addEventListener('click', function () {
            toast.style.animation = 'toastSalida 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSalida 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // Animaciones toast (inyectadas en el head)
    const estiloToast = document.createElement('style');
    estiloToast.textContent = `
        @keyframes toastEntrada {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toastSalida {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(120%); opacity: 0; }
        }
    `;
    document.head.appendChild(estiloToast);
});
// ==========================================
// DETECCIÓN DE SECCIÓN ACTIVA AL HACER SCROLL
// ==========================================
function actualizarEnlaceActivo() {
    const secciones = document.querySelectorAll('section[id]'); // selecciona todas las secciones con id
    const scrollY = window.pageYOffset + 100; // compensa la altura del header fijo

    secciones.forEach(seccion => {
        const sectionTop = seccion.offsetTop - 100;
        const sectionHeight = seccion.offsetHeight;
        const sectionId = seccion.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            // Elimina la clase activo de todos los enlaces
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('activo'));
            // Añade la clase activo al enlace que coincide con el id de la sección
            const enlaceActivo = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (enlaceActivo) {
                enlaceActivo.classList.add('activo');
            }
        }
    });
}

// Escucha el evento scroll
window.addEventListener('scroll', actualizarEnlaceActivo);