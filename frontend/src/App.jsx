import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import ItemDetail from "./pages/ItemDetail";
import ItemPage from "./pages/ItemPage";
import CreateItem from "./pages/CreateItem";
import ManageItems from "./pages/ManageItems";
import EditItem from "./pages/EditItem";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-orange-900 text-white">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/items/:id" element={<ItemPage />} />
        <Route path="/create-item" element={<CreateItem />} />
        <Route path="/manage-items" element={<ManageItems />} />
        <Route path="/edit-item/:id" element={<EditItem />} />
      </Routes>
      <footer className="text-center py-6 text-gray-400 border-t border-gray-800 mt-10">
    © 2026 GameShop | Курсовой проект
      </footer>
    </div>
  );
}