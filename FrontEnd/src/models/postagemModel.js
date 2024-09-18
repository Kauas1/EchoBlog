import conn from "../config/conn.js"
import { DataTypes } from "sequelize"

const Postagens = conn.define(
    "postagens",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,   
          },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        conteudo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        autor: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imagem: {
            type: DataTypes.STRING,
            allowNull: true,
            required: false
          },
    },
    {
        tableName: "postagens",
    }
);

export default Postagens