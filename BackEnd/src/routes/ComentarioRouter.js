import { Router } from "express";

import { criarComentario, listarComentariosPorPostagem, editarComentario, excluirComentario } from "../Controllers/BlogController.js";

  
// Middleware de autenticação
import verifyRole from "../helpers/verify-papel.js";
  const router = Router();
  

  router.post('/postagens/:id/comentarios', verifyRole, criarComentario);
  router.get('/postagens/:id/comentarios', listarComentariosPorPostagem);
  router.put('/:id', verifyRole, editarComentario);
  router.delete('/:id', verifyRole, excluirComentario);
  
  export default router;