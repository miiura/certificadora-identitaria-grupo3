import mongoose from 'mongoose';

//Controle de Usuário offline, caso deslogue, deixa o token em uma blacklist para não ser usado, evitando vunerabilidades
const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7200 // 2 horas
    }
});

export default mongoose.model('Blacklist', blacklistSchema);
