const formatZodError = (error) => {
    const erroFormatado = {};
  
    error.errors.forEach((err) => {
      const path = err.path[0]
      if (!erroFormatado[path]) {
        erroFormatado[path] = [];
      }
      erroFormatado[path].push(err.msg);
    });
    return erroFormatado;
  };
  
  export default formatZodError