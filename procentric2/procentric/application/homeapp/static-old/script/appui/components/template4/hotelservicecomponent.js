define(
    "homeapp/appui/components/template4/hotelservicecomponent",
    [
        "antie/widgets/component",
        "antie/widgets/container",
        "homeapp/appui//widgets/verticalcarousel",
        "homeapp/appui/formatters/menubarformatter",
        "homeapp/appui/widgets/i18nlabel",
        "homeapp/appui/widgetgenerator"
    ],
    function (Component, Container, VerticalCarousel, MenubarFormatter, LabelI18n, WG) {

        var isParent = true;
        return Component.extend({
            init: function init() {
                var self = this;

                init.base.call(this, "hotelservicecomponent");

                this._createNavbarContainer();
                this._createInformationContainer();
                this._createWelcomeLabel();

                this.addEventListener("beforerender", function(ev) {
                    self._createCarouselContainer();
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
                        if(isParent){
                            self.parentWidget.back();
                            self.home._sliderContainer.focus();
                            self.home._sliderContainer.show(ev);
                        } else {
                            isParent = true;
                            self._carousel.removeChildWidgets();
                            var newcarousel = self._createCarousel();
                            self._carousel.appendChildWidget(newcarousel);
                            newcarousel.focus();
                        }

                    }
                })
            },

            _createWelcomeLabel: function() {
                this._welcomeLabel = new Container("welcomeLabel");
                this._welcomeLabel.appendChildWidget(new LabelI18n("hotelservice","hotelservice"));
            },

            _createNavbarContainer: function() {
                this._navbarContainer = new Container("itemsContainer");
            },

            _createInformationContainer: function() {
                this._informationContainer = new Container("informationContainer");
            },

            _createCarouselContainer: function() {
                var self = this;
                this._carousel = self._createCarousel();
            },

            _createCarousel: function (args) {
                var self = this;

                function onFocusChilds(hotelInfo) {
                    try {
                        var device = self.getCurrentApplication().getDevice();
                        var texthtml = self._generateAppTemplateWithChilds(hotelInfo);
                        device.setElementContent(self._informationContainer.outputElement, texthtml, true);
                    } catch (e) {
                        WG.log(e.stack);
                    }
                }

                function onSelectChilds(hotelInfo) {
                    isParent = false;
                    self._carousel.removeChildWidgets();
                    var newcarousel = new VerticalCarousel("menubar", new MenubarFormatter({ onSelect: onSelect, onSelectChilds : onSelectChilds, onFocusChilds : onFocusChilds }), hotelInfo.childs)
                    self._carousel.appendChildWidget(newcarousel);
                    newcarousel.focus();
                }

                function onSelect(ev) {
                    try {
                        var device = self.getCurrentApplication().getDevice();
                        var texthtml = self._generateAppTemplate(ev.target);
                        device.setElementContent(self._informationContainer.outputElement, texthtml, true);
                    } catch (e) {
                        WG.log(e.stack);
                    }
                }
                var dataSource = templateResponse.hotelInfos;
                return new VerticalCarousel("menubar", new MenubarFormatter({ onSelect: onSelect, onSelectChilds : onSelectChilds, onFocusChilds : onFocusChilds }), dataSource);

            },

            _generateAppTemplate: function(item) {
                var texthtml = "<div class='hotelInfoContainer'>" +
                    "<div class='hotelInfoContent'>" + item.content + "</div>" +
                    "<div id='logoImage' class='widget container image hotelInfoImageContainer'>" +
                    "<img id='"+ item.background+"' src='static/img/gimnasio-fa.jpg' class='hotelInfoImage'>" +
                    "</div></div>";
                return texthtml;
            },

            _generateAppTemplateWithChilds: function(item) {
                var texthtml = "<div class='hotelInfoContainer'>" +
                    "<div class='hotelInfoContent'>" + item.content + "</div>" +
                    "<div id='logoImage' class='widget container image hotelInfoImageContainer'>" +
                    "<button onclick='_verHotelInfo("+ item + ")'>Toque ok para ver mas</button>" +
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
                var activeChild = this._carousel.getActiveChildWidget();
                var texthtml;
                if(activeChild.childs){
                    texthtml = this._generateAppTemplateWithChilds(activeChild);
                } else {
                    texthtml = this._generateAppTemplate(activeChild);
                }
                device.setElementContent(this._informationContainer.outputElement, texthtml, true);
            }

        });
    }
);
