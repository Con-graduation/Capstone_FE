import React from 'react';
import mockUp from '../assets/iphoneMockUp.png'

const DesktopPage = ({}) => {
  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <div className='mx-20'>
      <h1 className='text-4xl font-bold'>모바일로 접속해주세요!</h1>
      <h2 className='text-2xl'>APP은 모바일 환경을 지원합니다.</h2>
      </div>
      <div>
        <img src={mockUp} alt="mockUp" />
      </div>
    </div>
  );
};

export default DesktopPage;
