import React from 'react';
import { Link } from 'react-router-dom';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import Header from '../components/header';
import playIcon from '../assets/playIcon.svg';
import RoutineBox from '../components/routineBox';
import rightArrow from '../assets/rightArrow.svg';
import BarChart from '../components/BarChart';

export default function Home() {
  return (
    <ResponsiveWrapper desktopTitle="홈페이지 - 모바일 전용">
      <div className="min-h-screen w-full bg-[#EEF5FF]">
        <Header />
        <div className="px-6 pt-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">김시은님</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">환영합니다! 👋</span>
              <span className="text-lg font-regular">📅 2025년 09월 29일</span>
            </div>
          </div>
          
          <div className="w-full h-36 bg-gradient-to-br from-[#5680F3] to-[#D4F4FF] rounded-md flex flex-col items-start justify-center gap-2 shadow-md px-6 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            <p className="text-2xl font-bold text-gray-800 relative z-10">연습 시작하기</p>
            <p className="text-lg text-gray-600 relative z-10">기타 연습 연속 7일째 🔥</p>
            <img src={playIcon} alt="playIcon" className="w-10 h-10 ml-auto relative z-10" />
          </div>

         <div>
          <div className="flex items-center justify-between">
          <p className="text-2xl font-bold mb-2">루틴 관리</p>
          <div className="flex items-center gap-1 border-b border-black">
            <a href="#" className="text-sm ">루틴 생성하러 가기</a>
            <img src={rightArrow} alt="rightArrow" className="w-3 h-3" />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 w-[23rem] mx-auto">
             <RoutineBox title="루틴 1" description="루틴 1 설명" lastDate="2025.01.01" component={["박자 정확도 체크", "코드 연습"]} />
             <RoutineBox title="루틴 2" description="루틴 2 설명" lastDate="2025.01.01" component={["스케일 연습", "핑거링 연습"]} />
             <RoutineBox title="루틴 3" description="루틴 3 설명" lastDate="2025.01.01" component={["음정 정확도 체크", "메트로놈 연습"]} />
          </div>
         </div>

          <div>
          <BarChart 
            title="루틴 연습 통계" 
            description="막대를 터치해주세요!" 
          />
          </div>
          
        </div>
      </div>
    </ResponsiveWrapper>
  );
}