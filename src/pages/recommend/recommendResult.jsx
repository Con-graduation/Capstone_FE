import { useState } from 'react';
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
        <div className="min-h-screen w-screen bg-[#EEF5FF] flex flex-col gap-4 pt-10 items-center">
            <h1 className="text-2xl font-bold">맞춤 곡 추천</h1>
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

             <div className="flex flex-col items-center max-w-96 mt-10 pb-24">
                <div className="flex flex-col items-center mb-8">
                <h1 className="text-2xl font-bold">곡 추천 수동 설정</h1>
                 <p className="text-sm font-light mt-4">원하는 코드와 BPM을</p>
                 <p className="text-sm font-light">선택해주세요!</p>
                </div>
                
                 <div className="flex gap-4 w-64 mx-auto">
                 <DropDown 
                         title="코드" 
                         options={['C', 'D', 'E', 'F', 'G', 'A', 'B']}
                         selectedValue={selectedCode}
                         onSelect={setSelectedCode}
                     />
                     <DropDown 
                         title="BPM" 
                         options={['60', '70', '80', '90', '100', '110', '120', '130', '140', '150']}
                         selectedValue={selectedBPM}
                         onSelect={setSelectedBPM}
                     />
                    
                 </div>
                 <button 
                     className="w-72 bg-blue-500 text-white rounded-md px-4 py-1 mt-8 mx-auto"
                     onClick={handleManualRecommend}
                 >
                     선택한 설정으로 곡 추천 받기
                 </button>
                 {showWarning && (
                     <p className="text-sm font-light mt-2 text-center text-red-500">
                         곡 설정을 완료해주세요!
                     </p>
                 )}
                 
                 {manualAlbums.length > 0 && (
                     <div className="mt-10">
                         <h2 className="text-xl font-bold text-center mb-4">
                             {selectedCode}코드 & {selectedBPM}BPM 추천 곡
                         </h2>
                         <div className="flex flex-col gap-4">
                             {manualAlbums.map((album) => (
                                 <AlbumBox 
                                     key={`manual-${album.id}`}
                                     Img={album.image}
                                     title={album.title}
                                     artist={album.artist}
                                 />
                             ))}
                         </div>
                     </div>
                 )}

             </div>
          
        </div>
    )
}