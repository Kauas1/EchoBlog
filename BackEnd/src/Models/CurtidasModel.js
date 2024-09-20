import conn from "../config/conn.js";
import { DataTypes } from "sequelize";
import Usuarios from "./UsuariosModel.js";
import Postagem from "./BlogModel.js";

const Curtidas = conn.define(
  "curtidas",
  {
    curtida_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  },
  {
    tableName: "curtidas",
  }
);

Usuarios.hasMany(Curtidas);
Curtidas.belongsTo(Usuarios);

Postagem.hasMany(Curtidas);
Curtidas.belongsTo(Postagem);

export default Curtidas;
