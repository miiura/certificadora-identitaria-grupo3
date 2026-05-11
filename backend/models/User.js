import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    cpf: { type: String, required: true, unique: true },
    phone: { type: String },
    role: {
        type: String,
        enum: ['VOLUNTARIO', 'COORDENADOR', 'ADMIN'],
        default: 'VOLUNTARIO'
    },

    // ==========================================
    // Dados de Voluntário
    // ==========================================
    volunteerData: {
        type: {
            birthDate: Date,
            nationality: String,
            isUtfprStudent: Boolean,
            course: String,
            period: String,
            ra: String,
            address: {
                street: String,
                number: Number,
                additional: String,
                city: String,
                state: String,
                zipCode: String
            },

            // Array de Strings com a descrição de cada atividade
            activities: [{ type: String }],

            // Array de Objetos representando o cruzamento Atividade x Meses
            schedule: [{
                activityIndex: { type: Number }, // Ex: 1 (referente à primeira atividade)
                months: [{ type: Number }]       // Ex: [1, 2, 3] (Janeiro, Fevereiro, Março)
            }]
        },
        validate: {
            validator: function () {
                // Validação: Só aceita preencher se for VOLUNTARIO
                return this.role === 'VOLUNTARIO';
            },
            message: 'Dados de voluntário só podem ser preenchidos para usuários com role VOLUNTARIO.'
        }
    },

    // ==========================================
    // Dados de Coordenador
    // ==========================================
    coordinatorData: {
        type: {
            department: String
        },
        validate: {
            validator: function () {
                return this.role === 'COORDENADOR';
            },
            message: 'Dados de coordenador só podem ser preenchidos para usuários com role COORDENADOR.'
        }
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;