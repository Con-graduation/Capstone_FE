import { useEffect, useState, useRef } from "react";

const useAudioAnalyzer = (stream, gainValue = 1) => {
  const [volume, setVolume] = useState(0);
  const gainRef = useRef(gainValue);
  gainRef.current = gainValue;

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = gainRef.current; 
    source.connect(gainNode).connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    let frameId;

    const analyze = () => {
      //  감도 반영
      gainNode.gain.value = gainRef.current;

      analyser.getFloatTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / bufferLength);

      setVolume(rms * 200 * gainRef.current); // 최대값 제한 제거
      frameId = requestAnimationFrame(analyze);
    };

    analyze();

    return () => {
      cancelAnimationFrame(frameId);
      audioContext.close();
    };
  }, [stream]);

  return volume;
};

export default useAudioAnalyzer;
