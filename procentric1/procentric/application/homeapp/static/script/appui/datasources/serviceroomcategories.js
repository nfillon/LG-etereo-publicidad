define(
    "homeapp/appui/datasources/serviceroomcategories",
    [
        "antie/class",
        "homeapp/appui/i18n"
    ],
    function(Class, I18n) {
        'use strict';

        var _categories = {
            es: [
                /*
                { id: 'WAKE UP', image: '' },
                { id: 'HUEVOS Y OMELET', image: '' },
                { id: 'ESPECIALIDADES PARA DESAYUNO', image: '' },
                { id: 'PARA NIÑOS', image: '' },
                { id: 'ENSALADAS Y SOPAS', image: '' },
                { id: 'SÁNDWICHES Y ALIMENTOS LIGHT', image: '' },
                { id: 'PIZZAS', image: '' },
                { id: 'CARNE, PASTA Y POLLO', image: '' },
                { id: 'POSTRES', image: '' },
                { id: 'BEBIDAS', image: '' }
                */
                /*
                { id: 'Desayuno', image: '' },
                { id: 'Comida Y Almuerzo', image: '' },
                { id: 'Late Night', image: '' }
                */
                { "id": "bebidasdes", "image": "BebidasDesayunos.jpg", "name": "Bebidas Desayuno" }, 
                { "id": "ligeros", "image": "Ligeros.jpg", "name": "Ligeros" }, 
                { "id": "huevos", "image": "Huevos.jpg", "name": "Huevos" }, 
                { "id": "especialidades", "image": "Especialidades.jpg", "name": "Especialidades" }, 
                { "id": "pan", "image": "Pan.jpg", "name": "Pan" }, 
                { "id": "sandwiches", "image": "Sandwiches.jpg", "name": "Sandwiches" }, 
                { "id": "entradas", "image": "Entradas.jpg", "name": "Entradas" }, 
                { "id": "sopas", "image": "Sopas.jpg", "name": "Sopas" }, 
                { "id": "ensaladas", "image": "Ensaladas.jpg", "name": "Ensaladas" }, 
                { "id": "pastas", "image": "Pastas.jpg", "name": "Pastas" }, 
                { "id": "carnes", "image": "Sopas.jpg", "name": "Carnes" }, 
                { "id": "aves", "image": "Aves.jpg", "name": "Aves" }, 
                { "id": "pescados", "image": "Pescados.jpg", "name": "Pescados" }, 
                { "id": "sandyhamb", "image": "SandwichesHamburguesas.jpg", "name": "Sandwiches & Hamburguesas" }, 
                { "id": "postres", "image": "Postres.jpg", "name": "Postres" }, 
                { "id": "bebidas", "image": "Bebidas.jpg", "name": "Bebidas" }, 
                { "id": "bebcervezas", "image": "Cervezas.jpg", "name": "Bebidas | Cervezas" }, 
                { "id": "bebron", "image": "Ron.jpg", "name": "Bebidas | Ron" }, 
                { "id": "bebbrandy", "image": "Brandy.jpg", "name": "Bebidas | Brandy" }, 
                { "id": "bebtequila", "image": "Tequila.jpg", "name": "Bebidas | Tequila" }, 
                { "id": "bebmezcal", "image": "Mezcal.jpg", "name": "Bebidas | Mezcal" }, 
                { "id": "bebcognac", "image": "Cognac.jpg", "name": "Bebidas | Cognac" }, 
                { "id": "bebwhisky", "image": "Whisky.jpg", "name": "Bebidas | Whisky" }, 
                { "id": "bebvodka", "image": "Vodka.jpg", "name": "Bebidas | Vodka" }, 
                { "id": "bebginebra", "image": "Ginebra.jpg", "name": "Bebidas | Ginebra" }, 
                { "id": "beblicoresycremas", "image": "LicoresCremas.jpg", "name": "Bebidas | Licores y Cremas" }, 
                { "id": "bebchampagne", "image": "Champana.jpg", "name": "Bebidas | Champagne" }, 
                { "id": "bebvinostintos", "image": "VinoTinto.jpg", "name": "Bebidas | Vinos Tintos" }, 
                { "id": "bebvinosblancos", "image": "VinosBlancos.jpg", "name": "Bebidas | Vinos Blancos" }, 
                { "id": "bebvinosrosados", "image": "VinosRosados.jpg", "name": "Bebidas | Vinos Rosados" }             
            ],
            en: [
                /*
                { id: 'WAKE UP', image: '' },
                { id: 'EGGS AND OMELETTE', image: '' },
                { id: 'BREAKFAST SPECIALTIES', image: '' },
                { id: 'FOR CHILDREN', image: '' },
                { id: 'SALADS AND SOUPS', image: '' },
                { id: 'SANDWICHES AND LIGHT MEALS', image: '' },
                { id: 'PIZZAS', image: '' },
                { id: 'MEAT, CHICKEN AND PASTA', image: '' },
                { id: 'DESSERTS', image: '' },
                { id: 'BEVERAGES', image: '' }
                */
                /*
                { id: 'Breakfast', image: '' },
                { id: 'Lunch And Dinner', image: '' },
                { id: 'Late Night', image: '' }
                */
                { "id": "bebidasdes", "image": "BebidasDesayunos.jpg", "name": "Breakfast Beverages" },
                { "id": "ligeros", "image": "Ligeros.jpg", "name": "Lights" },
                { "id": "huevos", "image": "Huevos.jpg", "name": "Eggs" },
                { "id": "especialidades", "image": "Especialidades.jpg", "name": "Specialties" },
                { "id": "pan", "image": "Pan.jpg", "name": "Bread" },
                { "id": "sandwiches", "image": "Sandwiches.jpg", "name": "Sandwiches" },
                { "id": "entradas", "image": "Entradas.jpg", "name": "Starters" },
                { "id": "sopas", "image": "Sopas.jpg", "name": "Soups" },
                { "id": "ensaladas", "image": "Ensaladas.jpg", "name": "Salads" },
                { "id": "pastas", "image": "Pastas.jpg", "name": "Pasta" },
                { "id": "carnes", "image": "Sopas.jpg", "name": "Meats" },
                { "id": "aves", "image": "Aves.jpg", "name": "Poultry" },
                { "id": "pescados", "image": "Pescados.jpg", "name": "Fish" },
                { "id": "sandyhamb", "image": "SandwichesHamburguesas.jpg", "name": "Sandwiches & Burgers" },
                { "id": "postres", "image": "Postres.jpg", "name": "Desserts" },
                { "id": "bebidas", "image": "Bebidas.jpg", "name": "Beverage" },
                { "id": "bebcervezas", "image": "Cervezas.jpg", "name": "Beverage | Beers" },
                { "id": "bebron", "image": "Ron.jpg", "name": "Beverage | Rum" },
                { "id": "bebbrandy", "image": "Brandy.jpg", "name": "Beverage | Brandy" },
                { "id": "bebtequila", "image": "Tequila.jpg", "name": "Beverage | Tequila" },
                { "id": "bebmezcal", "image": "Mezcal.jpg", "name": "Beverage | Mezcal" },
                { "id": "bebcognac", "image": "Cognac.jpg", "name": "Beverage | Cognac" },
                { "id": "bebwhisky", "image": "Whisky.jpg", "name": "Beverage | Whisky" },
                { "id": "bebvodka", "image": "Vodka.jpg", "name": "Beverage | Vodka" },
                { "id": "bebginebra", "image": "Ginebra.jpg", "name": "Beverage | Gin" },
                { "id": "beblicoresycremas", "image": "LicoresCremas.jpg", "name": "Beverage | Liquors and Creams" },
                { "id": "bebchampagne", "image": "Champana.jpg", "name": "Beverage | Champagne" },
                { "id": "bebvinostintos", "image": "VinoTinto.jpg", "name": "Beverage | Red Wines" },
                { "id": "bebvinosblancos", "image": "VinosBlancos.jpg", "name": "Beverage | White Wines" },
                { "id": "bebvinosrosados", "image": "VinosRosados.jpg", "name": "Beverage | Rosé Wines" }
            ]
        };




        return {
            getAll: function() {
                var currentLanguageCode = I18n.getCurrentLanguageCode();
                currentLanguageCode = ['en', 'es'].indexOf(currentLanguageCode) >= 0 ? currentLanguageCode : 'en';
                return _categories[currentLanguageCode];
            }
        }

    });
