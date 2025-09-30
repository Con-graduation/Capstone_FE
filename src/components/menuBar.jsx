import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import menu1Icon from '../assets/menu1Icon.svg';
import menu2Icon from '../assets/menu2Icon.svg';
import menu3Icon from '../assets/menu3Icon.svg';
import menu4Icon from '../assets/menu4Icon.svg';
import menu5Icon from '../assets/menu5Icon.svg';

export default function MenuBar() {
    const navigate = useNavigate();
    const paath=['/recommend','/','/','/','/'];
  return (
    <div className="sticky bottom-0 w-full h-16 bg-white shadow-md px-4 flex items-center justify-center border-t border-gray-200">
      <div className="flex items-center gap-4 justify-between w-full">
        <img src={menu1Icon} alt="menu1" className="w-8 h-8 cursor-pointer" 
        onClick={() => navigate(paath[0])}/>
        <img src={menu2Icon} alt="menu2" className="w-8 h-8 cursor-pointer" 
        
        />
        <img src={menu3Icon} alt="menu3" className="w-8 h-8 cursor-pointer" />
        <img src={menu4Icon} alt="menu4" className="w-8 h-8 cursor-pointer" />
        <img src={menu5Icon} alt="menu5" className="w-8 h-8 cursor-pointer" />
      </div>
    </div>
  );
}