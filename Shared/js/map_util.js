// Without JavaScript only a message is shown, but all content is hidden.
// Here we use JavaScript to show the content.
$('[date-role="page"]').css({display: 'block'});

function createMap(divId){
    var map = L.map(divId);
    //var osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    //var osmAttrib='Map data © OpenStreetMap contributors';
    //var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
    map.setView(new L.LatLng(51.3, 0.7),2);
    map.addLayer(MQ.mapLayer());
    return map;
}
