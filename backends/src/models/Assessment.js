const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: [true, 'Nome da empresa é obrigatório'],
        trim: true
    },
    sector: {
        type: String,
        required: [true, 'Setor é obrigatório'],
        enum: [
            'Tecnologia',
            'Finanças',
            'Saúde',
            'Educação',
            'Varejo',
            'Indústria',
            'Serviços',
            'Outro'
        ]
    },
    employeesCount: {
        type: String,
        required: [true, 'Quantidade de funcionários é obrigatória'],
        enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    },

    hasFirewall: {
        type: Boolean,
        required: true
    },
    hasAntivirus: {
        type: Boolean,
        required: true
    },
    hasBackup: {
        type: Boolean,
        required: true
    },
    hasTraining: {
        type: Boolean,
        required: true
    },
    hasIncidentPlan: {
        type: Boolean,
        required: true
    },
    hasPasswordPolicy: {
        type: Boolean,
        required: true
    },
    hasTwoFactorAuth: {
        type: Boolean,
        required: true
    },
    hasDataEncryption: {
        type: Boolean,
        required: true
    },
    hasAccessControl: {
        type: Boolean,
        required: true
    },
    hasSecurityAudit: {
        type: Boolean,
        required: true
    },

    riskScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    riskLevel: {
        type: String,
        required: true,
        enum: ['Baixo', 'Médio', 'Alto', 'Crítico']
    },
    recommendations: [{
        type: String
    }],

    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

assessmentSchema.index({ userId: 1, createdAt: -1 });
assessmentSchema.index({ riskLevel: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
