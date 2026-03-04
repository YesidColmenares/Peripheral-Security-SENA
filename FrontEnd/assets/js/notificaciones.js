// assets/js/notificaciones.js
// Módulo de notificaciones en tiempo real
// Método HTTP: GET — Socket.IO para eventos en vivo
// Equivalente a doGet() + Server-Sent Events en Java Servlets

document.addEventListener('DOMContentLoaded', async function () {

  cargarDatosHeader();

  const contenedor = document.querySelector('.boxes-horizontal-container');

  // Cargar notificaciones del día via GET
  await cargarNotificaciones(contenedor);

  // Conectar Socket.IO para recibir eventos en tiempo real
  const socket = io('http://localhost:3000');

  socket.on('nueva_notificacion', function (evento) {
    agregarNotificacion(contenedor, evento, true);
  });
});

/**
 * GET /api/registros/notificaciones
 * Carga los eventos del día actual
 */
async function cargarNotificaciones(contenedor) {
  try {
    const respuesta = await fetch('http://localhost:3000/api/registros/notificaciones', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    if (respuesta.status === 401) { window.location.href = '/views/iniciar_sesion.html'; return; }

    const registros = await respuesta.json();
    contenedor.innerHTML = '';

    if (registros.length === 0) {
      contenedor.innerHTML = '<p style="color:#aaa;text-align:center;padding:20px;">Sin notificaciones hoy.</p>';
      return;
    }

    registros.forEach(r => agregarNotificacion(contenedor, r, false));

  } catch (error) {
    console.error('Error al cargar notificaciones:', error);
  }
}

/**
 * Crea y agrega un box de notificación al contenedor
 */
function agregarNotificacion(contenedor, evento, esNuevo) {
  const hora       = new Date(evento.fecha_hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  const esVerif    = evento.verificado == 1;
  const colorClass = esVerif ? 'green' : 'red';
  const estado     = esVerif ? 'Verificado' : 'Revisar';

  const box = document.createElement('div');
  box.className    = `box-horizontal ${colorClass}`;
  box.dataset.id   = evento.id_registro;
  box.innerHTML = `
    <span class="box-col box-title">${evento.numero_maquina}</span>
    <span class="box-col box-desc">Desconexión ${evento.tipo_periferico}</span>
    <span class="box-col box-time">${hora} hs</span>
    <span class="box-col box-status" style="cursor:pointer" onclick="verificarEvento(${evento.id_registro}, this)">${estado}</span>
  `;

  if (esNuevo) {
    contenedor.prepend(box);
  } else {
    contenedor.appendChild(box);
  }
}

/**
 * PUT /api/registros/:id/verificar
 * Marca una notificación como verificada al hacer clic
 */
async function verificarEvento(idRegistro, elemento) {
  try {
    const respuesta = await fetch(`http://localhost:3000/api/registros/${idRegistro}/verificar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    if (respuesta.ok) {
      const box = elemento.closest('.box-horizontal');
      box.classList.remove('red');
      box.classList.add('green');
      elemento.textContent = 'Verificado';
    }
  } catch (error) {
    console.error('Error al verificar evento:', error);
  }
}

function cargarDatosHeader() {
  const usuarioStr = sessionStorage.getItem('usuario');
  if (!usuarioStr) { window.location.href = '/views/iniciar_sesion.html'; return; }
  const usuario = JSON.parse(usuarioStr);
  const elNombre = document.querySelector('.user-name');
  const elRol    = document.querySelector('.user-role');
  if (elNombre) elNombre.textContent = usuario.nombre;
  if (elRol)    elRol.textContent    = usuario.rol;
}

function cerrarSesion() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    window.location.href = '/views/iniciar_sesion.html';
}