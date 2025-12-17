const express = require('express');
const router = express.Router();
const Threat = require('../models/Threat');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const { severity, category, isActive = true } = req.query;

        const filter = { isActive };

        if (severity) {
            filter.severity = severity;
        }
        if (category) {
            filter.category = category;
        }

        const threats = await Threat.find(filter)
            .sort({ severity: -1, reportedAt: -1 });

        res.json({
            success: true,
            data: threats
        });
    } catch (error) {
        console.error('Erro ao buscar ameaças:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar ameaças.',
            error: error.message
        });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const threat = await Threat.findById(req.params.id);

        if (!threat) {
            return res.status(404).json({
                success: false,
                message: 'Ameaça não encontrada.'
            });
        }

        res.json({
            success: true,
            data: threat
        });
    } catch (error) {
        console.error('Erro ao buscar ameaça:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar ameaça.',
            error: error.message
        });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado. Apenas administradores.'
            });
        }

        const threat = new Threat(req.body);
        await threat.save();

        res.status(201).json({
            success: true,
            message: 'Ameaça criada com sucesso!',
            data: threat
        });
    } catch (error) {
        console.error('Erro ao criar ameaça:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar ameaça.',
            error: error.message
        });
    }
});

module.exports = router;
