//Since only  3hrs weather days for the next 5days and maximum of 40 counts API with the "current weather" APIs are available to the free account, this app was built around the challenges that only 3hrs time blocks of weather forecast response is available at time of this app's development.
// The 3hr/5day API response isn't as straightforward as the response from calling the "Daily API" because, but "Daily API" isn't available
//to the free non-subscription based plan/account. The response from 3hrs blocks also forecast same day weather(3hrs forward forecast at time of the API was called).
//  Working around the 3hrs block weather respond to give only the next 5days forecast, we needed filter
// the data set to remove any same day weather forecast before output it out to UI.

//DOM
const form = document.querySelector("#search-form");
const input = document.querySelector("#city-state-contry-input");
const resultsDiv = document.querySelector("#weather-results");
const searchHistory = document.getElementById("search-history");
const submitBtn = document.querySelector("#submitBtn");
//OpenWeatherMap API key
const API_KEY = "4ddc74c28b222b79bd2f398b302daadb";
const excludePart = "minutely,hourly,alerts";
const errorMessageEl = document.querySelector("#searchError");
// Get the existing searches from local storage, or initialize it to an empty array if it doesn't exist
let searches = JSON.parse(localStorage.getItem("searches")) || [];

// Call the rebuildSidebar function when the page is loaded
window.addEventListener("load", () => {
  rebuildHistory();
});

function removeAlert() {
  // Schedule a function to hide the message after 5 seconds
  setTimeout(() => {
    errorMessageEl.classList.add("d-none"); // Remove the 'show' class to hide the message
  }, 5000);
}

//submit button event listener
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Disable the submit button
  submitBtn.classList.add("disabled");

  const userInput = input.value;
  const cityInput = userInput.split(",")[0];
  const stateInput = userInput.split(",")[1];
  const countryInput = userInput.split(",")[2];

  // Check if the city already exists in the stored data
  const existingCity = searches.find(({ city }) => city === cityInput);

  // If the city does not exist, add a new button
  if (!existingCity) {
    // Create an object to store the city and state together
    const search = {
      city: cityInput,
      state: stateInput,
      country: countryInput,
    };

    // Add the new search to the array of searches
    searches.push(search);
    // Save the updated array of searches back to local storage
    localStorage.setItem("searches", JSON.stringify(searches));
  }

  fetchWeatherData(cityInput, stateInput, countryInput);
  rebuildHistory();
  // Re-enable the submit button after the data is fetched and displayed
  submitBtn.classList.remove("disabled");
});

async function fetchWeatherData(city, state, country) {
  const geoAPIurl = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${API_KEY}`
  );

  const geoData = await geoAPIurl.json();
  if (geoData.length === 0) {
    const errorMessage = `Not found. To make search more precise put the city's name, comma, 2-letter country code (ISO3166). `;
    errorMessageEl.textContent = errorMessage;
    errorMessageEl.classList.add("show");
    //Fade oput the alert msg after 5 sec.
    removeAlert();
    throw new Error(errorMessage);
  }

  const lat = geoData[0].lat;
  const lon = geoData[0].lon;
  const stateName = geoData[0].state;

  const weatherForecastAPIurl = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  );
  const weatherForecastData = await weatherForecastAPIurl.json();

  const currentWeatherUrl = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  );
  const currentWeatherData = await currentWeatherUrl.json();

  if ((weatherForecastData.cod = 200) && (currentWeatherData.cod = 200)) {
    //Call the function to display the weather data
    displayWeatherData(weatherForecastData, currentWeatherData);
  } else {
    const fatchErrorMsg = `Error retrieving weather data.`;
    errorMessageEl.textContent = fatchErrorMsg;
    errorMessageEl.classList.add("show");
    fadeOutAlert();
    throw new Error(fatchErrorMsg);
  }
}
// Grab 5 days/3hours weather in list

function findNext5Days(weatherForecastData) {
  const today = new Date();
  const next5Days = weatherForecastData.list.filter((item) => {
    const date = new Date(item.dt_txt);
    return date > today;
  });

  return next5Days;
}

