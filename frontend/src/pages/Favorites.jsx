import { useEffect, useState } from "react";
import api from "../api/axios";
import ItemCard from "../components/ItemCard";

export default function Favorites() {
  const [items, setItems] = useState([]);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/favorites");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="px-10 py-10">

      <h1 className="text-3xl font-bold text-orange-500 mb-10 text-center">
        Избранное
      </h1>

      {items.length === 0 && (
        <p className="text-center text-gray-400">
          У вас пока нет избранных товаров
        </p>
      )}

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

    </div>
  );
}