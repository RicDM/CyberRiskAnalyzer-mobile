const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

router.post('/register', [
    body('name').trim().isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, password, company, position } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email já cadastrado.'
            });
        }

        const user = new User({
            name,
            email,
            password,
            company: company || '',
            position: position || ''
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso!',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Erro ao registrar:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao registrar usuário.',
            error: error.message
        });
    }
});

router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Conta desativada.'
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas.'
            });
        }

        const token = generateToken(user._id);

        user.password = undefined;

        res.json({
            success: true,
            message: 'Login realizado com sucesso!',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer login.',
            error: error.message
        });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        res.json({
            success: true,
            data: req.user
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar usuário.',
            error: error.message
        });
    }
});

router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, company, position, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, company, position, phone },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso!',
            data: user
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar perfil.',
            error: error.message
        });
    }
});

module.exports = router;
