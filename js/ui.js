/**
 * Created by cwcordell on 9/27/16.
*/

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
    console.log('lat and long');
    var lat = document.getElementById('lat').value.trim().toUpperCase();
    var long = document.getElementById('long').value.trim().toUpperCase();
    var latLimit = -90;
    var longLimit = 180;
    var er = ['Coordinates must be in a valid format and range with half degree increments:',
        'Latitude: 90N to 90S',
        'Longitude: 180E to 180W',
        '\n',
        'ERRORS:'
    ];
    var erStartLen = er.length;

    if(lat.value != "" && long.value != "") {
        var longRegex = /^((?:1?[0-7]?\d(?:\.[05])?0*)|(?:180(?:\.0*)?))\s?[EW]$/i;
        var latRegex = /^((?:[0-8]?\d(?:\.[05])?0*)|(?:90(?:\.0*)?))\s?[NS]$/i;
        if(!latRegex.test(lat) || !longRegex.test(long)) {
            er.push('The coordinates are in an improper format');
        }
        console.log(latRegex.test(lat));
        console.log(longRegex.test(long));

        // need to validate data here
        // lat and long limits:
        // lat: 90S (-90) to 90N (+90)
        // long: 180W (-180) to 180E (+180)
    //     console.log(lat + ' ' + long);
    //     // check lat and long direction
        var latDir = lat.slice(-1);
        var longDir = long.slice(-1);
    //     if(latDir !== 'N' && latDir !== 'S') er.push('Latitude must end with an N or S');
    //     if(longDir !== 'E' && latDir !== 'W') er.push('Longitude must end with an E or W');
    //
    //     // check if lat and long input is a valid float value
        var latNumString = lat.slice(0,-1).trim();
        var latNums = parseFloat(latNumString);
        var longNumString = long.slice(0,-1).trim();
        var longNums = parseFloat(longNumString);
        // var latArray = latNumString.split('.');
        // var longArray = longNumString.split('.');
    //
    //     if(latNums.toString().length !== latNumString.length) {
    //         er.push('Latitude coordinate does not contain a valid number');
    //     }
    //
    //     if(longNums.toString().length !== longNumString.length) {
    //         er.push('Longitude coordinate does not contain a valid number');
    //     }
    //
    //     // check incrementation
    //     // if(latArray[1].length > 1 || (latArray[1] !== 0 || latArray[1] !== 5))
    //     //     er.push('Latitude must be in increments of .5 degrees');
    //     // if(longArray[1].length > 1 || (longArray[1] !== 0 || longArray[1] !== 5))
    //     //     er.push('Longitude must be in increments of .5 degrees');
    //
    //     // check ranges
    //     if(!(latNums <= 90 && latNums >= -90)) er.push('Latitude is out of range, must be between -90 and 90');
    //     if(!(longNums <= 180 && longNums >= -180)) er.push('Longitude is out of range, must be between -180 and 180');
    //
    //     // console.log(latNums.toString().length);
    //     // console.log(latNumString.length);
    //     // console.log(typeof latNums);
    //     // console.log(latNums + ' ' + longNums);
    //     // console.log(latDir + ' ' + longDir);
    //     // console.log(lat + ' ' + long);
    //     // console.log(er);
        var minLong = longNums;
        var maxLat = latNums;

        if(latDir === 'S')
            maxLat = -maxLat;

        if(longDir === 'W')
            minLong = -minLong;

        var minLat = latNums - 20;
        var maxLong = longNums + 20;

        if(minLat < latLimit){
            maxLat += minLat - latLimit;
            minLat = latLimit;
        }
        if(maxLong > longLimit)
            maxLong - (2 * longLimit);


        console.log(minLat);
        if(er.length - erStartLen !== 0) error(er.join('\n'));
        else getData(minLat, minLong, maxLat, maxLong);
    } else {
        error("The Latitude and Longitude fields are empty!");
    }
});

document.getElementById('map_format_select').addEventListener('change', function (event) {
    weather_module.update_format(event.target.value);
});

document.getElementById('data_presets_select').addEventListener('change', function (event) {
    weather_module.display(event.target.value);
});

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

function getData(minLat, minLong, maxLat, maxLong) {
    console.log('getData reached');
    console.log(minLat + ', ' + minLong + ', ' +  maxLat + ', ' +  maxLong);
    // var url = 'https://cs420.andrewpe.com/data';
    var url = 'http://45.55.77.74:8080/get/location/minLat/-200/maxLat/0/minLong/1600/maxLong/1800';
    // var url = 'http://45.55.77.74:8080/get/location/minLat/${minLat}/maxLat/${maxLat}/minLong/${minLong}/maxLong/${maxLong}';
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
    // weather_module.load_data(null, response);
    console.log(response);
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