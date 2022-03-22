define(
    "homeapp/appui/components/template4/home",
    [
        "homeapp/appui/i18n",
        "homeapp/appui/widgetgenerator",
        "homeapp/appui/timecomponent",
        "homeapp/appui/welcomecomponent",
        "homeapp/appui/services/lgservice",
        "antie/widgets/component",
        "antie/widgets/container",
        "antie/widgets/image",
        "antie/widgets/button",
        "antie/widgets/label",
        "homeapp/appui/widgets/i18nlabel",
        "antie/widgets/verticallist"
    ],
    function (i18n, WG, Time, Welcome, service, Component, Container, Image, Button, Label, Labeli18n, VerticalList) {

        return Component.extend({
            init: function init () {
                var self = this;
                // It is important to call the constructor of the superclass
                init.base.call(this, "home-4-component");

                WG._setConfig(false, false);
                this._createContainers();
                this._createLogoImage();
                this._createVerticalListMenu();

                this.addEventListener("beforerender", function(ev) {
                    self._onBeforeRender(ev);
                });
                // calls Application.ready() the first time the component is shown
                // the callback removes itself once it's fired to avoid multiple calls.
                this.addEventListener("aftershow", function appReady(evt) {
                    self.getCurrentApplication().ready();
                    self.removeEventListener('aftershow', appReady);
                    Time._setInterval();
                });

                this.addEventListener("beforeshow", function (evt) {
                });

                this.addEventListener('keydown', function(e){
                    try {
                        service.onKeyDown(e.keyCode);
                    } catch (e) {
                        WG.log(e);
                    }
                })
            },

            _createContainers: function () {
                this._infoContainer = new Container("infoContainer");
                this._navbarContainer = new Container("navbarContainer");
                this._sliderContainer = new Container("sliderContainer");
            },

            _createLogoImage: function() {
                this._logoImage = new Image("logoImage", "static/img/marriott-logo-png-transparent.png", undefined, 1);
            },

            _createVerticalListMenu: function() {
                var self = this;
                self._verticalListMenu = new VerticalList("mainMenuList");
                templateResponse.menuOptions.forEach(function (widget) {
                    self._verticalListMenu.appendChildWidget(WG._initWidgets(self, widget));
                });
            },

            _onBeforeRender: function(ev) {
                this._navbarContainer.appendChildWidget(this._logoImage);
                this._sliderContainer.appendChildWidget(Welcome._createWelcomeLabel());
                this._sliderContainer.appendChildWidget(this._verticalListMenu);
                this._sliderContainer.appendChildWidget(Time._createTimeLabel());
                this.appendChildWidget(this._navbarContainer);
                this.appendChildWidget(this._sliderContainer);
                this.appendChildWidget(this._infoContainer);
                Time._refreshTime();
            },

        });
    }
);