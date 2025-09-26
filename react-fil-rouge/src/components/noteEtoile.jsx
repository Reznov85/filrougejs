// src/components/StarRating.jsx
import React from "react";

export default function StarRating({ value, onChange, readOnly=false, size=24, title="Noter" }) {
  const stars = [1,2,3,4,5];

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label={title}>
      {stars.map((s) => {
        const active = value >= s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={readOnly}
            onClick={() => !readOnly && onChange(s)}
            className={`p-0.5 ${readOnly ? "cursor-default" : "cursor-pointer"} focus:outline-none`}
            title={`${s} / 5`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={size} height={size} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor"
              strokeWidth="1.5" className={active ? "text-yellow-500" : "text-gray-400"}
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </button>
        );
      })}
    </div>
  );
}
