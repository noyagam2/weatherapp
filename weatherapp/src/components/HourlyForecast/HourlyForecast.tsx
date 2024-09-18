import React, { useEffect, useState } from 'react';
import './HourlyForecast.css';  // Import CSS for styling

interface HourlyForecastProps {
  city: string;
  apiKey: string;
}

const HourlyForecast = ({ city, apiKey }: HourlyForecastProps) => {
  const [forecast, setForecast] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHourlyForecast = async () => {
      try {
        const response = await fetch(`/v1/forecast.json?key=${apiKey}&q=${city}&days=1`);  // Fetching 1 day forecast for hourly data
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setForecast(data.forecast.forecastday[0].hour);  // Set hourly forecast data
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to fetch hourly forecast:", err.message);
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchHourlyForecast();
  }, [city, apiKey]);

  if (error) return <p>Error: {error}</p>;
  if (!forecast.length) return <p>Loading hourly forecast...</p>;

  return (
    <div className="hourly-forecast-container">
      <h3>24-Hour Forecast for {city}</h3>
      <div className="hourly-forecast">
        {forecast.map((hour: any, index: number) => (
          <div key={index} className="hour-box">
            <span>{hour.time.split(' ')[1]}</span>  {/* Display hour (e.g., 15:00) */}
            <img src={hour.condition.icon} alt={hour.condition.text} />
            <span>{Math.round(hour.temp_c)}°</span>  {/* Display temperature */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
