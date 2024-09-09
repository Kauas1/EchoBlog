import Usuarios from "../Models/UsuariosModel.js"
import { z } from "zod"


// Validações com ZOD
const createSchema = z.object({nome: z.string().min(3, { msg: "O Nome deve ter pelo menos 3 caracteres" }).transform((txt) => txt.toLowerCase()), email: z.string().email(), senha: z.string().min(8, { msg: "A senha deve ter pelo menos 8 caracteres" }),imagem: z.string().optional(),
});



// Adicionando os Usuarios:
export const createUser = async (req, res) => {
    const bodyValidation = createSchema.safeParse(req.body);
  
    if (!bodyValidation.success) {
      res.status(400).json({
        msg: "Os dados recebidos do corpo são invalidos",
        detalhes: formatZodError(bodyValidation.error),
      });
      return;
    }
  
    const { nome, email, senha } = req.body;
  
    const papel = "leitor"
  
    const novoUsuario = {
      nome,
      email,
      senha,
      papel,
    };
  
    try {
      await Usuarios.create(novoUsuario);
      res.status(201).json({ msg: "Usuario Cadastrado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ err: "Erro ao cadastrar Usuario" });
    }
  };