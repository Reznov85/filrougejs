import {  } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './home/Home.jsx'
import AnimeList from './animes/AnimeList.jsx'
import Single from './animes/Single.jsx'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/anime" element={<AnimeList/>}/>
      <Route path="/anime/:id" element={<Single/>}/>
    </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
