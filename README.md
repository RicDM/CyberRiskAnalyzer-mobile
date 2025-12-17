# CyberRisk Analyzer Mobile

Aplicação mobile de análise de riscos cibernéticos desenvolvida com React Native e Expo.

## 🚀 Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para React Native
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Armazenamento local de dados

## 📱 Funcionalidades

- ✅ Autenticação de usuário
- ✅ Formulário de avaliação de segurança cibernética
- ✅ Dashboard com análise de riscos
- ✅ Identificação de ameaças e vulnerabilidades
- ✅ Recomendações de segurança
- ✅ Armazenamento local de avaliações

## 🔧 Instalação

1. **Clone o repositório e navegue até a pasta do projeto:**
```bash
cd CyberRiskAnalyzer-mobile
```

2. **Instale as dependências:**
```bash
npm install
```

## 🎯 Executando o Projeto

### Executar no Android
```bash
npm run android
```

### Executar no iOS (requer macOS)
```bash
npm run ios
```

### Executar na Web
```bash
npm run web
```

### Modo de Desenvolvimento
```bash
npm start
```

Isso abrirá o Expo Dev Tools onde você pode:
- Escanear o QR Code com o app Expo Go no seu celular
- Executar em emulador Android/iOS
- Executar no navegador web

## 📱 Testando no Dispositivo Físico

1. Instale o app **Expo Go** no seu celular:
   - [Android - Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Execute `npm start` no terminal

3. Escaneie o QR Code que aparece no terminal com:
   - **Android**: App Expo Go
   - **iOS**: Câmera nativa do iPhone

## 📂 Estrutura do Projeto

```
CyberRiskAnalyzer-mobile/
├── src/
│   ├── components/
│   │   ├── Login.tsx           # Tela de login
│   │   ├── Dashboard.tsx       # Dashboard principal
│   │   └── AssessmentForm.tsx  # Formulário de avaliação
│   └── types/
│       └── index.ts            # Tipos TypeScript
├── App.tsx                     # Componente principal
├── package.json
└── README.md
```

## 🎨 Componentes Principais

### Login
- Tela de autenticação
- Validação de e-mail e senha
- Interface responsiva

### Dashboard
- Visualização de pontuação de segurança
- Lista de ameaças e vulnerabilidades
- Recomendações de segurança
- Informações da última avaliação

### AssessmentForm
- Formulário completo de avaliação
- Controles de segurança (switches)
- Seleções de políticas e práticas
- Validação de campos obrigatórios

## 🔐 Critérios de Avaliação de Risco

A aplicação avalia os seguintes aspectos:

### Controles de Segurança
- Firewall Corporativo
- Antivírus/Antimalware
- Backup Regular
- Treinamento em Segurança
- Plano de Resposta a Incidentes
- Controle de Acesso
- Criptografia de Dados
- Monitoramento de Segurança

### Políticas e Práticas
- Frequência de Atualizações
- Classificação de Dados
- Uso de Nuvem

### Níveis de Risco
- **Baixo** (80-100 pontos) - 🟢
- **Médio** (60-79 pontos) - 🟡
- **Alto** (40-59 pontos) - 🟠
- **Crítico** (0-39 pontos) - 🔴

## 📊 Armazenamento de Dados

Os dados são armazenados localmente usando AsyncStorage:
- Autenticação do usuário
- Histórico de avaliações
- Pontuações e análises

## 🛠️ Migração da Versão Web

Esta é a versão mobile da aplicação web original. Principais mudanças:

1. **React Router → React Navigation**: Navegação adaptada para mobile
2. **CSS/Tailwind → StyleSheet**: Estilos nativos do React Native
3. **localStorage → AsyncStorage**: Armazenamento persistente mobile
4. **Componentes Radix UI → Componentes nativos**: Switch, Picker, etc.
5. **Gráficos**: Simplificados (charts podem ser adicionados com Victory Native ou similar)

## 🚧 Próximas Melhorias

- [ ] Adicionar gráficos interativos (Victory Native ou React Native Chart Kit)
- [ ] Implementar tela de histórico de avaliações
- [ ] Adicionar matriz de correlação
- [ ] Exportar relatórios em PDF
- [ ] Sincronização com backend
- [ ] Notificações push para alertas de segurança
- [ ] Modo offline completo

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.

## 👤 Autor

Migrado da versão web para React Native com Expo.
