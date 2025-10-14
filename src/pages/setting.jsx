import { useNavigate } from 'react-router-dom';

export default function Setting() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-[#EEF5FF] flex flex-col">
      <h1 className="text-2xl font-bold pt-10 text-center">설정</h1>
      <div className="flex flex-col gap-10 items-center mt-40">
        <button className="w-80 py-2 bg-blue-400 text-white rounded-md font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors duration-200">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          개인정보 수정
        </button>
        <button 
          onClick={() => navigate('/notification')}
          className="w-80 py-2 bg-blue-400 text-white rounded-md font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          알림 설정
        </button>
        <button className="w-80 py-2 bg-red-400 text-white rounded-md font-bold flex items-center justify-center gap-2 hover:bg-red-500 transition-colors duration-200">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          로그아웃
        </button>
      </div>
    </div>
  )
}