define(
    "homeapp/appui/datasources/schedulers",
    [
        "antie/class"
    ],
    function(Class) {

        return Class.extend({
            loadData : function(callbacks) {
                // console.log(callbacks);
                callbacks.onSuccess([
                    {
                        'id': '1',
                        'description': '10:00 hs',
                    },{
                        'id': '2',
                        'description': '11:00 hs',
                    }, {
                        'id': '3',
                        'description': '12:00 hs',
                    },{
                        'id': '4',
                        'description': '13:00 hs',
                    }, {
                        'id': '5',
                        'description': '14:00 hs',
                    },{
                        'id': '6',
                        'description': '15:00 hs',
                    }
                ]);
            }
        });
    });
