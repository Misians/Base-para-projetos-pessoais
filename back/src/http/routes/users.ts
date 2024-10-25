import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'banana';


router.post('/users', async (req: Request, res: Response) => {
  const { username, email, name, password} = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        name,
        password,
        
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar o usuário' });
  }
});

router.get('/login', async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gera um token JWT
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao autenticar' });
  }
});

// Rota para listar todos os usuários (Read)
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Rota para buscar um único usuário por ID (Read)
router.get('/users/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o usuário' });
  }
});

// Rota para atualizar um usuário (Update)
router.put('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, name, password } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: String(id) },
      data: { username, email, name, password },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar o usuário' });
  }
});

// Rota para deletar um usuário (Delete)
router.delete('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: String(id) },
    });
    res.status(204).send(); // 204: No Content
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o usuário' });
  }
});

export default router;