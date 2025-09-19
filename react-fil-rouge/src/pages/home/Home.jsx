import { useEffect, useState } from 'react';
import axios from 'axios';
import { initFlowbite } from 'flowbite';

const Home = () => {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/anime/all')
      .then(res => { setData(res.data || []); setLoaded(true); })
      .catch(err => { setError(err.message || 'Erreur'); setLoaded(true); });
  }, []);

  // Initialise Flowbite UNE FOIS quand c’est prêt
  useEffect(() => {
    if (loaded && !error && data.length) {
      initFlowbite();
    }
  }, [loaded, error]); // <- pas "data" ici

  if (!loaded) return <h2>En cours de chargement</h2>;
  if (error) return <h2>Erreur : {error}</h2>;
  if (!data.length) return <h2>Aucun animé trouvé</h2>;

  return (
    <section>
      <div
        id="default-carousel"
        className="relative w-full"
        data-carousel="slide"
        data-carousel-interval="12000"
      >
        <div className="relative h-150 overflow-hidden rounded-lg">
          {data.map((anime, index) => {
            const file = anime?.image?.[0]?.nom;
            const src = file
              ? (file.startsWith('http') ? file : `http://localhost:3000/uploads/${file}`)
              : null;

            return (
              <div
                key={anime._id || index}
                data-carousel-item={index === 0 ? 'active' : ''}
                className="duration-700 ease-in-out"
              >
                {src && (
                  <img
                    src={`${src}?v=${anime._id || index}`} // cache-busting léger
                    className="block w-full object-cover object-center"
                    alt={anime.titreFr || anime.titreOriginal || 'Visuel animé'}
                  />
                )}

                {/* Bandeau en bas */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white p-6">
                  <h2 className="text-2xl md:text-4xl font-bold">
                    {anime.titreFr || anime.titreOriginal}
                  </h2>
                  {anime.synopsis && (
                    <p className="mt-2 text-sm md:text-base line-clamp-3">
                      {anime.synopsis}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicateurs */}
        <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
          {data.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              className="w-3 h-3 rounded-full"
              aria-label={`Slide ${i + 1}`}
              data-carousel-slide-to={i}
            />
          ))}
        </div>

        {/* Précédent / Suivant */}
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-prev
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
            <svg className="w-4 h-4 text-white" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 1 1 5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="sr-only">Précédent</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
            <svg className="w-4 h-4 text-white" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m1 9 4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="sr-only">Suivant</span>
          </span>
        </button>
      </div>
    </section>
  );
};

export default Home;
