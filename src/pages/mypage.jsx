import { useState, useRef, useEffect } from 'react';
import { getProfileDownloadUrl, postProfileUploadUrl, uploadToS3, postConfirmProfile } from '../api/mypage';
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
                // 1. 백엔드에서 업로드 URL 받아오기
                const response = await postProfileUploadUrl(profileImage);
                
                // 2. S3에 실제 파일 업로드
                await uploadToS3(response.uploadUrl, profileImage);
                
                // 3. objectKey를 백엔드에 전송하여 프로필 이미지 업데이트 확인
                await postConfirmProfile(response.objectKey);
                
                alert('프로필 사진이 업로드되었습니다.');
                
                // 4. 프로필 이미지 다시 로드
                const imageUrl = await fetchProfileImage();
                if (imageUrl) {
                    setOriginalImage(imageUrl);
                }
                
                // 상태 초기화
                setProfileImage(null);
                setPreviewUrl(null);
                setIsEditMode(false);
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

    const handleBackToProfile = () => {
        setIsEditMode(false);
        
    };
    return (
        <div className="min-h-screen w-screen bg-[#EEF5FF] p-6">
            <div className="max-w-lg mx-auto mt-10">
                {isEditMode ? (
                    <div className="flex flex-col gap-4">
                        <button onClick={handleBackToProfile} className="flex items-center gap-2 px-4 py-2 text-gray-800 rounded-md mr-auto">
                            <img src={rightArrow} alt="rightArrow" className="w-4 h-4 rotate-180" />
                            돌아가기
                        </button>
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-36 h-36">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="프로필 미리보기" className="w-36 h-36 object-cover rounded-full" />
                                ) : originalImage ? (
                                    <img src={originalImage} alt="프로필 미리보기" className="w-36 h-36 object-cover rounded-full" />
                                ) : (
                                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center border-2 border-gray-300 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </div>
                                )}
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
                    </div>
                ) : (
                    <div>
                        <div className="flex items-start gap-4">
                            <div className="relative w-36 h-36">
                                {originalImage ? (
                                    <img 
                                        src={originalImage} 
                                        alt="프로필 미리보기" 
                                        className="w-32 h-32 object-cover rounded-full"
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center border-2 border-gray-300 rounded-full">
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
                        <div className="mt-6">
                            <button onClick={() => setIsEditMode(true)} className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition-colors">프로필 수정</button>
                        </div>
                    </div>
                )}


            </div>
        </div>
    )
}