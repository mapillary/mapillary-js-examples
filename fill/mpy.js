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
