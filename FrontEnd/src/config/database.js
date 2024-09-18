import dotenv from "dotenv"
dotenv.config()

let db ={
    db: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}

if(process.env.NODE_ENV === 'test'){
    db = {
        bd: process.env.DB_TEST_DB,
        user: process.env.DB_TEST_USER,
        password: process.env.DB_TEST_PASSWORD
    }
}

export default db;