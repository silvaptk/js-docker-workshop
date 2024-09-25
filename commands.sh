# GERENCIAMENTO DE CONTEINERES

### Iniciar conteiner a partir da imagem de nome `hello-node`
docker run hello-node
### Ver conteineres em execução
docker ps
### Parar contêiner
docker stop CONTAINER_ID
### Ver todos os conteineres criados
docker ps -a
### Remover contêiner
docker rm CONTAINER_ID

# GERENCIAMENTO DE IMAGENS

### Criar imagem
docker build -t the-dev-notebook .
### Ver imagens
docker image ls
### Remover imagem
docker rmi the-dev-notebook
### Remvoer todas as imagens não utilizadas e sem nome
docker image prune
### Remvoer todas as imagens não utilizadas 
docker image prune -a

# APLICAÇÃO `THE-DEV-NOTEBOOK`

## Cria contêiner da aplicação `the-dev-notebook` 
## Associando-o à porta 8080
## Com volume nomeado para persistir o diretório `/app`
## Com volume anônimo para evitar sobrescrita do diretório `/app/node_modules`
docker run \
  -p 8080:8080 \ 
  -v "the-dev-notebook-data:/app" \
  -v "/app/node_modules" \
  the-dev-notebook

# GERENCIAMENTO DE REDE

## Criar rede
docker network create NETWORK_NAME
## Listar todas as redes
docker network ls 
## Remover rede
docker network rm NETWORK_NAME

# APLICAÇÃO `MODERATE-HARVEST`

## Criar contêiner de banco de dados para a aplicação `moderate-harvest`
## Com variáveis de ambiente `MYSQL_ROOT_PASSWORD` e `MYSQL_DATABASE`
## Com volume nomeado para o diretório `/var/lib/mysql` para persistir os dados do banco
## Com nome `mysql`
## Associado à rede de nome `moderate-harvest-net`
## Com base na imagem `mysql`
docker run \
  -e MYSQL_ROOT_PASSWORD="password" \
  -e MYSQL_DATABASE="moderate-harvest" \
  -v "moderate-harvest-data:/var/lib/mysql" \
  --name mysql \
  --network moderate-harvest-net \
  mysql

## Criar contêiner da aplicação `moderate-harvest`
## Associado à porta 8081
## Com associação entre o diretório do projeto na máquina local e o diretório do projeto 
## no contêiner para permitir desenvolvimento em tempo real
## Com volume anônimo sobre o diretório `/app/node_modules` para evitar 
## sobrescrita do volume nomeado
## Com nome `moderate-harvest`
## Associado à rede `moderate-harvest-net`
## Com base na imagem `moderate-harvest`
docker run \
  -p 8081:8081 \
  -v "$(pwd):/app" \
  -v "/app/node_modules" \
  --name moderate-harvest \
  --network moderate-harvest-net \
  moderate-harvest 

# DOCKER COMPOSE 

## Inicia contêineres 
docker compose up 
## Para contêineres
docker compose down
## Inicia conteineres configurados em arquivo de nome customizado
docker compose -f "CUSTOM_COMPOSE_FILE_PATH" up