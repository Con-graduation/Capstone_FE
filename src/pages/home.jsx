import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { getRoutine } from "../api/routine";
import playIcon from "../assets/playIcon.svg";
import RoutineBox from "../components/routineBox";
import rightArrow from "../assets/rightArrow.svg";
import BarChart from "../components/BarChart";
import googleLogo from "../assets/googleLogo.png";
import { postGoogleLogin } from "../api/auth";
import { getGoogleStatus, postGoogleInfo } from "../api/social";
import { getMainInformation } from "../api/routine";

export default function Home() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const name = localStorage.getItem("name");
  const [googleStatus, setGoogleStatus] = useState(false);
  const [googleId, setGoogleId] = useState(null);
  const [streakDays, setStreakDays] = useState(0);
  const [weeklyPracticeCount, setWeeklyPracticeCount] = useState({});
  
  // 오늘 날짜를 "YYYY년 MM월 DD일" 형식으로 반환
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  // weeklyPracticeCount를 차트 데이터로 변환
  const chartData = useMemo(() => {
    if (!weeklyPracticeCount || Object.keys(weeklyPracticeCount).length === 0) {
      return {
        labels: [],
        data: []
      };
    }

    // 날짜 순서대로 정렬
    const sortedEntries = Object.entries(weeklyPracticeCount).sort((a, b) => {
      return new Date(a[0]) - new Date(b[0]);
    });

    // 날짜를 "9일", "10일" 형식으로 변환하고 연습 횟수 추출
    const labels = sortedEntries.map(([date]) => {
      const day = new Date(date).getDate();
      return `${day}일`;
    });

    const data = sortedEntries.map(([, count]) => count);

    return { labels, data };
  }, [weeklyPracticeCount]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const fetchMainInformation = async () => {
      try {
        const response = await getMainInformation();
        console.log(response.data);
        setStreakDays(response.data.streakDays);
        setWeeklyPracticeCount(response.data.weeklyPracticeCount);
      } catch (error) {
        console.error('메인 정보 조회 실패:', error);
      }
    };
    fetchMainInformation();



    const fetchGoogleStatus = async () => {
      try {
        const response = await getGoogleStatus();
        const googleIdValue = response.data?.googleId;
        
        // googleId가 있고 빈 문자열이 아니면 저장
        if (googleIdValue && googleIdValue.trim() !== '') {
          setGoogleId(googleIdValue);
          setGoogleStatus(true);
        } else {
          setGoogleId(null);
          setGoogleStatus(false);
        }
      } catch (error) {
        console.error('구글 상태 조회 실패:', error);
        setGoogleStatus(false);
        setGoogleId(null);
      }
    };
    fetchGoogleStatus();
  }, []);

  // ✅ Google SDK 로드 및 초기화
