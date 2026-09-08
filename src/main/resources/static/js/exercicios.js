const API_BASE = '/api';

async function carregarGruposMusculares() {
    const response = await fetch(`${API_BASE}/muscle-groups`);
    const grupos = await response.json();

    const select = document.getElementById('muscle-group-select');
    select.innerHTML = '';

    grupos.forEach(grupo => {
        const option = document.createElement('option');
        option.value = grupo.id;
        option.textContent = grupo.name;
        select.appendChild(option);
    });
}


let editandoExercicioId = null;

async function carregarExercicios() {
    const response = await fetch(`${API_BASE}/exercises`);
    const exercicios = await response.json();

    const list = document.getElementById('exercise-list');
    list.innerHTML = '';

    exercicios.forEach(ex => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${ex.name} <small>(${ex.muscleGroup.name})</small></span>
            <div class="actions">
                <button data-id="${ex.id}" data-name="${ex.name}" data-group="${ex.muscleGroup.id}" class="edit-btn">Editar</button>
                <button data-id="${ex.id}" class="delete-btn">Excluir</button>
            </div>
        `;
        list.appendChild(li);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', iniciarEdicaoExercicio));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', excluirExercicio));
}

function iniciarEdicaoExercicio(e) {
    editandoExercicioId = e.target.dataset.id;
    document.getElementById('name-input').value = e.target.dataset.name;
    document.getElementById('muscle-group-select').value = e.target.dataset.group;
    document.querySelector('#exercise-form button[type="submit"]').textContent = 'Salvar edição';
}


async function excluirExercicio(e) {
    const id = e.target.dataset.id;
    const feedback = document.getElementById('feedback');

    const response = await fetch(`${API_BASE}/exercises/${id}`, { method: 'DELETE' });

    if (response.ok) {
        feedback.textContent = 'Exercício excluído.';
        feedback.className = 'ok';
        carregarExercicios();
    } else {
        const erro = await response.text();
        feedback.textContent = `Erro: ${erro}`;
        feedback.className = 'erro';
    }
}


document.getElementById('exercise-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name-input').value;
    const muscleGroupId = Number(document.getElementById('muscle-group-select').value);
    const feedback = document.getElementById('feedback');

    const url = editandoExercicioId
        ? `${API_BASE}/exercises/${editandoExercicioId}`
        : `${API_BASE}/exercises`;
    const method = editandoExercicioId ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, muscleGroupId })
    });

    if (response.ok) {
        feedback.textContent = editandoExercicioId ? 'Exercício atualizado.' : 'Exercício cadastrado.';
        feedback.className = 'ok';
        document.getElementById('exercise-form').reset();
        document.querySelector('#exercise-form button[type="submit"]').textContent = 'Cadastrar';
        editandoExercicioId = null;
        carregarExercicios();
    } else {
        feedback.textContent = `Erro: ${await response.text()}`;
        feedback.className = 'erro';
    }
});



carregarGruposMusculares();
carregarExercicios();