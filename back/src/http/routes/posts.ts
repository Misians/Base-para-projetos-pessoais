import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();


// Rota para listar post especifico
router.get('/posts/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: {id: String(id) },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os posts' });
  }
});

//PEGAR TODOS POSTS DE UM USUARIO ESPECIFICO
router.get('/posts/:authorId', async (req: Request, res: Response) => {
  const { authorId } = req.params;
  try {
    const post = await prisma.post.findMany({
      where: {id: String(authorId) },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os posts' });
  }
});


router.get('/posts/', async (req: Request, res: Response) => {

  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os posts' });
  }
});

router.delete('/posts/:id', async(req:Request, res:Response) => {
  const { id } = req.params;
  try{
    await prisma.post.delete({
      where: { id: String(id)},
    });
    res.status(204).send();
  }catch(error){
    res.status(500).json({error: 'Erro ao deletar o usuário'});
  }

})

router.post('/posts', async(req: Request, res: Response) =>{
  const {title, content, authorId} = req.body;
  try{
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId
        },
      });
    res.status(201).json(post);
  }catch( error ){
    res.status(500).json({error: 'error ao cadastrar post'})
  }
})

router.put('/posts/:id', async(req: Request, res: Response) =>{
  const id = req.params;
  const {title, content, authorId} = req.body;
  try{
      const post = await prisma.post.update({
        where: {id: String(id)},
        data: {
          title,
          content,
          authorId
        },
      });
    res.status(201).json(post);
  }catch( error ){
    res.status(500).json({error: 'error ao cadastrar post'})
  }
})
// Outras rotas de posts podem ser adicionadas aqui

export default router;
