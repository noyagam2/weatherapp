import React, { useEffect, useState } from 'react';
import './TenDayForecast.css';

interface ForecastBoxProps {
  city: string;
  apiKey: string;
}

const ForecastBox = ({ city, apiKey }: ForecastBoxProps) => {
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
        console.log("Forecast Data:", data); // Check if 10 days of data are returned

        console.log("Forecast Data:", data); // Log the data for debugging

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
  if (!forecast.length) return <p>Loading!!...</p>;

  return (
    <div className="ten-day-forecast-box">
      <h3>10-DAY FORECAST</h3>
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
              {Math.round(day.day.mintemp_c)}° - {Math.round(day.day.maxtemp_c)}°
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForecastBox;
