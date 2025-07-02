import express from 'express';
import axios from 'axios';
import sharp from 'sharp';
import { query, validationResult } from 'express-validator';
import { mangaModel } from '../models/mangaModel.js';

const router = express.Router();

router.get('/mangas', 
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

      // Definindo o cabeçalho do tipo de dados a serem enviados
      res.set('Content-Type', 'image/jpeg');
      res.status(200).send(optimizedImageBuffer);

    } catch (err) {
      console.error("Erro na rota de capa:", err.message);
      next(err);
    }
});


export default router;