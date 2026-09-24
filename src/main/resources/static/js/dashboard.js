document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [prsResponse, exercisesResponse] = await Promise.all([
      apiFetch('/api/dashboard/prs'), apiFetch('/api/exercises')
    ]);
    if (!prsResponse.ok || !exercisesResponse.ok) throw new Error('Não foi possível carregar o dashboard.');
    const prs = await prsResponse.json();
    const exercises = await exercisesResponse.json();
    const prsRegistrados = prs.filter((pr) => pr.date);
    document.getElementById('statTotalPrs').textContent = prsRegistrados.length;
    document.getElementById('statExercicios').textContent = exercises.length;
    document.getElementById('statTreinosMes').textContent = '—';
    const ultimo = prsRegistrados.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
    document.getElementById('statUltimoTreino').textContent = ultimo ? formatarData(ultimo.date) : '—';

    const lista = document.getElementById('recentesLista');
    prsRegistrados.forEach((pr) => {
      const row = document.createElement('div'); row.className = 'record-row';
      const main = document.createElement('div'); main.className = 'record-row__main';
      const name = document.createElement('div'); name.className = 'record-row__name'; name.append(pr.exerciseName);
      const badge = document.createElement('span'); badge.className = 'pr-badge'; badge.textContent = 'PR'; name.append(badge);
      const meta = document.createElement('div'); meta.className = 'record-row__meta'; meta.textContent = `${pr.reps} reps · ${formatarData(pr.date)}`;
      const value = document.createElement('div'); value.className = 'record-row__value'; value.textContent = pr.weight == null ? '—' : `${pr.weight} kg`;
      main.append(name, meta); row.append(main, value); lista.append(row);
    });
  } catch (erro) { alert(erro.message); }
});
