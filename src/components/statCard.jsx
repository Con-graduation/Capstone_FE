import twinkle from '../assets/twinkle.svg';

export default function StatCard({ title, value, unit, twinkleAnimation1, twinkleAnimation2 }) {
    return (
        <div className="relative bg-white border border-gray-200 shadow-md rounded-md p-4 flex flex-col items-center justify-center h-48 gap-0">
            <img src={twinkle} alt="twinkle" className="absolute top-16 left-4 w-10 h-10 twinkle-animation-1" />
            <img src={twinkle} alt="twinkle" className="absolute top-4 left-24 w-10 h-10 twinkle-animation-2" />
            <div className="flex items-end gap-2">
            <span className="text-7xl font-bold font-madimi text-stroke-blue">{value}</span>
            <span className="text-md font-regular mb-2">{unit}</span>
            </div>
           
            <p className="text-lg font-regular mt-4">{title}</p>
        </div>
    )
}