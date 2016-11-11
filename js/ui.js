/**
 * Created by cwcordell on 9/27/16.
 */

var submitBtnNotifyArray = [];
var mapFormatNotifyArray = [];
var dataPresetNotifyArray = [];

/**
 * Click event listener for the latitude and longitude user input submission.
 * The function validates the input then either calls the notify function if
 * valid or calls the error function if not valid.
 *
 * @param canvasTag The string ID value for the canvas tag to have the info
 * 		    displayed in.
 * @param boxSize The size ofthe boxes to be displayed. Default size is 40.
 */
document.getElementById('lat_long_submit').addEventListener('click', function (event) {
    var lat = document.getElementById('lat');
    var long = document.getElementById('long');
    if(lat.value != "" && long.value != "") {
        notify(submitBtnNotifyArray, event);

        // need to validate data here

    } else {
        error("The Latitude and Longitude fields are empty!");
    }
});

/**
 * Registers an observer for the latitude and longitude submit button click
 * event.
 *
 * @param canvasTag The string ID value for the canvas tag to have the info
 * 		    displayed in.
 * @param boxSize The size ofthe boxes to be displayed. Default size is 40.
 */
function registerLatLongSubmitBtnNotify( recipient ) {
    submitBtnNotifyArray.push(recipient);
}

document.getElementById('map_format_select').addEventListener('change', function (event) {
    notify(mapFormatNotifyArray, event.target.value);
});

function registerMapFormatSelectNotify( recipient ) {
    mapFormatNotifyArray.push(recipient);
}

document.getElementById('data_presets_select').addEventListener('change', function (event) {
    notify(dataPresetNotifyArray, event.target.value);
});

function registerDataPresetSelectNotify( recipient ) {
    dataPresetNotifyArray.push(recipient);
}

function addData(line) {
    document.getElementById('data-panel').innerHTML += line;
}

function setDataPanel(data) {
    var dataCount = 0;
    var cssclass;
    for (var i = 0, f; f = data[i]; i++) {
        // output.push('<div class="data">',f,'</div>');
        cssclass = "data";
        if(dataCount % 2 == 0) cssclass += " stripe"
        var temp = '<div class="' + cssclass + '" >' + f + '</div>';
        addData(temp);
        dataCount++;
    }
    // document.getElementById('data-panel').innerHTML = output.join('');
}

function getData() {
    var url = 'https://cs420.andrewpe.com/data';
    var method = 'GET';
    var response = 'default text';
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            response = JSON.parse(xhr.responseText);
        } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 200) {
            error("There was an error getting the data!")
        }
    }
    xhr.send();
    setDataPanel(response);
}

function notify(ar, val) {
    ar.forEach(
        function(func) {
            func(val);
        })
}

function error(message) {
    alert(message);
}

// for testing purposes only below this line
function runTests() {
    // test the data panel
    var dataArray = [];
    for (var i = 0; i < 50; i++) {
        dataArray.push(i + '. This is a line of data');
    }

    setDataPanel(dataArray);

    // test the lat_long submit button
    registerLatLongSubmitBtnNotify(function () {
        alert("register_lat_long_submitBtn clicked and valid");
    });

    // test the map format select
    registerMapFormatSelectNotify(function () {
        alert("Map format changed");
    });

    // test the lat_long submit button
    registerDataPresetSelectNotify(function () {
        alert("Data Preset changed");
    });

    // test the data change
    registerDataChangedNotify(function () {
        alert("Data Changed");
    });
}

// runTests();
// getData();
// console.log("done");