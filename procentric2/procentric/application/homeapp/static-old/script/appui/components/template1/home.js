define(
    "homeapp/appui/components/template1/home",
    [
        "homeapp/appui/i18n",
        "homeapp/appui/widgetgenerator",
        "homeapp/appui/timecomponent",
        "homeapp/appui/welcomecomponent",
        "homeapp/appui/services/lgservice",
        "antie/widgets/component",
        "antie/widgets/container",
        "antie/widgets/image",
        "antie/widgets/label",
        "homeapp/appui/widgets/i18nlabel",
        "antie/widgets/horizontallist",
        "antie/datasource",
        "antie/runtimecontext",
        "antie/widgets/button"
    ],
    function (i18n, WG, Time, Welcome, service, Component, Container, Image, Label, Labeli18n, HorizontalList, DataSource, RuntimeContext, Button) {

        var hasMediaPlayer = false;
        return Component.extend({
            init: function init () {
                var self = this;
                // It is important to call the constructor of the superclass
                init.base.call(this, "home-fa-component");

                WG._setConfig(hasMediaPlayer, false);
                this._createContainers();
                this._createLogoImage();
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
                    if(hasMediaPlayer){
                        self._hcapStart();
                    }
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
                                        WG._onSelectHotelInfo(self, e);
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
                        if(hasMediaPlayer){
                            self._hcapStart();
                        }
                    } catch (e) {
                        WG.log(e);
                    }
                })
            },

            _setInterval: function() {
                setInterval(this._refreshTime, 1000);
            },

            _refreshTime: function() {
                try {
                    var date = new Date();
                    var timeArea = document.getElementById('timeLabel');
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? '0'+minutes : minutes;
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
                    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    var day = date.getDay();
                    var monthday = date.getUTCDate();
                    var month = date.getMonth();
                    var year = date.getFullYear();
                    timeArea.innerHTML = '<div class="hour">' + hours + ':' + minutes + ' ' + ampm + '</div>' +
                        '<div class="day"> ' + dayNames[day] + '</div>' +
                        '<div class="fullDate"> ' +
                        monthday +  '   ' + monthNames[month] +  '   ' + year + '</div>';
                } catch (e) {
                    // WG.log(e)
                }
            },

            _createTimeLabelContainer: function() {
                return new Container("timeLabel");
            },

            _hcapStart: function (){
                var self = this;
                hcap.Media.startUp({
                    onSuccess: function() {
                        // hcap.Media.createMedia();
                        self._startUpMedia();
                    },
                    onFailure: function() {
                        // onErrorFn();
                    }
                });
                // service.initMedia(self._startUpMedia);
            },

            _hcapStop: function (){
                // service.stopMedia();
                var self = this;
                self._stopMedia();
                hcap.Media.shutDown({
                    onSuccess: function() {
                        hcap.Media.destroy();
                    },
                    onFailure: function() {
                        // onErrorFn();
                    }
                });
            },

            _startUpMedia: function (){
                try {
                    var self = this;
                    self._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
                    if(self._mediaPlayer.getState() === 'EMPTY'){
                        self._mediaPlayer.initialiseMedia(
                            "video",
                            "static/mp4/fiesta-rewards.mp4",
                            // "http://192.168.100.253:8080/procentric/application/homeapp/static/mp4/fiesta-rewards.mp4",
                            "video/mp4", self._playerContainer.outputElement);
                        self._mediaPlayer.beginPlayback();
                    } else if(self._mediaPlayer.getState() === 'ERROR'){
                        self._mediaPlayer.reset();
                        self._mediaPlayer.beginPlayback();
                    } else if(self._mediaPlayer.getState() === 'PAUSED'){
                        self._mediaPlayer.resume();
                    } else if(self._mediaPlayer.getState() === 'STOPED'){
                        self._mediaPlayer.beginPlayback();
                    } else if(self._mediaPlayer.getState() === 'COMPLETE'){
                        self._mediaPlayer.playFrom(0);
                    }
                    self._mediaPlayer.addEventCallback(self, function(event) {
                        if (event.type === "complete") {
                            self._mediaPlayer.playFrom(0);
                        }
                    });
                } catch (e) {
                    WG.log("error startupmedia");
                    WG.log(e)
                }
            },

            _stopMedia: function (){
                try {
                    var self = this;
                    self._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
                    if(self._mediaPlayer.getState() === 'ERROR'){
                        self._mediaPlayer.reset();
                    } else if(self._mediaPlayer.getState() === 'PAUSED' ||
                        self._mediaPlayer.getState() === 'COMPLETE' ||
                        self._mediaPlayer.getState() === 'BUFFERING' ||
                        self._mediaPlayer.getState() === 'PLAYING'){
                        self._mediaPlayer.stop();
                        self._mediaPlayer.reset();
                    } else if(self._mediaPlayer.getState() === 'STOPPED'){
                        self._mediaPlayer.reset();
                    }
                } catch (e) {
                    WG.log("error stopmedia");
                    WG.log(e)
                }
            },

            _createContainers: function () {
                this._playerContainer = new Container("playerContainer");
                this._navbarContainer = new Container("navbarContainer");
                this._sliderContainer = new Container("sliderContainer");
            },

            _createLogoImage: function() {
                this._logoImage = new Image("logoImage", "static/img/template1/LeBlancLogo.png", undefined, 1);
            },

            _createHorizontalListMenu: function() {
                var self = this;
                self._horizonatalListMenu = new HorizontalList("mainMenuList");
                templateResponse.menuOptions.forEach(function (widget) {
                    if(widget.name !== 'mystay'){
                        self._horizonatalListMenu.appendChildWidget(WG._initWidgets(self, widget));
                    }
                });
                // self._horizonatalListMenu.appendChildWidget(self._createRestaurantButton('Reserva'));
                self._horizonatalListMenu.appendChildWidget(self._createRoomServiceButton('room_service'));
            },

            _createRoomServiceButton: function(name) {
                var self = this;
                var component = new Button();
                component.appendChildWidget(new Labeli18n(name, name));
                component.addEventListener("select", function(ev) {
                    self.getCurrentApplication().pushComponent(
                        "maincontainer",
                        "homeapp/appui/components/roomservicecomponent",
                        { home: self }
                    );
                });
                return component;
            },

            _createRestaurantButton: function(name) {
                var self = this;
                var component = new Button();
                component.appendChildWidget(new Labeli18n(name, name));
                component.addEventListener("select", function(ev) {
                    self.getCurrentApplication().pushComponent(
                        "maincontainer",
                        "homeapp/appui/components/restaurantcomponent",
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

            _onBeforeRender: function(ev) {
                this._navbarContainer.appendChildWidget(this._logoImage);
                this._navbarContainer.appendChildWidget(this._createTimeLabelContainer());
                this._navbarContainer.appendChildWidget(Welcome._createWelcomeLabelWithStyle());
                this._sliderContainer.appendChildWidget(this._horizonatalListMenu);
                this.appendChildWidget(this._playerContainer);
                this.appendChildWidget(this._navbarContainer);
                this.appendChildWidget(this._sliderContainer);
            },

        });
    }
);