import express, { response } from 'express';
import { userModel } from '../models/userModel.js';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Rota para login do usuário.
router.post('/auth/login', 
   [
    body('login').isEmail().withMessage('Login deve ser um e-mail válido.'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.')
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { login, password } = req.body;
      let user = await userModel.findByLogin(login);

      if (user) { // Login no Banco de dados
        const isValid = await userModel.validatePassword(password, user.password);
        if (!isValid) {
          return res.status(401).json({ errors: [{ msg: 'Credenciais inválidas' }] });
        }
      } else return res.status(404).json({ errors: [{ msg: 'Usuário não encontrado.' }] });

      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
});

export default router;
