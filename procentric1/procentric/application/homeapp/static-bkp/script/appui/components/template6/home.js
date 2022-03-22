define(
    "homeapp/appui/components/template6/home",
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
                // this._createQrImage();
                Welcome._createWelcomeLabelWithStyle();
                this._createHorizontalListMenu();

                this.addEventListener("beforerender", function(ev) {
                    self._onBeforeRender(ev);
                });
                // calls Application.ready() the first time the component is shown
                // the callback removes itself once it's fired to avoid multiple calls.
                this.addEventListener("aftershow", function appReady(evt) {
                    self.getCurrentApplication().ready();

                    //AGREGADO EXPERIENCIAS
                    if (templateResponse.experience && templateResponse.experience != null) {
                        self.getCurrentApplication().pushComponent("maincontainer",
                            "homeapp/appui/components/experiencecomponent", { home: self });
                    }

                    self.removeEventListener('aftershow', appReady);
                    self._setInterval();
                    hcap.volume.getVolumeLevel({
                        "onSuccess" : function(s) {
                            volume = s.level;
                            hcap.volume.setVolumeLevel({
                                "level" : 0,
                                "onSuccess" : function() {
                                    WG.log("onSuccess");
                                },
                                "onFailure" : function(f) {
                                    WG.log("onFailure : errorMessage = " + f.errorMessage);
                                }
                            });
                        },
                        "onFailure" : function(f) {
                            WG.log("onFailure : errorMessage = " + f.errorMessage);
                        }
                    });
                });

                this.addEventListener("beforeshow", function (evt) {
                    Welcome._renderWelcomeTextWithStyle();
                });

                this.addEventListener('keydown', function(e){
                    try {
                        WG.log("keydown : " + e.keyCode);
                        hcap.mode.getHcapMode({
                            "onSuccess" : function(s) {
                                if(s.mode === 258){
                                    WG.log("onSuccess : current hcap mode = " + s.mode);
                                    if(e.keyCode === 458){ //keycode del boton channel/guide
                                        WG._onSelectChannelGuideButtonWithPreview(self);
                                    } else if(e.keyCode === 457){ //keycode del boton info
//                                        WG._onSelectHotelInfo(self, e);
                                    }
                                } else {
                                    hcap.volume.getVolumeLevel({
                                        "onSuccess" : function(s) {
                                            volume = s.level;
                                            hcap.volume.setVolumeLevel({
                                                "level" : 0,
                                                "onSuccess" : function() {
                                                    WG.log("onSuccess");
                                                },
                                                "onFailure" : function(f) {
                                                    WG.log("onFailure : errorMessage = " + f.errorMessage);
                                                }
                                            });
                                        },
                                        "onFailure" : function(f) {
                                            WG.log("onFailure : errorMessage = " + f.errorMessage);
                                        }
                                    });
                                    service.onKeyDown(e.keyCode);
                                }
                            },
                            "onFailure" : function(f) {
                                WG.log("onFailure : errorMessage = " + f.errorMessage);
                            }
                        });
                    } catch (e) {
                        WG.log(e);
                    }
                })
            },

            _createContainers: function () {
                this._navbarContainer = new Container("navbarContainer");
                this._imageContainer = new Container("imageContainer");
                this._welcomeContainer = new Container("welcomeContainer");
                // this._timeContainer = new Container("timeContainer");

                this._bodyContainer = new Container("bodyContainer");
                // this._qrContainer = new Container("qrContainer");

                this._sliderContainer = new Container("sliderContainer");
            },

            _createLogoImage: function() {
                // this._logoImage = new Image("logoImage", "static/img/logo-chico.png", undefined, 1);
                //this._logoImage = new Image("logoImage", "static/img/template5/LogotipoCP.png", undefined, 1);
                this._logoImage = new Image("logoImage", "static/img/etereo/logo.png", undefined, 1);
            },

            _createQrImage: function() {
                this._qrImage = new Image("qrImage", "data:image/png;base64," + templateResponse.qrImage, undefined, 1);
                this._qrLabel = new Labeli18n('qrLabel','Cada vez que enciendas tu televisor debes escanear el código para hacer streaming y disfrutar de todos los servicios del hotel');
            },

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
                container.appendChildWidget(new Image('iconimage','static/img/template6/ICONO_SERVICES.png'));
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

            setVideoSize: function(x,y,width,height){
                hcap.video.setVideoSize({
                    "x" : x,
                    "y" : y,
                    "width" : width,
                    "height" : height,
                    "onSuccess" : function() {
                        WG.log("onSuccess");
                    },
                    "onFailure" : function(f) {
                        WG.log("onFailure : errorMessage = " + f.errorMessage);
                    }
                });
            },

            getVideoSize: function(){
                WG.log("entre a getvideosize");
                hcap.video.getVideoSize({
                    "onSuccess" : function(s) {
                        WG.log(s);
                        originalSize = s;
                    },
                    "onFailure" : function(f) {
                        WG.log("onFailure : errorMessage = " + f.errorMessage);
                    }
                });
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
                // this._qrContainer.appendChildWidget(this._qrImage);
                // this._qrContainer.appendChildWidget(this._qrLabel);

                // this._bodyContainer.appendChildWidget(this._qrContainer);
                // this._imageContainer.appendChildWidget(this._logoImage);
                // this._navbarContainer.appendChildWidget(this._imageContainer);
  
                // this._welcomeContainer.appendChildWidget(Welcome._createWelcomeLabelWithStyle());
                // this._navbarContainer.appendChildWidget(this._welcomeContainer);
                
                // this._timeContainer.appendChildWidget(this._createTimeLabel());
                // this._navbarContainer.appendChildWidget(this._timeContainer);


                this._sliderContainer.appendChildWidget(this._horizonatalListMenu);
                this.appendChildWidget(this._navbarContainer);
                this.appendChildWidget(this._bodyContainer);
                this.appendChildWidget(this._sliderContainer);
                
                // this._refreshTime(I18n);
            },

        });
    }
);
