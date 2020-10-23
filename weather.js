/* weather.js */

/*

0d48137e0b7a98d31339d9bd38c443e9
https://home.openweathermap.org/api_keys

*/

const APIKey = '0d48137e0b7a98d31339d9bd38c443e9';
const keyParam = 'appid='+APIKey;
const currentEndpoint = 'https://api.openweathermap.org/data/2.5/weather?'+keyParam+'&q=';
//const fiveDayEndpoint = 'https://api.openweathermap.org/data/2.5/forecast/daily?'+keyParam+'&cnt=5&q=';

const fiveDayEndpoint = 'https://api.openweathermap.org/data/2.5/onecall?'+keyParam;


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
}

var lat;
var long;
var temp;
var tempMax;
var tempMin;

function getApiInfo() {
    alert('apiInfo called');
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
        tempMax = dataNow.main.temp_max;
        tempMin = dataNow.main.temp_min;
        fiveDay();
        /*
        data.forEach((movie) => {
        console.log(movie.title)
        })
        */
    } else {
        console.log('error - first request')
    }
    };

    request.send();

    
}

function fiveDay() {
    var fiveDayUri = fiveDayEndpoint+'&lat='+lat+'&lon='+lon;
    
    request = new XMLHttpRequest();

    request.open('GET', fiveDayUri, true);
    console.log(fiveDayEndpoint);
    request.onload = function () {
    // Begin accessing JSON data here
    var dataWeek= JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
        console.log(dataWeek);

    } else {
        console.log('error - five day request')
    }
    };

    request.send();
}

function cityClick() {

}

