import React from 'react';
import "./WeatherInfo.css"

interface WeatherInfoProps {
  weatherData: any; 
}

const WeatherInfo = ({ weatherData }: WeatherInfoProps) => {
    if (!weatherData) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="weather-info">
        <h2 id="city-name">{weatherData.location.name}</h2>
        <div className="temperature">{weatherData.current.temp_c}°C</div>
        <h3 id="weather-condition">{weatherData.current.condition.text}</h3>
        <p id="high-low">
          H: {weatherData.current.temp_c + 2}° L: {weatherData.current.temp_c - 2}°
        </p>
      </div>
    );
  };
  

export default WeatherInfo;





