import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    system_requirements: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/items", {
        ...form,
        price: parseFloat(form.price),
      });

      setShowModal(true);

    } catch (err) {
      console.log(err);
      alert("Ошибка создания товара");
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto mt-10 bg-black/50 p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl text-orange-400 mb-6">
          Добавить товар
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Название"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />

          <input
            name="category"
            placeholder="Жанр"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />

          <input
            name="price"
            type="number"
            placeholder="Цена"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />

          <textarea
            name="description"
            placeholder="Описание"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />

          <textarea
            name="system_requirements"
            placeholder="Системные требования"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 py-3 rounded-full hover:bg-orange-600 transition"
          >
            Создать
          </button>

        </form>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-96 text-center">

            <h2 className="text-2xl text-orange-400 mb-4">
              ✔ Успешно
            </h2>

            <p className="text-gray-300 mb-6">
              Товар успешно создан
            </p>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-orange-500 py-3 rounded-xl hover:bg-orange-600 transition"
            >
              На главную
            </button>

          </div>

        </div>
      )}
    </>
  );
}