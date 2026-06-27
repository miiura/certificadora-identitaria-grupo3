//Arquivo que cria o usuário admin e o registro inicial da ação quando o banco de dados inicia.

import User from '../models/User.js';
import Action from '../models/Action.js';
import bcrypt from 'bcryptjs';

export const seedAdmin = async () => {
    try {
        // Verifica se já existe algum Admin no banco
        const adminExists = await User.findOne({ role: 'ADMIN' });

        if (adminExists) {
            console.log('✅ Usuário Admin já existe. Pulando a criação.');
        } else {
            // Se não existe, vamos criar a senha padrão
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin', salt);

            // Cria o registro no banco
            await User.create({
                name: 'Administrador ELLP',
                email: 'admin@ellp.com',
                cpf: '00000000000',
                password: hashedPassword,
                role: 'ADMIN'
            });

            console.log('🌱 Seed: Usuário Admin criado com sucesso! (Email: admin@ellp.com | Senha: admin)');
        }

        // Seed do registro único da Ação (Singleton)
        await Action.deleteMany({});
        await Action.create({
            title: 'ELLP',
            modality: 'Projeto',
            validity: { start: '01/2026', end: '12/2026' },
        });
        console.log('🌱 Seed: Registro de Ação criado com sucesso!');

    } catch (erro) {
        console.error('❌ Erro ao tentar popular o banco de dados:', erro.message);
    }
};
