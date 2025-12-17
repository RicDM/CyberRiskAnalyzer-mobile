const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Assessment = require('../models/Assessment');
const authMiddleware = require('../middleware/auth');

const calculateRiskScore = (assessment) => {
    const questions = [
        'hasFirewall', 'hasAntivirus', 'hasBackup', 'hasTraining',
        'hasIncidentPlan', 'hasPasswordPolicy', 'hasTwoFactorAuth',
        'hasDataEncryption', 'hasAccessControl', 'hasSecurityAudit'
    ];

    const positiveAnswers = questions.filter(q => assessment[q]).length;
    const riskScore = ((10 - positiveAnswers) / 10) * 100;

    return Math.round(riskScore);
};

const getRiskLevel = (score) => {
    if (score >= 70) return 'Crítico';
    if (score >= 50) return 'Alto';
    if (score >= 30) return 'Médio';
    return 'Baixo';
};

const generateRecommendations = (assessment) => {
    const recommendations = [];

    if (!assessment.hasFirewall) {
        recommendations.push('Instalar e configurar firewall corporativo');
    }
    if (!assessment.hasAntivirus) {
        recommendations.push('Implementar solução antivírus em todos os dispositivos');
    }
    if (!assessment.hasBackup) {
        recommendations.push('Estabelecer política de backup regular (3-2-1 rule)');
    }
    if (!assessment.hasTraining) {
        recommendations.push('Realizar treinamentos de segurança para funcionários');
    }
    if (!assessment.hasIncidentPlan) {
        recommendations.push('Criar plano de resposta a incidentes');
    }
    if (!assessment.hasPasswordPolicy) {
        recommendations.push('Implementar política de senhas fortes');
    }
    if (!assessment.hasTwoFactorAuth) {
        recommendations.push('Habilitar autenticação de dois fatores (2FA)');
    }
    if (!assessment.hasDataEncryption) {
        recommendations.push('Implementar criptografia de dados sensíveis');
    }
    if (!assessment.hasAccessControl) {
        recommendations.push('Estabelecer controles de acesso baseados em função');
    }
    if (!assessment.hasSecurityAudit) {
        recommendations.push('Realizar auditorias de segurança periódicas');
    }

    return recommendations;
};

router.post('/', authMiddleware, [
    body('companyName').trim().notEmpty().withMessage('Nome da empresa é obrigatório'),
    body('sector').notEmpty().withMessage('Setor é obrigatório'),
    body('employeesCount').notEmpty().withMessage('Quantidade de funcionários é obrigatória')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const riskScore = calculateRiskScore(req.body);
        const riskLevel = getRiskLevel(riskScore);
        const recommendations = generateRecommendations(req.body);

        const assessment = new Assessment({
            ...req.body,
            userId: req.user._id,
            riskScore,
            riskLevel,
            recommendations
        });

        await assessment.save();

        res.status(201).json({
            success: true,
            message: 'Avaliação criada com sucesso!',
            data: assessment
        });
    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar avaliação.',
            error: error.message
        });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

        const assessments = await Assessment.find({ userId: req.user._id })
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Assessment.countDocuments({ userId: req.user._id });

        res.json({
            success: true,
            data: assessments,
            pagination: {
                total: count,
                page: parseInt(page),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar avaliações.',
            error: error.message
        });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const assessment = await Assessment.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Avaliação não encontrada.'
            });
        }

        res.json({
            success: true,
            data: assessment
        });
    } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar avaliação.',
            error: error.message
        });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const assessment = await Assessment.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Avaliação não encontrada.'
            });
        }

        Object.assign(assessment, req.body);

        assessment.riskScore = calculateRiskScore(assessment);
        assessment.riskLevel = getRiskLevel(assessment.riskScore);
        assessment.recommendations = generateRecommendations(assessment);

        await assessment.save();

        res.json({
            success: true,
            message: 'Avaliação atualizada com sucesso!',
            data: assessment
        });
    } catch (error) {
        console.error('Erro ao atualizar avaliação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar avaliação.',
            error: error.message
        });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const assessment = await Assessment.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: 'Avaliação não encontrada.'
            });
        }

        res.json({
            success: true,
            message: 'Avaliação deletada com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao deletar avaliação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar avaliação.',
            error: error.message
        });
    }
});

router.get('/stats/summary', authMiddleware, async (req, res) => {
    try {
        const assessments = await Assessment.find({ userId: req.user._id });

        const stats = {
            total: assessments.length,
            byRiskLevel: {
                Baixo: assessments.filter(a => a.riskLevel === 'Baixo').length,
                Médio: assessments.filter(a => a.riskLevel === 'Médio').length,
                Alto: assessments.filter(a => a.riskLevel === 'Alto').length,
                Crítico: assessments.filter(a => a.riskLevel === 'Crítico').length
            },
            averageRiskScore: assessments.length > 0
                ? Math.round(assessments.reduce((sum, a) => sum + a.riskScore, 0) / assessments.length)
                : 0,
            latest: assessments.sort((a, b) => b.createdAt - a.createdAt)[0] || null
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar estatísticas.',
            error: error.message
        });
    }
});

module.exports = router;
