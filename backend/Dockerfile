# Usa uma imagem oficial do Node.js bem leve (versão 20 Alpine)
FROM node:20-alpine

# Define a pasta de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de dependência primeiro (isso ajuda no cache do Docker)
COPY package*.json ./

# Instala todas as dependências (incluindo o nodemon que instalamos antes)
RUN npm install

# Copia o resto do código da sua máquina para dentro do contêiner
COPY . .

# Expõe a porta que o nosso servidor Node vai rodar
EXPOSE 3000

# Comando para iniciar o servidor usando o nodemon
CMD ["npx", "nodemon", "server.js"]