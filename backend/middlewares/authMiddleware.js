import jwt from 'jsonwebtoken';
import Blacklist from '../models/Blacklist.js';
import User from '../models/User.js';

export const verificarToken = async (req, res, next) => {
    try {
        // 1. Captura o cabeçalho de autorização da requisição
        const authHeader = req.headers.authorization;

        // Verifica se o cabeçalho existe e segue o padrão "Bearer <token>"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
        }

        // Extrai apenas o token da string
        const token = authHeader.split(' ')[1];

        // 2. Verifica se o token está na Blacklist (caso o usuário tenha feito logout manual)
        const tokenBloqueado = await Blacklist.findOne({ token });
        if (tokenBloqueado) {
            return res.status(401).json({ erro: 'Sessão encerrada. Por favor, faça login novamente.' });
        }

        // 3. Verifica a autenticidade e validade do token com o JWT_SECRET
        // Se o token estiver expirado ou foi adulterado, isso vai disparar um erro e cair no catch
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Sucesso! Busca o usuário completo no banco e anexa na requisição
        // Usamos .select('-password') para não trazer a senha junto, por segurança.
        req.usuario = await User.findById(decodificado.id).select('-password');

        if (!req.usuario) {
            return res.status(401).json({ erro: 'Usuário não encontrado ou foi excluído.' });
        }

        // O next() avisa o Express: "Tudo certo aqui, pode continuar para a rota final!"
        next();
    } catch (erro) {
        console.error("🕵️ Erro capturado no middleware de autenticação:", erro);
        // O erro 'TokenExpiredError' é específico do jsonwebtoken quando o tempo acaba
        if (erro.name === 'TokenExpiredError') {
            return res.status(401).json({ erro: 'Sessão expirada. Faça login novamente.' });
        }

        // Qualquer outro erro (como token malformado ou assinatura incorreta)
        return res.status(401).json({ erro: 'Token inválido.' });
    }
};


export const verificarPermissao = (rolesPermitidos) => {
    return (req, res, next) => {
        // O req.usuario é injetado pela função verificarToken que roda antes desta
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.role)) {
            return res.status(403).json({
                erro: 'Acesso negado. Apenas Coordenadores ou Administradores podem realizar esta ação.'
            });
        }
        next(); // Se tiver permissão, deixa a requisição passar para o Controller
    };
};