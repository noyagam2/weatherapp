import React from 'react';
import InfoBoxes from '../InfoBoxes/InfoBoxes';
import TenDayForecast from '../TenDayForecast/TenDayForecast';
import HourlyForecast from '../HourlyForecast/HourlyForecast';
import './MainContainer.css';
import { WeatherData } from '../../types';  // Corrected relative path


interface MainContainerProps {
    weatherData: WeatherData;  // Use WeatherData type for consistency
    tempUnit: string;
    windUnit: string;
    apiKey: string;  // Expect apiKey as a prop
  }

  const MainContainer = ({ weatherData, tempUnit, windUnit, apiKey }: MainContainerProps) => {
    if (!weatherData) return <p>Loading!!!...</p>;

  return (
    <div className="main-container">
      <div className="weather-info">
        <h1>{weatherData.location.name}</h1>
        <p>{weatherData.current.temp_c}° {tempUnit}</p>
        <p>{weatherData.current.condition.text}</p>
        <p id="high-low">
          H: {weatherData.current.temp_c + 2}° L: {weatherData.current.temp_c - 2}°
        </p>
      </div>
      <div className="info-boxes">
        <InfoBoxes title="Wind" value={`${weatherData.current.wind_kph} ${windUnit}`} />
        <InfoBoxes title="Humidity" value={`${weatherData.current.humidity}%`} />
        <InfoBoxes title="Visibility" value={`${weatherData.current.vis_km} km`} />
        {/* Pass the apiKey prop to the TenDayForecast component */}
        <TenDayForecast city={weatherData.location.name} apiKey={apiKey} />
        <HourlyForecast city={weatherData.location.name} apiKey={apiKey} />

      </div>
    </div>
  );
};

export default MainContainer;
