const form = document.querySelector("#search-form");
const input = document.querySelector("#city-input");
const resultsDiv = document.querySelector("#weather-results");
//OpenWeatherMap API key
const API_KEY = "4ddc74c28b222b79bd2f398b302daadb"; 


 form.addEventListener('submit', async (e) => 
 {
    e.preventDefault();
    const cityName = input.value;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`);

    if(response.ok)
    {
        


    }



 };
