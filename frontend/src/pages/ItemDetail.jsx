import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import ErrorDisplay from "../components/ErrorDisplay";

export default function ItemDetail() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/items/${id}`);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setItem(res.data);
    } catch (err) {
      console.error(err);

      // 👇 ВАЖНО: вытаскиваем код и сообщение
      if (err.response) {
        setStatusCode(err.response.status);

        if (err.response.status === 404) {
          setError("Товар не найден");
        } else if (err.response.status === 500) {
          setError("Ошибка сервера");
        } else {
          setError("Ошибка загрузки товара");
        }
      } else {
        setError("Сервер недоступен");
      }
    } finally {
      setLoading(false);
    }
  };

  // Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  // Ошибка
  if (error) {
    return <ErrorDisplay message={error} code={statusCode} />;
  }

  // Контент
  return (
    <div className="max-w-4xl mx-auto mt-20 px-6">
      <div className="bg-black/70 p-10 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-orange-400 mb-6">
          {item.name}
        </h1>

        <p className="text-gray-300 mb-6 text-lg leading-relaxed">
          {item.description}
        </p>

        <div className="text-2xl text-orange-500 font-semibold mb-6">
          {item.price} ₽
        </div>

        {item.system_requirements && item.system_requirements.trim() !== "" && (
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-orange-400 font-semibold mb-2">
              Системные требования
            </h3>
            <p className="text-gray-300 whitespace-pre-line">
              {item.system_requirements}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}