import React, { useState, useEffect } from 'react';
import "./SettingsModal.css";

const API_KEY = '286127cbb1534e36bb2110806240409';

interface SettingsModalProps {
  setTempUnit: (unit: string) => void;
  setWindUnit: (unit: string) => void;
  fetchWeatherByCity: (city: string, tempUnit: string, windUnit: string) => void;
  fetchWeatherByCoordinates: (lat: number, lon: number, tempUnit: string, windUnit: string) => void;
}

const SettingsModal = ({ setTempUnit, setWindUnit, fetchWeatherByCity, fetchWeatherByCoordinates }: SettingsModalProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempUnit, setTemp] = useState('celsius');
  const [windUnit, setWind] = useState('kmh');
  const [defaultCity, setDefaultCity] = useState('');
  const [useLocation, setUseLocation] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]); // State to store city suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // State to control visibility of suggestions

  useEffect(() => {
    // Load saved settings from localStorage on mount
    const savedTempUnit = localStorage.getItem('temperatureUnit') || 'celsius';
    const savedWindUnit = localStorage.getItem('windUnit') || 'kmh';
    const savedDefaultCity = localStorage.getItem('defaultCity') || '';
    const savedUseLocation = localStorage.getItem('useLocation') === 'true';

    setTemp(savedTempUnit);
    setWind(savedWindUnit);
    setDefaultCity(savedDefaultCity);
    setUseLocation(savedUseLocation);
  }, []);

  const handleSave = () => {
    // Save settings in localStorage
    localStorage.setItem('temperatureUnit', tempUnit);
    localStorage.setItem('windUnit', windUnit);
    localStorage.setItem('defaultCity', defaultCity);
    localStorage.setItem('useLocation', String(useLocation));

    setTempUnit(tempUnit);
    setWindUnit(windUnit);

    // Fetch weather data based on settings
    if (useLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoordinates(lat, lon, tempUnit, windUnit);
      });
    } else if (defaultCity) {
      fetchWeatherByCity(defaultCity, tempUnit, windUnit);
    }

    setModalVisible(false);
    alert('Settings Saved');
  };

  // Fetch city suggestions from the API
  const fetchCitySuggestions = async (query: string) => {
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`);
      const cities = await response.json();
      setCitySuggestions(cities);
      setShowSuggestions(true); // Show suggestions when we get data
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  // Handle user input in the city field
  const handleCityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    setDefaultCity(query);

    if (query.length > 2) {
      fetchCitySuggestions(query);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false); // Hide suggestions if query is too short
    }
  };

  // Handle user selecting a city from the suggestions list
  const handleCitySelect = (city: string) => {
    setDefaultCity(city);
    setUseLocation(false); // Disable location when city is selected
    setShowSuggestions(false); // Hide suggestions after selecting
    localStorage.setItem('defaultCity', city); // Save selected city to localStorage
  };

  return (
    <>
      <button className="settings-button" onClick={() => setModalVisible(true)}>Settings</button>

      <div className={`modal ${modalVisible ? 'show' : ''}`}>
        <div className="modal-content">
          <h2>Settings</h2>

          <label htmlFor="temp-unit">Temperature Unit:</label>
          <select id="temp-unit" value={tempUnit} onChange={(e) => setTemp(e.target.value)}>
            <option value="celsius">Celsius (°C)</option>
            <option value="fahrenheit">Fahrenheit (°F)</option>
          </select>

          <label htmlFor="wind-unit">Wind Unit:</label>
          <select id="wind-unit" value={windUnit} onChange={(e) => setWind(e.target.value)}>
            <option value="kmh">Kilometers per hour (km/h)</option>
            <option value="mph">Miles per hour (mph)</option>
            <option value="m/s">Meters per second (m/s)</option>
            <option value="bft">Beaufort (bft)</option>
            <option value="kn">Knots (kn)</option>
          </select>

          {/* Toggle for Use My Location */}
          <label htmlFor="use-location-toggle" className="toggle-container">
            Use My Location
            <input
              type="checkbox"
              id="use-location-toggle"
              checked={useLocation}
              onChange={() => setUseLocation(!useLocation)}
            />
          </label>


          {/* Conditionally render the city input if Use Location is not checked */}
          {!useLocation && (
            <>
              <label htmlFor="default-city">Default City:</label>
              <input
                type="text"
                id="default-city"
                value={defaultCity}
                onChange={handleCityInput} // Handle input changes
              />

              {showSuggestions && citySuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {citySuggestions.map((city: any) => (
                    <li key={city.id} onClick={() => handleCitySelect(`${city.name}, ${city.country}`)}>
                      {city.name}, {city.country}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          <button onClick={handleSave}>Save Settings</button>
          <button onClick={() => setModalVisible(false)}>Close</button>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
