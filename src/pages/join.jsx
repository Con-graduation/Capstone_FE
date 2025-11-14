import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import guitarImg from '../assets/guitarImg.png';
import Modal from '../components/modal';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import { getUsernameCheck, postRequestEmail, postVerifyEmail, postRegister } from '../api/auth';

export default function Join() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isRequestingEmail, setIsRequestingEmail] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        verificationCode: ''
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        
        if (errors[name]) {
          setErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        }
      };

      const handleDuplicateCheck = async () => {

        if (!formData.username.trim()) {
          setModalContent('아이디를 입력해주세요.');
          setModalOpen(true);
          return;
        }

        setIsCheckingUsername(true);
        try {
          const response = await getUsernameCheck(formData.username);
          console.log('아이디 중복 확인 응답:', response);
          if (response.status === 200) {
          
            setModalContent(`'${formData.username}'는 사용 가능한 아이디입니다.`);
          } else {
          
            setModalContent(`'${formData.username}'는 이미 사용 중인 아이디입니다.`);
          }
          setModalOpen(true);
        } catch (error) {
          console.error('아이디 중복 확인 에러:', error);
          setModalContent('아이디 중복 확인 중 오류가 발생했습니다.');
          setModalOpen(true);
        } finally {
          setIsCheckingUsername(false);
        }
      };

      const handleEmailRequest = async () => {
        if (!formData.email.trim()) {
          setModalContent('이메일을 입력해주세요.');
          setModalOpen(true);
          return;
        }

        setIsRequestingEmail(true);
        
        try {
          const response = await postRequestEmail(formData.email);

          if (response.status == 200) {
            setModalContent(`인증번호가 메일로 전송되었습니다.<br/>
                메일함을 확인해주세요.`);
          } else {
            setModalContent('이메일 전송 중 오류가 발생했습니다.');
          }
          setModalOpen(true);
        } catch (error) {
          console.error('이메일 인증 요청 에러:', error);
          setModalContent('이메일 인증 요청 중 오류가 발생했습니다.');
          setModalOpen(true);
        } finally {
          setIsRequestingEmail(false);
        }
      };

      const handleEmailVerify = async () => {
        setIsVerifyingEmail(true);
        if (!formData.email.trim()) {
          setModalContent('이메일을 입력해주세요.');
          setModalOpen(true);
          return;
        }
        
        if (!formData.verificationCode.trim()) {
          setModalContent('인증번호를 입력해주세요.');
          setModalOpen(true);
          return;
        }
        try {
          const response = await postVerifyEmail(formData.email, formData.verificationCode);
          console.log('이메일 인증 응답:', response);
          
          if (response.status === 200 && response.data.available === true) {
            setModalContent(response.data.message || '이메일 인증이 완료되었습니다.');
          } else {
            setModalContent('인증번호가 올바르지 않습니다.');
          }
          setModalOpen(true);
        } catch (error) {
          console.error('이메일 인증 에러:', error);
          setModalContent('이메일 인증 중 오류가 발생했습니다.');
          setModalOpen(true);
        } finally {
          setIsVerifyingEmail(false);
        }
       

      };
      
      const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name || !formData.name.trim()) {
          newErrors.name = '이름을 입력해주세요.';
        }
        
        if (!formData.nickname || !formData.nickname.trim()) {
          newErrors.nickname = '닉네임을 입력해주세요.';
        }
        
        if (!formData.username || !formData.username.trim()) {
          newErrors.username = '아이디를 입력해주세요.';
        }
        
        if (!formData.password || !formData.password.trim()) {
          newErrors.password = '비밀번호를 입력해주세요.';
        } else if (formData.password.length < 6) {
          newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
        }
        
        if (!formData.confirmPassword || !formData.confirmPassword.trim()) {
          newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }
        
        if (!formData.email || !formData.email.trim()) {
          newErrors.email = '이메일을 입력해주세요.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = '올바른 이메일 형식을 입력해주세요.';
        }
        
        if (!formData.verificationCode || !formData.verificationCode.trim()) {
          newErrors.verificationCode = '인증번호를 입력해주세요.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('현재 입력된 데이터:', formData);
        if (validateForm()) {
          try {
            const response = await postRegister(formData.email, formData.name, formData.username, formData.nickname, formData.password);
            if (response.status === 200 || response.status === 201) {
              setModalContent('회원가입이 완료되었습니다.');
              setModalOpen(true);
            } else {
              setModalContent('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
              setModalOpen(true);
            }
          } catch (error) {
            console.error('회원가입 에러:', error);
            
            // 409 Conflict 오류 처리 (중복된 이메일, 사용자명, 닉네임 등)
            if (error.response && error.response.status === 409) {
              const errorMessage = error.response?.data?.message || error.response?.data?.error || '이미 사용 중인 이메일, 아이디 또는 닉네임입니다.';
              setModalContent(errorMessage);
            } else if (error.response && error.response.status === 400) {
              const errorMessage = error.response?.data?.message || error.response?.data?.error || '입력한 정보를 확인해주세요.';
              setModalContent(errorMessage);
            } else {
              setModalContent('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
            setModalOpen(true);
          }
        } else {
          console.log('유효성 검증 실패 - 에러:', errors);
        }
      };

      const handleModalClose = () => {
        setModalOpen(false);
        if (modalContent === '회원가입이 완료되었습니다.') {
          navigate('/');
        }
      };

    return (
        <ResponsiveWrapper desktopTitle="로그인 - 모바일 전용">
        <div className='absolute w-full h-full object-cover z-[-1]'>
          <img src={guitarImg} alt="guitarImg" className="absolute w-full h-full object-cover z-[-1]"/>
        </div>
        <div className="min-h-screen w-screen flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-sm space-y-6">
            <div>
              <div className="flex items-center justify-center mb-6">
                <button 
                  onClick={() => navigate(-1)}
                  className="absolute left-16 p-2 text-white rounded-full transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-center text-2xl font-extrabold text-white">
                  회원가입
                </h2>
              </div>
              <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6 bg-white/50 border-2 border-white/50 p-6 rounded-lg shadow-xl">
              <Input
                type="text"
                name="name"
                label="이름"
                placeholder="이름을 입력하세요"
                essential={true}
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
               <Input
                type="text"
                name="nickname"
                label="닉네임"
                placeholder="닉네임을 입력하세요"
                essential={true}
                value={formData.nickname}
                onChange={handleChange}
                error={errors.nickname}
              />
              <Input
                type="text"
                name="username"
                label="아이디"
                placeholder="아이디를 입력하세요"
                essential={true}
                button={true}
                buttonText={isCheckingUsername ? "확인중..." : "중복확인"}
                onClick={handleDuplicateCheck}
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                buttonDisabled={isCheckingUsername}
              />
              
              <Input
                type="password"
                name="password"
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                information={true}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <Input
                type="password"
                name="confirmPassword"
                label="비밀번호 확인"
                essential={true}
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
              <Input
                type="text"
                name="email"
                label="이메일"
                placeholder="이메일을 입력하세요"
                essential={true}
                button={true}
                buttonText={isRequestingEmail ? "요청중..." : "인증요청"}
                onClick={handleEmailRequest}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                buttonDisabled={isRequestingEmail}
              />
              <Input
                type="text"
                name="verificationCode"
                label="인증번호 확인"
                placeholder="인증번호를 입력하세요"
                essential={true}
                button={true}
                buttonText={isVerifyingEmail ? "확인중..." : "인증확인"}
                onClick={handleEmailVerify}
                value={formData.verificationCode}
                onChange={handleChange}
                error={errors.verificationCode}
                buttonDisabled={isVerifyingEmail}
                />
                 <button
                type="submit"
                className="w-full mt-4 flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              >
                회원가입
              </button>
              </div>
               {modalOpen && <Modal content={modalContent} onClose={handleModalClose} />}
              </form>
             
            </div>
          </div>
        </div>
        </ResponsiveWrapper>
    )
}