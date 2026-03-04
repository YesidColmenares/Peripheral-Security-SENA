// assets/js/dashboard.js
// Módulo del dashboard — carga estadísticas y gráficos
// Método HTTP: GET — Equivalente a doGet() en Servlet Java

document.addEventListener('DOMContentLoaded', async function () {

  // Cargar nombre y rol del usuario en el header
  cargarDatosHeader();

  try {
    // GET /api/registros/dashboard
    const respuesta = await fetch('http://localhost:3000/api/registros/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    if (respuesta.status === 401 || respuesta.status === 403) {
      window.location.href = '/views/iniciar_sesion.html';
      return;
    }

    const datos = await respuesta.json();

    // Actualizar métricas en los boxes
    actualizarBoxes(datos);

    // Renderizar gráfico de desconexiones por mes
    renderizarGraficoMensual(datos.desconexionesPorMes);

    // Renderizar gráfico de desconexiones por tipo de periférico
    renderizarGraficoPerifericos(datos.desconexionesPorTipo);

  } catch (error) {
    console.error('Error al cargar dashboard:', error);
  }
});

/**
 * Actualiza los valores numéricos de los 4 boxes del dashboard
 */
function actualizarBoxes(datos) {
  const boxes = document.querySelectorAll('.box-text-large');
  if (boxes.length >= 4) {
    boxes[0].textContent = datos.desconexionesTotales  || 0;
    boxes[1].textContent = datos.desconexionesHoy      || 0;
    boxes[2].textContent = datos.totalMaquinas         || 0;
    boxes[3].textContent = 0; // Inactivas se calculan con Socket.IO
  }
}

/**
 * Renderiza el gráfico de barras de desconexiones por mes (enero–diciembre)
 */
function renderizarGraficoMensual(desconexionesPorMes) {
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const valores = Array(12).fill(0);

  desconexionesPorMes.forEach(item => {
    valores[item.mes - 1] = item.total;
  });

  const ctx = document.getElementById('graficoDesconexiones');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [{
        label: 'Desconexiones por mes',
        data: valores,
        backgroundColor: 'rgba(46, 109, 164, 0.7)',
        borderColor: '#2E6DA4',
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#ccc' } } },
      scales: {
        x: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
      }
    }
  });
}

/**
 * Renderiza el gráfico de barras de desconexiones por tipo de periférico (USB, JACK, HDMI)
 */
function renderizarGraficoPerifericos(desconexionesPorTipo) {
  const tipos   = ['USB', 'JACK', 'HDMI'];
  const colores = ['rgba(231,76,60,0.7)', 'rgba(243,156,18,0.7)', 'rgba(39,174,96,0.7)'];
  const valores = tipos.map(tipo => {
    const encontrado = desconexionesPorTipo.find(d => d.tipo === tipo);
    return encontrado ? encontrado.total : 0;
  });

  const ctx = document.getElementById('graficoPerifericos');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: tipos,
      datasets: [{
        label: 'Desconexiones por periférico',
        data: valores,
        backgroundColor: colores,
        borderColor: colores.map(c => c.replace('0.7', '1')),
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: '#ccc' } } },
      scales: {
        x: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#ccc' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
      }
    }
  });
}

/**
 * Carga nombre y rol del usuario logueado en el header
 */
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