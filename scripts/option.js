function saveOptions() {
    var temperatureFormat = document.getElementById('temperatureFormat').value;
    chrome.storage.sync.set({
        temperatureFormat: temperatureFormat
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';

        setTimeout(function() {
            status.textContent = '';
        }, 750);

        chrome.extension.sendRequest({temperatureFormat: temperatureFormat}, function(response) {
            //
        });
    });
}

function getOptions() {
    chrome.storage.sync.get({
        temperatureFormat: 'C'
    }, function(items) {
        document.getElementById('temperatureFormat').value = items.temperatureFormat;
    });
}

document.addEventListener('DOMContentLoaded', getOptions);
document.getElementById('save').addEventListener('click', saveOptions);

