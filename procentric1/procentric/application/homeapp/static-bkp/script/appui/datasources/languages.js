define(
    "homeapp/appui/datasources/languages",
    [
        "antie/class"
    ],
    function(Class) {

        return Class.extend({
            loadData : function(callbacks) {
                // console.log(callbacks);
                callbacks.onSuccess([
                    {
                        'id': 'en'
                    },{
                        'id': 'es'
//                    },{
//                        'id': 'fr'
//                    },{
//                        'id': 'pt'
                    }
                ]);
            }
        });
    });
