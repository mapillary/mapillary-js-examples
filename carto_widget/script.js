var CLIENT_ID = 'c2tuaFJiMHdTN3dleXRrWF9KMExYZzpjZmJmZTY5ZjExYTg5OWY5';
var map, marker, visible;
visible = false;

function main() {
    var sql_statement = "SELECT * FROM " + table;


    $.getJSON('https://' + username + '.carto.com/api/v2/sql?format=GeoJSON&q=' + sql_statement, function(data) {
        TYPE = data.features[0].geometry.type;

        if (TYPE == "MultiLineString" || TYPE == "LineString") {
            center = data.features[0].geometry.coordinates[0][0];
        } else if (TYPE == "Polygon" || TYPE == "MultiPolygon") {
            center = data.features[0].geometry.coordinates[0][0][0];
        } else {
            center = data.features[0].geometry.coordinates;
        }
        console.log(center);
        map = new L.Map('map', {
            center: [center[1], center[0]],
            zoom: 10
        });
        instantiateViewer()

        var cartomap = L.tileLayer('https://dnv9my2eseobd.cloudfront.net/v3/cartodb.map-4xtxp73f/{z}/{x}/{y}.png', {
            attribution: 'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
        }).addTo(map);

        cartodb.createLayer(map, 'https://kingofirony.carto.com/api/v2/viz/537e24f5-817e-485a-951f-04f76abd99cd/viz.json')
            .addTo(map)
            .on('done', function(layer) {
                console.log(layer);

                layer.on('featureClick', function(e, pos, latlng, data) {
                    console.console.log();
                    (latlng);
                });


                layer.setInteraction(true);


                layer.on('error', function(err) {
                    cartodb.log.log('error: ' + err);
                });
            }).on('error', function() {
                cartodb.log.log("some error occurred");
            });



        map.on('click', function(e) {
          if(visible){
            if(!marker) {
              marker = L.marker([51.5, -0.09]).addTo(map);
            }
            var lat = e.latlng.lat;
            var lon = e.latlng.lng;
            var radius = 5000;
            var requestString = "https:\/\/a.mapillary.com\/v2\/search\/im\/close?client_id=" +
                CLIENT_ID +
                "&lat=" + lat +
                "&limit=1&lon=" + lon +
                "&distance=" + radius;
            $.ajax({
                "url": requestString,
                "crossDomain": true,
                "success": function(data) {;
                    if (data.ims.length) {
                        $('.loader').show()
                       marker.setLatLng(L.latLng(data.ims[0].lat, data.ims[0].lon));
                        mly.moveCloseTo(data.ims[0].lat, data.ims[0].lon);
                    }
                }
            });
          }
        });
    });
    var mapillary;

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
            $('.loader').hide()

           var lnglat = [node.latLon.lon, node.latLon.lat]
           marker.setLatLng(L.latLng(node.latLon.lat, node.latLon.lon));

        });
        mly.on('loadingchanged', function(node) {
            $('.loader').hide()

        });
    }

    $(".mly-wrapper").hide();

    var sql_statement = "SELECT * FROM " + table;
    var center;




    $(".LogoBlack").click(function() {
        $(".LogoBlack").fadeOut("slow");
        $(".mly-wrapper").fadeIn("slow");
        mly.resize();

        var mlyVectorLayerConfig = {
            url: 'https://d2munx5tg0hw47.cloudfront.net/tiles/{z}/{x}/{y}.png',
            maxZoom: 18,
        }
        mapillary = L.tileLayer("https://d2munx5tg0hw47.cloudfront.net/tiles/{z}/{x}/{y}.png", mlyVectorLayerConfig);
        map.addLayer(mapillary);
        visible = true;
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

    $("#minimize").click(function() {
        $(".LogoBlack").fadeIn("slow");
        $(".mly-wrapper").fadeOut("slow");
        map.removeLayer(mapillary);
        visible = false;
    });

    $("#maxamize").click(function() {
        if ($('.mly-wrapper').css("height") == "600px") {

            $('.mly-wrapper').css("height", 377 + "px");
            $('.mly-wrapper').css("width", 300 + "px");
            $('.mapillary-js').css("width", 300 + "px");
            $('.mapillary-js').css("height", 319 + "px");
            mly.resize();

        } else {
            $('.mly-wrapper').css("height", 600 + "px");
            $('.mly-wrapper').css("width", 600 + "px");
            $('.mapillary-js').css("width", 600 + "px");
            $('.mapillary-js').css("height", 520 + "px");
            mly.resize();
        }
    });
}
window.onload = main;
