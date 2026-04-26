import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1Логин
      await api.post("/login", { email, password });

      // Получаем данные пользователя
      const response = await api.get("/users/me");

      // Сохраняем ПОЛНЫЙ объект пользователя
      setUser({
        id: response.data.id,
        nickname: response.data.nickname,
        role: response.data.role,
      });

      navigate("/");
    } catch (error) {
      alert("Ошибка входа");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-black/60 p-8 rounded-2xl shadow-lg w-96 backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">
          Вход
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-xl bg-black/70 border border-gray-700 text-white focus:outline-none focus:border-orange-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          className="w-full p-3 mb-6 rounded-xl bg-black/70 border border-gray-700 text-white focus:outline-none focus:border-orange-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 transition p-3 rounded-2xl font-semibold"
        >
          Войти
        </button>

        <div className="mt-6 text-gray-400 text-center">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="text-orange-400 hover:text-orange-500 transition"
          >
            Зарегистрироваться
          </Link>
        </div>
      </form>
    </div>
  );
}