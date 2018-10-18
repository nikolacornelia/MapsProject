
function newPointOfInterest() {
    let oPoint = {};
    oPoint.name = document.getElementById("sName").value;
    oPoint.description = document.getElementById("sDescription").value;
    oPoint.category = document.getElementById("sCategory").value;
    oPoint.latitude= document.getElementById("nLatitude").value;
    oPoint.longitude = document.getElementById("nLongitude").value; 
    jsonPoint = JSON.stringify(oPoint);
    //console.log(jsonPoint);
      $.ajax({
        type: 'POST',
        data: {point: jsonPoint},
        datatype: 'json',
        url: '/test',						
        success: function(data) {
            alert('data inserted in database');
        }
    });
    }

