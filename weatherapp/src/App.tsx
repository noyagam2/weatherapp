import React from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar'

function App() {
  return (
    <div id="weather-body">

      {/* Use the SearchBar component */}
      <SearchBar />

      <div className="weather-info">
        <h2 id="city-name">City Name</h2>
        <div className="temperature">--°</div>
        <h3 id="weather-condition">Condition</h3>
        <p id="high-low">H: --° L: --°</p>
      </div>

      {/* Main Weather Info */}
      <div className="weather-info">
        <h2 id="city-name">City Name</h2>
        <div className="temperature">--°</div>
        <h3 id="weather-condition">Condition</h3>
        <p id="high-low">H: --° L: --°</p>
      </div>

      {/* Information Boxes */}
      <div className="box-container">
        <div className="box severe-weather">Severe Weather</div>
        <div className="box today-forecast">Today's Forecast</div>
        <div className="box ten-day-forecast">
          <h3>10-DAY FORECAST</h3>
          <ul id="forecast-list">
            {/* JavaScript will dynamically insert forecast data here */}
          </ul>
        </div>
        <div className="box wind">WIND</div>
        <div className="box precipitation-map">PRECIPITATION MAP</div>
        <div className="box visibility">VISIBILITY</div>
        <div className="box uv-index">UV INDEX</div>
        <div className="box sunset">SUNSET</div>
        <div className="box feels-like">FEELS LIKE</div>
        <div className="box precipitation">PRECIPITATION</div>
        <div className="box first-quarter">FIRST QUARTER</div>
        <div className="box humidity">HUMIDITY</div>
        <div className="box pressure">PRESSURE</div>
        <div className="box averages">AVERAGES</div>
      </div>

      {/* Settings Button to open the modal */}
      <button id="settings-button">Settings</button>

      {/* Modal for Settings */}
      <div id="settings-modal" className="modal">
        <div className="modal-content">
          <h2>Settings</h2>
          
          {/* Temperature Unit Preference */}
          <label htmlFor="temp-unit">Temperature Unit:</label>
          <select id="temp-unit">
            <option value="celsius">Celsius (°C)</option>
            <option value="fahrenheit">Fahrenheit (°F)</option>
          </select>

          {/* Wind Unit Preference */}
          <label htmlFor="wind-unit">Wind Unit:</label>
          <select id="wind-unit">
            <option value="mph">Miles per hour (mph)</option>
            <option value="km/h">Kilometers per hour (km/h)</option>
            <option value="m/s">Meters per second (m/s)</option>
            <option value="bft">Beaufort (bft)</option>
            <option value="kn">Knots (kn)</option>
          </select>

          {/* Default City Selection */}
          <label htmlFor="default-city">Default City:</label>
          <input type="text" id="default-city" placeholder="Enter a city" autoComplete="off" />
          <ul id="city-suggestions" className="suggestions-list"></ul>

          <button id="use-my-location">Use My Location</button>

          {/* Save Button */}
          <button id="save-settings">Save Settings</button>
        </div>
      </div>
    </div>
  );
}

export default App;
