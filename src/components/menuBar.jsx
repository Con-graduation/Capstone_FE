import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import menu1Icon from '../assets/menu1Icon.svg';
import menu2Icon from '../assets/menu2Icon.svg';
import menu3Icon from '../assets/menu3Icon.svg';
import menu4Icon from '../assets/menu4Icon.svg';
import menu5Icon from '../assets/menu5Icon.svg';

export default function MenuBar() {
    const navigate = useNavigate();
    const [showSubMenu, setShowSubMenu] = useState(false);
    const path=['/recommend','/settings/metronome','/settings/tuner', '/settings/audio', '/setting'];
    
    const handleMenu2Click = () => {
        setShowSubMenu(!showSubMenu);
    };

    const handleSubMenuClick = (menu) => {
        setShowSubMenu(false);
        navigate(menu);
    };

  return (
    <div className="sticky bottom-0 z-50 w-full h-16 bg-white shadow-md px-4 flex items-center justify-center border-t border-gray-200">
      <div className="flex items-center gap-4 justify-between w-full relative">
        <img src={menu1Icon} alt="menu1" className="w-8 h-8 cursor-pointer" 
        onClick={() => navigate(path[0])}/>
        
        <div className="relative">
          <img src={menu2Icon} alt="menu2" className="w-8 h-8 cursor-pointer" 
          onClick={handleMenu2Click}/>
          
          <div className={`absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-md shadow-lg border border-gray-200 py-2 min-w-[100px] transition-all duration-300 ease-in-out ${
            showSubMenu 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}>
            <button 
              className="w-full px-2 py-2 text-center text-sm transition-colors duration-200"
              onClick={() => handleSubMenuClick(path[1])}
            >
              메트로놈 세팅
            </button>
            <button 
              className="w-full px-2 py-2 text-center text-sm transition-colors duration-200"
              onClick={() => handleSubMenuClick(path[2])}
            >
              튜너 세팅
            </button>
            <button 
              className="w-full px-2 py-2 text-center text-sm transition-colors duration-200"
              onClick={() => handleSubMenuClick(path[3])}
            >
              음향 설정
            </button>
          </div>
        </div>
        
        <img src={menu3Icon} alt="menu3" className="w-8 h-8 cursor-pointer" />
        <img src={menu4Icon} alt="menu4" className="w-8 h-8 cursor-pointer" />
        <img src={menu5Icon} alt="menu5" className="w-8 h-8 cursor-pointer" 
        onClick={() => handleSubMenuClick(path[4])}
        />
      </div>
    </div>
  );
}