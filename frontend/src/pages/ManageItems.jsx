import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function ManageItems() {
  const [items, setItems] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchMyItems();
    }
  }, [user]);

  const fetchMyItems = async () => {
    try {
      const res = await api.get("/items?page=1&size=100");

      // фильтруем только товары текущего продавца
      const myItems = res.data.items.filter(
        (item) => item.seller_id === user.id
      );

      setItems(myItems);
    } catch (err) {
      console.log("Ошибка загрузки товаров", err);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Удалить товар?")) return;

    try {
      await api.delete(`/items/${id}`);

      // плавное обновление без перезагрузки
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log("Ошибка удаления", err);
    }
  };

  if (!user) return null;

  return (
    <div className="px-10 py-12 min-h-screen">

      {/* Заголовок */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-orange-500">
          Управление товарами
        </h1>

        <button
          onClick={() => navigate("/create-item")}
          className="bg-orange-500 px-6 py-2 rounded-2xl hover:bg-orange-600 transition"
        >
          + Добавить товар
        </button>
      </div>

      {/* Если товаров нет */}
      {items.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          У вас пока нет товаров
        </div>
      )}

      {/* Карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {items.map((item) => (
          <div
            key={item.id}
            className="bg-black/60 p-6 rounded-2xl shadow-lg
            transform transition duration-300 hover:-translate-y-2 hover:shadow-orange-500/40"
          >

            <h2
              onClick={() => navigate(`/items/${item.id}`)}
              className="text-xl font-bold text-orange-400 mb-3 cursor-pointer hover:underline"
            >
              {item.name}
            </h2>

            <p className="text-gray-400 mb-4">
              {item.category}
            </p>

            <div className="text-orange-500 font-semibold mb-6">
              {item.price} ₽
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => navigate(`/edit-item/${item.id}`)}
                className="flex-1 bg-blue-600 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Редактировать
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="flex-1 bg-red-600 py-2 rounded-xl hover:bg-red-700 transition"
              >
                Удалить
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}