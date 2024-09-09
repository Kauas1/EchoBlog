import Usuarios from "../Models/UsuariosModel.js"
import { z } from "zod"
import bcrypt from "bcrypt"
import createUserToken from "../helpers/create-user-token.js";


// Validações com ZOD
const createSchema = z.object({nome: z.string().min(3, { msg: "O Nome deve ter pelo menos 3 caracteres" }).transform((txt) => txt.toLowerCase()), email: z.string().email(), senha: z.string().min(8, { msg: "A senha deve ter pelo menos 8 caracteres" }), papel: z.enum([ "administrador", "autor", "leitor" ]).transform((txt) => txt.toLocaleLowerCase()).optional(),
});

const loginSchema = z.object({email: z.string().email(), senha: z.string().min(8, {msg: "A senha deve ter pelo menos 8 caracteres"}) })

//Importando o Erro do ZOD:
import formatZodError from "../helpers/zodError.js";

// Adicionando os Usuarios:
export const createUser = async (req, res) => {
    const bodyValidation = createSchema.safeParse(req.body);
  
    if (!bodyValidation.success) {
      res.status(400).json({
        msg: "Os dados recebidos do corpo são inválidos",
        detalhes: formatZodError(bodyValidation.error),
      });
      return;
    }
  
    const { nome, email, senha, papel } = req.body;
  
    try {
      const salt = await bcrypt.genSalt(12);  
      const senhaHash = await bcrypt.hash(senha, salt);
  

      const novoUsuario = {
        nome,
        email,
        senha: senhaHash,  
        papel,
      };
  

      await Usuarios.create(novoUsuario);
      res.status(201).json({ msg: "Usuário Cadastrado com sucesso" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ err: "Erro ao cadastrar Usuário" });
    }
  };
 
  
// Função de login:
export const loginUser = async (req, res) => {

    const validationLogin = loginSchema.safeParse(req.body);
  
    if (!validationLogin.success) {
      res.status(400).json({
        msg: "Os dados recebidos do corpo são inválidos",
        detalhes: formatZodError(validationLogin.error) 
      });
      return;
    }
  
    const { email, senha } = req.body;
  
    try {
   
      const usuario = await Usuarios.findOne({ where: { email } });
  
      if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ message: "Senha Incorreta." });
      }
  
      await createUserToken(usuario, req, res);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ err: "Erro ao fazer Login." });
    }

  };
  