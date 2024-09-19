import React from 'react';
import TenDayForecast from '../TenDayForecast/TenDayForecast';
import HourlyForecast from '../HourlyForecast/HourlyForecast';
import './MainContainer.css';
import { WeatherData } from '../../types';

const MAPS_API_KEY = 'AIzaSyAmk4UVxsb8M3uYUdETUNPX7r9Yqk0ei3c';

interface MainContainerProps {
  weatherData: WeatherData;
  tempUnit: string;
  windUnit: string;
  apiKey: string;
}

const MainContainer = ({ weatherData, tempUnit, windUnit, apiKey }: MainContainerProps) => {
  if (!weatherData) return <p>Loading...</p>;

  const forecastAvailable = weatherData.forecast && weatherData.forecast.forecastday.length > 0;
  if (!forecastAvailable) {
    return <p>Forecast data is unavailable.</p>;
  }

  const now = new Date();

  const [sunriseHourStr, sunriseMinutesStr] = weatherData.forecast.forecastday[0].astro.sunrise.split(/[: ]/);
  const [sunsetHourStr, sunsetMinutesStr] = weatherData.forecast.forecastday[0].astro.sunset.split(/[: ]/);

  const sunriseHour = parseInt(sunriseHourStr, 10);
  const sunriseMinutes = parseInt(sunriseMinutesStr, 10);
  const sunsetHour = parseInt(sunsetHourStr, 10);
  const sunsetMinutes = parseInt(sunsetMinutesStr, 10);

  const sunriseTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    sunriseHour % 12 + (weatherData.forecast.forecastday[0].astro.sunrise.includes('PM') ? 12 : 0),
    sunriseMinutes
  );

  const sunsetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    sunsetHour % 12 + (weatherData.forecast.forecastday[0].astro.sunset.includes('PM') ? 12 : 0),
    sunsetMinutes
  );

  const isDaytime = now >= sunriseTime && now <= sunsetTime;
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${MAPS_API_KEY}&center=${weatherData.location.lat},${weatherData.location.lon}&zoom=12`;

  return (
    <div className="main-container">
      {/* Main weather info */}
      <div className="weather-info">
        <h1>{weatherData.location.name}</h1>
        <h3>{weatherData.current.temp_c}°</h3>
        <p>{weatherData.current.condition.text}</p>
        <p id="high-low">H: {weatherData.current.temp_c + 2}° L: {weatherData.current.temp_c - 2}°</p>
      </div>
  
      {/* 24-Hour Forecast */}
      <div className="hourly-forecast-box">
        <HourlyForecast city={weatherData.location.name} apiKey={apiKey} />
      </div>
  
      {/* Map */}
      <div className="map-box">
        <iframe
          title="Weather Map"
          width="70%"
          height="500"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapUrl}
          allowFullScreen
        ></iframe>
      </div>
  
      {/* 10-Day Forecast */}
        <TenDayForecast city={weatherData.location.name} apiKey={apiKey} />
  
      {/* Right-side boxes: UV Index, Sunrise/Sunset, Humidity, Visibility */}
      <div className="right-container">
        <div className="uv-index-box">
          <p>UV Index</p>
          <p>{weatherData.current.uv}</p>
        </div>
        <div className="sunrise-sunset-box">
          <p>Sunrise/Sunset</p>
          <p>{isDaytime ? `Sunset at ${weatherData.forecast.forecastday[0].astro.sunset}` : `Sunrise at ${weatherData.forecast.forecastday[0].astro.sunrise}`}</p>
        </div>
        <div className="humidity-box">
          <p>Humidity</p>
          <p>{weatherData.current.humidity}%</p>
        </div>
        <div className="visibility-box">
          <p>Visibility</p>
          <p>{weatherData.current.vis_km} km</p>
        </div>
      </div>
  
      {/* Wind and Feels Like (Under the map) */}
      <div className="bottom-container">
        <div className="wind-box">
          <p>Wind</p>
          <p>{weatherData.current.wind_kph} {windUnit}</p>
        </div>
        <div className="feels-like-box">
          <p>Feels Like</p>
          <p>{weatherData.current.feelslike_c}° {tempUnit}</p>
        </div>
      </div>
    </div>
  );
  
  
};
  
export default MainContainer;
