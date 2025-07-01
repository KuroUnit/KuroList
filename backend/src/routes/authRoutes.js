import express, { response } from 'express';
import { userModel } from '../models/userModel.js';

const router = express.Router();

// Rota para login do usuário.
router.post('/auth/login', async (req, res, next) => {
  try {
    const { login, password } = req.body;
    let user = await userModel.findByLogin(login);

    if (user) { // Login
      const isValid = await userModel.validatePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ errors: [{ msg: 'Credenciais inválidas' }] });
      }
    } else return res.status(404).json({ errors: [{ msg: 'Usuário não encontrado.' }] });

    res.status(200).json({ response: [{ msg: 'Usuário logado com sucesso.' }] });
  } catch (err) {
    next(err);
  }
});

export default router;


