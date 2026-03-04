// assets/js/crear_cuenta.js
// Módulo de registro de usuarios
// Método HTTP: POST — Equivalente a doPost() en Servlet Java

document.addEventListener('DOMContentLoaded', function () {

  const btnCrearCuenta   = document.querySelector('.btn-primary');
  const btnIniciarSesion = document.querySelector('.btn-secondary');

  if (btnIniciarSesion) {
    btnIniciarSesion.addEventListener('click', () => {
      window.location.href = '/views/iniciar_sesion.html';
    });
  }

  if (btnCrearCuenta) {
    btnCrearCuenta.addEventListener('click', async function () {
      const inputs      = document.querySelectorAll('input');
      const nombre      = inputs[0].value.trim() + ' ' + inputs[1].value.trim();
      const correo      = document.querySelector('input[type="email"]').value.trim();
      const contrasena  = document.querySelectorAll('input[type="password"]')[0].value.trim();
      const confirmar   = document.querySelectorAll('input[type="password"]')[1].value.trim();

      if (!nombre.trim() || !correo || !contrasena) {
        mostrarMensaje('Por favor completa todos los campos.', 'error');
        return;
      }

      if (contrasena !== confirmar) {
        mostrarMensaje('Las contraseñas no coinciden.', 'error');
        return;
      }

      btnCrearCuenta.disabled    = true;
      btnCrearCuenta.textContent = 'Creando cuenta...';

      try {
        // POST /api/auth/registro
        const respuesta = await fetch('http://localhost:3000/api/auth/registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, correo, contrasena, idRol: 2 })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
          mostrarMensaje('¡Cuenta creada exitosamente! Redirigiendo...', 'exito');
          setTimeout(() => { window.location.href = '/views/iniciar_sesion.html'; }, 1500);
        } else {
          mostrarMensaje(datos.mensaje || 'Error al crear la cuenta.', 'error');
        }
      } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor.', 'error');
      } finally {
        btnCrearCuenta.disabled    = false;
        btnCrearCuenta.textContent = 'Crear cuenta';
      }
    });
  }

  function mostrarMensaje(texto, tipo) {
    let el = document.getElementById('mensajeRegistro');
    if (!el) {
      el = document.createElement('p');
      el.id = 'mensajeRegistro';
      el.style.cssText = 'margin-top:10px;font-size:13px;text-align:center;';
      document.querySelector('.right-panel-form').appendChild(el);
    }
    el.textContent = texto;
    el.style.color = tipo === 'error' ? '#e74c3c' : '#27ae60';
  }
});
