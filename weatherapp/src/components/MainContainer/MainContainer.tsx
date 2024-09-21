import React from 'react';
import TenDayForecast from '../TenDayForecast/TenDayForecast';
import HourlyForecast from '../HourlyForecast/HourlyForecast';
import UVIndexBox from '../UVIndexBox/UVIndexBox';
import './MainContainer.css';
import SunriseSunsetBox from '../SunriseSunsetBox/SunriseSunsetBox';  

import { WeatherData } from '../../types';

interface MainContainerProps {
  weatherData: WeatherData;
  tempUnit: string;
  apiKey: string;
}

const MAPS_API_KEY = 'AIzaSyAmk4UVxsb8M3uYUdETUNPX7r9Yqk0ei3c';


const MainContainer = ({ weatherData, tempUnit, apiKey }: MainContainerProps) => {
  if (!weatherData) return <p>Loading...</p>;

  const forecastAvailable = weatherData.forecast && weatherData.forecast.forecastday.length > 0;
  if (!forecastAvailable) {
    return <p>Forecast data is unavailable.</p>;
  }

  // Function to convert Celsius to Fahrenheit
  const convertTemp = (tempCelsius: number) => {
    return tempUnit === 'fahrenheit' ? (tempCelsius * 9) / 5 + 32 : tempCelsius;
  };

  // Display temperature with the correct unit
  const currentTemp = convertTemp(weatherData.current.temp_c);
  const tempUnitSymbol = tempUnit === 'fahrenheit' ? '°F' : '°C';

  // Extract sunrise and sunset times from the forecast data
  const sunrise = weatherData.forecast.forecastday[0].astro.sunrise;  // E.g., "6:29 AM"
  const sunset = weatherData.forecast.forecastday[0].astro.sunset;    // E.g., "6:37 PM"

  // Convert times to 24-hour format for easier calculations
  const formatTime = (time: string) => {
    const [hourStr, minuteStr, period] = time.split(/[: ]/);
    let hour = parseInt(hourStr, 10);
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    return `${hour.toString().padStart(2, '0')}:${minuteStr}`;
  };

  // Convert sunrise and sunset to 24-hour format
  const sunrise24 = formatTime(sunrise);
  const sunset24 = formatTime(sunset);

  // Get the local time from the weather API
  const localTime = weatherData.location.localtime; // This should give you the local time of Buenos Aires or other cities

  // Use the `localtime` field from the weather API as the current time
  const currentTime = localTime.split(' ')[1]; // Extract the time part of the localtime

  // Map URL
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${MAPS_API_KEY}&center=${weatherData.location.lat},${weatherData.location.lon}&zoom=12`;

  

  console.log("Sunrise:", sunrise);
  console.log("Sunset:", sunset);
  console.log("Current Time:", currentTime);



  return (
    <div className="main-container">
      {/* Main weather info */}
      <div className="weather-info">
        <h1>{weatherData.location.name}</h1>
        <h3>{currentTemp.toFixed(1)}{tempUnitSymbol}</h3> {/* Display current temperature with unit */}
        <p>{weatherData.current.condition.text}</p>
        <p id="high-low">
          H: {convertTemp(weatherData.current.temp_c + 2).toFixed(1)}{tempUnitSymbol}
          L: {convertTemp(weatherData.current.temp_c - 2).toFixed(1)}{tempUnitSymbol}
        </p>
      </div>

      {/* 24-Hour Forecast */}
      <div className="hourly-forecast-box">
        <HourlyForecast weatherData={weatherData} tempUnit={tempUnit} />  {/* Pass tempUnit here */}
      </div>

      {/* Sunrise/Sunset Box */}
      <SunriseSunsetBox
        sunrise={sunrise24}
        sunset={sunset24}
        currentTime={currentTime}
      />

      {/* UV Index Box */}
      <UVIndexBox uvIndex={weatherData.current.uv} />

      {/* Map */}
      <div className="map-box">
        <iframe
          title="Weather Map"
          width="100%"
          height="170"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapUrl}
          allowFullScreen
        ></iframe>
      </div>

      {/* Humidity Box */}
      <div className="box humidity-box">
        <div className="humidity-label">
          <div className="label">HUMIDITY</div>
        </div>
        <div className="humidity-percentage">{weatherData.current.humidity}%</div>
        <div className="humidity-description">
          The dew point is {convertTemp(weatherData.current.dewpoint_c).toFixed(1)}{tempUnitSymbol} right now.
        </div>
      </div>

      {/* Visibility Box */}
      <div className="box visibility-box">
        <div className="visibility-label">
          <div className="label">VISIBILITY</div>
        </div>
        <div className="visibility-distance">{weatherData.current.vis_km} km</div>
        <div className="visibility-description">
          {weatherData.current.vis_km >= 20 ? 'Perfectly clear view.' : 'Limited visibility.'}
        </div>
      </div>

      {/* Feels Like Box */}
      <div className="box feels-like-box">
        <div className="feels-like-label">
          <div className="label">FEELS LIKE</div>
        </div>
        <div className="temperature">
          {convertTemp(weatherData.current.feelslike_c).toFixed(1)}{tempUnitSymbol}
        </div>
        <div className="description">
          {weatherData.current.feelslike_c === weatherData.current.temp_c
            ? "Similar to the actual temperature."
            : "Feels different from the actual temperature."}
        </div>
      </div>

      {/* Precipitation Box */}
      <div className="box precipitation-box">
        <div className="precipitation-label">
          <div className="label">PRECIPITATION</div>
        </div>
        <div className="precipitation-amount">
          {weatherData.forecast.forecastday[0].day.totalprecip_mm} mm
        </div>
        <div className="precipitation-description">
          {weatherData.forecast.forecastday[0].day.daily_chance_of_rain === 0
            ? "None expected in next 10 days."
            : `${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}% chance of rain in the next 10 days.`}
        </div>
      </div>

      {/* Ten Day Forecast */}
      <TenDayForecast city={weatherData.location.name} apiKey={apiKey} tempUnit={tempUnit} />

    </div>
  );
};

export default MainContainer;
