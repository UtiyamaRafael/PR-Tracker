// auth.js — lógica das telas de autenticação
// (login.html, cadastro-usuario.html, esqueci-senha.html, resetar-senha.html)

function configurarToggleSenha(inputId, botaoId) {
  const input = document.getElementById(inputId);
  const botao = document.getElementById(botaoId);
  if (!input || !botao) return;
  botao.addEventListener('click', () => {
    const estavaOculta = input.type === 'password';
    input.type = estavaOculta ? 'text' : 'password';
    botao.setAttribute('aria-label', estavaOculta ? 'Ocultar senha' : 'Mostrar senha');
  });
}

configurarToggleSenha('senha', 'toggleSenha');
configurarToggleSenha('novaSenha', 'toggleNovaSenha');
configurarToggleSenha('confirmarSenha', 'toggleConfirmarSenha');

// LOGIN — POST /api/auth/login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const senha = document.getElementById('senha').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha })
      });
      if (!res.ok) throw new Error('Credenciais inválidas');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      window.location.href = 'index.html';
    } catch (err) {
      alert('Não foi possível entrar. Verifique e-mail e senha.');
    }
  });
}

// CADASTRO — POST /api/auth/register
const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
  cadastroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const senha = document.getElementById('senha').value;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha })
      });
      if (!res.ok) throw new Error('Falha no cadastro');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      window.location.href = 'index.html';
    } catch (err) {
      alert('Não foi possível criar a conta. Tente outro e-mail.');
    }
  });
}

// ESQUECI A SENHA — POST /api/auth/forgot-password
const esqueciForm = document.getElementById('esqueciSenhaForm');
if (esqueciForm) {
  esqueciForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const feedback = document.getElementById('esqueciFeedback');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('Falha ao solicitar recuperação');
      feedback.textContent = 'Se o usuário existir, enviamos um link de recuperação.';
      feedback.style.display = 'block';
      e.target.reset();
    } catch (err) {
      feedback.textContent = 'Não foi possível enviar o link. Tente novamente.';
      feedback.style.display = 'block';
    }
  });
}

// REDEFINIR SENHA — POST /api/auth/reset-password
const resetarForm = document.getElementById('resetarSenhaForm');
if (resetarForm) {
  resetarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      alert('O link de recuperação é inválido ou está incompleto.');
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: novaSenha })
      });
      if (!res.ok) throw new Error('Falha ao redefinir senha');
      alert('Senha redefinida com sucesso. Faça login novamente.');
      window.location.href = 'login.html';
    } catch (err) {
      alert('Não foi possível redefinir a senha.');
    }
  });
}
