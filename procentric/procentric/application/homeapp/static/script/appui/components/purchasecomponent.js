define(
    "homeapp/appui/components/purchasecomponent",
    [
        "antie/widgets/component",
        "antie/widgets/container",
        "antie/widgets/horizontalcarousel",
        "homeapp/appui/datasources/restaurantoptions",
        "homeapp/appui/formatters/restaurantformatter",
        "antie/widgets/label",
        "homeapp/appui/datasources/appsavailable",
        "antie/datasource",
        "homeapp/appui/services/lgservice",
        "homeapp/appui/widgetgenerator",
        "antie/widgets/button",
        'homeapp/appui/datasources/schedulers',
        'homeapp/appui/formatters/schedulersformatter',
        "antie/widgets/carousel"
    ],
    function (Component, Container, HorizontalCarousel, Restaurant, RestaurantFormatter, Label, AppsAvailable, DataSource, service, WG, Button,
              Schedulers, SchedulerFormatter, Carousel) {

        return Component.extend({
            init: function init() {
                var self = this;

                init.base.call(this, "purchase-component");

                this._createNavbarContainer();
                this._createInformationContainer();
                this._createTitleLabel();
                this._createAppContainer();

                this.addEventListener("beforerender", function(ev) {
                    self._createCarousel();
                    self._onBeforeRender(ev);
                });

                this.addEventListener("beforeshow", function(ev) {
                    self.home = ev.args.home;
                    self._onBeforeshow(ev);
                });


                this.addEventListener("afterhide", function(ev) {
                    var items;
                    while (self._appsCarousel.getChildWidgetCount() > 0) {
                        items = self._appsCarousel.getChildWidgets();
                        self._appsCarousel.removeChildWidget(items[0]);
                    }
                    self._appsContainer.removeChildWidget(self._appsCarousel);
                    self._appsCarousel = null;
                });

                this.addEventListener('keydown', function(e){
                    // Back
                    WG.log(e.keyCode);
                    var exit_keys = [461, 458, 457, 602];
                    if (exit_keys.indexOf(e.keyCode) >= 0) {
                        hcap.mode.getHcapMode({
                            "onSuccess" : function(s) {
                                if(s.mode === 258){
                                    self._backToHome(self, e);
                                    WG.log("onSuccess : current hcap mode = " + s.mode);
                                    if(e.keyCode === 458){ //keycode del boton channel/guide
                                        WG._onSelectChannelGuideButtonWithPreview(self.home);
                                    } else if(e.keyCode === 457){ //keycode del boton info
//                                        WG._onSelectHotelInfo(self, e);
                                    }
                                } else {
                                    service.onKeyDown(e.keyCode);
                                    self._backToHome(self, e);
                                }
                            },
                            "onFailure" : function(f) {
                                WG.log("onFailure : errorMessage = " + f.errorMessage);
                            }
                        });
                    }
                })
            },

            _backToHome: function(parent, event) {
                parent.parentWidget.parentWidget.removeClass("bgHotelInfo");
                parent.parentWidget.back();
                parent.home.focus();
                parent.home._sliderContainer.show(event);
            },

            _createTitleLabel: function() {
                this._titleLabel = new Container("labelAppsContainer");
                this._titleLabel.appendChildWidget(new Label("RESTAURANTS"));
            },

            _createNavbarContainer: function() {
                this._navbarContainer = new Container("appTitleContainer");
            },

            _createInformationContainer: function() {
                this._informationContainer = new Container("appsInformationContainer");
            },

            _createAppContainer: function() {
                this._appsContainer = new Container("restaurantContainer");
            },

            _getCarouselLanguageConfig: function (parent) {
                var self = parent;

                function _onselectSchedule(schedule) {
                    try {
                        roomService.schedule = schedule;
                        self.getCurrentApplication().pushComponent(
                            "maincontainer",
                            "homeapp/appui/components/roomservicecomponent",
                            { home: self }
                        );
                    } catch (e) {
                        WG.log(e);
                    }
                }
                return {
                    home: self, //parametro para poder volver
                    description: "Seleccione horario de su reserva",
                    dataSource: new DataSource(null, new Schedulers(), 'loadData'),
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

            _createCarousel: function (args) {
                var self = this;

                function onFocus(ev) {
                    try {
                        var device = self.getCurrentApplication().getDevice();
                        device.setElementContent(self._informationContainer.outputElement, ev.target.content, true);
                    } catch (e) {
                        WG.log(e.stack);
                    }
                }
                function onSelect(appId) {
                    roomService.restaurant = appId;
                    try {
                        self.getCurrentApplication().pushComponent(
                            "modalcontainer",
                            "homeapp/appui/components/schedulercomponent",
                            self._getCarouselLanguageConfig(self)
                        );
                    } catch (e) {
                        WG.log(e.stack);
                    }
                }
                    // formatter: new RestaurantFormatter({ onSelect: _onselectRestaurant}),
                var dataSource = new DataSource(null, new Restaurant(), 'loadData');
                this._appsCarousel = new HorizontalCarousel("menubar", new RestaurantFormatter({ onFocus: onFocus, onSelect: onSelect }), dataSource );
            },

            _onBeforeRender: function() {
                this._appsContainer.appendChildWidget(this._appsCarousel);
                this._navbarContainer.appendChildWidget(this._titleLabel);
                this.appendChildWidget(this._appsContainer);
                this.appendChildWidget(this._informationContainer);
                this.appendChildWidget(this._navbarContainer);
            },

            _onBeforeshow: function(ev) {
                this.parentWidget.parentWidget.addClass("bgHotelInfo");
                this._appsCarousel.getActiveChildWidget().focus();
                var device = this.getCurrentApplication().getDevice();
                device.setElementContent(this._informationContainer.outputElement, this._carousel.getActiveChildWidget().content, true);
            }

        });
    }
);
