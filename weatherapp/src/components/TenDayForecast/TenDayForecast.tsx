import React, { useEffect, useState } from 'react';
import "./TenDayForecast.css"; 
const API_KEY = '286127cbb1534e36bb2110806240409';


interface TenDayForecastProps {
  city: string;
  apiKey: string;
}

const TenDayForecast = ({ city, apiKey }: TenDayForecastProps) => {
  const [forecast, setForecast] = useState<any[]>([]); // Array to store the 10-day forecast

  useEffect(() => {
    const fetchForecast = async () => {
      const response = await fetch(
        `/v1/forecast.json?key=${API_KEY }&q=${city}&days=10`
      );
      const data = await response.json();
      setForecast(data.forecast.forecastday); // Save the 10-day forecast data
    };

    fetchForecast();
  }, [city, API_KEY ]);

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



  if (!forecast.length) return <p>Loading...</p>;

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

export default TenDayForecast;
