// ==========================================
// CLÍNICA CARAS – SCRIPT PRINCIPAL
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

    // ----- ELEMENTOS DEL DOM -----
    const header = document.getElementById('header');
    const hamburguesa = document.getElementById('hamburguesa');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const btnEscribenosFlotante = document.getElementById('btnEscribenosFlotante');
    const modal = document.getElementById('modalFormulario');
    const modalCerrar = document.getElementById('modalCerrar');
    const formModal = document.getElementById('formModal');

    // ----- 1. REFUERZO PARA MÓVILES MODERNOS -----
    document.addEventListener('touchstart', function() {}, {passive: true});

    if (hamburguesa) {
        hamburguesa.style.display = 'flex';
        hamburguesa.style.position = 'relative';
        hamburguesa.style.zIndex = '2000';
    }

    // ----- 2. MENÚ HAMBURGUESA (MÓVIL) -----
    if (hamburguesa && navMenu) {

        // Abrir / cerrar menú al hacer clic en la hamburguesa
        hamburguesa.addEventListener('click', function () {
            hamburguesa.classList.toggle('activo');
            navMenu.classList.toggle('abierto');

            // Evita que el fondo se desplace mientras el menú está abierto
            if (navMenu.classList.contains('abierto')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Cerrar menú al hacer clic en un enlace del menú
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburguesa.classList.remove('activo');
                navMenu.classList.remove('abierto');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú al hacer clic fuera del menú (en el fondo oscuro)
        document.addEventListener('click', function (e) {
            // Si el clic no fue dentro del menú ni en la hamburguesa
            if (!navMenu.contains(e.target) && !hamburguesa.contains(e.target)) {
                // Y el menú está abierto
                if (navMenu.classList.contains('abierto')) {
                    hamburguesa.classList.remove('activo');
                    navMenu.classList.remove('abierto');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // ----- 3. EFECTO DEL HEADER AL HACER SCROLL -----
    window.addEventListener('scroll', function () {
        // Agrega clase cuando el usuario baja la página
        if (window.scrollY > 50) {
            header.classList.add('activo');
        } else {
            header.classList.remove('activo');
        }
    });

    // ----- 4. DETECCIÓN DE SECCIÓN ACTIVA (PINTADO DORADO) -----
    function actualizarEnlaceActivo() {
        const secciones = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset + 100;

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

    window.addEventListener('scroll', actualizarEnlaceActivo);

    // ----- 5. MODAL (ABRIR / CERRAR) -----
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

    // Abrir modal con el botón flotante
    if (btnEscribenosFlotante) {
        btnEscribenosFlotante.addEventListener('click', abrirModal);
    }

    // Cerrar modal con la X
    if (modalCerrar) {
        modalCerrar.addEventListener('click', cerrarModal);
    }

    // ----- 6. ENVIAR FORMULARIO DEL MODAL -----
    if (formModal) {
        formModal.addEventListener('submit', function (e) {
            const nombre = formModal.querySelector('input[name="nombre"]').value.trim();
            const email = formModal.querySelector('input[name="email"]').value.trim();
            const telefono = formModal.querySelector('input[name="telefono"]').value.trim();
            const especialidad = formModal.querySelector('select[name="especialidad"]').value;

            let errores = [];

            if (!nombre) errores.push('Completa tu nombre.');
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.push('Ingresa un correo válido.');
            if (!telefono) errores.push('Ingresa tu teléfono.');
            if (!especialidad) errores.push('Selecciona una especialidad.');

            if (errores.length > 0) {
                e.preventDefault(); // Solo evita el envío si hay errores
                mostrarNotificacion(errores.join(' '), 'error');
            }
            // Si no hay errores, el formulario se envía normalmente a enviar.php
        });
    }

    // ----- 7. MOSTRAR MENSAJE DE ÉXITO AL VOLVER DEL PHP -----
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('enviado') === '1') {
        mostrarNotificacion('¡Gracias! Tu solicitud fue enviada. Te contactaremos pronto.', 'success');
    }

    // ----- 8. SISTEMA DE NOTIFICACIONES TOAST -----
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
