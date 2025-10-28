import { useState, useRef, useEffect } from 'react';
import { getProfileDownloadUrl, postProfileUploadUrl } from '../api/mypage';
import rightArrow from '../assets/rightArrow.svg';

export default function MyPage() {
    const [profileImage, setProfileImage] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const name = localStorage.getItem('name');
    const nickname = localStorage.getItem('nickname');
    const level = localStorage.getItem('level');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage(file);
            
            // 미리보기 URL 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

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
          setOriginalImage(imageUrl);
        };
        loadProfileImage();
      }, []);
      

    const handleImageUpload = async () => {
        if (profileImage) {
            try {
                const response = await postProfileUploadUrl(profileImage);
                console.log('업로드 URL:', response);
                console.log('업로드할 이미지:', profileImage);
                alert('프로필 사진이 업로드되었습니다.');
            } catch (error) {
                console.error('업로드 실패:', error);
                alert('프로필 사진 업로드에 실패했습니다.');
            }
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleEditMode = () => {
        setIsEditMode(false);
        window.location.reload();
    };
    return (
        <div className="min-h-screen w-screen bg-[#EEF5FF] p-6">
            <div className="max-w-lg mx-auto mt-10">
                {isEditMode ? (
                <div>
                <div className="flex items-start gap-4">
                    {/* 프로필 이미지 미리보기 영역 */}
                    <div className="relative w-32 h-32">
                        {originalImage ? (
                            <img 
                                src={originalImage} 
                                alt="프로필 미리보기" 
                                className="w-36 h-36 object-cover"
                            />
                        ) : (
                            <div className="w-36 h-36 bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-2xl font-bold">
                        <p>Lv.{level}</p><p>{nickname}</p>
                        </div>
                       
                        <p className="text-sm text-gray-500">{name}</p>
                        
                    </div>


                </div>
                <div>
                    <button onClick={() => setIsEditMode(true)} className="px-4 py-2 bg-blue-400 text-white rounded-md">프로필 수정</button>
                    </div>
                </div>
                ) : (
                    <div className="flex flex-col gap-4 items-center justify-between">
                        <button onClick={handleEditMode} className="flex items-center gap-2 px-4 py-2 text-gray-800 rounded-md mr-auto">
                            <img src={rightArrow} alt="rightArrow" className="w-4 h-4 rotate-180" />
                            돌아가기
                            </button>
                    <div className="flex items-start gap-4">
                        <div className="relative w-32 h-32">
                            <img src={originalImage} alt="프로필 미리보기" className="w-36 h-36 object-cover" />
                        </div>
                    </div>
                    
                     <div className="flex flex-col gap-2">
                     <label className="px-4 py-2 bg-gray-100 text-center text-gray-700 rounded-md cursor-pointer border border-gray-300">
                        사진 수정하기
                         <input
                             ref={fileInputRef}
                             type="file"
                             accept="image/*"
                             onChange={handleImageChange}
                             className="hidden"
                         />
                     </label>
                     {previewUrl && (
                         <div className="flex gap-2">
                             <button
                                 onClick={handleImageUpload}
                                 className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition-colors"
                             >
                                 업로드
                             </button>
                             <button
                                 onClick={handleRemoveImage}
                                 className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-600 transition-colors"
                             >
                                 삭제
                             </button>
                         </div>
                     )}
                 </div>
                 </div>
                )}


                {profileImage && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">
                            선택된 파일: {profileImage.name}
                        </p>
                      
                    </div>
                )}
            </div>
        </div>
    )
}