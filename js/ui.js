/**
 * Created by cwcordell on 9/27/16.
*/
const data;
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

        var minLat = latNums - 20;
        var maxLong = longNums + 20;

        if(minLat < latLimit){
            maxLat += minLat - latLimit;
            minLat = latLimit;
        }
// parse([]);
        if(er.length - erStartLen !== 0) error(er.join('\n'));
        else {
            if (maxLong > longLimit) {
                qArray = getData(minLat, minLong, maxLat, longLimit).concat(
                    getData(minLat, longLimit, maxLat, maxLong - (2 * longLimit)));
                parse(qArray);
            } else
                qArray = getData(minLat, minLong, maxLat, maxLong);

            console.log(minLat);
        }
    } else {
        error("The Latitude and Longitude fields are empty!");
    }
});

// function data_obj(i1, i2, i3, lat, long, date) {
//     this.lati = i1;
//     this.longi = i2;
//     this.i = i3;
//     this.lat = lat;
//     this.long = long;
//     this.date = date;
// }
//
// function lat5_obj(y) {
//     this.lat5 = y;
// }
//
// function long5_obj(x) {
//     this.long5 = x;
// }
//
// function parse(ar) {
//     var d = {};
//     d['1.2.3'] = new data_obj(1,2,3,4,43,84);
//     for(var x in ar) {
//         d['1.2.3'] = new data_obj(1,2,3,4,43,84);
//     }
// }

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
    if(data == null) {
        var dataCount = 0;
        var cssclass;
        for (var i = 0, f; f = data[i]; i++) {
            // output.push('<div class="data">',f,'</div>');
            cssclass = "data";
            if (dataCount % 2 == 0) cssclass += " stripe"
            var temp = '<div class="' + cssclass + '" >' + f + '</div>';
            addData(temp);
            dataCount++;
        }
    } else {
        addData();
    }
    // document.getElementById('data-panel').innerHTML = output.join('');
}

function getData(minLat, minLong, maxLat, maxLong) {
    // console.log('getData reached');
    // console.log(minLat + ', ' + minLong + ', ' +  maxLat + ', ' +  maxLong);
    // minLat = Math.round(minLat * 10);
    // minLong = Math.round(minLong * 10);
    // maxLat = Math.round(maxLat * 10);
    // maxLong = Math.round(maxLong * 10);
    console.log('Coordinates: ' + minLat + ', ' + minLong + ', ' +  maxLat + ', ' +  maxLong);
    // var url = 'https://cs420.andrewpe.com/data';
    // var url = 'http://45.55.77.74:8080/get/location/minLat/-20/maxLat/0/minLong/160/maxLong/180';
    // var url = "https://cs420.andrewpe.com/api/get/location/minLat/-20/maxLat/0/minLong/160/maxLong/180";
    // var url = 'http://45.55.77.74:8080/get/location/minLat/${minLat}/maxLat/${maxLat}/minLong/${minLong}/maxLong/${maxLong}';
    // var method = 'GET';
    // var response = 'default text';
    //
    // var xhr = new XMLHttpRequest();
    // xhr.open(method, url, false);
    // xhr.timeout = 10000; // time in milliseconds
    // xhr.ontimeout = function (e) {
    //     console.log('Timeout');
    //     consloe.log(e);
    // };
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    //         response = JSON.parse(xhr.responseText);
    //     } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 200) {
    //         error("There was an error getting the data!")
    //     }
    // }
    // xhr.send();

    // weather_module.load_data(null, response);
    // console.log(response);

    $.ajax({
        // url: "http://45.55.77.74:8080/get/location/minLat/-20/maxLat/0/minLong/160/maxLong/180",
        url: "https://cs420.andrewpe.com/api/get/location/minLat/-20/maxLat/0/minLong/160/maxLong/180",
        // beforeSend: function( xhr ) {
        //     xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
        // }
    })
        .done(function( data ) {

            if ( console && console.log ) {
                console.log( "Sample of data:", data.slice( 0, 100 ) );
                weather_module.load_data(null, response);
            }
        });
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