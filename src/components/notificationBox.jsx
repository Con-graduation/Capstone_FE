export default function NotificationBox( {title, startDate, endDate, time, repeatInterval, connectedGoogleCalendar}) {
    return (
        <div className="">
        <div className="flex flex-col bg-white rounded-lg  max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-center border-b border-gray-300 p-4 w-full">{title}</h2>
            <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg text-black font-normal">시작 날짜</p>
                    <p className="text-lg text-black font-light">{startDate}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-lg text-black font-normal">종료 날짜</p>
                    <p className="text-lg text-black font-light">{endDate ? endDate : "-"}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-lg text-black font-normal">반복 간격</p>
                    <p className="text-lg text-black font-light">{repeatInterval}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-lg text-black font-normal">시간</p>
                    <p className="text-lg text-black font-light">{time}</p>
                </div>
            </div>
        </div>
        {connectedGoogleCalendar && (
               <p className="mt-2 text-md text-gray-500 font-light">구글 캘린더 연동 ✅</p>
            )}
    </div>
  );
}