import { useEffect, useState } from 'react';

const Header = () => {
  function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1]; // on prend la 2e partie du JWT
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.role || null;
  } catch (e) {
    return null;
  }
}

  const[role, setRole] = useState(null)  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifier si un token existe au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  setRole(getUserRole())
   }, []);

  // Fonction déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    setRole(null);
  };

    return (
        
<nav id='navbar'>
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <img src="/img/logo.png" className="h-20" alt="Logo" />
  {/*  */}
  <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li>
        <a href="/" className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Accueil</a>
      </li>
      <li>
        <a href="/anime" className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Animés</a>
      </li>
{role === "admin" && (
  <>
    <li>
      <a
        href="/users"
        className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
      >
        Liste des utilisateurs
      </a>
    </li>
    <li>
      <a
        href="/anime/new"
        className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
      >
        Ajouter un animé
      </a>
    </li>
    <li>
      <a
        href="/bibliotheque"
        className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
      >
        Bibliothèque d'image
      </a>
    </li>
  </>
)}
      {isLoggedIn ? (
       <li>
        <button onClick={handleLogout} className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Déconnexion</button>
      </li>

      ):(
      <>
      <li>
        <a href="/login" className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Se connecter</a>
      </li>
      <li>
        <a href="/register" className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">S'inscrire</a>
      </li>
      </>
)}
   
    </ul>
  </div>
  </div>
</nav>

    );
};

export default Header;