## instalar docker postgres

docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

## listar containers em execução

docker ps

## parar container

docker stop database

## listar todos containers na maquina

docker ps -a

## iniciar container

docker start database

## criar migration de usuario

yarn sequelize migration:create --name=create-users

## passar migrations para o banco

yarn sequelize db:migrate

## mongodb no docker

docker run --name mongobarber -p 27017:27017 -d -t mongo

## instalar redis

docker run --name redisbarber -p 6379:6379 -d -t redis:alpine

