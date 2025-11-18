import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AlbumBox from '../../components/albumBox';
import basicAlbumImg from '../../assets/basicAlbumImg.png';
import updateIcon from '../../assets/updateIcon.svg';


export default function RecommendResult() {
    const location = useLocation();
    const responseData = location.state?.response || null;
    const genre = location.state?.genre || '';
    const nickname = localStorage.getItem("nickname");
    
    // YouTube URL에서 video ID 추출
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        
        // 3가지 YouTube URL 형식 모두에서 ID를 추출할 수 있게 코드 작성
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    };
    
    // YouTube 썸네일 URL 생성
    const getYouTubeThumbnail = (youtubeLink) => {
        const videoId = getYouTubeVideoId(youtubeLink);
        if (!videoId) return basicAlbumImg; // 기본 이미지
        
        // 최고 품질 썸네일 시도, 없으면 고품질 사용
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    };
    
    // API 응답이 배열인지 확인하고 안전하게 처리
    const getAlbumList = () => {
        if (!responseData) return [];
        
        // 단일 객체인 경우 배열로 변환
        let dataArray = [];
        if (Array.isArray(responseData)) {
            dataArray = responseData;
        } else if (responseData.data && Array.isArray(responseData.data)) {
            dataArray = responseData.data;
        } else if (responseData.songs && Array.isArray(responseData.songs)) {
            dataArray = responseData.songs;
        } else if (typeof responseData === 'object' && responseData.songTitle) {
            // 단일 객체인 경우 배열로 변환
            dataArray = [responseData];
        } else {
            return [];
        }
        
        // 배열을 앨범 리스트로 변환
        return dataArray.map((item, index) => ({
            id: item.id || index,
            title: item.songTitle || item.title || '',
            artist: item.artist || '',
            youtubeLink: item.youtubeLink || '',
            reason: item.reason || '',
            recommendedBpm: item.recommendedBpm || null,
            image: item.image || item.albumCover || getYouTubeThumbnail(item.youtubeLink)
        }));
    };
    
    const albumList = getAlbumList();
    // console.log('Response Data:', responseData);
    // console.log('Album List:', albumList);
   

    return (
        <div className="min-h-screen w-screen bg-[#EEF5FF] flex flex-col gap-4 pt-10 items-center px-8 pb-16">
            <h1 className="text-2xl font-bold">맞춤 곡 추천</h1>
            <div className="w-full mt-8 bg-white rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-stone-300 flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold text-center">AI가 <span className="font-bold text-blue-600">{nickname}</span>님의 취향에 맞는<br/> 곡을 분석했어요! ☺️</h2>
                <p className="text-md font-regular text-center mt-4">{nickname}님은 <span className="font-bold text-blue-600">{albumList[0].recommendedBpm}BPM</span>에서 <br/>가장 높은 정확도를 연주했어요!</p>
                {genre && <p className="text-md font-regular text-center mt-2"><span className="font-bold text-blue-600">"{albumList[0].recommendedBpm}BPM의 {genre} 장르"</span> 곡을 추천해드릴게요!</p>}
                </div>
           
            {albumList.length > 0 ? (
                <>
                    {albumList.map((album) => (
                        <AlbumBox 
                            key={album.id}
                            Img={album.image}
                            title={album.title}
                            artist={album.artist}
                            reason={album.reason}
                            youtubeLink={album.youtubeLink}
                        />
                    ))}
                    {/* <div className="flex items-center gap-2 justify-end w-full px-8 ">
                        <p className="text-sm font-light ">또 다른 곡</p>
                        <img 
                            src={updateIcon} 
                            alt="updateIcon" 
                            className={`w-4 h-4 cursor-pointer transition-transform duration-500 ${isRotating ? 'rotate-180' : ''}`}
                            onClick={handleRefresh}
                        />
                    </div> */}
                </>
            ) : (
                <p className="text-gray-600 mt-8">추천된 곡이 없습니다.</p>
            )}

            
        </div>
    )
}