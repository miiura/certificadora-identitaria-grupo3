import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors()); // Permite que o Frontend em outra porta faça requisições
app.use(express.json()); // Diz ao Express para entender respostas em JSON

// Conexão com o Banco de Dados MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('📦 Conectado ao MongoDB do Portal ELLP com sucesso!'))
    .catch((erro) => console.error('❌ Erro ao conectar ao MongoDB:', erro));

// Rotas da API
app.use('/api/auth', authRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor ELLP rodando com Banco de Dados conectado! 🚀');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});