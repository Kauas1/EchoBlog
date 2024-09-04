const validation = (req, res, next) => {
    const { id } = req.params
    const { titulo, conteudo } = req.body
  
    if (!id) {
      return res.status(400).json({
        message: "A solicitação exige que seja passado um ID."
      })
    }
    if (!titulo) {
      return res.status(400).json({
        message: "O titulo da tarefa é obrigatório."
      })
    }
    if (!conteudo) {
      return res.status(400).json({
        message: "A descrição da tarefa é obrigatória."
      })
    }
  
  
    next();
  }
  
  export default validation