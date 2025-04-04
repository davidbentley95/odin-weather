import "./styles.css";

let cityQuery = "";
let unitGroup = "uk";

async function getCityDetails(userString) {
    let apiCityQuery = `https://secure.geonames.org/searchJSON?q=${userString}&maxRows=5&username=davidbentley`;

    const response = await fetch(apiCityQuery, { mode: "cors" });

    const data = await response.json();

    if(document.querySelector(".auto-city-listing").childElementCount === 0) {
        data.geonames.forEach(cityObject => {
            displayPossibleCities(cityObject.name, cityObject.adminName1, cityObject.countryName);
        })
    } else {
        updatePossibleCities(data.geonames);
    }
}

async function getWeatherData() {
    try {
        let apiSearchQuery = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityQuery}?unitGroup=${unitGroup}&key=Q5PNNCTCNG9SWP7EEZQX9CPKG&contentType=json`;

        const response = await fetch(apiSearchQuery, { mode: 'cors' });

        const data = await response.json();

        const location = data.resolvedAddress;
        const icon = data.currentConditions.icon;
        const temp = data.currentConditions.temp;
        const sunrise = data.currentConditions.sunrise;
        const sunset = data.currentConditions.sunset;
        const humidity = data.currentConditions.humidity;
        const uvindex = data.currentConditions.uvindex;
        document.querySelector("#weather-container").style.display = "grid";
        document.querySelector(".temp-unit-buttons-container").style.display = "flex";

        updatePageDate(location, icon, temp, sunrise, sunset, humidity, uvindex);

    } catch (error) {
        console.error('Error fetching weather data:', error.message);

        
        alert('Sorry, we could not fetch weather data for that city. Please try again.');
    }
}

function updatePageDate(location, icon, temp, sunrise, sunset, humidity, uvindex) {

    const container = document.querySelector("#weather-container");
    container.innerHTML = ""; // Clear previous content

    const locationElement = document.createElement("h2");
    locationElement.classList.add("location-header");
    locationElement.textContent = location;

    const iconElement = document.createElement("img");
    iconElement.classList.add("weather-icon");
    iconElement.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/1st%20Set%20-%20Monochrome/${icon}.svg`;
    iconElement.alt = icon; // For accessibility

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

function formatTempUnit() {
    document.querySelectorAll("label").forEach(element => {
        if(element.classList.contains(unitGroup)) {
            element.classList.add("checkedButton")
        } else {
            element.classList.remove("checkedButton")
        }
    })
}

function displayPossibleCities(cityName, adminName1, countryName) {
    const cityElement = document.createElement("div");
    cityElement.classList.add("auto-city");
    cityElement.textContent = `${cityName}, ${adminName1}, ${countryName}`;

    document.querySelector(".auto-city-listing").append(cityElement);
}

function updatePossibleCities(cityArray) {
    console.log(cityArray);
    const cityListing = document.querySelector(".auto-city-listing");
    console.log(cityListing);


    for (let i=0; i < cityArray.length; i++) {
        cityListing.children[i].textContent = `${cityArray[i].name}, ${cityArray[i].adminName1}, ${cityArray[i].countryName}`;
    }
}

document.getElementById("city-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    document.querySelector(".auto-city-listing").innerHTML = "";
    const cityInput = document.getElementById("city-input");

    if (cityInput.checkValidity()) { 
        cityQuery = cityInput.value; 
        getWeatherData();
        formatTempUnit();
    } else {
        cityInput.reportValidity();
    }
});

document.querySelector(".temp-unit-buttons-container").addEventListener("click", (e) => {
    const label = e.target.closest("label")

    if (label) {

        if (label.classList.contains("celsius")) {
            unitGroup = "uk";
            formatTempUnit();
            getWeatherData();
        } else if (label.classList.contains("fahreinheit")) {
            unitGroup = "us";
            formatTempUnit();
            getWeatherData();
        }
    }
})

let debounceTimer;
document.getElementById("city-input").addEventListener("input", function(event) {
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
        getCityDetails(event.target.value); 
    }, 300);  // Wait 300ms before executing
});

document.querySelector(".auto-city-listing").addEventListener("click", (e) => {

    document.querySelector("#city-input").value = e.target.innerHTML;
})
