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
            activityIndex: { type: Number },
            months: [{ type: Number }]
        }]
    },

    // ==========================================
    // Dados de Coordenador
    // ==========================================
    coordinatorData: {
        department: String
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;