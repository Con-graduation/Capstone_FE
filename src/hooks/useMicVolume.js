import { useEffect, useRef, useState } from "react";

export default function useMicVolume() {
  // localStorage에서 초기 볼륨 불러오기
  const getInitialVolume = () => {
    const savedVolume = localStorage.getItem('micVolume');
    if (savedVolume) {
      const volumeValue = parseFloat(savedVolume);
      if (!isNaN(volumeValue) && volumeValue >= 0.5 && volumeValue <= 3) {
        return volumeValue;
      }
    }
    return 0.5; // 기본값
  };

  const [volume, setVolume] = useState(getInitialVolume);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  const startMic = async () => {
    if (!selectedDeviceId) return;

    // 기존 스트림 종료
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDeviceId },
      });
      audioStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      gainNodeRef.current = gainNode;

      source.connect(gainNode).connect(audioContext.destination);
    } catch (err) {
      console.error("마이크 권한 실패:", err);
    }
  };

  const stopMic = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      gainNodeRef.current = null;
    }
  };

  // 볼륨 변경 시 GainNode에 반영
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  return {
    volume,
    setVolume,
    selectedDeviceId,
    setSelectedDeviceId,
    startMic,
    stopMic,
  };
};
