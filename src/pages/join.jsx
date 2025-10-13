import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import guitarImg from '../assets/guitarImg.png';
import Modal from '../components/modal';
import ResponsiveWrapper from '../components/ResponsiveWrapper';

export default function Join() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
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

      const handleDuplicateCheck = () => {
        if (!formData.username.trim()) {
          setModalContent('아이디를 입력해주세요.');
          setModalOpen(true);
          return;
        }

        setModalContent(`'${formData.username}'는 사용 가능한 아이디입니다.`);
        setModalOpen(true);
      };

      const handleEmailRequest = () => {
        if (!formData.email.trim()) {
          setModalContent('이메일을 입력해주세요.');
          setModalOpen(true);
          return;
        }
        setModalContent(`인증번호가 메일로 전송되었습니다.<br/>
            메일함을 확인해주세요.`);
        setModalOpen(true);
      };
      const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
          newErrors.name = '이름을 입력해주세요.';
        }
        
        if (!formData.nickname.trim()) {
          newErrors.nickname = '닉네임을 입력해주세요.';
        }
        
        if (!formData.username.trim()) {
          newErrors.username = '아이디를 입력해주세요.';
        }
        
        if (!formData.password.trim()) {
          newErrors.password = '비밀번호를 입력해주세요.';
        } else if (formData.password.length < 6) {
          newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
        }
        
        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }
        
        if (!formData.email.trim()) {
          newErrors.email = '이메일을 입력해주세요.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = '올바른 이메일 형식을 입력해주세요.';
        }
        
        if (!formData.verificationCode.trim()) {
          newErrors.verificationCode = '인증번호를 입력해주세요.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('현재 입력된 데이터:', formData);
        if (validateForm()) {
          console.log('회원가입 완료 - 전송할 데이터:', formData);
          setModalContent('회원가입이 완료되었습니다.');
          setModalOpen(true);
        } else {
          console.log('유효성 검증 실패 - 에러:', errors);
        }
      };

      const handleModalClose = () => {
        setModalOpen(false);
        if (modalContent === '회원가입이 완료되었습니다.') {
          navigate('/login');
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
              <h2 className="text-center text-2xl font-extrabold text-white mb-6">
                회원가입
              </h2>
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
                buttonText="중복확인"
                onClick={handleDuplicateCheck}
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
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
                buttonText="인증요청"
                onClick={handleEmailRequest}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Input
                type="text"
                name="verificationCode"
                label="인증번호 확인"
                placeholder="인증번호를 입력하세요"
                essential={true}
                button={true}
                buttonText="인증확인"
                value={formData.verificationCode}
                onChange={handleChange}
                error={errors.verificationCode}
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