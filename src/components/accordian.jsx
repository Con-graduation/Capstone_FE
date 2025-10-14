import React, { useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";

registerLocale("ko", ko);

export default function Accordion({ title, type, value, onValueChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());

  const months = [
    "01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12"
  ];

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const excludeDates = [];

  const datePickHandler = (date, event) => {
    setTempDate(date);
  };

  const confirmDateSelection = () => {
    setStartDate(tempDate);
    if (onValueChange) {
      const formattedDate = tempDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      onValueChange(formattedDate);
    }
    setIsOpen(false);
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTempDate(startDate);
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'date':
        return (
          <div className="bg-white w-full h-full">
            <div className="w-full">
              <DatePicker
                inline
                className="w-full"
                locale="ko"
                selected={tempDate}
                minDate={minDate}
                maxDate={maxDate}
                dateFormat="yyyy.MM.dd(eee)"
                useWeekdaysShort={true}
                excludeDates={excludeDates}
                onChange={(date, event) => datePickHandler(date, event)}
                wrapperClassName="w-full"
                calendarClassName="w-full"
                renderCustomHeader={({
                  date,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                  decreaseMonth,
                  increaseMonth,
                }) => (
                  <div className="flex items-center justify-between p-4 bg-white w-full">
                    <button
                      className="p-2 rounded-full disabled:opacity-50"
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="text-lg font-semibold">
                      {getYear(date)}.{months[getMonth(date)]}
                    </div>
                    <button
                      className="p-2 rounded-full disabled:opacity-50"
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              />
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <button 
                    className="flex-1 bg-gray-400 text-white py-3 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    취소
                  </button>
                  <button 
                    className="flex-1 bg-blue-500 text-white py-3 rounded-md"
                    onClick={confirmDateSelection}
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'time':
        return (
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시간 선택</label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="09:00"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-400 text-white py-2 rounded-md">
                  취소
                </button>
                <button className="flex-1 bg-blue-500 text-white py-2 rounded-md">
                  확인
                </button>
              </div>
            </div>
          </div>
        );
      case 'repeat':
        return (
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">반복 설정</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="none">반복 안함</option>
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                  <option value="monthly">매월</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">요일 선택 (매주인 경우)</label>
                <div className="flex flex-wrap gap-2">
                  {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                    <button
                      key={day}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-500 transition-colors duration-200"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-400 text-white py-2 rounded-md ">
                  취소
                </button>
                <button className="flex-1 bg-blue-500 text-white py-2 rounded-md">
                  확인
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-md ">
      <button
        onClick={toggleAccordion}
        className="w-full px-4 py-3 bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
      >
        <span className="text-left font-bold text-gray-900">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {type === 'date' && startDate 
              ? startDate.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })
              : value
            }
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[440px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}