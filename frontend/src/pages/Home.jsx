import { useEffect, useState } from "react";
import api from "../api/axios";
import ItemCard from "../components/ItemCard";
import Loader from "../components/Loader";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // обычная загрузка
  useEffect(() => {
    if (!search) {
      fetchItems();
    }
  }, [page, size, sort]);

  // поиск с debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search) {
        searchItems();
      } else {
        fetchItems();
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/items?page=${page}&size=${size}${sort ? `&sort=${sort}` : ""}`
      );

      // искусственная задержка Loader
      await new Promise((resolve) => setTimeout(resolve, 800));

      setItems(res.data.items);
      setTotalPages(res.data.meta.pages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const searchItems = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/items/search?name=${search}`);

      // такая же задержка
      await new Promise((resolve) => setTimeout(resolve, 800));

      setItems(res.data);
      setTotalPages(1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 py-10 min-h-[80vh] flex flex-col">
      {/* Поиск + сортировка */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10">
        <input
          type="text"
          placeholder="Поиск товара..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-3 rounded-xl bg-black border border-gray-700 focus:outline-none focus:border-orange-500"
        />

        <select
          value={sort}
          onChange={(e) => {
            setPage(1);
            setSort(e.target.value);
          }}
          className="bg-black border border-gray-700 px-4 py-3 rounded-xl"
        >
          <option value="">Без сортировки</option>
          <option value="name_asc">Название ↑</option>
          <option value="name_desc">Название ↓</option>
          <option value="price_asc">Цена ↑</option>
          <option value="price_desc">Цена ↓</option>
        </select>
      </div>

      {/* 👇 ВАЖНО: отображение loader */}
      <div className="flex-1">
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Пагинация */}
      <div className="flex justify-center items-center gap-6 mt-12">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="bg-gray-800 px-4 py-2 rounded-xl disabled:opacity-40"
        >
          Назад
        </button>

        <span>
          Страница {page} из {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-800 px-4 py-2 rounded-xl disabled:opacity-40"
        >
          Вперед
        </button>

        <select
          value={size}
          onChange={(e) => {
            setPage(1);
            setSize(Number(e.target.value));
          }}
          className="bg-black border border-gray-700 px-3 py-2 rounded-xl"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
    </div>
  );
}