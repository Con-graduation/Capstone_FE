import React from 'react';
import infoIcon from '../assets/infoIcon.svg';

const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  label, 
  error, 
  className = '',
  essential = false,
  information=false,
  button=false,
  buttonText='',
  buttonDisabled=false,
  onClick,
  ...props 
}) => {
  return (
    <div className={`relative flex w-full items-center gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 w-[22%] text-right flex items-center justify-end gap-2 flex-shrink-0">
          {label}
          {essential && <span className="text-red-500">*</span>}
          {information && <span className="text-gray-500">
            <img src={infoIcon} alt="infoIcon" className="w-4 h-4 cursor-pointer " />
            </span>}
        </label>
      )}
      <div className={`flex items-center gap-2 ${button ? 'w-[75%]' : 'flex-1'}`}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            ${button ? 'w-[80%]' : 'w-full'} px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition duration-200 ease-in-out
            ${error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          {...props}
        />
        {button && (
          <button 
            type="button"
            disabled={buttonDisabled}
            onClick={() => {
              if (buttonDisabled) return;
              if (onClick) {
                onClick();
              }
            }}
            className={`px-2 py-2 border rounded-md whitespace-nowrap transition-colors duration-200 ${
              buttonDisabled 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:shadow-md hover:bg-blue-600'
            }`}
          >
            {buttonText}
          </button>
        )}
      </div>
      {error && (
        <p className="absolute top-full left-20 text-sm text-red-600 z-10">{error}</p>
      )}
    </div>
  );
};

export default Input;
