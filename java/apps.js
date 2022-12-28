// display the current date and time
function formatDate(date) {
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
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let nowdate = date.getDate();
  let year = date.getFullYear();
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let mins = date.getMinutes();
  if (mins < 10) {
    mins = `0${mins}`;
  }
  return `${day} ${nowdate}  ${month},  ${year}     ${hour}:${mins}`;
}
let currentTime = document.querySelector("#current-date");
let now = new Date();
currentTime.innerHTML = formatDate(now);

function forecastDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDate();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML += `
  <div class="col day-container">
    <div class="p-3">
    <div class="forecast-date">${forecastDate(forecastDay.time)}</div>
    <br /> 
    <img
      src="${forecastDay.condition.icon_url}"
      alt="${forecastDay.condition.icon}"
      width="150px"
      /><br />
    <strong class="forecast-high">${Math.round(
      forecastDay.temperature.maximum
    )}°</strong> / <span class="forecast-low">${Math.round(
        forecastDay.temperature.minimum
      )}°</span>
    </div>
  
  `;

      forecastHTML = forecastHTML + `</div>`;
      forecastElement.innerHTML = forecastHTML;
    }
  });
}
// when search is clicked:displays the current temperature of the city.
let units = "metric";
let apiKey = "64f17b5a3404993ab8co5054f3c7bt29";
let apiEndpoint = "https://api.shecodes.io/weather/v1/current?query=";
let form = document.querySelector("#search-form");

function search(event) {
  event.preventDefault();
  let cityName = document.querySelector("#search-input").value;
  let currentLocation = document.querySelector("#current-location");
  cityName = cityName.trim();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  currentLocation.innerHTML = `${cityName}`;
  let apiUrl = `${apiEndpoint}${cityName}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayTemp);
  // .catch((error) => console.log("error", error)
  // );
}

// select and display temp based on user input
function getForecast(coordinates) {
  let apiKey = "64f17b5a3404993ab8co5054f3c7bt29";
  let apiEndPoint = `https://api.shecodes.io/weather/v1/forecast?`;
  let apiUrl = `${apiEndPoint}lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
function displayTemp(response) {
  let temperatureElement = document.querySelector("#current-degrees");
  let roundedTemp = Math.round(response.data.temperature.current);
  temperatureElement.innerHTML = `${roundedTemp}`;
  let description = document.querySelector("#weather-description");
  let weatherDescription = response.data.condition.description;
  description.innerHTML = `${weatherDescription}`;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let humidityElement = document.querySelector("#humidity");
  let roundedHumidity = Math.round(response.data.temperature.humidity);
  humidityElement.innerHTML = `${roundedHumidity}`;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `${response.data.condition.icon_url}`);
  iconElement.setAttribute("alt", `${response.data.condition.description}`);
  celsiusTemp = response.data.temperature.current;
  getForecast(response.data.coordinates);
}

form.addEventListener("submit", search);

// uses coordinates and display location using API.
function showTemp(position) {
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let geoApi = `${apiEndpoint}&lat=${lat}&lon=${lon}&key=${apiKey}&units=${units}`;
  axios.get(geoApi).then(displayCurrent);
  // .catch((error) => console.log("error", error));
}

// ---------- start of C to F conversion ----------
function fahrenheitConverter(event) {
  event.preventDefault();
  let currentDegrees = document.querySelector("#current-degrees");
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  currentDegrees.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
}

function celsiusConverter(event) {
  event.preventDefault();
  let currentDegrees = document.querySelector("#current-degrees");
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
  currentDegrees.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;
let celsius = document.querySelector("#celsius-link");
celsius.addEventListener("click", celsiusConverter);
let fahrenheit = document.querySelector("#fahrenheit-link");
fahrenheit.addEventListener("click", fahrenheitConverter);

// ---------- end of C to F conversion ----------

// when clicked on current location button
function displayCurrent(response) {
  let temp = Math.round(response.data.temperature.current);
  let city = response.data.city;
  let currentLocation = document.querySelector("#current-location");
  currentLocation.innerHTML = `${city}`;
  let currentLocTemperature = document.querySelector("#current-degrees");
  currentLocTemperature.innerHTML = `${temp}`;
  let description = document.querySelector("#weather-description");
  let currentDescription = response.data.condition.description;
  description.innerHTML = `${currentDescription}`;
  //
  // let currentWindElement = document.querySelector("#wind");
  // currentWindElement.innerHTML = Math.round(response.wind.speed);
  // let currentHumidityElement = document.querySelector("#humidity");
  // let roundedHumidity = Math.round(response.data.temperature.humidity);
  // currentHumidityElement.innerHTML = `${roundedHumidity}`;
  // let currentIconElement = document.querySelector("#icon");
  // currentIconElement.setAttribute("src", `${response.data.condition.icon_url}`);
  // currentIconElement.setAttribute(
  //   "alt",
  //   `${response.data.condition.description}`
  // );
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(showTemp);
}
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", getPosition);
