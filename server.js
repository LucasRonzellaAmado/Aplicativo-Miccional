import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend/dist'));

// Dados em memória (substitua por banco de dados)
const usuarios = new Map();
const registros = new Map();
const profissionais = new Map();

// ROTAS DE AUTENTICAÇÃO
app.post('/api/auth/signup', (req, res) => {
  const { email, senha, nome } = req.body;
  
  if (usuarios.has(email)) {
    return res.status(400).json({ erro: 'Email já cadastrado' });
  }

  const id = uuidv4();
  usuarios.set(email, { id, email, senha, nome, data_criacao: new Date() });
  
  res.json({ id, email, nome, token: `token_${id}` });
});

app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body;
  
  const usuario = usuarios.get(email);
  
  if (!usuario || usuario.senha !== senha) {
    return res.status(401).json({ erro: 'Email ou senha inválidos' });
  }

  res.json({ 
    id: usuario.id, 
    email, 
    nome: usuario.nome, 
    token: `token_${usuario.id}` 
  });
});

// ROTAS DE REGISTROS
app.get('/api/registros/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  const usuarioRegistros = Array.from(registros.values()).filter(
    r => r.usuario_id === usuario_id
  );
  res.json(usuarioRegistros);
});

app.post('/api/registros', (req, res) => {
  const { usuario_id, tipo, horario, volume, perdas_urinaras, notas } = req.body;
  
  const id = uuidv4();
  const registro = {
    id,
    usuario_id,
    tipo, // 'miccao' | 'hidratacao' | 'perda'
    horario: horario || new Date().toISOString(),
    volume,
    perdas_urinaras,
    notas,
    data_criacao: new Date()
  };

  registros.set(id, registro);
  res.status(201).json(registro);
});

app.delete('/api/registros/:id', (req, res) => {
  registros.delete(req.params.id);
  res.json({ sucesso: true });
});

// ROTAS DE PROFISSIONAL
app.post('/api/profissional/codigo', (req, res) => {
  const { usuario_id } = req.body;
  const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
  profissionais.set(codigo, { usuario_id, data_criacao: new Date() });
  res.json({ codigo });
});

app.get('/api/profissional/:codigo', (req, res) => {
  const prof = profissionais.get(req.params.codigo);
  if (!prof) {
    return res.status(404).json({ erro: 'Código inválido' });
  }
  res.json(prof);
});

// SAÚDE DA API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Servir index.html para rotas não encontradas (SPA)
app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/frontend/dist/index.html`);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📱 Acesse http://localhost:${PORT}`);
});
