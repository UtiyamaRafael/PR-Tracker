// historico.js — histórico de registros com filtro por exercício (historico.html)

document.addEventListener('DOMContentLoaded', () => {
  // TODO: substituir pelos dados reais de GET /api/registros
  const registros = [
    { nome: 'Supino reto', valor: '92,5 kg', meta: '5 reps · 20/09/2026', pr: true },
    { nome: 'Supino reto', valor: '90 kg', meta: '5 reps · 01/09/2026', pr: false },
    { nome: 'Agachamento livre', valor: '140 kg', meta: '3 reps · 18/09/2026', pr: true },
    { nome: 'Levantamento terra', valor: '160 kg', meta: '2 reps · 15/09/2026', pr: false }
  ];

  const lista = document.getElementById('historicoLista');
  const empty = document.getElementById('historicoEmpty');
  const filtro = document.getElementById('filtroExercicio');

  function render(itens) {
    lista.querySelectorAll('.record-row').forEach((el) => el.remove());
    itens.forEach((r) => {
      const row = document.createElement('div');
      row.className = 'record-row';
      row.innerHTML = `
        <div class="record-row__main">
          <div class="record-row__name">${r.nome}${r.pr ? '<span class="pr-badge">PR</span>' : ''}</div>
          <div class="record-row__meta">${r.meta}</div>
        </div>
        <div class="record-row__value">${r.valor}</div>`;
      lista.insertBefore(row, empty);
    });
    empty.style.display = itens.length ? 'none' : 'block';
  }

  filtro.addEventListener('change', () => {
    const valor = filtro.value;
    const filtrados = valor === 'todos' ? registros : registros.filter((r) => r.nome === valor);
    render(filtrados);
  });

  render(registros);
});
