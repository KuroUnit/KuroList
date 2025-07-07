// Midleware de autenticação
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import redisClient from './config/redisConfig.js'

dotenv.config();

// Pega o token do cabeçalho da requisição no formato "Bearer TOKEN"
export const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ errors: [{ msg: 'Acesso negado. Nenhum token fornecido.' }] });
  }

  try {
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded.user;
    
    next();
  } catch (err) {
    res.status(401).json({ errors: [{ msg: 'Token inválido.' }] });
  }
};

// Middleware de Cache com Redis
export const cacheMiddleware = async (req, res, next) => {
  const cacheKey = req.originalUrl;
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`CACHE HIT para a chave: ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedData));
    } 
    else next();
  } catch (err) {
    console.error("Erro no cache do Redis:", err);
    next();
  }
};

// Middleware de Log de Erros
const logStream = fs.createWriteStream(path.join(process.cwd(), 'errors.log'), { flags: 'a' });
export const logErrors = (err, req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ERROR: ${err.message}\nURL: ${req.originalUrl}\nSTACK: ${err.stack}\n\n`;
  logStream.write(logMessage);
  res.status(500).json({ errors: [{ msg: 'Ocorreu um erro interno no servidor.' }] });
};