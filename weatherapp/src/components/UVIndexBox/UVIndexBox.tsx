import React from 'react';
import './UVIndexBox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';  // Icon for UV index

interface UVIndexBoxProps {
  uvIndex: number;
}

const getUVSeverity = (uvIndex: number) => {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
};

const getUVDescription = (uvIndex: number) => {
  if (uvIndex <= 2) {
    return 'No protection required. Safe to be outside.';
  } else if (uvIndex <= 5) {
    return 'Use sunscreen and a hat if staying outside for long periods.';
  } else if (uvIndex <= 7) {
    return 'Protection needed. Wear sunscreen, hat, and sunglasses.';
  } else if (uvIndex <= 10) {
    return 'Extra protection is needed. Avoid direct sunlight during midday.';
  } else {
    return 'Stay indoors and avoid the sun as much as possible.';
  }
};

const UVIndexBox: React.FC<UVIndexBoxProps> = ({ uvIndex }) => {
  const severity = getUVSeverity(uvIndex);
  const description = getUVDescription(uvIndex);

  // Calculate dot position (percentage) based on UV index value
  const dotPosition = (uvIndex / 11) * 100;

  return (
    <div className="uv-index-card">
     {/* Header with icon */}
     <div className="uv-index-header">
        <FontAwesomeIcon icon={faSun} className="header-icon" /> UV INDEX
      </div>

      <div className="uv-index-value">{uvIndex}</div>
      <div className="uv-index-severity">{severity}</div>

      <div className="uv-index-bar">
        <div className="uv-index-gradient"></div>
        <div className="uv-index-dot" style={{ left: `${dotPosition}%` }}></div>
      </div>

      {/* Dynamic UV index description */}
      <div className="uv-index-description">
        {description}
      </div>
    </div>
  );
};

export default UVIndexBox;
