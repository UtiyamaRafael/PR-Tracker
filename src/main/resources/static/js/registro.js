const registroForm = document.getElementById('registroForm');
const exercicioSelect = document.getElementById('exercicioSelect');
const listaRegistros = document.getElementById('listaRegistrosHoje');
const registroEmpty = document.getElementById('registroEmptyState');

function renderRegistro(registro) {
  const row = document.createElement('div');
  row.className = 'record-row';
  const main = document.createElement('div');
  main.className = 'record-row__main';
  const name = document.createElement('div');
  name.className = 'record-row__name';
  name.textContent = registro.exercise.name;
  const meta = document.createElement('div');
  meta.className = 'record-row__meta';
  meta.textContent = `${registro.reps} reps · ${registro.estimated1RM == null ? 'peso corporal' : `1RM estimado ${registro.estimated1RM.toFixed(1)} kg`}`;
  const value = document.createElement('div');
  value.className = 'record-row__value';
  value.textContent = registro.weight == null ? '—' : `${registro.weight} kg`;
  main.append(name, meta); row.append(main, value);
  listaRegistros.insertBefore(row, registroEmpty);
  registroEmpty.style.display = 'none';
}

async function carregarExercicios() {
  const response = await apiFetch('/api/exercises');
  if (!response.ok) throw new Error(await response.text());
  const exercicios = await response.json();
  exercicioSelect.replaceChildren();
  if (!exercicios.length) exercicioSelect.add(new Option('Cadastre um exercício primeiro', ''));
  exercicios.forEach((exercicio) => exercicioSelect.add(new Option(exercicio.name, exercicio.id)));
}

const pesoInput = document.getElementById('peso');
const pesoCorporalCheckbox = document.getElementById('pesoCorporal');

// Ao marcar "peso corporal", esvazia e desabilita o campo de peso —
// sem isso o backend nunca recebia weight: null e a regra de PR por
// repetições máximas (exercícios de peso corporal) ficava inacessível.
pesoCorporalCheckbox.addEventListener('change', () => {
  pesoInput.disabled = pesoCorporalCheckbox.checked;
  if (pesoCorporalCheckbox.checked) pesoInput.value = '';
});

document.getElementById('dataRegistro').valueAsDate = new Date();
registroForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const exerciseId = Number(exercicioSelect.value);
  const pesoCorporal = pesoCorporalCheckbox.checked;
  const weightText = pesoInput.value;
  const reps = Number(document.getElementById('repeticoes').value);
  const date = document.getElementById('dataRegistro').value;
  if (!exerciseId || !reps) return;
  if (!pesoCorporal && weightText === '') return;
  const weight = pesoCorporal ? null : Number(weightText);
  try {
    const response = await apiFetch('/api/records', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, weight, reps, date })
    });
    if (!response.ok) throw new Error(await response.text());
    renderRegistro(await response.json());
    pesoInput.value = '';
    document.getElementById('repeticoes').value = '';
    pesoCorporalCheckbox.checked = false;
    pesoInput.disabled = false;
  } catch (erro) { alert(erro.message || 'Não foi possível registrar o treino.'); }
});

carregarExercicios().catch((erro) => alert(erro.message || 'Não foi possível carregar os exercícios.'));
