export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Home!</h1>
        <p className="text-gray-600 text-lg">Tailwind CSS가 성공적으로 적용되었습니다! 🎉</p>
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200">
          클릭해보세요
        </button>
      </div>
    </div>
  );
}