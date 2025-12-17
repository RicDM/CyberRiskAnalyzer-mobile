import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';

WebBrowser.maybeCompleteAuthSession();

interface LoginProps {
    onLogin: (email: string) => void;
}

export function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useWarmUpBrowser();

    const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
    const { startOAuthFlow: startGithubOAuth } = useOAuth({ strategy: 'oauth_github' });

    const handleSubmit = () => {
        if (email && password) {
            onLogin(email);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            const { createdSessionId, setActive } = await startGoogleOAuth();

            if (createdSessionId) {
                setActive!({ session: createdSessionId });
                const emailFromAuth = 'user@google.com';
                onLogin(emailFromAuth);
            }
        } catch (err: any) {
            console.error('OAuth error:', err);
            Alert.alert('Erro', 'Falha ao autenticar com Google. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGithubSignIn = async () => {
        try {
            setIsLoading(true);
            const { createdSessionId, setActive } = await startGithubOAuth();

            if (createdSessionId) {
                setActive!({ session: createdSessionId });
                const emailFromAuth = 'user@github.com';
                onLogin(emailFromAuth);
            }
        } catch (err: any) {
            console.error('OAuth error:', err);
            Alert.alert('Erro', 'Falha ao autenticar com GitHub. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logo}>
                            <Text style={styles.logoIcon}>🛡️</Text>
                        </View>
                        <Text style={styles.title}>CyberRisk Analyzer</Text>
                        <Text style={styles.subtitle}>
                            Plataforma de Análise de Riscos Cibernéticos
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="seu@email.com"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Senha</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Entrar</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
                        </TouchableOpacity>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OU</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            <Text style={styles.socialButtonIcon}>🔍</Text>
                            <Text style={styles.socialButtonText}>Continuar com Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.socialButton]}
                            onPress={handleGithubSignIn}
                            disabled={isLoading}
                        >
                            <Text style={styles.socialButtonIcon}>⚡</Text>
                            <Text style={styles.socialButtonText}>Continuar com GitHub</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        backgroundColor: '#2563EB',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    logoIcon: {
        fontSize: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    form: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#111827',
    },
    button: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotPassword: {
        marginTop: 16,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#2563EB',
        fontSize: 14,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    githubButton: {
        backgroundColor: '#24292F',
        borderColor: '#24292F',
    },
    socialButtonIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
});
