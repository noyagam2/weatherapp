import React from 'react';
import "./InfoBoxes.css"

const InfoBoxes = () => {
  return (
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
  );
};


export default InfoBoxes;
