# 🔔 Guia de Notificações

## Status Atual

✅ **Notificações Locais**: Funcionando no Expo Go
❌ **Notificações Push Remotas**: Requer Development Build (não funciona no Expo Go desde SDK 53+)

## Tipos de Notificações Implementadas

### Notificações Locais (✅ Funcionam)
- Notificações imediatas
- Lembretes diários
- Lembretes semanais
- Alertas de risco alto
- Notificação de avaliação concluída

### Notificações Push Remotas (❌ Requer Dev Build)
- Notificações de servidores externos
- Push notifications via Firebase/OneSignal

## Como Usar no Expo Go

As notificações **locais** já funcionam! O app agenda automaticamente:
- 🕐 Lembrete diário às 9h
- 📅 Lembrete semanal toda segunda às 9h
- ⚠️ Alertas quando detecta risco alto (>70%)

## Como Habilitar Push Notifications

Se você precisar de notificações push remotas, siga estes passos:

### 1. Criar Development Build

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar projeto
eas build:configure

# Build para Android
eas build --platform android --profile development

# Build para iOS
eas build --platform ios --profile development
```

### 2. Instalar o Build

Após o build completar:
- **Android**: Baixe o APK e instale no dispositivo
- **iOS**: Baixe via TestFlight ou instale diretamente

### 3. Configurar Push Notifications

No `app.json`, adicione:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#2563EB"
        }
      ]
    ],
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.cyberrisk"
    }
  }
}
```

### 4. Testar Notificações

```bash
# Executar com dev build
npx expo start --dev-client
```

## Testando Notificações Locais (Expo Go)

Você pode testar manualmente as notificações:

```typescript
import { NotificationService } from './src/services/notifications';

// Notificação imediata
await NotificationService.showNotification(
  'Teste',
  'Esta é uma notificação de teste!'
);

// Notificação em 5 segundos
await NotificationService.scheduleNotification(
  'Teste Agendado',
  'Agendada para 5 segundos',
  new Date(Date.now() + 5000)
);

// Ver todas notificações agendadas
const scheduled = await NotificationService.getAllScheduled();
console.log('Notificações agendadas:', scheduled);
```

## Documentação Oficial

- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Push Notifications Setup](https://docs.expo.dev/push-notifications/overview/)

## Perguntas Frequentes

**P: Por que não funciona no Expo Go?**
R: O Expo removeu suporte a push notifications remotas no SDK 53+ para simplificar o Expo Go. Use development builds para funcionalidades completas.

**P: Notificações locais funcionam offline?**
R: Sim! Elas são agendadas localmente no dispositivo.

**P: Como cancelar notificações?**
R: Use `NotificationService.cancelAllNotifications()` ou cancele individualmente.

**P: As notificações funcionam com o app fechado?**
R: Sim, notificações locais agendadas funcionam mesmo com o app fechado.
