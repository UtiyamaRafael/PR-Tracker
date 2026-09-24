// app.js — utilidades compartilhadas pelas páginas internas do app
// (dashboard, exercícios, registro, histórico, gráfico)

// Marca o item de navegação correspondente à página atual
(function marcarNavAtiva() {
  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item[data-target]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.target === paginaAtual);
  });
})();

// Clique nos itens da sidebar / bottom nav
document.querySelectorAll('.nav-item[data-target]').forEach((btn) => {
  btn.addEventListener('click', () => {
    window.location.href = btn.dataset.target;
  });
});

// Guarda de autenticação simples — sem token, volta pro login
// TODO: quando o auth.js do backend estiver plugado, validar o token de verdade
function exigirAutenticacao() {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

exigirAutenticacao();

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error('Sessão expirada.');
  }
  return response;
}

function formatarData(data) {
  return data ? new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR') : '—';
}
