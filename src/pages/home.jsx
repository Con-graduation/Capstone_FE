import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getRoutine } from '../api/routine';
import playIcon from '../assets/playIcon.svg';
import RoutineBox from '../components/routineBox';
import rightArrow from '../assets/rightArrow.svg';
import BarChart from '../components/BarChart';
import googleLogo from '../assets/googleLogo.png';

export default function Home() {
  const navigate = useNavigate();
const [routines, setRoutines] = useState([]);
const name = localStorage.getItem('name');
    
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRoutine = async () => {
      const response = await getRoutine();
      // console.log('루틴 데이터:', response.data);
      setRoutines(response.data);

    };
    fetchRoutine();
  }, []);
  return (
   
      <div className="min-h-screen w-screen bg-[#EEF5FF] pb-24">
        <div className="px-6 pt-8 flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">{name}님</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">환영합니다! 👋</span>
              <span className="text-lg font-regular">📅 2025년 09월 29일</span>
            </div>
          </div>
          
          <div className="w-full h-36 bg-gradient-to-br from-[#5680F3] to-[#D4F4FF] rounded-md flex flex-col items-start justify-center gap-2 shadow-md px-6 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg relative overflow-hidden group"
          onClick={() => navigate('/practice/start')}>
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            <p className="text-2xl font-bold text-gray-800 relative z-10">연습 시작하기</p>
            <p className="text-lg text-gray-600 relative z-10">기타 연습 연속 7일째 🔥</p>
            <img src={playIcon} alt="playIcon" className="w-10 h-10 ml-auto relative z-10" />
          </div>

         <div>
          <div className="flex items-center justify-between">
          <p className="text-2xl font-bold mb-2">루틴 관리</p>
          <div className="flex items-center gap-1 border-b border-black">
            <a href="/routine/form" className="text-sm ">루틴 생성하러 가기</a>
            <img src={rightArrow} alt="rightArrow" className="w-3 h-3" />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 max-w-1/2 mx-auto">
                {routines.map((routine) => {
                  const routineTypeKorean = routine.routineType === 'CHORD_CHANGE' ? '코드 전환' : 
                                         routine.routineType === 'CHROMATIC' ? '크로매틱' : 
                                         routine.routineType;
                  const lastDate = routine.updatedAt ? routine.updatedAt.split('T')[0] : routine.updatedAt;
                  return (
                    <RoutineBox key={routine.id} title={routine.title} description={routineTypeKorean} lastDate={lastDate} component={routine.sequence} />
                  );
                })}
          </div>
         </div>

          <div>
          <BarChart 
            title="루틴 연습 통계" 
            description="막대를 터치해주세요!" 
          />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xl font-bold">알림 일정</p>
            <p className="text-md text-gray-600 font-light">알림을 추가해서 루틴 연습 시간을 받을 수 있습니다</p>
            <button className="bg-blue-400 text-white rounded-md py-2 w-64 shadow-md text-md font-bold mx-auto"
       onClick={() => navigate('/notification/form')}>알림 추가하기 🔔</button>
          </div>
          
          <div>
            <p className="text-xl font-bold mb-2">구글 캘린더에 알림 일정을 추가하세요!</p>
            <p className="text-md text-gray-600 font-light">구글 캘린더와 알림 일정을 추가하려면<br/>
            구글 계정으로 연동하세요 </p>
            <button className="flex items-center gap-2 bg-white text-black px-16 py-2 rounded-md border border-gray-300 mx-auto mt-4 shadow-md">
              <img src={googleLogo} alt="googleLogo" className="w-6 h-6" />
              구글 계정으로 연동
            </button>
          </div>
        </div>
       
      </div>
  );
}