import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export class NotificationService {
    static async requestPermissions() {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Permissão de notificação negada');
            return false;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#2563EB',
            });
        }

        return true;
    }

    static async showNotification(title: string, body: string, data?: any) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
            },
            trigger: null, // Imediata
        });
    }

    static async scheduleNotification(
        title: string,
        body: string,
        trigger: Date,
        data?: any
    ) {
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
            },
            trigger: {
                channelId: 'default',
                date: trigger,
            },
        });

        return identifier;
    }

    static async scheduleDailyReminder(hour: number = 9, minute: number = 0) {
        await this.cancelDailyReminder();

        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: '🛡️ CyberRisk Analyzer',
                body: 'Hora de fazer sua avaliação de segurança semanal!',
                data: { type: 'daily_reminder' },
                sound: true,
            },
            trigger: {
                channelId: 'default',
                hour,
                minute,
                repeats: true,
            },
        });

        await AsyncStorage.setItem('dailyReminderNotificationId', identifier);
        return identifier;
    }

    static async scheduleWeeklyReminder(weekday: number = 1, hour: number = 9) {
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: '📊 Avaliação Semanal',
                body: 'Não esqueça de revisar os riscos de segurança da sua empresa!',
                data: { type: 'weekly_reminder' },
                sound: true,
            },
            trigger: {
                channelId: 'default',
                weekday, // 1 = Segunda, 2 = Terça, etc
                hour,
                minute: 0,
                repeats: true,
            },
        });

        await AsyncStorage.setItem('weeklyReminderNotificationId', identifier);
        return identifier;
    }

    static async cancelDailyReminder() {
        const id = await AsyncStorage.getItem('dailyReminderNotificationId');
        if (id) {
            await Notifications.cancelScheduledNotificationAsync(id);
            await AsyncStorage.removeItem('dailyReminderNotificationId');
        }
    }

    static async cancelWeeklyReminder() {
        const id = await AsyncStorage.getItem('weeklyReminderNotificationId');
        if (id) {
            await Notifications.cancelScheduledNotificationAsync(id);
            await AsyncStorage.removeItem('weeklyReminderNotificationId');
        }
    }

    static async cancelAllNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.removeItem('dailyReminderNotificationId');
        await AsyncStorage.removeItem('weeklyReminderNotificationId');
    }

    static async notifyHighRisk(companyName: string, riskLevel: string) {
        await this.showNotification(
            '⚠️ Alerta de Segurança',
            `Risco ${riskLevel} detectado em ${companyName}. Revise urgentemente!`,
            { type: 'high_risk_alert', companyName, riskLevel }
        );
    }

    static async notifyAssessmentCompleted(score: number) {
        const emoji = score >= 80 ? '✅' : score >= 60 ? '⚠️' : '🚨';
        await this.showNotification(
            `${emoji} Avaliação Concluída`,
            `Sua pontuação de segurança é ${score}. Toque para ver detalhes.`,
            { type: 'assessment_completed', score }
        );
    }

    static async getAllScheduled() {
        return await Notifications.getAllScheduledNotificationsAsync();
    }

    static addNotificationReceivedListener(callback: (notification: any) => void) {
        return Notifications.addNotificationReceivedListener(callback);
    }

    static addNotificationResponseListener(callback: (response: any) => void) {
        return Notifications.addNotificationResponseReceivedListener(callback);
    }
}

export default NotificationService;
