export default function Pagination({ page, setPage }) {
  return (
    <div className="flex justify-center gap-4 mt-8">
      <button
        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
        className="px-4 py-2 bg-black/50 rounded hover:bg-orange-500"
      >
        Назад
      </button>

      <span>Страница {page}</span>

      <button
        onClick={() => setPage(prev => prev + 1)}
        className="px-4 py-2 bg-black/50 rounded hover:bg-orange-500"
      >
        Вперёд
      </button>
    </div>
  );
}