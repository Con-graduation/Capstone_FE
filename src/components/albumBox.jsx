export default function AlbumBox({Img, title, artist, reason, youtubeLink}) {
    // 15글자마다 줄바꿈을 추가하는 함수
    const formatReason = (text) => {
        if (!text) return '';
        
        const maxLength = 15;
        const words = text.split(' ');
        let result = [];
        let currentLine = '';
        
        words.forEach((word, index) => {
            // 현재 줄에 단어를 추가했을 때의 길이
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            
            if (testLine.length <= maxLength) {
                // 15글자 이하면 현재 줄에 추가
                currentLine = testLine;
            } else {
                // 15글자를 넘으면 현재 줄을 결과에 추가하고 새 줄 시작
                if (currentLine) {
                    result.push(currentLine);
                }
                currentLine = word;
            }
            
            // 마지막 단어면 현재 줄을 결과에 추가
            if (index === words.length - 1 && currentLine) {
                result.push(currentLine);
            }
        });
        
        return result.join('\n');
    };

    return (
        <div className="w-80 h-full bg-white flex flex-col items-center rounded-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-stone-300">
            <img src={Img} alt="album" className="w-80 h-auto object-cover rounded-t-[10px]" />
            <p className="text-base font-bold mt-4">{title}</p>
            <p className="text-sm font-light mb-6">{artist}</p>
            <p className="text-sm font-semibold mb-2">🔍 추천 사유</p>
            <p className="text-sm font-light mb-4 break-words whitespace-pre-line text-center">{formatReason(reason)}</p>
            <a href={youtubeLink} target="_blank" rel="noopener noreferrer">
                {/* <img src={youtubeIcon} alt="youtube" className="w-4 h-4" /> */}
                <p className="text-sm font-light mb-4 text-blue-500 underline">유튜브 보러가기 🎥</p>
            </a>
        </div>
    )
}