const validation = (req, res, next) => {
    const { titulo, conteudo, autor, imagem } = req.body
  
    if (!titulo) {
      return res.status(400).json({
        err: "O Titulo da postagem é obrigatório."
      })
    }
    if (!conteudo) {
      return res.status(400).json({
        err: "O conteudo da postagem é obrigatória."
      })
    }
    if (!autor) {
        return res.status(400).json({
          err: "O autor(A) da postagem é obrigatória."
        })
    }

    next();
  }
  
  export default validation;