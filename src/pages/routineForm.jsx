import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Accordian from '../components/accordian';
import { postRoutine } from '../api/routine';

export default function RoutineForm() {
  const navigate = useNavigate();
  const [routineType, setRoutineType] = useState('');
  const [routineName, setRoutineName] = useState('');
  const [fingerOrder, setFingerOrder] = useState('없음');
  const [codeOrder, setCodeOrder] = useState('없음');
  const [repeatCount, setRepeatCount] = useState('없음');
  const [bpm, setBpm] = useState('없음');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    try {
      const convertedRoutineType = routineType === '코드 전환' ? 'CHORD_CHANGE' : 
                                   routineType === '크로매틱 연습' ? 'CHROMATIC' : '';
      
      let sequence = null;
      if (routineType === '코드 전환' && codeOrder !== '없음') {
        sequence = codeOrder.split(' - ');
      } else if (routineType === '크로매틱 연습' && fingerOrder !== '없음') {
        sequence = fingerOrder.split(' - ');
      }
      
      const repeats = repeatCount !== '없음' ? parseInt(repeatCount.replace('회', '')) : null;
      
      const convertedBpm = bpm !== '없음' ? parseInt(bpm.split(' ')[0]) : null;
      
      const routineData = {
        title: routineName,
        routineType: convertedRoutineType,
        sequence: sequence,
        repeats: repeats,
        bpm: convertedBpm,
      };
      
      console.log('루틴 생성 요청:', routineData);
      const response = await postRoutine(routineData);
      console.log('루틴 생성 성공:', response);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('루틴 생성 실패:', error);
    }
  };

  return (
    <div className="min-h-[90vh] w-screen bg-[#EEF5FF] flex flex-col px-6 pb-24">
           
    <h1 className="relative text-2xl font-bold text-center mt-10">루틴 설정</h1>
        <button 
              onClick={() => navigate(-1)}
              className="p-2 text-black rounded-full transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
    <div className="flex flex-col items-center justify-center mt-10 gap-10 w-full">
        <input 
          type="text" 
          placeholder="루틴 이름 입력" 
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-md" 
        />
        <Accordian 
          title="연습 유형" 
          type="routineType" 
          value={routineType || '없음'} 
          onValueChange={setRoutineType}
        />
        
        {/* 코드 전환 선택 시: 코드 순서, 반복 횟수, BPM */}
        {routineType === '코드 전환' && (
          <>
            <Accordian 
              title="코드 순서" 
              type="codeOrder" 
              value={codeOrder} 
              onValueChange={setCodeOrder}
            />
            <Accordian 
              title="반복 횟수" 
              type="repeatCount" 
              value={repeatCount} 
              onValueChange={setRepeatCount}
            />
            <Accordian 
              title="BPM" 
              type="bpm" 
              value={bpm} 
              onValueChange={setBpm}
              routineType={routineType}
            />
          </>
        )}
        
        {/* 크로매틱 연습 선택 시: 손가락 순서, 반복 횟수, BPM */}
        {routineType === '크로매틱 연습' && (
          <>
            <Accordian 
              title="손가락 순서" 
              type="fingerOrder" 
              value={fingerOrder} 
              onValueChange={setFingerOrder}
            />
            <Accordian 
              title="반복 횟수" 
              type="repeatCount" 
              value={repeatCount} 
              onValueChange={setRepeatCount}
            />
            <Accordian 
              title="BPM" 
              type="bpm" 
              value={bpm} 
              onValueChange={setBpm}
              routineType={routineType}
            />
          </>
        )}
       
        <button 
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-500 text-white rounded-md mt-12 shadow-md"
        >
          루틴 생성하기
        </button>
       
        </div>
        
        {/* 완료 모달 */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-80 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">루틴 생성 완료!</h2>
              <p className="text-gray-600 text-center">루틴이 성공적으로 생성되었습니다.</p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(-1);
                }}
                className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        )}
    </div>
  )
}