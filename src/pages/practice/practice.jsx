import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAudioAnalyzer from '../../hooks/useAudioAnalyzer';
import { postPractice } from '../../api/practice';

export default function Practice() {
    const location = useLocation();
    const navigate = useNavigate();
    const routineData = location.state;
    const [showModal, setShowModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [userMediaStream, setUserMediaStream] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [currentCount, setCurrentCount] = useState(1);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const [gainValue, setGainValue] = useState(() => {
      // localStorage에서 입력 감도 값 가져오기 (기본값 0.5)
      const savedGain = localStorage.getItem('micVolume');
      return savedGain ? parseFloat(savedGain) : 0.5;
    });
    
    // useAudioAnalyzer로 볼륨 측정 (일시정지 중일 때는 null을 전달)
    const volume = useAudioAnalyzer(isPaused ? null : userMediaStream, gainValue);
    
    // 마이크 입력 시작 및 녹음
    useEffect(() => {
      const initMicrophone = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setUserMediaStream(stream);
          
          // 녹음 시작
          recordedChunksRef.current = [];
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus'
          });
          
          mediaRecorderRef.current = mediaRecorder;
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
            }
          };
          
          mediaRecorder.onstop = async () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
            
            // 백엔드에 전송
            try {
              const formData = new FormData();
              formData.append('audio', blob, 'practice.webm');
              
              // 루틴 정보도 함께 전송
              formData.append('routineTitle', routineData.title);
              formData.append('routineType', routineData.routineType);
              formData.append('sequence', JSON.stringify(routineData.sequence));
              formData.append('repeats', routineData.repeats);
              formData.append('bpm', routineData.bpm);
              
              await postPractice(formData);
              console.log('녹음 데이터 전송 완료');
            } catch (error) {
              console.error('녹음 데이터 전송 실패:', error);
            }
          };
          
          mediaRecorder.start();
        } catch (error) {
          console.error('마이크를 시작할 수 없습니다:', error);
          alert('마이크 권한이 필요합니다.');
          navigate('/practice/start');
        }
      };
      
      initMicrophone();
      
      // Cleanup
      return () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        if (userMediaStream) {
          userMediaStream.getTracks().forEach(track => track.stop());
        }
      };
    }, []);
    
    // 5초마다 카운트 증가하는 타이머
    useEffect(() => {
      if (!routineData || !userMediaStream || isPaused || currentCount >= routineData.repeats) {
        return;
      }
      
      const timer = setInterval(() => {
        setCurrentCount(prev => {
          if (prev >= routineData.repeats) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 5000);
      
      return () => clearInterval(timer);
    }, [currentCount, routineData, userMediaStream, isPaused]);
    
    // 완료 체크
    useEffect(() => {
      if (routineData && currentCount >= routineData.repeats) {
        // 녹음 중지
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        
        // 마이크 입력 중지
        if (userMediaStream) {
          userMediaStream.getTracks().forEach(track => {
            track.enabled = false;
            track.stop();
          });
        }
        setShowCompleteModal(true);
      }
    }, [currentCount, routineData, userMediaStream]);
  
    if (!routineData) {
      return (
        <div className="fixed inset-0 bg-[#EEF5FF] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">루틴 정보가 없습니다</h1>
            <button 
              onClick={() => navigate('/practice/start')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              돌아가기
            </button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="fixed inset-0 bg-[#EEF5FF] overflow-hidden w-screen h-screen">
       <div className="absolute top-1/2 left-1/2 h-screen w-screen -rotate-90 transform -translate-x-1/2 -translate-y-1/2 origin-center flex"
       style={{ width: '100vh', height: '100vw' }}>
        <div className="flex flex-col items-center justify-center">
            <div className="flex justify-around gap-2 mt-4 w-full pl-4 pr-10">
                <p className="text-2xl font-bold">6</p>
                <p className="text-2xl font-bold">5</p>
                <p className="text-2xl font-bold">4</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-2xl font-bold">2</p>
                <p className="text-2xl font-bold">1</p>
            </div>
            <div className="m-4 flex rounded-lg h-full">
           
  <div className="relative w-16 h-full bg-[#DBBEA2] border-r border-black rounded-l-lg overflow-hidden">
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className="absolute left-0 w-full border-t border-black"
        style={{ top: `${(i + 1) * (100 / 8)}%` }}
      />
    ))}
  </div>

  {[...Array(5)].map((_, index) => (
    <div
      key={index}
      className="relative w-36 h-full bg-[#DBBEA2] border-x border-black overflow-hidden"
    >
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="absolute left-0 w-full border-t border-black"
          style={{ top: `${(i + 1) * (100 / 8)}%` }}
        />
      ))}
    </div>
  ))}

  <div className="relative w-16 h-full bg-[#DBBEA2] border-l border-black rounded-r-lg overflow-hidden">
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className="absolute left-0 w-full border-t border-black"
        style={{ top: `${(i + 1) * (100 / 8)}%` }}
      />
    ))}
