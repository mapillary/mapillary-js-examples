var CLIENT_ID = 'c2tuaFJiMHdTN3dleXRrWF9KMExYZzpjZmJmZTY5ZjExYTg5OWY5';
var json = {};
$(document).ready(function() {

    $("#functions a").click(function() {
        goToInstructions();
    });

    $("#add-iframes").click(function() {
        var j = JSON.parse($("#geojson-input").val());
        for (var feature in j.features) {
            lon = j.features[feature].geometry.coordinates[0];
            lat = j.features[feature].geometry.coordinates[1];
            var requestString = "https:\/\/a.mapillary.com\/v2\/search\/im\/close?client_id=" +
                CLIENT_ID +
                "&lat=" + lat +
                "&limit=1&lon=" + lon;
            doAjax(feature);
        }

        function doAjax(feature) {
            $.ajax({
                "url": requestString,
                "crossDomain": true,
                "success": function(data) {
                    setJ(feature, data.ims[0].key);
                }
            });
        }

        function setJ(feature, key) {
            if (!j.features[feature].properties) {
                j.features[feature].properties = {}
            }
            j.features[feature].properties.mapillary_fill = "http:\/\/mapillary.github.io\/mapillary-js-examples\/fill\/?key=" + key;
            j = j;
            json = j;
            createDownloadLink("#export", JSON.stringify(json), "mapillary.geojson");
        }
    });
});

function createDownloadLink(anchorSelector, str, fileName) {
    if (window.navigator.msSaveOrOpenBlob) {
        var fileData = [str];
        blobObject = new Blob(fileData);
        $(anchorSelector).click(function() {
            window.navigator.msSaveOrOpenBlob(blobObject, fileName);
        });
    } else {
        var url = "data:text/plain;charset=utf-8," + encodeURIComponent(str);
        $(anchorSelector).attr("download", fileName);
        $(anchorSelector).attr("href", url);
    }
    $("#functions a").show();
}

function goToInstructions() {
    $("#functions").fadeOut("slow");
    $("#geojson-input").fadeOut("slow");
    $("#instructions").fadeIn("slow");
    $("#title h2").text("Follow the instructions below.");
    $("#done-button").click(function() {
        renderHtml()
    });
    $("#instructions a").hide();
    $("#cartolink").show();
}


function renderHtml() {
    var htmlString1 = "<DOCTYPE html>\r\n<html>\r\n  <head>\r\n    <title>Mapillary Image<\/title>\r\n    <meta name=\"viewport\" content=\"width=device-width, minimum-scale=0.1\">\r\n    <style>\r\n      html, body, #map {\r\n        height: 100%;\r\n        padding: 0;\r\n        margin: 0;\r\n\t}\r\n      div.cartodb-popup.header.v2.header{\r\n\twidth:320px !important;\r\n\t}\r\n      .leaflet-container a {\r\n    \tcolor: #fff !important:;\r\n\ttext-decoration: none;\r\n\t}\r\n    <\/style>\r\n    <link rel=\"stylesheet\" href=\"http:\/\/libs.cartodb.com\/cartodb.js\/v3\/3.15\/themes\/css\/cartodb.css\" \/>\r\n  <\/head>\r\n  <body>\r\n    <div id=\"map\"><\/div>\r\n\r\n    <script type=\"infowindow\/html\" id=\"infowindow_template\">\r\n        <div class=\"cartodb-popup header green v2\" style=\"width:360px !important;\">\r\n          <a href=\"#close\" class=\"cartodb-popup-close-button close\">x<\/a>\r\n          <div class=\"cartodb-popup-header\">\r\n            <h1><a href={{profile_url}} target=\"_blank\">{{name}}<\/a><\/h1>\r\n          <\/div>\r\n          <div class=\"cartodb-popup-content-wrapper\">\r\n                <div class=\"cartodb-popup-content\">\r\n              <p><iframe src={{mapillary_fill}}><\/iframe><\/p>\r\n\t      <h4><a href={{mapillary_url}} target=\"_blank\">Full screen<\/a><\/h4>\r\n            <\/div>\r\n          <\/div>\r\n          <div class=\"cartodb-popup-tip-container\">\r\n          <\/div>\r\n        <\/div>\r\n    <\/script>\r\n\r\n    <script src=\"http:\/\/libs.cartodb.com\/cartodb.js\/v3\/3.15\/cartodb.js\"><\/script>\r\n\r\n    <script>\r\n      function main() {\r\n        cartodb.createVis(map, \'"
    var htmlString2 = "\')\r\n         .on(\'done\', function(vis,layers) {\r\n           \/\/ get sublayer 0 and set the infowindow template\r\n           var sublayer = layers[1].getSubLayer(0);\r\n\r\n           sublayer.infowindow.set(\'sanitizeTemplate\',false);\r\n\r\n           sublayer.infowindow.set(\'template\', $(\'#infowindow_template\').html());\r\n          }).on(\'error\', function() {\r\n            console.log(\"some error occurred\");\r\n          });\r\n      }\r\n\r\n      window.onload = main;\r\n    <\/script>\r\n  <\/body>\r\n<\/html>\r\n"
    var finalHtml = htmlString1 + $("#cartojslink").val() + htmlString2;
    createDownloadLink("#downloadhtml", finalHtml, "index.html")
    $("#instructions a").show();
}
