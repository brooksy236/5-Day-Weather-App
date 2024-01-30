dayjs.extend(window.dayjs_plugin_advancedFormat)
let today = dayjs().format("(dddd Do MM YYYY)");
    
const weatherToday = document.querySelector(".weatherToday");
const userSearch = document.querySelector(".weatherSearch");
const card = document.querySelector(".card");
const myKey = "fb390030446cd7ca58f93b55b46a5609";

weatherToday.addEventListener("submit", async event => {
    event.preventDefault();
    const city = userSearch.value;

    if(city){
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            const forecastData = await getForecastData();
            displayForecastInfo(forecastData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city");
    }
})

async function getWeatherData(city) {
    const queryWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`;
    const response = await fetch(queryWeather);
    if(!response.ok){
        throw new Error("Couldn't fetch weather data")
    }
    return await response.json()
    
}

async function getForecastData() {

    let lat = $(data.coord.lat)
    let lon = $(data.coord.lon)
    const queryForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=` + myKey;
    const response2 = await fetch(queryForecast);
    console.log(data)
    return await response2.json();
}




// async function latLon() {
//     const queryWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`;
//     const response = await fetch(queryWeather);
//     return await response.json();
// }


//     latLon();
//         .then(function (response) {
//         return response.json()
// })
// .then(function (data) {
//     console.log(data)     
    
// })
// }

function displayWeatherInfo(data){
    const  {name: city, 
            main: {temp, humidity}, 
            weather: [{description, id}]} = data;

    card.textContent = "";
    card.classList.add("flex");
    
    $('#today').html("<h1>" + data.name + ": " + today + "</h1>")
    $('#today').append("<h3>Temp: " + (data.main.temp -= 273.15).toFixed(2) + "°C</h3>")
    $('#today').append("<h3>Wind Speed: " + (data.wind.speed).toFixed(2) + "KPH</h3>")
    $('#today').append("<h3>Humidity: " + (data.main.humidity) + "%</p>")
    $('#today').append("<h4>" + (data.weather[0].description) + "</h4>")
    let iconLink = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    $('#today').append(`<img src="${iconLink}" />`)

}

function displayForecastInfo(){
    $('#forecast').append("<h3>Temp: " + (data.list.main.temp -= 273.15).toFixed(2) + "°C</h3>")

}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.classList.add("flex");
    card.appendChild(errorDisplay);
}

