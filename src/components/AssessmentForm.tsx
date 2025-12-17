import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import type { AssessmentData } from '../types';

interface AssessmentFormProps {
    onSubmit: (data: Omit<AssessmentData, 'id' | 'timestamp'>) => void;
    onBack: () => void;
}

export function AssessmentForm({ onSubmit, onBack }: AssessmentFormProps) {
    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        employeeCount: '',
        hasFirewall: false,
        hasAntivirus: false,
        hasBackup: false,
        hasTraining: false,
        hasIncidentResponse: false,
        hasAccessControl: false,
        hasEncryption: false,
        hasMonitoring: false,
        updateFrequency: '',
        dataClassification: '',
        cloudUsage: '',
    });

    const handleSubmit = () => {
        if (formData.companyName && formData.industry) {
            onSubmit(formData);
        }
    };

    const toggleSwitch = (field: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: !prev[field as keyof typeof prev],
        }));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Avaliação de Segurança Cibernética</Text>
                    <Text style={styles.subtitle}>
                        Preencha o formulário abaixo para análise completa dos riscos cibernéticos
                    </Text>
                </View>

                {/* Informações da Empresa */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏢 Informações da Empresa</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome da Empresa *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.companyName}
                            onChangeText={(text) => setFormData({ ...formData, companyName: text })}
                            placeholder="Digite o nome da empresa"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Setor *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.industry}
                                onValueChange={(value) => setFormData({ ...formData, industry: value })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Selecione..." value="" />
                                <Picker.Item label="Tecnologia" value="tecnologia" />
                                <Picker.Item label="Financeiro" value="financeiro" />
                                <Picker.Item label="Saúde" value="saude" />
                                <Picker.Item label="Varejo" value="varejo" />
                                <Picker.Item label="Manufatura" value="manufatura" />
                                <Picker.Item label="Educação" value="educacao" />
                                <Picker.Item label="Governo" value="governo" />
                                <Picker.Item label="Outro" value="outro" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Número de Funcionários</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.employeeCount}
                                onValueChange={(value) => setFormData({ ...formData, employeeCount: value })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Selecione..." value="" />
                                <Picker.Item label="1-10" value="1-10" />
                                <Picker.Item label="11-50" value="11-50" />
                                <Picker.Item label="51-200" value="51-200" />
                                <Picker.Item label="201-500" value="201-500" />
                                <Picker.Item label="500+" value="500+" />
                            </Picker>
                        </View>
                    </View>
                </View>

                {/* Controles de Segurança */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🛡️ Controles de Segurança</Text>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Firewall Corporativo</Text>
                        <Switch
                            value={formData.hasFirewall}
                            onValueChange={() => toggleSwitch('hasFirewall')}
                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                            thumbColor={formData.hasFirewall ? '#2563EB' : '#F3F4F6'}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Antivírus/Antimalware</Text>
                        <Switch
                            value={formData.hasAntivirus}
                            onValueChange={() => toggleSwitch('hasAntivirus')}
                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                            thumbColor={formData.hasAntivirus ? '#2563EB' : '#F3F4F6'}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Backup Regular</Text>
                        <Switch
                            value={formData.hasBackup}
                            onValueChange={() => toggleSwitch('hasBackup')}
                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                            thumbColor={formData.hasBackup ? '#2563EB' : '#F3F4F6'}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Treinamento em Segurança</Text>
                        <Switch
                            value={formData.hasTraining}
                            onValueChange={() => toggleSwitch('hasTraining')}
                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                            thumbColor={formData.hasTraining ? '#2563EB' : '#F3F4F6'}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Plano de Resposta a Incidentes</Text>
                        <Switch
                            value={formData.hasIncidentResponse}
                            onValueChange={() => toggleSwitch('hasIncidentResponse')}
                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                            thumbColor={formData.hasIncidentResponse ? '#2563EB' : '#F3F4F6'}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Controle de Acesso</Text>
                        <Switch
                            value={formData.hasAccessControl}
                            onValueChange={() => toggleSwitch('hasAccessControl')}
                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                            thumbColor={formData.hasAccessControl ? '#2563EB' : '#F3F4F6'}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Criptografia de Dados</Text>
                        <Switch
                            value={formData.hasEncryption}
                            onValueChange={() => toggleSwitch('hasEncryption')}
                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                            thumbColor={formData.hasEncryption ? '#2563EB' : '#F3F4F6'}
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Monitoramento de Segurança</Text>
                        <Switch
                            value={formData.hasMonitoring}
                            onValueChange={() => toggleSwitch('hasMonitoring')}
                            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                            thumbColor={formData.hasMonitoring ? '#2563EB' : '#F3F4F6'}
                        />
                    </View>
                </View>

                {/* Políticas e Práticas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📋 Políticas e Práticas</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Frequência de Atualizações</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.updateFrequency}
                                onValueChange={(value) => setFormData({ ...formData, updateFrequency: value })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Selecione..." value="" />
                                <Picker.Item label="Automático/Diário" value="automatico" />
                                <Picker.Item label="Semanal" value="semanal" />
                                <Picker.Item label="Mensal" value="mensal" />
                                <Picker.Item label="Trimestral" value="trimestral" />
                                <Picker.Item label="Irregular" value="irregular" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Classificação de Dados</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.dataClassification}
                                onValueChange={(value) => setFormData({ ...formData, dataClassification: value })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Selecione..." value="" />
                                <Picker.Item label="Formal e Documentada" value="formal" />
                                <Picker.Item label="Informal" value="informal" />
                                <Picker.Item label="Nenhuma" value="nenhum" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Uso de Nuvem</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={formData.cloudUsage}
                                onValueChange={(value) => setFormData({ ...formData, cloudUsage: value })}
                                style={styles.picker}
                            >
                                <Picker.Item label="Selecione..." value="" />
                                <Picker.Item label="Extensivo" value="extensivo" />
                                <Picker.Item label="Moderado" value="moderado" />
                                <Picker.Item label="Mínimo" value="minimo" />
                                <Picker.Item label="Nenhum" value="nenhum" />
                            </Picker>
                        </View>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={onBack}>
                        <Text style={styles.secondaryButtonText}>Voltar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                        <Text style={styles.primaryButtonText}>Enviar Avaliação</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
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
    pickerContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    switchLabel: {
        fontSize: 16,
        color: '#374151',
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
        marginBottom: 40,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#2563EB',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
});
