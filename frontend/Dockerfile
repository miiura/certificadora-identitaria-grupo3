# Usa uma imagem leve do Node
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# O comando --host é OBRIGATÓRIO para o Vite aceitar conexões de fora do container
CMD ["npm", "run", "dev", "--", "--host"]