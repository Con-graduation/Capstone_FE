import { useNavigate } from 'react-router-dom';

export default function Setting() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('name');
    localStorage.removeItem('nickname');
    localStorage.removeItem('level');
    localStorage.removeItem('googleAuth');
    navigate('/');
  };
  return (
    <div className="h-[calc(100vh-8rem)] w-screen bg-[#EEF5FF] flex flex-col">
      <h1 className="text-2xl font-bold pt-10 text-center">로그아웃</h1>
      <div className="flex flex-col gap-10 items-center mt-32">
       <p className="text-lg font-medium text-center">오늘의 기타 연습은 여기까지! 🎸</p>
       <p className="text-lg font-bold text-center">로그아웃 하시겠습니까?</p>
       <button className="w-80 py-2 bg-red-400 text-white rounded-md font-bold flex items-center justify-center gap-2 hover:bg-red-500 transition-colors duration-200"
        onClick={handleLogout}>로그아웃</button>
      </div>
    </div>
  )
}