import Postagem from "../Models/BlogModel.js"
import { z } from "zod"
import fs from "fs";

// Validações com ZOD
const createSchema = z.object({titulo: z.string().min(3, { msg: "O titulo deve ter pelo menos 3 caracteres" }).transform((txt) => txt.toLowerCase()),conteudo: z.string().min(5, { msg: "O conteudo deve ter pelo menos 5 caracteres" }),autor: z.string().min(3, { msg: "O autor deve ter pelo menos 3 caracteres" }),imagem: z.string().optional(),
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
  
    const { titulo, conteudo, autor, imagem } = req.body;
  
    if (!titulo) {
      res.status(400).json({ err: "O titulo é obirgatoria" });
      return;
    }
    if (!conteudo) {
      res.status(400).json({ err: "O conteudo é obirgatoria" });
      return;
    }
    if (!autor) {
      res.status(400).json({ err: "O autor é obirgatoria" });
      return;
    }
  
    const novaPostagem = {
      titulo,
      conteudo,
      autor,
      imagem,
    };
  
    try {
      await Postagem.create(novaPostagem);
      res.status(201).json({ msg: "Postagem Cadastrada" });
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
        res.status(500).json({err: "Erro interno no servidor."})
    }
}

// Buscar Postagem por ID
export const getTasksByID = async (req, res) => { //3


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