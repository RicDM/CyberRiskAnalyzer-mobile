import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/theme';

import { AssessmentForm } from '../components/AssessmentForm';
import { Dashboard } from '../components/Dashboard';
import { History } from '../components/History';
import { Profile } from '../components/Profile';
import type { AssessmentData } from '../types';

const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
    assessments: AssessmentData[];
    onNewAssessment: () => void;
    onAssessmentSubmit: (data: any) => void;
    onRefresh: () => void;
    onLogout: () => void;
    currentUser: string | null;
}

export function TabNavigator({
    assessments,
    onNewAssessment,
    onAssessmentSubmit,
    onRefresh,
    onLogout,
    currentUser,
}: TabNavigatorProps) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'DashboardTab') {
                        iconName = focused ? 'grid' : 'grid-outline';
                    } else if (route.name === 'AssessmentTab') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'HistoryTab') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'ProfileTab') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray[500],
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    backgroundColor: COLORS.card,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="DashboardTab"
                options={{ tabBarLabel: 'Dashboard' }}
            >
                {(props) => (
                    <Dashboard
                        {...props}
                        assessments={assessments}
                        onNewAssessment={onNewAssessment}
                        onLogout={onLogout}
                        currentUser={currentUser}
                    />
                )}
            </Tab.Screen>

            <Tab.Screen
                name="AssessmentTab"
                options={{ tabBarLabel: 'Avaliar' }}
            >
                {(props) => (
                    <AssessmentForm
                        {...props}
                        onSubmit={onAssessmentSubmit}
                        onBack={() => props.navigation.navigate('DashboardTab')}
                    />
                )}
            </Tab.Screen>

            <Tab.Screen
                name="HistoryTab"
                options={{ tabBarLabel: 'Histórico' }}
            >
                {(props) => (
                    <History
                        {...props}
                        assessments={assessments}
                        onRefresh={onRefresh}
                    />
                )}
            </Tab.Screen>

            <Tab.Screen
                name="ProfileTab"
                options={{ tabBarLabel: 'Perfil' }}
            >
                {(props) => (
                    <Profile
                        {...props}
                        currentUser={currentUser}
                        onLogout={onLogout}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}
