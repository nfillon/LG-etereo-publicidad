define(
    "homeapp/appui/components/hotelservicecomponent-fa",
    [
        "antie/widgets/component",
        "antie/widgets/container",
        "antie/widgets/horizontalcarousel",
        "homeapp/appui/formatters/menubarformatter",
        "antie/widgets/label",
        "homeapp/appui/widgetgenerator",
        "homeapp/appui/widgets/i18nlabel"
    ],
    function (Component, Container, HorizontalCarousel, MenubarFormatter, Label, WG, Labeli18n) {

        return Component.extend({
            init: function init() {
                var self = this;

                init.base.call(this, "hotelservicecomponent-fa");

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
                    WG.log("keydown : " + ev.keyCode);
                    var exit_keys = [461, 458, 602];
                    if (exit_keys.indexOf(ev.keyCode) >= 0) {
                        try {
                            self.parentWidget.parentWidget.getClasses().forEach(function (value) {
                                if (value.indexOf("bg") !== -1) {
                                    self.parentWidget.parentWidget.removeClass(value);
                                }
                            });
                        } catch (e) {
                            WG.log(e);
                        }
                        self.parentWidget.back();
                        self.home.focus();
                        self.home._sliderContainer.show(ev);
                        // self.home._hcapStart(); POR EL MOMENTO SE COMENTA, DESCPUES HAY QUE USAR WG Y SU VARIABLE PARA SABER SI HAY O NO MEDIA PLAYER
                        if(ev.keyCode === 458){ //keycode del boton channel/guide
                            WG._onSelectChannelGuideButtonWithPreview(self.home);
                        }
                    }
                })
            },

            _createWelcomeLabel: function() {
                this._welcomeLabel = new Container("infoHotelContainer");
                this._welcomeLabel.appendChildWidget(new Labeli18n("next_prev", "next_prev"));
            },

            _createNavbarContainer: function() {
                this._navbarContainer = new Container("navbarContainerFA");
            },

            _createInformationContainer: function() {
                this._informationContainer = new Container("informationContainerFA");
            },

            _createCarousel: function (args) {
                var self = this;

                function onSelect(ev) {
                    try {
                        var device = self.getCurrentApplication().getDevice();
                        device.setElementContent(self._informationContainer.outputElement, ev.target.content, true);
                        var mainComponent = document.getElementById('maincontainer');
                        var css = ev.target.cssClass,
                            head = document.head || document.getElementsByTagName('head')[0],
                            style = document.createElement('style');

                        head.appendChild(style);

                        style.type = 'text/css';
                        if (style.styleSheet){
                            // This is required for IE8 and below.
                            style.styleSheet.cssText = css;
                        } else {
                            style.appendChild(document.createTextNode(css));
                        }
                        self.parentWidget.parentWidget.getClasses().forEach(function (value) {
                            if(value.indexOf("bg") !== -1){
                                self.parentWidget.parentWidget.removeClass(value);
                            }
                        });
                        self.parentWidget.parentWidget.addClass(ev.target.background);
                    } catch (e) {
                        WG.log(e.stack);
                    }
                }
                var dataSource = templateResponse.hotelInfos;
                this._carousel = new HorizontalCarousel("menubar", new MenubarFormatter({ onSelect: onSelect }), dataSource);
            },

            _onBeforeRender: function() {
                this._navbarContainer.appendChildWidget(this._carousel);
                this._navbarContainer.appendChildWidget(this._welcomeLabel);
                this.appendChildWidget(this._informationContainer);
                this.appendChildWidget(this._navbarContainer);
            },

            _onBeforeshow: function(ev) {
                this._carousel.getActiveChildWidget().focus();
                var device = this.getCurrentApplication().getDevice();
                device.setElementContent(this._informationContainer.outputElement, this._carousel.getActiveChildWidget().content, true);
            }

        });
    }
);
