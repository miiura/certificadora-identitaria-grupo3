import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet'; // 🛡️ Importação do Helmet
import mongoSanitize from 'express-mongo-sanitize'; // 🛡️ Importação do Mongo Sanitize
import xss from 'xss-clean'; // 🛡️ Importação do XSS Clean
import { setupSwagger } from './config/swagger.js'; // 📄 Importação do Swagger
import { seedAdmin } from './config/seed.js'; // Importação do Seed para criação do usuário admin

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import actionRoutes from './routes/actionRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// Configuração de Rate Limiting (Segurança)
// ==========================================

// 1. Limite Global (Prevenção de ataques DoS genéricos)
const limiterGeral = rateLimit({
    windowMs: 1 * 60 * 1000, // Janela de 1 minuto
    max: 100, // Limita cada IP a 100 requisições por janela
    message: 'Muitas requisições vindas deste IP, tente novamente mais tarde.'
});
app.use(limiterGeral);

// 2. Limite Estratégico para Autenticação (Prevenção de Brute Force)
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 20, // 20 tentativas de login/registro por IP a cada 1 min
    message: {
        erro: 'Muitas tentativas de login/registro. Por segurança, este IP foi bloqueado por 1 minuto.'
    },
    standardHeaders: true, // Retorna informações de limite nos headers
    legacyHeaders: false,
});

// ==========================================
// Middlewares de Segurança Global
// ==========================================

// 1. Proteção de Cabeçalhos HTTP
app.use(helmet());

// Middlewares padrão
app.use(cors());
app.use(express.json());

// 2. Sanitização de Dados contra NoSQL Injection
// Verifica req.body, req.query e req.params e remove chaves com '$' ou '.'
app.use(mongoSanitize());

// 3. Sanitização de Dados contra ataques XSS
// Converte tags maliciosas em texto seguro antes de salvar no banco
app.use(xss());

// Aplicando rate limiter nas rotas de autenticação
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 📄 Inicia a rota da Documentação do Swagger
setupSwagger(app);


// ==========================================
// Conexão com o Banco de Dados (com Connection Pool)
// ==========================================
mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10, // Tamanho Máximo: Limita a 10 conexões simultâneas. Se chegarem 11 requisições, a 11ª entra na fila.
    minPoolSize: 2,  // Tamanho Mínimo: Mantém 2 conexões sempre ativas, mesmo de madrugada sem acessos.
    serverSelectionTimeoutMS: 5000, // Tempo de Espera: Se o banco cair, espera no máximo 5 segundos antes de dar erro (não deixa o usuário travado eternamente).
    socketTimeoutMS: 45000, // Timeout de inatividade: Encerra conexões ociosas ou consultas muito lentas após 45 segundos.
})
    .then(() => {
        console.log('📦 Conectado ao MongoDB do Portal ELLP com sucesso!');
        seedAdmin(); // Chama a criação do usuário padrão
    })
    .catch((erro) => console.error('❌ Erro ao conectar ao MongoDB:', erro));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/action', actionRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor ELLP rodando com segurança ativada! 🚀🛡️');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});