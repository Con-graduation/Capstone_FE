import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loadingGif from '../../assets/loading.gif';
import ShortFeedback from '../../components/shortFeedback';
import LongFeedback from '../../components/longFeedback';

export default function MusicRecommend() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);

  return (
    <>
    {loading && (
    <div className="min-h-screen w-full bg-[#EEF5FF] max-w-96 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center">맞춤 곡 추천</h1>
      <img src={loadingGif} alt="loading" className="w-48 h-48" />
      <p className="text-xl font-semibold ">연습 기록을 기반으로</p>
      <p className="text-xl font-semibold ">난이도를 분석하는 중...</p>
    </div>)}
    {!loading && (
        <div className="min-h-screen w-full bg-[#EEF5FF] max-w-96 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-center">맞춤 곡 추천</h1>
            <h2 className="text-xl font-semibold mt-12 mb-6">김시은님의 연습 기록을 분석한 결과</h2>
            <div className="flex flex-col gap-4">
            <ShortFeedback type="bpm" text="120" page="recommend" />
            <ShortFeedback type="code" text="C" page="recommend" />
            </div>
            <div className="flex flex-col gap-2 items-center mt-12">
                <LongFeedback imoji="😎" text="120BPM & C코드" page="recommend" />
                <p className="text-[10px] font-light">수동 설정을 통한 곡 추천 받기도 가능합니다.</p>
            </div>
            <button className="w-80 py-2 bg-blue-500 text-white rounded-md font-bold mt-10"
            onClick={() => navigate('/recommend/result')}
            >곡 추천 받기</button>
           
        </div>
    )}
    </>
  );
}