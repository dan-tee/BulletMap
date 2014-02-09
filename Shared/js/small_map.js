function createSmallMap(){
    if (window.small_map && window.small_map instanceof OpenLayers.Map){
        return;
    }

    small_map = createMap('small-map');
    small_map.on('click', onMapClick);
}

function onMapClick(e){
    var latlng = e.latlng;
    writeLocationToUi(latlng);
    setMarker(latlng);
}

function writeLocationToUi(latlng){
    $("#latitude").val(latlng.lat);
    $("#longitude").val(latlng.lng);
}

function setMarker(latlng){
    if (!marker){
        marker = L.marker(latlng, {draggable: 'true'}).addTo(small_map);
    }

    marker.setLatLng(latlng);
}

var marker;
var small_map;
$(document).on('pageshow', '#bullet-search', createSmallMap);