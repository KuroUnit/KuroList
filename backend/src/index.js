import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit'
import compression from 'compression'
import sanitizer from 'express-sanitizer'

// Rotas e middleware que seram usados
import authRoutes from './routes/authRoutes.js';
import mangaRoutes from './routes/mangaRoutes.js';
import listRoutes from './routes/listRoutes.js';
import { logErrors } from './middlewares.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Definindo os dominios permitidos para poder acessar a api via cors
const whitelist = [
  'http://localhost:3000',                                  // Front-end rodando localmente
  'http://localhost:5173',                                  // Front-end rodando localmente
  'https://kurolist.netlify.app',                           // Netlify main
  'https://kurolist-build.netlify.app',                     // Netlify build teste
  'https://jandersonlsilva.github.io/Projeto-FullStack/',   // GitHub Pages
  
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
app.use(helmet());

// Prevenção de Ataques Automatizados (Rate Limiting)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

// Otimização (Compressão Gzip)
app.use(compression());

// Parse e Sanitização
app.use(express.json({ limit: '10kb' }));
app.use(sanitizer());


// ---- ROTAS DA API ---- //
app.use('/api', authRoutes)
app.use('/api', mangaRoutes)
app.use('/api', listRoutes)

// Middleware de Erros
app.use(logErrors);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));