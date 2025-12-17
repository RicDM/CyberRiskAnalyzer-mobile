import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import type { AssessmentData } from '../types';

interface HistoryProps {
    assessments: AssessmentData[];
    onRefresh?: () => void;
}

export function History({ assessments, onRefresh }: HistoryProps) {
    const [refreshing, setRefreshing] = useState(false);
    const [filteredAssessments, setFilteredAssessments] = useState(assessments);

    useEffect(() => {
        setFilteredAssessments(assessments);
    }, [assessments]);

    const handleRefresh = async () => {
        setRefreshing(true);
        if (onRefresh) {
            await onRefresh();
        }
        setRefreshing(false);
    };

    const getRiskColor = (score: number) => {
        if (score >= 80) return COLORS.risk.low;
        if (score >= 60) return COLORS.risk.medium;
        if (score >= 40) return COLORS.risk.high;
        return COLORS.risk.critical;
    };

    const getRiskLevel = (score: number) => {
        if (score >= 80) return 'Baixo';
        if (score >= 60) return 'Médio';
        if (score >= 40) return 'Alto';
        return 'Crítico';
    };

    const calculateScore = (assessment: AssessmentData) => {
        let score = 100;
        if (!assessment.hasFirewall) score -= 15;
        if (!assessment.hasAntivirus) score -= 12;
        if (!assessment.hasBackup) score -= 10;
        if (!assessment.hasTraining) score -= 8;
        if (!assessment.hasIncidentResponse) score -= 10;
        if (!assessment.hasAccessControl) score -= 12;
        if (!assessment.hasEncryption) score -= 10;
        if (!assessment.hasMonitoring) score -= 8;
        return Math.max(0, score);
    };

    const renderItem = ({ item, index }: { item: AssessmentData; index: number }) => {
        const score = calculateScore(item);
        const riskLevel = getRiskLevel(score);
        const riskColor = getRiskColor(score);
        const date = new Date(item.timestamp);

        return (
            <Animated.View
                entering={FadeInDown.delay(index * 100)}
                style={styles.card}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.companyInfo}>
                        <Ionicons name="business" size={24} color={COLORS.primary} />
                        <View style={styles.companyText}>
                            <Text style={styles.companyName}>{item.companyName}</Text>
                            <Text style={styles.industry}>{item.industry}</Text>
                        </View>
                    </View>
                    <View style={[styles.scoreBadge, { backgroundColor: riskColor }]}>
                        <Text style={styles.scoreText}>{score}</Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                        <Ionicons name="people" size={16} color={COLORS.textSecondary} />
                        <Text style={styles.infoText}>{item.employeeCount} funcionários</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar" size={16} color={COLORS.textSecondary} />
                        <Text style={styles.infoText}>
                            {date.toLocaleDateString('pt-BR')} às {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>

                    <View style={[styles.riskBadge, { backgroundColor: `${riskColor}20` }]}>
                        <Text style={[styles.riskText, { color: riskColor }]}>
                            Risco {riskLevel}
                        </Text>
                    </View>
                </View>

                <View style={styles.controls}>
                    <Text style={styles.controlsLabel}>Controles:</Text>
                    <View style={styles.controlsGrid}>
                        {item.hasFirewall && <View style={styles.controlChip}><Text style={styles.controlChipText}>🔥 Firewall</Text></View>}
                        {item.hasAntivirus && <View style={styles.controlChip}><Text style={styles.controlChipText}>🛡️ Antivírus</Text></View>}
                        {item.hasBackup && <View style={styles.controlChip}><Text style={styles.controlChipText}>💾 Backup</Text></View>}
                        {item.hasEncryption && <View style={styles.controlChip}><Text style={styles.controlChipText}>🔐 Criptografia</Text></View>}
                    </View>
                </View>
            </Animated.View>
        );
    };

    if (assessments.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Ionicons name="documents-outline" size={80} color={COLORS.gray[300]} />
                <Text style={styles.emptyTitle}>Nenhuma avaliação ainda</Text>
                <Text style={styles.emptyText}>
                    Faça sua primeira avaliação para ver o histórico aqui
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Histórico de Avaliações</Text>
                <Text style={styles.subtitle}>{assessments.length} avaliações realizadas</Text>
            </View>

            <FlatList
                data={filteredAssessments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SIZES.lg,
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: SIZES.fontTitle,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SIZES.xs,
    },
    subtitle: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
    },
    listContent: {
        padding: SIZES.md,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radiusLg,
        padding: SIZES.md,
        marginBottom: SIZES.md,
        ...SHADOWS.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.md,
    },
    companyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    companyText: {
        marginLeft: SIZES.sm,
        flex: 1,
    },
    companyName: {
        fontSize: SIZES.fontLg,
        fontWeight: '600',
        color: COLORS.text,
    },
    industry: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        textTransform: 'capitalize',
    },
    scoreBadge: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: SIZES.fontXl,
        fontWeight: 'bold',
        color: 'white',
    },
    cardBody: {
        marginBottom: SIZES.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.xs,
    },
    infoText: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        marginLeft: SIZES.sm,
    },
    riskBadge: {
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.xs,
        borderRadius: SIZES.radiusMd,
        alignSelf: 'flex-start',
        marginTop: SIZES.sm,
    },
    riskText: {
        fontSize: SIZES.fontSm,
        fontWeight: '600',
    },
    controls: {
        marginTop: SIZES.sm,
        paddingTop: SIZES.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    controlsLabel: {
        fontSize: SIZES.fontSm,
        color: COLORS.textSecondary,
        marginBottom: SIZES.xs,
    },
    controlsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SIZES.xs,
    },
    controlChip: {
        backgroundColor: COLORS.gray[100],
        paddingHorizontal: SIZES.sm,
        paddingVertical: 4,
        borderRadius: SIZES.radiusSm,
    },
    controlChipText: {
        fontSize: 12,
        color: COLORS.gray[700],
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.xl,
    },
    emptyTitle: {
        fontSize: SIZES.fontXl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SIZES.md,
        marginBottom: SIZES.sm,
    },
    emptyText: {
        fontSize: SIZES.fontMd,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});
