import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false // Evita que a senha venha em consultas comuns por segurança
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);