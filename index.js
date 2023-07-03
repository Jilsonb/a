// Importar as dependências
require('dotenv').config(); // Carregar as variáveis de ambiente do arquivo .env
const express = require('express');
const app = express();
const itemRoutes = require('./routes/itemRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const passport = require('passport');
const { createServer } = require('./services/server');

require('./services/passport');


// Configurar a view engine para usar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Definir as rotas relacionadas aos itens
// app.use('/items', itemRoutes);

// Configurações do banco de dados
const dbString = process.env.DB_STRING;
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

// Middleware para processar dados de formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração da sessão
app.use(session({
  secret: process.env.SECRET, // Chave secreta para assinar o cookie de sessão
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: dbString, // URL de conexão com o banco de dados MongoDB
    mongoOptions: dbOptions,
    collectionName: 'sessions' // Nome da coleção para armazenar as sessões
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 1 // Tempo de expiração do cookie de sessão (1 hora)
  }
}));

// Inicializar o Passport para autenticação
app.use(passport.initialize());
app.use(passport.session());

// Rotas relacionadas à autenticação
app.use('/', require('./routes/authRoutes'));

// Rotas relacionadas aos itens
app.use('/', require('./routes/itemRoutes'));

// Criação do servidor
createServer(app);

// Exportar o app (opcional, dependendo da configuração do seu servidor)
module.exports = app;
