/**
 * Created by cwcordell on 9/27/16.
*/

var data = [];

/**
 * Click event listener for the latitude and longitude user input submission.
 * The function validates the input then either calls the notify function if
 * valid or calls the error function if not valid.
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
        var longRegex = /^((?:1?[0-7]?\d(?:\.[05])?)|(?:180(?:\.0*)?))\s?[EW]$/i;
        var latRegex = /^((?:[0-8]?\d(?:\.[05])?)|(?:90(?:\.0*)?))\s?[NS]$/i;
        if(!latRegex.test(lat) || !longRegex.test(long)) {
            er.push('The coordinates are in an improper format');
        }

        // lat and long limits:
        // lat: 90S (-90) to 90N (+90)
        // long: 180W (-180) to 180E (+180)

        // check lat and long direction
        var latDir = lat.slice(-1);
        var longDir = long.slice(-1);
        var latNumString = lat.slice(0,-1).trim();
        var latNums = parseFloat(latNumString);
        var longNumString = long.slice(0,-1).trim();
        var longNums = parseFloat(longNumString);

        var minLong = longNums;
        var maxLat = latNums;
        var qArray = [];

        if(latDir === 'S')
            maxLat = -maxLat;

        if(longDir === 'W')
            minLong = -minLong;

        var minLat = maxLat - 20;

        var maxLong = minLong + 20;

        if(minLat < latLimit) {
            console.log('In if');
            maxLat = latLimit + 20;
            minLat = latLimit;
        }
        console.log("lats: " + minLat + ' ' + maxLat + ' ' + latLimit);
        if(er.length - erStartLen !== 0) error(er.join('\n'));
        else {
            if (maxLong > longLimit)
                qArray = getData([
                    { minLat: minLat, minLong: minLong, maxLat: maxLat, maxLong: longLimit },
                    { minLat: minLat, minLong: longLimit, maxLat: maxLat, maxLong: ( maxLong - (2 * longLimit) ) }
                    ]);
            else
                qArray = getData([{minLat: minLat, minLong: minLong, maxLat: maxLat, maxLong: maxLong}]);

            console.log(minLat);
        }
    } else {
        error("The Latitude and Longitude fields are empty!");
    }
});

/**
 * Click event listener for the map format select box that calls the update_format
 * function in the weather grid module.
 */
document.getElementById('map_format_select').addEventListener('change', function (event) {
    console.log(event.target.value);
    // weather_grid.update_format(event.target.value);
});

/**
 * Click event listener for the map format select box that calls the display
 * function in the weather grid module.
 */
document.getElementById('data_presets_select').addEventListener('change', function (event) {
    console.log(event.target.value);
    // weather_module.display(event.target.value);
});

/**
 * Adds data to the data panel.
 *
 * @param line The string to be added to the data panel.
 */
function addData(line) {
    document.getElementById('data-panel').innerHTML += line;
}

/**
 * Parses the data from the server and calls the addData function to add the
 * data to the data panel.
 */
function setDataPanel() {
    var dataCount = 0;
    var cssclass;
    console.log(data);
    for (var j = 0, d; d = data[j]; j++) {
        for (var i = 0, f; f = d.data[i]; i++) {
            cssclass = "data";
            if (dataCount % 2 == 0) cssclass += " stripe";
            addData('<div class="' + cssclass + '" >' + f.data + '</div>');
            dataCount++;
        }
    }
}

/**
 * Refreshes the data panel with tile specific data.
 *
 * @param index The index number for the item in the data array.
 */
function setTile(index) {
    if(index == null) {
        setDataPanel();
    } else {
        var cssclass;
        var dataCount = 0;
        var tile = data[index];
        for (var i = 0, f; f = tile[i]; i++) {
            cssclass = "data";
            if (dataCount % 2 == 0) cssclass += " stripe"
            addData('<div class="' + cssclass + '" >' + f.data + '</div>');
            dataCount++;
        }
    }
}

/**
 * Gets storm data from the server within the specified boundries.
 *
 * @param minLat The minimum latitude coordinate.
 * @param minLong The minimum longitude coordinate.
 * @param maxLat The maximum latitude coordinate.
 * @param maxLong The maximum longitude coordinate.
 */
function getData(ar) {
    console.log(ar);
    for(var i = 0; i < ar.length; i++) {
        console.log(ar[i]);
        console.log('Coordinates: ' + ar[i].minLat + ', ' + ar[i].minLong + ', ' + ar[i].maxLat + ', ' + ar[i].maxLong);
        $.ajax({
            // url: "https://cs420.andrewpe.com/api/get/location/minLat/-20/maxLat/0/minLong/160/maxLong/180",
            url: "https://cs420.andrewpe.com/api/get/location/minLat/${minLat}/maxLat/${maxLat}/minLong/${minLong}/maxLong/${maxLong}",
        }).done(function(d) {
            data.join(d);
            if(i == ar.length) {
                if (console && console.log) console.log("Sample of data:", d);
                setDataPanel();
                weather_grid.load_data(data);
            }
        });
    }
}

/**
 * Gets storm data from the server within the specified boundries.
 *
 * @param message The minimum latitude coordinate.
 */
function error(message) {
    alert(message);
}

// Automated unit testing
function runTests() {
    // test the data panel
    var dataArray = [];
    for (var i = 0; i < 50; i++) {
        var a = [];
        for (var j = 0; j < 5; j++) {
            a.push(i + ', ' + j + '. This is a line of data');
        }
        data.push(a);
    }
    setDataPanel(dataArray);
    console.log('done');
}

// runTests();

// Manual Testing for UI
// Longitude and Latitude input
// upper left boundry - valid:          90N     0E      passes through
// upper right boundry - valid:         90N     180E    passes through
// lower left boundry - valid:          90S     0E      passes through
// lower right boundry - valid:         90S     180E    passes through
// lat North out of bounds - invalid:   90.5N   0E      caught
// lat North out of bounds - invalid:   90.5S   0E      caught
// lon East out of bounds - invalid:    90N     180.5E  caught
// lon West out of bounds - invalid:    90N     180.5w  caught

// Map Format Select Box

// Map Format Select Box
