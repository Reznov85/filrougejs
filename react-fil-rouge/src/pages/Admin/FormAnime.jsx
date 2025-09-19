import axios from 'axios';
import { useEffect, useState } from 'react';

const FormAnime = () => {
  const [data, setData] = useState({
    titreOriginal: '',
    titreFr: '',
    auteur: '',
    synopsis: '',
    nbSaison: '',
    nbEpisode: '',
    note: '',
    genres: [],  // backend attend un tableau d'ObjectId
    studios: [], // idem (1 seul choisi -> [id])
  });

  const [message, setMessage] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [studios, setStudios] = useState([]);
  const [genres, setGenres] = useState([]);

  // -- Helpers de saisie
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setData((d) => ({ ...d, [name]: val }));
  };

  // 1 seul studio, mais on range dans [id]
  const handleStudioChange = (e) => {
    const id = e.target.value;
    setData((d) => ({ ...d, studios: id && id !== 'unknown' ? [id] : [] }));
  };

  // 1 seul genre (même logique ; passe en multi plus tard si besoin)
  const handleGenreChange = (e) => {
    const id = e.target.value;
    setData((d) => ({ ...d, genres: id && id !== 'unknown' ? [id] : [] }));
  };

  // -- Fetch en parallèle
  useEffect(() => {
    (async () => {
      try {
        const [sRes, gRes] = await Promise.all([
          axios.get('http://localhost:3000/studio/all'),
          axios.get('http://localhost:3000/genre/all'),
        ]);
        setStudios(Array.isArray(sRes.data) ? sRes.data : []);
        setGenres(Array.isArray(gRes.data) ? gRes.data : []);
        setLoaded(true);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données");
        setLoaded(true);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Copie propre + nettoyage des champs "unknown"/vides
    const payload = { ...data };
    if (!payload.studios?.length) delete payload.studios;
    if (!payload.genres?.length) delete payload.genres;

    try {
      const res = await axios.post('http://localhost:3000/anime/new', payload);
      console.log(res.data);
      setMessage("Animé créé avec succès");
      // Optionnel: reset du formulaire
      setData({
        titreOriginal: '',
        titreFr: '',
        auteur: '',
        synopsis: '',
        nbSaison: '',
        nbEpisode: '',
        note: '',
        genres: [],
        studios: [],
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Erreur lors de la création de l'animé");
    }
  };

  if (!loaded) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className='mx-auto text-center text-white font-bold'>Formulaire pour créer un Animé</h2>

      <form className='max-w-sm mx-auto' onSubmit={handleSubmit}>
        <label htmlFor="titreOriginal" className='block mb-2 text-sm font-medium text-white'>Entrez le titre Original :</label>
        <input
          onChange={handleChange}
          value={data.titreOriginal}
          type="text"
          id="titreOriginal"
          name="titreOriginal"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
        />

        <label htmlFor="titreFr" className='block mb-2 text-sm font-medium text-white'>Entrez le titre en français :</label>
        <input
          onChange={handleChange}
          value={data.titreFr}
          type="text"
          id="titreFr"
          name="titreFr"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
        />

        <label htmlFor="synopsis" className='block mb-2 text-sm font-medium text-white'>Entrez le synopsis de l'animé</label>
        <textarea
          onChange={handleChange}
          value={data.synopsis}
          id="synopsis"
          name="synopsis"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
          rows={4}
        />

        <label htmlFor="nbSaison" className='block mb-2 text-sm font-medium text-white'>Entrez le nombre de saisons :</label>
        <input
          onChange={handleChange}
          value={data.nbSaison}
          type="number"
          id="nbSaison"
          name="nbSaison"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
        />

        <label htmlFor="nbEpisode" className='block mb-2 text-sm font-medium text-white'>Entrez le nombre d'épisodes :</label>
        <input
          onChange={handleChange}
          value={data.nbEpisode}
          type="number"
          id="nbEpisode"
          name="nbEpisode"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
        />

        <label htmlFor="auteur" className='block mb-2 text-sm font-medium text-white'>Entrez le nom de l'auteur :</label>
        <input
          onChange={handleChange}
          value={data.auteur}
          type="text"
          id="auteur"
          name="auteur"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
        />

        {/* GENRE : un seul sélectionné, envoyé en [id] */}
        <label htmlFor="genres" className='block mb-2 text-sm font-medium text-white'>Sélectionnez un genre :</label>
        <select
          id="genres"
          name="genres"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
          onChange={handleGenreChange}
          value={data.genres[0] || 'unknown'}
        >
          <option value="unknown">Inconnu</option>
          {genres.map((g) => (
            <option value={g._id} key={g._id}>{g.nom}</option>
          ))}
        </select>

        {/* STUDIO : un seul sélectionné, envoyé en [id] */}
        <label htmlFor="studios" className='block mb-2 text-sm font-medium text-white'>Sélectionnez un studio :</label>
        <select
          id="studios"
          name="studios"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
          onChange={handleStudioChange}
          value={data.studios[0] || 'unknown'}
        >
          <option value="unknown">Inconnu</option>
          {studios.map((s) => (
            <option value={s._id} key={s._id}>{s.nom}</option>
          ))}
        </select>

        <button type="submit" className='bg-blue-500 text-white rounded-lg p-2'>Ajouter l'anime</button>

        {message && <p className='mt-4 text-center text-white'>{message}</p>}
      </form>
    </div>
  );
};

export default FormAnime;
