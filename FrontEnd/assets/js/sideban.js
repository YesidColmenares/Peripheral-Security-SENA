// © 2025 Yesid Colmenares. Todos los derechos reservados.

// Elementos principales del layout
const hamburger = document.getElementById('hamburger');
const sidebar = document.querySelector('.sidebar');
const dashboardPanel = document.querySelector('.dashboard-panel');
const topSidebar = document.querySelector('.top-sidebar');

// Alterna clases para mostrar/ocultar el sidebar y ajustar el layout
hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-hidden');   // Oculta o muestra la barra lateral
    dashboardPanel.classList.toggle('panel-expanded'); // Expande/contrae el panel principal
    topSidebar.classList.toggle('top-expanded');  // Ajusta el título o sección superior
});