</div>
<div className="h-full py-12 flex flex-col justify-between ml-2">
            <p className="text-2xl font-bold">X</p>
            <p className="text-2xl font-bold mt-36">O</p>
            <p className="text-2xl font-bold">O</p>
           </div>
           </div>
          
        </div>
     
    {/* 오른쪽 콘텐츠 영역 */}
    <div className="flex flex-col w-1/2 h-full p-8">
    <div className="flex justify-end">
      <button 
        onClick={() => {
          // 마이크 일시정지
          if (userMediaStream) {
            userMediaStream.getTracks().forEach(track => {
              track.enabled = false;
            });
          }
          setIsPaused(true);
          setShowModal(true);
        }}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      </button>
    </div>
    <div className="flex flex-col items-center justify-center gap-8 w-full h-full">

   
      <h1 className="text-4xl font-bold text-gray-800">
        {routineData.title || 'Practice'}
      </h1>
  
            {routineData.repeats && (
              <div className="mb-4">
                <p className="text-xl">{currentCount}/{routineData.repeats}회 시행</p>
              </div>
            )}
  
            <div className="relative w-20 h-20 bg-gray-300 rounded-full my-10">
                
              <div 
                className="absolute w-full h-full bg-blue-300 rounded-full transition-all duration-75"
                style={{
                  transform: `scale(${1 + Math.min(volume / 100, 1.5)})`,
                  backgroundColor: volume > 0 ? '#3b82f6' : '#9ca3af'
                }}
              ></div>
              <div className="absolute w-full h-full flex items-center justify-center z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-20 h-20">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
  
            {routineData.bpm && (
              <div>
                <p className="text-lg">{routineData.bpm} BPM</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="-rotate-90 bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-6 text-center">일시정지</h2>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/practice/start')}
                className="flex-1 px-4 py-4 bg-blue-500 text-white rounded-md transition-colors"
              >
                시작 화면으로
              </button>
              <button
                onClick={() => {
                  // 마이크 재개
                  if (userMediaStream) {
                    userMediaStream.getTracks().forEach(track => {
                      track.enabled = true;
                    });
                  }
                  setIsPaused(false);
                  setShowModal(false);
                }}
                className="flex-1 px-4 py-4 bg-gray-200 text-gray-800 rounded-md transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 완료 모달 */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="-rotate-90 bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-6 text-center">연습 완료!</h2>
            <p className="text-center mb-6 text-gray-600">
              {routineData.repeats}회 시행을 모두 완료했습니다.
            </p>
            <button
              onClick={() => {
                // 마이크 종료
                if (userMediaStream) {
                  userMediaStream.getTracks().forEach(track => track.stop());
                }
                navigate('/practice/feedBack');
              }}
              className="w-full px-4 py-4 bg-blue-500 text-white rounded-md transition-colors"
            >
              피드백 확인하기!
            </button>
          </div>
        </div>
      )}
      </div>
    );
  }
  