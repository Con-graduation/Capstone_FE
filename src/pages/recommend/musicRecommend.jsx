import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loadingGif from '../../assets/loading.gif';
import ShortFeedback from '../../components/shortFeedback';
import DropDown from '../../components/dropDown';
import { postMusicRecommend } from '../../api/mcp';


export default function MusicRecommend() {
    const navigate = useNavigate();
    const nickname = localStorage.getItem("nickname");
    const [selectedGenre, setSelectedGenre] = useState('');
    const [loading, setLoading] = useState(false);

    // 드롭다운에 표시할 한글 장르 목록
    const genres = ['팝', '록', '재즈', '어쿠스틱', '발라드', 'R&B', '컨트리', '메탈', 'J-POP'];
    
    // 한글 장르를 영문으로 변환하는 매핑 객체
    const genreMapping = {
        '팝': 'pop',
        '록': 'rock',
        '재즈': 'jazz',
        '어쿠스틱': 'acoustic',
        '발라드': 'ballad',
        'R&B': 'rnb',
        '컨트리': 'country',
        '메탈': 'metal',
        'J-POP': 'jpop'
    };

    const handleMusicRecommend = async () => {
        if (!selectedGenre) {
            alert('장르를 선택해주세요.');
            return;
        }
        const englishGenre = genreMapping[selectedGenre];
        if (englishGenre) {
            try {
                setLoading(true);
                const response = await postMusicRecommend(englishGenre);
                // console.log(response);
                // API 호출 성공 후 결과 페이지로 이동
                navigate('/recommend/result', { state: { genre: selectedGenre, response: response.data } });
            } catch (error) {
                console.error('곡 추천 실패:', error);
                alert('곡 추천 중 오류가 발생했습니다. 다시 시도해주세요.');
            } finally {
                setLoading(false);
            }
        }
    };
  return (
    <>
    {loading && (
    <div className="h-[calc(100vh-8rem)] w-screen bg-[#EEF5FF] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center">맞춤 곡 추천</h1>
      <img src={loadingGif} alt="loading" className="w-48 h-48" />
      <p className="text-xl font-semibold ">연습 기록을 기반으로</p>
      <p className="text-xl font-semibold ">난이도를 분석하는 중...</p>
    </div>)}
    {!loading && (
        <div className="h-[calc(100vh-8rem)] w-screen bg-[#EEF5FF] flex flex-col items-center pt-10 px-6">
        <h1 className="text-2xl font-bold">맞춤 곡 추천</h1>
             {/* 설명 카드 */}
             <div className="w-full mt-12 bg-white rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-stone-300 flex flex-col items-center justify-center p-6">
                    <p className="text-base font-medium text-center text-gray-700 leading-relaxed">
                        장르만 골라주시면,<br/>AI가 <span className="font-bold text-blue-600">{nickname}</span>님의 연습 기록 중 <br/><span className="font-bold text-blue-600">BPM</span>을 바탕으로
                    </p>
                    <p className="text-base font-medium text-center text-gray-700 mt-2">
                        <span className="font-bold text-blue-600">"장르 + BPM 기반 추천"</span> 곡을 추천해드릴게요!
                    </p>
                </div>
            <div className="flex flex-col gap-6 items-center mt-12 w-full max-w-md">
                {/* 장르 선택 */}
                <div className="w-full">
                    <label className="block text-lg font-semibold mb-3 text-center">장르 선택</label>
                    <DropDown 
                        title="장르를 선택해주세요" 
                        options={genres} 
                        selectedValue={selectedGenre || "장르를 선택해주세요"} 
                        onSelect={setSelectedGenre} 
                    />
                </div>

               

                {/* 곡 추천 받기 버튼 */}
                <button 
                    className="w-full py-3 bg-blue-500 text-white rounded-md font-bold mt-4 hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => {
                        handleMusicRecommend();
                        window.scrollTo(0, 0);
                    }}
                    disabled={!selectedGenre}
                >
                    곡 추천 받기
                </button>
            </div>
        </div>
    )}
    </>
  );
}