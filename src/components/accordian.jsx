import React, { useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";

registerLocale("ko", ko);

export default function Accordion({ title, type, value, onValueChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [tempDate, setTempDate] = useState(null);
  const [repeatType, setRepeatType] = useState('none');
  const [selectedDays, setSelectedDays] = useState([]);
  const [timePeriod, setTimePeriod] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');

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

  const toggleDaySelection = (day) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const confirmRepeatSelection = () => {
    let repeatValue = '';
    
    // 요일 순서 정의 (월~일)
    const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];
    
    if (repeatType === 'none') {
      repeatValue = '반복 안함';
    } else if (repeatType === 'daily') {
      repeatValue = '매일';
    } else if (repeatType === 'weekly') {
      if (selectedDays.length > 0) {
        const sortedDays = selectedDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
        repeatValue = `매주 ${sortedDays.join(', ')}`;
      } else {
        repeatValue = '매주';
      }
    } else if (repeatType === 'biweekly') {
      if (selectedDays.length > 0) {
        const sortedDays = selectedDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
        repeatValue = `격주 ${sortedDays.join(', ')}`;
      } else {
        repeatValue = '격주';
      }
    }
    
    if (onValueChange) {
      onValueChange(repeatValue);
    }
    setIsOpen(false);
  };

  const confirmTimeSelection = () => {
    if (onValueChange) {
      onValueChange(`${timePeriod} ${selectedHour}:${selectedMinute}`);
    }
    setIsOpen(false);
  };

  const selectHour = (hour) => {
    setSelectedHour(hour);
  };

  const selectMinute = (minute) => {
    setSelectedMinute(minute);
  };

  const resetTimeSelection = () => {
    setTimePeriod('');
    setSelectedHour('');
    setSelectedMinute('');
    if (onValueChange) {
      onValueChange('없음');
    }
    setIsOpen(false);
  };

  const resetDateSelection = () => {
    setStartDate(null);
    setTempDate(null);
    if (onValueChange) {
      onValueChange('없음');
    }
    setIsOpen(false);
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
                    onClick={resetDateSelection}
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
              <div className="flex items-center justify-between gap-4">
                <button 
                  onClick={() => setTimePeriod('오전')}
                  className={`flex-1 py-2 rounded-md transition-colors duration-200 ${
                    timePeriod === '오전' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-200 text-gray-700'
                  }`}
                >
                  오전
                </button>
                <button 
                  onClick={() => setTimePeriod('오후')}
                  className={`flex-1 py-2 rounded-md transition-colors duration-200 ${
                    timePeriod === '오후' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-200 text-gray-700'
                  }`}
                >
                  오후
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시</label>
                <div className="flex flex-wrap gap-4 justify-center mb-4">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <button
                      key={hour}
                      onClick={() => selectHour(hour.toString())}
                      className={`w-10 h-10 rounded-full transition-colors duration-200 px-2 py-1 ${
                        selectedHour === hour.toString()
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-blue-200 text-gray-700 hover:bg-blue-300'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">분</label>
                <div className="flex flex-wrap gap-4 justify-center">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => {
                    const minuteStr = minute.toString().padStart(2, '0');
                    return (
                      <button
                        key={minuteStr}
                        onClick={() => selectMinute(minuteStr)}
                        className={`w-10 h-10 rounded-full transition-colors duration-200 px-2 py-1 ${
                          selectedMinute === minuteStr
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-blue-200 text-gray-700 hover:bg-blue-300'
                        }`}
                      >
                        {minuteStr}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="flex-1 bg-gray-400 text-white py-2 rounded-md"
                  onClick={resetTimeSelection}
                >
                  취소
                </button>
                <button 
                  className="flex-1 bg-blue-500 text-white py-2 rounded-md"
                  onClick={confirmTimeSelection}
                >
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">반복 유형</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="repeatType" 
                        value="none" 
                        checked={repeatType === 'none'}
                        onChange={(e) => setRepeatType(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">반복 안함</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="repeatType" 
                        value="daily"
                        checked={repeatType === 'daily'}
                        onChange={(e) => setRepeatType(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">매일</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="repeatType" 
                        value="weekly"
                        checked={repeatType === 'weekly'}
                        onChange={(e) => setRepeatType(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">매주</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="repeatType" 
                        value="biweekly"
                        checked={repeatType === 'biweekly'}
                        onChange={(e) => setRepeatType(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">격주</span>
                    </label>
                  </div>
                </div>
              {(repeatType === 'weekly' || repeatType === 'biweekly') && (
        <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">요일 선택</label>
                  <div className="flex flex-wrap gap-2 justify-around">
                    {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                      <button
                        key={day}
                        onClick={() => toggleDaySelection(day)}
                        className={`w-10 h-10 rounded-full transition-colors duration-200 px-2 py-1 ${
                          selectedDays.includes(day)
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-blue-200 text-gray-700 hover:bg-blue-300'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button 
                  className="flex-1 bg-gray-400 text-white py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  취소
                </button>
                <button 
                  className="flex-1 bg-blue-500 text-white py-2 rounded-md"
                  onClick={confirmRepeatSelection}
                >
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
              : type === 'date'
              ? '없음'
              : type === 'time' && timePeriod && selectedHour && selectedMinute
              ? `${timePeriod} ${selectedHour}:${selectedMinute}`
              : type === 'time'
              ? '없음'
              : type === 'repeat' && (repeatType !== 'none' || selectedDays.length > 0)
              ? (() => {
                  const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];
                  
                  if (repeatType === 'none') return '반복 안함';
                  if (repeatType === 'daily') return '매일';
                  if (repeatType === 'weekly') {
                    if (selectedDays.length > 0) {
                      const sortedDays = selectedDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
                      return `매주 ${sortedDays.join(', ')}`;
                    }
                    return '매주';
                  }
                  if (repeatType === 'biweekly') {
                    if (selectedDays.length > 0) {
                      const sortedDays = selectedDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
                      return `격주 ${sortedDays.join(', ')}`;
                    }
                    return '격주';
                  }
                  return value;
                })()
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
          isOpen ? 'max-h-[30rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}