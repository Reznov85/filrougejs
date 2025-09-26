// src/hooks/useRating.js
import { useEffect, useState, useCallback } from "react";
import { fetchRating, setRating, deleteRating } from "../pages/Note.jsx"; 

export default function useRating(animeId) {
  const [avg, setAvg] = useState(0);
  const [count, setCount] = useState(0);
  const [my, setMy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchRating(animeId)
      .then(({ avg, count, my }) => { setAvg(avg); setCount(count); setMy(my); setErr(null); })
      .catch(e => setErr(e.response?.data?.message || e.message))
      .finally(()=> setLoading(false));
  }, [animeId]);

  useEffect(() => { load(); }, [load]);

  const rate = async (value) => {
    // Optimistic UI
    const prev = { avg, count, my };
    try {
      // calc optimiste
      const newCount = my ? count : count + 1;
      const baseSum = avg * count - (my || 0);
      const newAvg = (baseSum + value) / newCount;
      setAvg(newAvg); setCount(newCount); setMy(value);

      const r = await setRating(animeId, value);
      setAvg(r.avg); setCount(r.count); setMy(r.my);
    } catch (e) {
      setAvg(prev.avg); setCount(prev.count); setMy(prev.my);
      setErr(e.response?.data?.message || e.message);
    }
  };

  const remove = async () => {
    const prev = { avg, count, my };
    try {
      const newCount = Math.max(count - 1, 0);
      const newAvg = newCount === 0 ? 0 : (avg * count - (my || 0)) / newCount;
      setAvg(newAvg); setCount(newCount); setMy(null);

      const r = await deleteRating(animeId);
      setAvg(r.avg); setCount(r.count); setMy(r.my);
    } catch (e) {
      setAvg(prev.avg); setCount(prev.count); setMy(prev.my);
      setErr(e.response?.data?.message || e.message);
    }
  };

  return { avg, count, my, loading, err, rate, remove, reload: load };
}
