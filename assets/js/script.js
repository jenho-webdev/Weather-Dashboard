const form = document.querySelector("#search-form");
const input = document.querySelector("#city-state-contry-input");
const resultsDiv = document.querySelector("#weather-results-list");
//OpenWeatherMap API key
const API_KEY = "4ddc74c28b222b79bd2f398b302daadb"; 
const excludePart = "minutely,hourly,alerts";

form.addEventListener('submit', async (e) =>
{
   e.preventDefault();
   const userInput = input.value;
   const city = userInput.split(",")[0];
   const state = userInput.split(",")[1];
   const country = userInput.split(",")[2];
   const geoAPIurl = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${API_KEY}`);
   console.log("goeAPIurl");
   const geoData = await geoAPIurl.json(); 
   const lat = geoData[0].lat;
   const lon = geoData[0].lon;
   const stateName = geoData[0].state;
   
   const weatherAPIurl = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${excludePart}&appid={API key}&units=imperial`);
   const weatherData = await weatherAPIurl.json();
   
   if (weatherData.cod = 200) 
   {  
      let currentTemp = weatherData.current.temp;
      let currentWind = weatherData.current.wind_speed;
      let currentHumidity = weatherData.current.humidity;
      let iconCode =  weatherData.current.weather.icon;
      var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

      // Display weather data in the resultsDiv element
      resultsDiv.innerHTML = " ";

      //<h3>${weatherData.city.name} 5-day weather forecast</h3>
   } 
   else 
   {
      resultsDiv.innerHTML = "Error retrieving weather data.";
   }
});

