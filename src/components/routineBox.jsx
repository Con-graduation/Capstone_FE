export default function RoutineBox({title, description, lastDate, component}) {
  return (
    <div className="w-40 h-64 bg-white rounded-md flex flex-col items-start justify-center gap-2 shadow-md px-4 hover:shadow-lg cursor-pointer transition-all duration-300 flex-shrink-0">
      <p className="text-xl font-bold text-gray-800">{title}</p>
      <div>
      <p className="text-md text-black font-semibold">연습 내용</p>
      <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div>
      <p className="text-md text-black font-semibold">최근 연습 날짜</p>
      <p className="text-sm text-gray-600">{lastDate}</p>
      </div>
      <p className="text-md text-black font-semibold">구성 요소</p>
      <p className="text-sm text-gray-600">
        {component && component.join(', ')}
      </p>
    </div>
  );
}