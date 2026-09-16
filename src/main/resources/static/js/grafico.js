exigirAutenticacao();

let chart = null;

async function carregarExercicios() {
    const response = await authFetch(`${API_BASE}/exercises`);
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
        carregarGrafico(exercicios[0].id);
    }
}

async function carregarGrafico(exerciseId) {
    const response = await authFetch(`${API_BASE}/records/exercise/${exerciseId}`);
    const registros = await response.json();

    // Só pontos com 1RM calculado, ordenados do mais antigo pro mais recente
    const pontos = registros
        .filter(r => r.estimated1RM !== null && r.estimated1RM !== undefined)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const emptyMessage = document.getElementById('empty-message');
    const canvas = document.getElementById('evolution-chart');

    if (pontos.length === 0) {
        canvas.classList.add('hidden');
        emptyMessage.classList.remove('hidden');
        if (chart) chart.destroy();
        return;
    }

    canvas.classList.remove('hidden');
    emptyMessage.classList.add('hidden');

    const labels = pontos.map(p => p.date);
    const valores = pontos.map(p => p.estimated1RM);

    if (chart) chart.destroy();

    chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '1RM estimado (kg)',
                data: valores,
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.15)',
                tension: 0.2,
                fill: true,
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#f0f0f0' } }
            },
            scales: {
                x: { ticks: { color: '#aaa' }, grid: { color: '#333' } },
                y: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
            }
        }
    });
}

document.getElementById('exercise-select').addEventListener('change', (e) => {
    carregarGrafico(e.target.value);
});

carregarExercicios();
