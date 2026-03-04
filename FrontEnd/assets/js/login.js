// assets/js/login.js
// Módulo de autenticación — Login
// Método HTTP: POST — Equivalente a doPost() en Servlet Java

document.addEventListener('DOMContentLoaded', function () {

  const btnIniciarSesion = document.getElementById('btnIniciarSesion');
  const btnCrearCuenta   = document.getElementById('btnCrearCuenta');

  if (btnCrearCuenta) {
    btnCrearCuenta.addEventListener('click', function () {
      window.location.href = '/views/crear_cuenta.html';
    });
  }

  if (btnIniciarSesion) {
    btnIniciarSesion.addEventListener('click', async function () {
      const correo     = document.querySelector('input[type="text"]').value.trim();
      const contrasena = document.querySelector('input[type="password"]').value.trim();

      if (!correo || !contrasena) {
        mostrarMensaje('Por favor completa todos los campos.', 'error');
        return;
      }

      btnIniciarSesion.disabled    = true;
      btnIniciarSesion.textContent = 'Ingresando...';

      try {
        // POST /api/auth/login
        const respuesta = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, contrasena })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
          sessionStorage.setItem('token', datos.token);
          sessionStorage.setItem('usuario', JSON.stringify(datos.usuario));
          window.location.href = '/views/inicio.html';
        } else {
          mostrarMensaje(datos.mensaje || 'Credenciales incorrectas.', 'error');
        }
      } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor.', 'error');
      } finally {
        btnIniciarSesion.disabled    = false;
        btnIniciarSesion.textContent = 'Entrar';
      }
    });
  }

  function mostrarMensaje(texto, tipo) {
    let el = document.getElementById('mensajeLogin');
    if (!el) {
      el = document.createElement('p');
      el.id = 'mensajeLogin';
      el.style.cssText = 'margin-top:10px;font-size:13px;text-align:center;';
      document.querySelector('.right-panel-form').appendChild(el);
    }
    el.textContent = texto;
    el.style.color = tipo === 'error' ? '#e74c3c' : '#27ae60';
  }
});

// Funcionalidad para mostrar/ocultar contraseña
const eyeIcon = document.querySelector('.eye-password');
const inputPassword = document.querySelector('input[type="password"]');

if (eyeIcon && inputPassword) {
  eyeIcon.addEventListener('click', function () {
    if (inputPassword.type === 'password') {
      inputPassword.type = 'text';
      eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      inputPassword.type = 'password';
      eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
}

// Funcionalidad "Recordar correo" con localStorage
const checkRecordar = document.querySelector('input[type="checkbox"]');

if (checkRecordar) {
  // Si hay credenciales guardadas, cargarlas
  const correoGuardado = localStorage.getItem('correoRecordado');
  if (correoGuardado) {
    document.querySelector('input[type="text"]').value = correoGuardado;
    checkRecordar.checked = true;
  }

  checkRecordar.addEventListener('change', function () {
    const correo = document.querySelector('input[type="text"]').value.trim();
    if (checkRecordar.checked && correo) {
      localStorage.setItem('correoRecordado', correo);
    } else {
      localStorage.removeItem('correoRecordado');
    }
  });
}