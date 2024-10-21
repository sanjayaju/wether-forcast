const apiKey = '233921a489ff45f740f6f1e438931b69'; 

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const currentLocationBtn = document.getElementById('current-location-btn');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');

// Event Listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  }
});

currentLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherData(null, lat, lon);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});

// Fetch Weather Data from OpenWeatherMap API
function fetchWeatherData(city = null, lat = null, lon = null) {
  let url;
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === '200') {
        displayWeatherData(data);
      } else {
        alert('City not found');
      }
    })
    .catch(error => console.log(error));
}

// Display Weather Data in the DOM
function displayWeatherData(data) {
  // Clear previous data
  currentWeatherDiv.innerHTML = '';
  forecastDiv.innerHTML = '';

  // Display current weather
  const currentWeather = data.list[0];
  currentWeatherDiv.innerHTML = `
    <h2 class="text-2xl font-bold">${data.city.name}, ${data.city.country}</h2>
    <p class="text-4xl font-bold">${currentWeather.main.temp}°C</p>
    <p class="capitalize">${currentWeather.weather[0].description}</p>
  `;

  // Display 5-day forecast (we take one forecast per day)
  const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));
  dailyForecasts.forEach(forecast => {
    const date = new Date(forecast.dt_txt).toLocaleDateString();
    forecastDiv.innerHTML += `
      <div class="bg-blue-100 p-4 rounded-lg text-center">
        <p class="font-bold">${date}</p>
        <p class="text-lg">${forecast.main.temp}°C</p>
        <p class="capitalize">${forecast.weather[0].description}</p>
      </div>
    `;
  });
}
