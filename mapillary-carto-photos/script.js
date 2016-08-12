var imageKeys = [];
var geojson = {
    "type": "FeatureCollection",
    "features": []
};
var CLIENT_ID = "TVBudDVxUkNVVU5BZFQ5QmpKZVlndzoxMjE3N2VmOTE2YzU4OTNj";


$(document).ready(function() {

    $('#add-image').click(function() {
        $('#imgList').append('<br><input type=\"text\" class=\"image-key\" placeholder=\"Image Key\"><br>');
    });

    $('#geojson').click(function() {
        generateGeoJSON(this);
    });
});


function generateGeoJSON(link) {
    $('.image-key').each(function() {
        if ($(this).val().length == 22) {
            imageKeys.push($(this).val());
        } else {
            alert("Make sure all your image keys are correct.");
        }
    });

    for (var i = 0; i < imageKeys.length; i++) {
        var pathAppend = '/v2/im/' + imageKeys[i] + '?client_id=' + CLIENT_ID;
        var host = 'https://a.mapillary.com';

        $.ajax({
            url: host + pathAppend,
            type: 'GET',
            crossDomain: true,
            dataType: 'json'
        }).success(function(data) {
            geojson.features.push({
                "geometry": {
                    "type": "Point",
                    "coordinates": [data.lon, data.lat]
                },
                "properties": {
                    "image": "https://d1cuyjsrcm0gby.cloudfront.net/" + data.key + "/thumb-2048.jpg"
                }
            });
            if (i == imageKeys.length) {
                var element = document.createElement('a');
                element.setAttribute('href', "data:text/plain;charset=UTF-8," + encodeURIComponent(JSON.stringify(geojson)));
                element.setAttribute('download', "carto.json");
                $("body").append(element);
                element.click();
                $(document).removeChild(element);
            }
        });
    }
}
