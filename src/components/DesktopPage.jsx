import React from 'react';
import mockUp from '../assets/iphoneMockUp.png'

const DesktopPage = ({}) => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#93C4F6] to-[#6399E4] flex items-center justify-center">
      <div className='mx-20'>
      <h1 className='text-6xl font-bold text-white'>모바일로 접속해주세요!</h1>
      <h2 className='text-4xl text-white'>Daily Guitar는 모바일 환경을 지원합니다.</h2>
      </div>
      <div>
        <img src={mockUp} alt="mockUp" />
      </div>
    </div>
  );
};

export default DesktopPage;
