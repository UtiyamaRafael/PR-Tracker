document.addEventListener('DOMContentLoaded', async () => {
  const lista = document.getElementById('historicoLista');
  const empty = document.getElementById('historicoEmpty');
  const filtro = document.getElementById('filtroExercicio');
  let registros = [];

  function render(itens) {
    lista.querySelectorAll('.record-row').forEach((el) => el.remove());
    itens.forEach((registro) => {
      const row = document.createElement('div'); row.className = 'record-row';
      const main = document.createElement('div'); main.className = 'record-row__main';
      const name = document.createElement('div'); name.className = 'record-row__name'; name.append(registro.exercise.name);
      if (registro.isPr) { const badge = document.createElement('span'); badge.className = 'pr-badge'; badge.textContent = 'PR'; name.append(badge); }
      const meta = document.createElement('div'); meta.className = 'record-row__meta'; meta.textContent = `${registro.reps} reps · ${formatarData(registro.date)}`;
      const value = document.createElement('div'); value.className = 'record-row__value'; value.textContent = registro.weight == null ? '—' : `${registro.weight} kg`;
      main.append(name, meta); row.append(main, value); lista.insertBefore(row, empty);
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
