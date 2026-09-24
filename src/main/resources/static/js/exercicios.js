const listEl = document.getElementById('listaExercicios');
const emptyState = document.getElementById('emptyState');
const form = document.getElementById('exercicioForm');
const groupSelect = document.getElementById('grupoMuscular');

function iconEditar() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>`;
}

function iconExcluir() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2 2L5 6"></path></svg>`;
}

function toggleEmptyState() {
  emptyState.style.display = listEl.querySelectorAll('.exercise-row').length ? 'none' : 'block';
}

async function respostaOuErro(response) {
  if (response.ok) return response;
  throw new Error((await response.text()) || 'Não foi possível concluir a operação.');
}

function renderExercicio(exercicio) {
  const row = document.createElement('div');
  row.className = 'exercise-row';
  const name = document.createElement('div');
  name.className = 'exercise-row__name';
  name.append(exercicio.name);
  const group = document.createElement('span');
  group.textContent = ` (${exercicio.muscleGroup.name.toLowerCase()})`;
  name.append(group);

  const actions = document.createElement('div');
  actions.className = 'exercise-row__actions';
  const edit = document.createElement('button');
  edit.type = 'button'; edit.className = 'icon-btn'; edit.setAttribute('aria-label', 'Editar'); edit.innerHTML = iconEditar();
  edit.addEventListener('click', async () => {
    const novoNome = window.prompt('Novo nome do exercício:', exercicio.name)?.trim();
    if (!novoNome || novoNome === exercicio.name) return;
    try {
      await respostaOuErro(await apiFetch(`/api/exercises/${exercicio.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: novoNome, muscleGroupId: exercicio.muscleGroup.id })
      }));
      await carregarExercicios();
    } catch (erro) { alert(erro.message); }
  });
  const remove = document.createElement('button');
  remove.type = 'button'; remove.className = 'icon-btn icon-btn--danger'; remove.setAttribute('aria-label', 'Excluir'); remove.innerHTML = iconExcluir();
  remove.addEventListener('click', async () => {
    if (!window.confirm(`Excluir o exercício “${exercicio.name}”?`)) return;
    try {
      await respostaOuErro(await apiFetch(`/api/exercises/${exercicio.id}`, { method: 'DELETE' }));
      row.remove(); toggleEmptyState();
    } catch (erro) { alert(erro.message); }
  });
  actions.append(edit, remove);
  row.append(name, actions);
  listEl.insertBefore(row, emptyState);
}

async function carregarGrupos() {
  const grupos = await (await respostaOuErro(await apiFetch('/api/muscle-groups'))).json();
  groupSelect.replaceChildren();
  grupos.forEach((grupo) => groupSelect.add(new Option(grupo.name, grupo.id)));
}

async function carregarExercicios() {
  const exercicios = await (await respostaOuErro(await apiFetch('/api/exercises'))).json();
  listEl.querySelectorAll('.exercise-row').forEach((row) => row.remove());
  exercicios.forEach(renderExercicio);
  toggleEmptyState();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('nomeExercicio').value.trim();
  const muscleGroupId = Number(groupSelect.value);
  if (!name || !muscleGroupId) return;
  try {
    const response = await respostaOuErro(await apiFetch('/api/exercises', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, muscleGroupId })
    }));
    renderExercicio(await response.json());
    form.reset();
  } catch (erro) { alert(erro.message); }
});

(async () => {
  try { await carregarGrupos(); await carregarExercicios(); }
  catch (erro) { alert(erro.message); }
})();
