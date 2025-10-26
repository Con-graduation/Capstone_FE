import { useState, useEffect } from 'react';
import rightArrow from '../assets/rightArrow.svg';
import DropDown from '../components/dropDown';
import BarChart from '../components/BarChart';
import { getRoutine } from '../api/routine';

export default function PracticeStart() {
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState('');

  useEffect(() => {
    const fetchRoutine = async () => {
      const routine = await getRoutine();
      setRoutines(routine);
    };
    fetchRoutine();
    console.log(routines);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-[#EEF5FF] flex flex-col px-6 pb-24">
        <h1 className="text-2xl font-bold text-center mt-10">연습 시작</h1>
        <div className="flex flex-col items-center justify-center mt-10 gap-4 w-full">
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-semibold">루틴 선택하기</h2>
                <div className="flex items-center gap-1 border-b border-black">
                  <a href="/routine/form" className="text-sm ">루틴 생성하러 가기</a>
                  <img src={rightArrow} alt="rightArrow" className="w-3 h-3" />
                 </div>
            </div>

            
            <DropDown 
              title="루틴 선택" 
              options={['루틴 1', '루틴 2', '루틴 3']} 
              selectedValue={selectedRoutine || "루틴 선택"} 
              onSelect={setSelectedRoutine} 
            />


<div className="flex flex-col items-center justify-center gap-4 w-full bg-white rounded-md shadow-md">
  <div className="w-full bg-blue-400 text-white font-bold p-3 rounded-t-md">
  <h2 className="text-lg font-semibold text-center">코드 전환 연습</h2>
  </div>
  <div className="flex flex-col w-full gap-4 p-4">
    <div className="flex items-center justify-between">
      <p className="text-md font-bold">연습 유형</p>
      <p className="text-md font-light">코드 전환</p>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-md font-bold">코드 순서</p>
      <p className="text-md font-light">C - E - D - F</p>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-md font-bold">반복 횟수</p>
      <p className="text-md font-light">10회</p>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-md font-bold">BPM</p>
      <p className="text-md font-light">60 BPM</p>
    </div>
  
  </div>
           
            </div>

            <h2 className="text-xl font-semibold mr-auto mt-10">루틴 별 연습 통계</h2>
            <div className="flex flex-col items-center justify-center gap-4 w-full">

          <div>
          <BarChart 
            title="루틴 별 연습 횟수" 
            description={selectedRoutine ? "막대를 터치해주세요!" : "루틴을 선택해주세요!"}
            hasData={!!selectedRoutine}
          />
          </div>
            </div>

        </div>
    </div>
  )
}