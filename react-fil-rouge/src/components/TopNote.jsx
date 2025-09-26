import React, { useEffect, useState } from "react";
import { fetchTopRated } from "../pages/Note.jsx";
import StarRating from "./noteEtoile.jsx";

export default function TopNoted({ limit = 5, minCount = 3 }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchTopRated({ limit, minCount })
      .then(setItems)
      .catch(e => setErr(e.response?.data?.message || e.message))
      .finally(() => setLoaded(true));
  }, [limit, minCount]);

  if (!loaded) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: Math.min(limit, 12) }).map((_, i) => (
          <div key={i} className="animate-pulse h-64 rounded-xl bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  if (err) return <p className="text-red-600">{err}</p>;
  if (!items.length) return <p className="text-gray-500 italic">Aucun anime ne correspond.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map(a => {
        const avg = Number.isFinite(a.ratingAvg) ? a.ratingAvg : 0;
        const count = Number.isFinite(a.ratingCount) ? a.ratingCount : 0;

        // image : gère populate (objets) ou juste des chemins
        const firstImg =
          Array.isArray(a.image) && a.image.length > 0
            ? (typeof a.image[0] === "string" ? a.image[0] : a.image[0]?.nom)
            : null;

        return (
         <a
  key={a._id}
  href={`/anime/${a._id}`}
  className="grid grid-cols-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
>
  <div className="w-full h-72 bg-white border-b border-gray-200 dark:border-gray-700 overflow-hidden">
    {firstImg ? (
      <img
        src={firstImg}
        alt={a.titreFr || a.titreOriginal}
        className="w-full h-60 object-cover"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        Pas d’image
      </div>
    )}
  </div>

  <div className="p-4">
    <h3 className="font-semibold text-lg line-clamp-1">
      {a.titreFr || a.titreOriginal}
    </h3>

    <div className="mt-2 flex items-center gap-2">
      <StarRating value={Math.round(avg)} readOnly size={20} title="Moyenne" />
      {count > 0 ? (
        <span className="text-sm text-gray-600">
          {avg.toFixed(2)} / 5 ({count})
        </span>
      ) : (
        <span className="text-sm text-gray-500 italic">Pas encore noté</span>
      )}
    </div>
  </div>
</a>

        );
      })}
    </div>
  );
}
