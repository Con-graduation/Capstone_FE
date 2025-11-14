import { postPrompt } from "../api/mcp";
import { useState, useEffect } from "react";
import { getGoogleStatus, getGoogleToken } from "../api/social";
import ReactMarkdown from "react-markdown";

export default function Interface() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handlePrompt = (e) => {
        setPrompt(e.target.value);
    }

    // 구글 캘린더에 이벤트 추가 함수 (home.jsx에서 이동)
    async function addEventToGoogleCalendar(eventData) {
        try {
            // 백엔드에서 구글 연동 상태 확인
            const statusResponse = await getGoogleStatus();
            const googleId = statusResponse.data?.googleId;
            const isToken = await getGoogleToken();
            if (!isToken.data?.accessToken || isToken.data?.accessToken.trim() === '') {
                alert("먼저 구글 계정으로 연동해주세요!");
                return;
            }

            const accessToken = isToken.data?.accessToken;

            // 구글 캘린더 API에 직접 이벤트 추가
            // 주의: googleId가 실제 accessToken인지 확인 필요
            // 백엔드에 캘린더 이벤트 추가 API가 있다면 그걸 사용하는 것이 더 안전합니다.
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || '캘린더 이벤트 추가 실패');
            }

            const result = await response.json();
            console.log("캘린더 이벤트 추가 결과:", result);
            alert("✅ 구글 캘린더에 일정이 추가되었습니다!");
        } catch (error) {
            console.error("캘린더 이벤트 추가 실패:", error);
            alert(`구글 캘린더에 일정 추가 중 오류가 발생했습니다: ${error.message}`);
        }
    }
    
    const handleSubmit = async () => {
        setIsLoading(true);
        setResponse(""); // 이전 응답 초기화
        try {
            const response = await postPrompt(prompt);
            console.log(response.data);
            
            // action이 chat인 경우 응답 내용 표시
            if (response.data?.action === "chat") {
                const content = response.data?.data?.aiResponse?.choices?.[0]?.message?.content;
                if (content) {
                    setResponse(content);
                }
            }
            // action이 calendar인 경우 캘린더에 추가
            else if (response.data?.action === "calendar" && response.data?.data?.success) {
                const aiAnalysis = response.data.data.aiAnalysis;
                
                if (aiAnalysis?.startTime && aiAnalysis?.endTime) {
                    const eventData = {
                        summary: aiAnalysis.routineTitle || "루틴 연습",
                        description: `루틴 ID: ${aiAnalysis.routineId || ''}`,
                        start: {
                            dateTime: aiAnalysis.startTime,
                            timeZone: "Asia/Seoul"
                        },
                        end: {
                            dateTime: aiAnalysis.endTime,
                            timeZone: "Asia/Seoul"
                        }
                    };
                    
                    await addEventToGoogleCalendar(eventData);
                } else {
                    alert("캘린더 이벤트 데이터가 올바르지 않습니다.");
                }
            } else {
                // 일반 응답 처리
                if (response.data?.data?.message) {
                    alert(response.data.data.message);
                }
            }
        } catch (error) {
            console.error('답변 생성 실패:', error);
            
            // 400 에러 처리
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response?.data?.data?.error || '잘못된 요청입니다.';
                alert(errorMessage);
            } else {
                alert('답변 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-screen bg-[#EEF5FF] pb-24 flex flex-col px-8">
            <h1 className="text-2xl font-bold mx-auto pt-10">AI 어시스턴트</h1>
            <p className="mt-2 text-sm font-regular mx-auto text-center">AI를 활용해 내 루틴을 정리하거나 <br/> 연습 계획을 구글 캘린더에 추가해보세요!</p>
            <input type="text" value={prompt} onChange={handlePrompt} className="mt-4 w-full p-2 border border-gray-300 rounded-md shadow-md" />
            {response && (
                <div className="mt-4 w-full p-4 bg-white border border-gray-300 rounded-md shadow-md">
                    <div className="prose prose-sm max-w-none text-gray-800">
                        <ReactMarkdown
                            components={{
                                // 헤딩 스타일
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-bold my-2" {...props} />,
                                // 단락 스타일
                                p: ({node, ...props}) => <p className="my-2" {...props} />,
                                // 리스트 스타일
                                ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 ml-4" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2 ml-4" {...props} />,
                                li: ({node, ...props}) => <li className="my-1" {...props} />,
                                // 강조 스타일
                                strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                em: ({node, ...props}) => <em className="italic" {...props} />,
                                // 코드 스타일
                                code: ({node, inline, ...props}) => 
                                    inline ? (
                                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                                    ) : (
                                        <code className="block bg-gray-100 p-2 rounded text-sm font-mono my-2" {...props} />
                                    ),
                                pre: ({node, ...props}) => <pre className="bg-gray-100 p-2 rounded my-2 overflow-x-auto" {...props} />,
                            }}
                        >
                            {response}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
            <button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? '답변 생성 중...' : 'Submit'}
            </button>
        </div>
    )
}