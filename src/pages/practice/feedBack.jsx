import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import BarChart from '../../components/BarChart';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FeedBack() {
    // 박자 정확도 데이터 (예시: 85%)
    const rhythmAccuracy = 85;
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

    // 음정 정확도 데이터 (예시: 92%)
    const pitchAccuracy = 92;
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
        <div className="min-h-screen w-screen bg-[#EEF5FF] flex flex-col items-center pt-10 gap-10">
            <h1 className="text-2xl font-bold">000님의 연습 피드백</h1>
            
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl font-bold mr-auto">박자 정확도</h2>
                <div className="relative w-96 h-64 bg-white rounded-lg p-4 pb-8 shadow-md flex flex-col justify-center items-center">
                    <Doughnut data={rhythmData} options={options} />
                    <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-3xl font-bold text-blue-500">{rhythmAccuracy}%</p>
                    </div>
                    <p className="text-md font-semibold text-center">조금 더 연습하면 100%에 <br/>도달할 수 있겠어요!</p>
                    <p></p>
                </div>
            </div>
            <div>
            <BarChart 
            title="연습별 정확도 추이" 
            description="막대를 터치해주세요!" 
          />
            </div>

            
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl font-bold mr-auto">음정 정확도</h2>
                <div className="relative w-96 h-64 bg-white rounded-lg p-4 pb-8 shadow-md flex flex-col justify-center items-center">
                    <Doughnut data={pitchData} options={options} />
                    <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-3xl font-bold text-green-500">{pitchAccuracy}%</p>
                    </div>
                    <p className="text-md font-semibold text-center">거의 완벽한 수준이에요!</p>
                    <p className="text-sm font-light text-center">한두 박자만 더 신경 쓰면 완벽해질 거예요</p>
                </div>
            </div>
            <div>
            <BarChart 
            title="연습별 정확도 추이" 
            description="막대를 터치해주세요!" 
          />
            </div>
        </div>
    )
}