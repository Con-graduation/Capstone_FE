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

    // 박자 히스토리 데이터 처리
    const prepareRhythmChartData = () => {
        const history = feedbackData.rhythmHistory || [];
        const labels = [];
        const data = [];
        
        // 히스토리 데이터 처리
        history.forEach((item) => {
            if (item.practicedAt) {
                const date = new Date(item.practicedAt);
                const day = date.getDate(); // 날짜 추출 (예: 14)
                labels.push(`${day}일`);
                data.push(item.accuracy || 0);
            }
        });
        
        // 현재 피드백 데이터 추가 (맨 오른쪽)
        const today = new Date();
        const todayDay = today.getDate();
        labels.push(`${todayDay}일`);
        data.push(rhythmAccuracy);
        
        return { labels, data };
    };

    // 음정 히스토리 데이터 처리
    const preparePitchChartData = () => {
        const history = feedbackData.pitchHistory || [];
        const labels = [];
        const data = [];
        
        // 히스토리 데이터 처리
        history.forEach((item) => {
            if (item.practicedAt) {
                const date = new Date(item.practicedAt);
                const day = date.getDate(); // 날짜 추출 (예: 14)
                labels.push(`${day}일`);
                data.push(item.accuracy || 0);
            }
        });
        
        // 현재 피드백 데이터 추가 (맨 오른쪽)
        const today = new Date();
        const todayDay = today.getDate();
        labels.push(`${todayDay}일`);
        data.push(pitchAccuracy);
        
        return { labels, data };
    };

    const rhythmChartData = prepareRhythmChartData();
    const pitchChartData = preparePitchChartData();

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
                   
                </div>
            </div>
            <div className="flex flex-col items-center gap-4">
            <BarChart 
            title="지난 연습과 비교" 
            description="막대를 터치해주세요!"
            labels={rhythmChartData.labels}
            data={rhythmChartData.data}
            backgroundColor={rhythmChartData.data.map(() => 'rgba(59, 130, 246, 0.8)')}
            borderColor={rhythmChartData.data.map(() => 'rgba(59, 130, 246, 1)')}
          />
            <ShortFeedback type="worst" text={feedbackData.rhythmWorstSection} page="feedBack" />
            <ShortFeedback type="comparison" text={feedbackData.rhythmComparison || "지난 연습 기록이 없습니다."} page="feedBack" />
           
            </div>

            
            <div className="flex flex-col items-center gap-4 px-4">
                <h2 className="text-xl font-bold mr-auto">음정 정확도</h2>
                <div className="relative w-96 h-64 bg-white rounded-lg p-4 pb-8 shadow-md flex flex-col justify-center items-center">
                    <Doughnut data={pitchData} options={options} />
                    <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-3xl font-bold text-green-500">{pitchAccuracy}%</p>
                    </div>
                    <p className="text-md font-semibold text-center">{feedbackData.pitchFeedback}</p>
                   
                </div>
            </div>
            <div className="flex flex-col items-center gap-4">
            <BarChart 
            title="지난 연습과 비교" 
            description="막대를 터치해주세요!"
            labels={pitchChartData.labels}
            data={pitchChartData.data}
            backgroundColor={pitchChartData.data.map(() => 'rgba(16, 185, 129, 0.8)')}
            borderColor={pitchChartData.data.map(() => 'rgba(16, 185, 129, 1)')}
          />
          <ShortFeedback type="worst" text={feedbackData.pitchWorstSection} page="feedBack" />
          <ShortFeedback type="comparison" text={feedbackData.pitchComparison || "지난 연습 기록이 없습니다."} page="feedBack" />
        
            </div>
        </div>
    )
}