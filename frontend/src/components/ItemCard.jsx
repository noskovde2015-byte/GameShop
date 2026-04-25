import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    try {
      const res = await api.get("/favorites");
      const exists = res.data.find(fav => fav.id === item.id);
      if (exists) setIsFavorite(true);
    } catch {}
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${item.id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${item.id}`);
        setIsFavorite(true);
        setAnimate(true);
        setTimeout(() => setAnimate(false), 300);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/items/${item.id}`)}
      className="relative bg-black/60 p-6 rounded-2xl shadow-lg
      transform transition duration-300 hover:-translate-y-2 hover:shadow-orange-500/40
      cursor-pointer"
    >

      {/* ❤️ Сердечко */}
      <button
        onClick={toggleFavorite}
        className={`absolute top-4 right-4 text-2xl transition-transform duration-300
        ${animate ? "scale-150" : ""}
        ${isFavorite ? "text-red-500" : "text-gray-500 hover:text-red-400"}`}
      >
        ♥
      </button>

      <h2 className="text-xl font-bold text-orange-400 mb-3 pr-8">
        {item.name}
      </h2>

      <p className="text-gray-400 mb-4">
        {item.category}
      </p>

      <div className="text-orange-500 font-semibold">
        {item.price} ₽
      </div>

    </div>
  );
}