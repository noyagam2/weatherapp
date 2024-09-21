import React, { useEffect, useState } from 'react';
import './TenDayForecast.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

interface ForecastBoxProps {
  city: string;
  apiKey: string;
  tempUnit: string;  // Add the tempUnit prop to handle Celsius/Fahrenheit
}

const ForecastBox = ({ city, apiKey, tempUnit }: ForecastBoxProps) => {
  const [forecast, setForecast] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(`/v1/forecast.json?key=${apiKey}&q=${city}&days=10`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.forecast && data.forecast.forecastday.length > 0) {
          setForecast(data.forecast.forecastday);
        } else {
          setError("No forecast data available.");
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to fetch forecast:", err.message);
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchForecast();
  }, [city, apiKey]);

  // Helper function to convert Celsius to Fahrenheit
  const convertTemp = (tempCelsius: number) => {
    return tempUnit === 'fahrenheit' ? (tempCelsius * 9) / 5 + 32 : tempCelsius;
  };

  // Symbol for temperature unit
  const tempUnitSymbol = tempUnit === 'fahrenheit' ? '°F' : '°C';

  // Helper function to format the date as "Today", "Tomorrow", or day names like "Thursday"
  const formatDayName = (dateString: string, index: number) => {
    const today = new Date();
    const targetDate = new Date(dateString);

    const isToday = today.toDateString() === targetDate.toDateString();
    const isTomorrow = new Date(today.setDate(today.getDate() + 1)).toDateString() === targetDate.toDateString();

    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";

    return targetDate.toLocaleDateString("en-US", { weekday: 'long' });
  };

  if (error) return <p>Error: {error}</p>;
  if (!forecast.length) return <p>Loading...</p>;

  return (
    <div className="ten-day-forecast-box">
      <h3 className="forecast-header">
        <FontAwesomeIcon icon={faCalendarAlt} className="header-icon" /> 7-DAY FORECAST
      </h3>
      <ul className="forecast-list">
        {forecast.map((day: any, index: number) => (
          <li key={day.date} className="forecast-day">
            <span className="forecast-date">{formatDayName(day.date, index)}</span>
            <img
              src={day.day.condition.icon}
              alt={day.day.condition.text}
              className="forecast-icon"
            />
            <span className="forecast-temp">
              {/* Convert and display min/max temperatures with unit */}
              {Math.round(convertTemp(day.day.mintemp_c))}{tempUnitSymbol} - {Math.round(convertTemp(day.day.maxtemp_c))}{tempUnitSymbol}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForecastBox;
