import React from 'react';
import './InfoBoxes.css';

interface InfoBoxProps {
  title: string;
  value: string | number;
}

const InfoBox = ({ title, value }: InfoBoxProps) => {
  return (
    <div className="info-box">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default InfoBox;
