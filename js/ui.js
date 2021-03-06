/**
 * Created by cwcordell on 9/27/16.
*/

var data = [];
var apiCallsNeeded;
var datasets;
var datasetNamesAPI = 'https://cs420.andrewpe.com/api/datasets';
var currentDatasetIndex = 0;
var currentIndex = null;
var data_presets_select = document.getElementById('data_presets_select');
var latitude;
var longitude;

/**
 * Click event listener for the latitude and longitude user input submission.
 * The function validates the input then either calls the notify function if
 * valid or calls the error function if not valid.
 */
document.getElementById('lat_long_submit').addEventListener('click', function (event) {
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
            maxLat = latLimit + 20;
            minLat = latLimit;
        }

        latitude = maxLat;
        longitude = minLong;


        if(er.length - erStartLen !== 0) error(er.join('\n'));
        else {
            if (maxLong > longLimit) {
                qArray = getData([
                    {minLat: minLat, minLong: minLong, maxLat: maxLat, maxLong: longLimit},
                    {minLat: minLat, minLong: longLimit, maxLat: maxLat, maxLong: ( maxLong - (2 * longLimit) )}
                ]);
            } else {
                qArray = getData([{minLat: minLat, minLong: minLong, maxLat: maxLat, maxLong: maxLong}]);
            }
            apiCallsNeeded = getData.length;
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
    // console.log(event.target.value);
    weather_grid.update_format(event.target.value);
    weather_grid.display('weather_grid', latitude, longitude);
});

/**
 * Click event listener for the map format select box that calls the display
 * function in the weather grid module.
 */
data_presets_select.addEventListener('change', function (event) {
    console.log(event.target.value);
    currentDatasetIndex = event.target.value;
    // weather_module.display(datasetNamesAPI[currentDatasetIndex]);
});

/**
 * Adds data to the data panel.
 *
 * @param line The string to be added to the data panel.
 */
function addData(line) {
    if (document.contains(document.getElementById("wait"))) {
        document.getElementById("wait").remove();
    }
    document.getElementById('data-panel').innerHTML += line;
}

/**
 * Adds detail data to the detail panel.
 *
 * @param line The string to be added to the detail panel.
 */
function addDetailData(line) {
    document.getElementById('detail-panel').innerHTML += line;
}

/**
 * Parses the data from the server and calls the addData function to add the
 * data to the data panel.
 */
function setDataPanel() {
    // data = data.slice(200,400);
    resetData();
    showDataPanel();
    document.getElementById("detail-panel").style.visibility = "hidden";
    document.getElementById("data-panel").style.visibility = "visible";
    waitMessage('Loading Data ...');

    var dataCount = 0;
    var cssclass;
    var lat;
    var lon;
    var regionCt = 0;
    var stormCt = 0;
    addData(`<div class="data">Region Count: ${data.length}</div>`);
    addData(`<div class="data stripe">Storm Region Count: <span id="regionCt"></span></div>`);
    addData(`<div class="data">Total Storm Count: <span id="stormCt"></span></div>`);

    for (var j = 0, d; d = data[j]; j++) {
        if(d.count > 0) {
            regionCt++;
            stormCt += d.count;
            cssclass = "hand data";
            var lat = d.data[0].LatNS / 10;
            var lon = d.data[0].LonEW / 10;
            if (dataCount % 2 == 0) cssclass += " stripe";
            addData(`<div class="${cssclass}" id="${j}" onclick="setTile(id)">No: ${j}<br/>Latitude: ${lat}<br/>Longitude: ${lon}<br/>Storm Count: ${d.count}</div>`);
            dataCount++;
        }
        document.getElementById('regionCt').innerHTML = regionCt;
        document.getElementById('stormCt').innerHTML = stormCt;
    }
}

/**
 * Refreshes the data panel with tile specific data.
 *
 * @param index The index number for the item in the data array.
 */
function setTile(index) {
    if(index == null || currentIndex == index) {
        currentIndex = null;
        showDataPanel();
    } else {
        clearDetailPanel()
        showDetailPanel();
        document.getElementById('sidebar-wrapper').scrollTop = 0;
        currentIndex = index;
        addDetailData(`<div class="hand data" onclick="setTile(null)">Back</div>`);
        addDetailData(`<div class="data stripe" >Detail View</div>`);
        var cssclass;
        var tile = data[index];
        addDetailData(`<div class="data" >Number of Storms: ${tile.count}</div>`);
        var dataCount = 0;
        for (var i = 0, f; f = tile.data[i]; i++) {
            cssclass = "data";
            if (dataCount % 2 == 0) cssclass += " stripe";
            addDetailData(`<div class="${cssclass}" >Lat: ${f.LatNS/10}<br/>Lon: ${f.LonEW/10}<br/>Time: ${new Date(f.YYYYMMDDHH)}</div>`);
            dataCount++;
        }
    }
}

/**
 * Shows the data panel and hides the detail panel.
 */
function showDataPanel() {
    document.getElementById("detail-panel").style.visibility = "hidden";
    document.getElementById("data-panel").style.visibility = "visible";
}

/**
 * Shows the detail panel and hides the data panel.
 */
function showDetailPanel() {
    document.getElementById("data-panel").style.visibility = "hidden";
    document.getElementById("detail-panel").style.visibility = "visible";
}

/**
 * Displays a message while data is retrieved or loaded.
 */
