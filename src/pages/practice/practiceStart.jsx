import { useState, useEffect } from 'react';
import rightArrow from '../../assets/rightArrow.svg';
import DropDown from '../../components/dropDown';
import BarChart from '../../components/BarChart';
import { getRoutine } from '../../api/routine';
import { useNavigate } from 'react-router-dom';
export default function PracticeStart() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState('');
  const [selectedRoutineData, setSelectedRoutineData] = useState(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await getRoutine();
        setRoutines(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error('루틴 가져오기 실패:', error);
      }
    };
    fetchRoutine();
  }, []);

  const handleStartPractice = async () => {
    if (!selectedRoutine || !selectedRoutineData) {
      alert('루틴을 선택해주세요.');
      return;
    }
    
    try {
      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 권한이 허용되면 practice 페이지로 이동
      navigate('/practice', { state: selectedRoutineData });
      
      // stream은 나중에 practice 페이지에서 사용할 수 있도록 cleanup하지 않음
    } catch (error) {
      console.error('마이크 권한을 받을 수 없습니다:', error);
      alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
    }
  };

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
              options={routines.map(r => r.title)} 
              selectedValue={selectedRoutine || "루틴 선택"} 
              onSelect={(routineTitle) => {
                setSelectedRoutine(routineTitle);
                // 선택된 루틴의 전체 데이터 찾기
                const routine = routines.find(r => (r.title || r) === routineTitle);
                if (routine) {
                  setSelectedRoutineData(routine);
                }
              }} 
            />


{selectedRoutineData && (
  <div className="flex flex-col items-center justify-center gap-4 w-full bg-white rounded-md shadow-md">
    <div className="w-full bg-blue-400 text-white font-bold p-3 rounded-t-md">
      <h2 className="text-lg font-semibold text-center">{selectedRoutineData.title || '루틴 정보'}</h2>
    </div>
    <div className="flex flex-col w-full gap-4 p-4">
      <div className="flex items-center justify-between">
        <p className="text-md font-bold">연습 유형</p>
        <p className="text-md font-light">{selectedRoutineData.routineType === 'CHORD_CHANGE' ? '코드 전환' : selectedRoutineData.routineType === 'CHROMATIC' ? '크로매틱 연습' : selectedRoutineData.routineType}</p>
      </div>
      {selectedRoutineData.sequence && (
        <div className="flex items-center justify-between">
          <p className="text-md font-bold">{selectedRoutineData.routineType === 'CHORD_CHANGE' ? '코드 순서' : '손가락 순서'}</p>
          <p className="text-md font-light">{selectedRoutineData.sequence.join(' - ')}</p>
        </div>
      )}
      {selectedRoutineData.repeats && (
        <div className="flex items-center justify-between">
          <p className="text-md font-bold">반복 횟수</p>
          <p className="text-md font-light">{selectedRoutineData.repeats}회</p>
        </div>
      )}
      {selectedRoutineData.bpm && (
        <div className="flex items-center justify-between">
          <p className="text-md font-bold">BPM</p>
          <p className="text-md font-light">{selectedRoutineData.bpm} BPM</p>
        </div>
      )}
    </div>
  </div>
)}

          
            <button 
              className={`w-full p-2 rounded-md mt-12 shadow-md transition-colors ${
                !selectedRoutineData 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-blue-500 text-white'
              }`}
              onClick={handleStartPractice}
              disabled={!selectedRoutineData}
            >
              연습 시작하기
            </button>
        </div>
    </div>
  )
}