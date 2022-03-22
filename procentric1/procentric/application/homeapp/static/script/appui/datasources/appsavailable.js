define(
    "homeapp/appui/datasources/appsavailable",
    [
        "antie/class"
    ],
    function(Class) {
        return Class.extend({
            loadData : function(callbacks) {
                // console.log(callbacks);
                callbacks.onSuccess([
                    {
                        // 'title': '/__icon__/10_accuweather_80x80.png',
                        'img': 'static/img/channels/26-adn40.png',
                        'name': 'Accuweather',
                        'id': 'accuweather',
                        'background': "bgHotelInfo",
                        'content': '<h1>Accuweather</h1>' +
                        '<p>AccuWeather Inc. es una compañía de medios estadounidense que ofrece servicios comerciales de pronóstico del tiempo en todo el mundo. </p>'
                    },{
                        // 'title': '/__icon__/11_webbrowser_80x80.png',
                        'img': 'static/img/channels/15-forotv.png',
                        'name': 'Nk-Browser',
                        'id': 'com.webos.app.browser',
                        'background': "bgHotelInfo",
                        'content': '<h1>Nk-Browser</h1>' +
                        '<p>app description Nk-Browser</p>' +
                        '<p>app description Nk-Browser</p>' +
                        '<p>app description Nk-Browser</p>' +
                        '<p>app description Nk-Browser</p>'
                    },{
                        // 'title': '/__icon__/9_googlemaps_80x80.png',
                        'img': 'static/img/channels/18-canal-del-congreso.png',
                        'name': 'guestcast',
                        'id': 'com.nimbus.app',
                        'background': "bgHotelInfo",
                        'content': '<h1>guestcast</h1>' +
                        '<p>app description Google Maps</p>' +
                        '<p>app description Google Maps</p>' +
                        '<p>app description Google Maps</p>' +
                        '<p>app description Google Maps</p>'
                    },{
                        // 'title': '/__icon__/6_arirang_tv_80x80.png',
                        'img': 'static/img/channels/20-tv-unam.png',
                        'name': 'my stay',
                        'id': 'com.nimbus.app',
                        'background': "bgHotelInfo",
                        'content': '<h1>my stay</h1>' +
                        '<p>app description Arirang TV</p>' +
                        '<p>app description Arirang TV</p>' +
                        '<p>app description Arirang TV</p>' +
                        '<p>app description Arirang TV</p>'
                    },{
                        // 'title': '/__icon__/7_hulu_80x80.png',
                        'img': 'static/img/channels/21-capital-21.png',
                        'name': 'youtube',
                        'id': 'youtube.leanback.v4',
                        'background': "bgHotelInfo",
                        'content': '<h1>youtube</h1>' +
                        '<p>app description Hulu</p>' +
                        '<p>app description Hulu</p>' +
                        '<p>app description Hulu</p>' +
                        '<p>app description Hulu</p>'
                    }
                ]);
            }
        });
    });