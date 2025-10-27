import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Accordian from '../../components/accordian';

export default function NotificationForm() {
    const navigate = useNavigate();
    const [notification, setNotification] = useState({
        title: '',
        startDate: '',
        endDate: '',
        repeat: '',
        time: '',
    });
    const handleChange = (e) => {
        setNotification({ ...notification, [e.target.name]: e.target.value });
    };
    return (
        <div className="min-h-[90vh] w-screen bg-[#EEF5FF] flex flex-col px-6 pb-24">
           
        <h1 className="relative text-2xl font-bold text-center mt-10">루틴 설정</h1>
            <button 
                  onClick={() => navigate(-1)}
                  className="p-2 text-black rounded-full transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
        <div className="flex flex-col items-center justify-center mt-10 gap-10 w-full">
            <input type="text" placeholder="루틴 이름 입력" className="w-full p-2 border border-gray-300 rounded-md shadow-md" />
            <Accordian title="시작 날짜" type="date" value="없음" />
            <Accordian title="종료 날짜" type="date" value="없음" />
            <Accordian title="반복" type="repeat" value="없음" />
            <Accordian title="시간" type="time" value="없음" />
            <button className="w-full p-2 bg-blue-500 text-white rounded-md mt-12 shadow-md">알림 추가하기</button>
           
            </div>
        </div>
    )
}