const API_BASE = '/api';

async function carregarDashboard() {
    const response = await fetch(`${API_BASE}/dashboard/prs`);
    const resumo = await response.json();

    const container = document.getElementById('pr-list');
    container.innerHTML = '';

    if (resumo.length === 0) {
        container.innerHTML = '<p class="empty">Nenhum exercício cadastrado ainda. Vá em "Exercícios" para começar.</p>';
        return;
    }

    resumo.forEach(item => {
        const card = document.createElement('div');
        card.className = 'pr-card';

        let corpoTexto;
        if (item.weight !== null && item.weight !== undefined) {
            corpoTexto = `${item.weight}kg × ${item.reps} <small>(1RM est.: ${item.estimated1RM.toFixed(1)}kg)</small>`;
        } else if (item.reps !== null && item.reps !== undefined) {
            corpoTexto = `${item.reps} reps (corporal)`;
        } else {
            corpoTexto = '<span class="empty">Sem registros ainda</span>';
        }

        card.innerHTML = `
            <div class="pr-card-header">
                <strong>${item.exerciseName}</strong>
                <span class="tag">${item.muscleGroupName}</span>
            </div>
            <div class="pr-card-body">${corpoTexto}</div>
            ${item.date ? `<small class="pr-date">${item.date}</small>` : ''}
        `;
        container.appendChild(card);
    });
}

carregarDashboard();