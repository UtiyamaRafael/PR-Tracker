// dashboard.js — resumo do treino (index.html)

document.addEventListener('DOMContentLoaded', () => {
  // TODO: substituir pelos dados reais de GET /api/dashboard
  const resumo = {
    totalPrs: 14,
    exerciciosCadastrados: 9,
    treinosNoMes: 12,
    ultimoTreino: '21/09'
  };

  document.getElementById('statTotalPrs').textContent = resumo.totalPrs;
  document.getElementById('statExercicios').textContent = resumo.exerciciosCadastrados;
  document.getElementById('statTreinosMes').textContent = resumo.treinosNoMes;
  document.getElementById('statUltimoTreino').textContent = resumo.ultimoTreino;

  // TODO: substituir pelos dados reais de GET /api/registros?recentes=true
  const recentes = [
    { nome: 'Supino reto', valor: '92,5 kg', meta: '5 reps · 1RM estimado', pr: true },
    { nome: 'Agachamento livre', valor: '140 kg', meta: '3 reps · 1RM estimado', pr: true },
    { nome: 'Levantamento terra', valor: '160 kg', meta: '2 reps · 1RM estimado', pr: false }
  ];

  const lista = document.getElementById('recentesLista');
  recentes.forEach((r) => {
    const row = document.createElement('div');
    row.className = 'record-row';
    row.innerHTML = `
      <div class="record-row__main">
        <div class="record-row__name">${r.nome}${r.pr ? '<span class="pr-badge">NOVO PR</span>' : ''}</div>
        <div class="record-row__meta">${r.meta}</div>
      </div>
      <div class="record-row__value">${r.valor}</div>`;
    lista.appendChild(row);
  });
});
