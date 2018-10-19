
window.onload = function() {
    getPointsOfInterest();
};

var dLat;
var dLng;

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("Du hast die Map hier geklickt " + e.latlng.toString())
        .openOn(map);


    //Save Click Coordinates in variable;
    dLat = e.latlng.lat;
    dLng = e.latlng.lng;

  }

function newPointOfInterest() {
    let oPoint = {};
    oPoint.name = document.getElementById("sName").value;
    oPoint.description = document.getElementById("sDescription").value;
    oPoint.category = document.getElementById("iCategory").value;
    oPoint.latitude= dLat;
    oPoint.longitude = dLng;
    jsonPoint = JSON.stringify(oPoint);
    //console.log(jsonPoint);
      $.ajax({
        type: 'POST',
        data: {point: jsonPoint},
        datatype: 'json',
        url: '/test',
        // success: function(data) {
        //     alert('data inserted in database');
        //     document.getElementById("sName").value = "";
        //     document.getElementById("sDescription").value = "";
        //     document.getElementById("sCategory").value = "";
        //     document.getElementById("nLatitude").value = "";
        //     document.getElementById("nLongitude").value = "";
        //     getPointsOfInterest();
        // }
    });
    }

function getPointsOfInterest() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3001/getData',
        success: function(data) {
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
    };



