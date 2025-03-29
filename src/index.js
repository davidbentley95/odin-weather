import "./styles.css";

let cityQuery = "";
let unitGroup = "uk";


async function getWeatherData() {

    let apiSearchQuery = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityQuery}?unitGroup=${unitGroup}&key=Q5PNNCTCNG9SWP7EEZQX9CPKG&contentType=json`;

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

    const container = document.querySelector("#weather-container");
    container.innerHTML = ""; // Clear previous content

    const locationElement = document.createElement("h2");
    locationElement.classList.add("location-header");
    locationElement.textContent = location;

    const iconElement = document.createElement("p");
    iconElement.classList.add("weather-icon-text");
    iconElement.textContent = icon;

    let tempUnit;

    if(unitGroup === "uk") {
        tempUnit = "°C"
    } else {
        tempUnit = "°F"
    }

    const tempElement = document.createElement("p");
    tempElement.classList.add("temperature");
    tempElement.textContent = `${temp}${tempUnit}`;

    const sunriseElement = document.createElement("p");
    sunriseElement.classList.add("sunrise");
    sunriseElement.textContent = "Sunrise:";
    const sunriseSpan = document.createElement("span");
    sunriseSpan.textContent = sunrise; 
    sunriseElement.append(sunriseSpan);

    const sunsetElement = document.createElement("p");
    sunsetElement.classList.add("sunset");
    sunsetElement.textContent = "Sunset:";
    const sunsetSpan = document.createElement("span");
    sunsetSpan.textContent = sunset; 
    sunsetElement.append(sunsetSpan);

    const humidityElement = document.createElement("p");
    humidityElement.classList.add("humidity");
    humidityElement.textContent = "Humidity:";
    const humiditySpan = document.createElement("span");
    humiditySpan.textContent = `${humidity}%`; 
    humidityElement.append(humiditySpan);

    const uvIndexElement = document.createElement("p");
    uvIndexElement.classList.add("uv-index");
    uvIndexElement.textContent = `UV Index: ${uvindex}`;
    const uvIndexSpan = document.createElement("span");
    uvIndexSpan.textContent = uvindex; 
    uvIndexElement.append(uvIndexSpan);

    const minorStats = document.createElement("div");
    minorStats.classList.add("minor-stats-div");

    minorStats.append(sunriseElement, sunsetElement, humidityElement, uvIndexElement)

    // Append elements to the container
    container.appendChild(locationElement);
    container.appendChild(iconElement);
    container.appendChild(tempElement);
    container.appendChild(minorStats);
}



document.getElementById("city-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const cityInput = document.getElementById("city-input");

    if (cityInput.checkValidity()) { 
        cityQuery = cityInput.value; 
        console.log("Valid input:", cityQuery);
        getWeatherData();
    } else {
        cityInput.reportValidity();
    }
});