import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAudioAnalyzer from '../../hooks/useAudioAnalyzer';
import { postPractice } from '../../api/practice';
import handIcon from '../../assets/hand.png';

export default function Practice() {
    const location = useLocation();
    const navigate = useNavigate();
    const routineData = location.state;
  const [showModal, setShowModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [userMediaStream, setUserMediaStream] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCount, setCurrentCount] = useState(1);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
    const colorchip = ["#FF5757", "#FFE957", "#76DB33", "#69B6DA"]
    const lineList = ["8.5%", "25.5%", "42%", "59%", "75%", "92%"]
    
   const codeLocation = {
    "C": [
      {fret: "1", line: lineList[4], color: colorchip[0]},
      {fret: "2", line: lineList[2], color: colorchip[1]},
      {fret: "3", line: lineList[1], color: colorchip[2]},
    ],
    "D": [
      {fret: "2", line: lineList[3], color: colorchip[0]},
      {fret: "2", line: lineList[5], color: colorchip[1]},
      {fret: "3", line: lineList[4], color: colorchip[2]},
    ],
    "E": [
      {fret: "1", line: lineList[3], color: colorchip[0]},
      {fret: "2", line: lineList[1], color: colorchip[1]},
      {fret: "2", line: lineList[2], color: colorchip[2]},
    ],
    "G": [
      {fret: "2", line: lineList[1], color: colorchip[0]},
      {fret: "3", line: lineList[0], color: colorchip[1]},
      {fret: "3", line: lineList[5], color: colorchip[2]},
    ],
    "A": [
      {fret: "2", line: lineList[2], color: colorchip[0]},
      {fret: "2", line: lineList[3], color: colorchip[1]},
      {fret: "2", line: lineList[4], color: colorchip[2]},
    ],
    "Am":[
      {fret: "1", line: lineList[5], color: colorchip[0]},
      {fret: "2", line: lineList[2], color: colorchip[1]},
      {fret: "2", line: lineList[3], color: colorchip[2]},
    ],
    "Em":[
      {fret: "2", line: lineList[1], color: colorchip[0]},
      {fret: "2", line: lineList[2], color: colorchip[1]},
    ]
   }
    
    // C 코드의 가이드 점을 그리기 위한 함수
    const renderCodeGuides = (codeName, sequenceIndex, bpm = 60, isPlaying = true) => {
      const code = codeLocation[codeName];
      if (!code) return null;
      
      const columns = [[], [], [], [], [], []]; // 6개 열
      
      code.forEach(item => {
        const columnIndex = 6 - parseInt(item.fret); // fret 1 = 열 6 (index 5), fret 2 = 열 5 (index 4), ...
        if (columnIndex >= 0 && columnIndex < 6) {
          columns[columnIndex].push(item);
        }
      });
      
      return columns.map((items, colIndex) => 
        items.map((item, idx) => (
          <div
            key={`${colIndex}-${idx}-${sequenceIndex}`}
            className="absolute w-8 h-8 rounded-full z-30"
            style={{
              left: '50%',
              top: item.line,
              transform: 'translate(-50%, -50%)',
              backgroundColor: item.color,
              opacity: 1.0,
              animation: isPlaying ? `fadePulse ${(60 / bpm)}s ease-in-out 4` : 'none'
            }}
          />
        ))
      );
    }
    
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
    
    // BPM 기반 인터벌로 시퀀스 인덱스 증가하는 타이머
    useEffect(() => {
      if (!routineData || !userMediaStream || isPaused || !routineData.sequence) {
        return;
      }
      
      const beatsPerCode = 4; // 각 코드마다 4번 반복
      // 1 beat = BPM/60 초, 4 beats = 4 * (BPM/60) 초
      const intervalMs = (4 * (60 / routineData.bpm)) * 1000;
      const totalBeats = routineData.repeats * routineData.sequence.length;
      
      const timer = setInterval(() => {
        setCurrentSequenceIndex(prev => {
          if (prev >= totalBeats - 1) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
      
      return () => clearInterval(timer);
    }, [routineData, userMediaStream, isPaused]);
    
    // 현재 코드 계산
    const currentCode = routineData?.sequence 
      ? routineData.sequence[currentSequenceIndex % routineData.sequence.length]
      : '';
    
    // 현재 시행 횟수 계산
    const currentRepeat = Math.floor(currentSequenceIndex / (routineData?.sequence?.length || 1)) + 1;
    const isCompleted = currentRepeat >= (routineData?.repeats || 0);
    
    // 완료 체크
    useEffect(() => {
      if (routineData && routineData.sequence && isCompleted) {
        // 마지막 시행의 애니메이션이 완료될 시간을 기다림 (4 * (60 / bpm)초)
        const animationDuration = 4 * (60 / (routineData.bpm || 60)) * 1000;
        const timeout = setTimeout(() => {
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
        }, animationDuration);
        
        return () => clearTimeout(timeout);
      }
    }, [currentSequenceIndex, routineData, userMediaStream, isCompleted]);
  
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
            <div className="flex mt-4 w-full text-center pl-4">
                <p className="text-2xl font-bold w-24">6</p>
                <p className="text-2xl font-bold w-24">5</p>
                <p className="text-2xl font-bold w-24">4</p>
                <p className="text-2xl font-bold w-24">3</p>
                <p className="text-2xl font-bold w-24">2</p>
                <p className="text-2xl font-bold w-24">1</p>
            </div>
            <div className="m-4 flex rounded-lg h-full">
   

  {[...Array(6)].map((_, index) => (
    <div
      key={`fret-${index}-${currentCode}-${currentSequenceIndex}`}
      className={`relative w-24 h-full bg-[#DBBEA2] overflow-visible ${
        index === 0 ? 'border-r border-black rounded-l-lg' : 
        index === 5 ? 'border-l border-black rounded-r-lg' : 
        'border-x border-black'
      }`}
    >
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="absolute left-0 w-full border-t border-black"
          style={{ top: `${(i + 1) * (100 / 6) - 8}%` }}
        />
      ))}
      {/* 현재 코드 가이드 점 */}
      {renderCodeGuides(currentCode, currentSequenceIndex, routineData?.bpm || 60, !isCompleted)[index]}
    </div>
  ))}
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
      
      <div className="text-2xl font-bold text-gray-800">
        현재 코드: {currentCode}
      </div>
  
            {routineData.repeats && (
              <div className="mb-4">
                <p className="text-xl">{Math.floor(currentSequenceIndex / (routineData.sequence?.length || 1)) + 1}/{routineData.repeats}회 시행</p>
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

          <div className="flex items-center justify-between gap-2 w-3/4">
            <img src={handIcon} alt="handIcon" className="w-20 h-full" />
            {routineData.bpm && (
              <div>
                <p className="text-lg">{routineData.bpm} BPM</p>
              </div>
            )}
          </div>
           
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
  