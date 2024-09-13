import jwt from 'jsonwebtoken';
import getToken from './getToken.js';

const verifyToken = (req, res, next) => {
    if(!req.headers.authorization){
        res.status(401).json({err: "Acesso Negado"})
        return
    }

    const token = getToken(req);

    if(!token){
        res.status(401).json({err: "Acesso Negado"})
        return
    }

    try {
        const verified = jwt.verify(token, "SENH4HYPERMEGASAFEST");
        req.usuario = verified;
        next();
    }catch(err){
        res.status(400).json({err: "Token passado não é valido"});
        console.error(err);
    }
}

export default verifyToken;