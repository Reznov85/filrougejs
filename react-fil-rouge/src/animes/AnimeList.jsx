import { useEffect, useState } from 'react';
import axios from 'axios';

const AnimeList = () => {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

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

    <div className=" bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
       {data.map((anime) => (
  <div key={anime._id} 
    className="max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <img className="rounded-t-lg w-full h-48 object-cover" src={anime.picture} alt={anime.titreOriginal}/>             
    <div className="p-5">
      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {anime.titreFr } || {anime.titreOriginal}
        </h5>
      </a>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {anime.synopsis.split(' ').slice(0,50).join(' ')+"...  "}
        <a className="hover:text-white" href={'/anime/'+anime._id}>Lire la suite</a>
      </p>
    </div>
  </div>
))}
      </div>
    </div>
  );
}

export default AnimeList;
