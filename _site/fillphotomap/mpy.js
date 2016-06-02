function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

var params = getSearchParameters();

var key = 'NwHRc_WkIkPHbCAJohIlZA';

if (params.key) {
    key = params.key;
}

var mly = new Mapillary.Viewer(
    'mly',
    'cjJ1SUtVOEMtdy11b21JM0tyYTZIQTo2ZmVjNTQ3YWQ0OWI2Yjgx',
    key,
    {
        "cover": false,
        "baseImageSize": Mapillary.ImageSize.Size2048,
        "maxImageSize": Mapillary.ImageSize.Size2048,
    });

mly.setRenderMode(Mapillary.RenderMode.Fill);

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwaWxsYXJ5IiwiYSI6ImNpanB0NmN1bDAwOTF2dG03enM3ZHRocDcifQ.Z6wgtnyRBO0TuY3Ak1tVLQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
})

var markerSource = {
    type: 'geojson',
    data: {
        type: 'Feature',
        geometry: {
            type: 'MultiLineString',
            coordinates: []
        }
    }
}

var mapillarySource = {
    type: 'vector',
    tiles: ['https://d2munx5tg0hw47.cloudfront.net/tiles/{z}/{x}/{y}.mapbox'],
    minzoom: 0,
    maxzoom: 16
}

map.on('style.load', function () {
    map.addSource('markers', markerSource)
    map.addLayer({
        id: 'markers',
        type: 'symbol',
        source: 'markers',
        layout: {
            'icon-image': '{marker-symbol}-15',
            'text-field': '{title}',
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top'
        },
        paint: {
            'text-size': 12
        }
    })

    map.addSource('mapillary', mapillarySource)
    map.addLayer({
        'id': 'mapillary',
        'type': 'line',
        'source': 'mapillary',
        'source-layer': 'mapillary-sequences',
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-opacity': 0.6,
            'line-color':   'rgb(53, 175, 109)',
            'line-width':   2
        }
    }, 'markers')

})

mly.on('nodechanged', function (node) {
    var lnglat = [node.latLon.lon, node.latLon.lat]
    var tempSource = new mapboxgl.GeoJSONSource({
        data: {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: lnglat
            },
            properties: {
                title: 'You\'re here!',
                'marker-symbol': 'marker'
            }
        }
    })
    map.getSource('markers').setData(tempSource._data)
    map.jumpTo({center: lnglat, zoom: 15})
})
