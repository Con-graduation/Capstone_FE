import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ title = "루틴 연습 통계", description = "막대를 터치해주세요!", labels, data: chartData, backgroundColor, borderColor }) => {
  const data = {
    labels: labels || ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [
      {
        label: '정확도 (%)',
        data: chartData || [30, 45, 20, 60, 35, 25, 40],
        backgroundColor: backgroundColor || [
          'rgba(86, 128, 243, 0.8)',
          'rgba(86, 128, 243, 0.8)',
          'rgba(86, 128, 243, 0.8)',
          'rgba(86, 128, 243, 0.8)',
          'rgba(86, 128, 243, 0.8)',
          'rgba(86, 128, 243, 0.8)',
          'rgba(86, 128, 243, 0.8)',
        ],
        borderColor: borderColor || [
          'rgba(86, 128, 243, 1)',
          'rgba(86, 128, 243, 1)',
          'rgba(86, 128, 243, 1)',
          'rgba(86, 128, 243, 1)',
          'rgba(86, 128, 243, 1)',
          'rgba(86, 128, 243, 1)',
          'rgba(86, 128, 243, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md">
      <div className="mb-4 flex flex-col gap-2 items-center">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
