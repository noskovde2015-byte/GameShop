import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    system_requirements: ""
  });

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const res = await api.get(`/items/${id}`);
      setForm(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/items/${id}`, form);
      navigate("/manage-items");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-20">

      <form
        onSubmit={handleSubmit}
        className="bg-black/70 p-10 rounded-2xl shadow-lg w-[500px]"
      >
        <h2 className="text-2xl font-bold text-orange-500 mb-6">
          Редактирование товара
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Название"
          className="w-full p-3 mb-4 rounded-xl bg-black border border-gray-700"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Описание"
          className="w-full p-3 mb-4 rounded-xl bg-black border border-gray-700"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Цена"
          className="w-full p-3 mb-4 rounded-xl bg-black border border-gray-700"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Категория"
          className="w-full p-3 mb-4 rounded-xl bg-black border border-gray-700"
        />

        <input
          name="system_requirements"
          value={form.system_requirements}
          onChange={handleChange}
          placeholder="Системные требования"
          className="w-full p-3 mb-6 rounded-xl bg-black border border-gray-700"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 py-3 rounded-xl hover:bg-orange-600 transition"
        >
          Сохранить изменения
        </button>

      </form>

    </div>
  );
}