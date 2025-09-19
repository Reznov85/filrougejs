import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AnimeList = () => {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function fetchData(){
    axios.get('http://localhost:3000/anime/all')
    .then(res => {
        setData(res.data)
        setLoaded(true)
    })
    .catch(err => {
        setError(err.message)
        setLoaded(true)
    })
  }
  useEffect(() => {fetchData()}, [])
    
  return (
          !loaded ? <h2>En cours de chargement</h2> : error ? <h2>Erreur : {error}</h2> : 
        <>

          <div className="dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((anime) => (
              
        <div key={anime._id} className="max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="p-5">
          {anime.image.length > 0 && (
  <img className="rounded-t-lg w-100 h-60 object-cover"
    src={anime.image[0].nom}
    alt={anime.titreOriginal}
  />
)}
            <a href={'/anime/'+anime._id}>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {anime.titreFr }
              </h5>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {anime.titreOriginal}
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {anime.synopsis.split(' ').slice(0,50).join(' ')+"...  "}
            </p>
             <button onClick={() => navigate(`/anime/addimage/${anime.id || anime._id}`)} className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Ajouter une image</button>
          </div>
        </div>
      ))}
           </div>
          </div>
      </>

        );
      }

export default AnimeList;
