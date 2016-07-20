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
var CLIENT_ID = 'c2tuaFJiMHdTN3dleXRrWF9KMExYZzpjZmJmZTY5ZjExYTg5OWY5';
var lat, lon, width;

if (params.lat && params.lon) {
    lat = params.lat;
    lon = params.lon;
    width = params.width;
}

var requestString = "https:\/\/a.mapillary.com\/v2\/search\/im\/close?client_id="
+ CLIENT_ID
+ "&lat=" + params.lat
+ "&limit=1&lon=" + params.lon;

$.ajax({
  url: requestString ,
  crossDomain: true
}).done(function(data ) {
  $('body').append("<img id\=\"image\" src=\"" + "https:\/\/d1cuyjsrcm0gby.cloudfront.net\/" +  data.ims[0].key + "/thumb-2048.jpg" + "\">") ;
  $("#image").width(params.width)
});
