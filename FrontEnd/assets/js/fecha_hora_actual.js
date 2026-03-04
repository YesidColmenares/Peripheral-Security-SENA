// © 2025 Yesid Colmenares. Todos los derechos reservados.

document.addEventListener("DOMContentLoaded", () => {

    // Obtiene los elementos del formulario donde se mostrará la fecha y la hora
    const fecha = document.getElementById("fecha");
    const hora  = document.getElementById("hora");

    // Función encargada de actualizar la fecha y la hora actual
    const actualizarFechaHora = () => {
        const now = new Date(); 

        // Formato de fecha: yyyy-mm-dd
        fecha.value = now.toISOString().slice(0, 10);

        // Formato de hora: HH:MM
        hora.value = now.toTimeString().slice(0, 5);
    };

    actualizarFechaHora();                // Ejecuta una vez al cargar la página
    setInterval(actualizarFechaHora, 1000); // Actualiza automáticamente cada segundo
});
