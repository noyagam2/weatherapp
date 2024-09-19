import React from 'react';
import TenDayForecast from '../TenDayForecast/TenDayForecast';
import HourlyForecast from '../HourlyForecast/HourlyForecast';
import './MainContainer.css';
import { WeatherData } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faSun } from '@fortawesome/free-solid-svg-icons';
import { faTint } from '@fortawesome/free-solid-svg-icons';  // Import the humidity icon
import { faEye } from '@fortawesome/free-solid-svg-icons';  // Import the humidity icon
import { faCloudRain } from '@fortawesome/free-solid-svg-icons';  // Import the precipitation icon




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
// Get the local time of the searched city from the weatherData object
const localTime = weatherData.location.localtime;

// Parse the local time to create a Date object
const now = new Date(localTime);



// Extract sunrise and sunset times as before
const [sunriseHourStr, sunriseMinutesStr, sunrisePeriod] = weatherData.forecast.forecastday[0].astro.sunrise.split(/[: ]/);
const [sunsetHourStr, sunsetMinutesStr, sunsetPeriod] = weatherData.forecast.forecastday[0].astro.sunset.split(/[: ]/);

const sunriseHour = sunrisePeriod === "PM" && parseInt(sunriseHourStr, 10) !== 12
  ? parseInt(sunriseHourStr, 10) + 12
  : parseInt(sunriseHourStr, 10);
const sunsetHour = sunsetPeriod === "PM" && parseInt(sunsetHourStr, 10) !== 12
  ? parseInt(sunsetHourStr, 10) + 12
  : parseInt(sunsetHourStr, 10);

// Convert sunrise and sunset to Date objects based on the city's local time
const sunriseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sunriseHour, parseInt(sunriseMinutesStr, 10));
const sunsetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sunsetHour, parseInt(sunsetMinutesStr, 10));


  // Handle the next day's sunrise if it's after sunset
  let nextSunriseTime = new Date(sunriseTime);
  if (now > sunsetTime) {
    nextSunriseTime.setDate(sunriseTime.getDate() + 1); // Move sunrise to the next day
  }

  // Calculate sun position percentage for the dynamic sun path (0% at sunrise, 100% at sunset)
  const totalDaylight = sunsetTime.getTime() - sunriseTime.getTime(); // Total time between sunrise and sunset
const timeSinceSunrise = now.getTime() - sunriseTime.getTime(); // Time since sunrise
const sunPositionPercentage = Math.min(Math.max((timeSinceSunrise / totalDaylight) * 100, 0), 100);


  // UV Index calculation
  const uvIndex = weatherData.current.uv;
  const uvPercentage = (uvIndex / 11) * 100;

  // Map URL
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${MAPS_API_KEY}&center=${weatherData.location.lat},${weatherData.location.lon}&zoom=12`;

  // Determine whether to display sunrise or sunset
  const isBeforeSunrise = now < sunriseTime;
  const isAfterSunset = now > sunsetTime;

console.log(weatherData.forecast.forecastday[0]);


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
        {/* UV Index */}
        <div className="uv-index-box">
          <p>UV Index</p>
          <div className="uv-index-value">{weatherData.current.uv}</div>
          <div className="uv-index-description">
            Moderate <br /> Use sun protection until 17:00
          </div>
          <div className="uv-index-bar">
            <div
              className="uv-index-dot"
              style={{ left: `calc(${uvPercentage}% - 6px)` }}
            ></div>
          </div>
        </div>

        {/* Conditionally display either Sunrise or Sunset based on the current time */}
        <div className="sunset-sunrise-box">
          <div className="label">
            <FontAwesomeIcon icon={faSun} className="icon" />
            <div className="label-text">
              {isBeforeSunrise ? "SUNRISE" : isAfterSunset ? "NEXT SUNRISE" : "SUNSET"}
            </div>
          </div>

          {/* Display time based on the current time */}
          <div className="time">
            {isBeforeSunrise
              ? `${sunriseHour}:${sunriseMinutesStr}`
              : isAfterSunset
              ? `${nextSunriseTime.getHours()}:${nextSunriseTime.getMinutes().toString().padStart(2, '0')}`
              : `${sunsetHour}:${sunsetMinutesStr}`}
          </div>

          {/* Dynamic sun position along the curve */}
          <div className="curve">
        <div className="sun-path"></div>
        <div className="line"></div>
        <div
            className="dot"
            style={{ left: `calc(${sunPositionPercentage}% - 8px)` }}
        ></div>
        </div>
        </div>

        {/* Humidity */}
        <div className="precipitation-box">
        <div className="precipitation-label">
            <FontAwesomeIcon icon={faCloudRain} className="icon" />
            <div className="label">PRECIPITATION</div>
        </div>
        <div className="precipitation-amount">
            {weatherData.forecast.forecastday[0].day.totalprecip_mm} mm
        </div>
        <div className="precipitation-timeframe">in last 24h</div>

        <div className="precipitation-description">
            {weatherData.forecast.forecastday[0].day.daily_chance_of_rain === 0
            ? "None expected in next 10 days."
            : `${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}% chance of rain in the next 10 days.`}
        </div>
        </div>



        {/* Visibility */}
        <div className="visibility-box">
        <div className="visibility-label">
            <FontAwesomeIcon icon={faEye} className="icon" />
            <div className="label">VISIBILITY</div>
        </div>
        <div className="visibility-distance">{weatherData.current.vis_km} km</div>
        <div className="visibility-description">
            {weatherData.current.vis_km >= 20 ? 'Perfectly clear view.' : 'Limited visibility.'}
        </div>
        </div>

      </div>

      {/* Wind and Feels Like */}
      <div className="bottom-container">
      <div className="precipitation-box">
        <div className="precipitation-label">
            <FontAwesomeIcon icon={faCloudRain} className="icon" />
            <div className="label">PRECIPITATION</div>
        </div>
        <div className="precipitation-amount">
            {weatherData.forecast.forecastday[0].day.totalprecip_mm} mm
        </div>
        <div className="precipitation-timeframe">in last 24h</div>

        <div className="precipitation-description">
            {weatherData.forecast.forecastday[0].day.daily_chance_of_rain === 0
            ? "None expected in next 10 days."
            : `${weatherData.forecast.forecastday[0].day.daily_chance_of_rain}% chance of rain in the next 10 days.`}
        </div>
        </div>



        {/* Feels Like */}
        <div className="feels-like-box">
          <div className="feels-like-label">
            <FontAwesomeIcon icon={faThermometerHalf} className="icon" />
            <div className="label">FEELS LIKE</div>
          </div>
          <div className="temperature">{weatherData.current.feelslike_c}°</div>
          <div className="description">
            {weatherData.current.feelslike_c === weatherData.current.temp_c
              ? "Similar to the actual temperature."
              : "Feels different from the actual temperature."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
