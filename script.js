const searchInpt = document.querySelector('input[type="search"]');
const searchBtn = document.querySelector("button");

async function getWeather(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=ZNYSJ7R92337MFBX2KXHSVG62&contentType=json`
    );

    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }

    const weatherData = await response.json();

    return {
      location: weatherData.resolvedAddress,
      description: weatherData.description,
      conditions: weatherData.currentConditions,
    };
  } catch (error) {
    console.error("An error occurred while fetching the weather data:", error);
    return {
      location: "Unknown",
      description: "Unable to fetch weather information",
      conditions: "",
    };
  }
}

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const query = searchInpt.value;

  if (!query) {
    return;
  }

  displayLoading();
  const data = await getWeather(query);

  stopLoading();
  displayData(data);

  searchInpt.value = "";
});

function displayData(data) {
  const output = document.querySelector("output");
  const locationTitle = output.querySelector("h3");
  const descriptionPara = output.querySelector("p.description");
  const img = output.querySelector("img");
  const tempPara = output.querySelector("p.temperature");
  const humidityPara = output.querySelector("p.humidity");

  locationTitle.textContent = data.location;
  descriptionPara.textContent = data.description;

  img.src = `./weather-icons/${data.conditions.icon}.svg`;
  img.title = data.conditions.conditions;

  tempPara.textContent = `Temperature: ${data.conditions.temp} °C`;
  humidityPara.textContent = `Humidity: ${data.conditions.humidity}%`;
}

function displayLoading() {
  const output = document.querySelector("output");

  output.style.display = "none";

  const loadingEl = document.createElement("p");
  loadingEl.classList.add("loading");
  loadingEl.textContent = "Loading...";

  document.body.appendChild(loadingEl);
}

function stopLoading() {
  const loadingEl = document.querySelector(".loading");
  const output = document.querySelector("output");

  output.style.display = "block";
  loadingEl.remove();
}
