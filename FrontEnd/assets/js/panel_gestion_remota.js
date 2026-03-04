// © 2025 Yesid Colmenares. Todos los derechos reservados.

document.addEventListener("DOMContentLoaded", () => {

    // --- FUNCIONES COMUNES ---
    const toggleDisplay = (el) => el.style.display = (el.style.display === 'block') ? 'none' : 'block';
    const hideAll = () => {
        // Oculta todos los menús y submenús
        document.querySelectorAll('.menu-flotante').forEach(menu => {
            menu.style.display = 'none';
            const submenu = menu.querySelector('.submenu');
            if(submenu) submenu.style.display = 'none';
        });
    };

    // --- DESKTOP ---
    const menuDesktop = document.getElementById('menuFlotante');
    const menuPC = document.getElementById('menuPC');
    const menuStatus = document.getElementById('menuStatus');
    const submenuDesktop = menuDesktop.querySelector('.submenu');

    // Clic en círculos (vista de cuadrícula)
    document.querySelectorAll('.grid-view .circle').forEach(circle => {
        circle.addEventListener('click', (e) => {
            e.stopPropagation();

            // Actualiza nombre y estado
            menuPC.textContent = `PC ${circle.textContent}`;
            menuStatus.textContent = circle.classList.contains('circle-active') ? 'Encendido' :
                                     circle.classList.contains('circle-error') ? 'Error' : 'Inactivo';

            // Posiciona menú junto al círculo
            const rect = circle.getBoundingClientRect();
            const parentRect = circle.parentElement.getBoundingClientRect();
            menuDesktop.style.top = `${rect.bottom - parentRect.top + 250}px`;
            menuDesktop.style.left = `${rect.left - parentRect.left + 160}px`;

            menuDesktop.style.display = 'block';
            submenuDesktop.style.display = 'none';
        });
    });

    // Mostrar/ocultar submenú desktop
    menuDesktop.querySelector('li:first-child').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDisplay(submenuDesktop);
    });

    // Evita cierre accidental al hacer clic dentro
    menuDesktop.addEventListener('click', (e) => e.stopPropagation());

    // --- MOBILE ---
    const templateMenu = menuDesktop.cloneNode(true); // base para cada item móvil
    templateMenu.removeAttribute('id');
    templateMenu.style.display = 'none';
    templateMenu.style.position = 'absolute';

    // Clic en los tres puntos de cada elemento
    document.querySelectorAll('.list-view .list-items li').forEach(item => {
        const menuBtn = item.querySelector('.pc-actions');
        const menuMobile = templateMenu.cloneNode(true);
        item.appendChild(menuMobile);

        const submenuMobile = menuMobile.querySelector('.submenu');
        const ejecutarLiMobile = menuMobile.querySelector('li:first-child');

        menuMobile.addEventListener('click', (e) => e.stopPropagation());

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Cierra otros menús
            document.querySelectorAll('.list-view .menu-flotante').forEach(m => {
                if (m !== menuMobile) {
                    m.style.display = 'none';
                    const submenu = m.querySelector('.submenu');
                    if (submenu) submenu.style.display = 'none';
                }
            });

            // Posición respecto al panel
            const rect = menuBtn.getBoundingClientRect();
            const panelRect = document.querySelector('.dashboard-panel').getBoundingClientRect();

            menuMobile.querySelector('h3').textContent = item.querySelector('.pc-id').textContent;
            menuMobile.querySelector('.status').textContent = item.querySelector('.pc-status span:last-child').textContent;

            menuMobile.style.top = `${rect.top - panelRect.top + 165}px`;
            menuMobile.style.left = `${rect.left - panelRect.left - 185}px`;

            toggleDisplay(menuMobile);
            submenuMobile.style.display = 'none';
        });

        // Submenú móvil
        ejecutarLiMobile.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDisplay(submenuMobile);
        });
    });

    // --- CLICK FUERA ---
    document.addEventListener('click', hideAll);

});

function cerrarSesion() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    window.location.href = '/views/iniciar_sesion.html';
}