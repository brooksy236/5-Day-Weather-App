dayjs.extend(window.dayjs_plugin_advancedFormat)
let today = dayjs().format("(dddd Do MM YYYY)");

let city = "Rotherham"

const myKey = "fb390030446cd7ca58f93b55b46a5609";
const queryWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`;
//const queryForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myKey}`;
const weatherToday = document.querySelector(".weatherToday");
const userSearch = document.querySelector(".weatherSearch");
const card = document.querySelector(".card");

fetch(queryWeather)
    .then((data) => data.json())
    .then((data) => console.log(data));

