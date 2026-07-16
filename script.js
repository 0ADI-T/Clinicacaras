// ================================================================
// CLÍNICA CARAS – SCRIPT PRINCIPAL (CORREGIDO Y AMPLIADO)
// ================================================================

document.addEventListener('DOMContentLoaded', function () {
    // ----- ELEMENTOS DEL DOM -----
    const header = document.getElementById('header');
    const hamburguesa = document.getElementById('hamburguesa');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroParticles = document.getElementById('heroParticles');
    const btnEscribenosFlotante = document.getElementById('btnEscribenosFlotante');
    const btnSolicitarInfo = document.getElementById('btnSolicitarInfo');
    const btnCtaProtesis = document.getElementById('btnCtaProtesis');
    const modal = document.getElementById('modalFormulario');
    const modalCerrar = document.getElementById('modalCerrar');
    const formModal = document.getElementById('formModal');

    // ----- MENÚ HAMBURGUESA (MÓVIL) -----
    if (hamburguesa && navMenu) {
        hamburguesa.addEventListener('click', () => {
            hamburguesa.classList.toggle('activo');
            navMenu.classList.toggle('abierto');
            document.body.style.overflow = navMenu.classList.contains('abierto') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburguesa.classList.remove('activo');
                navMenu.classList.remove('abierto');
                document.body.style.overflow = '';
            });
        });

        // Cerrar al hacer clic fuera del menú
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburguesa.contains(e.target) && navMenu.classList.contains('abierto')) {
                hamburguesa.classList.remove('activo');
                navMenu.classList.remove('abierto');
                document.body.style.overflow = '';
            }
        });
    }

    // ----- HEADER SCROLL -----
    function updateHeader() {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', updateHeader);
    updateHeader();

    // ----- ENLACE ACTIVO SEGÚN SECCIÓN VISIBLE (solo en index con #) -----
    const sections = document.querySelectorAll('section[id]');
    function updateActiveLink() {
        if (sections.length === 0) return;
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.pageYOffset >= top && window.pageYOffset < top + section.offsetHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('activo');
            if (link.getAttribute('href') === '#' + current) link.classList.add('activo');
        });
    }
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // ----- PARTÍCULAS DEL HERO -----
    if (heroParticles) {
        function createParticle() {
            const p = document.createElement('div');
            p.classList.add('particle');
            const size = Math.random() * 6 + 3;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = '-20px';
            p.style.animationDuration = Math.random() * 10 + 8 + 's';
            p.style.animationDelay = Math.random() * 5 + 's';
            heroParticles.appendChild(p);
            setTimeout(() => { if (p.parentNode) p.remove(); }, (parseFloat(p.style.animationDuration) + parseFloat(p.style.animationDelay)) * 1000);
        }
        for (let i = 0; i < 25; i++) setTimeout(createParticle, Math.random() * 3000);
        setInterval(() => { if (heroParticles.children.length < 30) createParticle(); }, 800);
    }

    // ----- SCROLL REVEAL (AOS) -----
    const revealElements = document.querySelectorAll('[data-aos]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('aos-animate'));
    }

    // ----- CONTADOR DE VENTAJAS -----
    document.querySelectorAll('.ventaja-num').forEach(num => {
        num.style.opacity = '0.5';
        num.style.transform = 'scale(0.8)';
        num.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        obs.observe(num);
    });

    // ----- MODAL (ABRIR / CERRAR) -----
    function abrirModal() {
        if (!modal) return;
        modal.classList.add('activo');
        document.body.style.overflow = 'hidden';
    }

    function cerrarModal() {
        if (!modal) return;
        modal.classList.remove('activo');
        document.body.style.overflow = '';
    }

    // Botones que abren el modal
    if (btnEscribenosFlotante) {
        btnEscribenosFlotante.addEventListener('click', abrirModal);
    }
    if (btnSolicitarInfo) {
        btnSolicitarInfo.addEventListener('click', function(e) {
            e.preventDefault();
            abrirModal();
        });
    }
    if (btnCtaProtesis) {
        btnCtaProtesis.addEventListener('click', abrirModal);
    }

    if (modalCerrar) {
        modalCerrar.addEventListener('click', cerrarModal);
    }

    // ----- VALIDACIÓN DEL FORMULARIO DEL MODAL -----
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
                e.preventDefault();
                mostrarNotificacion(errores.join(' '), 'error');
            }
        });
    }

    // ----- NOTIFICACIONES TOAST -----
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

        const btnCerrar = toast.querySelector('.toast-cerrar');
        if (btnCerrar) {
            btnCerrar.style.cssText = 'background:none; border:none; color:inherit; font-size:1.3rem; cursor:pointer; margin-left:auto; opacity:0.7;';
            btnCerrar.addEventListener('click', () => {
                toast.style.animation = 'toastSalida 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            });
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSalida 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // ----- SCROLL SUAVE PARA ENLACES INTERNOS (solo los que empiezan con #) -----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // Mensaje de éxito si se vuelve de enviar.php
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('enviado') === '1') {
        mostrarNotificacion('¡Gracias! Tu solicitud fue enviada. Te contactaremos pronto.', 'success');
    }
});

// ----- ESTILOS DINÁMICOS PARA LAS ANIMACIONES DE TOAST -----
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