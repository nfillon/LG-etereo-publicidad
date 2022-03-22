define(
    "homeapp/appui/datasources/restaurantoptions",
    [
        "antie/class"
    ],
    function(Class) {

        return Class.extend({
            loadData : function(callbacks) {
                // console.log(callbacks);
                callbacks.onSuccess([
                    {
                        'id': 'Room Service',
                        'name': 'Room Service',
                        'fn': 'getTables',
                        'image': 'static/img/channels/26-adn40.png',
                        'description': 'La mejor manera de descansar en tu habitación con una deliciosa comida ligera y saludable llevada directamente a tu puerta'
                    },{
                        'id': 'Café Reforma',
                        'name': 'Café Reforma',
                        'fn': 'goToRoomService',
                        'image': 'static/img/channels/26-adn40.png',
                        'description': 'Fiesta Americana Reforma Restaurante Mexicano, Propuesta Gastronómica del reconocido Chef Gerardo Rivera ,' +
                        ' Un espacio diseñado para consentirte en una de las avenidas más reconocidas y hermosas en el corazón de la CDMX.'
                    },{
                        'id': 'La Distral',
                        'name': 'La Distral',
                        'fn': 'goToRoomService',
                        'image': 'static/img/channels/26-adn40.png',
                        'description': 'Café Reforma Ubicado en el interior del Hotel FIESTA AMERICANA REFORMA ofrece servicio de Buffet, Brunch Dominical,' +
                        ' a la carta y Buffets temáticos los cuales cuentan con una estación para preparación de platillos especiales donde su vista será el primer sentido en deleitarse. Disfrute de una excelente comida nacional e internacional bajo un agradable ambiente familiar. En los desayunos tenemos un variado buffet y para comida o cena, usted podrá ordenar a la carta todos los días.'
                    }
                ]);
            }
        });
    });
