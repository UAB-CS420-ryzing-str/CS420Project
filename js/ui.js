/**
 * Created by cwcordell on 9/27/16.
 */

var browserBtnNotifyArray = [];
var submitBtnNotifyArray = [];

function browserBtnClickedNotify(event) {
    fileLoader.click();
    browserBtnNotifyArray.forEach(
        function(func){
            func(event)
        })
}

function submitBtnClickedNotify(event) {
    // alert(fileLoader.files[0]);
    console.log(fileLoader.files[0]);
    var filePath = document.getElementById('file-path').value;
    event.filePath = filePath;
    submitBtnNotifyArray.forEach(
        function(func) {
            func(event);
        })
}

function fileLoaderNotify(event) {
    console.log(event);
    // handleFileSelect(event);
}

function registerBrowseBtnNotify( recipient ) {
    browserBtnNotifyArray.push(recipient);
}

function registerSubmitBtnNotify( recipient ) {
    submitBtnNotifyArray.push(recipient);
}

// var browseBtn = document.getElementById('browse');
// browseBtn.addEventListener('click', browserBtnClickedNotify);
//
// var submitBtn = document.getElementById('browse-submit');
// submitBtn.addEventListener('click', submitBtnClickedNotify);

// var fileLoader = document.getElementById('file-loader');

// fileLoader.addEventListener('change', fileLoaderNotify);

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



// for testing purposes only below this line
var dataArray = [];
for(var i = 0; i < 50; i++) {
    dataArray.push(i + '. This is a line of data');
}

setDataPanel(dataArray);