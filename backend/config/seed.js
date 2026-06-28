import User from '../models/User.js';
import Action from '../models/Action.js';
import bcrypt from 'bcryptjs';

export const seedAdmin = async () => {
    try {

        // ── Admin ─────────────────────────────────────────────────
        const adminExists = await User.findOne({ role: 'ADMIN' });
        if (adminExists) {
            console.log('✅ Usuário Admin já existe. Pulando a criação.');
        } else {
            await User.create({
                name: 'Administrador ELLP',
                email: 'admin@ellp.com',
                cpf: '00000000000',
                password: await bcrypt.hash('admin', 10),
                role: 'ADMIN',
            });
            console.log('🌱 Seed: Usuário Admin criado. (admin@ellp.com | senha: admin)');
        }

        // ── Coordenador ───────────────────────────────────────────
        let coordenador = await User.findOne({ email: 'coordenador@ellp.com' });
        if (coordenador) {
            console.log('✅ Usuário Coordenador já existe. Pulando a criação.');
        } else {
            coordenador = await User.create({
                name: 'Coordenador ELLP',
                email: 'coordenador@ellp.com',
                cpf: '00000000001',
                password: await bcrypt.hash('senha123', 10),
                role: 'COORDENADOR',
                phone: '43999999999',
                coordinatorData: {
                    department: 'DACOMP',
                },
            });
            console.log('🌱 Seed: Usuário Coordenador criado. (coordenador@ellp.com | senha: senha123)');
        }

        // ── Voluntário ────────────────────────────────────────────
        const voluntarioExists = await User.findOne({ email: 'voluntario@ellp.com' });
        if (voluntarioExists) {
            console.log('✅ Usuário Voluntário já existe. Pulando a criação.');
        } else {
            await User.create({
                name: 'Voluntário 1',
                email: 'voluntario@ellp.com',
                cpf: '00000000002',
                password: await bcrypt.hash('senha123', 10),
                role: 'VOLUNTARIO',
                phone: '43999999998',
                volunteerData: {
                    birthDate: new Date('1980-01-01'),
                    nationality: 'Brasileiro',
                    isUtfprStudent: true,
                    course: 'Engenharia de Software',
                    period: '2º Período',
                    ra: '1234567',
                    address: {
                        street: 'Rua Teste',
                        number: 70,
                        city: 'Cornélio Procópio',
                        state: 'PR',
                    },
                    activities: [
                        'Atividade 1 Teste',
                        'Atividade 2 Teste',
                        'Atividade 3 Teste',
                        'Atividade 4 Teste',
                    ],
                    periodStart: new Date('2026-01-01'),
                    periodEnd:   new Date('2026-12-01'),
                    schedule: [
                        { activityIndex: 0, months: [0, 1, 2]   },
                        { activityIndex: 1, months: [3, 4, 5]   },
                        { activityIndex: 2, months: [6, 7, 8]   },
                        { activityIndex: 3, months: [9, 10, 11] },
                    ],
                },
            });
            console.log('🌱 Seed: Usuário Voluntário criado. (voluntario@ellp.com | senha: senha123)');
        }

        // ── Ação (singleton) ──────────────────────────────────────
        await Action.deleteMany({});
        await Action.create({
            coordinator: coordenador._id,
            title: 'ELLP',
            modality: 'Projeto',
            validity: { start: '01/2026', end: '12/2026' },
        });
        console.log('🌱 Seed: Registro de Ação criado com sucesso!');

    } catch (erro) {
        console.error('❌ Erro ao tentar popular o banco de dados:', erro.message);
    }
};
