import { postPrompt } from "../api/mcp";
import { useState, useEffect, useRef } from "react";
import { getGoogleStatus, getGoogleToken } from "../api/social";
import ReactMarkdown from "react-markdown";
import GoogleConnectButton from "../components/googleConnectButton";

export default function Interface() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [displayedText, setDisplayedText] = useState("");
    const [question, setQuestion] = useState("");
    const [hasResponse, setHasResponse] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef(null);
    const typingIntervalRef = useRef(null);

    const handlePrompt = (e) => {
        setPrompt(e.target.value);
    }

    // textarea 높이 자동 조절
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = 128; // h-32 = 8rem = 128px
            textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    }, [prompt]);

    // 타이핑 효과
    useEffect(() => {
        if (isTyping && response) {
            setDisplayedText("");
            const currentIndexRef = { current: 0 };
            
            typingIntervalRef.current = setInterval(() => {
                if (currentIndexRef.current < response.length) {
                    setDisplayedText(response.slice(0, currentIndexRef.current + 1));
                    currentIndexRef.current++;
                } else {
                    setIsTyping(false);
                    if (typingIntervalRef.current) {
                        clearInterval(typingIntervalRef.current);
                    }
                }
            }, 20); // 20ms마다 한 글자씩 (속도 조절 가능)

            return () => {
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current);
                }
            };
        }
    }, [isTyping, response]);

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
            return true; // 성공 시 true 반환
        } catch (error) {
            console.error("캘린더 이벤트 추가 실패:", error);
            // Axios 에러인 경우 (getGoogleToken 등에서 발생)
            const errorMessage = error.response?.data?.error || error.response?.data?.data?.error || error.message || '구글 캘린더에 일정 추가 중 오류가 발생했습니다.';
            throw new Error(errorMessage);
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
                    setQuestion(prompt); // 질문 내용 저장
                    setResponse(content);
                    setDisplayedText(""); // 타이핑 효과를 위해 초기화
                    setHasResponse(true); // 응답 받음 표시
                    setIsTyping(true); // 타이핑 시작
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
                    
                    try {
                        const success = await addEventToGoogleCalendar(eventData);
                        if (success) {
                            // 답변 영역에 메시지 표시
                            setQuestion(prompt);
                            setResponse("구글 캘린더에 일정이 추가되었습니다. 지금 바로 캘린더를 확인해보세요!\n\n[캘린더 바로가기](https://calendar.google.com/calendar/u/0/r)");
                            setDisplayedText("");
                            setHasResponse(true);
                            setIsTyping(true); // 타이핑 효과 시작
                        }
                    } catch (error) {
                        alert(error.message || "캘린더 이벤트 추가에 실패했습니다.");
                    }
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
                const errorMessage = error.response?.data?.error || error.response?.data?.data?.error || '잘못된 요청입니다.';
                alert(errorMessage);
            } else {
                alert('답변 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleNewQuestion = () => {
        // 타이핑 효과 정리
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }
        setHasResponse(false);
        setPrompt("");
        setQuestion("");
        setResponse("");
        setDisplayedText("");
        setIsTyping(false);
    };

    const markdownComponents = {
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
        // 링크 스타일
        a: ({node, ...props}) => <a className="text-blue-500 hover:text-blue-700 underline" target="_blank" rel="noopener noreferrer" {...props} />,
    };

    return (
        <div className="min-h-[90vh] w-screen bg-[#EEF5FF] pb-24 flex flex-col px-8">
            {!hasResponse ? (
                <>
                    <h1 className="text-2xl font-bold mx-auto pt-32">AI 어시스턴트</h1>
                    <p className="mt-2 text-sm font-regular mx-auto text-center">AI를 활용해 내 루틴을 정리하거나 <br/> 연습 계획을 구글 캘린더에 추가해보세요!</p>
                    <textarea 
                        ref={textareaRef}
                        value={prompt} 
                        onChange={handlePrompt} 
                        className="mt-20 w-full p-2 border border-gray-300 rounded-md shadow-md min-h-[3rem] max-h-32 overflow-y-auto resize-none" 
                        placeholder="질문을 입력하세요..."
                        rows={1}
                    />
                    <button 
                        onClick={handleSubmit} 
                        disabled={isLoading || !prompt.trim()}
                        className="mt-8 bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                       전송하기
                    </button>
                    <GoogleConnectButton />
                    {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 px-10 max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-6 text-center">AI 답변 생성중..</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-center mt-6 text-gray-600">
              잠시만 기다려주세요!
            </p>
          </div>
        </div>
      )}
                </>
            ) : (

                <>
                    <div className="mt-10">
                        <div className="mb-4 ml-auto w-fit">
                            <p className="text-sm text-gray-600 mb-2 text-right">질문</p>
                            <div className="p-2 bg-blue-400 border border-gray-300 rounded-md shadow-md w-fit">
                                <p className="text-white font-semibold">{question}</p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <p className="text-sm text-gray-600 mb-2">답변</p>
                            <div className="p-2 bg-white border border-gray-300 rounded-md shadow-md">
                                <div className="prose prose-sm max-w-none text-gray-800">
                                    <ReactMarkdown components={markdownComponents}>
                                        {displayedText || response}
                                    </ReactMarkdown>
                                    {isTyping && (
                                        <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse">|</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={handleNewQuestion}
                            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full"
                        >
                            새 질문하기
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}