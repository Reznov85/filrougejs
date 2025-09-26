// src/api/rating.js
import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:3000" });

export async function fetchTopRated({ limit = 12, minCount = 0 } = {}) {
  const { data } = await api.get(`/rating/_public/top?limit=${limit}&minCount=${minCount}`);
  return data; // [{ _id, titreFr, titreOriginal, image, ratingAvg, ratingCount }, ...]
}
