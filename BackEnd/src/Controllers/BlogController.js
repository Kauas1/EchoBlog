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