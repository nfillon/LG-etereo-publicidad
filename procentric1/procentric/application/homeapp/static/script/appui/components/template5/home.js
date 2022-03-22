define(
    "homeapp/appui/components/template5/home",
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
        "antie/widgets/horizontallist"
    ],
    function (I18n, WG, Time, Welcome, service, Component, Container, Image, Button, Label, Labeli18n, HorizontalList) {

        return Component.extend({
            init: function init () {
                var self = this;
                // It is important to call the constructor of the superclass
                init.base.call(this, "home-5-component");

                WG._setConfig(false, true);
                this._createContainers();
                this._createLogoImage();
                //this._createQrImage();
                Welcome._createWelcomeLabelWithStyle();
                this._createHorizontalListMenu();

                this.addEventListener("beforerender", function(ev) {
                    self._onBeforeRender(ev);
                });
                // calls Application.ready() the first time the component is shown
                // the callback removes itself once it's fired to avoid multiple calls.
                this.addEventListener("aftershow", function appReady(evt) {
                    self.getCurrentApplication().ready();
                    self.removeEventListener('aftershow', appReady);
                    self._setInterval();
                    service.appVolumeChangeTo(0);
                });

                this.addEventListener("beforeshow", function (evt) {
                    Welcome._renderWelcomeTextWithStyle();
                });

                this.addEventListener('keydown', function(e){
                    try {
                        service.log("keydown : " + e.keyCode);
                        service.getHcapModeForHome(e, WG, self);
                    } catch (e) {
                        service.log(e);
                    }
                })
            },

            _createContainers: function () {
                this._bodyContainer = new Container("bodyContainer");
                this._imageContainer = new Container("imageContainer");
                //this._qrContainer = new Container("qrContainer");
                this._navbarContainer = new Container("navbarContainer");
                this._sliderContainer = new Container("sliderContainer");
            },

            _createLogoImage: function() {
                // this._logoImage = new Image("logoImage", "static/img/logo-chico.png", undefined, 1);
                //this._logoImage = new Image("logoImage", "static/img/template5/LogotipoCP.png", undefined, 1);
                this._logoImage = new Image("logoImage", "static/img/renaissance_san_pablo/logo.png", undefined, 1);
            },

            /*
            _createQrImage: function() {
                this._qrImage = new Image("qrImage", "static/img/crown_paradise/qrs/cppp-general-cloud1_tv.png", undefined, 1);
            },
            */

            _createHorizontalListMenu: function() {
                var self = this;
                self._horizonatalListMenu = new HorizontalList("mainMenuList");
                templateResponse.menuOptions.forEach(function (widget) {
                    if(widget.name !== 'mystay' && widget.name !== 'apps'){
                        self._horizonatalListMenu.appendChildWidget(WG._initWidgets(self, widget));
                    }
                });
            },

            _createRoomServiceButton: function(name) {
                var self = this;
                var component = new Button();
                var container = new Container("widgetcontainer-"+name);
                container.appendChildWidget(new Image('iconimage','static/img/template5/ICONO_SERVICES.png'));
                component.appendChildWidget(container);
                component.appendChildWidget(new Labeli18n(name,name));
                component.addEventListener("select", function(ev) {
                    self.getCurrentApplication().pushComponent(
                        "maincontainer",
                        "homeapp/appui/components/roomservicecomponent",
                        { home: self }
                    );
                });
                return component;
            },

            _createTimeLabel: function() {
                return new Label("timeLabel", "");
            },

            _setInterval: function() {
                setInterval(this._refreshTime, 1000, I18n);
            },

            _refreshTime: function(I18n) {
                try {
                    var date = new Date();
                    var timeArea = document.getElementById('timeLabel');
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? '0'+minutes : minutes;
                    const monthNames = {
                        en: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                        es: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
                        pt: [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" ],
                    };

                    const dayNames = { 
                        en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
                        es: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado" ],
                        pt: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
                    };

                    var currentLanguageCode = I18n.getCurrentLanguageCode();
                    currentLanguageCode = ['en', 'es', 'pt'].indexOf(currentLanguageCode) >= 0 ? currentLanguageCode : 'pt';

                    var day = date.getDay();
                    var monthday = date.getUTCDate();
                    var month = date.getMonth();
                    var year = date.getFullYear();
                    timeArea.innerHTML = '<div class="hour">' + hours + ':' + minutes + ' ' + ampm + '</div>' +
                        '<div class="day"> ' + dayNames[currentLanguageCode][day] + '</div>' +
                        '<div class="fullDate"> ' +
                        monthday +  '   ' + monthNames[currentLanguageCode][month] +  '   ' + year + '</div>';
                } catch (e) {
                    WG.log(e)
                }
            },
            _onBeforeRender: function(ev) {
                this._imageContainer.appendChildWidget(this._logoImage);
                //this._qrContainer.appendChildWidget(this._qrImage);
                this._bodyContainer.appendChildWidget(this._imageContainer);
                //this._bodyContainer.appendChildWidget(this._qrContainer);
                this._navbarContainer.appendChildWidget(Welcome._createWelcomeLabelWithStyle());
                this._navbarContainer.appendChildWidget(this._createTimeLabel());
                this._sliderContainer.appendChildWidget(this._horizonatalListMenu);
                this.appendChildWidget(this._navbarContainer);
                this.appendChildWidget(this._bodyContainer);
                this.appendChildWidget(this._sliderContainer);
                this._refreshTime(I18n);
            },

        });
    }
);