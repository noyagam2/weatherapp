import React from 'react';
import './SunriseSunsetBox.css';

interface SunriseSunsetProps {
  sunrise: string;
  sunset: string;
  currentTime: string;
}

const SunriseSunsetBox: React.FC<SunriseSunsetProps> = ({ sunrise, sunset, currentTime }) => {
  const [sunriseHour, sunriseMin] = sunrise.split(':').map(Number);
  const [sunsetHour, sunsetMin] = sunset.split(':').map(Number);
  const [currentHour, currentMin] = currentTime.split(':').map(Number);

  const totalSunriseMinutes = sunriseHour * 60 + sunriseMin;
  const totalSunsetMinutes = sunsetHour * 60 + sunsetMin;
  const totalCurrentMinutes = currentHour * 60 + currentMin;

  let header = '';
  let headerTime = '';
  let footerLabel = '';
  let footerTime = '';

  if (totalCurrentMinutes < totalSunriseMinutes) {
    header = 'SUNRISE';
    headerTime = sunrise;
    footerLabel = 'Next Sunset';
    footerTime = sunset;
  } else if (totalCurrentMinutes < totalSunsetMinutes) {
    header = 'SUNSET';
    headerTime = sunset;
    footerLabel = 'Next Sunrise';
    footerTime = sunrise;
  } else {
    header = 'SUNRISE';
    headerTime = sunrise;
    footerLabel = 'Next Sunset';
    footerTime = sunset;
  }

  const dayProgressPercentage = ((totalCurrentMinutes - totalSunriseMinutes) / (totalSunsetMinutes - totalSunriseMinutes)) * 100;
  const sunPositionX = Math.max(0, Math.min((dayProgressPercentage / 100) * 100, 100));

  function getBezierY(t: number, p0: number, p1: number, p2: number): number {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }

  const t = dayProgressPercentage / 100;
  const sunPositionY = Math.min(40, Math.max(0, getBezierY(t, 40, 0, 40)));

  return (
    <div className="sunrise-sunset-card">
      <div className="header">{header}</div>
      <div className="time">{headerTime}</div>

      <div className="curve-container">
        {/* Adjusted viewBox to give padding for the dots */}
        <svg width="100%" height="50" viewBox="-10 0 120 50">  
          <path d="M 0 40 Q 50 0, 100 40" stroke="#aaa" strokeWidth="2" fill="transparent" />

          {/* Moving sun dot */}
          <circle cx={sunPositionX} cy={sunPositionY} r="5" fill="yellow" />
        </svg>
      </div>

      <div className="sunset-time">
        {footerLabel}: {footerTime}
      </div>
    </div>
  );
};

export default SunriseSunsetBox;
