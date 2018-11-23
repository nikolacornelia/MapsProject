async function onMapLoad(e) {
    getLocalPointsOfInterest();  
  }
  
  function getLocalPointsOfInterest() {
    //only get points that are in the bounds of the map
    oBorder = {};
    oBorder.dMaxLong = map.getBounds().getEast();
    oBorder.dMinLong = map.getBounds().getWest();
    oBorder.dMaxLat = map.getBounds().getNorth();
    oBorder. dMinLat = map.getBounds().getSouth();
    $.ajax({
       type: 'GET',
        url: 'http://localhost:3001/getLocalPoints',
        dataType: "json",
        data: {border: oBorder},
        success: function(data) {
            console.log("success");
            displayPoints(data);
        },
        error: function(err) {
           console.log(err);
        }
    });
  }
  
  
  
  function displayPoints(arrayPoints) {
    for (let i in arrayPoints) {
        let mark = L.marker([
            parseFloat(arrayPoints[i].latitude),
            parseFloat(arrayPoints[i].longitude)], {title: arrayPoints[i].name}
          );
        mark.addTo(map);
        console.log(arrayPoints[i]);
    }}