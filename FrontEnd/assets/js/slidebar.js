// © 2025 Yesid Colmenares. Todos los derechos reservados.

document.addEventListener("DOMContentLoaded", function() {
    const icons = document.querySelectorAll('.sidebar-menu a'); // Todos los íconos del sidebar

    icons.forEach(icon => {
        icon.addEventListener('click', function() {

            // Quita la clase 'active' de todos los íconos
            icons.forEach(i => i.classList.remove('active'));

            // Marca como activo el ícono clickeado
            this.classList.add('active');
        });
    });
});
