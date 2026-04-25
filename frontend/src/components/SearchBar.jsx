export default function SearchBar({ onSearch }) {
  return (
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Поиск..."
        className="flex-1 px-4 py-2 rounded bg-black/60 border border-gray-700"
        onChange={(e) => onSearch(e.target.value)}
      />
      <button className="bg-orange-500 px-4 rounded hover:bg-orange-600 transition">
        Фильтр
      </button>
    </div>
  );
}