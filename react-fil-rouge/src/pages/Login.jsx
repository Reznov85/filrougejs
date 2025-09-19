import axios from "axios"
import { useState } from "react"



export default function UserLogin() {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
  })
  const [message, setMessage] = useState(null)
  const [errors, setErrors] = useState([])


function handleChange(e){
setFormData({ ...formData, [e.target.name]: e.target.value })
}

function handleSubmit(e){
e.preventDefault()
setMessage(null)
setErrors([])

axios.post('http://localhost:3000/utilisateur/login', formData)
.then(res => {
setMessage("Utilisateur connecté avec succès")
// Stockage du token JWT
localStorage.setItem("token", res.data.token)
// Réinitialisation du formulaire
setFormData({
email: "",
password: "",
})
console.log("Token reçu :", res.data.token)
})
.catch(err => {
  console.log(err.response?.data)
  if(err.response && err.response.data){
    if(err.response.data.details){
      setErrors(err.response.data.details)
  } else {
    setMessage(err.response.data.message)
  }
  } else {
    setMessage("Une erreur s'est produite : " + err.message)
    }
  })
}
return (
<form className="max-w-sm mx-auto my-auto" onSubmit={handleSubmit}>
  <div className="mb-5">
    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Votre Email</label>
    <input type="email" id="email" onChange={handleChange} value={formData.email} name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  required />
  </div>
  <div className="mb-5">
    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white form-label">Votre mot de passe</label>
    <input type="password" id="password" onChange={handleChange} value={formData.password} name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
    
  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Se connecter</button>
  {message && <p className="mt-3">{message}</p>}
  {errors.length > 0 && (
  <ul className="mt-3 text-danger">
  {errors.map((error, index) => <li key={index}>
  {error.details}</li>)}
  </ul>
  )}
</form>
)
}