var map = L.map('map').setView([37.75, -122.23], 10)
L.esri.basemapLayer("Topographic").addTo(map)

var marker;

var latLon = [41.27720019822714, -73.73723825429111]

map.setView(latLon, 15)
marker = L.marker({
    lat: latLon[0],
    lon: latLon[1],
    zIndex: 1000
});

marker.addTo(map);

var mly = new Mapillary.Viewer('mly',
                               'cjJ1SUtVOEMtdy11b21JM0tyYTZIQTo2ZmVjNTQ3YWQ0OWI2Yjgx',
                               '6RU1eOMyUy9XDRJ_87esEA', {cover: false});
mly.setRenderMode(Mapillary.RenderMode.Fill);

var trails = new L.GeoJSON.AJAX("trails.geojson");
trails.addTo(map);

mly.on('nodechanged', function (node) {
    if (!marker) {
        marker = L.marker(node.latLon).addTo(map)
    } else {
        marker.setLatLng(node.latLon)
    }
});

map.on('click', function (e) {
    mly.moveCloseTo(e.latlng.lat, e.latlng.lng);
});
