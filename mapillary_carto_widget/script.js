var FEATURE_TYPE;
var mly, map, lastFeature, center;
var sql_statement = "SELECT * FROM " + table;
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwaWxsYXJ5IiwiYSI6ImNpanB0NmN1bDAwOTF2dG03enM3ZHRocDcifQ.Z6wgtnyRBO0TuY3Ak1tVLQ';

$(".loader").show();

$.getJSON('https://' + username +'.carto.com/api/v2/sql?format=GeoJSON&q=' + sql_statement, function(data) {
    TYPE = data.features[0].geometry.type;

    if (TYPE == "MultiLineString" || TYPE == "LineString") {
        center = data.features[0].geometry.coordinates[0][0];
    } else if (TYPE == "Polygon" || TYPE == "MultiPolygon") {
        center = data.features[0].geometry.coordinates[0][0][0];
    } else {
        center = data.features[0].geometry.coordinates;
    }

    instantiateMap(center);

    map.on('load', function() {
        map.flyTo({
            center: center,
            zoom: 17
        })
        $(".loader").hide();
        instantiateViewer();
        mly.moveCloseTo(center);

        $('#map_contents').fadeIn("slow");
        $(".mly-wrapper").hide();
        map.resize();
        mly.resize();
        mly.moveCloseTo(center)

        map.addSource("points", {
            "type": "geojson",
            "data": data
        });

        if (TYPE == "MultiLineString" || TYPE == "LineString") {
            map.addLayer({
                "id": "points",
                "type": "line",
                "source": "points",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "#0080ff",
                    "line-width": 2
                }
            });
        } else if (TYPE == "Polygon" || TYPE == "MultiPolygon") {

            map.addLayer({
                "id": "points",
                "type": "fill",
                "source": "points",
                'paint': {
                    'fill-color': '#0080ff',
                    'fill-opacity': 0.8
                }
            });

        } else {
            map.addLayer({
                "id": "points",
                "type": "circle",
                "source": "points",
                'paint': {
          'circle-radius': {
              'base': 2,
              'stops': [[10, 2], [22, 180]]
          },
          'circle-color':'#ffa500'
        }
            });
        }

        var markerSource = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": center
                },
                "properties": {
                    "title": "You\'re here!",
                    "icon": "marker"
                }
            }]
        }

        map.addSource('markers', {
            type: "geojson",
            data: markerSource
        });

        map.addLayer({
            id: 'markers',
            type: 'symbol',
            source: 'markers',
            layout: {
                'icon-image': '{icon}-15',
                'text-field': '{title}',
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 0.6],
                'text-anchor': 'top',
                "icon-size": 1
            }})

        map.on('click', function(e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: ['points']
            });
            var mapillaryFeatures = map.queryRenderedFeatures(e.point, {
                layers: ['mapillary']
            });

            if (features.length && features[0].geometry.type == "Point") {
                map.flyTo({
                    center: features[0].geometry.coordinates
                });
                lastFeature = [e.lngLat.lat, e.lngLat.lng];
                if($(".mly-wrapper").is(":visible")){
                mly.moveCloseTo(e.lngLat.lat, e.lngLat.lng);
                }

                var descriptionString = "<div id=\"properties\">";
                for (var k in features[0].properties) {
                    if (features[0].properties.hasOwnProperty(k) && k != 'icon' && k != 'cartodb_id') {
                        descriptionString += "<h4>" + k + "<\/h4>" + features[0].properties[k] + "<hr>";
                    }
                }

                descriptionString += "<\/div>";
                $('#properties').empty();
                $('#properties').append("<div id=\"property-description\">" + descriptionString + "<\/div>")

                var popup = new mapboxgl.Popup()
                    .setLngLat(features[0].geometry.coordinates)
                    .setHTML(descriptionString)
                    .addTo(map)
            } else if (features.length && (features[0].geometry.type == "MultiLineString" || features[0].geometry.type == "LineString")) {
                var featureCenter;
                if (features[0].geometry.type == "LineString") {
                    featureCenter = features[0].geometry.coordinates[0]
                } else {
                    featureCenter = features[0].geometry.coordinates[0][0]
                }
                map.flyTo({
                    center: featureCenter
                });
                lastFeature = [e.lngLat.lat, e.lngLat.lng];
                if($(".mly-wrapper").is(":visible")){
                mly.moveCloseTo(e.lngLat.lat, e.lngLat.lng);
                }                var descriptionString = "<div id=\"properties\">";
                for (var k in features[0].properties) {
                    if (features[0].properties.hasOwnProperty(k) && k != 'icon' && k != 'cartodb_id') {
                        descriptionString += "<h4>" + k + "<\/h4>" + features[0].properties[k] + "<hr>";
                    }
                }
                descriptionString += "<\/div>";

                var popup = new mapboxgl.Popup()
                    .setLngLat([e.lngLat.lng, e.lngLat.lat])
                    .setHTML(descriptionString)
                    .addTo(map)
            } else if (features.length && (features[0].geometry.type == "Polygon" || features[0].geometry.type == "MultiPolygon")) {
                console.log(features);
                map.flyTo({
                    center: features[0].geometry.coordinates[0][0]
                });
                lastFeature = [e.lngLat.lat, e.lngLat.lng];
                if($(".mly-wrapper").is(":visible")){
                mly.moveCloseTo(e.lngLat.lat, e.lngLat.lng);
              }
                var descriptionString = "<div id=\"properties\">";
                for (var k in features[0].properties) {
                    if (features[0].properties.hasOwnProperty(k) && k != 'icon' && k != 'cartodb_id') {
                        descriptionString += "<h4>" + k + "<\/h4>" + features[0].properties[k] + "<hr>";
                    }
                }
                descriptionString += "<\/div>";

                var popup = new mapboxgl.Popup()
                    .setLngLat(features[0].geometry.coordinates[0][0])
                    .setHTML(descriptionString)
                    .addTo(map)
            } else if (mapillaryFeatures.length) {
                map.flyTo({
                    center: [e.lngLat.lng, e.lngLat.lat]
                });
                lastFeature = [e.lngLat.lat, e.lngLat.lng];
                if($(".mly-wrapper").is(":visible")){
                mly.moveCloseTo(e.lngLat.lat, e.lngLat.lng);
                }            }
        });
    });
});

