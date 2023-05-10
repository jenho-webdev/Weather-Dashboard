const form = document.querySelector("#search-form");
const input = document.querySelector("#city-state-contry-input");
const resultsDiv = document.querySelector("#weather-results");
//OpenWeatherMap API key
const API_KEY = "4ddc74c28b222b79bd2f398b302daadb";
const excludePart = "minutely,hourly,alerts";

// Get the existing searches from local storage, or initialize it to an empty array if it doesn't exist
  let searches = JSON.parse(localStorage.getItem("searches")) || [];



function rebuildHistory () {
  
   
  // Iterate over the saved locations and create a button for each one
  searches.forEach((location) => {
    let button = document.createElement("button");
    button.innerText = `${location.city}, ${location.state}`;
    button.setAttribute("class", "btn btn-gray");
    button.addEventListener("click", () => 
      {
         
      });
    // Add the button to the sidebar
    document.getElementById("sidebar").appendChild(button);
  });
};

 


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userInput = input.value;
  const city = userInput.split(",")[0];
  const state = userInput.split(",")[1];
  const country = userInput.split(",")[2];
  
  
  // Create an object to store the city and state together
  const search = {
    city: city,
    state: state,
  };
  
 
  // Add the new search to the array of searches
  searches.push(search);
  // Save the updated array of searches back to local storage
  localStorage.setItem("searches", JSON.stringify(searches));
  displayWeatherData(city,state,country);
  rebuildHistory();


});


function displayWeatherData(city, state,country) 
{
   const geoAPIurl = fetch(
     `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${API_KEY}`
   );

   const geoData = geoAPIurl.json();
   const lat = geoData[0].lat;
   const lon = geoData[0].lon;
   const stateName = geoData[0].state;

  const weatherAPIurl = fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  );
  const weatherForecastData = weatherAPIurl.json();

  const currentWeatherUrl = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  );
  const currentWeatherData = currentWeatherUrl.json();

  if ((weatherForecastData.cod = 200) && (currentWeatherData.cod = 200)) {
    //Call the function to display the weather data
    displayWeatherData(
      weatherForecastData,
      currentWeatherData,
      city,
      stateName
    );
  } else {
    resultsDiv.innerHTML = "Error retrieving weather data.";
  }

   // Grab all days weather in list
   const day0 = currentWeatherData; //current weather
   const day1 = weatherForecastData.list[2]; //Day 1
   const day2 = weatherForecastData.list[13]; //Day 2
   const day3 = weatherForecastData.list[21]; //Day 3
   const day4 = weatherForecastData.list[29]; //Day 4
   const day5 = weatherForecastData.list[37]; //Day 5
   var weeklyWeathers = { day1, day2, day3, day4, day5 };

   //list item [0] in the respond for current weather
   const today = dayjs().format("dddd, MMMM D, YYYY");
   const currentTemp = day0.main.temp;
   const currentWind = day0.wind.speed;
   const currentHumidity = day0.main.humidity;
   const currentIconCode = day0.weather[0].icon;
   const TWiconUrl = "https://openweathermap.org/img/wn/" + currentIconCode + ".png";
   
   // Create an image element for the weather icon
   const weatherIcon = document.getElementById("currentWeatherIcon");
   weatherIcon.setAttribute("src", TWiconUrl);

   //Capitalize first letter of city and state name and output it along with the date
   //then with the weather icon at the end of the row in the card's header
   const cwcHeader = document.getElementById("city-date");
   const cityCapitalized = city.charAt(0).toUpperCase() + city.slice(1); // capitalize first character of city")


   
   cwcHeader.textContent = `${cityCapitalized}, ${stateName} (${today})`;
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

   // Get the card deck container
   const cardDeck = document.querySelector(".card-deck");

   // Loop through the 5-day weather info
   for (let i = 1; i <= 5; i++) 
   {
      // Get the weather data for this day
      const weatherData = weeklyWeathers[`day${i}`];

      // Create a new Bootstrap card for this day
      const card = document.createElement("div");
      card.className = "card";

      // Create a card body
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      // Add the date to the card header
      const date = dayjs(weatherData.dt_txt).format("MM/DD/YYYY");
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

