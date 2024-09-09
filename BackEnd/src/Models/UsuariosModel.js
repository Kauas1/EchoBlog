import conn from "../config/conn.js";
import { DataTypes } from "sequelize";

const Usuarios = conn.define(
  "usuarios",
  {
    usuario_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false,
      required: true,
      unique: true
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    papel: {
      type: DataTypes.ENUM,
      values: ["administrador", "autor", "leitor"],
      defaultValue: ["leitor"]
    },
  },
  {
    tableName: "usuarios",
  }
);

export default Usuarios;