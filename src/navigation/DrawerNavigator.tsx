import { Ionicons } from '@expo/vector-icons';
import {
    createDrawerNavigator,
    DrawerContentComponentProps,
    DrawerContentScrollView
} from '@react-navigation/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

import type { AssessmentData } from '../types';
import { TabNavigator } from './TabNavigator';

const Drawer = createDrawerNavigator();

interface DrawerNavigatorProps {
    assessments: AssessmentData[];
    onNewAssessment: () => void;
    onAssessmentSubmit: (data: any) => void;
    onRefresh: () => void;
    onLogout: () => void;
    currentUser: string | null;
}

function CustomDrawerContent(props: DrawerContentComponentProps & { currentUser: string | null; onLogout: () => void }) {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
            {/* Header do Drawer */}
            <View style={styles.drawerHeader}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="shield-checkmark" size={40} color="white" />
                </View>
                <Text style={styles.appName}>CyberRisk Analyzer</Text>
                <Text style={styles.userEmail}>{props.currentUser}</Text>
            </View>

            {/* Items do Drawer */}
            <View style={styles.drawerItems}>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate('Main', { screen: 'DashboardTab' })}
                >
                    <Ionicons name="grid" size={24} color={COLORS.primary} />
                    <Text style={styles.drawerItemText}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate('Main', { screen: 'AssessmentTab' })}
                >
                    <Ionicons name="add-circle" size={24} color={COLORS.primary} />
                    <Text style={styles.drawerItemText}>Nova Avaliação</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate('Main', { screen: 'HistoryTab' })}
                >
                    <Ionicons name="time" size={24} color={COLORS.primary} />
                    <Text style={styles.drawerItemText}>Histórico</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => props.navigation.navigate('Main', { screen: 'ProfileTab' })}
                >
                    <Ionicons name="person" size={24} color={COLORS.primary} />
                    <Text style={styles.drawerItemText}>Perfil</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.drawerItem}>
                    <Ionicons name="settings" size={24} color={COLORS.textSecondary} />
                    <Text style={styles.drawerItemText}>Configurações</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem}>
                    <Ionicons name="help-circle" size={24} color={COLORS.textSecondary} />
                    <Text style={styles.drawerItemText}>Ajuda</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem}>
                    <Ionicons name="information-circle" size={24} color={COLORS.textSecondary} />
                    <Text style={styles.drawerItemText}>Sobre</Text>
                </TouchableOpacity>
            </View>

            {/* Footer do Drawer */}
            <View style={styles.drawerFooter}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={props.onLogout}
                >
                    <Ionicons name="log-out" size={20} color={COLORS.danger} />
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>v1.0.0</Text>
            </View>
        </DrawerContentScrollView>
    );
}

export function DrawerNavigator({
    assessments,
    onNewAssessment,
    onAssessmentSubmit,
    onRefresh,
    onLogout,
    currentUser,
}: DrawerNavigatorProps) {
    return (
        <Drawer.Navigator
            drawerContent={(props) => (
                <CustomDrawerContent
                    {...props}
                    currentUser={currentUser}
                    onLogout={onLogout}
                />
            )}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: COLORS.card,
                    width: 280,
                },
                drawerType: 'front',
                overlayColor: 'rgba(0,0,0,0.5)',
            }}
        >
            <Drawer.Screen name="Main">
                {(props) => (
                    <TabNavigator
                        {...props}
                        assessments={assessments}
                        onNewAssessment={onNewAssessment}
                        onAssessmentSubmit={onAssessmentSubmit}
                        onRefresh={onRefresh}
                        onLogout={onLogout}
                        currentUser={currentUser}
                    />
                )}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    drawerHeader: {
        backgroundColor: COLORS.primary,
        padding: SIZES.xl,
        paddingTop: SIZES.xxl + 20,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primaryDark,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.md,
        borderWidth: 3,
        borderColor: 'white',
    },
    appName: {
        fontSize: SIZES.fontLg,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: SIZES.xs,
    },
    userEmail: {
        fontSize: SIZES.fontSm,
        color: 'rgba(255,255,255,0.9)',
    },
    drawerItems: {
        flex: 1,
        paddingTop: SIZES.md,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SIZES.md,
        paddingHorizontal: SIZES.lg,
    },
    drawerItemText: {
        fontSize: SIZES.fontMd,
        color: COLORS.text,
        marginLeft: SIZES.md,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SIZES.sm,
        marginHorizontal: SIZES.lg,
    },
    drawerFooter: {
        padding: SIZES.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SIZES.md,
        backgroundColor: COLORS.gray[100],
        borderRadius: SIZES.radiusMd,
        marginBottom: SIZES.sm,
    },
    logoutText: {
        fontSize: SIZES.fontMd,
        color: COLORS.danger,
        fontWeight: '600',
        marginLeft: SIZES.sm,
    },
    versionText: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});
