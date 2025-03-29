import "./styles.css";

let cityQuery = "Vancouver";
let unitGroup = "uk";
let apiSearchQuery = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityQuery}?unitGroup=${unitGroup}&key=Q5PNNCTCNG9SWP7EEZQX9CPKG&contentType=json`;

async function getWeatherData() {
    const response = await fetch(apiSearchQuery, {mode: 'cors'});
    const data = await response.json();
    const location = data.resolvedAddress;
    const icon = data.currentConditions.icon;
    const temp = data.currentConditions.temp;
    const sunrise = data.currentConditions.sunrise;
    const sunset = data.currentConditions.sunset;
    const humidity = data.currentConditions.humidity;
    const uvindex = data.currentConditions.uvindex;

    console.log(data);
    updatePageDate(location, icon, temp, sunrise, sunset, humidity, uvindex);
}

function updatePageDate(location, icon, temp, sunrise, sunset, humidity, uvindex) {
    console.log(location, icon, temp, sunrise, sunset, humidity, uvindex);
}

getWeatherData();