// ⏰Feature #1
// In your project, display the current date and time using JavaScript: Tuesday 16:00
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
  return `${day}, ${nowdate}  ${month},  ${year}     ${hour}:${mins}`;
}
let currentTime = document.querySelector("#current-date");
let now = new Date();
currentTime.innerHTML = formatDate(now);

// 🕵️‍♀️Feature #2
// Add a search engine, when searching for a city (i.e. Paris), display the city name on the page after the user submits the form.
// function search(event) {
//   event.preventDefault();
//   let searchInput = document.querySelector("#search-input");
//   let currentLocation = document.querySelector("#current-location");
//   searchInput = searchInput.value.trim();
//   searchInput = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);
//   currentLocation.innerHTML = `${searchInput}`;
// }

// let form = document.querySelector("#search-form");
// form.addEventListener("submit", search);

// ---------- start of C to F conversion ----------
// 🙀Bonus Feature
// Display a fake temperature (i.e 17) in Celsius and add a link to convert it to Fahrenheit. When clicking on it, it should convert the temperature to Fahrenheit. When clicking on Celsius, it should convert it back to Celsius.

// function celsiusConverter() {
//   let currentDegrees = document.querySelector("#current-degrees");
//   currentDegrees.innerHTML = 20;
// }
// function fahrenheitConverter() {
//   let currentDegrees = document.querySelector("#current-degrees");
//   let temperature = currentDegrees.innerHTML;
//   currentDegrees.innerHTML = Math.round((temperature * 9) / 5 + 32);
// }
// let celsius = document.querySelector("#celsius-link");
// celsius.addEventListener("click", celsiusConverter);
// let fahrenheit = document.querySelector("#fahrenheit-link");
// fahrenheit.addEventListener("click", fahrenheitConverter);
// ---------- end of C to F conversion ----------

// 👨‍🏫 Your task
// In your project, when a user searches for a city (example: New York), it should display the name of the city on the result page and the current temperature of the city.

// search is clicked
// api called when search clicked
// inner html changed to display search
let units = "metric";
let apiKey = "ce144f0cf51fa43f03431f0488a36728";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?q=";
let form = document.querySelector("#search-form");

function search(event) {
  event.preventDefault();
  let cityName = document.querySelector("#search-input").value;
  let currentLocation = document.querySelector("#current-location");
  cityName = cityName.trim();
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  currentLocation.innerHTML = `${cityName}`;
  let apiUrl = `${apiEndpoint}${cityName}&appid=${apiKey}&units=${units}`;
  axios
    .get(apiUrl)
    .then(displayTemp)
    .catch((error) => console.log("error", error));
}

function displayTemp(response) {
  // get curr temp
  let temperatureElement = document.querySelector("#current-degrees");
  // get response and round
  let roundedTemp = Math.round(response.data.main.temp);
  // set rounded temp as curr temp
  temperatureElement.innerHTML = `${roundedTemp}`;
  // get description
  let description = document.querySelector("#weather-description");
  // set description from response
  let weatherDescription = response.data.weather[0].description;
  // update description html
  description.innerHTML = `${weatherDescription}`;
  // wind data
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  // select rain element
  let rainElement = document.querySelector("#rain");
  // check if exisits
  if (response.data.rain) {
    rainElement.innerHTML = `${Math.round(response.data.rain["1h"])}%`;
  } else {
    rainElement.innerHTML = "-";
  }
  // if so then update rain ele with value
  // if not show -
}

form.addEventListener("submit", search);

// 🙀 Bonus point:
// Add a Current Location button. When clicking on it, it uses the Geolocation API to get your GPS coordinates and display and the city and current temperature using the OpenWeather API.

function showTemp(position) {
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let geoApi = `${apiEndpoint}&lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios
    .get(geoApi)
    .then(displayCurrent)
    .catch((error) => console.log("error", error));
}
function displayCurrent(response) {
  let temp = Math.round(response.data.main.temp);
  let city = response.data.name;
  let currentLocation = document.querySelector("#current-location");
  currentLocation.innerHTML = `${city}`;
  let currentLocTemperature = document.querySelector("#current-degrees");
  currentLocTemperature.innerHTML = `${temp}`;
}
function getPosition() {
  navigator.geolocation.getCurrentPosition(showTemp);
}
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", getPosition);
