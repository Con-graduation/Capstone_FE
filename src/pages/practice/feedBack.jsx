import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import BarChart from '../../components/BarChart';
import { useLocation } from 'react-router-dom';
import ShortFeedback from '../../components/shortFeedback';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FeedBack() {
    const location = useLocation();
    const { feedbackData } = location.state || {};
    console.log('feedbackData:', feedbackData);
    
    // 데이터가 없을 경우 처리
    if (!feedbackData) {
        return (
            <div className="min-h-screen w-screen bg-[#EEF5FF] flex items-center justify-center">
                <p className="text-xl">피드백 데이터를 불러올 수 없습니다.</p>
            </div>
        );
    }
    
    // 박자 정확도 데이터
    const rhythmAccuracy = feedbackData.rhythmAccuracy || 0;
    const rhythmData = {
        datasets: [{
            data: [rhythmAccuracy, 100 - rhythmAccuracy],
            backgroundColor: [
                '#3b82f6',
                '#e5e7eb'
            ],
            borderWidth: 0
        }]
    };

    // 음정 정확도 데이터
    const pitchAccuracy = feedbackData.pitchAccuracy || 0;
    const pitchData = {
        datasets: [{
            data: [pitchAccuracy, 100 - pitchAccuracy],
            backgroundColor: [
                '#10b981',
                '#e5e7eb'
            ],
            borderWidth: 0
        }]
    };

    const options = {
        cutout: '70%',
        rotation: -90,
        circumference: 180,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        if (context.dataIndex === 0) {
                            return `정확도: ${context.parsed}%`;
                        }
                        return '';
                    }
                }
            }
        }
    };

    return (
        <div className="min-h-screen w-screen bg-[#EEF5FF] flex flex-col items-center pt-10 gap-10 pb-20">
            <h1 className="text-2xl font-bold">연습 피드백</h1>
            <p className="text-xl text-center px-4">{feedbackData.overallFeedback}</p>
            
            <div className="flex flex-col items-center gap-4 px-4">
                <h2 className="text-xl font-bold mr-auto">박자 정확도</h2>
                <div className="relative w-96 h-64 bg-white rounded-lg p-4 pb-8 shadow-md flex flex-col justify-center items-center">
                    <Doughnut data={rhythmData} options={options} />
                    <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-3xl font-bold text-blue-500">{rhythmAccuracy}%</p>
                    </div>
                    <p className="text-md font-semibold text-center">{feedbackData.rhythmFeedback}</p>
                    {feedbackData.rhythmWorstSection && (
                        <p className="text-sm text-gray-600 mt-2">{feedbackData.rhythmWorstSection}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center gap-4">
            {/* <BarChart 
            title="연습별 정확도 추이" 
            description="막대를 터치해주세요!" 
          /> */}
            <ShortFeedback type="worst" text={feedbackData.rhythmWorstSection} page="feedBack" />
            <ShortFeedback type="comparison" text={feedbackData.rhythmComparisonSection || "지난 연습 기록이 없습니다."} page="feedBack" />
            <ShortFeedback type="difficulty" text={feedbackData.rhythmDifficultySection || "지난 연습 기록이 없습니다."} page="feedBack" />
            </div>

            
            <div className="flex flex-col items-center gap-4 px-4">
                <h2 className="text-xl font-bold mr-auto">음정 정확도</h2>
                <div className="relative w-96 h-64 bg-white rounded-lg p-4 pb-8 shadow-md flex flex-col justify-center items-center">
                    <Doughnut data={pitchData} options={options} />
                    <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-3xl font-bold text-green-500">{pitchAccuracy}%</p>
                    </div>
                    <p className="text-md font-semibold text-center">{feedbackData.pitchFeedback}</p>
                    {feedbackData.pitchWorstSection && (
                        <p className="text-sm text-gray-600 mt-2">{feedbackData.pitchWorstSection}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center gap-4">
            {/* <BarChart 
            title="연습별 정확도 추이" 
            description="막대를 터치해주세요!" 
          /> */}
          <ShortFeedback type="worst" text={feedbackData.pitchWorstSection} page="feedBack" />
          <ShortFeedback type="comparison" text={feedbackData.pitchComparisonSection || "지난 연습 기록이 없습니다."} page="feedBack" />
          <ShortFeedback type="difficulty" text={feedbackData.pitchDifficultySection || "지난 연습 기록이 없습니다."} page="feedBack" />
            </div>
        </div>
    )
}