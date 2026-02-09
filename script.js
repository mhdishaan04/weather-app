var API_KEY = "3a7862513e0796eaa7a275e47cb22bb6";
setCityBackground("Switzerland");

function getWeather() {
    var cityInput = document.getElementById("cityInput");
    var city = cityInput.value.trim();
    setCityBackground(city);

    if (city === "") {
        alert("Enter a city name");
        return;
    }

    var weatherUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        API_KEY;

    fetch(weatherUrl)
        .then(function (response) {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(function (data) {
            showCurrentWeather(data);
            getForecast(city);
            getAQI(data.coord.lat, data.coord.lon);
        })
        .catch(function (err) {
            console.error(err);
            alert("City not found or API error");
        });
}

function showCurrentWeather(data) {
    var cityBar = document.getElementById("cityBar");
    var iconUrl = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

    cityBar.innerHTML =
        "Today's Weather:<br>" +
        "<img src='" + iconUrl + "' alt='Icon' style='vertical-align: middle; width: 50px;'>" +
        "<strong>" + data.name + "</strong><br>" +
        Math.round(data.main.temp) + " °C - " +
        data.weather[0].description;
}

function getForecast(city) {
    var forecastUrl =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&units=metric&appid=" +
        API_KEY;

    fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            showForecast(data);
        });
}

function showForecast(data) {
    var forecastBar = document.getElementById("forecastBar");
    forecastBar.innerHTML = "";
    var i;
    for (i = 0; i < data.list.length; i = i + 8) {
        var day = data.list[i];
        var dateObj = new Date(day.dt_txt);
        var dayName = dateObj.toDateString().split(" ")[0];
        var div = document.createElement('div');

        div.className = 'forecast-day';
        var iconUrl = "https://openweathermap.org/img/wn/" + day.weather[0].icon + ".png";
        div.innerHTML = dayName + "<br><img src='" + iconUrl + "'><br>" + Math.round(day.main.temp) + " °C";

        forecastBar.appendChild(div);
    }
}

function getAQI(lat, lon) {
    var aqiUrl =
        "https://api.openweathermap.org/data/2.5/air_pollution?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        API_KEY;

    fetch(aqiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            showAQI(data);
        });
}

function showAQI(data) {
    var aqiBar = document.getElementById("aqiBar");
    var aqiValue = data.list[0].main.aqi;

    var levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    var index = (aqiValue >= 1 && aqiValue <= 5) ? aqiValue - 1 : 0;

    aqiBar.innerHTML = "<div> AQI: " + levels[index] + "</div>";
}

function setCityBackground(city) {
    const accessKey = "_J25SayQfoN8FJ_KLJny_54nH7IY-ztgu5i0vtIj_Us";

    const url = `https://api.unsplash.com/search/photos?query=${city} city landscape&orientation=landscape&per_page=1&client_id=${accessKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.results.length === 0) {
                console.log("No image found");
                return;
            }

            const imageUrl = data.results[0].urls.full;

            document.body.style.backgroundImage = `url('${imageUrl}')`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
        })
        .catch(err => console.error(err));
}
