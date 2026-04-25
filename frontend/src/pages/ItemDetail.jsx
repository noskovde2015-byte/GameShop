import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api.get(`/items/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!item) {
    return (
      <div className="text-center mt-20 text-gray-400">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 px-6">
      <div className="bg-black/70 p-10 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-orange-400 mb-6">
          {item.name}
        </h1>

        <p className="text-gray-300 mb-6 text-lg leading-relaxed">
          {item.description}
        </p>

        <div className="text-2xl text-orange-500 font-semibold">
          {item.price} ₽
        </div>
      </div>
    </div>
  );
}