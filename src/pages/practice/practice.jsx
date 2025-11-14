import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAudioAnalyzer from '../../hooks/useAudioAnalyzer';
import handIcon from '../../assets/hand.png';
import { postPracticeComplete } from '../../api/practice';

export default function Practice() {
    const location = useLocation();
    const navigate = useNavigate();
    const routineData = location.state;
  const [showModal, setShowModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userMediaStream, setUserMediaStream] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCount, setCurrentCount] = useState(1);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [feedbackData, setFeedbackData] = useState(null);
  // 크로매틱 연습용 상태
  const [chromaticIndex, setChromaticIndex] = useState(0); // 현재 점의 인덱스 (0부터 시작)
  const [chromaticCycleIndex, setChromaticCycleIndex] = useState(0); // 현재 사이클 인덱스
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
    
    // 크로매틱 연습용 점 렌더링 함수
    const renderChromaticGuides = (fingerSequence, chromaticIndex, bpm = 60, isPlaying = true) => {
      if (!fingerSequence || fingerSequence.length === 0) return null;
      
      const actualRows = 6; // 실제 행은 6개로 고정
      const stepsPerCycle = fingerSequence.length * actualRows;
      const cyclesPerRepeat = 9; // 사이클 0~8까지 (총 9개 사이클) = 1회
      const stepsPerRepeat = stepsPerCycle * cyclesPerRepeat;
      const totalSteps = stepsPerRepeat * (routineData.repeats || 0);
      
      if (chromaticIndex >= totalSteps) return null;
      
      // 현재 사이클 번호 계산 (0부터 시작, 전체 사이클)
      const totalCycle = Math.floor(chromaticIndex / stepsPerCycle);
      // 현재 반복 내의 사이클 번호 (0~8)
      const cycleInRepeat = totalCycle % cyclesPerRepeat;
      // 현재 사이클 내 위치 (0 ~ stepsPerCycle-1)
      const positionInCycle = chromaticIndex % stepsPerCycle;
      // 현재 행: 사이클 내 위치를 fingerSequence.length로 나눈 몫
      const rowInCycle = Math.floor(positionInCycle / fingerSequence.length);
      
      // 홀수 사이클(1, 3, 5...): 위로 (마지막 행부터 첫 행까지)
      // 짝수 사이클(0, 2, 4...): 아래로 (첫 행부터 마지막 행까지)
      const isOddCycle = cycleInRepeat % 2 === 1;
      const currentRow = isOddCycle ? (actualRows - 1 - rowInCycle) : rowInCycle;
      
      // 현재 손가락 순서 인덱스: chromaticIndex를 fingerSequence.length로 나눈 나머지
      const fingerIndex = chromaticIndex % fingerSequence.length;
      // 기본 열 번호 매핑: fret 1 = 열 6 (index 5), fret 2 = 열 5 (index 4), ..., fret 6 = 열 1 (index 0)
      let baseColumnNumber = 6 - parseInt(fingerSequence[fingerIndex]); // 열 번호 (0~5, 손가락 1~6)
      
      // 사이클 0~6: 숫자 1~6, 2~7, 3~8, 4~9, 5~10, 6~11, 7~12
      // 사이클 7: 숫자 7~12 고정, 가이드 점 이동(8~11열중 손가락 순서대로)
      // 사이클 8: 숫자 7~12 고정, 가이드 점 이동(9~12열중 손가락 순서대로)
      // 사이클 9: 리셋 (다시 사이클 0부터)
      if (cycleInRepeat === 7) {
        // 사이클 7: 8~11열 (원래 6~9열에서 +2)
        const columnOffset = 2;
        baseColumnNumber = baseColumnNumber - columnOffset;
        if (baseColumnNumber < 0) {
          baseColumnNumber = 0;
        }
      } else if (cycleInRepeat === 8) {
        // 사이클 8: 9~12열 (원래 6~9열에서 +3)
        const columnOffset = 3;
        baseColumnNumber = baseColumnNumber - columnOffset;
        if (baseColumnNumber < 0) {
          baseColumnNumber = 0;
        }
      }
      
      const columnNumber = baseColumnNumber;
      
      // 컬러는 열 번호에 따라 결정: 1열(colorchip[0]), 2열(colorchip[1]), 3열(colorchip[2]), 4열(colorchip[3]) 순서로 반복
      const colorIndex = (5 - columnNumber) % colorchip.length;
      
      const columns = [[], [], [], [], [], []]; // 6개 열
      
      if (columnNumber >= 0 && columnNumber < 6 && currentRow >= 0 && currentRow < 6) {
        columns[columnNumber].push({
          row: currentRow,
          top: lineList[currentRow],
          color: colorchip[colorIndex]
        });
      }
      
      return columns.map((items, colIndex) => 
        items.map((item, idx) => (
          <div
            key={`chromatic-${colIndex}-${idx}-${chromaticIndex}`}
            className="absolute w-8 h-8 rounded-full z-30"
            style={{
              left: '50%',
              top: item.top,
              transform: 'translate(-50%, -50%)',
              backgroundColor: item.color,
              opacity: 1.0,
              animation: isPlaying ? `fadePulse ${(60 / bpm)}s ease-in-out 1` : 'none'
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
    
    async function convertWebMToWav(webmBlob) {
      const arrayBuffer = await webmBlob.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedAudio = await audioCtx.decodeAudioData(arrayBuffer);
    
      const numOfChannels = decodedAudio.numberOfChannels;
      const sampleRate = decodedAudio.sampleRate;
      const numOfFrames = decodedAudio.length;
    
      // 각 채널 데이터를 합쳐서 interleaved PCM 생성
      let interleaved;
      if (numOfChannels === 2) {
        const channelLeft = decodedAudio.getChannelData(0);
        const channelRight = decodedAudio.getChannelData(1);
        interleaved = interleave(channelLeft, channelRight);
      } else {
        interleaved = decodedAudio.getChannelData(0);
      }
    
      // WAV 헤더 생성 + PCM 데이터 결합
      const wavBuffer = encodeWAV(interleaved, sampleRate, numOfChannels);
      return new Blob([wavBuffer], { type: 'audio/wav' });
    }
    
    function interleave(left, right) {
      const length = left.length + right.length;
      const result = new Float32Array(length);
      let index = 0, inputIndex = 0;
      while (index < length) {
        result[index++] = left[inputIndex];
        result[index++] = right[inputIndex];
        inputIndex++;
      }
      return result;
    }
    
    function encodeWAV(samples, sampleRate, numOfChannels) {
      const buffer = new ArrayBuffer(44 + samples.length * 2);
      const view = new DataView(buffer);
    
      // WAV 헤더 작성
      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + samples.length * 2, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numOfChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numOfChannels * 2, true);
      view.setUint16(32, numOfChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, 'data');
      view.setUint32(40, samples.length * 2, true);
    
      // PCM 16bit 변환
      floatTo16BitPCM(view, 44, samples);
    
      return buffer;
    }
    
    function floatTo16BitPCM(output, offset, input) {
      for (let i = 0; i < input.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    }
    
    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }

    
// 마이크 입력 시작 및 녹음
useEffect(() => {
  const initMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setUserMediaStream(stream);

      recordedChunksRef.current = [];

      // 브라우저별 WAV 지원 체크
      let options = { mimeType: 'audio/wav' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/webm;codecs=opus' };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: '' }; // Safari fallback
      }

      console.log("녹음 MIME Type:", options.mimeType);

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          // 1) webm blob 만들기
          const webmBlob = new Blob(recordedChunksRef.current, {
            type: recordedChunksRef.current[0].type
          });
      
          console.log("원본 WEBM:", webmBlob);
      
          // 2) webm → wav 변환
          const wavBlob = await convertWebMToWav(webmBlob);
      
          console.log("WAV Blob:", wavBlob);
      
          // 3) 파일 생성
          const audioFile = new File(
            [wavBlob],
            "practice-audio.wav",
            { type: "audio/wav" }
          );
      
          // 4) 업로드
          const response = await postPracticeComplete(routineData.id, audioFile);
      
          setFeedbackData(response);
          setIsLoading(false);
          setShowCompleteModal(true);
      
        } catch (error) {
          console.error("녹음 데이터 변환/전송 실패:", error);
          setIsLoading(false);
        }
      };
      

      mediaRecorder.start();

    } catch (error) {
      console.error("마이크를 시작할 수 없습니다:", error);
      alert("마이크 권한이 필요합니다.");
      navigate("/practice/start");
    }
  };

  initMicrophone();

  return () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (userMediaStream) {
      userMediaStream.getTracks().forEach(track => track.stop());
    }
  };
}, []);


    // 크로매틱 연습용 타이머 (1bpm당 1개씩 점 이동)
    useEffect(() => {
      if (!routineData || !userMediaStream || isPaused || routineData.routineType !== 'CHROMATIC' || !routineData.sequence) {
        return;
      }
      
      const actualRows = 6; // 실제 행은 6개로 고정
      const fingerSequence = routineData.sequence; // 손가락 순서 배열 (예: ['1', '4', '2', '3'])
      const stepsPerCycle = fingerSequence.length * actualRows; // 한 사이클당 스텝 수
      
      // 9열~12열의 수행을 다 마치면 끝나게: 사이클 0~8까지 (1~4열부터 9~12열까지, 가장 큰 수가 12가 될 때까지) = 1회
      // 사이클 0~6: 숫자 1~6, 숫자 2~7, 숫자 3~8, 숫자 4~9, 숫자 5~10, 숫자 6~11, 숫자 7~12
      // 사이클 7: 숫자 7~12 고정, 가이드 점 이동(8~11열중 손가락 순서대로)
      // 사이클 8: 숫자 7~12 고정, 가이드 점 이동(9~12열중 손가락 순서대로)
      // 리셋 (다시 사이클 0부터)
      const cyclesPerRepeat = 9; // 사이클 0~8까지 (총 9개 사이클) = 1회
      const stepsPerRepeat = stepsPerCycle * cyclesPerRepeat; // 1회당 스텝 수
      const totalSteps = stepsPerRepeat * (routineData.repeats || 0); // 전체 스텝 수
      
      // 1 beat = 60 / BPM 초
      const intervalMs = (60 / routineData.bpm) * 1000;
      
      const timer = setInterval(() => {
        setChromaticIndex(prev => {
          if (prev >= totalSteps - 1) {
            clearInterval(timer);
            return prev;
          }
          
          return prev + 1;
        });
      }, intervalMs);
      
      return () => clearInterval(timer);
    }, [routineData, userMediaStream, isPaused]);
    
    // BPM 기반 인터벌로 시퀀스 인덱스 증가하는 타이머 (코드 전환용)
    useEffect(() => {
      if (!routineData || !userMediaStream || isPaused || routineData.routineType === 'CHROMATIC' || !routineData.sequence) {
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
    const currentRepeat = routineData?.routineType === 'CHROMATIC'
      ? (() => {
          // 크로매틱: 사이클 0~8까지 (1~4열부터 9~12열까지, 가장 큰 수가 12가 될 때까지) 완료해야 1회
          const actualRows = 6;
          const fingerSequence = routineData?.sequence || [];
          if (fingerSequence.length === 0) return 1;
          const stepsPerCycle = fingerSequence.length * actualRows;
          const cyclesPerRepeat = 9; // 사이클 0~8까지 (총 9개 사이클) = 1회
          const stepsPerRepeat = stepsPerCycle * cyclesPerRepeat;
          return Math.floor(chromaticIndex / stepsPerRepeat) + 1;
        })()
      : Math.floor(currentSequenceIndex / (routineData?.sequence?.length || 1)) + 1;
    
    // 크로매틱 완료 체크: repeats 횟수만큼 사이클 0~8 반복 완료 (가장 큰 수가 12가 될 때까지)
    const isCompleted = routineData?.routineType === 'CHROMATIC'
      ? (() => {
          const actualRows = 6;
          const fingerSequence = routineData?.sequence || [];
          if (fingerSequence.length === 0) return false;
          const stepsPerCycle = fingerSequence.length * actualRows;
          const cyclesPerRepeat = 9; // 사이클 0~8까지 (총 9개 사이클) = 1회
          const stepsPerRepeat = stepsPerCycle * cyclesPerRepeat;
          const totalSteps = stepsPerRepeat * (routineData?.repeats || 0);
          return chromaticIndex >= totalSteps - 1;
        })()
      : currentRepeat >= (routineData?.repeats || 0);
    
    // 완료 체크
    useEffect(() => {
      if (routineData && routineData.sequence && isCompleted) {
        // 마지막 시행의 애니메이션이 완료될 시간을 기다림
        const animationDuration = routineData.routineType === 'CHROMATIC'
          ? (60 / (routineData.bpm || 60)) * 1000 // 크로매틱: 1 beat
          : 4 * (60 / (routineData.bpm || 60)) * 1000; // 코드 전환: 4 beats
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
          setIsLoading(true);
        }, animationDuration);
        
        return () => clearTimeout(timeout);
      }
    }, [currentSequenceIndex, chromaticIndex, routineData, userMediaStream, isCompleted]);
  
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
              {routineData?.routineType === 'CHROMATIC' ? (
                // 크로매틱: 사이클에 따라 동적으로 변경 (1~6, 2~7, 3~8... 최대 7~12)
                (() => {
                  const actualRows = 6; // 실제 행은 6개로 고정
                  const maxColumns = 12; // 열은 12개까지
                  const fingerSequence = routineData?.sequence || [];
                  if (fingerSequence.length === 0) {
                    return [...Array(6)].map((_, i) => (
                      <p key={i} className="text-2xl font-bold w-24">{6 - i}</p>
                    ));
                  }
                  
                  // 현재 사이클 번호 계산 (렌더링 함수와 동일한 로직)
                  const stepsPerCycle = fingerSequence.length * actualRows;
                  const cyclesPerRepeat = 9; // 사이클 0~8까지 (총 9개 사이클) = 1회
                  const totalCycle = Math.floor(chromaticIndex / stepsPerCycle);
                  // 현재 반복 내의 사이클 번호 (0~8)
                  const cycleInRepeat = totalCycle % cyclesPerRepeat;
                  
                  // 방향이 바뀔 때마다 숫자 증가 (사이클이 바뀔 때마다)
                  // 사이클 0~6: 숫자 1~6, 2~7, 3~8, 4~9, 5~10, 6~11, 7~12
                  // 사이클 7~8: 숫자 7~12 고정
                  const maxCycle = 6; // 마지막 열이 12가 되는 사이클
                  const cycle = Math.min(cycleInRepeat, maxCycle);
                  const startNumber = cycle + 1; // 사이클 0: 1, 사이클 1: 2, ..., 사이클 6: 7 (사이클 7~8도 7~12)
                  return [...Array(6)].map((_, i) => {
                    const number = startNumber + (5 - i);
                    return <p key={i} className="text-2xl font-bold w-24">{number}</p>;
                  });
                })()
              ) : (
                // 코드 전환: 6~1 표시
                <>
                  <p className="text-2xl font-bold w-24">6</p>
                  <p className="text-2xl font-bold w-24">5</p>
                  <p className="text-2xl font-bold w-24">4</p>
                  <p className="text-2xl font-bold w-24">3</p>
                  <p className="text-2xl font-bold w-24">2</p>
                  <p className="text-2xl font-bold w-24">1</p>
                </>
              )}
            </div>
            <div className="m-4 flex rounded-lg h-full">
   

  {[...Array(6)].map((_, index) => (
    <div
      key={`fret-${index}-${routineData?.routineType === 'CHROMATIC' ? chromaticIndex : currentCode}-${routineData?.routineType === 'CHROMATIC' ? chromaticIndex : currentSequenceIndex}`}
      className={`relative w-24 h-full bg-[#DBBEA2] overflow-visible ${
        index === 0 ? 'border-r border-black rounded-l-lg' : 
        index === 5 ? 'border-l border-black rounded-r-lg' : 
        'border-x border-black'
      }`}
    >
      {/* 항상 6개 행 */}
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="absolute left-0 w-full border-t border-black"
          style={{ top: `${(i + 1) * (100 / 6) - 8}%` }}
        />
      ))}
      {/* 가이드 점 */}
      {routineData?.routineType === 'CHROMATIC' 
        ? renderChromaticGuides(routineData?.sequence, chromaticIndex, routineData?.bpm || 60, !isCompleted)[index]
        : renderCodeGuides(currentCode, currentSequenceIndex, routineData?.bpm || 60, !isCompleted)[index]
      }
    </div>
  ))}
  {routineData?.routineType === 'CODE' ? (
          <div className="h-full py-12 flex flex-col justify-between ml-2">
            <p className="text-2xl font-bold">X</p>
            <p className="text-2xl font-bold mt-36">O</p>
            <p className="text-2xl font-bold">O</p>
           </div>
           ) : (<></>)}
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
        className="p-0 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      </button>
    </div>
    <div className="flex flex-col items-center justify-center w-full h-full">

   
      <h1 className="text-2xl font-bold text-gray-800">
        {routineData.title || 'Practice'}
      </h1>
      
      <div className="text-lg font-bold text-gray-800">
        {routineData?.routineType === 'CHROMATIC' 
          ? ``
          : `현재 코드: ${currentCode}`
        }
      </div>
  
            {routineData.repeats && (
              <div className="mb-4">
                <p className="text-sm">{currentRepeat}/{routineData.repeats}회 시행</p>
              </div>
            )}
  
            <div className="relative w-20 min-h-20 bg-gray-300 rounded-full my-10 flex items-center justify-center">
                
              <div 
                className="absolute w-24 h-24 bg-blue-300 opacity-80 rounded-full transition-all duration-75"
                style={{
                  transform: `scale(${1 + Math.min(volume / 100, 1.5)})`,
                  backgroundColor: volume > 0 ? '#3b82f6' : '#9ca3af',
                  aspectRatio: '1 / 1'
                }}
              ></div>
              <div className="absolute w-full h-full flex items-center justify-center z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-20 h-20">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>

          <div className="flex items-center justify-between gap-2 w-3/4">
            <img src={handIcon} alt="handIcon" className="w-12 h-12" />
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
      
      {/* 로딩 모달 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="-rotate-90 bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-6 text-center">결과 분석 중...</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-center mt-6 text-gray-600">
              잠시만 기다려주세요
            </p>
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
                navigate('/practice/feedBack', { state: { feedbackData } });
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
  