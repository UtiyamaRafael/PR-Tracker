const API_BASE = '/api';
const AUTH_TOKEN_KEY = 'pr_gym_token';

function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clearToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}

function isAuthenticated() {
    return !!getToken();
}

function redirecionarParaLogin() {
    clearToken();
    window.location.href = '/login.html';
}

// Chame no topo de toda página que exige login (dashboard, exercícios, histórico, gráfico)
function exigirAutenticacao() {
    if (!isAuthenticated()) {
        redirecionarParaLogin();
    }
}

// Substitui o fetch() comum: anexa o token automaticamente e redireciona ao login
// se o token estiver ausente/expirado/inválido (401/403)
async function authFetch(url, options = {}) {
    const token = getToken();

    const headers = {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
        redirecionarParaLogin();
        throw new Error('Sessão expirada ou inválida.');
    }

    return response;
}

function logout() {
    clearToken();
    window.location.href = '/login.html';
}
