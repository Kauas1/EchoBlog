// Dependências
import "dotenv/config"
import express from "express"
import cors from "cors"

// Importando conexão via Sequelize
import conn from "./config/conn.js"

// Importação de Modelos
import PostModels from "./Models/BlogModel.js"

//Importação de Rotas
import PostRouter from "./routes/BlogRouter.js"
import UsuariosRouter from "./routes/UsuariosRouter.js"

//Porta do Servidor
const PORT = process.env.PORT || 3333

//Inicializando o Express
const app = express()

// Middlewares Principais
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Conectando com o banco de dados
conn.sync().then(() =>{
    app.listen(PORT, ()=>{
        console.clear()
    console.log(`| Servidor na porta: ${PORT} 🤡 |`)
    console.log(`| Banco de dados conectado.  |\n`)
    })
}).catch((error) => console.error(error))

//Utilizando Rotas
app.use("/postagens", PostRouter)
app.use("/usuarios", UsuariosRouter)

// Rota (404) Padrão
app.use("/", (req,res) => {
    res.status(404).json({
        message: "Rota não encontrada.",
        tip: "Verifique se você digitou a URL corretamente."
    })
})