function displayWeatherData(weatherForecastData, currentWeatherData) {
  //current weather
  const today = dayjs().format("dddd, MMMM D, YYYY");
  const currentTemp = currentWeatherData.main.temp;
  const currentWind = currentWeatherData.wind.speed;
  const currentHumidity = currentWeatherData.main.humidity;
  const currentIconCode = currentWeatherData.weather[0].icon;
  const TWiconUrl =
    "https://openweathermap.org/img/wn/" + currentIconCode + ".png";

  // Create an image element for the weather icon
  const weatherIcon = document.getElementById("currentWeatherIcon");
  weatherIcon.setAttribute("src", TWiconUrl);

  //Capitalize first letter of city and state name and output it along with the date
  //then with the weather icon at the end of the row in the card's header
  const cwcHeader = document.getElementById("city-date");
  const cityName = currentWeatherData.name;

  cwcHeader.textContent = `${cityName} (${today})`;
  //Output current weather in the card's body in rows.
  //Current Temp
  const tempElement = document.getElementById("temp");
  tempElement.textContent = `Temperature: ${currentTemp} °F`;
  //Current Wind
  const windElement = document.getElementById("wind");
  windElement.textContent = `Wind: ${currentWind} mph`;
  //Current Humidity
  const humidityElement = document.getElementById("humidity");
  humidityElement.textContent = `Humidity: ${currentHumidity}%`;

  // display filtered weather forecast data (3hrs blocks)
  const filteredDaysList = findNext5Days(weatherForecastData);
  // Get the card deck container
  const cardDeck = document.querySelector(".card-deck");

  cardDeck.innerHTML = "";
  // Loop through the 5-day weather info
  for (let i = 3; i <= filteredDaysList.length; i++) {
    // Get the weather data for this day
    const weatherData = filteredDaysList[i];

    // Create a new Bootstrap card for this day
    const card = document.createElement("div");
    card.className = "card";

    // Create a card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Add the date to the card header
    const date = dayjs(weatherData.dt_txt).format("MM/DD/YYYY HH:mmA");
    const cardHeader = document.createElement("h5");
    cardHeader.className = "card-title";
    cardHeader.textContent = date;
    cardBody.appendChild(cardHeader);

    // Add the temperature to the card
    const temp = weatherData.main.temp;
    const tempText = document.createElement("p");
    const iconCode = weatherData.weather[0].icon;
    const iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    tempText.className = "card-text";
    tempText.innerHTML = `${temp}&deg;F <img src="${iconUrl}" alt="Weather Icon">`;
    cardBody.appendChild(tempText);

    // Add the wind speed to the card
    const wind = weatherData.wind.speed;
    const windText = document.createElement("p");
    windText.className = "card-text";
    windText.textContent = `Wind Speed: ${wind} MPH`;
    cardBody.appendChild(windText);

    // Add the humidity to the card
    const humidity = weatherData.main.humidity;
    const humidityText = document.createElement("p");
    humidityText.className = "card-text";
    humidityText.textContent = `Humidity: ${humidity}%`;
    cardBody.appendChild(humidityText);

    // Add the card body to the card
    card.appendChild(cardBody);

    // Add the card to the card deck
    cardDeck.appendChild(card);
  }
}

function rebuildHistory() {
  // Get the search history ul element

  searchHistory.innerHTML = "";
  // Iterate over the saved locations and create a button for each one
  searches.forEach((location) => {
    // Create a new city button element
    const cityButton = document.createElement("a");
    cityButton.classList.add("nav-link", "text-white", "city-button");
    cityButton.textContent = location.city;

    cityButton.addEventListener("click", () => {
      fetchWeatherData(location.city, location.state, location.country);
    });

    // Create a new li element and add the city button to it
    const newCityLi = document.createElement("li");
    newCityLi.classList.add("nav-item,sidebar-links");
    newCityLi.appendChild(cityButton);

    // Add the button to the sidebar
    document.getElementById("search-history").appendChild(newCityLi);
  });
}