function instantiateViewer() {
    mly = new Mapillary
        .Viewer('mly',
            'cjJ1SUtVOEMtdy11b21JM0tyYTZIQTo2ZmVjNTQ3YWQ0OWI2Yjgx', // Replace this with your own ClientID
            '', {
                cover: false,
                renderMode: Mapillary.RenderMode.Fill
            })

    mly.on('nodechanged', function(node) {
        mly.resize();

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
                    'icon': 'marker'
                }
            }
        })
        map.getSource('markers').setData(tempSource._data)
        map.flyTo({
            center: lnglat,
            zoom: 17
        })
    })
}

function instantiateMap(center) {
    map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
        center: center, // starting position
        zoom: 12 // starting zoom,
    })
}

$( document ).ready(function() {
$(".LogoBlack").click(function() {
    $(".LogoBlack").fadeOut("slow");
    $(".mly-wrapper").fadeIn("slow");
    mly.resize();


    var mapillarySource = {
        type: 'vector',
        tiles: ['https://d2munx5tg0hw47.cloudfront.net/tiles/{z}/{x}/{y}.mapbox'],
        minzoom: 0,
        maxzoom: 16
    }
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
            'line-color': 'rgb(53, 175, 109)',
            'line-width': 4
        }
    }, 'markers')
    map.stop()
    map.setZoom(15.5);
    if(lastFeature) {
      mly.moveCloseTo(lastFeature[0], lastFeature[1]);
    } else {
      mly.moveCloseTo(center[1], center[0]);
    }
});

$("#minimize").click(function() {
    $(".LogoBlack").fadeIn("slow");
    $(".mly-wrapper").fadeOut("slow");
    map.removeLayer("mapillary");
    map.removeSource("mapillary");
});

$("#maxamize").click(function() {
      if($('.mly-wrapper').css("height") == "600px") {

          $('.mly-wrapper').css("height", 377 + "px");
          $('.mly-wrapper').css("width", 300 + "px");
          $('.mapillary-js').css("width", 300+ "px");
          $('.mapillary-js').css("height", 319 + "px");
          mly.resize();

      } else {
        $('.mly-wrapper').css("height", 600 + "px");
        $('.mly-wrapper').css("width", 600 + "px");
        $('.mapillary-js').css("width", 600+ "px");
        $('.mapillary-js').css("height", 520 + "px");
        mly.resize();
      }
});

(function($) {
    function startTrigger(e) {
        var $elem = $(this);
        $elem.data('mouseheld_timeout', setTimeout(function() {
            $elem.trigger('mouseheld');
        }, e.data));
    }

    function stopTrigger() {
        var $elem = $(this);
        clearTimeout($elem.data('mouseheld_timeout'));
    }

    var mouseheld = $.event.special.mouseheld = {
        setup: function(data) {
            var $this = $(this);
            $this.bind('mousedown', +data || mouseheld.time, startTrigger);
            $this.bind('mouseleave mouseup', stopTrigger);
        },
        teardown: function() {
            var $this = $(this);
            $this.unbind('mousedown', startTrigger);
            $this.unbind('mouseleave mouseup', stopTrigger);
        },
        time: 200
    };
})($);

$(".mly-wrapper").bind('mouseheld', function(e) {
    $(document).on("mousemove", function(event) {
        var winWidth = $(window).width();
        var winHeight = $(window).height();

        $('.mly-wrapper').css("left", (event.pageX) + "px");
        $('.mly-wrapper').css("bottom", (winHeight - event.pageY - 350) + "px");
        $('.mapillary-js').css("left", ((event.pageX) + 3) + "px");
        $('.mapillary-js').css("bottom", (winHeight - event.pageY - 347) + "px");

        $(document).on("mouseup", function(event) {
            $(document).unbind("mousemove");
        });

    });
})
});
