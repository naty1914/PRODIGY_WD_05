let isCelsius = true;
function getWeather() {
    // I am using my api key here because it' a simple app for learning.😊
    const apikey = '2129f5ae9e3cf052bc0dbffbc12b885c';
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter city name');
        return;
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;

    const toggleButton = document.getElementById('toggle-unit');
    toggleButton.style.display = 'none';

    fetch(currentWeatherUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            showWeatherData(data);
            toggleButton.style.display = 'inline-block';
        })
        .catch(err => {
            console.error('Error fetching weather data:', err);
            alert('Error fetching weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            showHourlyForecast(data);
        })
        .catch(err => {
            console.error('Error fetching houlry forecast data:', err);
            alert('Error fetching hourly forecast data. Please try again.');
        });

}

function showWeatherData(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfo = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfo.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfo.innerHTML = `<p>${data.message}</p>`
    } else {
        const cityName = data.name;
        const tempCelsius = Math.round(data.main.temp - 273.15);
        const temp = isCelsius ? tempCelsius : convertToFahrenheit(tempCelsius);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const tempratureHtml = `<p>${temp}°${isCelsius ? 'C' : 'F'}</p>`;
        const weatherHtml = `<p>${cityName}</p>
        <p>${description}</p>`;

        weatherInfo.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        tempDivInfo.innerHTML = tempratureHtml;
        showImage();
    }
}

function showHourlyForecast(data) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = '';
    const next24Hours = data.list.slice(0, 8);
    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const tempCelsius = Math.round(item.main.temp - 273.15);
        const temp = isCelsius ? tempCelsius : convertToFahrenheit(tempCelsius);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyHtml = `
        <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span>${temp}°C</span>
        </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyHtml;

    });
}



function convertToFahrenheit(celsius) {
    return Math.round((celsius * 9 / 5) + 32);
}
function toggleTemperatureUnit() {
    isCelsius = !isCelsius;
    const toggleButton = document.getElementById('toggle-unit');
    toggleButton.innerText = isCelsius ? '°F' : '°C';
    getWeather();
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}