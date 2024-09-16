import React from 'react';
import "./SettingsModal.css"

const SettingsModal = () => {
  return (
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
  );
};


export default SettingsModal;
