import { useEffect, useState } from "react";
import api from "../api/axios";
import ItemCard from "../components/ItemCard";

export default function Home() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // обычная загрузка
  useEffect(() => {
    if (!search) {
      fetchItems();
    }
  }, [page, size, sort]);

  // 🔎 живой поиск
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
    const res = await api.get(
      `/items?page=${page}&size=${size}${sort ? `&sort=${sort}` : ""}`
    );

    setItems(res.data.items);

    const total = res.data.total;
    const pages = Math.ceil(total / size);

    setTotalPages(pages);
  } catch (err) {
    console.log(err);
  }
};

  const searchItems = async () => {
    try {
      const res = await api.get(`/items/search?name=${search}`);
      setItems(res.data);
      setTotalPages(1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="px-10 py-10">

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

      {/* Карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Пагинация только если нет поиска */}
      {!search && (
        <div className="flex justify-center items-center gap-6 mt-12">

          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="bg-gray-800 px-4 py-2 rounded-xl disabled:opacity-40"
          >
            Назад
          </button>

          <span>
            Страница {page} из {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => prev + 1)}
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
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
          </select>

        </div>
      )}
    </div>
  );
}