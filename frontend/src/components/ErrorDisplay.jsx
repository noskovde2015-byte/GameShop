export default function ErrorDisplay({ message, code }) {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-black/70 p-10 rounded-2xl shadow-2xl text-center max-w-md">
        <h2 className="text-3xl text-red-500 mb-4">
          Ошибка {code || ""}
        </h2>

        <p className="text-gray-300 mb-4">
          {message || "Что-то пошло не так"}
        </p>

        <p className="text-gray-500 text-sm">
          Попробуйте обновить страницу или вернуться назад
        </p>
      </div>
    </div>
  );
}