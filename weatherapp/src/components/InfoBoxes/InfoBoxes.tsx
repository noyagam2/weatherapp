import React from 'react';
import "./InfoBoxes.css";
import TenDayForecast from '../TenDayForecast/TenDayForecast';

interface InfoBoxesProps {
  weatherData: any;  // Use `any` for now unless you know the exact structure of `weatherData`
  tempUnit: string;
  windUnit: string;
}

const InfoBoxes = ({ weatherData, tempUnit, windUnit }: InfoBoxesProps) => {
  if (!weatherData) return null;

  return (
    <div className="box-container">
        <div className="box today-forecast">Today's Forecast</div>
        
        {/* The TenDayForecast is placed in its specific grid box */}
        <div className="box ten-day-forecast">
          <TenDayForecast city="London" apiKey="YOUR_API_KEY_HERE" />
        </div>

        <div className="box wind">WIND</div>
        <div className="box precipitation-map">PRECIPITATION MAP</div>
        <div className="box visibility">VISIBILITY</div>
        <div className="box uv-index">UV INDEX</div>
        <div className="box sunset">SUNSET</div>
        <div className="box feels-like">FEELS LIKE</div>
        <div className="box precipitation">PRECIPITATION</div>
        <div className="box humidity">HUMIDITY</div>
        <div className="box pressure">PRESSURE</div>
        <div className="box averages">AVERAGES</div>
    </div>
  );
};

export default InfoBoxes;
