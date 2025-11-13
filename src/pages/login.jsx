import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import guitarImg from '../assets/guitarImg.png';
import ResponsiveWrapper from '../components/ResponsiveWrapper';
import { postLogin } from '../api/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 간단한 유효성 검사
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = '아이디를 입력해주세요.';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log('로그인 시도:', formData.username);
      const response = await postLogin(formData.username, formData.password);
      console.log('로그인 성공:', response);
      
      // 로그인 성공 시 토큰 저장
      if (response.data && response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
      }
      if (response.data && response.data.name) {
        localStorage.setItem('name', response.data.name);
      }
      if (response.data && response.data.nickname) {
        localStorage.setItem('nickname', response.data.nickname);
      }
      if (response.data && response.data.level) {
        localStorage.setItem('level', response.data.level);
      }
      
      navigate('/home');
    } catch (error) {
      console.error('로그인 실패:', error);
      

        setErrors({ 
          username: '아이디 또는 비밀번호가 올바르지 않습니다.',
          password: '아이디 또는 비밀번호가 올바르지 않습니다.'
        });
      
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
            <h2 className="text-center text-2xl font-extrabold text-white">
              로그인
            </h2>
            
          </div>
          
          <form className="" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 bg-white/50 border-2 border-white/50 p-6 rounded-lg shadow-xl">
             
              <Input
                type="text"
                name="username"
                label="아이디"
                placeholder="아이디를 입력하세요"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
              />
              
              <Input
                type="password"
                name="password"
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
            
              <button
                type="submit"
                className="w-full mt-4 flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
              >
                로그인
              </button>
              
              <div className='flex justify-between'>
              <div className="text-center underline">
                <a href="/join" className="text-sm text-indigo-600 hover:text-indigo-500">
                  회원가입
                </a>
              </div>
              <div className="text-center underline">
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                  비밀번호 재설정
                </a>
              </div>
              </div>
              
            </div>
          </form>
        </div>
      </div>
    </ResponsiveWrapper>
  );
};

export default Login;