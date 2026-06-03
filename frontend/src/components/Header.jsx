import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react"; // ← useState из react, не router!
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function Header() {
  const { user, setUser, becomeSeller } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await api.get("/login/logout");
    setUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  const navItems = (
    <>
      {!user && (
        <>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="bg-orange-500 px-4 py-1.5 text-sm rounded-full hover:bg-orange-600 transition"
          >
            Вход
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="bg-gray-700 px-4 py-1.5 text-sm rounded-full hover:bg-gray-600 transition"
          >
            Регистрация
          </Link>
        </>
      )}
      {user && (
        <>
          <button
            onClick={() => { navigate("/favorites"); setMenuOpen(false); }}
            className="bg-gray-800 px-4 py-1.5 text-sm rounded-full hover:bg-gray-700 transition"
          >
            Избранное
          </button>
          {user.role === "buyer" && (
            <button
              onClick={() => { becomeSeller(); setMenuOpen(false); }}
              className="bg-orange-500 px-4 py-1.5 text-sm rounded-full hover:bg-orange-600 transition"
            >
              Стать продавцом
            </button>
          )}
          {user.role === "seller" && (
            <button
              onClick={() => { navigate("/manage-items"); setMenuOpen(false); }}
              className="bg-orange-500 px-4 py-1.5 text-sm rounded-full hover:bg-orange-600 transition"
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
    </>
  );

  return (
    <header className="bg-black shadow-lg w-full">
      <div className="flex justify-between items-center px-4 sm:px-10 py-4">
        <Link to="/" className="text-xl font-bold text-orange-500 shrink-0">
          GameShop
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-3 flex-wrap justify-end">
          {navItems}
        </div>

        {/* Burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex flex-col justify-center gap-1.5 p-2"
          aria-label="Меню"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 px-4 pb-4 border-t border-gray-800">
          {navItems}
        </div>
      )}
    </header>
  );
}