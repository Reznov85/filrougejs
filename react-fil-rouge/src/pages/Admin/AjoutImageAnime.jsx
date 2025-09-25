import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

export default function ImageAnime() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);   // Ajouter
  const [isModal2Open, setIsModal2Open] = useState(false); // Supprimer
  const [selectAdd, setSelectAdd] = useState([]);          // IDs à AJOUTER
  const [selectRemove, setSelectRemove] = useState([]);    // IDs à SUPPRIMER

const token = localStorage.getItem("token");



  // Petit helper générique pour (dé)sélectionner un id dans un tableau d'IDs
  function toggleIn(setter, list, id) {
    setter(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }

  async function fetchData() {
    try {
      setLoaded(false);
      setError(null);

      const animeRes = await API.get(`/anime/${id}`);
      setData(animeRes.data);

      const imgsRes = await API.get(`/image/all`, {headers: token ? { Authorization: `Bearer ${token}`} : {} }
);
      setImages(imgsRes.data);

      setLoaded(true);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      setLoaded(true);
    }
  }

  // Chargement initial
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --- Actions ---
  async function addImages() {
    if (!token) return setError("Token manquant (connecte-toi)");

    try {
      await API.put(
        `/anime/add-images/${id}`,
        { images: selectAdd },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setSelectAdd([]);
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  async function removeImages() {
    const token = localStorage.getItem("token");
    if (!token) return setError("Token manquant (connecte-toi)");
    try {
      await API.put(
        `/anime/remove-images/${id}`,
        { images: selectRemove },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setSelectRemove([]);
      setIsModal2Open(false);
      fetchData();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    }
  }

  const animeImages = Array.isArray(data?.image) ? data.image : [];

  return !loaded ? (
    <p>En cours de chargement…</p>
  ) : error ? (
    <p className="text-red-600">Erreur : {String(error)}</p>
  ) : (
    <section className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {data?.titreFr || data?.titreOriginal || "Animé"}
        </h2>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded bg-blue-600 text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Ajouter des images
          </button>
          <button
            className="px-3 py-2 rounded bg-red-600 text-white"
            onClick={() => setIsModal2Open(true)}
            disabled={animeImages.length === 0}
            title={animeImages.length === 0 ? "Aucune image à supprimer" : ""}
          >
            Supprimer des images
          </button>
        </div>
      </header>

      {/* Galerie actuelle de l’animé */}
      {animeImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {animeImages.map((img) => (
            <figure key={img._id || img.id} className="rounded overflow-hidden border">
              <img
                src={img.nom}
                alt={img.alt || ""}
                className="h-40 w-full object-cover"
              />
              {img.alt && (
                <figcaption className="px-2 py-1 text-sm text-gray-600">
                  {img.alt}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Aucune image associée pour le moment.</p>
      )}

      {/* MODAL AJOUTER */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 grid place-items-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-3xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Médiathèque — Ajouter</h3>
              <button className="text-xl" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-auto">
              {images.map((image) => {
                const imageId = image._id || image.id;
                const selected = selectAdd.includes(imageId);
                return (
                  <button
                    key={imageId}
                    type="button"
                    onClick={() => toggleIn(setSelectAdd, selectAdd, imageId)}
                    className={`relative rounded overflow-hidden border ${
                      selected ? "ring-2 ring-blue-600" : ""
                    }`}
                    title={image.alt || ""}
                  >
                    <img
                      src={image.nom}
                      alt={image.alt || ""}
                      className="h-28 w-full object-cover"
                    />
                    {selected && (
                      <span className="absolute top-1 right-1 bg-white px-1.5 py-0.5 text-xs rounded">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded border"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                onClick={addImages}
                disabled={selectAdd.length === 0}
              >
                Ajouter ({selectAdd.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUPPRIMER */}
      {isModal2Open && (
        <div
          className="fixed inset-0 bg-black/50 grid place-items-center"
          onClick={() => setIsModal2Open(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-3xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Médiathèque — Supprimer</h3>
              <button className="text-xl" onClick={() => setIsModal2Open(false)}>
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-auto">
              {animeImages.map((image) => {
                const imageId = image._id || image.id;
                const selected = selectRemove.includes(imageId);
                return (
                  <button
                    key={imageId}
                    type="button"
                    onClick={() =>
                      toggleIn(setSelectRemove, selectRemove, imageId)
                    }
                    className={`relative rounded overflow-hidden border ${
                      selected ? "ring-2 ring-red-600" : ""
                    }`}
                    title={image.alt || ""}
                  >
                    <img
                      src={image.nom}
                      alt={image.alt || ""}
                      className="h-28 w-full object-cover"
                    />
                    {selected && (
                      <span className="absolute top-1 right-1 bg-white px-1.5 py-0.5 text-xs rounded">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded border"
                onClick={() => setIsModal2Open(false)}
              >
                Annuler
              </button>
              <button
                className="px-3 py-2 rounded bg-red-600 text-white disabled:opacity-60"
                onClick={removeImages}
                disabled={selectRemove.length === 0}
              >
                Supprimer ({selectRemove.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
