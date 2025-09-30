export default function LongFeedback({imoji, text, page}) {
    return (
        <>
        {page === "recommend" && (
        <div className="w-80 bg-white rounded-md shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] border border-stone-300 flex flex-col items-center justify-center p-8">
           <p className="text-2xl">{imoji}</p>
           <p className=" text-sm font-light">최근 연습 기록을 분석한 결과,</p>
           <div className="flex items-center">
            <span className="text-sm font-bold">{text}</span><span className="text-sm font-light">와</span>
           </div>
           <p className="text-sm font-light">관련된 곡을 추천해드릴게요!</p>
        </div>
        )}
        </>
    )
}