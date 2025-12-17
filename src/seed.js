require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Threat = require('./models/Threat');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB conectado');
    } catch (error) {
        console.error('❌ Erro ao conectar MongoDB:', error);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🗑️  Limpando dados existentes...');
        await User.deleteMany({});
        await Threat.deleteMany({});

        console.log('👤 Criando usuário admin...');
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@cyberrisk.com',
            password: 'admin123',
            role: 'admin',
            company: 'CyberRisk Analyzer',
            position: 'Administrador'
        });
        console.log('✅ Admin criado:', admin.email);

        console.log('👤 Criando usuário teste...');
        const user = await User.create({
            name: 'João Silva',
            email: 'joao@example.com',
            password: '123456',
            company: 'Tech Solutions',
            position: 'Analista de TI'
        });
        console.log('✅ Usuário criado:', user.email);

        console.log('⚠️  Criando ameaças...');
        const threats = await Threat.insertMany([
            {
                title: 'Ransomware WannaCry',
                description: 'Ransomware que criptografa arquivos e exige pagamento em Bitcoin.',
                severity: 'Crítica',
                category: 'Ransomware',
                affectedSystems: ['Windows', 'Servidores'],
                mitigation: 'Manter sistemas atualizados, backups regulares, não abrir anexos suspeitos.'
            },
            {
                title: 'Phishing por Email',
                description: 'Emails fraudulentos tentando roubar credenciais de acesso.',
                severity: 'Alta',
                category: 'Phishing',
                affectedSystems: ['Email', 'Webmail'],
                mitigation: 'Treinamento de funcionários, filtros de spam, autenticação multifator.'
            },
            {
                title: 'Ataque DDoS',
                description: 'Sobrecarga de servidores com tráfego malicioso.',
                severity: 'Alta',
                category: 'DDoS',
                affectedSystems: ['Servidores Web', 'APIs'],
                mitigation: 'CDN, firewall de aplicação web, monitoramento de tráfego.'
            },
            {
                title: 'SQL Injection',
                description: 'Inserção de código SQL malicioso em formulários web.',
                severity: 'Crítica',
                category: 'SQL Injection',
                affectedSystems: ['Banco de Dados', 'Aplicações Web'],
                mitigation: 'Validação de entrada, prepared statements, WAF.'
            },
            {
                title: 'Malware Trojan',
                description: 'Software malicioso disfarçado como programa legítimo.',
                severity: 'Alta',
                category: 'Malware',
                affectedSystems: ['Desktops', 'Notebooks'],
                mitigation: 'Antivírus atualizado, não baixar arquivos de fontes não confiáveis.'
            },
            {
                title: 'Engenharia Social',
                description: 'Manipulação psicológica para obter informações confidenciais.',
                severity: 'Média',
                category: 'Engenharia Social',
                affectedSystems: ['Usuários'],
                mitigation: 'Treinamento constante, políticas de segurança claras.'
            },
            {
                title: 'Vazamento de Dados',
                description: 'Exposição não autorizada de dados sensíveis.',
                severity: 'Crítica',
                category: 'Vazamento de Dados',
                affectedSystems: ['Banco de Dados', 'Servidores'],
                mitigation: 'Criptografia, controle de acesso, monitoramento de logs.'
            },
            {
                title: 'XSS (Cross-Site Scripting)',
                description: 'Injeção de scripts maliciosos em páginas web.',
                severity: 'Média',
                category: 'XSS',
                affectedSystems: ['Aplicações Web'],
                mitigation: 'Sanitização de entrada, Content Security Policy.'
            }
        ]);
        console.log(`✅ ${threats.length} ameaças criadas`);

        console.log('\n🎉 Seed completo!');
        console.log('\n📝 Credenciais de acesso:');
        console.log('Admin: admin@cyberrisk.com / admin123');
        console.log('Usuário: joao@example.com / 123456');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro no seed:', error);
        process.exit(1);
    }
};

seedDatabase();
