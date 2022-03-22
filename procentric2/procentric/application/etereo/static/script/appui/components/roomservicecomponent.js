define(
    "homeapp/appui/components/roomservicecomponent",
    [
        "antie/widgets/component",
        "antie/widgets/container",
        "antie/widgets/label",
        "antie/widgets/button",
        "antie/widgets/horizontallist",
        "antie/widgets/verticallist",
        "homeapp/appui/widgets/i18nlabel",
        "homeapp/appui/datasources/serviceroomcategories",
        "homeapp/appui/datasources/serviceroomproducts",
        "homeapp/appui/datasources/schedulers",
        "homeapp/appui/formatters/schedulersformatter",
        "antie/datasource",
        "antie/widgets/carousel",
        "homeapp/appui/i18n",
        "homeapp/appui/widgetgenerator",
        "antie/widgets/image"
    ],
    function (Component, Container, Label, Button, HorizontalList, VerticalList, LabelI18n, ServiceRoomCategories, ServiceRoomProducts,
              Schedulers, SchedulerFormatter, DataSource, Carousel, I18n, WG, Image) {

        return Component.extend({
            init: function init() {
                var self = this;
                init.base.call(this, "roomservicecomponent");

                this._createContainers();
                //Se mueve al onrender para soportar i18n a nivel categorias
                //this._createCategoriesButtons();

                this.addEventListener("beforerender", function(ev) {
                    self._onBeforeRender(ev);
                });

                this.addEventListener("aftershow", function (evt) {
                });

                this.addEventListener("beforeshow", function(ev) {
                    self.home = ev.args.home;
                    self._onBeforeshow(ev);
                });

                // this.addEventListener('keydown', function(e) {
                //     // Back
                //     WG.log(e.keyCode);
                //     var exit_keys = [461, 458, 457, 602];
                //     if (exit_keys.indexOf(e.keyCode) >= 0) {
                //         hcap.mode.getHcapMode({
                //             "onSuccess" : function(s) {
                //                 if(s.mode === 258){
                //                     WG.log("onSuccess : current hcap mode = " + s.mode);
                //                     if(e.keyCode === 461){
                //                         self.parentWidget.back();
                //                     } else {
                //                         self._backToHome(self);
                //                     }
                //                     if(e.keyCode === 458){ //keycode del boton channel/guide
                //                         WG._onSelectChannelGuideButtonWithPreview(self.home);
                //                     } else if(e.keyCode === 457){ //keycode del boton info
                //                         WG._onSelectHotelInfo(self, e);
                //                     }
                //                 } else {
                //                     service.onKeyDown(e.keyCode);
                //                     self._backToHome(self);
                //                 }
                //             },
                //             "onFailure" : function(f) {
                //                 WG.log("onFailure : errorMessage = " + f.errorMessage);
                //             }
                //         });
                //     }
                // })

                this.addEventListener('keydown', function(e) {
                    // Back para la version de demo, no tiene pantallas intermedias
                    WG.log("keydown : " + e.keyCode);
                    var exit_keys = [461, 458, 602];
                    if (exit_keys.indexOf(e.keyCode) >= 0) {
                        self.parentWidget.back();
                        self.home.focus();
                        self.home._sliderContainer.show(e);
                        // self.home._hcapStart(); POR EL MOMENTO SE COMENTA, DESCPUES HAY QUE USAR WG Y SU VARIABLE PARA SABER SI HAY O NO MEDIA PLAYER
                        if(ev.keyCode === 458){ //keycode del boton channel/guide
                            WG._onSelectChannelGuideButtonWithPreview(self.home);
                        } else if(e.keyCode === 457){ //keycode del boton info
                            WG._onSelectHotelInfo(self, e);
                        }

                    }
                })
            },

            _backToHome: function(parent) {
                parent.parentWidget.back();
                parent.home.parentWidget.back();
            },

            _createContainers: function() {
                this._roomServicesContainer = new Container("roomServices");
                this._horizontalList = new HorizontalList("roomServiceContainer");
                this._categoriesList = new VerticalList("categories");
                this._contactlessRoomServiceContainer = new Container("contactlessRoomService");
                //Se mueve al onrender para soportar i18n a nivel categorias
                //this._categoriesList.appendChildWidget(new LabelI18n(I18n.translate('categories')));
                this._productsList = new VerticalList("products");
                this._descriptionContainer = new VerticalList("description");
                // this._infocontainer = new VerticalList('infocontainer');
                this._roomserviceFooter = new Container("roomserviceFooter");
                this._leftFooter = new Container("leftFooter");
                this._rightFooter = new Container("rightFooter");
                this._leftFooter.appendChildWidget(new Label("ROOM SERVICE"));

                this._rightFooter.appendChildWidget(new LabelI18n("normalInfo", 'info1'));
                this._rightFooter.appendChildWidget(new LabelI18n("boldInfo", 'info2'));

                this._roomserviceFooter.appendChildWidget(this._leftFooter);
                this._roomserviceFooter.appendChildWidget(this._rightFooter);
            },

            _insertInfo:function() {
                var self = this;
                self._infocontainer.removeChildWidgets();
                self._infocontainer.appendChildWidget(new Label('Tu pedido'));
                var totalButton = new Button('totalButton','totalButton');
                var amount = 0;
                roomService.order.forEach(function (order, index) {
                    amount = amount + (parseFloat(order.amount) * parseFloat(order.product.price));
                    var string = '(' + order.amount + ') ' + order.product.title;
                    var orderLabel = new Label('orderinfo-'+ order.product.id,string);
                    var cancelLabel = new Label('cancel-'+ order.product.id, 'cancel');
                    var orderButton = new Button('orderinfo-'+ order.product.id);
                    orderButton.appendChildWidget(orderLabel);
                    orderButton.appendChildWidget(cancelLabel);
                    orderButton.addEventListener("select", function(ev) {
                        self.getCurrentApplication().pushComponent(
                            "modalcontainer",
                            "homeapp/appui/components/schedulercomponent",
                            self._getRemoveOrderConfig(self, order, index)
                        );
                    });
                    self._infocontainer.appendChildWidget(orderButton);
                });
                if(roomService.order.length){
                    self._infocontainer.appendChildWidget(totalButton);
                    totalButton.appendChildWidget(new Label('Confirmar pedido','Confirmar pedido'));
                    totalButton.appendChildWidget(new Label('totalAmount',' $ ' + amount));
                    totalButton.addEventListener("select", function(ev) {
                        self.getCurrentApplication().pushComponent(
                            "modalcontainer",
                            "homeapp/appui/components/schedulercomponent",
                            self._getConfirmOrderConfig(self, ev)
                        );
                    });
                }
            },

            _getRemoveOrderConfig: function (parent, order, index) {
                var self = parent;

                function _onselectSchedule(option) {
                    if(option === "Borrar Todos"){
                        roomService.order.splice(index,1);
                    } else if(option === "Cancelar"){
                    } else {
                        order.amount = amount - parseInt(option);
                        roomService.order.splice(index,1);
                        if(order.amount > 0){
                            roomService.order.push(order);
                        }
                    }
                    self.getCurrentApplication().pushComponent(
                        "maincontainer",
                        "homeapp/appui/components/roomservicecomponent",
                        { home: self }
                    );
                };
                var amount = parseInt(order.amount);
                var datasource = [];
                datasource.push({'id': '0', 'description': 'Borrar Todos'});

                for(var i=0; i<amount; i++){
                    datasource.push({'id': ''+(i+1)+'', 'description': ''+(i+1)+''})
                }
                datasource.push({'id': '-1', 'description': 'Cancelar'});
                return {
                    home: self, //parametro para poder volver
                    description: "Seleccione la cantidad que desea eliminar de : " + order.product.title,
                    dataSource: datasource,
                    formatter: new SchedulerFormatter({ onSelect: _onselectSchedule}),
                    orientation: Carousel.orientations.VERTICAL,
                    carouselId: 'languagecontainer',
                    animOptions: {
                        skipAnim: false
                    },
                    alignment: {
                        normalisedAlignPoint: 0,
                        normalisedWidgetAlignPoint: 0
                    },
                    initialItem: 0,
                    type: "WRAPPING",
                };
            },

            _getConfirmOrderConfig: function (parent, e) {
                var self = parent;

                function _onselectSchedule(option) {
                    if(option === "SI"){
                        // self.parentWidget.back();
                        self.parentWidget.getCurrentApplication().pushComponent(
                            "modalcontainer",
                            "homeapp/appui/components/schedulercomponent",
                            self._getSuccessModalConfig(self, e)
                        );
                    } else {
                        self.getCurrentApplication().pushComponent(
                            "maincontainer",
                            "homeapp/appui/components/roomservicecomponent",
                            { home: self }
                        );
                    }

                }
                var datasource = [{'id': '1', 'description': 'SI',},{'id': '2','description': 'NO',}];
                return {
                    home: self, //parametro para poder volver
                    description: "Confirmar pedido? ",
                    dataSource: datasource,
                    formatter: new SchedulerFormatter({ onSelect: _onselectSchedule}),
                    orientation: Carousel.orientations.VERTICAL,
                    carouselId: 'languagecontainer',
                    animOptions: {
                        skipAnim: false
                    },
                    alignment: {
                        normalisedAlignPoint: 0,
                        normalisedWidgetAlignPoint: 0
                    },
                    initialItem: 0,
                    type: "WRAPPING",
                };
            },

            _getSuccessModalConfig: function (parent, e) {
                var self = parent;

                function _onselectSchedule() {
                    //aca se manda y se vuelve a la home
                    roomService.order = [];
                    roomService.schedule = '';
                    roomService.restaurant = '';
                    roomService.orderCompleted = true;
                    self.parentWidget.back();
                    self.parentWidget.back();
                };

                var datasource = [{'id': '1', 'description': 'OK'}];
                return {
                    home: self, //parametro para poder volver
                    description: "Su pedido a " + roomService.restaurant + " para las " + roomService.schedule + " ya ha sido enviado.",
                    dataSource: datasource,
                    formatter: new SchedulerFormatter({ onSelect: _onselectSchedule}),
                    orientation: Carousel.orientations.VERTICAL,
                    carouselId: 'languagecontainer',
                    animOptions: {
                        skipAnim: false
                    },
                    alignment: {
                        normalisedAlignPoint: 0,
                        normalisedWidgetAlignPoint: 0
                    },
                    initialItem: 0,
                    type: "WRAPPING",
                };
            },

            _removeDescriptionData: function(category, product) {
                var self = this;
                this._descriptionContainer.removeChildWidgets();
                this._descriptionContainer.getClasses().forEach(function(c) {
                    if (c.indexOf('category-') === 0) {
                        self._descriptionContainer.removeClass(c);
                    }
                });
                if (category) {
                    this._descriptionContainer.addClass("category-" + category);
                    console.log(this._descriptionContainer.getClasses());
                } else if (product) {
                    this._descriptionContainer.appendChildWidget(new Label(product));
                } else {
                    this._descriptionContainer.appendChildWidget(new Label(I18n.translate('description')));
                }
            },

            _generateProductButton: function(product) {
                var self = this;
                var button = new Button();
                button.appendChildWidget(new Label(product.title));
                button.addEventListener("focus", function(event) {
                    //Esto puede ser un onSelect pero creo que queda mejor que cambie en el onfocus
                    self._removeDescriptionData('', product.title);
                    var image = new Image("product-img-" + product.id , product.url);
                    var label = new Label(product.description);
                    var price = new Label('priceAmount', '$ ' + product.price);
                    var addButton = new Button('addButton','addButton');
                    addButton.appendChildWidget(new Label('Agregar al pedido'));
                    addButton.addEventListener("select", function(ev) {
                        var actualAmount = parseInt(document.getElementById('amountPerProduct').innerHTML);
                        if(actualAmount > 0){
                            var newProduct = true;
                            var currectOrder = {amount: actualAmount, product: product};
                            roomService.order.forEach(function (order) {
                                if(order.product.id === product.id){
                                    try {
                                        order.amount = parseInt(order.amount) + parseInt(actualAmount);
                                        newProduct = false;
                                    } catch (e) {
                                        WG.log(e);
                                    }
                                }
                            });
                            if(newProduct){
                                try {
                                    roomService.order.push(currectOrder);
                                } catch (e) {
                                    WG.log(e);
                                }
                            }
                            self.getCurrentApplication().pushComponent(
                                "maincontainer",
                                "homeapp/appui/components/roomservicecomponent",
                                { home: self }
                            );
                        }
                    });
                    // var modifier = new HorizontalList('amountModifier');
                    // var plusButton = new Button('plus');
                    // plusButton.appendChildWidget(new Label('plusLabel', '+'));
                    // plusButton.addEventListener("select", function(ev) {
                    //     var actualAmount = parseInt(document.getElementById('amountPerProduct').innerHTML);
                    //     actualAmount++;
                    //     document.getElementById('amountPerProduct').innerHTML = actualAmount.toString();
                    // });
                    // var minusButton = new Button('minus');
                    // minusButton.appendChildWidget(new Label('minusLabel', '-'));
                    // minusButton.addEventListener("select", function(ev) {
                    //     var actualAmount = parseInt(document.getElementById('amountPerProduct').innerHTML);
                    //     if(actualAmount > 0){
                    //         actualAmount--;
                    //         document.getElementById('amountPerProduct').innerHTML = actualAmount.toString();
                    //     }
                    // });
                    // modifier.appendChildWidget(minusButton);
                    // modifier.appendChildWidget(new Label('amountPerProduct', '0'));
                    // modifier.appendChildWidget(plusButton);
                    if (product.url != null && product.url != '') {
                        self._descriptionContainer.appendChildWidget(image);
                    }

                    if (product.description != null && product.description != '') {
                        self._descriptionContainer.appendChildWidget(label);
                    }

                    if (product.price != null && product.price != '') {
                        self._descriptionContainer.appendChildWidget(price);
                    }
                    // self._descriptionContainer.appendChildWidget(modifier);
                    // self._descriptionContainer.appendChildWidget(addButton);
                });
                return button;
            },

            _generateCategoryButton: function(category) {
                var self = this;
                var button = new Button();
                button.appendChildWidget(new LabelI18n(category.name));
                button.addEventListener("focus", function(event) {
                    self._productsList.removeChildWidgets();
                    self._removeDescriptionData(category.id);
                    self._productsList.appendChildWidget(new Label(I18n.translate('options')));
                    ServiceRoomProducts.getByCategory(category.id).forEach(function(product) {
                        var productButton = self._generateProductButton(product);
                        self._productsList.appendChildWidget(productButton);
                    });
                });
                return button;
            },

            _createCategoriesButtons: function() {
                var self = this;
                this._categoriesButtons = [];
                ServiceRoomCategories.getAll().forEach(function(category) {
                    var button = self._generateCategoryButton(category);
                    self._categoriesButtons.push(button);
                });
            },

            _onBeforeRender: function() {
                var self = this;

                //FIX i18n de categorias
                this._categoriesList.removeChildWidgets();
                this._categoriesList.appendChildWidget(new LabelI18n(I18n.translate('categories')));
                this._createCategoriesButtons();

                this._categoriesButtons.forEach(function(button) {
                    self._categoriesList.appendChildWidget(button);
                });
                this._removeDescriptionData();
                // this._insertInfo();
                this._horizontalList.appendChildWidget(this._categoriesList);
                this._horizontalList.appendChildWidget(this._productsList);
                this._horizontalList.appendChildWidget(this._descriptionContainer);
                // this._horizontalList.appendChildWidget(this._infocontainer);

                this._roomServicesContainer.appendChildWidget(this._horizontalList);

                var image = new Image("contactless-room-service-qr", 'static/img/hotel_riazor/qrs/contactless-room-service-qr.png');
                this._contactlessRoomServiceContainer.appendChildWidget(image);

                this._roomServicesContainer.appendChildWidget(this._contactlessRoomServiceContainer);
                this.appendChildWidget(this._roomServicesContainer);
                this.appendChildWidget(this._roomserviceFooter);
            },

            _onBeforeshow: function(ev) {
                this._categoriesList.getActiveChildWidget().focus();
            }

        });
    }
);