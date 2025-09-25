import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function FormImage() {
  const [alt, setAlt] = useState("")
  const [nom, setNom] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
        e.preventDefault()
       // Petites validations côté client
  if (!alt || !alt.trim()) {
    setError("Le descriptif (alt) est requis.");
    return;
  }
  if (!nom) {
    setError("Veuillez sélectionner un fichier.");
    return;
  }

  const formData = new FormData();
  formData.append("alt", alt);
  formData.append("nom", nom); // Assure-toi que Multer attend bien "nom" côté backend

  try {
    const token = localStorage.getItem("token") || "";
    const res = await axios.post(
      "http://localhost:3000/image/new",
      formData,
      {
        // Laisse axios gérer le boundary de multipart; inutile de mettre Content-Type
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    console.log("Upload OK:", res.data);
    setError(null);
    navigate("/bibliotheque");
  } catch (err) {
    // Transforme l’erreur en texte pour ne pas casser <p>
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Une erreur est survenue lors de l’envoi du formulaire.";
    setError(msg);
    console.error(err);
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-700">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">
          Ajouter une image
        </h2>

     {error && <p>{error.message || error}</p>}

        {/* Champ descriptif */}
        <div>
          <label
            htmlFor="alt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descriptif
          </label>
          <input
            onChange={(e) => setAlt(e.target.value)}
            type="text"
            name="alt"
            id="alt"
            placeholder="Ex: Image d’un animé"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Champ fichier */}
        <div>
          <label
            htmlFor="nom"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fichier
          </label>
          <input
            onChange={(e) => setNom(e.target.files[0])}
            type="file"
            name="nom"
            id="nom"
            className="w-full px-3 py-2 border rounded-lg cursor-pointer bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Bouton */}
        <button type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-800 transition duration-200"
        >
          Enregistrer
        </button>
      </form>
    </div>
  )
}
