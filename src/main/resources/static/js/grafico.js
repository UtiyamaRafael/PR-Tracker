// grafico.js — evolução do 1RM estimado por exercício (grafico.html)

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('exercicioSelect');
  const canvas = document.getElementById('evolucaoChart');
  let chart;

  // TODO: substituir pelos dados reais de GET /api/dashboard/evolucao?exercicioId=
  const dadosMock = {
    'Supino Reto': [
      { data: '01/07', valor: 78 }, { data: '15/07', valor: 82 },
      { data: '01/08', valor: 85 }, { data: '15/08', valor: 88 },
      { data: '01/09', valor: 90 }, { data: '20/09', valor: 92.5 }
    ],
    'Agachamento Livre': [
      { data: '01/07', valor: 110 }, { data: '15/07', valor: 118 },
      { data: '01/08', valor: 122 }, { data: '15/08', valor: 128 },
      { data: '01/09', valor: 133 }, { data: '20/09', valor: 140 }
    ]
  };

  function desenhar(exercicio) {
    const pontos = dadosMock[exercicio] || [];
    const labels = pontos.map((p) => p.data);
    const valores = pontos.map((p) => p.valor);

    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: '1RM estimado (kg)',
          data: valores,
          borderColor: '#0066FF',
          backgroundColor: 'rgba(0,102,255,0.15)',
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#0066FF',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: '#2C3244' }, ticks: { color: '#8B92A8' } },
          y: { grid: { color: '#2C3244' }, ticks: { color: '#8B92A8' } }
        }
      }
    });

    const primeiro = valores[0] ?? 0;
    const ultimo = valores[valores.length - 1] ?? 0;
    const ganho = (ultimo - primeiro).toFixed(1);
    document.getElementById('valorAtual').textContent = `${ultimo} kg`;
    document.getElementById('valorGanho').textContent = `${ganho >= 0 ? '+' : ''}${ganho} kg`;
  }

  select.addEventListener('change', () => desenhar(select.value));
  desenhar(select.value);
});
