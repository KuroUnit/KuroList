// Midleware de autenticação
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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