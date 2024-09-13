import getToken from "./getToken.js"
import getUserByToken from "./getUserByToken.js";
import Users from "../model/users.js";

const verifyRole = async (req, res, next) => {
    try {
    const token = getToken(req);
    const user = await getUserByToken(token);
    const user_id = user.dataValues.user_id 
    const papelCheck = await Users.findByPk(user_id);
    
    if(papelCheck.dataValues.papel !== 'administrador' && papelCheck.dataValues.papel !== 'autor'){
        return res.status(403).json({message: "Você precisa ser um administrador ou um autor para realizar esta função"})
    }
    next()
    } catch (error) {
        res.status(500).json({message: "Erro ao validar papel"})
    }
    
}

export default verifyRole;