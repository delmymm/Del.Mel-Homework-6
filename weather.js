var currentCityName;
var currentTemp;
var currentHumidity;
var currentUvIndex;
/* added */
var forecastBox;
var cityButton;
var cityInput;
var tempBox;
/* weather.js */

/*

0d48137e0b7a98d31339d9bd38c443e9
https://home.openweathermap.org/api_keys

*/

const APIKey = '0d48137e0b7a98d31339d9bd38c443e9';
const keyParam = 'appid=' + APIKey;
const currentEndpoint = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&' + keyParam + '&q=';
const fiveDayEndpoint = 'https://api.openweathermap.org/data/2.5/onecall?units=imperial&' + keyParam;


var cityTodayInfo = {};
var cityForecastInfo = {};
/*
cityInfo['Chicago']['temp']  ...

we will have a function cityHistoryClick(cityName) {
    
}
*/

document.onload = init();


function init() {
    cityButton = document.getElementById('cityGo');
    cityInput = document.getElementById('cityInput');
    cityButton.addEventListener('click', getApiInfo);
    forecastBox = document.getElementById('forecast');
    var currentCityName = document.querySelector("#city-name");
    currentTemp = document.querySelector("#current-name");
    currentHumidity = document.querySelector("#current-humidity");
    currentUvIndex = document.querySelector("#current-index");
    tempBox = document.querySelector('#temp');
}

var lat;
var long;
var temp;
var city;

function getApiInfo() {
    city = cityInput.value;
    if (city == '') {
        alert('no city!');
        return;
    }

    var request = new XMLHttpRequest();

    request.open('GET', currentEndpoint + city, true);
    console.log(currentEndpoint + city);
    request.onload = function () {
        var dataNow = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            console.log(dataNow);
            lat = dataNow.coord.lat;
            lon = dataNow.coord.lon;
            temp = dataNow.main.temp;

            fiveDay();
        } else {
            console.log('error - first request')
        }
    };

    request.send();


}

/* cloudInt is from 0 to 100;
returns an html string of an image corresponding to cloudiness 
images: sun.png for 0-33, half-cloud.png for 34-66, cloud.png for 67-100

temperature, the humidity, the wind speed, and the UV index
uv index: color, favorable (0-2), moderate (3-5), or severe (<5) -
write a function using function cloudImg as templaate

*/
function cloudImg(cloudInt) {
    if (cloudInt > 66) return '<img src="Assets/cloud.png" alt="very cloudy">';
    else if (cloudInt > 33) return '<img src="Assets/half-cloud.png" alt="partially cloudy">';
    else return '<img src="Assets/half-cloud.png" alt="partially cloudy">';
}

function uvi_format(uvi) {
    if (uvi > 5) return '<span class="severe">' + uvi + '</span>';
    if (uvi > 2) return '<span class="moderate">' + uvi + '</span>';
    return '<span class="favorable">' + uvi + '</span>';
}

function fiveDay() {
    var fiveDayUri = fiveDayEndpoint + '&lat=' + lat + '&lon=' + lon;
    var fiveDayInfo = {};

    request = new XMLHttpRequest();

    request.open('GET', fiveDayUri, true);
    console.log(fiveDayEndpoint);
    request.onload = function () {

        var dataWeek = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            console.log(dataWeek);
            for (i = 0; i < 7; i++) {
                fiveDayInfo[i] = {};
                fiveDayInfo[i].clouds = dataWeek.daily[i].clouds;
                fiveDayInfo[i].cloudHTML = cloudImg(dataWeek.daily[i].clouds);
                fiveDayInfo[i].temp = dataWeek.daily[i].temp.day;
                fiveDayInfo[i].wind_speed = dataWeek.daily[i].wind_speed;
                fiveDayInfo[i].humidity = dataWeek.daily[i].humidity;
                fiveDayInfo[i].uvi = dataWeek.daily[i].uvi;

            }
            console.log(fiveDayInfo);
            formatFiveDay(fiveDayInfo);

        } else {
            console.log('error - five day request')
        }

    };

    request.send();


    return fiveDayInfo;
}

var fiveDayHtml;
var todayHtml;

function formatFiveDay(infoArray) {
    var content = '';
    console.log(infoArray);
    var todayInfo = '';
    for (var i in infoArray) {
        contentD = '';
        contentD += '<div class="dayBox">';
        contentD += infoArray[i].cloudHTML;
        contentD += 'Temperature: ' + infoArray[i].temp + '<br>';
        contentD += 'Wind Speed: ' + infoArray[i].wind_speed + '<br>';
        contentD += 'Humidity: ' + infoArray[i].humidity + '<br>';
        contentD += 'UVI: <span class="uvi">' + uvi_format(infoArray[i].uvi) + '</span><br>';
        contentD += '</div>';
        if (i > 1) {
            content += contentD;
        } else {
            todayInfo = contentD;
            tempBox.innerHTML = contentD;
        }
    }
    console.log(forecastBox);
    console.log(content);
    forecastBox.innerHTML = content;
    fiveDayHtml = content;
    todayHtml = todayInfo;
    /* Add city to link list of city history */

    /* Add city info to local storage */
}

function cityClick() {

}

function storageSaveCity() {
    let stringified = JSON.stringify(todayHtml);
    console.log(stringified);
    window.localStorage.setItem('temp', stringified);
}

function storageGetCity() {

    let raw = window.localStorage.getItem('temp');
    console.log(raw);
    let stringified = JSON.parse(raw);
    return stringified;
}