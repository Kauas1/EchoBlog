import Postagem from "../Models/BlogModel.js"
import Comentario from "../Models/comentarioModel.js";
import { z } from "zod"
import fs from "fs";
import Curtidas from "../Models/CurtidasModel.js";

// Validações com ZOD
const createSchema = z.object({titulo: z.string().min(3, { msg: "O titulo deve ter pelo menos 3 caracteres" }).transform((txt) => txt.toLowerCase()), conteudo: z.string().min(5, { msg: "O conteudo deve ter pelo menos 5 caracteres" }), autor: z.string().min(3, { msg: "O autor deve ter pelo menos 3 caracteres" }), imagem: z.string().optional(),
});

const comentarioSchema = z.object({
  conteudo: z.string().min(1, { msg: "O conteúdo do comentário é obrigatório" }),
  postagemId: z.string().uuid({ message: "O ID da postagem é inválido" }),
});

const updatePostagemSchema = z.object({
  titulo: z
    .string()
    .min(3, { msg: "O titulo deve ter pelo menos 3 caracteres" })
    .transform((txt) => txt.toLowerCase()),
  conteudo: z
    .string()
    .min(5, { msg: "O conteudo deve ter pelo menos 5 caracteres" }),
  autor: z.string().min(3, { msg: "O autor deve ter pelo menos 3 caracteres" }),
  imagem: z.string().optional(),
});

// Adicionando as Postagens:
export const create = async (req, res) => {

    const bodyValidation = createSchema.safeParse(req.body);
  
    if (!bodyValidation.success) {
      res.status(400).json({
        msg: "Os dados recebidos do corpo são invalidos",
        detalhes: formatZodError(bodyValidation.error),
      });
      return;
    }
  
    const { titulo, conteudo, autor } = req.body;
    let imagem
    if(req.file) {
      imagem = req.file.filename
    }else{
      imagem = "postagemDefault.png"
    }

    const novaPostagem = {
      titulo,
      conteudo,
      autor,
      imagem,
    };
  
    try {
      const postagem = await Postagem.create(novaPostagem);
      res.status(201).json({ postagem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ err: "Erro ao cadastrar postagem" });
    }
  };

// Lista de Postagem por página.
export const getAll = async (req, res) =>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page -1 ) * limit

    try {
        const postagem = await Postagem.findAndCountAll({
            limit, offset
        })

        const totalPaginas = Math.ceil(postagem.count / limit)

        res.status(200).json({
            totalPostagem: postagem.count,
            totalPaginas,
            paginaAtual: page,
            itemsPorPagina: limit,
            proximaPagina: totalPaginas === 0 ? null : `${process.env.BASE_URL}/postagens?page=${page + 1}&limit=${limit}`,
            postagens: postagem.rows
        })
    } catch (error) {
        res.status(500).json({err: "Erro interno no servidor." + error})
    }
}

