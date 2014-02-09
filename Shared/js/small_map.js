function createSmallMap(){
    if (window.small_map && window.small_map instanceof OpenLayers.Map){
        return;
    }

    small_map = createMap('small-map');
}

var small_map;
$(document).on('pageshow', '#bullet-search', createSmallMap);