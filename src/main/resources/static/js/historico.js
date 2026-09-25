document.addEventListener('DOMContentLoaded', async () => {
  const lista = document.getElementById('historicoLista');
  const empty = document.getElementById('historicoEmpty');
  const filtro = document.getElementById('filtroExercicio');
  let registros = [];

  // RF09 — editar ou excluir um registro já lançado, recalculando o PR
  async function editarRegistro(registro) {
    const novoPesoTexto = window.prompt(
      'Novo peso (kg) — deixe em branco para peso corporal:',
      registro.weight == null ? '' : registro.weight
    );
    if (novoPesoTexto === null) return;
    const novasRepsTexto = window.prompt('Novas repetições:', registro.reps);
    if (novasRepsTexto === null) return;
    const novasReps = Number(novasRepsTexto);
    if (!novasReps || novasReps < 1) { alert('Repetições inválidas.'); return; }
    const novoPeso = novoPesoTexto.trim() === '' ? null : Number(novoPesoTexto);

    try {
      const response = await apiFetch(`/api/records/${registro.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId: registro.exercise.id, weight: novoPeso, reps: novasReps, date: registro.date })
      });
      if (!response.ok) throw new Error(await response.text());
      const atualizado = await response.json();
      registro.weight = atualizado.weight;
      registro.reps = atualizado.reps;
      registro.isPr = atualizado.isPr;
      render(filtro.value === 'todos' ? registros : registros.filter((r) => r.exercise.id === Number(filtro.value)));
    } catch (erro) { alert(erro.message || 'Não foi possível editar o registro.'); }
  }

  async function excluirRegistro(registro) {
    if (!window.confirm('Excluir este registro?')) return;
    try {
      const response = await apiFetch(`/api/records/${registro.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await response.text());
      registros = registros.filter((r) => r.id !== registro.id);
      render(filtro.value === 'todos' ? registros : registros.filter((r) => r.exercise.id === Number(filtro.value)));
    } catch (erro) { alert(erro.message || 'Não foi possível excluir o registro.'); }
  }

  function render(itens) {
    lista.querySelectorAll('.record-row').forEach((el) => el.remove());
    itens.forEach((registro) => {
      const row = document.createElement('div'); row.className = 'record-row';
      const main = document.createElement('div'); main.className = 'record-row__main';
      const name = document.createElement('div'); name.className = 'record-row__name'; name.append(registro.exercise.name);
      if (registro.isPr) { const badge = document.createElement('span'); badge.className = 'pr-badge'; badge.textContent = 'PR'; name.append(badge); }
      const meta = document.createElement('div'); meta.className = 'record-row__meta'; meta.textContent = `${registro.reps} reps · ${formatarData(registro.date)}`;
      const value = document.createElement('div'); value.className = 'record-row__value'; value.textContent = registro.weight == null ? '—' : `${registro.weight} kg`;

      const actions = document.createElement('div'); actions.className = 'record-row__actions';
      const editBtn = document.createElement('button');
      editBtn.type = 'button'; editBtn.className = 'icon-btn'; editBtn.setAttribute('aria-label', 'Editar');
      editBtn.textContent = '✎'; editBtn.addEventListener('click', () => editarRegistro(registro));
      const delBtn = document.createElement('button');
      delBtn.type = 'button'; delBtn.className = 'icon-btn icon-btn--danger'; delBtn.setAttribute('aria-label', 'Excluir');
      delBtn.textContent = '✕'; delBtn.addEventListener('click', () => excluirRegistro(registro));
      actions.append(editBtn, delBtn);

      main.append(name, meta); row.append(main, value, actions); lista.insertBefore(row, empty);
    });
    empty.style.display = itens.length ? 'none' : 'block';
  }

  try {
    const exerciseResponse = await apiFetch('/api/exercises');
    if (!exerciseResponse.ok) throw new Error(await exerciseResponse.text());
    const exercises = await exerciseResponse.json();
    filtro.replaceChildren(new Option('Todos os exercícios', 'todos'));
    exercises.forEach((exercise) => filtro.add(new Option(exercise.name, exercise.id)));
    const histories = await Promise.all(exercises.map(async (exercise) => {
      const response = await apiFetch(`/api/records/exercise/${exercise.id}`);
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    }));
    registros = histories.flat().sort((a, b) => b.date.localeCompare(a.date));
    filtro.addEventListener('change', () => render(filtro.value === 'todos' ? registros : registros.filter((r) => r.exercise.id === Number(filtro.value))));
    render(registros);
  } catch (erro) { alert(erro.message || 'Não foi possível carregar o histórico.'); }
});
