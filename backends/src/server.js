require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const assessmentsRoutes = require('./routes/assessments');
const threatsRoutes = require('./routes/threats');

connectDB();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        message: '🛡️ CyberRisk Analyzer API',
        version: '1.0.0',
        status: 'online',
        endpoints: {
            auth: '/api/auth',
            assessments: '/api/assessments',
            threats: '/api/threats'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/threats', threatsRoutes);

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

app.use((err, req, res, next) => {
    console.error('Erro:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 API disponível em: http://localhost:${PORT}/api`);
});

module.exports = app;
