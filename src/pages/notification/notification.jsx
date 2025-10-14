import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBox from '../../components/notificationBox';
import googleLogo from '../../assets/googleLogo.png';

export default function Notification() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);


  return (
    <div className="min-h-screen w-screen bg-[#EEF5FF] flex flex-col px-6 pb-24">
       <h1 className="text-2xl font-bold text-center mt-10">알림 설정</h1>
       <div className="flex flex-col items-center justify-center mt-10 gap-10 w-full">
       
       <div className="flex flex-col gap-8 w-full">
         <div className="flex items-center justify-between">
           <h2 className="text-xl font-semibold">알림 목록</h2>
           <p className="text-md text-gray-500 font-light">알림을 클릭하면 수정할 수 있습니다.</p>
         </div>
         <NotificationBox title="알림 1" startDate="2025.01.01"  time="오후 10:00" repeatInterval="매일" connectedGoogleCalendar={true}/>
         <NotificationBox title="알림 2" startDate="2025.01.01" endDate="2025.01.01" time="오후 03:00" repeatInterval="매주 수요일" />
       </div>

       <div className="flex flex-col gap-4 w-full">
       <h2 className="text-xl font-semibold mr-auto">알림 설정하기</h2>
       <button className="bg-blue-400 text-white rounded-md py-3 w-full shadow-md text-md font-bold"
       onClick={() => navigate('/notification/form')}>알림 추가하기 🔔</button>
       </div>
       
       <div className="flex flex-col gap-2 w-full">
       <h2 className="text-xl font-semibold mr-auto">구글 캘린더에 알림 일정을 추가하세요!</h2>
       <p className="text-lg text-gray-500 font-light">구글 캘린더와 알림 일정을 추가하려면<br/>
       구글 계정으로 연동하세요 </p>

       {/* 구글 계정을 연동한 상태라면 ㅏ래 구글 캘린더 알림 추가 버튼으로 대체 */}
       <button className="bg-white rounded-md py-3 w-full shadow-md text-md font-normal flex items-center justify-center gap-2 mt-4">
         <img src={googleLogo} alt="googleLogo" className="w-6 h-6" />
         구글 계정으로 연동</button>

         <button className="bg-white rounded-md py-3 w-full shadow-md text-md font-normal flex items-center justify-center gap-2 mt-4">
           📅 구글 캘린더 알림 추가</button>
       </div>
       
     </div>
    </div>
  );


}
