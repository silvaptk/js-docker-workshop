# Ambiente de execução
FROM node

# Dependências do projeto
WORKDIR /app

COPY package.json .

RUN ["npm", "install"]

# Código-fonte
COPY . .

CMD ["node", "main.js"]