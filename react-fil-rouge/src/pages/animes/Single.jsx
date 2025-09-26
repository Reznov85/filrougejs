import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import RatingWidget from "../../components/noteWidget.jsx";

const Single = () => {
  const { id } = useParams();

  const [anime, setAnime] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Commentaires
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  // 🔹 Saisie commentaire
  const [contenu, setContenu] = useState("");
  const [titre, setTitre] = useState("");
  const [submitting, setSubmitting] = useState(false);


  // --- Fetch anime
  useEffect(() => {
    axios
      .get(`http://localhost:3000/anime/${id}`)
      .then((res) => {
        setAnime(res.data);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoaded(true);
      });
  }, [id]);

  // Normalise -> toujours un tableau
  const normalizeComments = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.comments)) return data.comments;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  // --- Fetch comments
  const fetchComments = useCallback(() => {
    setCommentsLoading(true);
    setCommentsError(null);
    axios
      .get(`http://localhost:3000/commentaire/${id}`)
      .then((res) => {
        setComments(normalizeComments(res.data));
        setCommentsLoading(false);
      })
      .catch((err) => {
        setCommentsError(err.response?.data?.message || err.message);
        setCommentsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // --- Submit commentaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenu.trim()) return; // option: exiger aussi le titre
    try {
      setSubmitting(true);

      let token = localStorage.getItem("token");
      if (!token) {
        alert("Vous devez être connecté pour commenter.");
        return;
      }
      if (!token.startsWith("Bearer ")) token = `Bearer ${token}`;

      const res = await axios.post(
        `http://localhost:3000/commentaire/new`, 
        { titre, contenu, animeId: id },
        { headers: { Authorization: token } }
      );

      // reset champs
      setContenu("");
      setTitre("");

      // ajoute le nouveau commentaire si renvoyé, sinon refetch
      const created = res?.data;
      if (created && (created._id || created.id)) {
        setComments((prev) => [created, ...prev]);
      } else {
        fetchComments();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l’ajout du commentaire");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) return <h2>En cours de chargement</h2>;
  if (error) return <h2>Erreur : {error}</h2>;
  if (!anime) return <h2>Aucun résultat</h2>;

  const imgSrc = anime.image?.[0]?.nom || "/placeholder.png";

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto">
        <div className="w-full h-auto flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <img
            className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none w-full md:w-1/3 object-cover"
            src={imgSrc}
            alt={anime.titreOriginal || anime.titreFr}
          />

          <div className="p-5 flex-1">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {anime.titreFr} {!!anime.titreOriginal && <> | {anime.titreOriginal}</>}
            </h5>

            <div className="mb-3 text-gray-700 dark:text-gray-400">
              <p className="text-xl font-bold">Synopsis</p>
              <p className="mt-1">{anime.synopsis}</p>
            </div>

            {anime.auteur && (
              <div className="mb-3 text-gray-700 dark:text-gray-400">
                <p className="text-xl font-bold">Auteur</p>
                <p className="mt-1">{anime.auteur}</p>
              </div>
            )}

            <div className="mb-3 text-gray-700 dark:text-gray-400">
              <p className="text-xl font-bold">Studio</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {anime.studios?.length ? (
                  anime.studios.map((studio) => (
                    <span
                      key={studio?._id || studio?.id || String(studio)}
                      className="inline-block rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm"
                    >
                      {studio.nom || "Inconnu"}
                    </span>
                  ))
                ) : (
                  <span className="text-sm">—</span>
                )}
              </div>
            </div>

            <div className="mb-3 text-gray-700 dark:text-gray-400">
              <p className="text-xl font-bold">Nombre de saison</p>
              <p className="mt-1">{anime.nbSaison}</p>
            </div>

            <div className="mb-3 text-gray-700 dark:text-gray-400">
              <p className="text-xl font-bold">Nombre d'épisode</p>
              <p className="mt-1">{anime.nbEpisode ?? "—"}</p>
            </div>

            <div className="mb-6 text-gray-700 dark:text-gray-400">
              <p className="text-xl font-bold">Genre</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {anime.genres?.length ? (
                  anime.genres.map((genre) => (
                    <span
                      key={genre?._id || genre?.id || String(genre)}
                      className="inline-block rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm"
                    >
                      {genre.nom}
                    </span>
                  ))
                ) : (
                  <span className="text-sm">—</span>
                )}
              </div>
            </div>
            <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Notation</h3>
        <RatingWidget animeId={id} />
      </div>

            {/* --- Formulaire commentaire --- */}
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Laisser un commentaire
              </h3>

              {/* Titre */}
              <div>
                <label
                  htmlFor="titre"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-1"
                >
                  Titre
                </label>
                <input
                  type="text"
                  id="titre"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm 
                             text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500
                             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                             dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Ex: Mon avis sur cet animé"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contenu"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-1"
                >
                  Ton message
                </label>
                <textarea
                  id="contenu"
                  rows="4"
                  value={contenu}
                  onChange={(e) => setContenu(e.target.value)}
                  className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 
                             rounded-lg border border-gray-300 focus:ring-blue-500 
                             focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
                             dark:placeholder-gray-400 dark:text-white 
                             dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Écris ton commentaire ici…"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 
                           focus:ring-4 focus:outline-none focus:ring-blue-300 
                           font-medium rounded-lg text-sm px-5 py-2.5 
                           dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Envoi…" : "Envoyer"}
              </button>
            </form>

            --- Liste des commentaires ---
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Commentaires
              </h2>

              {commentsLoading && <p className="text-gray-500">Chargement des commentaires…</p>}
              {commentsError && <p className="text-red-600">Erreur : {commentsError}</p>}
              {!commentsLoading && !commentsError && comments.length === 0 && (
                <p className="text-gray-500">Aucun commentaire pour le moment. Soyez le premier !</p>
              )}

              {Array.isArray(comments) && (
                <ul className="space-y-4">
                  {comments.map((c) => (
                    <li
                      key={c._id || c.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {c.auteur?.nom || "Inconnu"} {c.auteur?.prenom || "Inconnu"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                        </span>
                      </div>
                      {c.titre && (
                        <p className="font-semibold text-gray-900 dark:text-white mb-1">
                          {c.titre}
                        </p>
                      )}
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {c.texte || c.contenu}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
