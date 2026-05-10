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
        const { email, password } = req.body;

        // Verifica se o usuário já existe
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ erro: 'E-mail já cadastrado.' });
        }

        // Criptografa a senha (o número 10 é o "salt", nível de complexidade do hash)
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(password, salt);

        // Cria e salva o novo usuário
        const novoUsuario = new User({
            email,
            password: senhaCriptografada
        });

        await novoUsuario.save();

        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro interno no servidor ao registrar usuário.' });
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