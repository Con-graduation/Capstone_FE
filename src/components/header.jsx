import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import profile from '../assets/profile.svg';
import logoWidth from '../assets/logoWidth.png';
import { getProfileDownloadUrl } from '../api/mypage';


export default function Header() {
  const [profileImage, setProfileImage] = useState(null);

  const fetchProfileImage = async () => {
    try {
      const response = await getProfileDownloadUrl();
      console.log(response.downloadUrl);
      return response.downloadUrl;
    } catch (error) {
      console.error('프로필 이미지 로드 실패:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadProfileImage = async () => {
      const imageUrl = await fetchProfileImage();
      setProfileImage(imageUrl);
    };
    loadProfileImage();
  }, []);
  
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-blue-400/80 w-screen h-16 flex items-center justify-between px-4 shadow-md">
      <div className="w-8"></div>
      <img src={logoWidth} alt="logoWidth" className="w-20 h-auto cursor-pointer" 
      onClick={() => navigate('/home')}
      />
        
        <img src={profileImage? profileImage : profile} alt="profile" className="w-8 h-8 cursor-pointer" 
        onClick={() => navigate('/mypage')}
        />
    </div>
  );
}