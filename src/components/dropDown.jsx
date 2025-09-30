import arrowIcon from '../assets/arrowIcon.svg';
import { useState } from 'react';

export default function DropDown({title, options, selectedValue, onSelect}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <button
          type="button"
          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
          onClick={handleToggle}
        >
          <span className="text-gray-900">{selectedValue || title}</span>
          <img 
            src={arrowIcon} 
            alt="arrow" 
            className={`w-3 h-3 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`}
          />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
            {options.map((option) => (
              <div
                key={option}
                className="px-3 py-2 text-sm text-gray-900 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}