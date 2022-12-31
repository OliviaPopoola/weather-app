let iconElement = document.querySelector("#icon");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");
let descriptionElement = document.querySelector("#weather-description");
let temperatureElement = document.querySelector("#current-degrees");
let cityNameElement = document.querySelector("#current-location");

// * things to fix:
// on reload - fix font
// display weekly temp (perm)
// when searched display temp
// if enter is empty - alert (please enter a city)

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
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
  return days[day];
}
// displays 5 day forecaste data from API
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  // loop through API - creates 5 day forcast & displays: said data
  forecast.forEach(function (forecastDay, index) {
    if (index < 6 && index > 0) {
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

// fetch data from API
function fetchCityData(cityName) {
  let units = "metric";
  let apiKey = "64f17b5a3404993ab8co5054f3c7bt29";
  let apiEndpoint = "https://api.shecodes.io/weather/v1/current?query=";
  let apiUrl = `${apiEndpoint}${cityName}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayTemp);
}

// when search is clicked:displays the current temperature of the city.
function handleSubmit(event) {
  event.preventDefault();
  let inputValue = document.querySelector("#search-input").value;
  if (inputValue === "") {
    alert("😥 Please enter a city name");
  } else {
    inputValue = inputValue.trim();
    inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
    cityNameElement.innerHTML = `${inputValue}`;
    fetchCityData(inputValue);
  }
}

// fetch 5day forecast from API
function getForecast(coordinates) {
  let apiKey = "64f17b5a3404993ab8co5054f3c7bt29";
  let apiEndPoint = `https://api.shecodes.io/weather/v1/forecast?`;
  let apiUrl = `${apiEndPoint}lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
// temp displayed from fetched API data - updates HTML
function displayTemp(response) {
  // update: city name
  cityNameElement.innerHTML = response.data.city;
  // update: temp
  let roundedTemp = Math.round(response.data.temperature.current);
  temperatureElement.innerHTML = `${roundedTemp}`;
  // update: description
  let weatherDescription = response.data.condition.description;
  descriptionElement.innerHTML = `${weatherDescription}`;
  // update: wind
  windElement.innerHTML = Math.round(response.data.wind.speed);
  // update: humidity
  let roundedHumidity = Math.round(response.data.temperature.humidity);
  humidityElement.innerHTML = `${roundedHumidity}`;
  // update: icons
  iconElement.setAttribute("src", `${response.data.condition.icon_url}`);
  iconElement.setAttribute("alt", `${response.data.condition.description}`);
  // update: celsius
  celsiusTemp = response.data.temperature.current;
  // get 5 day weather - city
  getForecast(response.data.coordinates);
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(showTemp);
}

// uses coordinates and display location using API.
function showTemp(position) {
  let units = "metric";
  let apiKey = "64f17b5a3404993ab8co5054f3c7bt29";
  let apiEndpoint = "https://api.shecodes.io/weather/v1/current?query=";
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let geoApi = `${apiEndpoint}&lat=${lat}&lon=${lon}&key=${apiKey}&units=${units}`;
  axios.get(geoApi).then(displayCurrent);
  // .catch((error) => console.log("error", error));
}

// when clicked on current location button
function displayCurrent(response) {
  displayTemp(response);
}

// ---------- start of C to F conversion ----------
function fahrenheitConverter(event) {
  event.preventDefault();
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  temperatureElement.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
}

function celsiusConverter(event) {
  event.preventDefault();
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;
let celsius = document.querySelector("#celsius-link");
celsius.addEventListener("click", celsiusConverter);
let fahrenheit = document.querySelector("#fahrenheit-link");
fahrenheit.addEventListener("click", fahrenheitConverter);

// ---------- end of C to F conversion ----------

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", getPosition);

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

fetchCityData("Lagos");
