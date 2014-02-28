(function(){
    function requestDataAndMark(){
        var url = server+"/found_shells";
        $.getJSON(url, markFoundBullets);
    }

    function removeOldMarks(){
        $("#legend").find("ul").empty();
        markerGroup.clearLayers();
    }

    function markFoundBullets(findingsByCountries){
        removeOldMarks();

        // evenly distribute countries on the color circle
        var hueFraction = 360 / findingsByCountries.length;

        for(var i = 0; i < findingsByCountries.length; i++){
            var colorString = "hsv(" + hueFraction * i + ", 50%, 50%)";
            var color = tinycolor(colorString).toHexString();
            addLegendItem(color, findingsByCountries[i].Origin)
            paintForCountry(color, findingsByCountries[i]);
        }

        markerGroup.addTo(map);
    }

    function addLegendItem(color, origin){
        $("#legend").find("ul").append('<li><font color="' + color + '">' + origin + "</font></li>")
    }

    function paintForCountry(color, findings){
        findings.Locations.forEach(function(location){
            var marker = L.circleMarker([location.Latitude, location.Longitude], {
                color: color,
                radius: 8,
                fillOpacity: 0.5
            });
            markerGroup.addLayer(marker);
        });
    }

    function createAndMarkMap(){
        if (!map || !map instanceof L.Map){
            map = createMap('map');
        }

        requestDataAndMark();
    }

    var map;
    var markerGroup = L.layerGroup();
    $(document).on('pageshow', '#bullet-map', createAndMarkMap);
}());




