import Action from '../models/Action.js';

export const obterAction = async (req, res) => {
    try {
        const action = await Action.findOne();
        if (!action) return res.status(404).json({ erro: 'Nenhum registro de ação encontrado.' });
        res.status(200).json({ action });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar dados da ação.', detalhes: erro.message });
    }
};

export const atualizarAction = async (req, res) => {
    try {
        const { title, modality, validity } = req.body;

        let action = await Action.findOne();

        if (!action) {
            // First-time creation (seed may not have run yet)
            action = new Action({ title, modality, validity });
        } else {
            if (title !== undefined) action.title = title;
            if (modality !== undefined) action.modality = modality;
            if (validity !== undefined) {
                action.validity = validity;
                action.markModified('validity');
            }
        }

        await action.save();
        res.status(200).json({ mensagem: 'Dados da ação atualizados com sucesso.', action });
    } catch (erro) {
        if (erro.name === 'ValidationError') {
            const msgs = Object.values(erro.errors).map(e => e.message).join(' ');
            return res.status(400).json({ erro: msgs });
        }
        res.status(500).json({ erro: 'Erro ao atualizar dados da ação.', detalhes: erro.message });
    }
};
