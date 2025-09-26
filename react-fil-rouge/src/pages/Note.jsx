// src/api/rating.js
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000" });

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchRating(animeId) {
  const { data } = await api.get(`/rating/${animeId}`, { headers: authHeader() });
  return data; // { avg, count, my }
}

export async function setRating(animeId, value) {
  const { data } = await api.post(`/rating/${animeId}`, { value }, { headers: authHeader() });
  return data; // { ok, avg, count, my }
}

export async function deleteRating(animeId) {
  const { data } = await api.delete(`/rating/${animeId}`, { headers: authHeader() });
  return data; // { ok, avg, count, my:null }
}

export async function fetchTopRated(limit=10) {
  const { data } = await api.get(`/rating/_public/top?limit=${limit}`);
  return data;
}
