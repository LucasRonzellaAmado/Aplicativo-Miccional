# 📱 Diário Miccional - Acompanhamento Digital de Saúde Urinária

Um aplicativo web moderno e acessível para registrar e acompanhar informações sobre o sistema urinário. Desenvolvido com **Node.js**, **Express** e **React** com design responsivo em **Rosa**.

## 🎯 Funcionalidades

✅ **Autenticação de Usuários**
- Criar conta
- Login seguro
- Logout

✅ **Registro de Dados**
- Registrar micções
- Ingestão de líquidos
- Perdas urinárias
- Horários e volumes
- Notas adicionais

✅ **Visualização de Histórico**
- Lista cronológica de registros
- Filtros por tipo e data
- Estatísticas diárias

✅ **Design Responsivo**
- Totalmente funcional em mobile
- Interface acolhedora
- Paleta de cores em rosa

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **CORS** - Compartilhamento de recursos
- **UUID** - IDs únicos

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Bundler rápido
- **React Router** - Navegação
- **Lucide React** - Ícones modernos
- **CSS3** - Estilos customizados

## 📋 Pré-requisitos

- **Node.js 16+** ([https://nodejs.org](https://nodejs.org))
- **npm ou yarn**

## 🚀 Instalação e Setup

### 1. Descompacte o arquivo
```bash
unzip diario-miccional.zip
cd diario-miccional
```

### 2. Instale as dependências
```bash
# Instalar tudo de uma vez
npm run install-all

# OU manualmente:
npm install
cd frontend && npm install && cd ..
```

### 3. Configure o ambiente
```bash
cp .env.example .env
```

### 4. Inicie o servidor e frontend

**Terminal 1 - Backend (porta 3000)**
```bash
npm run dev
# ou
npm start
```

**Terminal 2 - Frontend (porta 5173)**
```bash
npm run client
```

Acesse http://localhost:5173

## 📁 Estrutura do Projeto

```
diario-miccional/
├── server.js                      # Servidor Express
├── package.json                   # Dependências backend
├── .env.example                   # Configurações de exemplo
├── .gitignore
│
└── frontend/                      # Aplicação React
    ├── index.html
    ├── vite.config.js
    ├── package.json               # Dependências frontend
    │
    └── src/
        ├── main.jsx               # Ponto de entrada
        ├── App.jsx                # Componente principal
        ├── App.css
        │
        ├── pages/
        │   ├── Landing.jsx        # Página inicial
        │   ├── Landing.css
        │   ├── Login.jsx          # Tela de login
        │   ├── Signup.jsx         # Tela de cadastro
        │   ├── Auth.css           # Estilos Auth
        │   ├── Dashboard.jsx      # Painel principal
        │   └── Dashboard.css
        │
        ├── components/            # Componentes reutilizáveis
        │
        ├── assets/
        │   ├── images/            # Imagens (hero, backgrounds)
        │   ├── icons/             # Ícones customizados
        │   └── illustrations/     # Ilustrações SVG
        │
        └── styles/
            └── global.css         # Estilos globais + cores
```

## 🎨 Identidade Visual

### Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Rosa Principal | `#E85D75` | Botões, ícones, highlights |
| Rosa Secundária | `#F4A4B4` | Gradientes, hovers |
| Rosa Clara | `#FDD7E0` | Bordas, inputs |
| Rosa Muito Clara | `#FEE9F0` | Backgrounds |
| Teal | `#167C80` | Acentos |
| Fundo | `#FAFBFB` | Background principal |

### Tipografia

- **Font Family**: System fonts (Roboto, Segoe UI, etc)
- **Tamanhos**: xs (0.875rem) a 3xl (2rem)
- **Pesos**: 600 (semibold) e 700 (bold)

## 🔌 Rotas da API

### Autenticação
```
POST   /api/auth/signup      → Criar conta
POST   /api/auth/login       → Fazer login
```

### Registros
```
GET    /api/registros/:usuario_id    → Listar registros
POST   /api/registros                → Criar registro
DELETE /api/registros/:id            → Deletar registro
```

### Profissional
```
POST   /api/profissional/codigo      → Gerar código
GET    /api/profissional/:codigo     → Verificar código
```

### Health Check
```
GET    /api/health          → Status da API
```

## 📝 Exemplo de Registro

```json
{
  "usuario_id": "uuid-123",
  "tipo": "miccao",
  "horario": "2024-10-04T14:30:00Z",
  "volume": 250,
  "perdas_urinaras": false,
  "notas": "Sem desconforto"
}
```

## 🔐 Segurança (Próximos Passos)

- [ ] Implementar JWT para autenticação
- [ ] Hash de senhas com bcrypt
- [ ] Validação de entrada (joi/zod)
- [ ] Rate limiting
- [ ] HTTPS em produção
- [ ] Banco de dados persistente (MongoDB/PostgreSQL)

## 📱 Responsividade

O aplicativo é totalmente responsivo:
- **Desktop**: Grid 2 colunas, sidebar
- **Tablet**: Grid 1 coluna
- **Mobile**: Stack vertical, toque otimizado

## 🎯 Próximas Melhorias

- [ ] Gráficos de acompanhamento
- [ ] Compartilhamento com profissionais
- [ ] Relatórios em PDF
- [ ] Notificações de lembretes
- [ ] Temas dark/light
- [ ] Integração com calendário
- [ ] Backup automático

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT - Você é livre para usar, modificar e distribuir este código.

## 👨‍💼 Autor

Desenvolvido por **Luquinha** (Lucas Ronzella Amado)

## 📞 Suporte

Encontrou um bug ou tem uma sugestão? Abra uma issue no repositório!

---

**Desenvolvido com ❤️ em São Paulo, Brasil**

Seu cuidado começa pelo registro. 💧
