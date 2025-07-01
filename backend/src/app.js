import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Definindo os dominios permitidos para poder acessar a api via cors
const whitelist = [
  'http://localhost:3000',                                  // Front-end rodando localmente
  'https://kurolist.netlify.app',                           // Netlify main
  'https://kurolist-build.netlify.app',                     // Netlify build teste
  'https://github.com/KuroUnit/KuroList.io',                 //GitHub Pages
  
];

// Objeto de configuração contendo a lógica de permissão do CORS 
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// Aplicando o objeto com as opções
app.use(cors(corsOptions));


// ---- ROTAS DA API ---- //
app.use('/api', )
