function formatDate(timestamp) {
  let now = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let hours = now.getHours();
  let mins = now.getMinutes();

  if (hours < 10) {
    hours = "0".concat(`${hours}`);
  }
  if (mins < 10) {
    mins = "0".concat(`${mins}`);
  }
  return `${day}, ${hours}:${mins}`;
}
function formatForecastDay(timestamp) {
  let now = new Date(timestamp);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[now.getDay()];
}

function displayForecast(response) {
  let weekForecast = response.data.daily;
  let forecasteElement = document.querySelector("#forecast-week");
  let forecastHTML = `<div class="row">`;
  forecastMax = [];
  forecastMin = [];
  weekForecast.forEach(function (forecastDay, index) {
    if (0 < index && index < 7) {
      forecastMax[index - 1] = forecastDay.temp.max;
      forecastMin[index - 1] = forecastDay.temp.min;
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
        <div class="forecast-day">${formatForecastDay(
          forecastDay.dt * 1000
        )}</div>
        <div class="forecast-icon"><img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" alt="weather_icon" width="60" />
        </div>
        <div class="forecast-temp">
          <span class="forecast-temp-max">${Math.round(
            forecastDay.temp.max
          )}</span>° 
          <span class="forecast-temp-min">${Math.round(
            forecastDay.temp.min
          )}</span>°
        </div>
      </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecasteElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${tempUnit}`;
  axios.get(apiUrl).then(displayForecast);
}

function formatSunTime(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getHours();
  let mins = now.getMinutes();
  if (hours < 10) {
    hours = "0".concat(`${hours}`);
  }
  if (mins < 10) {
    mins = "0".concat(`${mins}`);
  }
  return `${hours}:${mins}`;
}

function showWeather(response) {
  document.querySelector(
    "#city-name"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  celsiusTemp = response.data.main.temp;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  feelsLike = response.data.main.feels_like;
  document.querySelector("#temp-max").innerHTML = Math.round(
    response.data.main.temp_max
  );
  maxTemp = response.data.main.temp_max;
  document.querySelector("#temp-min").innerHTML = Math.round(
    response.data.main.temp_min
  );
  minTemp = response.data.main.temp_min;
  document.querySelector("#date").innerHTML = formatDate(
    response.data.dt * 1000 + timeOffSet * 60000 + response.data.timezone * 1000
  );
  document.querySelector("#lastUpdatedDate").innerHTML = formatDate(
    response.data.dt * 1000
  );
  document
    .querySelector("#temp-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#temp-icon")
    .setAttribute("alt", response.data.weather[0].description);
  document.querySelector("#sunrise").innerHTML = formatSunTime(
    response.data.sys.sunrise * 1000 +
      timeOffSet * 60000 +
      response.data.timezone * 1000
  );
  document.querySelector("#sunset").innerHTML = formatSunTime(
    response.data.sys.sunset * 1000 +
      timeOffSet * 60000 +
      response.data.timezone * 1000
  );

  getForecast(response.data.coord);
}

function searchWeather(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${tempUnit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function searchCity(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#search-city");
  if (searchCity.value !== null) {
    searchWeather(searchCity.value);
  } else {
    alert("Enter a city or zipcode.");
  }
}

function convertTempC(event) {
  event.preventDefault();
  linkF.classList.remove("active");
  linkC.classList.add("active");
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = Math.round(celsiusTemp);
  document.querySelector("#feels-like").innerHTML = Math.round(feelsLike);
  document.querySelector("#temp-max").innerHTML = Math.round(maxTemp);
  document.querySelector("#temp-min").innerHTML = Math.round(minTemp);
  let forecastMaxTemp = document.querySelectorAll(".forecast-temp-max");
  forecastMaxTemp.forEach(function (maxTemp, index) {
    maxTemp.innerHTML = Math.round(forecastMax[index]);
  });
  let forecastMinTemp = document.querySelectorAll(".forecast-temp-min");
  forecastMinTemp.forEach(function (minTemp, index) {
    minTemp.innerHTML = Math.round(forecastMin[index]);
  });
}

function convertTempF(event) {
  event.preventDefault();
  linkC.classList.remove("active");
  linkF.classList.add("active");
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
  document.querySelector("#feels-like").innerHTML = Math.round(
    (feelsLike * 9) / 5 + 32
  );
  document.querySelector("#temp-max").innerHTML = Math.round(
    (maxTemp * 9) / 5 + 32
  );
  document.querySelector("#temp-min").innerHTML = Math.round(
    (minTemp * 9) / 5 + 32
  );
  let forecastMaxTemp = document.querySelectorAll(".forecast-temp-max");
  forecastMaxTemp.forEach(function (maxTemp, index) {
    maxTemp.innerHTML = Math.round((forecastMax[index] * 9) / 5 + 32);
  });
  let forecastMinTemp = document.querySelectorAll(".forecast-temp-min");
  forecastMinTemp.forEach(function (minTemp, index) {
    minTemp.innerHTML = Math.round((forecastMin[index] * 9) / 5 + 32);
  });
}

function showMyLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=${tempUnit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function getMyLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showMyLocation);
}

let formSearch = document.querySelector("#search-form");
formSearch.addEventListener("submit", searchCity);

let linkC = document.querySelector("#celsius-link");
linkC.addEventListener("click", convertTempC);

let linkF = document.querySelector("#fahrenhite-link");
linkF.addEventListener("click", convertTempF);

let myLocationButton = document.querySelector("#my-location");
myLocationButton.addEventListener("click", getMyLocation);

let tempUnit = "metric";
let apiKey = "40b745c14eadad7b7c4e6e4bf3b70103";
let celsiusTemp = null;
let feelsLike = null;
let maxTemp = null;
let minTemp = null;
let forecastMax = [];
let forecastMin = [];
let localDate = new Date();
let timeOffSet = localDate.getTimezoneOffset();
searchWeather("Bengaluru");
