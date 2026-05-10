db = db.getSiblingDB('ellp_db');

// Criação da coleção de usuários (opcional, pois o Mongoose fará isso)
db.createCollection('users');

// Criação da coleção de blacklist com índice TTL
// O documento deve ter um campo 'createdAt'
db.blacklists.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 7200 }); // Expira em 2 horas (mesmo tempo do JWT)

console.log('Banco de dados ellp_db inicializado com sucesso!');