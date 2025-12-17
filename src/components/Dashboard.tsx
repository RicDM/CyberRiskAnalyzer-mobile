import React, { useMemo } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import type { AssessmentData, RiskAnalysis } from '../types';

interface DashboardProps {
    assessments: AssessmentData[];
    onNewAssessment: () => void;
    onLogout: () => void;
    currentUser: string | null;
}

export function Dashboard({ assessments, onNewAssessment, onLogout, currentUser }: DashboardProps) {
    const latestAssessment = assessments[assessments.length - 1];

    const riskAnalysis = useMemo<RiskAnalysis | null>(() => {
        if (!latestAssessment) return null;

        const securityScore = [
            latestAssessment.antivirusEnabled ? 0 : 15,
            latestAssessment.firewallEnabled ? 0 : 15,
            latestAssessment.dataEncryption ? 0 : 15,
            latestAssessment.backupSystem ? 0 : 10,
            latestAssessment.accessControl ? 0 : 15,
            latestAssessment.updatePolicy ? 0 : 10,
            latestAssessment.securityTraining ? 0 : 10,
            latestAssessment.incidentResponse ? 0 : 10,
        ].reduce((acc, val) => acc + val, 0);

        const complexityMultiplier = {
            low: 0.7,
            medium: 1.0,
            high: 1.3,
        }[latestAssessment.systemComplexity];

        const sensitivityMultiplier = {
            low: 0.8,
            medium: 1.0,
            high: 1.5,
        }[latestAssessment.dataSensitivity];

        const riskScore = Math.min(100, securityScore * complexityMultiplier * sensitivityMultiplier);
        const score = 100 - riskScore;

        let riskLevel: RiskAnalysis['riskLevel'];
        if (score >= 80) riskLevel = 'Baixo';
        else if (score >= 60) riskLevel = 'Médio';
        else if (score >= 40) riskLevel = 'Alto';
        else riskLevel = 'Crítico';

        const threats = [
            { type: 'Ransomware', probability: latestAssessment.backupSystem ? 30 : 70, impact: 90 },
            { type: 'Phishing', probability: latestAssessment.securityTraining ? 40 : 80, impact: 70 },
            { type: 'Malware', probability: latestAssessment.antivirusEnabled ? 25 : 75, impact: 80 },
            { type: 'DDoS', probability: latestAssessment.firewallEnabled ? 30 : 60, impact: 60 },
            { type: 'Vazamento de Dados', probability: latestAssessment.dataEncryption ? 20 : 70, impact: 95 },
        ];

        const vulnerabilities = [];
        if (!latestAssessment.firewallEnabled) {
            vulnerabilities.push({
                area: 'Perímetro de Rede',
                severity: 'Alta',
                description: 'Ausência de firewall corporativo expõe a rede',
            });
        }
        if (!latestAssessment.backupSystem) {
            vulnerabilities.push({
                area: 'Continuidade de Negócio',
                severity: 'Crítica',
                description: 'Sem backup regular, dados estão em risco',
            });
        }
        if (!latestAssessment.securityTraining) {
            vulnerabilities.push({
                area: 'Fator Humano',
                severity: 'Média',
                description: 'Falta de treinamento aumenta risco de engenharia social',
            });
        }

        const recommendations = [];
        if (score < 80) {
            recommendations.push({
                priority: 'Alta',
                action: 'Implementar controles de segurança ausentes imediatamente',
            });
        }
        if (!latestAssessment.backupSystem) {
            recommendations.push({
                priority: 'Crítica',
                action: 'Estabelecer política de backup 3-2-1',
            });
        }
        if (!latestAssessment.dataEncryption) {
            recommendations.push({
                priority: 'Alta',
                action: 'Implementar criptografia para dados sensíveis',
            });
        }

        return {
            overallScore: Math.round(score),
            riskLevel,
            threats,
            vulnerabilities,
            recommendations,
        };
    }, [latestAssessment]);

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'Baixo':
                return COLORS.success;
            case 'Médio':
                return COLORS.warning;
            case 'Alto':
                return COLORS.danger;
            case 'Crítico':
                return COLORS.critical;
            default:
                return COLORS.gray[500];
        }
    };

    if (!latestAssessment || !riskAnalysis) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                    <TouchableOpacity onPress={onLogout}>
                        <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
                    </TouchableOpacity>
                </View>

                <Animated.View entering={FadeInDown.duration(800)} style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📊</Text>
                    <Text style={styles.emptyTitle}>Nenhuma avaliação encontrada</Text>
                    <Text style={styles.emptyText}>
                        Realize sua primeira avaliação de risco para visualizar o dashboard completo
                    </Text>
                    <TouchableOpacity style={styles.primaryButton} onPress={onNewAssessment}>
                        <Text style={styles.primaryButtonText}>Nova Avaliação</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                    {currentUser && <Text style={styles.headerSubtitle}>{currentUser}</Text>}
                </View>
                <TouchableOpacity onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Score Card com animação */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.scoreCard}>
                    <Text style={styles.scoreLabel}>Pontuação de Segurança</Text>
                    <Text style={styles.scoreValue}>{riskAnalysis.overallScore}</Text>
                    <View
                        style={[
                            styles.riskBadge,
                            { backgroundColor: getRiskColor(riskAnalysis.riskLevel) },
                        ]}
                    >
                        <Text style={styles.riskBadgeText}>Risco {riskAnalysis.riskLevel}</Text>
                    </View>
                </Animated.View>

                {/* Stats Cards com animação */}
                <View style={styles.statsGrid}>
                    <Animated.View entering={FadeInRight.delay(200).duration(600)} style={styles.statCard}>
                        <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
                        <Text style={styles.statValue}>{assessments.length}</Text>
                        <Text style={styles.statLabel}>Avaliações</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInRight.delay(300).duration(600)} style={styles.statCard}>
                        <Ionicons name="alert-circle" size={32} color={COLORS.warning} />
                        <Text style={styles.statValue}>{riskAnalysis.vulnerabilities.length}</Text>
                        <Text style={styles.statLabel}>Vulnerabilidades</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInRight.delay(400).duration(600)} style={styles.statCard}>
                        <Ionicons name="warning" size={32} color={COLORS.danger} />
                        <Text style={styles.statValue}>{riskAnalysis.threats.length}</Text>
                        <Text style={styles.statLabel}>Ameaças</Text>
                    </Animated.View>
                </View>

                {/* Principais Ameaças */}
                <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.section}>
                    <Text style={styles.sectionTitle}>⚠️ Principais Ameaças</Text>
                    {riskAnalysis.threats.slice(0, 3).map((threat, index) => (
                        <View key={index} style={styles.threatCard}>
                            <Text style={styles.threatName}>{threat.type}</Text>
                            <View style={styles.threatMetrics}>
                                <Text style={styles.threatMetric}>
                                    Probabilidade: {threat.probability}%
                                </Text>
                                <Text style={styles.threatMetric}>Impacto: {threat.impact}%</Text>
                            </View>
                        </View>
                    ))}
                </Animated.View>

                {/* Vulnerabilidades */}
                {riskAnalysis.vulnerabilities.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.section}>
                        <Text style={styles.sectionTitle}>🔍 Vulnerabilidades Identificadas</Text>
                        {riskAnalysis.vulnerabilities.map((vuln, index) => (
                            <View key={index} style={styles.vulnCard}>
                                <View style={styles.vulnHeader}>
                                    <Text style={styles.vulnArea}>{vuln.area}</Text>
                                    <View
                                        style={[
                                            styles.severityBadge,
                                            {
                                                backgroundColor:
                                                    vuln.severity === 'Crítica'
                                                        ? '#FEE2E2'
                                                        : vuln.severity === 'Alta'
                                                            ? '#FED7AA'
                                                            : '#FEF3C7',
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.severityText,
                                                {
                                                    color:
                                                        vuln.severity === 'Crítica'
                                                            ? COLORS.critical
                                                            : vuln.severity === 'Alta'
                                                                ? COLORS.danger
                                                                : COLORS.warning,
                                                },
                                            ]}
                                        >
                                            {vuln.severity}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.vulnDescription}>{vuln.description}</Text>
                            </View>
                        ))}
                    </Animated.View>
                )}

                {/* Recomendações */}
                <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.section}>
                    <Text style={styles.sectionTitle}>💡 Recomendações</Text>
                    {riskAnalysis.recommendations.map((rec, index) => (
                        <View key={index} style={styles.recCard}>
                            <View style={styles.recHeader}>
                                <Text style={styles.recPriority}>Prioridade: {rec.priority}</Text>
                            </View>
                            <Text style={styles.recAction}>{rec.action}</Text>
                        </View>
                    ))}
                </Animated.View>

                <TouchableOpacity style={styles.primaryButton} onPress={onNewAssessment}>
                    <Ionicons name="add-circle" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryButtonText}>Nova Avaliação</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.lg,
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: SIZES.fontXl,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    headerSubtitle: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    content: {
        padding: SIZES.lg,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.xxl,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: SIZES.lg,
    },
    emptyTitle: {
        fontSize: SIZES.fontLg,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SIZES.sm,
    },
    emptyText: {
        fontSize: SIZES.fontMd,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SIZES.xl,
    },
    scoreCard: {
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radiusLg,
        padding: SIZES.xl,
        alignItems: 'center',
        marginBottom: SIZES.lg,
        ...SHADOWS.medium,
    },
    scoreLabel: {
        fontSize: SIZES.fontMd,
        color: COLORS.textSecondary,
        marginBottom: SIZES.sm,
    },
    scoreValue: {
        fontSize: 64,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SIZES.md,
    },
    riskBadge: {
        paddingHorizontal: SIZES.lg,
        paddingVertical: SIZES.sm,
        borderRadius: SIZES.radiusFull,
    },
    riskBadgeText: {
        color: 'white',
        fontSize: SIZES.fontMd,
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.lg,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.md,
        alignItems: 'center',
        marginHorizontal: 4,
        ...SHADOWS.small,
    },
    statValue: {
        fontSize: SIZES.fontXl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginVertical: SIZES.xs,
    },
    statLabel: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
    },
    section: {
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.lg,
        marginBottom: SIZES.md,
        ...SHADOWS.small,
    },
    sectionTitle: {
        fontSize: SIZES.fontLg,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SIZES.md,
    },
    threatCard: {
        backgroundColor: '#FEF3C7',
        borderRadius: SIZES.radiusSm,
        padding: SIZES.md,
        marginBottom: SIZES.sm,
    },
    threatName: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: '#92400E',
        marginBottom: SIZES.sm,
    },
    threatMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    threatMetric: {
        fontSize: SIZES.fontSm,
        color: '#78350F',
    },
    vulnCard: {
        borderLeftWidth: 4,
        borderLeftColor: COLORS.danger,
        backgroundColor: '#FEF2F2',
        padding: SIZES.md,
        marginBottom: SIZES.sm,
        borderRadius: SIZES.radiusSm,
    },
    vulnHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.sm,
    },
    vulnArea: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
    },
    severityBadge: {
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.xs,
        borderRadius: SIZES.radiusFull,
    },
    severityText: {
        fontSize: SIZES.fontSm,
        fontWeight: '600',
    },
    vulnDescription: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
    },
    recCard: {
        backgroundColor: '#DBEAFE',
        borderRadius: SIZES.radiusSm,
        padding: SIZES.md,
        marginBottom: SIZES.sm,
    },
    recHeader: {
        marginBottom: SIZES.sm,
    },
    recPriority: {
        fontSize: SIZES.fontSm,
        fontWeight: '600',
        color: '#1E40AF',
    },
    recAction: {
        fontSize: SIZES.fontSm,
        color: '#1E3A8A',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.lg,
        alignItems: 'center',
        marginTop: SIZES.md,
        marginBottom: SIZES.xxl,
        flexDirection: 'row',
        justifyContent: 'center',
        ...SHADOWS.medium,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: SIZES.fontMd,
        fontWeight: '600',
    },
});
