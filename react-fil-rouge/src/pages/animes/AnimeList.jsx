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
      console.log(err.message)
        setError(err.message)
        setLoaded(true)
    })
  }
  useEffect(() => {fetchData()}, [])
    
  return (
          !loaded ? <h2>En cours de chargement</h2> : error ? <h2>Erreur : {error}</h2> : 
        <>

          <div className="">
            <div className="max-w-12xl mx-auto px-4 py-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((anime) => (
              
        <div key={anime.id} className="max-w-sm w-full card bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="p-5">
          <a href={`/anime/${anime._id}`}>
          {anime.image.length > 0 && (
            <img className="rounded-t-lg w-100 h-60 object-cover" src={anime.image[0].nom} alt={anime.titreOriginal} />
)}
              <h5 className="font-bold text-2xl">
                {anime.titreFr }
              </h5>
              <h5 className="text-l italic">
                {anime.titreOriginal}
              </h5>
            <p className="">
              {anime.synopsis.split(' ').slice(0,50).join(' ')+".  voir plus...  "}
            </p>
             </a>


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