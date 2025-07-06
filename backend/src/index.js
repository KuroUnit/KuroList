import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


// Rotas e middleware que seram usados
import authRoutes from './routes/authRoutes.js';
import mangaRoutes from './routes/mangaRoutes.js';
import listRoutes from './routes/listRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Definindo os dominios permitidos para poder acessar a api via cors
const whitelist = [
  'http://localhost:3000',                                  // Front-end rodando localmente
  'http://localhost:5173',                                  // Front-end rodando localmente
  'https://kurolist.netlify.app',                           // Netlify main
  'https://kurolist-build.netlify.app',                     // Netlify build teste
  'https://github.com/KuroUnit/KuroList.io',                 //GitHub Pages
  
];

// Objeto de configuração contendo a lógica de permissão do CORS 
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error(`Not allowed by CORS.${origin}`))
    }
  }
}

// Aplicando o objeto com as opções
app.use(cors(corsOptions));

//  Definindo o corpo de requisisções como JSON
app.use(express.json());


// ---- ROTAS DA API ---- //
app.use('/api', authRoutes)
app.use('/api', mangaRoutes)
app.use('/api', listRoutes)



app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));