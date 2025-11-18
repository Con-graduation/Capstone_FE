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
      <img src={logoWidth} alt="logoWidth" className="w-20 h-auto cursor-pointer" 
      onClick={() => navigate('/home')}
      />
        
        {profileImage ? (
          <img src={profileImage} alt="profile" className="w-8 h-8 cursor-pointer rounded-full object-cover" 
          onClick={() => navigate('/mypage')}
          />
        ) : (
          <img src={profile} alt="profile" className="w-8 h-8 cursor-pointer" 
          onClick={() => navigate('/mypage')}
          />
        )}
    </div>
  );
}