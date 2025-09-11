import express from "express"
import cors from "cors"
import db from "./db/db.js";
import utilisateurRoutes from "./routes/utilisateur.route.js";
import AnimeRoute from "./routes/anime.route.js";
import commentaireRoute from "./routes/commentaire.route.js";
import studioRoute from "./routes/studio.route.js";
import genreRoute from "./routes/genre.route.js";
import episodeRoute from "./routes/episode.route.js";
import imageRoute from "./routes/filesRoute.js";


// Connexion à la base de données
db();

const app = express();

app.use(cors())

app.use(express.json());

// Import des routes
app.use('/utilisateur', utilisateurRoutes)
app.use('/anime', AnimeRoute)
app.use('/commentaire', commentaireRoute)
app.use('/studio', studioRoute)
app.use('/genre', genreRoute)
app.use('/episode', episodeRoute);
app.use('/image', imageRoute)

app.use("/uploads", express.static("src/uploads"))


// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));

// 