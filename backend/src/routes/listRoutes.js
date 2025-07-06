import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { listModel } from '../models/listModel.js';
import { authMiddleware } from '../middlewares.js';

const router = express.Router();

// Middleware de autenticação
router.use(authMiddleware)

// Busca todas as listas pertencentes ao usuário
router.get('/lists', async (req, res, next) => {
  try {
    const lists = await listModel.findByUser(req.user.id);
    res.status(200).json({ lists: lists });
  } catch (err) {
    next(err);
  }
});

// Cria uma nova lista vazia
router.post('/lists',
  [
    body('name', 'O nome da lista é obrigatório.').notEmpty().trim(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name } = req.body;
      const newListData = {
        userId: req.user.id,
        name,
      };
      const newList = await listModel.create(newListData);
      res.status(201).json({ list: newList, msg: `Lista criada com sucesso.` });
    } catch (err) {
      next(err);
    }
  }
);

// Atualiza a lista especificada
router.patch('/lists/:listId', 
  [
    param('listId').isString().notEmpty().withMessage('O ID da lista é inválido.'),
    body('manga').isObject().withMessage('O objeto do mangá é obrigatório.'),
    body('operation').isIn(['add', 'remove']).withMessage("A operação deve ser 'add' ou 'remove'."),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { listId } = req.params;
      const { manga, operation } = req.body;
    
      const updateList = await listModel.update({
        listId,
        userId: req.user.id,
        manga,
        operation,
      });
      
      res.status(200).json({ list: updateList, msg: `Mangá ${operation === 'add' ? 'adicionado' : 'removido'} com sucesso.` });
      
    } catch (err) {
      next(err);
    }
  }
);


// Deleta a lista especificada
router.delete('/lists/:listId',
  [
    param('listId').isString().notEmpty().withMessage('O ID da lista é inválido.'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { listId } = req.params;
           
      const deletedList = await listModel.deleteById({
        listId,
        userId: req.user.id,
      });
      
      res.status(200).json({ list: deletedList, msg: 'Lista deletada com sucesso.' });

    } catch (err) {
      next(err);
    }
  }
);


export default router;