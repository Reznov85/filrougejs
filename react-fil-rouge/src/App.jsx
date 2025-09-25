import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import AnimeList from './pages/animes/AnimeList.jsx'
import Single from './pages/animes/Single.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import UserList from './pages/Admin/UserList.jsx'
import FormAnime from './pages/Admin/FormAnime.jsx'
import Bibliotheque from './pages/Admin/Biblio.jsx'
import FormImage from './pages/Admin/FormImage.jsx'
import ImageAnime from "./pages/Admin/AjoutImageAnime.jsx"
import FormStudio from './pages/Admin/FormStudio.jsx'
import Profile from './pages/profil.jsx'
import FormGenre from './pages/Admin/FormGenre.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/anime" element={<AnimeList/>}/>
        <Route path="/anime/:id" element={<Single/>}/>
        <Route path="/anime/new" element={<FormAnime/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/users" element={<UserList/>}/>
        <Route path="/bibliotheque" element={<Bibliotheque/>}/>
        <Route path="/image/new" element={<FormImage/>}/>
        <Route path="/anime/addimage/:id" element={<ImageAnime/>}/>
        <Route path="/studio/new" element={<FormStudio/>}/>
        <Route path="/genre/new" element={<FormGenre/>}/>
        <Route path="/profil" element={<Profile/>}/>




      </Routes>
    </BrowserRouter>
  )
}

export default App
