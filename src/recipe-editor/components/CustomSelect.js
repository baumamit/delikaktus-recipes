import React, { useState } from 'react';
import './custom-select.css';

const CustomSelect = ({ options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="custom-select">
      <div
        className="custom-select-selected"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValue || "Select an option"}
      </div>

      {isOpen && (
        <ul className="custom-select-options">
          {options.map((option, index) => (
            <li
              key={index}
              className="custom-select-option"
              onClick={() => handleOptionClick(option.value)}
              title={option.tooltip} // Tooltip text here
            >
              {option.icon} {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
