import Action from '../models/Action.js';

export const obterAction = async (req, res) => {
    try {
        const action = await Action.findOne().populate('coordinator', '_id name email cpf phone coordinatorData');
        if (!action) return res.status(404).json({ erro: 'Nenhum registro de ação encontrado.' });
        res.status(200).json({ action });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar dados da ação.', detalhes: erro.message });
    }
};

export const atualizarAction = async (req, res) => {
    try {
        const { title, modality, validity, coordinator } = req.body;

        let action = await Action.findOne();

        if (!action) {
            // First-time creation (seed may not have run yet)
            action = new Action({ title, modality, validity, coordinator: coordinator || null });
        } else {
            if (title !== undefined) action.title = title;
            if (modality !== undefined) action.modality = modality;
            if (validity !== undefined) {
                action.validity = validity;
                action.markModified('validity');
            }
            if (coordinator !== undefined) action.coordinator = coordinator || null;
        }

        await action.save();
        await action.populate('coordinator', '_id name email cpf phone coordinatorData');
        res.status(200).json({ mensagem: 'Dados da ação atualizados com sucesso.', action });
    } catch (erro) {
        if (erro.name === 'ValidationError') {
            const msgs = Object.values(erro.errors).map(e => e.message).join(' ');
            return res.status(400).json({ erro: msgs });
        }
        res.status(500).json({ erro: 'Erro ao atualizar dados da ação.', detalhes: erro.message });
    }
};
