import { useState, useEffect } from 'react';
import { postGoogleLogin } from '../api/auth';
import { getGoogleStatus, postGoogleInfo } from '../api/social';
import googleLogo from '../assets/googleLogo.png';

export default function GoogleConnectButton() {
    const [googleStatus, setGoogleStatus] = useState(false);
    const [googleId, setGoogleId] = useState(null);
    const [isChecking, setIsChecking] = useState(true);

    // 구글 상태 확인
    useEffect(() => {
        const fetchGoogleStatus = async () => {
            try {
                const response = await getGoogleStatus();
                const googleIdValue = response.data?.googleId;
                
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
            } finally {
                setIsChecking(false);
            }
        };
        fetchGoogleStatus();
    }, []);

    // 구글 로그인 콜백 처리 (ID 토큰 기반)
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

    // Google SDK 로드 및 초기화
    useEffect(() => {
        const initGoogleSDK = () => {
            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
            if (!clientId) {
                console.error("⚠️ GOOGLE_CLIENT_ID가 설정되지 않았습니다.");
                return;
            }

            try {
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
            const existing = document.getElementById("google-oauth");
            if (existing) existing.remove();
        };
    }, []);

    // OAuth 리다이렉트 후 authorization code 처리
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");

        if (error) {
            console.error("구글 로그인 오류:", error);
            alert("구글 로그인에 실패했습니다.");
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }

        if (code) {
            handleOAuthCallback(code);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // OAuth callback 처리
    const handleOAuthCallback = async (code) => {
        try {
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
    
            window.google.accounts.id.prompt((notification) => {
                if (
                    notification.isDismissedMoment() ||
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
                        const response = await postGoogleInfo(
                            tokenResponse.access_token,
                            tokenResponse.refresh_token || '',
                            tokenResponse.expires_in?.toString() || '3600'
                        );
                        
                        if (response.status === 200 || response.status === 201) {
                            alert("✅ 구글 계정 연동이 완료되었습니다!");
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
                        const errorMessage = error.response?.data?.error || error.response?.data?.data?.error || error.message || '구글 계정 연동에 실패했습니다.';
                        alert(errorMessage);
                    }
                },
            });
    
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } catch (err) {
            console.error("Manual Google Login 초기화 실패:", err);
        }
    };

    // 로딩 중이거나 이미 연동되어 있으면 표시하지 않음
    if (isChecking || googleStatus) {
        return null;
    }

    return (
        <div className="mt-8">
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
        </div>
    );
}

