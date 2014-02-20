function requestDataAndMark(){
    var url = server+"/found_shells";
    $.getJSON(url, markFoundBullets);
}

function markFoundBullets(findingsByCountries){
    // evenly distribute countries on the color circle
    var hueFraction = 360 / findingsByCountries.length;

    for(var i = 0; i < findingsByCountries.length; i++){
        var colorString = "hsv(" + hueFraction * i + ", 50%, 50%)";
        var color = tinycolor(colorString).toHexString();
        addLegendItem(color, findingsByCountries[i].Origin)
        paintForCountry(color, findingsByCountries[i]);
    }
}

function addLegendItem(color, origin){
    $("#legend ul").append('<li><font color="' + color + '">' + origin + "</font></li>")
}

function paintForCountry(color, findings){
    findings.Locations.forEach(function(location){
        L.circleMarker([location.Latitude, location.Longitude], {
            color: color,
            radius: 8,
            fillOpacity: 0.5
        }).addTo(map);
    });
}

function createAndMarkMap(){
    if (window.map && window.map instanceof L.Map){
        return;
    }

    map = createMap('map');
    requestDataAndMark();
}

var map;
$(document).on('pageshow', '#bullet-map', createAndMarkMap);




