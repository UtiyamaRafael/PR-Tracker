// exercicios.js — cadastro e listagem de exercícios (exercicios.html)

const listEl = document.getElementById('listaExercicios');
const emptyState = document.getElementById('emptyState');

function iconEditar() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 20h9"></path>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
  </svg>`;
}

function iconExcluir() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 6h18"></path>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
  </svg>`;
}

function renderExercicio({ nome, grupo }) {
  const row = document.createElement('div');
  row.className = 'exercise-row';
  row.innerHTML = `
    <div class="exercise-row__name">${nome} <span>(${grupo.toLowerCase()})</span></div>
    <div class="exercise-row__actions">
      <button class="icon-btn" aria-label="Editar">${iconEditar()}</button>
      <button class="icon-btn icon-btn--danger" aria-label="Excluir">${iconExcluir()}</button>
    </div>`;
  row.querySelector('.icon-btn--danger').addEventListener('click', () => {
    row.remove();
    toggleEmptyState();
  });
  listEl.insertBefore(row, emptyState);
  toggleEmptyState();
}

function toggleEmptyState() {
  const hasItems = listEl.querySelectorAll('.exercise-row').length > 0;
  emptyState.style.display = hasItems ? 'none' : 'block';
}

// TODO: substituir pelos dados reais de GET /api/exercicios
renderExercicio({ nome: 'Supino reto', grupo: 'Peito' });
renderExercicio({ nome: 'Crucifixo voador', grupo: 'Peito' });

// Cadastro de novo exercício — integrar com POST /api/exercicios
document.getElementById('exercicioForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nomeExercicio').value.trim();
  const grupo = document.getElementById('grupoMuscular').value;
  if (!nome) return;

  try {
    // const res = await fetch('/api/exercicios', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${localStorage.getItem('token')}`
    //   },
    //   body: JSON.stringify({ nome, grupoMuscular: grupo })
    // });
    renderExercicio({ nome, grupo });
    e.target.reset();
  } catch (err) {
    alert('Não foi possível cadastrar o exercício.');
  }
});
