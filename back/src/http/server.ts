import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';


// Inicializando o Prisma Client
const prisma = new PrismaClient();

// Inicializando o Express
const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Inicializando o servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
