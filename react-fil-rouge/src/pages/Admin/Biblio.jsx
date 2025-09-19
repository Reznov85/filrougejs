import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Bibliotheque = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErreur] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/image/all')
      .then(res => {
        setImages(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setErreur(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/image/${id}`)
      .then(() => {
        setImages(images.filter(img => img._id !== id));
      })
      .catch(err => setErreur(err.message));
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!images.length) return <p>Aucune image</p>;

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {images.map(img => (
          <figure key={img._id}>
            <img
              src={img.nom}
              alt={img.alt || ''}
              style={{ width: 200, height: 150, objectFit: 'cover' }}
            />
            <figcaption>{img.alt}</figcaption>
            <button onClick={() => handleDelete(img._id)} className='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>Supprimer</button>
          </figure>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <a href="/image/new" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Ajouter une image</a>
      </div>
    </div>
  );
};

export default Bibliotheque;
