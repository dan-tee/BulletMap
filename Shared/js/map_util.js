// Without JavaScript only a message is shown, but all content is hidden.
// Here we use JavaScript to show the content.
$('[date-role="page"]').css({display: 'block'});

function createMap(divId){
    var map = L.map(divId);
    map.setView(new L.LatLng(51.3, 0.7),2);
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function (position){
            var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
            map.setView(latlng,14);
        });
    }
    map.addLayer(MQ.mapLayer());
    return map;
}
