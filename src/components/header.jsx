import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import profile from '../assets/profile.svg';
import logoWidth from '../assets/logoWidth.png';

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-blue-400/80 w-screen h-16 flex items-center justify-between px-4 shadow-md">
      <div className="w-8"></div>
      <img src={logoWidth} alt="logoWidth" className="w-20 h-auto cursor-pointer" 
      onClick={() => navigate('/')}
      />
        
        <img src={profile} alt="profile" className="w-8 h-8 cursor-pointer" 
        onClick={() => navigate('/mypage')}
        />
    </div>
  );
}