// assets/js/historial.js
// Módulo de historial de actividad
// Método HTTP: GET — Equivalente a doGet() en Servlet Java

document.addEventListener('DOMContentLoaded', async function () {

  cargarDatosHeader();

  const contenedor = document.querySelector('.boxes-horizontal-container');
  if (!contenedor) return;

  try {
    // GET /api/registros/historial
    const respuesta = await fetch('http://localhost:3000/api/registros/historial', {
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
      contenedor.innerHTML = '<p style="color:#aaa;text-align:center;padding:20px;">No hay historial de actividad.</p>';
      return;
    }

    registros.forEach(r => {
      const fechaHora  = new Date(r.fecha_hora);
      const fecha      = fechaHora.toLocaleDateString('es-CO');
      const hora       = fechaHora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      const esVerif    = r.verificado == 1;

      const box = document.createElement('div');
      box.className = `box-horizontal ${esVerif ? 'green' : 'red'}`;
      box.innerHTML = `
        <span class="box-col box-title">${r.numero_maquina}</span>
        <span class="box-col box-desc">Desconexión ${r.tipo_periferico}</span>
        <span class="box-col box-time">${fecha} ${hora} hs</span>
        <span class="box-col box-status">${esVerif ? 'Verificado' : 'Sin verificar'}</span>
      `;
      contenedor.appendChild(box);
    });

  } catch (error) {
    console.error('Error al cargar historial:', error);
  }
});

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