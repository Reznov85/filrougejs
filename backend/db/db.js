import { connect } from "mongoose";

function db() {
    connect(process.env.DB_URI)
        .then(() => console.log("connexion à la base de donnée établie"))
        .catch((error) => {console.log(error)})
}

export default db

