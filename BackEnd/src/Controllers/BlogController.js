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

    const paramValidator = getSchema.safeParse(req.params)
    if(!paramValidator.success){
      res.status(400).json({ message: "Número de identificação está inválida.",
      detalhes: formatZodError(paramValidator.error)
      })
      return
    }
  
    const tarefaId = req.params.id
    
    try {
      const tarefa = await Tarefa.findByPk(tarefaId)
  
      if (tarefa) {
        res.status(200).json(tarefa)
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