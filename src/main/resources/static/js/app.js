const API_BASE = '/api';

async function carregarExercicios() {
    const response = await fetch(`${API_BASE}/exercises`);
    const exercicios = await response.json();

    const select = document.getElementById('exercise-select');
    select.innerHTML = '';

    exercicios.forEach(ex => {
        const option = document.createElement('option');
        option.value = ex.id;
        option.textContent = ex.name;
        select.appendChild(option);
    });
}

document.getElementById('record-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const exerciseId = document.getElementById('exercise-select').value;
    const weightInput = document.getElementById('weight-input').value;
    const reps = document.getElementById('reps-input').value;

    const body = {
        exerciseId: Number(exerciseId),
        weight: weightInput === '' ? null : Number(weightInput),
        reps: Number(reps)
    };

    const response = await fetch(`${API_BASE}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const feedback = document.getElementById('feedback');

    if (response.ok) {
        const record = await response.json();
        feedback.textContent = record.isPr ? '🏆 Novo PR!' : 'Registro salvo.';
        feedback.className = record.isPr ? 'pr' : 'ok';
        document.getElementById('record-form').reset();
    } else {
        const erro = await response.text();
        feedback.textContent = `Erro: ${erro}`;
        feedback.className = 'erro';
    }
});

carregarExercicios();