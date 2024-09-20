import React from 'react';
import './HourlyForecast.css';  // Import CSS for styling
import { WeatherData } from '../../types';  // Ensure WeatherData type is correctly imported

interface HourlyForecastProps {
  weatherData: WeatherData;
  tempUnit: string; // Add the tempUnit prop to handle Celsius/Fahrenheit
}

const HourlyForecast = ({ weatherData, tempUnit }: HourlyForecastProps) => {
  const forecast = weatherData.forecast.forecastday[0].hour;
  const currentTime = new Date(weatherData.location.localtime);
  const currentHour = currentTime.getHours();
  const nextDayForecast = weatherData.forecast.forecastday[1]?.hour || [];

  // Combine remaining hours from today with the next day's initial hours
  const upcomingForecast = [...forecast.slice(currentHour), ...nextDayForecast].slice(0, 24);

  // Function to convert Celsius to Fahrenheit
  const convertTemp = (tempCelsius: number) => {
    return tempUnit === 'fahrenheit' ? (tempCelsius * 9) / 5 + 32 : tempCelsius;
  };

  // Symbol for temperature unit
  const tempUnitSymbol = tempUnit === 'fahrenheit' ? '°F' : '°C';

  return (
    <div className="hourly-forecast-container">
      <h3>24-Hour Forecast for {weatherData.location.name}</h3>
      <div className="hourly-forecast">
        {upcomingForecast.map((hour: any, index: number) => (
          <div key={index} className="hour-box">
            <span>{hour.time.split(' ')[1]}</span>  {/* Display hour (e.g., 15:00) */}
            <img src={hour.condition.icon} alt={hour.condition.text} />
            <span>{convertTemp(hour.temp_c).toFixed(1)}{tempUnitSymbol}</span>  {/* Display temperature with unit */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
