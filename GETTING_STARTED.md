# 🚀 Getting Started - Diário Miccional

Bem-vindo! Este guia rápido vai te ajudar a começar em 5 minutos.

## ⚡ Quick Start

### 1️⃣ Instale as dependências

```bash
npm run install-all
```

Isso vai instalar:
- Dependências do backend (Express, CORS, etc)
- Dependências do frontend (React, Vite, Lucide, etc)

### 2️⃣ Inicie o servidor (Terminal 1)

```bash
npm run dev
```

Você verá:
```
🚀 Servidor rodando em http://localhost:3000
📱 Acesse http://localhost:3000
```

### 3️⃣ Inicie o frontend (Terminal 2)

```bash
npm run client
```

Você verá:
```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### 4️⃣ Abra no navegador

Visite: http://localhost:5173

---

## 📝 Usando a Aplicação

### Criar Conta

1. Clique em **"Criar minha conta"**
2. Preencha os dados (Nome, Email, Senha)
3. Clique em **"Criar minha conta"**
4. Pronto! Você está logado 🎉

### Registrar um Evento

1. No Dashboard, preencha o formulário "Novo Registro"
2. Selecione o tipo:
   - **Micção**: Registro de ida ao banheiro
   - **Hidratação**: Ingestão de líquidos
   - **Perda Urinária**: Episódios de perda
3. Adicione horário, volume e notas (opcionais)
4. Clique em **"Adicionar Registro"**

### Visualizar Histórico

O histórico aparece automaticamente abaixo do formulário de registro, mostrado em ordem cronológica inversa (mais recente primeiro).

---

## 🛠️ Estrutura de Pastas

```
diario-miccional/
├── server.js          ← Backend principal
├── frontend/          ← React app
│   └── src/
│       ├── pages/     ← Landing, Login, Signup, Dashboard
│       ├── styles/    ← CSS global e cores
│       └── assets/    ← Imagens, ícones, ilustrações
└── README.md          ← Documentação completa
```

## 📚 Próximos Passos

### Melhorar o Backend

1. **Adicionar Banco de Dados**
   - Usar MongoDB ou PostgreSQL
   - Substituir Map() por queries reais

2. **Implementar Autenticação JWT**
   - Instalar: `npm install jsonwebtoken bcryptjs`
   - Criptografar senhas
   - Gerar tokens JWT

3. **Validar Entradas**
   - Instalar: `npm install joi`
   - Validar dados antes de salvar

### Melhorar o Frontend

1. **Adicionar Gráficos**
   - Instalar: `npm install recharts`
   - Visualizar dados em gráficos

2. **Implementar Compartilhamento**
   - Gerar código para profissional
   - Compartilhar dados

3. **Adicionar Temas**
   - Dark mode
   - Light mode
   - Cores customizáveis

## 🐛 Troubleshooting

### Porta 3000 já em uso

```bash
# Alterar porta
PORT=3001 npm run dev
```

### Porta 5173 já em uso

```bash
# Vite usa a próxima porta disponível automaticamente
npm run client
```

### Erro de CORS

Certifique-se de que:
- Backend está rodando em http://localhost:3000
- Frontend está rodando em http://localhost:5173
- CORS está habilitado em `server.js`

### npm: command not found

Instale Node.js em https://nodejs.org

---

## 🎨 Customizar Cores

Todas as cores estão em `frontend/src/styles/global.css`:

```css
:root {
  --primary-pink: #E85D75;  /* Altere aqui */
  --secondary-pink: #F4A4B4;
  /* ... mais cores */
}
```

Mude para suas cores favoritas!

---

## 🚢 Deploy

### Deploy do Backend (Heroku)

```bash
# 1. Crie uma conta em heroku.com
# 2. Instale Heroku CLI
# 3. Execute:

heroku login
heroku create seu-app-name
git push heroku main
```

### Deploy do Frontend (Vercel)

```bash
# 1. Crie uma conta em vercel.com
# 2. Execute:

cd frontend
npm run build
# Siga as instruções do Vercel para deploy
```

---

## 📚 Recursos Úteis

- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **Vite Docs**: https://vitejs.dev
- **Lucide Icons**: https://lucide.dev

---

## ❓ Dúvidas?

1. Leia o `README.md` para documentação completa
2. Confira o `DESIGN.md` para guia de estilos
3. Abra uma issue no GitHub
4. Entre em contato: lramado13@gmail.com

---

**Desenvolvido com ❤️ por Luquinha**

Pronto para começar? 💪 Boa codificação! 🚀
