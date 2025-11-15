import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AlbumBox from '../../components/albumBox';
import album1 from '../../assets/albumCover/album1.jpeg';
import album2 from '../../assets/albumCover/album2.jpeg';
import album3 from '../../assets/albumCover/album3.jpeg';
import album4 from '../../assets/albumCover/album4.jpeg';
import album5 from '../../assets/albumCover/album5.jpeg';
import album6 from '../../assets/albumCover/album6.png';
import album7 from '../../assets/albumCover/album7.jpg';
import album8 from '../../assets/albumCover/album8.jpg';
import updateIcon from '../../assets/updateIcon.svg';
import DropDown from '../../components/dropDown';

export default function RecommendResult() {
    const location = useLocation();
    const genre = location.state?.genre || '';
    const nickname = localStorage.getItem("nickname");
    const albumList = [
        {
            id: 1,
            title: 'American Idiot',
            artist: 'Green Day',
            image: album1
        },
        {
            id: 2,
            title: 'Last Night On Earth',
            artist: 'Green Day',
            image: album2
        },
        {
            id: 3,
            title: 'Smells Like Teen Spirit',
            artist: 'Nirvana',
            image: album3
        },
        {
            id: 4,
            title: 'Back in Black',
            artist: 'AC/DC',
            image: album4
        },
        {
            id: 5,
            title: 'basket case',
            artist: 'Green Day',
            image: album5
        },
        {
            id: 6,
            title: 'Don\'t Look Back in Anger',
            artist: 'Oasis',
            image: album6
        },
        {
            id: 7,
            title: 'Abbey Road',
            artist: 'The Beatles',
            image: album7
        },
        {
            id: 8,
            title: 'By the Way',
            artist: 'Red Hot Chili Peppers',
            image: album8
        },
    ];

    // 4개의 앨범을 랜덤으로 선택하는 함수 -> 나중에는 곡 가져오기
    const getRandomAlbums = (albums, count) => {
        const shuffled = [...albums].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const [randomAlbums, setRandomAlbums] = useState(() => getRandomAlbums(albumList, 4));
    const [isRotating, setIsRotating] = useState(false);
    const [selectedBPM, setSelectedBPM] = useState('');
    const [selectedCode, setSelectedCode] = useState('');
    const [manualAlbums, setManualAlbums] = useState([]);
    const [showWarning, setShowWarning] = useState(false);

    const handleRefresh = () => {
        setIsRotating(true);
        setTimeout(() => {
            setRandomAlbums(getRandomAlbums(albumList, 4));
            setIsRotating(false);
        }, 500);
    };

    const handleManualRecommend = () => {
        if (!selectedBPM || !selectedCode) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
            return;
        }
        setManualAlbums(getRandomAlbums(albumList, 4));
        setShowWarning(false);
    };

    return (
        <div className="min-h-screen w-screen bg-[#EEF5FF] flex flex-col gap-4 pt-10 items-center px-8">
            <h1 className="text-2xl font-bold">맞춤 곡 추천</h1>
            <div className="w-full mt-8 bg-white rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-stone-300 flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold text-center">AI가 <span className="font-bold text-blue-600">{nickname}</span>님의 취향에 맞는<br/> 곡을 분석했어요! ☺️</h2>
                <p className="text-md font-regular text-center mt-4">{nickname}님은 <span className="font-bold text-blue-600">120BPM</span>에서 <br/>가장 높은 정확도를 연주했어요!</p>
                {genre && <p className="text-md font-regular text-center mt-2"><span className="font-bold text-blue-600">"120BPM의 {genre} 장르"</span> 곡을 추천해드릴게요!</p>}
                </div>
           
            {randomAlbums.map((album) => (
                <AlbumBox 
                    key={album.id}
                    Img={album.image}
                    title={album.title}
                    artist={album.artist}
                />
            ))}
            <div className="flex items-center gap-2 justify-end w-full px-8 ">
                <p className="text-sm font-light ">또 다른 곡</p>
                <img 
                    src={updateIcon} 
                    alt="updateIcon" 
                    className={`w-4 h-4 cursor-pointer transition-transform duration-500 ${isRotating ? 'rotate-180' : ''}`}
                    onClick={handleRefresh}
                />
            </div>

            
        </div>
    )
}