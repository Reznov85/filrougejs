import axios from 'axios';
import { useEffect, useState } from 'react';

const FormGenre = () => {
  const [data, setData] = useState({
    nom: '',
    description: '',

  });


  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token')

  
    const header = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // -- Helpers de saisie
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setData((d) => ({ ...d, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/genre/new',data, header)
      console.log(res.data);
      setMessage("Genre créé avec succès");
      // Optionnel: reset du formulaire
      setData({
        nom: '',
        siteWeb: '',
        pays: '',
   
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Erreur lors de la création du studio");
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className='mx-auto text-center text-white font-bold'>Formulaire pour créer un Genre</h2>

      <form className='max-w-sm mx-auto' onSubmit={handleSubmit}>
        <label htmlFor="genre" className='block mb-2 text-sm font-medium text-white'>Entrez nom du Genre :</label>
        <input
          onChange={handleChange}
          value={data.nom}
          type="text"
          id="nom"
          name="nom"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full text-white'
        />

        

        <label htmlFor="description" className='block mb-2 text-sm font-medium text-white'>Entrez la description du genre</label>
        <textarea
          onChange={handleChange}
          value={data.description}
          id="description"
          name="description"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full text-white'
          rows={4}
        />


        

        <button type="submit" className='bg-blue-500 text-white rounded-lg p-2'>Ajouter le studio</button>

        {message && <p className='mt-4 text-center text-white'>{message}</p>}
      </form>
    </div>
  );
};

export default FormGenre;
