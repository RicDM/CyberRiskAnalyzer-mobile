# 🛡️ CyberRisk Analyzer - Backend API

Backend RESTful API para o aplicativo mobile CyberRisk Analyzer, desenvolvido com Node.js, Express e MongoDB.

## 📋 Funcionalidades

- ✅ Autenticação JWT (Register/Login)
- ✅ CRUD completo de Avaliações de Risco
- ✅ Listagem de Ameaças Cibernéticas
- ✅ Cálculo automático de score de risco
- ✅ Recomendações de segurança personalizadas
- ✅ Estatísticas e dashboards
- ✅ Proteção de rotas com middleware
- ✅ Validação de dados
- ✅ Tratamento de erros

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Helmet** - Segurança HTTP
- **CORS** - Controle de acesso
- **Morgan** - Logger HTTP

## 📦 Instalação

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cyberrisk-analyzer
JWT_SECRET=seu_secret_jwt_super_secreto_aqui
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:19000,http://localhost:19001
```

### 3. Instalar MongoDB

#### Ubuntu/Debian:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

#### macOS:
```bash
brew install mongodb-community
brew services start mongodb-community
```

#### Windows:
Baixe em: https://www.mongodb.com/try/download/community

### 4. Popular banco de dados (opcional)
```bash
npm run seed
```

Isso criará:
- **Admin**: admin@cyberrisk.com / admin123
- **Usuário**: joao@example.com / 123456
- 8 ameaças de exemplo

## 🏃 Executar

### Desenvolvimento (com auto-reload):
```bash
npm run dev
```

### Produção:
```bash
npm start
```

Servidor estará rodando em: **http://localhost:3000**

## 📡 Endpoints da API

### Autenticação
```
POST   /api/auth/register    - Registrar novo usuário
POST   /api/auth/login       - Login
GET    /api/auth/me          - Obter usuário atual (requer token)
PUT    /api/auth/profile     - Atualizar perfil (requer token)
```

### Avaliações de Risco
```
POST   /api/assessments              - Criar avaliação (requer token)
GET    /api/assessments              - Listar avaliações (requer token)
GET    /api/assessments/:id          - Obter avaliação (requer token)
PUT    /api/assessments/:id          - Atualizar avaliação (requer token)
DELETE /api/assessments/:id          - Deletar avaliação (requer token)
GET    /api/assessments/stats/summary - Estatísticas (requer token)
```

### Ameaças
```
GET    /api/threats          - Listar ameaças (requer token)
GET    /api/threats/:id      - Obter ameaça específica (requer token)
POST   /api/threats          - Criar ameaça (admin only)
```

## 🔐 Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```http
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

### Exemplo de Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'
```

Resposta:
```json
{
  "success": true,
  "message": "Login realizado com sucesso!",
  "data": {
    "user": {
      "_id": "...",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 📊 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração MongoDB
│   ├── controllers/             # Lógica de negócio (futuro)
│   ├── middleware/
│   │   └── auth.js              # Middleware de autenticação
│   ├── models/
│   │   ├── User.js              # Modelo de usuário
│   │   ├── Assessment.js        # Modelo de avaliação
│   │   └── Threat.js            # Modelo de ameaça
│   ├── routes/
│   │   ├── auth.js              # Rotas de autenticação
│   │   ├── assessments.js       # Rotas de avaliações
│   │   └── threats.js           # Rotas de ameaças
│   ├── seed.js                  # Popular banco de dados
│   └── server.js                # Servidor principal
├── .env.example                 # Exemplo de variáveis
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Configuração do App Mobile

No arquivo `/src/services/api.ts` do app mobile, atualize a URL da API:

```typescript
const API_BASE_URL = __DEV__
    ? 'http://SEU_IP:3000/api'  // Use seu IP local (não localhost)
    : 'https://sua-api.com/api';
```

**Importante**: Para Android, use o IP da sua máquina (ex: `http://192.168.1.100:3000/api`), não `localhost`.

Para descobrir seu IP:
```bash
# Linux/Mac
ip addr show | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr IPv4
```

## 🧪 Testar API

### Com cURL:
```bash
# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@example.com",
    "password": "senha123"
  }'

# Criar avaliação
curl -X POST http://localhost:3000/api/assessments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "companyName": "TechCorp",
    "sector": "Tecnologia",
    "employeesCount": "51-200",
    "hasFirewall": true,
    "hasAntivirus": true,
    "hasBackup": false,
    "hasTraining": false,
    "hasIncidentPlan": false,
    "hasPasswordPolicy": true,
    "hasTwoFactorAuth": false,
    "hasDataEncryption": false,
    "hasAccessControl": true,
    "hasSecurityAudit": false
  }'
```

### Com Postman/Insomnia:
Importe a coleção de endpoints e teste todas as rotas facilmente.

## 🛡️ Segurança

- Senhas hasheadas com bcrypt (salt rounds: 10)
- Tokens JWT com expiração
- Helmet para headers de segurança
- Validação de dados com express-validator
- CORS configurável
- Rate limiting (adicionar em produção)

## 📝 Logs

Os logs são exibidos no console usando Morgan:
- Requisições HTTP
- Erros do servidor
- Conexão MongoDB

## 🐛 Troubleshooting

### Erro de conexão MongoDB:
```bash
# Verificar se MongoDB está rodando
sudo systemctl status mongodb

# Iniciar MongoDB
sudo systemctl start mongodb
```

### Porta 3000 já em uso:
```bash
# Altere a porta no .env
PORT=4000
```

### App mobile não conecta:
1. Use o IP da máquina, não `localhost`
2. Verifique o firewall
3. Certifique-se que o servidor está rodando
4. Verifique ALLOWED_ORIGINS no .env

## 📚 Documentação Adicional

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)

## 👤 Autor

Desenvolvido para o projeto CyberRisk Analyzer Mobile

## 📄 Licença

ISC
