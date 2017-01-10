$(function() {

    // Initiate mapbox-gl
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2JlZGRvdyIsImEiOiI5Q09YRG1RIn0.Izu6OPJ4CEEaSSpGuys3Xg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [-82.69965,41.60116],
        zoom: 12
    });

    // Add mapbox-gl navigation
    var nav = new mapboxgl.Navigation({position: 'top-left'}); // position is optional
    map.addControl(nav);

    // When map is loaded add parcel layer
    map.on('load', function () {
        map.addSource('parcels', {
            'type': 'geojson',
            'data': 'https://gist.githubusercontent.com/cbeddow/0bb1a957326cab0aec649e0dea3b978d/raw/069f1695034d9aac75c412c12d572122e500109b/kelleys_island.geojson'
        });

        map.addControl(new mapboxgl.Navigation());

        // Add a layer showing the parcel polygons.
        map.addLayer({
            'id': 'parcels-layer',
            'type': 'fill',
            'source': 'parcels',
            'paint': {
                'fill-color': 'rgba(200, 100, 240, 0.4)',
                'fill-outline-color': 'rgba(200, 100, 240, 1)'
            }
        });
    });

    var mly = new Mapillary.Viewer(
        "mly",
        "UTZhSnNFdGpxSEFFREUwb01GYzlXZzpkMWM2YzdjYjQxN2FhM2Vh",
        null,
        {
            component: {
                attribution: false,
                cover: false,
                direction: {
                    distinguishSequence: true,
                    maxWidth: 460,
                    minWidth: 180
                },
                imagePlane: {
                    imageTiling: true
                },
                stats: true
            },
            renderMode: Mapillary.RenderMode.Fill
        }
    );
    $("#mly-wrapper").hide();

    $("#mly-back-button").click(function() {
        $("#mly-wrapper").hide();
        $("#image-list").show();
    });

    var update_image_list = function(data) {
        // mapbox-gl will throw en error here first time since layers does not exist
        try {
            map.removeLayer("points");
            map.removeLayer("points-active");
            map.removeSource("points");
        } catch (err) {
            // Do nothing the layers just does not exists
        }

        map.addSource('points', { type: 'geojson', data: data });

        map.addLayer({
            "id": "points",
            "type": "circle",
            "source": "points",
            "paint": {
                "circle-color": "#32c987",
                "circle-opacity": 1
            }
        });

        map.addLayer({
            "id": "points-active",
            "type": "circle",
            "source": "points",
            "paint": {
                "circle-color": "#f00",
                "circle-opacity": 1
            },
            "filter": ["==", "image", ""]
        });

        var el = $("#image-list");
        el.empty();

        el.append("<h3>Images looking at parcel</h3>");

        data.features.forEach( function(feature, i) {
            var row_name = "image-list-row-" + Math.floor(i / 3);
            var image_key = feature.properties.key;

            if (i % 3 == 0) {
                el.append($("<div class='row' id='" + row_name + "'></div>"));
            }

            var image_el = $("<div class='four columns'></div>")

            image_el.append($(
                "<img src=https://d1cuyjsrcm0gby.cloudfront.net/" + image_key + "/thumb-320.jpg style='cursor:pointer;max-width:100%;max-height:100%'>"
            ));

            image_el.click(function(event) {
                $("#mly-wrapper").show();
                $("#image-list").hide();
                mly.moveToKey(image_key);
            });

            image_el.hover(
                function() {
                    map.setFilter("points-active", ["==", "image", image_key]);
                    console.log("IN", image_key);
                },
                function() {
                    map.setFilter("points-active", ["==", "image", ""]);
                    console.log("OUT", image_key);
                }
            );

            $("#" + row_name).append(image_el);
        });

    };

    // When a click event occurs on a polygon, open a popup at the location of
    // the feature, with description HTML from its properties.
    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['parcels-layer'] });

        if (!features.length) {
            return;
        };

        // Get the first avialble feature and assume thats the one thats clicked
        var feature = features[0];

        var radius = ((feature.properties.road_dist + 15) * 5);
        var lng = feature.properties.longitude
        var lat = feature.properties.latitude;

        // Move map to position
        map.flyTo({
            center: [lng, lat],
            zoom: 17,
        });

        var url ="https://a.mapillary.com/v3/images?lookat="+ lng + "," + lat + "&radius" + radius + "&client_id=MkJKbDA0bnZuZlcxeTJHTmFqN3g1dzplMGFjODhmMzBjNjNiOWZi"
        $.ajax({
            dataType: "json",
            url: url,
            success: update_image_list
        });

        var popup = new mapboxgl.Popup()
            .setLngLat(map.unproject(e.point))
            .setHTML("TaxID: " + feature.properties.TaxIDNum)
            .addTo(map);
    });

    // Indicate that the parcels are clickable by changing the cursor style
    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['parcels-layer'] });
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });
});
