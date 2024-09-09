
import jwt from "jsonwebtoken";

// Assincrono:

const createUserToken = async (usuario, req,res) =>{
    //Criar o token
    const token = jwt.sign(
    {
        nome: usuario.nome,
        id: usuario.usuario_id
    },
    "SENHASUPERSEGURAEDIFICIL" //senha 
    )
    //Retornar o token
    res.status(200).json({
        mensage: "Você está logado!",
        token: token,
        usuarioId: usuario.usuario_id
    })
}

export default createUserToken;