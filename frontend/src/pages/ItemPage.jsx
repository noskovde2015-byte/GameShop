import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await api.get(`/items/${id}`);
      setItem(res.data);
    };

    fetchItem();
  }, [id]);

  if (!item) return <div className="text-white">Загрузка...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-black/50 p-8 rounded-2xl shadow-lg">

      <h1 className="text-3xl font-bold text-orange-400 mb-4">
        {item.name}
      </h1>

      <p className="text-gray-400 mb-4">
        Жанр: {item.category}
      </p>

      <p className="text-gray-300 mb-6">
        {item.description}
      </p>

      {item.system_requirements && (
        <div className="mb-6">
          <h3 className="text-orange-400 font-semibold mb-2">
            Системные требования:
          </h3>
          <p className="text-gray-300">
            {item.system_requirements}
          </p>
        </div>
      )}

      <div className="text-2xl text-orange-500 font-bold">
        {item.price} ₽
      </div>

    </div>
  );
}