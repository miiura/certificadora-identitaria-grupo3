import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Blacklist from '../models/Blacklist.js';

// Função auxiliar para extrair o token do cabeçalho
const extrairToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return null;
};

export const registrar = async (req, res) => {
    try {
        // 1. Agora esperamos name e cpf também
        const { name, email, cpf, password, role } = req.body;

        // 2. Validação para garantir que nada venha vazio
        if (!name || !email || !cpf || !password) {
            return res.status(400).json({ erro: 'Por favor, preencha nome, email, cpf, senha e cargo.' });
        }

        // 🧹 LIMPEZA DO CPF: Remove tudo que NÃO for número
        const cpfLimpo = cpf.replace(/\D/g, '');

        // Validar se o CPF tem exatamente 11 dígitos após limpar
        if (cpfLimpo.length !== 11) {
            return res.status(400).json({ erro: 'CPF inválido. Deve conter 11 números.' });
        }

        // 3. Verifica se o E-mail ou o CPF já existem no banco
        console.log("🕵️ BUSCA INICIADA. Procurando por Email:", email, "ou CPF:", cpfLimpo);

        const usuarioExistente = await User.findOne({
            $or: [
                { email: email },
                { cpf: cpfLimpo }
            ]
        });

        console.log("🕵️ RESULTADO DA BUSCA:", usuarioExistente);

        if (usuarioExistente) {
            return res.status(400).json({ erro: 'E-mail ou CPF já cadastrado no sistema.' });
        }

        // 4. Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Cria o usuário
        const novoUsuario = await User.create({
            name,
            email,
            cpf: cpfLimpo,
            password: hashedPassword,
            role: role || 'VOLUNTARIO' // Se não enviarem o tipo, vira voluntário por padrão
        });

        // Remove a senha do objeto de resposta por segurança
        novoUsuario.password = undefined;

        res.status(201).json({
            mensagem: 'Usuário criado com sucesso! O voluntário já pode fazer login para completar o perfil.',
            usuario: novoUsuario
        });

    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: erro.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca o usuário e pede para o Mongoose trazer a senha (que ocultamos no Model)
        const usuario = await User.findOne({ email }).select('+password');
        if (!usuario) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        // Compara a senha digitada com o hash salvo no banco
        const senhaValida = await bcrypt.compare(password, usuario.password);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        // Gera o Token JWT válido por 2 horas
        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: { id: usuario._id, email: usuario.email }
        });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro interno no servidor ao realizar login.' });
    }
};

export const logout = async (req, res) => {
    try {
        const token = extrairToken(req);

        if (!token) {
            return res.status(400).json({ erro: 'Token não fornecido.' });
        }

        // Adiciona o token à Blacklist
        const tokenBloqueado = new Blacklist({ token });
        await tokenBloqueado.save();

        res.status(200).json({ mensagem: 'Logout realizado com sucesso. Token invalidado.' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro interno no servidor ao realizar logout.' });
    }
};
