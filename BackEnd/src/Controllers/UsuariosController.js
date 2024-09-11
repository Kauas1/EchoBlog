import Usuarios from "../Models/UsuariosModel.js"
import { z } from "zod"
import bcrypt from "bcrypt"
import { Op } from "sequelize" 

// Validações com ZOD
const createSchema = z.object({nome: z.string().min(3, { msg: "O Nome deve ter pelo menos 3 caracteres" }).transform((txt) => txt.toLowerCase()), email: z.string().email(), senha: z.string().min(8, { msg: "A senha deve ter pelo menos 8 caracteres" }), papel: z.enum([ "administrador", "autor", "leitor" ]).transform((txt) => txt.toLocaleLowerCase()).optional(),
});

const loginSchema = z.object({email: z.string().email(), senha: z.string().min(8, {msg: "A senha deve ter pelo menos 8 caracteres"}) })

const updateUserSchema = z.object({
    nome: z.string().min(3, { msg: "O nome do usuário deve ter pelo menos 3 caracteres" }).transform((txt) => txt.toLowerCase()), email: z.string().email(), senha: z.string().min(8, { msg: "A senha deve ter pelo menos 8 caracteres" }), 
  });



//Importando os Helpers:
import formatZodError from "../helpers/zodError.js";
import createUserToken from "../helpers/create-user-token.js";

// Adicionando os Usuarios:
export const createUser = async (req, res) => {
    const updateValidation = createSchema.safeParse(req.body);
  
    if (!updateValidation.success) {
      res.status(400).json({
        msg: "Os dados recebidos do corpo são inválidos",
        detalhes: formatZodError(updateValidation.error),
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

// Função para Atualizar Usuário.
export const updateUser = async (req, res) => {

    const paramValidation = z.object({ usuario_id: z.string() }).safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(400).json({
        msg: "O número de identificação está inválido",
        detalhes: formatZodError(paramValidation.error)
      });
    }
  
    const { usuario_id } = req.params;
    const updateValidation = updateUserSchema.safeParse(req.body);
    if (!updateValidation.success) {
      return res.status(400).json({
        msg: "Os dados do corpo são inválidos",
        detalhes: updateValidation.error,
      });
    }
  
    const { nome, email, senha } = req.body;
  
    try {
      const usuarioExiste = await Usuarios.findOne({ where: { email } });
      if (usuarioExiste && usuarioExiste.usuario_id !== usuario_id) {
        return res.status(400).json({ msg: "Este e-mail já está em uso por outro usuário." });
      }
  
      const usuarioAtualizado = {
        nome,
        email,
      };
  
      if (senha) {
        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(senha, salt);
        usuarioAtualizado.senha = senhaHash;
      }
  
      const [linhasAfetadas] = await Usuarios.update(usuarioAtualizado, {
        where: { usuario_id },
      });
  
      if (linhasAfetadas === 0) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }
  
      return res.status(200).json({ msg: "Usuário atualizado com sucesso!" });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro ao atualizar o usuário." });
    }
  };

