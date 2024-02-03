dayjs.extend(window.dayjs_plugin_advancedFormat)
let today = dayjs().format("(dddd Do MM YYYY)");
    
const weatherToday = document.querySelector(".weatherToday");
const userSearch = document.querySelector(".weatherSearch");
const card = document.querySelector(".card");
const myKey = "fb390030446cd7ca58f93b55b46a5609";
let  previousSearch = JSON.parse(localStorage.getItem("weather")) || []
weatherToday.addEventListener("submit", async event => {
    event.preventDefault();
    const city = userSearch.value;

    if(city){
        try {
            const weatherData = await getWeatherData(city);
            previousSearch.push(city)
            localStorage.setItem("weather",JSON.stringify(previousSearch))
            searchButtons();
            //await console.log(weatherData)
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city");
    }
})

function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`)
    .then(response1 => response1.json())
    .then(data => {
        const {lat, lon } = data.coord;
        console.log(data)
      displayWeatherInfo(data);
        const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myKey}`
        return fetch(url2);
    })
    .then(response2 => response2.json())
    .then(data2 => {
        console.log(data2);
        displayForecast(data2.list)
        return data2
    })
    .catch(error => {
        console.error("Eror fetching data:", error);
    });
}


$("#history").on("click",".searchbtn",function(){
    console.log($(this).text())
    getWeatherData($(this).text())
})
/*
const lat = none
const lon = none


async function getWeatherData(city) {
    const queryWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`;
    const response = await fetch(queryWeather);
    if(!response.ok){
        throw new Error("Couldn't fetch weather data")
    }
    return await response.json()
}

async function getForecastData(city) {
    let data = await getWeatherData(city)
    console.log(data)
    lon = $(data.coord.lon)
    lat = $(data.coord.lat)
    const queryForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=` + myKey;
    const response2 = await fetch(queryForecast);
    console.log(data)
    return await response2.json();
}

getForecastData()
*/

searchButtons();
function searchButtons() {
    let  previousSearch = JSON.parse(localStorage.getItem("weather")) || []
    $("#history").empty()
    for (let i=0; i<previousSearch.length; i++) {
        $("#history").append(`<button class="searchbtn">${previousSearch[i]}</button>`)
    }
}

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

function displayForecast(listData){
    var cardLayout = ""
    for (let i=0; i<listData.length;i=i+8) {
        cardLayout += `
        <div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">Temp:${(listData[i].main.temp -= 273.15).toFixed(2)}</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary">Humidity: ${(listData[i].main.humidity)}</h6>
    <p class="card-text">${listData[i].dt_txt}</p>
    <img src="https://openweathermap.org/img/wn/${listData[i].weather[0].icon}@2x.png" > </img>
    <p class="card-text">${listData[i].wind.speed}</p>
  </div>
</div>
        `
    }
    $("#forecast").empty()
    $('#forecast').append(cardLayout)

}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.classList.add("flex");
    card.appendChild(errorDisplay);
}

