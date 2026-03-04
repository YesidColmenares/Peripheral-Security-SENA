// assets/js/configuracion.js
// Módulo de configuración — gestión de roles de usuarios
// Métodos HTTP: GET (listar) y PUT (actualizar rol)
// Equivalente a doGet() y doPost() en Servlet Java

document.addEventListener('DOMContentLoaded', async function () {

  cargarDatosHeader();
  await cargarUsuarios();
});

/**
 * GET /api/usuarios
 * Carga la lista de usuarios con sus roles
 */

async function cargarUsuarios() {
  const contenedor = document.querySelector('.boxes-horizontal-container');
  if (!contenedor) return;

  try {
    const respuesta = await fetch('http://localhost:3000/api/usuarios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    if (respuesta.status === 401) { window.location.href = '/views/iniciar_sesion.html'; return; }
    if (respuesta.status === 403) {
      contenedor.innerHTML = '<p style="color:#e74c3c;text-align:center;padding:20px;">⛔ No tienes permisos para ver esta sección.</p>';
      return;
    }

    const datos = await respuesta.json();
    const usuarios = Array.isArray(datos) ? datos : datos.usuarios || [];

    const tablaExistente = document.getElementById('tablaUsuarios');
    if (tablaExistente) tablaExistente.remove();

    const tabla = document.createElement('div');
    tabla.id = 'tablaUsuarios';
    tabla.style.cssText = 'margin-top:20px;';

    usuarios.forEach(u => {
      const fila = document.createElement('div');
      fila.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 20px;margin-bottom:8px;background:rgba(255,255,255,0.05);border-radius:8px;';
      fila.innerHTML = `
        <span style="color:#fff;font-size:14px;">${u.nombre}</span>
        <span style="color:#aaa;font-size:13px;">${u.correo}</span>
        <select
          data-id="${u.id_usuario}"
          onchange="actualizarRol(this)"
          style="background:#1a1a2e;color:#fff;border:1px solid #444;padding:5px 10px;border-radius:6px;font-size:13px;cursor:pointer;">
          <option value="1" ${u.rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
          <option value="2" ${u.rol === 'Operario'      ? 'selected' : ''}>Operario</option>
        </select>
      `;
      tabla.appendChild(fila);
    });

    contenedor.appendChild(tabla);

  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
}

/**
 * PUT /api/usuarios/:id/rol
 * Actualiza el rol de un usuario al cambiar el select
 */
async function actualizarRol(select) {
  const idUsuario = select.dataset.id;
  const idRol     = select.value;

  try {
    const respuesta = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}/rol`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({ idRol: parseInt(idRol) })
    });

    const datos = await respuesta.json();
    if (respuesta.ok) {
      select.style.borderColor = '#27ae60';
      setTimeout(() => { select.style.borderColor = '#444'; }, 1500);
    } else {
      alert(datos.mensaje);
    }
  } catch (error) {
    console.error('Error al actualizar rol:', error);
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