const API_KEY = '286127cbb1534e36bb2110806240409';

window.onload = () => {
    // Function to fetch and display weather data
    function fetchWeatherByCity(city, tempUnit = 'celsius', windUnit = 'kmh') {
        fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`)
            .then((response) => response.json())
            .then((data) => {
                displayWeatherData(data, tempUnit, windUnit); // Pass units to display function
            })
            .catch((error) => {
                console.error("Error fetching weather data:", error);
            });
    }
    

    

    function fetchWeatherByCoordinates(lat, lon, tempUnit = 'celsius', windUnit = 'kmh') {
        fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`)
            .then((response) => response.json())
            .then((data) => {
                displayWeatherData(data, tempUnit, windUnit); // Pass units to display function
            })
            .catch((error) => {
                console.error("Error fetching weather data by coordinates:", error);
            });
    }
    

    // Function to get the user's current location
    function getCurrentLocationWeather() {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoordinates(lat, lon); // Fetch weather using coordinates
        }, (error) => {
            console.log("Geolocation error:", error);
            fetchWeatherByCity('London'); // Fallback to London if geolocation fails
        });
    }

    // Fetch weather for the user's current location on page load
    getCurrentLocationWeather();

    // Handle form submission for city search
    document.getElementById('city-form').addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent form submission from refreshing the page
        const cityInput = document.getElementById('city-input').value; // Get the user input city
        if (cityInput) {
            fetchWeatherByCity(cityInput); // Fetch and display the weather for the entered city
        }
    });

    function updateBackground(weatherData) {
        const condition = weatherData.current.condition.text.toLowerCase(); // e.g., "sunny", "rain"
        const isDay = weatherData.current.is_day; // 1 for day, 0 for night
        
        const body = document.getElementById('weather-body'); // The body or container element
        
        let backgroundImage = ''; // Background image URL
        
        // Determine the background image based on condition and time of day
        if (condition.includes('sunny')) {
            backgroundImage = isDay 
                ? 'url("https://www.thecalifornian.com/gcdn/-mm-/e5c305e00d80354d1c0350948b3ccc39c5d4956e/c=0-202-3867-2377/local/-/media/Salinas/2015/03/19/B9316661963Z.1_20150319105958_000_GLQA8VSAM.1-0.jpg?width=660&height=372&fit=crop&format=pjpg&auto=webp")' // Daytime sunny image
                : 'url("https://media.istockphoto.com/id/1397030090/photo/colorful-pastel-sky-with-clouds-at-beautiful-sunset-as-natural-background.jpg?s=612x612&w=0&k=20&c=WrRCAvlZX2jOQ8UTDHgiTs2ZhYs2aO8uw4sWJASxo5c=")'; // Nighttime sunny image
        } else if (condition.includes('rain')) {
            backgroundImage = isDay 
                ? 'url("https://img.freepik.com/premium-vector/dense-white-sun-lighted-clouds-producing-pouring-rain-against-blue-sky-background_1284-56866.jpg")' // Daytime sunny image
                : 'url("https://static.vecteezy.com/system/resources/previews/042/197/449/non_2x/ai-generated-sky-with-rain-background-free-photo.jpg")'; // Nighttime rainy image
        } else if (condition.includes('cloud')) {
            backgroundImage = isDay 
                ? 'url("https://static.vecteezy.com/system/resources/thumbnails/007/354/009/small/white-fluffy-clouds-with-blue-sky-on-sunny-day-beautiful-summer-cloudy-sky-background-free-photo.jpg")' // Cloudy day
                : 'url("https://t3.ftcdn.net/jpg/00/92/57/76/360_F_92577670_M5qmsjtBd36X6YD7b2zUwmqqUXOmwVn9.jpg")'; // Cloudy night
        } else if (condition.includes('snow')) {
            backgroundImage = isDay 
                ? 'url("https://t3.ftcdn.net/jpg/01/28/07/32/360_F_128073284_npxUdndRunMxAHMZmCaYSjY26JpeMaK0.jpg")'
                : 'url("https://media.istockphoto.com/id/589949898/vector/falling-snow-background.jpg?s=612x612&w=0&k=20&c=Vsf1kwzwTvkWJAWqtH-VuMHRoTAaiPINhd1cH7ZsptI=")'; // Snowy night
        } else if (condition.includes('clear')) {
            backgroundImage = isDay 
                ? 'url("https://t3.ftcdn.net/jpg/04/26/79/66/360_F_426796618_1r8PAtadFhlYiMnaGmWczXxg8Nuzj76a.jpg")'
                : 'url("https://img.freepik.com/free-photo/beautiful-night-sky-with-shiny-stars_53876-16414.jpg")'; // clear night

        } else {
            backgroundImage = 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-PDaZ9CdPU5SAbpn71vuDld4IfYKVc0BCXw&s")'; // Default image
        }
        
        // Apply the background image to the body
        body.style.backgroundImage = backgroundImage;
        body.style.backgroundSize = 'cover'; // Ensure the image covers the screen
        body.style.backgroundPosition = 'center'; // Center the image
    }

    // Function to display weather data in the HTML
    function displayWeatherData(data) {
        console.log(data); // Log data for debugging

        // Update the DOM with fetched weather data
        document.querySelector(".temperature").textContent = `${data.current.temp_c}°C`;
        document.getElementById("city-name").textContent = data.location.name;
        document.getElementById("weather-condition").textContent = data.current.condition.text;
        document.getElementById("high-low").textContent = `H: ${data.current.temp_c + 2}° L: ${data.current.temp_c - 2}°`;

        // Call the function to update the background based on weather conditions
        updateBackground(data);
    }
    

    // Open and close the modal
    const settingsButton = document.getElementById('settings-button');
    const modal = document.getElementById('settings-modal');
    const saveButton = document.getElementById('save-settings');
    const tempUnitSelect = document.getElementById('temp-unit');
    const windUnitSelect = document.getElementById('wind-unit');
    const defaultCityInput = document.getElementById('default-city');
    const useMyLocationButton = document.getElementById('use-my-location');

    settingsButton.addEventListener('click', () => {
        modal.classList.add('show');
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.classList.remove('show');
        }
    });

    // Save settings to localStorage
    saveButton.addEventListener('click', () => {
        const tempUnit = tempUnitSelect.value;
        const windUnit = windUnitSelect.value;
        const defaultCity = defaultCityInput.value;
    
        // Save settings in localStorage
        localStorage.setItem('temperatureUnit', tempUnit);
        localStorage.setItem('windUnit', windUnit);
        localStorage.setItem('defaultCity', defaultCity);
    
        // If the user enters a city manually, set useLocation to false
        if (defaultCity) {
            localStorage.setItem('useLocation', false); // Ensure useLocation is set to 'false'
        }
    
        alert('Settings Saved');
        modal.classList.remove('show');
    
        // Reload the weather data based on new settings
        if (defaultCity) {
            fetchWeatherByCity(defaultCity, tempUnit, windUnit); // Explicitly load the weather for the default city
        } else if (localStorage.getItem('useLocation') === 'true') {
            const lat = localStorage.getItem('latitude');
            const lon = localStorage.getItem('longitude');
            fetchWeatherByCoordinates(lat, lon, tempUnit, windUnit); // Load weather for the current location if 'use my location' is active
        }
    });
    

    // Use "My Location" button
    useMyLocationButton.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
    
            // Save user's location in localStorage
            localStorage.setItem('useLocation', true);
            localStorage.setItem('latitude', lat);
            localStorage.setItem('longitude', lon);
    
            // Clear the default city value
            localStorage.removeItem('defaultCity');
            defaultCityInput.value = 'Using your location';
    
            // Immediately load weather data based on current location
            loadWeatherData();

            // Optionally force a page reload to ensure the correct location is displayed
            setTimeout(() => {
                location.reload();
            }, 500); // Slight delay to allow current weather fetch to complete
            });
    });
    

    // Load settings and apply them on page load
    const savedTempUnit = localStorage.getItem('temperatureUnit');
    const savedWindUnit = localStorage.getItem('windUnit');
    const savedDefaultCity = localStorage.getItem('defaultCity');

    // Apply saved settings
    if (savedTempUnit) tempUnitSelect.value = savedTempUnit;
    if (savedWindUnit) windUnitSelect.value = savedWindUnit;
    if (savedDefaultCity) defaultCityInput.value = savedDefaultCity;

    // Load weather data based on the saved city or location
    loadWeatherData();



    // Function to load weather data based on settings
    function loadWeatherData() {
    const useLocation = localStorage.getItem('useLocation') === 'true';
    const tempUnit = localStorage.getItem('temperatureUnit') || 'celsius';
    const windUnit = localStorage.getItem('windUnit') || 'kmh';
    const city = localStorage.getItem('defaultCity');
    
    if (useLocation) {
        const lat = localStorage.getItem('latitude');
        const lon = localStorage.getItem('longitude');
        if (lat && lon) {
            fetchWeatherByCoordinates(lat, lon, tempUnit, windUnit);
        } else {
            console.error('Coordinates not found.');
            fetchWeatherByCity('London', tempUnit, windUnit); // Fallback to London
        }
    } else if (city) {
        fetchWeatherByCity(city, tempUnit, windUnit);
    } else {
        fetchWeatherByCity('London', tempUnit, windUnit); // Fallback if no city is set
    }
}

    
    
    // Autocomplete functionality for the city input
    const cityInput = document.getElementById('default-city');
    const suggestionsList = document.getElementById('city-suggestions');

    // Function to fetch city suggestions from WeatherAPI
    async function fetchCitySuggestions(query) {
        try {
            const response = await fetch(`http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`);
            const cities = await response.json();
            displaySuggestions(cities);
        } catch (error) {
            console.error('Error fetching city suggestions:', error);
        }
    }

    // Function to display city suggestions
    function displaySuggestions(cities) {
        suggestionsList.innerHTML = ''; // Clear any previous suggestions
        
        if (cities.length === 0) {
            suggestionsList.style.display = 'none';
            return;
        }
        
        cities.forEach(city => {
            const listItem = document.createElement('li');
            listItem.textContent = `${city.name}, ${city.country}`;
            
            // When a user clicks on a suggestion, set the city input value
            listItem.addEventListener('click', () => {
                const selectedCity = `${city.name}, ${city.country}`;
                cityInput.value = selectedCity;

                // Save the selected city and set useLocation to false
                localStorage.setItem('defaultCity', selectedCity);
                localStorage.setItem('useLocation', false); // Set useLocation to false or remove it

                suggestionsList.innerHTML = ''; // Clear suggestions after selection
                suggestionsList.style.display = 'none'; // Hide the list
            });
            
            suggestionsList.appendChild(listItem);
        });
        
        suggestionsList.style.display = 'block'; // Show the suggestions list
    }


    // Event listener for the city input field
    cityInput.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        
        if (query.length > 2) {
            fetchCitySuggestions(query); // Fetch suggestions if user typed 3 or more characters
        } else {
            suggestionsList.innerHTML = ''; // Clear suggestions if query is too short
            suggestionsList.style.display = 'none'; // Hide the suggestions list
        }
    });


console.log('Default City:', localStorage.getItem('defaultCity'));
console.log('Use Location:', localStorage.getItem('useLocation'));

};
