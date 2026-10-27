import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const API_SECRET = process.env.API_SECRET;

app.use(cors());
app.use(express.json());
app.use(express.static('frontend/dist'));

// ===== PLANILHA (Google Sheets via Apps Script) =====
async function planilha(payload) {
  if (!APPS_SCRIPT_URL || !API_SECRET) {
    throw new Error('APPS_SCRIPT_URL ou API_SECRET não configurados');
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...payload, secret: API_SECRET }),
  });

  const data = await response.json();
  if (data.erro) throw new Error(data.erro);
  return data;
}

// ===== SENHA (hash com scrypt, nativo do Node) =====
function hashSenha(senha) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(senha, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function senhaConfere(senha, armazenada) {
  const [salt, hash] = armazenada.split(':');
  const tentativa = scryptSync(senha, salt, 64);
  return timingSafeEqual(tentativa, Buffer.from(hash, 'hex'));
}

// ===== MIDDLEWARE DE AUTENTICAÇÃO =====
// Espera o header: Authorization: Bearer token_<id>
function exigeLogin(req, res, next) {
  const match = (req.headers.authorization || '').match(/^Bearer token_(.+)$/);
  if (!match) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }
  req.usuario_id = match[1];
  next();
}

// ===== ROTAS DE AUTENTICAÇÃO =====
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, senha, nome } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const usuarios = await planilha({ action: 'list', table: 'usuarios' });
    if (usuarios.some((u) => u.email === email)) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const id = uuidv4();
    await planilha({
      action: 'insert',
      table: 'usuarios',
      data: {
        id,
        email,
        nome,
        senha_hash: hashSenha(senha),
        data_criacao: new Date().toISOString(),
      },
    });

    res.json({ id, email, nome, token: `token_${id}` });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuarios = await planilha({ action: 'list', table: 'usuarios' });
    const usuario = usuarios.find((u) => u.email === email);

    if (!usuario || !senhaConfere(senha, String(usuario.senha_hash))) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    res.json({
      id: usuario.id,
      email,
      nome: usuario.nome,
      token: `token_${usuario.id}`,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== MICTURIÇÕES (Diário Miccional) =====
app.get('/api/micturitions', exigeLogin, async (req, res) => {
  try {
    const lista = await planilha({ action: 'list', table: 'micturicoes' });
    res.json(lista.filter((r) => String(r.usuario_id) === req.usuario_id));
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/micturitions', exigeLogin, async (req, res) => {
  try {
    const {
      volume, consistency, color, urgencia, teve_perda, tamanho_perda,
      esforco, esvaziou_completo, gotinhas_pos, notes, timestamp,
    } = req.body;

    const registro = {
      id: uuidv4(),
      usuario_id: req.usuario_id,
      volume: parseInt(volume),
      consistencia: consistency,
      cor: color,
      urgencia,
      teve_perda,
      tamanho_perda: teve_perda ? tamanho_perda : '',
      esforco,
      esvaziou_completo,
      gotinhas_pos,
      notas: notes || '',
      timestamp: timestamp || new Date().toISOString(),
    };

    await planilha({ action: 'insert', table: 'micturicoes', data: registro });
    res.status(201).json(registro);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== NOCTÚRIA (Durante o Sono) =====
app.get('/api/nocturia', exigeLogin, async (req, res) => {
  try {
    const lista = await planilha({ action: 'list', table: 'nocturia' });
    res.json(lista.filter((r) => String(r.usuario_id) === req.usuario_id));
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/nocturia', exigeLogin, async (req, res) => {
  try {
    const { volume, teve_perda, tamanho_perda, notes, timestamp } = req.body;

    const registro = {
      id: uuidv4(),
      usuario_id: req.usuario_id,
      volume: parseInt(volume),
      teve_perda,
      tamanho_perda: teve_perda ? tamanho_perda : '',
      notas: notes || '',
      timestamp: timestamp || new Date().toISOString(),
    };

    await planilha({ action: 'insert', table: 'nocturia', data: registro });
    res.status(201).json(registro);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== PERÍODO DE SONO (horário de dormir e de acordar) =====
app.get('/api/sono', exigeLogin, async (req, res) => {
  try {
    const lista = await planilha({ action: 'list', table: 'sono' });
    res.json(lista.filter((r) => String(r.usuario_id) === req.usuario_id));
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/sono', exigeLogin, async (req, res) => {
  try {
    const { hora_dormir, hora_acordar, notes } = req.body;
    if (!hora_dormir || !hora_acordar) {
      return res.status(400).json({ erro: 'Informe o horário de dormir e de acordar' });
    }

    const registro = {
      id: uuidv4(),
      usuario_id: req.usuario_id,
      hora_dormir,
      hora_acordar,
      notas: notes || '',
      // A noite é contada no dia em que a pessoa acordou
      timestamp: hora_acordar,
    };

    await planilha({ action: 'insert', table: 'sono', data: registro });
    res.status(201).json(registro);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== HIDRATAÇÃO =====
app.get('/api/hydrations', exigeLogin, async (req, res) => {
  try {
    const lista = await planilha({ action: 'list', table: 'hidratacao' });
    res.json(lista.filter((r) => String(r.usuario_id) === req.usuario_id));
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/hydrations', exigeLogin, async (req, res) => {
  try {
    const { volume, tipo, notes, timestamp } = req.body;

    const registro = {
      id: uuidv4(),
      usuario_id: req.usuario_id,
      volume: parseInt(volume),
      tipo,
      notas: notes || '',
      timestamp: timestamp || new Date().toISOString(),
    };

    await planilha({ action: 'insert', table: 'hidratacao', data: registro });
    res.status(201).json(registro);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ===== SAÚDE DA API =====
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Servir index.html para rotas não encontradas (SPA)
app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/frontend/dist/index.html`);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});