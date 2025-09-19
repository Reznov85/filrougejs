import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"


const API = axios.create({ baseURL: "http://localhost:3000" })

export default function ImageAnime() {
  const { id } = useParams()

  const [data, setData] = useState(null)
  const [images, setImages] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)      // Ajouter
  const [isModal2Open, setIsModal2Open] = useState(false)    // Supprimer

  const [selectAdd, setSelectAdd] = useState([])             // IDs sélectionnés à AJOUTER
  const [selectRemove, setSelectRemove] = useState([])       // IDs sélectionnés à SUPPRIMER

  const [message, setMessage] = useState(null)
  const token = localStorage.getItem("token")

  function fetchData() {
    setLoaded(false)
    setError(null)
    Promise.all([
      API.get(`/anime/${id}`),
      API.get(`/image/all`)
    ])
      .then(([animeRes, imgRes]) => {
        setData(animeRes.data || null)
        setImages(Array.isArray(imgRes.data) ? imgRes.data : [])
      })
      .catch(err => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoaded(true))
  }

  useEffect(() => { fetchData() }, [id])

  // --- Sélections (sans manipuler le DOM) ---
  const toggleIn = (arrSetter, arr, imageId) => {
    arrSetter(arr.includes(imageId) ? arr.filter(x => x !== imageId) : [...arr, imageId])
  }

  // --- Actions ---
  function addImages() {
    if (!selectAdd.length) return setIsModalOpen(false)
    API.put(`/anime/add-images/${id}`, { images: selectAdd })
      .then(() => {
        setSelectAdd([])
        setIsModalOpen(false)
        fetchData()
      })
      .catch(err => setError(err?.response?.data?.message || err.message))
  }

  function removeImages() {
    if (!selectRemove.length) return setIsModal2Open(false)
    API.put(`/anime/remove-images/${id}`, { images: selectRemove })
      .then(() => {
        setSelectRemove([])
        setIsModal2Open(false)
        fetchData()
      })
      .catch(err => setError(err?.response?.data?.message || err.message))
  }

  // (Optionnel) exemple d’appel protégé
  function addAnime(refId) {
    if (!token) return setMessage("Vous devez être connecté.")
    API.post(`/commandLine/new`, { ref: refId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setMessage("Article ajouté au panier"))
      .catch(() => setMessage("Erreur lors de l'ajout au panier"))
  }

  if (!loaded) return <p>En cours de chargement…</p>
  if (error) return <p>Erreur : {error}</p>
  if (!data) return <p>Rien à afficher</p>

  return (
    <section className="p-4 space-y-4">
      {/* Aperçu rapide si l’animé a des images */}
      {Array.isArray(data.images) && data.images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.images.map((img) => (
            <img
              key={img._id || img.id}
              src={img.nom}
              alt={img.alt || ""}
              className="h-24 w-24 object-cover rounded"
            />
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold">{data.titre}</h2>
      <p className="text-sm text-gray-700">{data.description}</p>

      {message && <p className="text-blue-700">{message}</p>}

      <div id="actions" className="flex gap-2">
        <button className="px-3 py-2 rounded bg-blue-600 text-white"
          onClick={() => { setSelectAdd([]); setIsModalOpen(true) }}>
          Ajouter des images
        </button>
        <button className="px-3 py-2 rounded bg-red-600 text-white"
          onClick={() => { setSelectRemove([]); setIsModal2Open(true) }}>
          Supprimer des images
        </button>
      </div>

      {/* MODAL AJOUTER */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center"
             onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg w-full max-w-3xl p-4"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Médiathèque — Ajouter</h3>
              <button className="text-xl" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-auto">
              {images.map((image) => {
                const imageId = image._id || image.id
                const selected = selectAdd.includes(imageId)
                return (
                  <button
                    key={imageId}
                    type="button"
                    onClick={() => toggleIn(setSelectAdd, selectAdd, imageId)}
                    className={`relative rounded overflow-hidden border ${selected ? "ring-2 ring-blue-600" : ""}`}
                    title={image.alt || ""}
                  >
                    <img src={image.nom} alt={image.alt || ""} className="h-28 w-full object-cover" />
                    {selected && <span className="absolute top-1 right-1 bg-white px-1.5 py-0.5 text-xs rounded">✓</span>}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-2 rounded border" onClick={() => setIsModalOpen(false)}>Annuler</button>
              <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={addImages}>
                Ajouter ({selectAdd.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUPPRIMER */}
      {isModal2Open && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center"
             onClick={() => setIsModal2Open(false)}>
          <div className="bg-white rounded-lg w-full max-w-3xl p-4"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Médiathèque — Supprimer</h3>
              <button className="text-xl" onClick={() => setIsModal2Open(false)}>✕</button>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h:[60vh] overflow-auto">
              {(Array.isArray(data.image) ? data.image : []).map((image) => {
                const imageId = image._id || image.id
                const selected = selectRemove.includes(imageId)
                return (
                  <button
                    key={imageId}
                    type="button"
                    onClick={() => toggleIn(setSelectRemove, selectRemove, imageId)}
                    className={`relative rounded overflow-hidden border ${selected ? "ring-2 ring-red-600" : ""}`}
                    title={image.alt || ""}
                  >
                    <img src={image.nom} alt={image.alt || ""} className="h-28 w-full object-cover" />
                    {selected && <span className="absolute top-1 right-1 bg-white px-1.5 py-0.5 text-xs rounded">✓</span>}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-2 rounded border" onClick={() => setIsModal2Open(false)}>Annuler</button>
              <button className="px-3 py-2 rounded bg-red-600 text-white" onClick={removeImages}>
                Supprimer ({selectRemove.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
