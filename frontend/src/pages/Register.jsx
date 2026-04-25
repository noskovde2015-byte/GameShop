import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    nickname: "",
    age: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/auth", form);
    navigate("/login");
  };

  return (
    <div className="flex justify-center mt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl mb-4">Регистрация</h2>

        {Object.keys(form).map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            onChange={handleChange}
            className="w-full p-2 rounded-xl bg-gray-800"
          />
        ))}

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 py-2 rounded-2xl transition"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}