const form = document.querySelector("#search-form");
const input = document.querySelector("#city-state-contry-inpu");
const resultsDiv = document.querySelector("#weather-results");
//OpenWeatherMap API key
const API_KEY = "4ddc74c28b222b79bd2f398b302daadb"; 


 form.addEventListener('submit', async (e) => 
 {
    e.preventDefault();
    const userInput = input.value;
    const city = userInput.split(",")[0];
    const state = userInput.split(",")[1];
    const country = userInput.split("")[2];
    const geoAPIurl = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${API_KEY}`) 
    const lat = geoAPIurl.get("lat");
    const lon = geoAPIurl.get("lon");
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

    if(response.ok)
    {
        


    }



 };
