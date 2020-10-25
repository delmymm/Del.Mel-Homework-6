var currentCityName = document.querySelector("#city-name");
var currentTemp = document.querySelector("#current-name");
var currentHumidity = document.querySelector("#current-humidity");
var currentUvIndex = document.querySelector("#current-index");
/* weather.js */

/*

0d48137e0b7a98d31339d9bd38c443e9
https://home.openweathermap.org/api_keys

*/

const APIKey = '0d48137e0b7a98d31339d9bd38c443e9';
const keyParam = 'appid='+APIKey;
const currentEndpoint = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&'+keyParam+'&q=';
//const fiveDayEndpoint = 'https://api.openweathermap.org/data/2.5/forecast/daily?'+keyParam+'&cnt=5&q=';

const fiveDayEndpoint = 'https://api.openweathermap.org/data/2.5/onecall?units=imperial&'+keyParam;


var cityInfo = {};
/*
cityInfo['Chicago']['temp']  ...

we will have a function cityHistoryClick(cityName) {
    
}
*/

document.onload = init();


function init() {
    //alert('called');
    var cityButton = document.getElementById('cityGo');
    var cityInput = document.getElementById('cityInput');
    cityButton.addEventListener('click', getApiInfo);
    var forecastBox = document.getElementById('forecastBox');
}

var lat;
var long;
var temp;

function getApiInfo() {
    //alert('apiInfo called');
    var city = cityInput.value;
    if (city =='') {
        alert('no city!');
        return;
    }

    var request = new XMLHttpRequest();

    request.open('GET', currentEndpoint+city, true);
    console.log(currentEndpoint+city);
    request.onload = function () {
    // Begin accessing JSON data here
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
    if(cloudInt > 66) return '<img src="Assets/cloud.png" alt="very cloudy">';
    else if(cloudInt > 33) return '<img src="Assets/half-cloud.png" alt="partially cloudy">';
    else return '<img src="Assets/half-cloud.png" alt="partially cloudy">';
}

function fiveDay() {
    var fiveDayUri = fiveDayEndpoint+'&lat='+lat+'&lon='+lon;
    var fiveDayInfo = {};
    
    request = new XMLHttpRequest();

    request.open('GET', fiveDayUri, true);
    console.log(fiveDayEndpoint);
    request.onload = function () {
    // Begin accessing JSON data here
    var dataWeek= JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
        console.log(dataWeek);
        for(i = 1; i <5; i++) {
            fiveDayInfo[i] = {};

            console.log(dataWeek[i]);
            fiveDayInfo[i].clouds = dataWeek.daily[i].clouds;
            fiveDayInfo[i].cloudHTML = cloudImg(dataWeek.daily[i].clouds);
            fiveDayInfo[i].temp = dataWeek.daily[i].temp.day;

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

function formatFiveDay(infoArray) {
    var content = '';
    for(i=0; i < infoArray.length; i++) {

        content += '<div class="dayBox">';
        content += infoArray[i].temp;
        content += infoArray[i].cloudHTML;
        content += '</div>';
    }
    //console.log(forecastBox);
    console.log(content);
    forecastBox.innerHtml = content;
}

function cityClick() {

}
var temp = {
    currentCityName: currentCityName.value(),
    currentTemp: currentTemp.value(),
    currentHumidity: currentHumidity.value(),
    currentUvIndex: currentUvIndex.value(),
};


localStorage.setItem("temp", JSON.stringify(temp));

// get most recent submission
var recentTemp = JSON.parse(localStorage.getItem("temp"));
currentCityName.textContent = recentTemp.currentCityName;
currentTemp.textContent = recentTemp.currentTemp;
currentHumidity.textContent = recentTemp.currentHumidity;
currentUvIndex.textContent = recentTemp.currentUvIndex;