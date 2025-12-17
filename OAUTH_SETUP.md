# 🔐 Configuração de Autenticação Social (Google e GitHub)

## 📋 Pré-requisitos

O projeto já está configurado com:
- ✅ Clerk SDK instalado (`@clerk/clerk-expo`)
- ✅ Hooks de OAuth implementados
- ✅ Interface de login com botões sociais
- ✅ Token cache seguro (SecureStore)

## 🚀 Configuração Rápida

### 1. Criar conta no Clerk

1. Acesse: https://dashboard.clerk.com/sign-up
2. Crie uma conta gratuita
3. Crie uma nova aplicação

### 2. Configurar Providers OAuth

#### Google OAuth

1. No painel do Clerk, vá em **Configure → SSO Connections**
2. Clique em **Google**
3. Ative o provider
4. O Clerk fornecerá automaticamente as credenciais ou você pode usar suas próprias:

**Usar credenciais próprias do Google:**
1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione existente
3. Ative a **Google+ API**
4. Vá em **Credenciais** → **Criar credenciais** → **ID do cliente OAuth**
5. Tipo: **Aplicativo para Android/iOS**
6. Configure:
   - Nome: CyberRisk Analyzer
   - Pacote (Android): `com.yourcompany.cyberriskanalyzer`
   - Bundle ID (iOS): `com.yourcompany.cyberriskanalyzer`
7. Copie o **Client ID** e **Client Secret**
8. Cole no Clerk Dashboard

#### GitHub OAuth

1. No painel do Clerk, vá em **Configure → SSO Connections**
2. Clique em **GitHub**
3. Ative o provider
4. Configure OAuth App no GitHub:

**Configurar no GitHub:**
1. Acesse: https://github.com/settings/developers
2. Clique em **New OAuth App**
3. Configure:
   - Application name: `CyberRisk Analyzer`
   - Homepage URL: `https://seu-dominio.com` (ou `http://localhost:19000` para dev)
   - Authorization callback URL: Copie do Clerk Dashboard
4. Clique em **Register application**
5. Copie o **Client ID**
6. Gere um **Client Secret**
7. Cole ambos no Clerk Dashboard

### 3. Obter a Publishable Key

1. No Clerk Dashboard, vá em **API Keys**
2. Copie a **Publishable Key** (começa com `pk_test_` ou `pk_live_`)

### 4. Configurar no Projeto

Crie um arquivo `.env` na raiz do projeto:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_sua_key_aqui_do_clerk
```

### 5. Configurar Redirecionamento

No arquivo `app.json`, adicione o scheme:

```json
{
  "expo": {
    "scheme": "cyberriskanalyzer",
    "android": {
      "package": "com.yourcompany.cyberriskanalyzer"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.cyberriskanalyzer"
    }
  }
}
```

### 6. Testar Autenticação

```bash
# Reiniciar o servidor
npm start

# Limpar cache se necessário
npm start -- --clear
```

## 🎯 Fluxo de Autenticação

```
Usuário clica "Continuar com Google/GitHub"
    ↓
OAuth flow abre no navegador
    ↓
Usuário faz login no provider
    ↓
Callback retorna para o app
    ↓
Clerk valida e cria sessão
    ↓
App recebe token e email
    ↓
Usuário logado com sucesso
```

## 🔧 Troubleshooting

### "OAuth redirect failed"
- Verifique se o scheme está correto no `app.json`
- Confirme que as URLs de callback no Clerk/Google/GitHub estão corretas
- Reinicie o bundler

### "Invalid publishable key"
- Certifique-se que a key no `.env` começa com `pk_test_` ou `pk_live_`
- Variável deve ser `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Reinicie o servidor Expo após alterar `.env`

### "Browser not opening"
- Em Android, pode ser necessário instalar um navegador
- Certifique-se que `expo-web-browser` está instalado

### "Session not persisting"
- Verifique se `expo-secure-store` está instalado
- O token cache está configurado corretamente

## 📱 Testar em Desenvolvimento

### Modo de Desenvolvimento (sem configurar OAuth real)

Para testar o fluxo sem configurar o OAuth:

1. Use o login tradicional (email/senha)
2. Os botões sociais mostrarão erro mas não quebrarão o app
3. Configure o OAuth quando estiver pronto para produção

### Modo Produção

1. Configure todos os OAuth providers
2. Teste em dispositivo real (não emulador)
3. Use `expo build` para criar APK/IPA de produção

## 🌐 URLs Importantes

- **Clerk Dashboard**: https://dashboard.clerk.com/
- **Google Console**: https://console.cloud.google.com/
- **GitHub OAuth**: https://github.com/settings/developers
- **Clerk Docs**: https://clerk.com/docs/quickstarts/expo

## ✅ Checklist de Configuração

- [ ] Conta Clerk criada
- [ ] Google OAuth configurado
- [ ] GitHub OAuth configurado
- [ ] Publishable Key copiada
- [ ] Arquivo `.env` criado
- [ ] Scheme configurado no `app.json`
- [ ] Servidor reiniciado
- [ ] Testado em dispositivo

## 🎨 Customização

Para alterar o comportamento após login, edite:
- `src/components/Login.tsx` - Lógica de OAuth
- `App.tsx` - Gerenciamento de sessão
- `src/services/auth.ts` - Configurações de autenticação

## 💡 Dicas

1. **Desenvolvimento local**: Use `pk_test_` key
2. **Produção**: Migre para `pk_live_` key
3. **Segurança**: Nunca commite o arquivo `.env`
4. **Performance**: O `useWarmUpBrowser` otimiza a abertura do navegador
5. **UX**: Adicione loading states para melhor experiência

---

**Tudo pronto!** Após configurar, os usuários poderão fazer login com Google e GitHub! 🎉
