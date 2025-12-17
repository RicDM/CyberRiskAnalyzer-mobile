# 🚀 Quick Start - CyberRisk Analyzer

## 1️⃣ Iniciar Backend

```bash
# Terminal 1 - Backend
cd backend
npm run dev
```

O servidor estará em: **http://192.168.3.3:3000**

## 2️⃣ Iniciar App Mobile

```bash
# Terminal 2 - Mobile
npm start
```

## 3️⃣ Popular Banco de Dados (Primeira vez)

```bash
cd backend
npm run seed
```

### Credenciais de Teste:
- **Admin**: admin@cyberrisk.com / admin123
- **Usuário**: joao@example.com / 123456

## 📡 Endpoints Disponíveis

### Autenticação
- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil (com token)

### Avaliações
- `POST /api/assessments` - Criar avaliação
- `GET /api/assessments` - Listar avaliações
- `DELETE /api/assessments/:id` - Deletar

### Ameaças
- `GET /api/threats` - Listar ameaças

## 🔧 Testar Backend

```bash
# Health check
curl http://192.168.3.3:3000

# Login
curl -X POST http://192.168.3.3:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"123456"}'
```

## ⚠️ Troubleshooting

### MongoDB não conecta?
```bash
sudo systemctl start mongodb
# ou
brew services start mongodb-community
```

### App não conecta no backend?
1. Verifique se backend está rodando
2. Confirme o IP: `192.168.3.3`
3. Verifique firewall
4. Reinicie o app mobile (R no terminal)

## 📱 Fluxo Completo

1. ✅ Backend rodando (porta 3000)
2. ✅ MongoDB rodando
3. ✅ Database populada (npm run seed)
4. ✅ App mobile conectado
5. 🎯 Fazer login no app
6. 🎯 Criar avaliação de risco
7. 🎯 Ver dashboard e histórico
