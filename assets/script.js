dayjs.extend(window.dayjs_plugin_advancedFormat)
let today = dayjs().format("dddd Do MMMM YYYY");

const weatherToday = document.querySelector(".weatherToday");
const userSearch = document.querySelector(".weatherSearch");
const card = document.querySelector(".card");
const myKey = "fb390030446cd7ca58f93b55b46a5609";
let previousSearch = JSON.parse(localStorage.getItem("weather")) || []

// Adds the search value to the local storage
weatherToday.addEventListener("submit", async event => {
    event.preventDefault();
    clear();
    const city = userSearch.value;
    if (city) {
        try {
            const weatherData = getWeatherData(city);
            if (previousSearch.includes(userSearch)) {
                previousSearch.push();
            }
            previousSearch.push(city)
            localStorage.setItem("weather", JSON.stringify(previousSearch))
            searchButtons();
        }
        catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Error: Please enter a valid location");
    }
})

$("#clear-all").on("click", clear);


// Gets the weather data from the API
function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`)
        .then(response1 => response1.json())
        .then(data => {
            const { lat, lon } = data.coord;
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
            console.error("Error fetching data:", error);
        });
}

// Reloads the data from the previous search buttons
$("#history").on("click", ".searchbtn", function () {
    console.log($(this).text())
    getWeatherData($(this).text())
})

searchButtons();
function searchButtons() {
    let previousSearch = JSON.parse(localStorage.getItem("weather")) || []
    for (let i = 0; i < previousSearch.length; i++) {
        $("#history").append(`<button class="searchbtn btn btn-warning">${previousSearch[i]}</button>`)
    } 
}

function clear() {
    localStorage.clear()
    $("#history").empty();
  }

function displayWeatherInfo(data) {
    card.textContent = "";
    $('#today').html("<h1>" + today + "</h1>")
    $('#today').append("<h3>" + data.name + "</h3>")
    let iconLink = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    $('#today').append(`<img src="${iconLink}" />`)
    // $('#today').append("<h3>" + (data.weather[0].description) + "</h3>")
    $('#today').append("<h4>Temp: " + (data.main.temp -= 273.15).toFixed(2) + "°C</h4>")
    $('#today').append("<h4>Wind Speed: " + (data.wind.speed).toFixed(2) + "KPH</h4>")
    $('#today').append("<h4>Humidity: " + data.main.humidity + "%</h4>")
}

function displayForecast(listData) {
    var cardLayout = ""
    for (let i = 7, j = 1; i < listData.length, j < 6; i = i + 8, j = j + 1) { //'i' is to get the correct day in the list data (every 8th) and 'j' is to loop through the day from today using dayjs as the starting point to get the next 5 days to show in the cards
        const forecastDay = dayjs().add(j, 'day').format("ddd")  //adds a day for every iteration of 'j' 
        cardLayout += `
        <div class="card"">
        <div class="card-body">
        <h2 class="card-title"> ${forecastDay} </h2>
        <img src="https://openweathermap.org/img/wn/${listData[i].weather[0].icon}@2x.png" > </img>
            <h5 class="card-title center">${(listData[i].main.temp -= 273.15).toFixed(1)}°C</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">Humidity: ${(listData[i].main.humidity)}%</h6>
            <p class="card-text">Wind Speed: ${listData[i].wind.speed}</p>
        </div>
    </div>  `
    }
    $("#forecast").empty()
    $('#forecast').append(cardLayout)
}

// diplays error message 
function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent = "";
    card.classList.add("flex");
    card.appendChild(errorDisplay);
}





