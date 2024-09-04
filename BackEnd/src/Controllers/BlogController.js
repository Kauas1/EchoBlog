import Postagem from "../Models/BlogModel.js"
import { z } from "zod"

// Adicionando as Postagens:
export const CreateNewPost = async (req, res) =>{
    
    const {titulo, conteudo, autor, imagem} = req.body

    const novaPostagem = {
        titulo, conteudo, autor, imagem
    }

    try{
        await Postagem.create(novaPostagem)
        res.status(201).json({
            message: "Tarefa cadastrada com sucesso!"
        })
    }catch(error){
        console.error(error)
        res.status(500).json({
            err: "Erro interno no servidor."
        })

    }
} 

// Lista de Postagem por página.
export const GetPostByPage = async (req, res) =>{
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

export const updatePost = async (req,res) =>{


    const {id} = req.params
    const {titulo, conteudo, autor} = req.body

    const postagemAtualizada = {
        titulo, conteudo
    }

    try{
        const [linhasAfetadas] = await Postagem.update(postagemAtualizada, {
            where: {postagem_id: id } })

        if(linhasAfetadas < 1){
            return res.status(404).json({message: "Postagem não encontrada."})
        }
           
        res.status(200).json({message: "Postagem atualizada com sucesso."})
       
        }catch(error){
        res.status(500).json({err: "Erro interno no servidor."})
    }
}