export default function ShortFeedback({type, text, page}) {
    return (
        <>
        {page === "recommend" && (
        <div className="py-4 w-80 bg-white rounded-md shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-stone-300 flex items-center justify-center px-8">
            {type === "bpm" && (
               <p className="text-2xl w-1/3">🥁</p>
            )}
            {type === "code" && (
            <p className="text-2xl w-1/3">🎼</p>
            )}
            <div className="w-2/3">
            <div className="flex items-center">
                {type === "bpm" && (
                    <>
                    <span className="text-lg font-bold text-gray-800">{text}BPM</span><span>을</span>
                    </>
                )}
                {type === "code" && (
                    <>
                    <span className="text-lg font-bold text-gray-800">{text}코드</span><span>를</span>
                    </>
                )}
                <span>최근에</span>
                </div>
                <p>많이 연습했어요</p>
            </div>
        </div>
        )}
        </>
    )
}