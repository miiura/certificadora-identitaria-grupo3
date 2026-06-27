import mongoose from 'mongoose';

// Converts "MM/YYYY" → integer YYYYMM for chronological comparison
const toYYYYMM = (str) => {
    if (!str || !str.includes('/')) return null;
    const [mm, yyyy] = str.split('/');
    const m = parseInt(mm, 10);
    const y = parseInt(yyyy, 10);
    if (isNaN(m) || isNaN(y) || m < 1 || m > 12) return null;
    return y * 100 + m;
};

const actionSchema = new mongoose.Schema({
    coordinator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    title: {
        type: String,
        required: [true, 'O título da ação é obrigatório.'],
        trim: true,
    },
    modality: {
        type: String,
        required: [true, 'A modalidade é obrigatória.'],
        enum: {
            values: ['Programa', 'Projeto', 'Evento', 'Curso'],
            message: 'Modalidade inválida: {VALUE}.',
        },
    },
    validity: {
        start: {
            type: String,
            required: [true, 'A data de início da vigência é obrigatória.'],
            match: [/^\d{2}\/\d{4}$/, 'Formato de data inválido. Use MM/AAAA.'],
        },
        end: {
            type: String,
            required: [true, 'A data de fim da vigência é obrigatória.'],
            match: [/^\d{2}\/\d{4}$/, 'Formato de data inválido. Use MM/AAAA.'],
            validate: {
                validator: function (val) {
                    const s = toYYYYMM(this.validity.start);
                    const e = toYYYYMM(val);
                    return s !== null && e !== null && e >= s;
                },
                message: 'A data de fim deve ser maior ou igual à data de início.',
            },
        },
    },
}, { timestamps: true });

// Singleton: prevent creating a second document
actionSchema.pre('save', async function () {
    if (this.isNew) {
        const count = await mongoose.model('Action').countDocuments();
        if (count > 0) {
            throw new Error('Já existe um registro de ação. Use a rota de atualização.');
        }
    }
});

export default mongoose.model('Action', actionSchema);
