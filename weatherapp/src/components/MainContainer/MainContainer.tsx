import React from 'react';
import TenDayForecast from '../TenDayForecast/TenDayForecast';
import HourlyForecast from '../HourlyForecast/HourlyForecast';
import './MainContainer.css';

import { WeatherData } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faSun, faTint, faEye, faCloudRain } from '@fortawesome/free-solid-svg-icons';

interface MainContainerProps {
  weatherData: WeatherData;
  tempUnit: string;
//   windUnit: string;
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

  // Map URL
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${MAPS_API_KEY}&center=${weatherData.location.lat},${weatherData.location.lon}&zoom=12`;


  // Get the local time of the searched city from the weatherData object
  const localTime = weatherData.location.localtime;

  // Parse the local time to create a Date object
  const now = new Date(localTime);

  // Extract sunrise and sunset times
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

  // Determine whether to display sunrise or sunset
  const isBeforeSunrise = now < sunriseTime;
  const isAfterSunset = now > sunsetTime;

  const getUVDescription = (uvIndex: number, sunsetTime: Date) => {
    let description = '';
  
    // UV description based on index
    if (uvIndex <= 2) {
      description = 'Low';
    } else if (uvIndex <= 5) {
      description = 'Moderate';
    } else if (uvIndex <= 7) {
      description = 'High';
    } else if (uvIndex <= 10) {
      description = 'Very High';
    } else {
      description = 'Extreme';
    }
  
    // Get sunset time in hours and minutes (in 24-hour format)
    const sunsetHour = sunsetTime.getHours();
    const sunsetMinutes = sunsetTime.getMinutes().toString().padStart(2, '0'); // Add leading zero if necessary
  
    // Return description with dynamic sun protection time
    return `${description}`;
  };
  

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



      {/* Map */}
      <div className="map-box">
        <iframe
          title="Weather Map"
          width="100%"
          height="170"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://www.google.com/maps/embed/v1/view?key=${MAPS_API_KEY}&center=${weatherData.location.lat},${weatherData.location.lon}&zoom=12`}
          allowFullScreen
        ></iframe>
      </div>

    {/* UV Index Box */}
    <div className="box uv-index-box">
    <div className="uv-index-header">
    <FontAwesomeIcon icon={faSun} className="uv-icon" /> {/* Icon */}
    <p>UV Index</p> {/* Header text */}
  </div>
    <div className="uv-index-value">{weatherData.current.uv}</div>
    <div className="uv-index-description">
    <p>{getUVDescription(uvIndex, sunsetTime)}</p>
    <p>Use sun protection until {sunsetTime.getHours()}:{sunsetTime.getMinutes().toString().padStart(2, '0')}</p>
  </div>
    </div>

      {/* Sunrise/Sunset Box */}
      <div className="box sunset-sunrise-box">
        <div className="label">
          <FontAwesomeIcon icon={faSun} className="icon" /> {/* Icon */}
          <div className="label-text">
            {isBeforeSunrise ? "SUNRISE" : isAfterSunset ? "NEXT SUNRISE" : "SUNSET"}
          </div>
        </div>
        <div className="time">
          {isBeforeSunrise
            ? `${sunriseHour}:${sunriseMinutesStr}`
            : isAfterSunset
            ? `${nextSunriseTime.getHours()}:${nextSunriseTime.getMinutes().toString().padStart(2, '0')}`
            : `${sunsetHour}:${sunsetMinutesStr}`}
        </div>
      </div>

      {/* Humidity Box */}
<div className="box humidity-box">
  <div className="humidity-label">
    <FontAwesomeIcon icon={faTint} className="icon" />
    <div className="label">HUMIDITY</div>
  </div>
  <div className="humidity-percentage">{weatherData.current.humidity}%</div>
  <div className="humidity-description">
    {/* Convert dew point temperature */}
    The dew point is {convertTemp(weatherData.current.dewpoint_c).toFixed(1)}{tempUnitSymbol} right now.
  </div>
</div>


      {/* Visibility Box */}
      <div className="box visibility-box">
        <div className="visibility-label">
          <FontAwesomeIcon icon={faEye} className="icon" />
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
          <FontAwesomeIcon icon={faThermometerHalf} className="icon" />
          <div className="label">FEELS LIKE</div>
        </div>
        <div className="temperature">
          {convertTemp(weatherData.current.feelslike_c).toFixed(1)}{tempUnitSymbol} {/* Convert "Feels Like" temp */}
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
          <FontAwesomeIcon icon={faCloudRain} className="icon" />
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
