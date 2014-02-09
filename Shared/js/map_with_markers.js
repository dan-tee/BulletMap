function requestDataAndMark(){
    var url = "/test/bulletMap.json";
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
    if (window.map && window.map instanceof OpenLayers.Map){
        return;
    }

    map = L.map('map')
    var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © OpenStreetMap contributors';
    var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
    map.setView(new L.LatLng(51.3, 0.7),2);
    map.addLayer(osm);

    requestDataAndMark();
}

var map;
$(document).on('pageshow', '#bullet-map', createAndMarkMap);




