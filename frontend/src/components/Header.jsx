import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function Header() {
  const { user, setUser, becomeSeller } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.get("/login/logout");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center px-10 py-4 bg-black shadow-lg">

      <Link to="/" className="text-xl font-bold text-orange-500">
        GameShop
      </Link>

      <div className="flex items-center gap-3">

        {!user && (
          <>
            <Link
              to="/login"
              className="bg-orange-500 px-4 py-1.5 text-sm rounded-full hover:bg-orange-600 transition"
            >
              Вход
            </Link>

            <Link
              to="/register"
              className="bg-gray-700 px-4 py-1.5 text-sm rounded-full hover:bg-gray-600 transition"
            >
              Регистрация
            </Link>
          </>
        )}

        {user && (
          <>
            <button
              onClick={() => navigate("/favorites")}
              className="bg-gray-800 px-4 py-1.5 text-sm rounded-full hover:bg-gray-700 transition"
            >
              Избранное
            </button>

            {user.role === "buyer" && (
              <button
                onClick={becomeSeller}
                className="bg-orange-500 px-4 py-1.5 text-sm rounded-full hover:bg-orange-600 transition"
              >
                Стать продавцом
              </button>
            )}

            {user.role === "seller" && (
              <button
                onClick={() => navigate("/manage-items")}
                className="bg-orange-500 px-4 py-2 text-sm rounded-full hover:bg-orange-600 transition"
              >
                Управление товарами
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-1.5 text-sm rounded-full hover:bg-red-700 transition"
            >
              Выйти
            </button>
          </>
        )}
      </div>
    </header>
  );
}