useEffect(() => {
  const initGoogleSDK = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("⚠️ GOOGLE_CLIENT_ID가 설정되지 않았습니다.");
      return;
    }

    try {
      // ✅ FedCM 강제 활성화
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        scope: "email profile openid https://www.googleapis.com/auth/calendar.events"
      });
      

      console.log("✅ Google Identity 초기화 완료");
    } catch (err) {
      console.error("Google Identity 초기화 실패:", err);
    }
  };

  // 기존 SDK 제거 후 재로드 (캐시된 구버전 방지)
  const oldScript = document.getElementById("google-oauth");
  if (oldScript) oldScript.remove();

  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.id = "google-oauth";
  script.onload = () => {
    console.log("✅ Google SDK 로드 완료");
    initGoogleSDK();
  };
  document.body.appendChild(script);

  return () => {
    // cleanup
    const existing = document.getElementById("google-oauth");
    if (existing) existing.remove();
  };
}, []);


  // ✅ OAuth 리다이렉트 후 authorization code 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      console.error("구글 로그인 오류:", error);
      alert("구글 로그인에 실패했습니다.");
      // URL에서 에러 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code) {
      // authorization code를 백엔드에 전송하여 토큰으로 교환
      handleOAuthCallback(code);
      // URL에서 code 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // ✅ OAuth callback 처리
  const handleOAuthCallback = async (code) => {
    try {
      // 백엔드에 authorization code 전송
      // 백엔드 API가 code를 받아서 처리하는 경우
      const loginResponse = await postGoogleLogin(code);
      
      if (loginResponse.data?.token) {
        localStorage.setItem("accessToken", loginResponse.data.token);
        if (loginResponse.data.name) localStorage.setItem("name", loginResponse.data.name);
        if (loginResponse.data.nickname) localStorage.setItem("nickname", loginResponse.data.nickname);
        if (loginResponse.data.level) localStorage.setItem("level", loginResponse.data.level);

        alert("✅ 구글 계정 연동이 완료되었습니다!");
        window.location.reload();
      }
    } catch (error) {
      console.error("OAuth callback 처리 오류:", error);
      alert("구글 계정 연동에 실패했습니다.");
    }
  };


  const handleGoogleLogin = () => {
    try {
      if (!window.google || !window.google.accounts?.id) {
        alert("구글 로그인 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
        return;
      }
  
      // ✅ One Tap or FedCM prompt
      window.google.accounts.id.prompt((notification) => {
        if (
          notification.isDismissedMoment() || // FedCM dismiss 대응
          notification.isNotDisplayed() ||
          notification.isSkippedMoment()
        ) {
          console.warn("One Tap 표시 불가 → 수동 로그인으로 전환");
          handleManualGoogleLogin();
        }
      });
    } catch (error) {
      console.error("One Tap 표시 실패:", error);
      handleManualGoogleLogin();
    }
  };
  
  const handleManualGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  
    if (!clientId) {
      alert("구글 클라이언트 ID가 설정되지 않았습니다.");
      return;
    }
  
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid https://www.googleapis.com/auth/calendar",
        redirect_uri: redirectUri,
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            console.error("구글 로그인 오류:", tokenResponse.error);
            alert(`구글 로그인 실패: ${tokenResponse.error}`);
            return;
          }
      
          console.log("✅ 구글 토큰 획득 성공:", tokenResponse);
          console.log("Refresh Token:", tokenResponse.refresh_token);
          
          try {
            // 백엔드에 토큰 정보 전송
            const response = await postGoogleInfo(
              tokenResponse.access_token,
              tokenResponse.refresh_token || '',
              tokenResponse.expires_in?.toString() || '3600'
            );
            
            if (response.status === 200 || response.status === 201) {
              alert("✅ 구글 계정 연동이 완료되었습니다!");
              // 구글 상태 다시 조회
              const statusResponse = await getGoogleStatus();
              const googleIdValue = statusResponse.data?.googleId;
              if (googleIdValue && googleIdValue.trim() !== '') {
                setGoogleId(googleIdValue);
                setGoogleStatus(true);
              }
            } else {
              alert("구글 계정 연동에 실패했습니다.");
            }
          } catch (error) {
            console.error("구글 정보 전송 실패:", error);
            alert("구글 계정 연동에 실패했습니다.");
          }
        },
      });
  
      // refresh_token 받기 위해 prompt: 'consent' 옵션 사용
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      console.error("Manual Google Login 초기화 실패:", err);
    }
  };

  

  // ✅ 구글 로그인 콜백 처리 (ID 토큰 기반)
  const handleCredentialResponse = async (credentialResponse) => {
    if (!credentialResponse.credential) return;

    try {
      const loginResponse = await postGoogleLogin(credentialResponse.credential);
      if (loginResponse.data?.token) {
        localStorage.setItem("accessToken", loginResponse.data.token);
        if (loginResponse.data.name) localStorage.setItem("name", loginResponse.data.name);
        if (loginResponse.data.nickname) localStorage.setItem("nickname", loginResponse.data.nickname);
        if (loginResponse.data.level) localStorage.setItem("level", loginResponse.data.level);

        alert("✅ 구글 계정 연동이 완료되었습니다!");
        window.location.reload();
      }
    } catch (error) {
      console.error("구글 로그인 API 오류:", error);
      alert("구글 계정 연동에 실패했습니다.");
    }
  };
  

  // ✅ 루틴 데이터 가져오기
  useEffect(() => {
    const fetchRoutine = async () => {
      const response = await getRoutine();
      setRoutines(response.data);
    };
    fetchRoutine();
  }, []);

  const eventData = {
    summary: "테스트 이벤트",
    description: "구글 캘린더 API 테스트",
    start: {
      dateTime: "2025-11-12T10:00:00+09:00"
    },
    end: {
      dateTime: "2025-11-12T11:00:00+09:00"
    }
  };

  async function addEventToGoogleCalendar(eventData) {
    const tokenData = JSON.parse(localStorage.getItem("googleAuth"));
    if (!tokenData?.accessToken) {
      alert("먼저 구글 계정으로 로그인해주세요!");
      return;
    }
  
    const accessToken = tokenData.accessToken;
  
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
      }
    );
  
    const result = await response.json();
    console.log("캘린더 이벤트 추가 결과:", result);
  }
  
  
  

  return (
   
      <div className="min-h-screen w-screen bg-[#EEF5FF] pb-24">
        <div className="px-6 pt-8 flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">{name}님</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">환영합니다! 👋</span>
              <span className="text-lg font-regular">📅 {getTodayDate()}</span>
            </div>
          </div>
          
          <div className="w-full h-36 bg-gradient-to-br from-[#5680F3] to-[#D4F4FF] rounded-md flex flex-col items-start justify-center gap-2 shadow-md px-6 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg relative overflow-hidden group"
          onClick={() => navigate('/practice/start')}>
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            <p className="text-2xl font-bold text-gray-800 relative z-10">연습 시작하기</p>
            <p className="text-lg text-gray-600 relative z-10">기타 연습 연속 {streakDays}일째 🔥</p>
            <img src={playIcon} alt="playIcon" className="w-10 h-10 ml-auto relative z-10" />
          </div>

         <div>
          <div className="flex items-center justify-between">
          <p className="text-2xl font-bold mb-2">루틴 관리</p>
          <div className="flex items-center gap-1 border-b border-black">
            <a href="/routine/form" className="text-sm ">루틴 생성하러 가기</a>
            <img src={rightArrow} alt="rightArrow" className="w-3 h-3" />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 max-w-1/2 mx-auto">
                {routines.map((routine) => {
                  const routineTypeKorean = routine.routineType === 'CHORD_CHANGE' ? '코드 전환' : 
                                         routine.routineType === 'CHROMATIC' ? '크로매틱' : 
                                         routine.routineType;
                  const lastDate = routine.updatedAt ? routine.updatedAt.split('T')[0] : routine.updatedAt;
                  return (
                    <RoutineBox key={routine.id} title={routine.title} description={routineTypeKorean} lastDate={lastDate} component={routine.sequence} />
                  );
                })}
          </div>
         </div>

          <div>
          <BarChart 
            title="루틴 연습 통계" 
            description="막대를 터치해주세요!"
            labels={chartData.labels}
            data={chartData.data}
            unit="횟수"
          />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xl font-bold">알림 일정</p>
            <p className="text-md text-gray-600 font-light">알림을 추가해서 루틴 연습 시간을 받을 수 있습니다</p>
            <button className="bg-blue-400 text-white rounded-md py-2 w-64 shadow-md text-md font-bold mx-auto"
       onClick={() => navigate('/notification/form')}>알림 추가하기 🔔</button>
          </div>
          
          {/* {googleStatus === false && ( */}
          <div>
            <p className="text-xl font-bold mb-2">구글 캘린더에 알림 일정을 추가하세요!</p>
            <p className="text-md text-gray-600 font-light">구글 캘린더와 알림 일정을 추가하려면<br/>
            구글 계정으로 연동하세요 </p>
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center gap-2 bg-white text-black px-16 py-2 rounded-md border border-gray-300 mx-auto mt-4 shadow-md hover:bg-gray-50 transition-colors"
            >
              <img src={googleLogo} alt="googleLogo" className="w-6 h-6" />
              구글 계정으로 연동
            </button>

            {/* <button onClick={() => addEventToGoogleCalendar(eventData)}>캘린더 이벤트 추가</button> */}
          </div>
        {/* )} */}
        </div>
       
      </div>
  );
}