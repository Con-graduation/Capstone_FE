import { useEffect, useState } from "react";
import useAudioAnalyzer from "../../hooks/useAudioAnalyzer";
import useMicVolume from "../../hooks/useMicVolume";

export default function Audio() {
  const [userMediaStream, setUserMediaStream] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState('');

  const {
    volume: micVolume,
    setVolume: setMicVolume,
    startMic,
    stopMic
  } = useMicVolume();

  const volume = useAudioAnalyzer(userMediaStream, micVolume);

  const requestMicrophoneAccess = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setUserMediaStream(stream);
      setIsTesting(true);

      // 테스트 시작 시 감도 적용
      startMic();
    } catch (err) {
      console.error("마이크 접근 실패:", err);
      setError("마이크 접근이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.");
    }
  };

  const stopTesting = () => {
    if (userMediaStream) {
      userMediaStream.getTracks().forEach(track => track.stop());
      setUserMediaStream(null);
    }
    stopMic();
    setIsTesting(false);
  };

  useEffect(() => {
    return () => {
      if (userMediaStream) {
        userMediaStream.getTracks().forEach(track => track.stop());
      }
      stopMic();
    };
  }, [userMediaStream]);

  return (
    <div className="min-h-screen w-screen bg-[#EEF5FF] flex flex-col items-center pt-10 gap-20">
      <h1 className="text-2xl font-bold">음향 설정</h1>
{/* 입력 감도 조정 */}
<div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold">입력 감도 조정</h2>
          <input
  type="range"
  min={0}
  max={2}
  step={0.01}
  value={micVolume}
  onChange={(e) => setMicVolume(parseFloat(e.target.value))}
  disabled={isTesting}
  className={`w-64 h-2 rounded-lg appearance-none bg-gray-300
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:w-5
    [&::-webkit-slider-thumb]:h-5
    [&::-webkit-slider-thumb]:rounded-full
    [&::-moz-range-thumb]:w-5
    [&::-moz-range-thumb]:h-5
    [&::-moz-range-thumb]:rounded-full
    ${isTesting
      ? '[&::-webkit-slider-thumb]:bg-gray-500 [&::-moz-range-thumb]:bg-gray-500'
      : '[&::-webkit-slider-thumb]:bg-blue-500 [&::-moz-range-thumb]:bg-blue-500'
    }`}
  style={{ cursor: isTesting ? 'not-allowed' : 'pointer' }}
/>

          {/* <p className="text-sm">현재 감도: {micVolume.toFixed(2)}</p> */}
        </div>
      {/* 입력 레벨 테스트 */}
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold">입력 레벨 테스트</h2>

        <div className="flex flex-col items-center gap-4">
          {isTesting ? (
            <p className="">현재 볼륨: {Math.round(volume)}</p>
          ) : (
            <p className="text-gray-600 text-center">
              아래 버튼을 터치해 입력 테스트를 실행합니다!
            </p>
          )}
          
          <VolumeBar volume={isTesting ? volume : 0} />
          
          {!isTesting ? (
            <button
              onClick={requestMicrophoneAccess}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              테스트하기
            </button>
          ) : (
            <button
              onClick={stopTesting}
              className="px-6 py-3 bg-red-500 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              테스트 중지
            </button>
          )}
        </div>

        <p className="text-sm text-center">소음이 많은 환경에서는<br/>
        인식이 어려울 수 있어요</p>

        

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center max-w-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}


function VolumeBar({ volume }) {
  const n = 10;
  
  const getColor = (index) => {
    if (index < 3) return "bg-green-400";
    if (index < 6) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="flex justify-center gap-1">
      {[...Array(n)].map((_, index) => (
        <div
          key={index}
          className={`w-5 h-16 rounded-md transition-colors duration-100 ${
            volume / 10 > index ? getColor(index) : "bg-white/30"
          }`}
        ></div>
      ))}
    </div>
  );
}
