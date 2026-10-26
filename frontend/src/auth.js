export function salvarSessao(usuario) {
  try {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  } catch (e) {
    console.error('Não foi possível salvar a sessão', e);
  }
}

export function getSessao() {
  try {
    return JSON.parse(localStorage.getItem('usuario')) || null;
  } catch (e) {
    return null;
  }
}

export function authHeaders() {
  const sessao = getSessao();
  return {
    'Content-Type': 'application/json',
    Authorization: sessao?.token ? `Bearer ${sessao.token}` : '',
  };
}

export function limparSessao() {
  try {
    localStorage.removeItem('usuario');
  } catch (e) {
    console.error('Não foi possível limpar a sessão', e);
  }
}