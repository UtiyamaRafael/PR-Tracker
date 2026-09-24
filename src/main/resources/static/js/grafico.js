document.addEventListener('DOMContentLoaded', async () => {
  const select = document.getElementById('exercicioSelect');
  const canvas = document.getElementById('evolucaoChart');
  let chart;

  async function desenhar() {
    const response = await apiFetch(`/api/records/exercise/${select.value}`);
    if (!response.ok) throw new Error(await response.text());
    const registros = (await response.json()).filter((registro) => registro.estimated1RM != null).sort((a, b) => a.date.localeCompare(b.date));
    const valores = registros.map((registro) => registro.estimated1RM);
    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: 'line', data: { labels: registros.map((registro) => formatarData(registro.date)), datasets: [{ label: '1RM estimado (kg)', data: valores, borderColor: '#0066FF', backgroundColor: 'rgba(0,102,255,0.15)', tension: 0.35, fill: true, pointBackgroundColor: '#0066FF', pointRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#2C3244' }, ticks: { color: '#8B92A8' } }, y: { grid: { color: '#2C3244' }, ticks: { color: '#8B92A8' } } } }
    });
    const primeiro = valores[0]; const ultimo = valores.at(-1);
    document.getElementById('valorAtual').textContent = ultimo == null ? '—' : `${ultimo.toFixed(1)} kg`;
    document.getElementById('valorGanho').textContent = ultimo == null ? '—' : `${ultimo - primeiro >= 0 ? '+' : ''}${(ultimo - primeiro).toFixed(1)} kg`;
  }

  try {
    const response = await apiFetch('/api/exercises');
    if (!response.ok) throw new Error(await response.text());
    const exercicios = await response.json();
    select.replaceChildren();
    exercicios.forEach((exercicio) => select.add(new Option(exercicio.name, exercicio.id)));
    select.addEventListener('change', () => desenhar().catch((erro) => alert(erro.message)));
    if (exercicios.length) await desenhar();
  } catch (erro) { alert(erro.message || 'Não foi possível carregar o gráfico.'); }
});
