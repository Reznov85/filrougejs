import axios from "axios";
import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;          // ✅ name, pas "nom"
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setErrors([]);

    try {
      const res = await axios.post(
        "http://localhost:3000/utilisateur/register",
        formData
      );
      setMessage("Vous êtes bien enregistré");
      setFormData({ nom: "", prenom: "", email: "", password: "" }); // ✅ reset propre
      console.log(res.data);
    } catch (err) {
      console.log(err?.response?.data || err.message);
      const data = err?.response?.data;
      if (data?.details) {
        setErrors(data.details);                 // ex: tableau de détails Joi
      } else if (data?.message) {
        setMessage(data.message);
      } else {
        setMessage("Une erreur s'est produite : " + err.message);
      }
    }
  }

  return (
    <div>
      {message && (
        <p className="mb-4 text-sm text-white/90 bg-blue-600/70 p-2 rounded">
          {message}
        </p>
      )}

      {errors.length > 0 && (
        <ul className="mb-4 text-sm text-red-200 bg-red-700/70 p-2 rounded list-disc list-inside">
          {errors.map((e, i) => (
            <li key={i}>{e.message || String(e)}</li>
          ))}
        </ul>
      )}

      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="nom" className="block mb-2 text-sm font-medium text-white">
            Nom
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            onChange={handleChange}
            value={formData.nom}
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="prenom" className="block mb-2 text-sm font-medium text-white">
            Prénom
          </label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            onChange={handleChange}
            value={formData.prenom}
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">
            Email
          </label>
          <input
            type="email"                             
            id="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            required
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Enregistrer nouveau compte
        </button>
      </form>
    </div>
  );
};

export default Register;
