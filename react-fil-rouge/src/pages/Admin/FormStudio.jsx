import axios from 'axios';
import { useEffect, useState } from 'react';

const FormStudio = () => {
  const [data, setData] = useState({
    nom: '',
    siteWeb: '',
    pays: '',

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
      const res = await axios.post('http://localhost:3000/studio/new',data, header)
      console.log(res.data);
      setMessage("Studio créé avec succès");
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
      <h2 className='mx-auto text-center text-white font-bold'>Formulaire pour créer un Studio</h2>

      <form className='max-w-sm mx-auto' onSubmit={handleSubmit}>
        <label htmlFor="nom" className='block mb-2 text-sm font-medium text-white'>Entrez nom du studio :</label>
        <input
          onChange={handleChange}
          value={data.nom}
          type="text"
          id="nom"
          name="nom"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
        />

        <label htmlFor="siteWeb" className='block mb-2 text-sm font-medium text-white'>Entrez le site du studio :</label>
        <input
          onChange={handleChange}
          value={data.siteWeb}
          type="text"
          id="siteWeb"
          name="siteWeb"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
        />

        <label htmlFor="pays" className='block mb-2 text-sm font-medium text-white'>Entrez le pays du studio</label>
        <input
          onChange={handleChange}
          value={data.pays}
          id="pays"
          name="pays"
          className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
          rows={4}
        />


        

        <button type="submit" className='bg-blue-500 text-white rounded-lg p-2'>Ajouter le studio</button>

        {message && <p className='mt-4 text-center text-white'>{message}</p>}
      </form>
    </div>
  );
};

export default FormStudio;
