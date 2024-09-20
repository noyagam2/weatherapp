import React, { useState, useEffect } from 'react';
import "./SettingsModal.css";

const API_KEY = '286127cbb1534e36bb2110806240409';

interface SettingsModalProps {
  setTempUnit: (unit: string) => void;  // Restore setTempUnit as a prop
  fetchWeatherByCity: (city: string, tempUnit: string) => void;
  fetchWeatherByCoordinates: (lat: number, lon: number, tempUnit: string) => void;
}

const SettingsModal = ({ setTempUnit, fetchWeatherByCity, fetchWeatherByCoordinates }: SettingsModalProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempUnit, setTemp] = useState('celsius');
  const [defaultCity, setDefaultCity] = useState('');
  const [useLocation, setUseLocation] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage on mount
    const savedTempUnit = localStorage.getItem('temperatureUnit') || 'celsius';
    const savedDefaultCity = localStorage.getItem('defaultCity') || '';
    const savedUseLocation = localStorage.getItem('useLocation') === 'true';

    setTemp(savedTempUnit);
    setDefaultCity(savedDefaultCity);
    setUseLocation(savedUseLocation);
  }, []);

  const handleSave = () => {
    // Save settings in localStorage
    localStorage.setItem('temperatureUnit', tempUnit);
    localStorage.setItem('defaultCity', defaultCity);
    localStorage.setItem('useLocation', String(useLocation));

    setTempUnit(tempUnit);  // This will call the function passed from the parent component

    // Fetch weather data based on settings
    if (useLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoordinates(lat, lon, tempUnit);
      });
    } else if (defaultCity) {
      fetchWeatherByCity(defaultCity, tempUnit);
    }

    setModalVisible(false);
    alert('Settings Saved');
  };

  const fetchCitySuggestions = async (query: string) => {
    try {
      const response = await fetch(`/v1/search.json?key=${API_KEY}&q=${query}`);
      const cities = await response.json();
      setCitySuggestions(cities);
      setShowSuggestions(true); 
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  const handleCityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setDefaultCity(query);

    if (query.length > 2) {
      fetchCitySuggestions(query);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false); 
    }
  };

  const handleCitySelect = (city: string) => {
    setDefaultCity(city);
    setUseLocation(false); 
    setShowSuggestions(false); 
    localStorage.setItem('defaultCity', city); 
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
                onChange={handleCityInput} 
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
