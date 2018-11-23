//Global variables

var dLat;       //to save Latitude
var dLng;       //to save Longitude




function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("Du hast die Map hier geklickt " + e.latlng.toString())
        .openOn(map);


    //Save Click Coordinates in variable
    dLat = e.latlng.lat;
    dLng = e.latlng.lng;

}


function saveRoute() {
    $.ajax({
        type: 'POST',
        data: { route: { name: 'test' } },
        datatype: 'json',
        url: '/saveRoute',
    });

}

function newPointOfInterest() {
    let oPoint = {};
    oPoint.name = document.getElementById("sName").value;
    oPoint.description = document.getElementById("sDescription").value;
    oPoint.category = document.getElementById("sCategory").value;
    oPoint.latitude = document.getElementById("nLatitude").value;
    oPoint.longitude = document.getElementById("nLongitude").value;
    jsonPoint = JSON.stringify(oPoint);
    //console.log(jsonPoint);
    $.ajax({
        type: 'POST',
        data: { point: jsonPoint },
        datatype: 'json',
        url: 'http://localhost:3001/savePoint',
        success: function (data) {
            console.log('saved document');
        }
    });
}

function getPointsOfInterest() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3001/getData',
        success: function (data) {
            createTable(data);
        }
    });
}

function createTable(data) {
    var col = [];
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    var table = document.createElement("table");

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    for (var i = 0; i < data.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i][col[j]];
        }
    }
    var divContainer = document.getElementById("showData");

    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}
function saveDocument() {
    let oImage = document.getElementById("oDocument").value;
    let oImage2 = document.getElementById("oDocument").files[0].name;
    $.ajax({
        type: 'POST',
        data: { object: oImage2 },
        url: 'http://localhost:3001/saveDocument',
        success: function (data) {
            console.log('saved document');
        }
    });
}

function getDocument() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3001/getDocument',
        success: function (data) {
            let divContainer = document.getElementById("showImage");
            divContainer.innerHTML = ('<img src="' + data + '">');
        }
    });
}

function Registrieren() {
    var passwort = document.getElementById("lPasswort").value;
    var passwortV = document.getElementById("lPasswortV").value;



    if (passwort === passwortV) {
        var oUser = {};
        oUser.email = document.getElementById("lemail").value;
        oUser.username = document.getElementById("luname").value;
        oUser.password = document.getElementById("lPasswort").value;
        jsonUser = JSON.stringify(oUser);
        $.ajax({
            type: 'POST',
            data: { user: jsonUser },
            url: 'http://localhost:3001/saveUser',
            success: function (data) {
                alert("Sie haben sich erfolgreich registriert!");
            },
            error: function (jqXHR, textStatus, errorThrown, data) {
                alert("E-Mail existiert bereits!");
            }

        });
    } else {
        alert("Passwörter stimmen nicht überein.");
    }

}

function Login() {
    var oUser = {};
    oUser.email = document.getElementById("lemail").value;
    oUser.username = document.getElementById("luname").value;
    oUser.password = document.getElementById("lPasswort").value;
    jsonUser = JSON.stringify(oUser);

    $.ajax({
        type: 'POST',
        data: { user: jsonUser },
        url: 'http://localhost:3001/getUser',
        success: function (data) {
            location.href = 'createHighlights.html';
        }
    });
}




