import { DataTypes } from "sequelize";
import conn from "../config/conn.js";
import Usuarios from "./UsuariosModel.js";
import Postagem from "./BlogModel.js";

const Comentario = conn.define("comentarios", {
    comentario_id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    comentario:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "comentarios"
})

// assosiação 1:N
Usuarios.hasMany(Comentario, { foreignKey: 'usuario_id'});
Comentario.belongsTo(Usuarios, { foreignKey: 'usuario_id' });

// 1:N
Postagem.hasMany(Comentario, { foreignKey: 'postagem_id'});
Comentario.belongsTo(Postagem, { foreignKey: 'postagem_id' });

export default Comentario;