## criar projeto ###

yarn init -y

## instalar express

yarn add express

## instalar sucrase

yarn add sucrase -D

## instalar nodemon

yarn add nodemom -D

## rodar sucrase

yarn sucrase-node src/server.js

## instalar docker postgres

docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

## listar containers em execução

docker ps

## parar container

docker stop database

## listar todos containers na maquina

docker ps - a

## iniciar container

docker start database

## instalar eslint

yarn add eslint -D

## inicializar eslint

yarn eslint --init

## instalar prettier, eslint config prettier etc

yarn add prettier eslint-config-prettier eslint-plugin-prettier -D


## adcionar sequelize

yarn add sequelize
yarn add sequelize-cli -D

## sequelize postgres

yarn add pg pg-hstore

## criar migration de usuario

yarn sequelize migration:create --name=create-users

## passar migrations para o banco

yarn sequelize db:migrate

## instalar bcrypt

yarn add bcryptjs

## instalar jwt

yarn add jsonwebtoken

## instalar yup(validação)

yarn add yup

## instalar multer

yarn add multer

## instalar date-fns

yarn add date-fns@next

## mongodb no docker

docker run --name mongobarber -p 27017:27017 -d -t mongo

## mongooose orm pro mongo

yarn add mongoose


## instalar nodemailer

yarn add nodemailer

## instalar o express handlebars(template de email)

yarn add express-handlebars nodemailer-express-handlebars

## instalar redis

docker run --name redisbarber -p 6379:6379 -d -t redis:alpine

## instalar beequeue

yarn add bee-queue

## isntalar sentry

yarn add @sentry/node@5.6.2

## instalar expresse async errors

yarn add express-async-errors

## instalar youch

yarn add youch
