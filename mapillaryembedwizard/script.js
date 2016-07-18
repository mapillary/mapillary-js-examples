$(document).ready(function() {
    var NO_MAP = 0;
    var MAPZEN_MAP = 1;
    var MAPBOX_MAP = 2;
    var LEAFLET_MAP = 3;
    var advancedShown = false;

    $('#render').click(function() {
        generateIframeSource()
    });

    $('#show-advanced').click(function() {
        if (advancedShown) {
            $("#advanced").slideUp("slow");
            $('#show-advanced').text("Click for Advanced Settings");
        } else {
            $("#advanced").slideDown("slow");
            $('#show-advanced').text("Click to Hide Advanced Settings");
        }
        advancedShown = !advancedShown;
    });

    $('#close-window').click(function() {
        $("#snippet-box").fadeOut("slow");
    })

    function generateIframeSource() {
        var attribution = $('#attribution').is(':checked');
        var cover = $('#cover').is(':checked');
        var direction = $('#arrows').is(':checked');
        var sequence = $('#sequence').is(':checked');
        var startImage = $('#startImage').val();
        var imgSize = $('#img-size').val();
        var renderMode = $('#render-mode').val();
        var mapType = $('#map-type').val();
        var clientId = $('#clientId').val();

        if (startImage == "") {
            alert("You must pick a start image!")
        } else if (clientId == "") {
            alert("You must enter a Client ID. ")
        } else {
            var source = 'http://mapillary.github.io/mapillary-js-examples/fill2/index.html?' +
                'key=' +
                startImage +
                '&attribution=' +
                attribution +
                "&cover=" +
                cover +
                "&direction=" +
                direction +
                "&renderMode=" +
                renderMode +
                "&sequence=" +
                sequence +
                "&imgSize=" +
                imgSize +
                "&mapType=" +
                mapType +
                "&clientId=" +
                clientId;

            $("#preview").attr("src", source);

            $("#snippet").attr('class', "pure-button");
            $('#snippet').unbind("click");
            $('#snippet').click(function() {
                getCodeSnippet()
            });
        }
    }

    function getCodeSnippet() {
        generateIframeSource()
        var src = $('#preview').attr('src');
        var snippet = '<iframe width=\"560\" height=\"400\" src=\"' + src + '\"><\/iframe>';
        $('#snippet-view').text(snippet).val();
        $("#snippet-box").fadeIn("slow");
    }
});
