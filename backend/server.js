// server/index.js (ou équivalent)
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import utilisateurRoutes from "./routes/utilisateur.route.js";
import AnimeRoute from "./routes/anime.route.js";
import commentaireRoute from "./routes/commentaire.route.js";
import studioRoute from "./routes/studio.route.js";
import genreRoute from "./routes/genre.route.js";
import episodeRoute from "./routes/episode.route.js";
import db from "./db/db.js";
import imageRoute from "./routes/filesRoute.js";

db()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS global (attention aux parenthèses !)
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization",
}));


app.use(express.json());

// ✅ Servez les fichiers statiques AVANT vos autres routes
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders(res, filePath) {
      // Laisse les images utilisables cross-origin (évite ORB/COEP/CORP)
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      // (Optionnel) cache long si noms de fichiers versionnés
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  })
);

// …ensuite seulement vos routes API
app.use("/utilisateur", utilisateurRoutes);
app.use("/anime", AnimeRoute);
app.use("/commentaire", commentaireRoute);
app.use("/studio", studioRoute);
app.use("/genre", genreRoute);
app.use("/episode", episodeRoute);
app.use("/image", imageRoute);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
