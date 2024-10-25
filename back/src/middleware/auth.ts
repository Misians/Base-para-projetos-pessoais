import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'banana';  // Chave secreta para assinar os tokens

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido!' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], secretKey);  // Extrai o token após "Bearer"
    (req as any).userId = (decoded as any).id;  // Coloca o ID do usuário no objeto de request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido!' });
  }
};
