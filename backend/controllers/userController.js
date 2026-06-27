import User from '../models/User.js';

// Converts "DD/MM/AAAA" to a Date object
const parseDate = (str) => {
    if (!str) return undefined;
    const parts = str.split('/');
    if (parts.length === 3) {
        const [d, m, y] = parts;
        return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
    }
    return new Date(str);
};

// Formats a Date to "MM/YYYY" (for periodStart / periodEnd)
const formatMonthYear = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    return `${mm}/${d.getUTCFullYear()}`;
};

// Parses "MM/YYYY" to a Date (day 1)
const parseMonthYear = (str) => {
    if (!str) return null;
    const [mm, yyyy] = str.split('/');
    if (!mm || !yyyy) return null;
    return new Date(`${yyyy}-${mm.padStart(2, '0')}-01`);
};

// Formats a Date object back to "DD/MM/AAAA"
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = d.getUTCFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

// Flattens the nested Mongoose document into the flat shape the frontend expects
const flattenUser = (usuario) => {
    const vd = usuario.volunteerData || {};
    const addr = vd.address || {};
    return {
        id: usuario._id,
        name: usuario.name,
        email: usuario.email,
        cpf: usuario.cpf,
        phone: usuario.phone || '',
        role: usuario.role,
        status: usuario.status || 'active',
        birthdate: vd.birthDate ? formatDate(vd.birthDate) : '',
        nationality: vd.nationality || '',
        bond: usuario.role === 'VOLUNTARIO' ? (vd.isUtfprStudent ? 'DISCENTE' : 'EGRESSO') : '',
        course: vd.course || '',
        period: vd.period || '',
        ra: vd.ra || '',
        address: addr.street || '',
        city: addr.city || '',
        state: addr.state || '',
        activities: vd.activities || [],
        periodStart: vd.periodStart ? formatMonthYear(vd.periodStart) : '',
        periodEnd: vd.periodEnd ? formatMonthYear(vd.periodEnd) : '',
        schedule: vd.schedule || [],
    };
};

// GET /api/users/coordinators — list only COORDENADOR users (ADMIN only)
export const listarCoordenadores = async (req, res) => {
    try {
        const coordenadores = await User.find({ role: 'COORDENADOR' }, '_id name email');
        res.status(200).json({ coordenadores });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao listar coordenadores.', detalhes: erro.message });
    }
};

// GET /api/users — list all users (ADMIN / COORDENADOR only)
export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find();
        res.status(200).json({ usuarios: usuarios.map(flattenUser) });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao listar usuários.', detalhes: erro.message });
    }
};

// GET /api/users/:id
export const obterUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const isOwner = req.usuario._id.toString() === id;
        const isAdmin = req.usuario.role === 'ADMIN';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ erro: 'Acesso negado.' });
        }

        const usuario = await User.findById(id);
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

        res.status(200).json({ usuario: flattenUser(usuario) });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro interno ao buscar usuário.', detalhes: erro.message });
    }
};

// PATCH /api/users/:id
export const atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioLogado = req.usuario;

        const isOwner = usuarioLogado._id.toString() === id;
        const isAdmin = usuarioLogado.role === 'ADMIN';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                erro: 'Acesso negado. Você não tem permissão para alterar o perfil de outro usuário.'
            });
        }

        const usuario = await User.findById(id);
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

        const { name, phone, email, role, birthdate, nationality, bond, course, period, ra, address, city, state, activities, periodStart, periodEnd, schedule } = req.body;

        // Top-level fields any authenticated owner or admin can update
        if (name !== undefined) usuario.name = name;
        if (phone !== undefined) usuario.phone = phone;
        if (email !== undefined) usuario.email = email;

        // Privilege escalation guard: only ADMIN can change role
        if (role !== undefined && isAdmin) {
            usuario.role = role;
        }

        // Personal data — applicable to all roles
        if (!usuario.volunteerData) usuario.volunteerData = {};

        if (birthdate !== undefined) usuario.volunteerData.birthDate = parseDate(birthdate);
        if (nationality !== undefined) usuario.volunteerData.nationality = nationality;

        if (!usuario.volunteerData.address) usuario.volunteerData.address = {};
        if (address !== undefined) usuario.volunteerData.address.street = address;
        if (city !== undefined) usuario.volunteerData.address.city = city;
        if (state !== undefined) usuario.volunteerData.address.state = state;

        // Academic and work plan fields — VOLUNTARIO only
        if (usuario.role === 'VOLUNTARIO') {
            if (bond !== undefined) usuario.volunteerData.isUtfprStudent = bond === 'DISCENTE' || bond === 'DOCENTE';
            if (course !== undefined) usuario.volunteerData.course = course;
            if (period !== undefined) usuario.volunteerData.period = period;
            if (ra !== undefined) usuario.volunteerData.ra = ra;
            if (activities !== undefined) usuario.volunteerData.activities = activities;
            if (periodStart !== undefined) usuario.volunteerData.periodStart = parseMonthYear(periodStart);
            if (periodEnd !== undefined) usuario.volunteerData.periodEnd = parseMonthYear(periodEnd);
            if (schedule !== undefined) usuario.volunteerData.schedule = schedule;
        }

        // Required so Mongoose detects changes to the nested object
        usuario.markModified('volunteerData');

        await usuario.save();
        usuario.password = undefined;

        res.status(200).json({
            mensagem: 'Perfil atualizado com sucesso!',
            usuario: flattenUser(usuario)
        });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar perfil.', detalhes: erro.message });
    }
};

// DELETE /api/users/:id — ADMIN only
export const excluirUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ erro: 'Usuário não encontrado.' });
        res.status(200).json({ mensagem: 'Usuário excluído com sucesso.' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao excluir usuário.', detalhes: erro.message });
    }
};
