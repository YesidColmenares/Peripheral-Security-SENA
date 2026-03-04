// assets/js/api.js
// Configuración central de la API
// Equivalente a la configuración de conexión en Servlets Java

const API_URL = 'http://localhost:3000/api';

/**
 * Obtiene el token JWT guardado en sessionStorage
 */
function obtenerToken() {
  return sessionStorage.getItem('token');
}

/**
 * Guarda los datos de sesión del usuario
 */
function guardarSesion(token, usuario) {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('usuario', JSON.stringify(usuario));
}

/**
 * Cierra la sesión eliminando los datos guardados
 */
function cerrarSesion() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('usuario');
  window.location.href = '/views/iniciar_sesion.html';
}

/**
 * Retorna los headers con el token JWT para peticiones autenticadas
 */
function headersAuth() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${obtenerToken()}`
  };
}

/**
 * Carga los datos del usuario en el header de cada página
 */
function cargarDatosHeader() {
  const usuarioStr = sessionStorage.getItem('usuario');
  if (!usuarioStr) {
    window.location.href = '/views/iniciar_sesion.html';
    return;
  }
  const usuario = JSON.parse(usuarioStr);
  const elNombre = document.querySelector('.user-name');
  const elRol    = document.querySelector('.user-role');
  if (elNombre) elNombre.textContent = usuario.nombre;
  if (elRol)    elRol.textContent    = usuario.rol;
}
