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
    var vectorLayer = new OpenLayers.Layer.Vector(findings.Origin);
    var style = {
        strokeColor: color,
        strokeWidth: 10,
        pointRadius: 1
    };

    findings.Locations.forEach(function(location){
        var point = new OpenLayers.Geometry.Point(location.Longitude, location.Lattitude);
        var feature = new OpenLayers.Feature.Vector(
            point,
            null,
            style);
        vectorLayer.addFeatures(feature);
    });

    map.addLayer(vectorLayer);
}

var map = new OpenLayers.Map('map', { controls: [new OpenLayers.Control.PanZoom()] });
var wms = new OpenLayers.Layer.WMS( "OpenLayers WMS",
    "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'}, {'displayInLayerSwitcher':false} );
map.addLayer(wms);

var panel = new OpenLayers.Control.NavToolbar({'div':OpenLayers.Util.getElement('paneldiv')});
map.addControl(panel);
//map.addControl(new OpenLayers.Control.LayerSwitcher({'div':OpenLayers.Util.getElement('layerswitcher')}));

// map.zoomToMaxExtent();
requestDataAndMark();




