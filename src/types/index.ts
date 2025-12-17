export interface AssessmentData {
    id: string;
    timestamp: Date;
    companyName: string;
    industry: string;
    employeeCount: string;
    hasFirewall: boolean;
    hasAntivirus: boolean;
    hasBackup: boolean;
    hasTraining: boolean;
    hasIncidentResponse: boolean;
    hasAccessControl: boolean;
    hasEncryption: boolean;
    hasMonitoring: boolean;
    updateFrequency: string;
    dataClassification: string;
    cloudUsage: string;
}

export interface RiskAnalysis {
    overallScore: number;
    riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
    threats: Array<{ type: string; probability: number; impact: number }>;
    vulnerabilities: Array<{ area: string; severity: string; description: string }>;
    recommendations: Array<{ priority: string; action: string }>;
}

export type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
    Assessment: undefined;
    Correlation: undefined;
};
