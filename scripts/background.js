function xhrMain(obj) {
    var xhr = new XMLHttpRequest(),
        method = "GET";
    xhr.open(method, obj.url, true);
    xhr.onreadystatechange = function () {
        var that = this;
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            if (typeof data === 'undefined') {
                errorCallback();
            }
            var params;
            switch (that.next) {
                case 'getLocationByIP':
                    if (typeof data.ip === 'undefined') {
                        errorCallback();
                        return;
                    }
                    params = data.ip;
                    break;
                case 'getWeatherByCity':
                    if (typeof data.latitude === 'undefined' || typeof data.longitude === 'undefined') {
                        errorCallback();
                        return;
                    }
                    params = data.longitude + ',' + data.longitude;
                    break;
                case 'showWeather':
                    showWeather(data);
                    return;
                default:

            }
            that.callback.url = that.callback.url.replace('---ReplaceMe---', params);
            mainfunc.call(that.callback, "func", that.callback);
        } else {
            errorCallback();
        }
    }.bind(obj)
    xhr.send();
}


function mainfunc(func) {
    this[func].apply(this, Array.prototype.slice.call(arguments, 1, 2, 3));
}

function showWeather(data) {
    console.log(data);

    if (typeof data === 'object' &&
        typeof data.query !== 'undefined' &&
        typeof data.query.results !== 'undefined' &&
        data.query.results !== null &&
        typeof data.query.results.channel !== 'undefined') {

        chrome.storage.sync.get({
            temperatureFormat: 'C'
        }, function(items) {

            var data = this;
            var timeOfDay = isDay() ? 'day' : 'night';
            var temperature = temperatureConverter(
                data.item.condition.temp,
                data.units.temperature,
                items.temperatureFormat
            );

            chrome.browserAction.setIcon({
                path: 'icons/Tick Weather Icon Set/' + timeOfDay + '/' + weathercodes[data.item.condition.code][timeOfDay]
            });

            chrome.browserAction.setBadgeText({
                text: Math.round(temperature) + ''
            });

            chrome.browserAction.setBadgeBackgroundColor({
                color: temperatureConverter(data.item.condition.temp, items.temperatureFormat, 'C') < 0 ?
                    coldTemperatureColor :
                    hotTemperatureColor
            });

        }.bind(data.query.results.channel));

    } else {
        errorCallback();
    }
}

function errorCallback() {
    chrome.browserAction.setBadgeText({
        text: ':('
    });

    chrome.browserAction.setBadgeBackgroundColor({
        color: errorColor
    });
}

function isDay() {
    var date = new Date();
    var currentHour = date.getHours();
    return 9 <= currentHour && currentHour <= 19;
}

var ReplaceMeMarker = '---ReplaceMe---';

var getWeatherByCity = {
    next: 'showWeather',
    url: 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURI(
         'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="(' + ReplaceMeMarker + ')")'
    ),
    func: xhrMain,
    callback: showWeather
}

var getLocationByIP = {
    next: 'getWeatherByCity',
    url: "http://freegeoip.net/json/" + ReplaceMeMarker,
    func: xhrMain,
    callback: getWeatherByCity
}

var getIP = {
    next: 'getLocationByIP',
    url: "https://api.ipify.org?format=json",
    func: xhrMain,
    callback: getLocationByIP
}



chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        mainfunc.call(getIP, "func", getIP);
        sendResponse({});
});

function loadData () {

    mainfunc.call(getIP, "func", getIP);

    setTimeout(function() {
        loadData();
    }, timeout)
}

loadData();
