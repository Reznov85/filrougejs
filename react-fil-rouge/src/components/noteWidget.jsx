// src/components/RatingWidget.jsx
import React from "react";
import useRating from "../hooks/useNote.jsx";
import StarRating from "./noteEtoile.jsx";

export default function RatingWidget({ animeId }) {
  const { avg, count, my, loading, err, rate, remove } = useRating(animeId);

  // Garde-fous contre undefined/NaN
  const avgSafe   = Number.isFinite(avg) ? avg : 0;
  const countSafe = Number.isFinite(count) ? count : 0;
  const mySafe    = Number.isFinite(my) ? my : null;

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Ligne moyenne */}
      <div className="flex items-center gap-2">
        <StarRating value={Math.round(avgSafe)} readOnly size={20} title="Moyenne" />
        {countSafe > 0 ? (
          <span className="text-sm text-gray-600">
            {avgSafe.toFixed(2)} / 5 ({countSafe})
          </span>
        ) : (
          <span className="text-sm text-gray-500 italic">Pas encore noté</span>
        )}
      </div>

      {/* Ligne ma note */}
      <div className="flex items-center gap-3">
        <span className="text-sm">
          {mySafe ? `Ma note : ${mySafe}/5` : "Pas encore noté"}
        </span>

        {/* Les étoiles cliquables pour noter */}
        <StarRating
          value={mySafe || 0}
          onChange={(v) => rate(v)}
          readOnly={loading} // évite le spam pendant chargement
        />

        {mySafe && (
          <button
            onClick={remove}
            className="text-xs underline text-red-600 disabled:opacity-50"
            disabled={loading}
          >
            Supprimer ma note
          </button>
        )}
      </div>

      {/* États */}
      {loading && <span className="text-xs text-gray-500">Chargement…</span>}
      {err && <span className="text-xs text-red-600">{String(err)}</span>}
    </div>
  );
}
