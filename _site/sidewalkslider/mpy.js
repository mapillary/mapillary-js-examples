var mly = new Mapillary.Viewer(
    'mly',
    'cjJ1SUtVOEMtdy11b21JM0tyYTZIQTo2ZmVjNTQ3YWQ0OWI2Yjgx',
    'tJZWhjD_55y4bH9r8q2XiQ',
    {
        "cover": false,
        "cache": false,
        "imageplane": false,
        "direction": false,
        "sequence": false,
        "mouse": false,
        "keyboard": false,
        "slider": {
            keys: {
                background: 'DkZk8kn8j5FCa-h6llsMDA',
                foreground: 'tJZWhjD_55y4bH9r8q2XiQ',
            }
        },
        "maxImageSize": Mapillary.ImageSize.Size640,
    });

mly.setRenderMode(Mapillary.RenderMode.Fill);
