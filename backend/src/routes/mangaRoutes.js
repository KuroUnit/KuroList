import express from 'express';
import axios from 'axios';
import sharp from 'sharp';
import { query, param, validationResult } from 'express-validator';
import { mangaModel } from '../models/mangaModel.js';
import { authMiddleware, cacheMiddleware } from '../middlewares.js';


const router = express.Router();

// Middleware de autenticação
router.use(authMiddleware)

router.get('/mangas',
  cacheMiddleware, // Cache para otimização de requisições
  [ // Validação 
    query('title').optional().trim().escape(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
  ],
  async (req, res, next) => {
  
  try {
    const { title, limit, offset } = req.query;
    
    const queryOptions = {
        title: title,
        limit: limit || 48,
        offset: offset || 0,
      };
    const searchResults = await mangaModel.search(queryOptions);

    res.status(200).json(searchResults);
  } catch (err) {
    next(err);
  }
  }
);


router.get('/mangas/cover', 
  [
    // Validação para as capas
    query('mangaId').notEmpty().isUUID().withMessage('O ID do mangá é inválido.'),
    query('fileName').notEmpty().trim().withMessage('O nome do arquivo da capa é obrigatório.')
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { mangaId, fileName } = req.query;
      
      const imageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
      
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });
      const imageBuffer = imageResponse.data;
      
      // Otimizando a imagem para um carregamento melhor no frontendw
      const optimizedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 400 })
      .jpeg({ quality: 80 })
      .toBuffer();

      // Definindo que o navegador pode guardar essa imagem por um determinado tempo
      res.set('Cache-Control', 'public, max-age=86400'); // em segundos

      // Definindo o cabeçalho do tipo de dados a serem enviados
      res.set('Content-Type', 'image/jpeg');
      res.status(200).send(optimizedImageBuffer);
      
    } catch (err) {
      console.error("Erro na rota de capa:", err.message);
      next(err);
    }
  });
  
  router.get('/mangas/:mangaId',
    [ // Validação 
      param('mangaId').notEmpty().isUUID().withMessage('O ID do mangá é inválido.')
    ],
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const { mangaId } = req.params;
        const searchResult = await mangaModel.findById(mangaId);
  
        res.status(200).json(searchResult);
      } catch (err) {
        next(err);
      }
    }
  );
  
export default router;