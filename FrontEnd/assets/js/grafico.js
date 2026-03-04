// © 2025 Yesid Colmenares. Todos los derechos reservados.

// Obtenemos el contexto del canvas del HTML
const ctx = document.getElementById('graficoDesconexiones').getContext('2d');

// Configuración del gráfico
const myChart = new Chart(ctx, {
    type: 'bar', // Tipo de gráfico: Barras
    data: {
        // Etiquetas del eje X
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
            label: 'Desconexiones',
            // Datos aproximados visualmente de tu imagen
            data: [7, 12, 3, 6, 0, 0, 0, 0, 0, 0, 0, 0],
            
            // Estilo de las barras
            backgroundColor: '#374149', // Gris azulado oscuro
            hoverBackgroundColor: '#5a1d6c', // Color al pasar el mouse (azul claro)
            borderRadius: 4, // Bordes superiores redondeados
            borderSkipped: false,
            barPercentage: 0.7 // Ancho de las barras
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Permite ajustar la altura si es necesario
        plugins: {
            legend: {
                display: false // Ocultamos la leyenda (el cuadradito de color)
            },
            title: {
                display: true,
                text: 'Desconexiones totales por mes',
                color: '#ffffffff', // Color del título (texto claro)
                font: {
                    size: 15,
                    weight: 'normal'
                },
                padding: {
                    bottom: 20
                }
            },
            tooltip: {
                enabled: true // Muestra info al pasar el mouse
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 12, // Forzamos el máximo a 12 como en la imagen
                grid: {
                    color: '#2d3748', // Líneas de cuadrícula oscuras
                    drawBorder: false
                },
                ticks: {
                    color: '#a0aec0', // Color de los números del eje Y
                    stepSize: 2 // Saltos de 2 en 2 (0, 2, 4...)
                }
            },
            x: {
                grid: {
                    display: false // Ocultamos las líneas verticales del grid
                },
                ticks: {
                    color: '#ffffffff' // Color de los meses
                }
            }
        }
    }
});


// ==========================================
//  SEGUNDO GRÁFICO: Desconexiones por Periférico
// ==========================================

// Nota que usamos una variable nueva: ctxPerifericos
const ctxPerifericos = document.getElementById('graficoPerifericos').getContext('2d');

new Chart(ctxPerifericos, {
    type: 'bar',
    data: {
        labels: ['USB', 'JACK', 'HDMI'],
        datasets: [{
            label: 'Desconexiones',
            data: [8, 5, 3], // Datos basados en tu imagen
            backgroundColor: '#374149', 
            hoverBackgroundColor: '#5a1d6c',
            
            // ESTILOS CLAVE PARA ESTE GRÁFICO:
            borderRadius: 4,      // Hace las barras muy redondas arriba (efecto píldora)
            borderSkipped: false,  // Redondea también abajo si quisieras (opcional)
            barPercentage: 0.7,    // Hace las barras más anchas (80% del espacio)
            categoryPercentage: 0.9 // Reduce el espacio entre columnas
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Desconexiones totales por tipo de periférico',
                color: '#ffffffff',
                font: { size: 15, weight: 'normal' },
                padding: { bottom: 20 }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 9, // Un poco más que el valor máximo (8)
                grid: {
                    color: '#2d3748',
                    drawBorder: false
                },
                ticks: { color: '#ffffffff', stepSize: 2 }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#ffffffff' }
            }
        }
    }
});