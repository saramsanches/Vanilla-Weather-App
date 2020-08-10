function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day}, ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp);

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];

  return `${day}`;
}

function showTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = Math.round(response.data.main.humidity);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function showForecastTemperature(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = response.data;
  let forecastPosition = 7;
  console.log(response.data);

  for (let step = 0; step < 5; step++) {
    forecastElement.innerHTML =
      forecastElement.innerHTML +
      `
   <div class="col-2">
                <h3>
                  ${formatDay(forecast.list[forecastPosition].dt * 1000)}
                </h3>
                <img src="http://openweathermap.org/img/wn/${
                  forecast.list[forecastPosition].weather[0].icon
                }@2x.png"/>
                <div class="forecast-min-max"><strong>${Math.round(
                  forecast.list[forecastPosition].main.temp_max
                )}º</strong> | ${Math.round(
        forecast.list[forecastPosition].main.temp_min
      )}º</div>
              </div>
  `;
    forecastPosition = forecastPosition + 8;
  }
}

function search(city) {
  let apiKey = "540573f8fa49b4473d94a3c057290a63";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecastTemperature);
}

function handleSubmit(event) {
  event.preventDefault();

  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);

  let cityOut = document.querySelector(".city");
  if (cityInputElement.value) {
    cityOut.innerHTML = `${cityInputElement.value}`;
  } else {
    alert("Please type a city...");
  }
}

function searchLocation(position) {
  let apiKey = "540573f8fa49b4473d94a3c057290a63";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecastTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function showFahrenheitTemperature(event) {
  event.preventDefault();

  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");

  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelsiusTemperature(event) {
  event.preventDefault();

  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemperature);

let positionButton = document.querySelector("#current-location");
positionButton.addEventListener("click", getCurrentLocation);

search("Lisbon");
