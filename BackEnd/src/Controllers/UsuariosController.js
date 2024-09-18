import Usuarios from "../Models/UsuariosModel.js"
import { z } from "zod"
import bcrypt from "bcrypt"
import { Op } from "sequelize" 

// Validações com ZOD
const createSchema = z.object({nome: z.string().min(3, { msg: "O Nome deve ter pelo menos 3 caracteres" }).transform((txt) => txt.toLowerCase()), email: z.string().email(), senha: z.string().min(8, { msg: "A senha deve ter pelo menos 8 caracteres" }), papel: z.enum([ "administrador", "autor", "leitor" ]).transform((txt) => txt.toLocaleLowerCase()).optional(),
});

const loginSchema = z.object({email: z.string().email(), senha: z.string().min(8, {msg: "A senha deve ter pelo menos 8 caracteres"}) })

const updateUserSchema = z.object({
    nome: z.string().min(3, { msg: "O nome do usuário deve ter pelo menos 3 caracteres" }).transform((txt) => txt.toLowerCase()), 
    email: z.string().email(), 
    senha: z.string().min(8, { msg: "A senha deve ter pelo menos 8 caracteres" }), 
    });

const getSchema = z.string().uuid({message: "UUID invalido!"});

//Importando os Helpers:
import formatZodError from "../helpers/zodError.js";
import createUserToken from "../helpers/create-user-token.js";
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";

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

  const idValidation = getSchema.safeParse(req.params.id)
  if(!idValidation.success){
      return res.status(400).json({message: "Os dados recebidos no corpo da aplicação são invalidos", detalhes: formatZodError(idValidation.error)})
  }

  const bodyValidation = updateUserSchema.safeParse(req.body);

  if(!bodyValidation.success){
      return res.status(400).json({message: "Os dados recebidos no corpo da aplicação são invalidos", detalhes: formatZodError(bodyValidation.error)})
  }

  const {nome, email, senha, papel} = bodyValidation.data;

  const salt = await bcrypt.genSalt(12);
  const senhaHash = await bcrypt.hash(senha, salt);

  const userData = {nome, email, senha: senhaHash};

  try{
      const token = getToken(req);
      const user = await getUserByToken(token);
      const usuario_id = user.dataValues.usuario_id

      const emailCheck = await Usuarios.findOne({where: {email}});
      if(emailCheck){
          if(emailCheck.usuario_id !== usuario_id){
              return res.status(403).json({message: "Já existe um usuario com este email!"});
          }
      }

      await Usuarios.update(userData, {where: {usuario_id}});

      res.status(200).json({message: "Usuario atualizado com sucesso!"})
  }catch(err){
      console.error(err);
      res.status(500).json({message: "Erro ao atualizar os dados do usuario!"})
  }
};

export const getUsuarios = async (req, res) => {
  try{
      const users = await Usuarios.findAll();

      res.status(200).json(users)
  }catch(err){
      console.error(err);
      res.status(500).json({message: "Erro ao buscar os usuarios!"})
  }
}

export const deleteUser = async (req, res) => {

  const idValidation = getSchema.safeParse(req.params.id)
  if(!idValidation.success){
      return res.status(400).json({message: "Os dados recebidos no corpo da aplicação são invalidos", 
      detalhes: formatZodError(idValidation.error)})
  }
  const user_id = idValidation.data;

  try {
      const user = await Usuarios.findByPk(user_id);

      if(!user){
          return res.status(404).json({message: "Este usuario não foi encontrado!"});
      }
      
      await Usuarios.destroy({where: {user_id}});
      res.status(204).end();
  } catch (error) {
      console.error(error);
      res.status(500).json({message: "Erro ao deletar usuario!"})
  }
}

export const trocarPapel = async (req, res) => {

  const idValidation = getSchema.safeParse(req.params.id)
  if(!idValidation.success){
      return res.status(400).json({message: "Os dados recebidos no corpo da aplicação são invalidos", 
      detalhes: formatZodError(idValidation.error)})
  }
  const user_id = idValidation.data;
  try {
      const usuario = await Usuarios.findByPk(user_id);
      if(!usuario){
          return res.status(404).json({message: "Não foi encontrado o usuario pelo ID fornecido!"});
      }

      if(usuario.dataValues.papel == "leitor"){
          await Usuarios.update({papel: 'autor'}, {where: {user_id}});
      } else if (usuario.dataValues.papel == "autor") {
          await Usuarios.update({papel: 'leitor'}, {where: {user_id}});
      }
      const updatedUser = await Usuarios.findOne({raw: true,where: {user_id}});
      res.status(200).json({usuario: updatedUser});

  } catch (error) {
      console.error(error);
      res.status(500).json({message: "Erro ao mudar o papel do usuario"})
  }
}
