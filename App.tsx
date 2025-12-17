import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Login } from './src/components/Login';
import { DrawerNavigator } from './src/navigation/DrawerNavigator';
import { NotificationService } from './src/services/notifications';
import type { AssessmentData, RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      const hasPermission = await NotificationService.requestPermissions();
      if (hasPermission) {
        await NotificationService.scheduleDailyReminder();
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const loadData = async () => {
    try {
      const auth = await AsyncStorage.getItem('isAuthenticated');
      const user = await AsyncStorage.getItem('currentUser');
      const savedAssessments = await AsyncStorage.getItem('assessments');

      if (auth === 'true') {
        setIsAuthenticated(true);
        setCurrentUser(user);
      }

      if (savedAssessments) {
        const parsedAssessments = JSON.parse(savedAssessments);
        const assessmentsWithDates = parsedAssessments.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        }));
        setAssessments(assessmentsWithDates);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string) => {
    try {
      await AsyncStorage.setItem('isAuthenticated', 'true');
      await AsyncStorage.setItem('currentUser', email);
      setIsAuthenticated(true);
      setCurrentUser(email);
    } catch (error) {
      console.error('Error saving login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('isAuthenticated');
      await AsyncStorage.removeItem('currentUser');
      setIsAuthenticated(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAssessmentSubmit = async (data: Omit<AssessmentData, 'id' | 'timestamp'>) => {
    const newAssessment: AssessmentData = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    const updatedAssessments = [...assessments, newAssessment];
    setAssessments(updatedAssessments);

    try {
      await AsyncStorage.setItem('assessments', JSON.stringify(updatedAssessments));

      const riskScore = calculateRiskScore(newAssessment);
      if (riskScore >= 70) {
        await NotificationService.notifyHighRisk(riskScore);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const calculateRiskScore = (assessment: AssessmentData): number => {
    const securityScore = [
      assessment.antivirusEnabled ? 0 : 15,
      assessment.firewallEnabled ? 0 : 15,
      assessment.dataEncryption ? 0 : 15,
      assessment.backupSystem ? 0 : 10,
      assessment.accessControl ? 0 : 15,
      assessment.updatePolicy ? 0 : 10,
      assessment.securityTraining ? 0 : 10,
      assessment.incidentResponse ? 0 : 10,
    ].reduce((acc, val) => acc + val, 0);

    const complexityMultiplier = {
      low: 0.7,
      medium: 1.0,
      high: 1.3,
    }[assessment.systemComplexity];

    const sensitivityMultiplier = {
      low: 0.8,
      medium: 1.0,
      high: 1.5,
    }[assessment.dataSensitivity];

    return Math.min(100, securityScore * complexityMultiplier * sensitivityMultiplier);
  };

  const handleRefresh = () => {
    loadData();
  };

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        {!isAuthenticated ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login">
              {(props) => <Login {...props} onLogin={handleLogin} />}
            </Stack.Screen>
          </Stack.Navigator>
        ) : (
          <DrawerNavigator
            assessments={assessments}
            onNewAssessment={() => { }}
            onAssessmentSubmit={handleAssessmentSubmit}
            onRefresh={handleRefresh}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
