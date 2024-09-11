import multer from "multer";
import path from "node:path"
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const imageStorage = multer.diskStorage({
    destionarion: (req, file, cb) => {
        let folder = ""

        if(req.baseUrl.includes("usuarios")){
            folder = "usuarios"
        }else if(req.baseUrl.includes("postagens")){
            folder = "postagens"
        }

        cb(null, path.join(__dirname, `../public/${folder}`));
    },

    filename: (req, file, cb) =>{
        cb(null, 
            Date.now() + 
            String(Math.floor(Math.random() * 10000)) + 
            path.extname(file.originalname)
        );
    },
});

const imageUpload = multer({ 
    storage: imageStorage,
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png||jpg||jpeg)$/)){
            return cb(new Error("Por favor, envie apenas jpg, png ou jpeg"))
        }
        cb(null, true)
    }
});

export default imageUpload;