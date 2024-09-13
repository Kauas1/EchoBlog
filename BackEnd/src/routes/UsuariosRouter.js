import { Router } from "express";

//Importando os Controllers:
import { createUser, loginUser, updateUser, getUsuarios, deleteUser, trocarPapel } from "../Controllers/UsuariosController.js";

// Helpers
import verifyRole from "../helpers/verify-papel.js";
import verifyToken from "../helpers/verify-token.js";
import verifyAdmin from "../helpers/verify-admin.js";
// // Declarand o Router:
const router = Router();

// //Endpoints:

router.post("/registro", verifyRole, createUser )
router.post("/login", loginUser)
router.put("/:id", verifyToken,updateUser)
router.get("/", verifyToken, verifyAdmin, getUsuarios)
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);
router.patch('/:id/papel', verifyToken, verifyAdmin, trocarPapel)
// Exportando Rota: 

export default router;