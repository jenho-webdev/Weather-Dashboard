const form = document.querySelector("#search-form");
const input = document.querySelector("#city-state-contry-input");
const resultsDiv = document.querySelector("#weather-results");
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
   
   // const weatherAPIurl = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${excludePart}&appid={API key}&units=imperial`);
    const weatherAPIurl = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`);
   const weatherData = await weatherAPIurl.json();
   
   if (weatherData.cod = 200) 
   {
     // Grab all days weather in list
     let day0 = weatherData.list[0]; //current weather
     let day1 = weatherData.list[5]; //Day 1
     let day2 = weatherData.list[13]; //Day 2
     let day3 = weatherData.list[21]; //Day 3
     let day4 = weatherData.list[29]; //Day 4
     let day5 = weatherData.list[37]; //Day 5
     var weeklyWeathers = { day1, day2, day3, day4, day5 };

     //list item [0] in the respond for current weather
     let today = dayjs(day0.dt_txt).format("MM/DD/YYYY");
     let currentTemp = day0.main.temp;
     let currentWind = day0.wind.speed;
     let currentHumidity = day0.main.humidity;
     let currentIconCode = day0.weather.icon;

     let iconUrl = "http://openweathermap.org/img/wn/" + currentIconCode + ".png";
     let cwcHeader = resultsDiv.getElementById("city_date");
     let headerText = "${city} (${today})";

     // Reset resultsDiv element
     cwcHeader.innerHTML = "${city} ${weatherData.";
     // Create an image element for the weather icon
     const icon = document.createElement("img");
     icon.src = iconUrl;
     
   } 
   else 
   {
      resultsDiv.innerHTML = "Error retrieving weather data.";
   }
});