function waitMessage(msg) {
    clearDataPanel();
    addData(`<div class="data" id="wait">${msg}</div>`);
}

/**
 * Resets the currentIndex to null and clears the data panel.
 */
function resetData() {
    currentIndex = null;
    clearDataPanel();
}

/**
 * Clears the data panel.
 */
function clearDataPanel() {
    document.getElementById('data-panel').innerHTML = '';
}

/**
 * Clears the detail panel.
 */
function clearDetailPanel() {
    document.getElementById('detail-panel').innerHTML = '';
}

/**
 * Gets storm data from the server within the specified boundries.
 *
 * @param ar The array containing the coordinate values:
 *      minLat The minimum latitude coordinate
 *      minLong The minimum longitude coordinate
 *      maxLat The maximum latitude coordinate
 *      maxLong The maximum longitude coordinate
 */
function getData(ar) {
    data = [];
    waitMessage('Fetching Data ...');
    for(var i = 0; i < ar.length; i++) {
        console.log("url = https://cs420.andrewpe.com/api/get/location/minLat/"+ar[i].minLat+"/maxLat/"+ar[i].maxLat+"/minLong/"+ar[i].minLong+"/maxLong/"+ar[i].maxLong+"/dataset/"+data_presets_select.selectedOptions[0].innerHTML);
        $.ajax({
            // url: "https://cs420.andrewpe.com/api/get/location/minLat/-20/maxLat/0/minLong/160/maxLong/180",
            // url: `https://cs420.andrewpe.com/api/get/location/minLat/${ar[i].minLat}/maxLat/${ar[i].maxLat}/minLong/${ar[i].minLong}/maxLong/${ar[i].maxLong}`,
            url: `https://cs420.andrewpe.com/api/get/location/minLat/${ar[i].minLat}/maxLat/${ar[i].maxLat}/minLong/${ar[i].minLong}/maxLong/${ar[i].maxLong}/dataset/${data_presets_select.selectedOptions[0].innerHTML}`
        }).done(function(d) {
            dataManager(d);
        });
    }
}

/**
 * Gets dataset names from the server.
 */
function getDatasetNames() {
    $.ajax({
        url: datasetNamesAPI,
    }).done(function(d) {
        datasets = d;
        populateDatasetNames();
        console.log(d);
    });
}

/**
 * Populates the data preset select with the dataset names.
 */
function populateDatasetNames() {
    // data_presets_select
    if(datasets.length > 0) {
        for(var i = 0; i < datasets.length; i++) {
            var option = document.createElement("option");
            option.appendChild(document.createTextNode(datasets[i]));
            option.value = i;
            data_presets_select.appendChild(option);
        }
    }
}

/**
 * Adds a new dataset name to the data preset select.
 */
function addDatasetName(name) {
    console.log(name);
    datasets.push(name);
    console.log(datasets);
    var option = document.createElement("option");
    option.appendChild(document.createTextNode(name));
    option.value = datasets.length;
    data_presets_select.appendChild(option);
}

/**
 * Checks that the dataset name does not exist in the dataset array.
 *
 * @return boolean.
 */
function datasetContains(name) {
    if(datasets.length == 0) return false;
    for(var i = 0; i < datasets.length; i++) {
        if(name == datasets[i]) return true;
    }
    return false;
}

/**
 * Combines data from api calls into one array, keeps a count of remaining api calls and then calls the setDataPanel
 * method when all calls have submitted a response.
 *
 * @param d The response data array from an api call.
 */
function dataManager(d) {
    data = data.concat(d);
    --apiCallsNeeded;
    if(apiCallsNeeded == 0) {
        setDataPanel();
        weather_grid.load_data(data);
        console.log('Coordinates: ' + latitude + ' ' + longitude);
        weather_grid.display('weather_grid', latitude, longitude);
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

/**
 * JQuery listener for csv loader.
 */
//Change Listener
$('#csv-uploader').on('change', importCSV);

/**
 * Gets the dataset names.
 */
//Change Function
function importCSV(event){
    var files = event.target.files;
    console.log('Importing CSV');

    var uploadData = new FormData();
    var name = prompt("What would you like to name the dataset?");
    var regex = /^[a-zA-Z_-]{3,16}$/i;

    if(!regex.test(name)) {
        error('The dataset name is invalid.' +
            'Allowed characters are upper and lower case letters, dashes, and underscores.');
    } else if (datasetContains(name)) {
        error('The dataset name already exists.');
    } else {
        for (var i = 0; i < files.length; i++) {
            uploadData.append('files', files[i]);
            uploadData.append('dataset', name);
        }

        $.ajax({
            type: 'POST',
            url: 'https://cs420.andrewpe.com/api/upload',
            data: uploadData,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log('Ajax call was successful!');
                // console.log(data);
                addDatasetName(name);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(errorThrown);
            },
        });
    }
}

// make the call to get the datasets
getDatasetNames();


// Automated unit testing
function runTests() {
    // test the data panel
    var dataArray = [];
    for (var i = 0; i < 50; i++) {
        var a = [];
        for (var j = 0; j < 5; j++) {
            a.push(i + ', ' + j + '. This is a line of data');
        }
        dataArray.push(a);
    }
    setDataPanel(dataArray);
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

// Map Format Select Box                                pass

// Data Preset Select Box                               pass
