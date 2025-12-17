import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import NotificationService from '../services/notifications';

interface ProfileProps {
    currentUser: string | null;
    onLogout: () => void;
}

export function Profile({ currentUser, onLogout }: ProfileProps) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [dailyReminder, setDailyReminder] = useState(false);
    const [weeklyReminder, setWeeklyReminder] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const notifEnabled = await AsyncStorage.getItem('notificationsEnabled');
            const daily = await AsyncStorage.getItem('dailyReminder');
            const weekly = await AsyncStorage.getItem('weeklyReminder');

            setNotificationsEnabled(notifEnabled === 'true');
            setDailyReminder(daily === 'true');
            setWeeklyReminder(weekly === 'true');
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        }
    };

    const toggleNotifications = async (value: boolean) => {
        if (value) {
            const hasPermission = await NotificationService.requestPermissions();
            if (!hasPermission) {
                Alert.alert(
                    'Permissão Negada',
                    'Por favor, habilite as notificações nas configurações do dispositivo.'
                );
                return;
            }
        }

        setNotificationsEnabled(value);
        await AsyncStorage.setItem('notificationsEnabled', value.toString());

        if (!value) {
            await NotificationService.cancelAllNotifications();
            setDailyReminder(false);
            setWeeklyReminder(false);
        }
    };

    const toggleDailyReminder = async (value: boolean) => {
        if (value) {
            await NotificationService.scheduleDailyReminder(9, 0);
            Alert.alert('✅ Lembrete Ativado', 'Você receberá uma notificação diária às 9h.');
        } else {
            await NotificationService.cancelDailyReminder();
        }

        setDailyReminder(value);
        await AsyncStorage.setItem('dailyReminder', value.toString());
    };

    const toggleWeeklyReminder = async (value: boolean) => {
        if (value) {
            await NotificationService.scheduleWeeklyReminder(1, 9); // Segunda-feira às 9h
            Alert.alert('✅ Lembrete Semanal Ativado', 'Você receberá uma notificação toda segunda às 9h.');
        } else {
            await NotificationService.cancelWeeklyReminder();
        }

        setWeeklyReminder(value);
        await AsyncStorage.setItem('weeklyReminder', value.toString());
    };

    const handleClearData = () => {
        Alert.alert(
            'Limpar Dados',
            'Tem certeza que deseja apagar todas as avaliações? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Limpar',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('assessments');
                        Alert.alert('✅ Dados Limpos', 'Todas as avaliações foram removidas.');
                    },
                },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Sair',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: onLogout,
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header com Avatar */}
            <Animated.View entering={FadeIn} style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={48} color="white" />
                    </View>
                </View>
                <Text style={styles.userName}>{currentUser || 'Usuário'}</Text>
                <Text style={styles.userEmail}>{currentUser}</Text>
            </Animated.View>

            {/* Notificações */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="notifications" size={24} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>Notificações</Text>
                </View>

                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Ativar Notificações</Text>
                        <Text style={styles.settingDescription}>
                            Receba alertas e lembretes
                        </Text>
                    </View>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={toggleNotifications}
                        trackColor={{ false: COLORS.gray[300], true: COLORS.primary + '80' }}
                        thumbColor={notificationsEnabled ? COLORS.primary : COLORS.gray[400]}
                    />
                </View>

                {notificationsEnabled && (
                    <>
                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Lembrete Diário</Text>
                                <Text style={styles.settingDescription}>
                                    Notificação diária às 9h
                                </Text>
                            </View>
                            <Switch
                                value={dailyReminder}
                                onValueChange={toggleDailyReminder}
                                trackColor={{ false: COLORS.gray[300], true: COLORS.primary + '80' }}
                                thumbColor={dailyReminder ? COLORS.primary : COLORS.gray[400]}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Lembrete Semanal</Text>
                                <Text style={styles.settingDescription}>
                                    Toda segunda-feira às 9h
                                </Text>
                            </View>
                            <Switch
                                value={weeklyReminder}
                                onValueChange={toggleWeeklyReminder}
                                trackColor={{ false: COLORS.gray[300], true: COLORS.primary + '80' }}
                                thumbColor={weeklyReminder ? COLORS.primary : COLORS.gray[400]}
                            />
                        </View>
                    </>
                )}
            </View>

            {/* Conta */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="person-circle" size={24} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>Conta</Text>
                </View>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="key" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.menuText}>Alterar Senha</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="shield-checkmark" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.menuText}>Privacidade</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Sobre */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="information-circle" size={24} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>Sobre</Text>
                </View>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="help-circle" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.menuText}>Ajuda e Suporte</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="document-text" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.menuText}>Termos de Uso</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <View style={styles.menuItem}>
                    <Ionicons name="code" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.menuText}>Versão</Text>
                    <Text style={styles.versionText}>1.0.0</Text>
                </View>
            </View>

            {/* Ações */}
            <View style={styles.section}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.clearButton]}
                    onPress={handleClearData}
                >
                    <Ionicons name="trash" size={20} color={COLORS.danger} />
                    <Text style={[styles.actionButtonText, { color: COLORS.danger }]}>
                        Limpar Todos os Dados
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out" size={20} color="white" />
                    <Text style={[styles.actionButtonText, { color: 'white' }]}>
                        Sair
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: SIZES.xl,
        alignItems: 'center',
        paddingTop: SIZES.xxl,
    },
    avatarContainer: {
        marginBottom: SIZES.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    userName: {
        fontSize: SIZES.fontXl,
        fontWeight: 'bold',
        color: 'white',
        marginTop: SIZES.sm,
    },
    userEmail: {
        fontSize: SIZES.fontMd,
        color: 'rgba(255,255,255,0.9)',
        marginTop: SIZES.xs,
    },
    section: {
        backgroundColor: COLORS.card,
        marginTop: SIZES.md,
        paddingVertical: SIZES.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.lg,
        marginBottom: SIZES.md,
    },
    sectionTitle: {
        fontSize: SIZES.fontLg,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: SIZES.sm,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.lg,
        paddingVertical: SIZES.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    settingInfo: {
        flex: 1,
        marginRight: SIZES.md,
    },
    settingLabel: {
        fontSize: SIZES.fontMd,
        color: COLORS.text,
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.lg,
        paddingVertical: SIZES.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    menuText: {
        fontSize: SIZES.fontMd,
        color: COLORS.text,
        marginLeft: SIZES.md,
        flex: 1,
    },
    versionText: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SIZES.md,
        marginHorizontal: SIZES.lg,
        marginTop: SIZES.md,
        borderRadius: SIZES.radiusMd,
        ...SHADOWS.sm,
    },
    clearButton: {
        backgroundColor: COLORS.gray[100],
    },
    logoutButton: {
        backgroundColor: COLORS.danger,
    },
    actionButtonText: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        marginLeft: SIZES.sm,
    },
});
