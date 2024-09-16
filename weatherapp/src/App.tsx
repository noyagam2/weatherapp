import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherInfo from './components/WeatherInfo/WeatherInfo';
import InfoBoxes from './components/InfoBoxes/InfoBoxes';
import SettingsButton from './components/SettingsButton/SettingsButton';
import SettingsModal from './components/SettingsModal/SettingsModal';

const API_KEY = '286127cbb1534e36bb2110806240409';

function App() {
  // State to store the weather data and city input
  const [weatherData, setWeatherData] = useState<any>(null);
  const [cityInput, setCityInput] = useState<string>('');

  // Function to fetch weather by city
  const fetchWeatherByCity = (city: string, tempUnit = 'celsius', windUnit = 'kmh') => {
    fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data); // Store weather data in state
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  // Function to fetch weather by coordinates (latitude and longitude)
  const fetchWeatherByCoordinates = (lat: number, lon: number, tempUnit = 'celsius', windUnit = 'kmh') => {
    fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data); // Store weather data in state
      })
      .catch((error) => {
        console.error('Error fetching weather data by coordinates:', error);
      });
  };

  // Function to get the user's current location
  const getCurrentLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoordinates(lat, lon); // Fetch weather using coordinates
      },
      (error) => {
        console.log('Geolocation error:', error);
        fetchWeatherByCity('London'); // Fallback to London if geolocation fails
      }
    );
  };

  // Fetch weather for the user's current location on component mount
  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  // Handle form submission for city search
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cityInput) {
      fetchWeatherByCity(cityInput); // Fetch and display the weather for the entered city
    }
  };

  // Function to update background dynamically based on weather conditions
  const updateBackground = (weatherData: any) => {
    const condition = weatherData.current.condition.text.toLowerCase();
    const isDay = weatherData.current.is_day;

    let backgroundImage = '';

    if (condition.includes('sunny')) {
      backgroundImage = isDay
        ? 'url("https://www.thecalifornian.com/gcdn/-mm-/e5c305e00d80354d1c0350948b3ccc39c5d4956e/c=0-202-3867-2377/local/-/media/Salinas/2015/03/19/B9316661963Z.1_20150319105958_000_GLQA8VSAM.1-0.jpg?width=660&height=372&fit=crop&format=pjpg&auto=webp")'
        : 'url("https://media.istockphoto.com/id/1397030090/photo/colorful-pastel-sky-with-clouds-at-beautiful-sunset-as-natural-background.jpg?s=612x612&w=0&k=20&c=WrRCAvlZX2jOQ8UTDHgiTs2ZhYs2aO8uw4sWJASxo5c=")';
    } else if (condition.includes('rain')) {
      backgroundImage = isDay
        ? 'url("https://img.freepik.com/premium-vector/dense-white-sun-lighted-clouds-producing-pouring-rain-against-blue-sky-background_1284-56866.jpg")'
        : 'url("https://static.vecteezy.com/system/resources/previews/042/197/449/non_2x/ai-generated-sky-with-rain-background-free-photo.jpg")';
    } else if (condition.includes('cloud')) {
      backgroundImage = isDay
        ? 'url("https://static.vecteezy.com/system/resources/thumbnails/007/354/009/small/white-fluffy-clouds-with-blue-sky-on-sunny-day-beautiful-summer-cloudy-sky-background-free-photo.jpg")'
        : 'url("https://t3.ftcdn.net/jpg/00/92/57/76/360_F_92577670_M5qmsjtBd36X6YD7b2zUwmqqUXOmwVn9.jpg")';
    } else if (condition.includes('snow')) {
      backgroundImage = isDay
        ? 'url("https://pics.freeartbackgrounds.com/Blue_Cloudy_Sky_Background-1074.jpg")'
        : 'url("https://media.istockphoto.com/id/589949898/vector/falling-snow-background.jpg?s=612x612&w=0&k=20&c=Vsf1kwzwTvkWJAWqtH-VuMHRoTAaiPINhd1cH7ZsptI=")';
    } else if (condition.includes('clear')) {
      backgroundImage = isDay
        ? 'url("https://t3.ftcdn.net/jpg/04/26/79/66/360_F_426796618_1r8PAtadFhlYiMnaGmWczXxg8Nuzj76a.jpg")'
        : 'url("https://img.freepik.com/free-photo/beautiful-night-sky-with-shiny-stars_53876-16414.jpg")';
    } else {
      backgroundImage = 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-PDaZ9CdPU5SAbpn71vuDld4IfYKVc0BCXw&s")';
    }

    document.getElementById('weather-body')!.style.backgroundImage = backgroundImage;
    document.getElementById('weather-body')!.style.backgroundSize = 'cover';
    document.getElementById('weather-body')!.style.backgroundPosition = 'center';
  };

  // Display weather data in the HTML
  useEffect(() => {
    if (weatherData) {
      updateBackground(weatherData);
    }
  }, [weatherData]);

  return (
    <div id="weather-body">
      <SearchBar
        placeholder="Search for a city..."
        onSubmit={handleSearchSubmit}
        cityInput={cityInput}
        setCityInput={setCityInput}
      />
      <WeatherInfo weatherData={weatherData} />
      <InfoBoxes />
      <SettingsButton />
      <SettingsModal />
    </div>
  );
}

export default App;