// Buscar Postagem por ID
export const getTasksByID = async (req, res) => { 

    const PostagemId = req.params.id
    
    try {
      const postagem = await Postagem.findByPk(PostagemId)
      if(postagem) {
        res.status(200).json(PostagemId)
      } else {
        res.status(404).json({
          message: "Tarefa não encontrada."
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({
        err: "Erro interno ao buscar a tarefa."
      })
    }
  }

  export const updatePost = async (req, res) => {

    const paramValidation = updatePostagemSchema.safeParse(req.params);
    if (!paramValidation.success) {
      res.status(400).json({msg: "Numero de identificação está inválido",detalhes: formatZodError(paramValidation.error),});
        return
    }

    const { id } = req.params;
    const { titulo, conteudo, imagem } = req.body;
  
    const postagemAtualizada = {
      titulo,
      conteudo,
      imagem,
    };
    try {
      const [linhasAfetadas] = await Postagem.update(postagemAtualizada, {
        where: { id },
      });
      if (linhasAfetadas === 0) {
        res.status(404).json({ msg: "Postagem não encontrada" });
        return;
      }
      res.status(200).json({ msg: "Postagem Atualizada" });
    } catch (error) {
      res.status(500).json({ msg: "Erro ao atualizar Postagem" });
    }
  };
  

export const deletePostagem = async (req, res) => {
  const { id } = req.params;

  try {
    const [linhasAfetadas] = await Postagem.destroy({
      where: { id },
    });

    if (linhasAfetadas === 0) {
      res.status(404).json({ msg: "Postagem não encontrada" });
      return;
    }

    res.status(200).json({ msg: "Postagem deletada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro ao deletar Postagem" });
  }
};

export const uploadImagePostagem = async (request, response) => {
    const { id } = request.params;
    const caminhoImagem = `${id}.jpg`;
  
    fs.writeFile(`src/images/${caminhoImagem}`, request.body, (err) => {
      if (err) {
        console.error(err);
        response.status(500).json({ err: "Erro ao cadastrar imagem" });
        return;
      }
    });
  
    try {
      const [linhasAfetadas] = await Postagem.update(
        { imagem: caminhoImagem },
        {
          where: { id },
        }
      );
      if (linhasAfetadas === 0) {
        response.status(404).json({ msg: "Postagem não encontrada" });
        return;
      }
      response.status(200).json({ msg: "Imagem Atualizada" });
    } catch (error) {
      response.status(500).json({ msg: "Erro ao atualizar Imagem" });
    }
  };

// Criar comentário
export const criarComentario = async (req, res) => {
  const token = getToken(req);
  const usuario = await getUserByToken(token);

  if (!usuario) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  const bodyValidation = comentarioSchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return res.status(400).json({
      msg: "Os dados recebidos são inválidos.",
      detalhes: formatZodError(bodyValidation.error),
    });
  }

  const { conteudo, postagemId } = bodyValidation.data;
  const usuarioId = usuario.dataValues.usuario_id;

  try {
    const postagem = await Postagem.findByPk(postagemId);
    if (!postagem) {
      return res.status(404).json({ message: "Postagem não encontrada." });
    }

    const comentario = await Comentario.create({
      conteudo,
      usuarioId,
      postagemId,
    });

    res.status(201).json({ message: "Comentário criado com sucesso.", comentario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar comentário." });
  }
};

// Editar comentário
export const editarComentario = async (req, res) => {
  const token = getToken(req);
  const usuario = await getUserByToken(token);

  if (!usuario) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  const comentarioId = req.params.id;
  const { conteudo } = req.body;

  try {
    const comentario = await Comentario.findByPk(comentarioId);

    if (!comentario) {
      return res.status(404).json({ message: "Comentário não encontrado." });
    }

    if (comentario.usuarioId !== usuario.dataValues.usuario_id && usuario.dataValues.papel !== 'administrador') {
      return res.status(403).json({ message: "Apenas o autor ou um administrador pode editar este comentário." });
    }

    comentario.conteudo = conteudo;
    await comentario.save();

    res.status(200).json({ message: "Comentário editado com sucesso.", comentario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao editar comentário." });
  }
};

// Excluir comentário
export const excluirComentario = async (req, res) => {
  const token = getToken(req);
  const usuario = await getUserByToken(token);

  if (!usuario) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  const comentarioId = req.params.id;

  try {
    const comentario = await Comentario.findByPk(comentarioId);

    if (!comentario) {
      return res.status(404).json({ message: "Comentário não encontrado." });
    }

    if (comentario.usuarioId !== usuario.dataValues.usuario_id && usuario.dataValues.papel !== 'administrador') {
      return res.status(403).json({ message: "Apenas o autor ou um administrador pode excluir este comentário." });
    }

    await comentario.destroy();
    res.status(200).json({ message: "Comentário excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir comentário." });
  }
};

// Listar comentários de uma postagem
export const listarComentariosPorPostagem = async (req, res) => {
  const { postagemId } = req.params;

  try {
    const postagem = await Postagem.findByPk(postagemId);
    if (!postagem) {
      return res.status(404).json({ message: "Postagem não encontrada." });
    }
    const comentarios = await Comentario.findAll({
      where: { postagemId },
      include: [
        {
          model: Usuarios,
          attributes: ['id', 'nome'], 
        },
      ],
      order: [['createdAt', 'DESC']], 
    });
    res.status(200).json({ comentarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar comentários." });
  }
};

// Adicionar curtidas e remover
export const curtirPostagem =  async (req,res) => {

  try{
    const {postagemId} = req.params
    const {usuarioId} = req.body

    const curtidasExiste = await Curtidas.findOne({
      where:{
        usuario_id: postagemId,
        postagem_id: usuarioId
      }
    });

    if(curtidasExiste){
      await curtidasExiste.destroy()
      res.status(200).json({message: "Deslike feito com sucesso."})
    }else{
      usuario_id: usuarioId
      postagem_id: postagemId
    }
    return res.status(201).json({message: "Curtida adicionada"})
  }catch(error){
    return res.status(500).json({message: "Erro ao processar dados."})
  }
}