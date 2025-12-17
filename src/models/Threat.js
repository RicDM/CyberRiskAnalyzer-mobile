const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Título é obrigatório'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Descrição é obrigatória'],
        trim: true
    },
    severity: {
        type: String,
        required: true,
        enum: ['Baixa', 'Média', 'Alta', 'Crítica'],
        default: 'Média'
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Malware',
            'Phishing',
            'Ransomware',
            'DDoS',
            'SQL Injection',
            'XSS',
            'Engenharia Social',
            'Vazamento de Dados',
            'Outro'
        ],
        default: 'Outro'
    },
    affectedSystems: [{
        type: String
    }],
    mitigation: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    reportedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

threatSchema.index({ severity: 1, isActive: 1 });
threatSchema.index({ category: 1 });

module.exports = mongoose.model('Threat', threatSchema);
