import rightArrow from '../assets/rightArrow.svg';
import DropDown from '../components/dropDown';
import BarChart from '../components/BarChart';

export default function PracticeStart() {

  return (
    <div className="min-h-screen w-screen bg-[#EEF5FF] flex flex-col px-6 pb-24">
        <h1 className="text-2xl font-bold text-center mt-10">연습 시작</h1>
        <div className="flex flex-col items-center justify-center mt-10 gap-10 w-full">
            <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-semibold">루틴 선택하기</h2>
                <div className="flex items-center gap-1 border-b border-black">
                  <a href="#" className="text-sm ">루틴 생성하러 가기</a>
                  <img src={rightArrow} alt="rightArrow" className="w-3 h-3" />
                 </div>
            </div>

            <DropDown title="루틴 선택" options={['루틴 1', '루틴 2', '루틴 3']} selectedValue="루틴 선택" onSelect={() => {}} />

            <div className="flex flex-col items-center justify-center gap-4 w-full">
                <h2 className="text-xl font-semibold">루틴 별 연습 통계</h2>
                
          <div>
          <BarChart 
            title="루틴 별 연습 횟수" 
            description="막대를 터치해주세요!" 
          />
          </div>
            </div>
        </div>
    </div>
  )
}