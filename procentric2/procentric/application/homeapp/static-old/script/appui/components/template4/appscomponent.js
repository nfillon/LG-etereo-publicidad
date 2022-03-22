define(
    "homeapp/appui/components/template4/appscomponent",
    [
        "antie/widgets/component",
        "antie/widgets/container",
        "homeapp/appui//widgets/verticalcarousel",
        "homeapp/appui/formatters/appsformatter",
        "homeapp/appui/widgets/i18nlabel",
        "homeapp/appui/datasources/appsavailable",
        "antie/datasource",
        "homeapp/appui/services/lgservice",
        "homeapp/appui/widgetgenerator"
    ],
    function (Component, Container, VerticalCarousel, MenubarFormatter, LabelI18n, HotelServices, DataSource, service, WG) {

        return Component.extend({
            init: function init() {
                var self = this;

                init.base.call(this, "hotelservicecomponent");

                this._createNavbarContainer();
                this._createInformationContainer();
                this._createWelcomeLabel();

                this.addEventListener("beforerender", function(ev) {
                    self._createCarousel();
                    self._onBeforeRender(ev);
                });

                this.addEventListener("beforeshow", function(ev) {
                    self._onBeforeshow(ev);
                    self.home = ev.args.home;
                });


                this.addEventListener("afterhide", function(ev) {
                    var items;
                    while (self._carousel.getChildWidgetCount() > 0) {
                        items = self._carousel.getChildWidgets();
                        self._carousel.removeChildWidget(items[0]);
                    }
                    self._navbarContainer.removeChildWidget(self._carousel);
                    self._carousel = null;
                });

                this.addEventListener('keydown', function(ev){
                    WG.log(ev.keyCode);
                    if (ev.keyCode == 461) {
                        self.parentWidget.back();
                        self.home._sliderContainer.focus();
                        self.home._sliderContainer.show(ev);
                    }
                })
            },

            _createWelcomeLabel: function() {
                this._welcomeLabel = new Container("welcomeLabel");
                this._welcomeLabel.appendChildWidget(new LabelI18n("apps","apps"));
            },

            _createNavbarContainer: function() {
                this._navbarContainer = new Container("itemsContainer");
            },

            _createInformationContainer: function() {
                this._informationContainer = new Container("informationContainer");
            },

            _createCarousel: function (args) {
                var self = this;

                function onSelect(appId) {
                    try {
                        service.launchExternalApplication(appId, "{}");
                    } catch (e) {
                        WG.log(e.stack);
                    }
                }

                function onFocus(item) {
                    try {
                        var device = self.getCurrentApplication().getDevice();
                        var texthtml = self._generateAppTemplate(item);
                        device.setElementContent(self._informationContainer.outputElement, texthtml, true);
                    } catch (e) {
                        WG.log(e.stack);
                    }
                }

                var dataSource = new DataSource(null, new HotelServices(), 'loadData');
                this._carousel = new VerticalCarousel("menubar", new MenubarFormatter({ onFocus: onFocus, onSelect: onSelect }), dataSource);
            },

            _generateAppTemplate: function(item) {
                var texthtml = "<div class='appContainer'>" +
                    "<div class='appContent'>" + item.content + "</div>" +
                    "<div id='logoImage' class='widget container image appImageContainer'>" +
                    "<img id='"+ item.img+"' src='" +item.img + "' class='appImage'>" +
                    "</div></div>";
                return texthtml;
            },

            _onBeforeRender: function() {
                this._navbarContainer.appendChildWidget(this._welcomeLabel);
                this._navbarContainer.appendChildWidget(this._carousel);
                this.appendChildWidget(this._informationContainer);
                this.appendChildWidget(this._navbarContainer);
            },

            _onBeforeshow: function(ev) {
                this._carousel.getActiveChildWidget().focus();
                var device = this.getCurrentApplication().getDevice();
                var texthtml = this._generateAppTemplate(this._carousel.getActiveChildWidget());
                device.setElementContent(this._informationContainer.outputElement, texthtml, true);
            }

        });
    }
);
