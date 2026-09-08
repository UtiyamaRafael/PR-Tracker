const API_BASE = '/api';
let editandoId = null;

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

    if (exercicios.length > 0) {
        carregarHistorico(exercicios[0].id);
    }
}

let registrosAtuais = [];

async function carregarHistorico(exerciseId) {
    const response = await fetch(`${API_BASE}/records/exercise/${exerciseId}`);
    registrosAtuais = await response.json();
    renderizarHistorico();
}

function renderizarHistorico() {
    const ordenacao = document.getElementById('sort-select').value;
    const registros = [...registrosAtuais];

    const comparadores = {
        'data-desc': (a, b) => new Date(b.date) - new Date(a.date),
        'data-asc': (a, b) => new Date(a.date) - new Date(b.date),
        'carga-desc': (a, b) => (b.estimated1RM ?? 0) - (a.estimated1RM ?? 0),
        'reps-desc': (a, b) => b.reps - a.reps,
    };
    registros.sort(comparadores[ordenacao]);

    const list = document.getElementById('record-list');
    list.innerHTML = '';

    if (registros.length === 0) {
        list.innerHTML = '<li class="empty">Nenhum registro ainda.</li>';
        return;
    }

    registros.forEach(r => {
        const li = document.createElement('li');
        li.className = r.isPr ? 'pr-item' : '';
        const pesoTexto = r.weight !== null ? `${r.weight}kg × ${r.reps}` : `${r.reps} reps (corporal)`;
        const prBadge = r.isPr ? '<span class="badge">🏆 PR</span>' : '';

        li.innerHTML = `
            <div>
                <strong>${pesoTexto}</strong> ${prBadge}<br>
                <small>${r.date}${r.estimated1RM ? ' · 1RM est.: ' + r.estimated1RM.toFixed(1) + 'kg' : ''}</small>
            </div>
            <div class="actions">
                <button data-id="${r.id}" data-weight="${r.weight ?? ''}" data-reps="${r.reps}" class="edit-btn">Editar</button>
                <button data-id="${r.id}" class="delete-btn">Excluir</button>
            </div>
        `;
        list.appendChild(li);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', iniciarEdicao));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', excluirRegistro));
}

document.getElementById('sort-select').addEventListener('change', renderizarHistorico);


function iniciarEdicao(e) {
    editandoId = e.target.dataset.id;
    document.getElementById('edit-weight').value = e.target.dataset.weight;
    document.getElementById('edit-reps').value = e.target.dataset.reps;
    document.getElementById('edit-form').classList.remove('hidden');
}

document.getElementById('cancel-edit').addEventListener('click', () => {
    editandoId = null;
    document.getElementById('edit-form').classList.add('hidden');
});

document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const weightValue = document.getElementById('edit-weight').value;
    const reps = document.getElementById('edit-reps').value;

    const response = await fetch(`${API_BASE}/records/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            weight: weightValue === '' ? null : Number(weightValue),
            reps: Number(reps)
        })
    });

    const feedback = document.getElementById('feedback');

    if (response.ok) {
        feedback.textContent = 'Registro atualizado.';
        feedback.className = 'ok';
        document.getElementById('edit-form').classList.add('hidden');
        carregarHistorico(document.getElementById('exercise-select').value);
    } else {
        feedback.textContent = `Erro: ${await response.text()}`;
        feedback.className = 'erro';
    }
});

async function excluirRegistro(e) {
    const id = e.target.dataset.id;
    const response = await fetch(`${API_BASE}/records/${id}`, { method: 'DELETE' });
    const feedback = document.getElementById('feedback');

    if (response.ok) {
        feedback.textContent = 'Registro excluído.';
        feedback.className = 'ok';
        carregarHistorico(document.getElementById('exercise-select').value);
    } else {
        feedback.textContent = `Erro: ${await response.text()}`;
        feedback.className = 'erro';
    }
}

document.getElementById('exercise-select').addEventListener('change', (e) => {
    carregarHistorico(e.target.value);
});

carregarExercicios();