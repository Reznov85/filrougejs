import { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token')

  const header = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  function fetchData(){
    axios.get('http://localhost:3000/utilisateur/all', header)
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

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Nom
                </th>
                <th scope="col" class="px-6 py-3">
                    Prénom
                </th>
                <th scope="col" class="px-6 py-3">
                    Email
                </th>
                <th scope="col" class="px-6 py-3">
                    Password
                </th>
                <th scope="col" class="px-6 py-3">
                    Role
                </th>
                <th scope="col" class="px-6 py-3">
                    Actions
                </th>
            </tr>
        </thead>
        <tbody>
           {data.map((utilisateur) => (
  <tr 
    key={utilisateur._id} 
    className="odd:bg-white odd:dark:bg-gray-900 
               even:bg-gray-50 even:dark:bg-gray-800 
               border-b dark:border-gray-700 border-gray-200"
  >
    <th 
      scope="row" 
      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      {utilisateur.nom}
    </th>
    <td className="px-6 py-4">
      {utilisateur.prenom}
    </td>
    <td className="px-6 py-4">
      {utilisateur.email}
    </td>
    <td className="px-6 py-4">
      {utilisateur.password}
    </td>
    <td className="px-6 py-4">
      {utilisateur.role}
    </td>
    <td></td>
    <td className="px-6 py-4">
      <a 
        href="#" 
        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
      >
        Edit
      </a>
    </td>
  </tr>
))}

            
        </tbody>
    </table>
</div>


      </>

        );
      }

export default UserList;
