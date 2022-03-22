define(
    "homeapp/appui/components/template3/home",
    [
        "antie/widgets/component",
        "homeapp/appui/widgetgenerator",
        "homeapp/appui/timecomponent",
        "homeapp/appui/welcomecomponent",
        "antie/widgets/container",
        "antie/widgets/image",
        "antie/widgets/button",
        "antie/widgets/label",
        "antie/widgets/horizontallist",
        "antie/devices/mediaplayer/mediaplayer",
        "antie/runtimecontext",
        "homeapp/appui/i18n",
        "antie/widgets/carousel",
        "homeapp/appui/widgets/grid",
        "homeapp/appui/services/lgservice"
    ],
    function (Component, WG, Time, Welcome, Container, Image, Button, Label, HorizontalList, MediaPlayer,
              RuntimeContext, I18n, Carousel, Grid, service) {

        var gridIndex = 0;
        var widgetsAmount = templateResponse.menuOptions.length;
        return Component.extend({
            init: function init () {
                var self = this;

                // It is important to call the constructor of the superclass
                init.base.call(this, "home-3-component");

                WG._setConfig(true, true);
                this._createContainers();
                this._createLogoImage();
                Welcome._createWelcomeLabelCustom();
                this._createVerticalListMenu();

                this.addEventListener("beforerender", function(ev) {
                    self._onBeforeRender(ev);
                    Time._setInterval();
                });

                // calls Application.ready() the first time the component is shown
                // the callback removes itself once it's fired to avoid multiple calls.
                this.addEventListener("aftershow", function appReady(evt) {
                    self.getCurrentApplication().ready();
                    self.removeEventListener('aftershow', appReady);
                });

                // Add a 'beforerender' event listener to the component that takes care of video instantiation
                this.addEventListener("beforeshow", function (evt) {
                    self._hcapStart();
                    Welcome._renderWelcomeText();
                });

                this.addEventListener('keydown', function(e){
                    try {
                        service.onKeyDown(e.keyCode);
                        self._hcapStart();
                    } catch (e) {
                        WG.log(e);
                    }
                })
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

            _createContainers: function() {
                this._navbarContainer = new Container("navbarContainer");
                this._sliderContainer = new Container("sliderContainer");
                this._playerContainer = new Container("playerContainer");
            },

            _createLogoImage: function() {
                this._logoImage = new Image("logoImage", "static/img/logo-chico.png", /*{ width: 100, height: 100 }*/ undefined, 1);
            },

            _renderGrid: function() {
                var self = this;
                if(gridIndex >= widgetsAmount){
                    gridIndex = 0;
                }
                self._sliderContainer.removeChildWidgets();
                self._createVerticalListMenu(true);
            },

            _createVerticalListMenu: function(changeEvent) {
                var self = this;
                this._horizonatalListMenu = new HorizontalList('horizontalwidget');
                var button = new Button('button-back');
                var button1 = new Button('button-next');
                button.appendChildWidget(new Image("back-image", "static/img/arrow-next.png", undefined, 1));
                button.addEventListener("select", function () {
                    self._renderGrid();
                });
                button1.appendChildWidget(new Image("next-image", "static/img/arrow-next.png", undefined, 1));
                button1.addEventListener("select", function () {
                    self._renderGrid();
                });
                var grid = new Grid("mainMenuList", 3, 3, true, true);
                var row = 0;
                var col = 0;
                var cont = 0;
                templateResponse.menuOptions.forEach(function(widget, index) {
                    if(index >= gridIndex && cont < 6){
                        grid.setWidgetAt(col, row, WG._initWidgets(self, widget));
                        gridIndex++;
                        col++;
                        if (col == 3) {
                            col = 0;
                            row++;
                        }
                        cont++;
                    }
                });
                while (col <4 && row < 2){
                    var label = new Label('emptycontainer_'+col,'');
                    grid.setWidgetAt(col, row, label);
                    col ++;
                }
                this._horizonatalListMenu.appendChildWidget(button);
                this._horizonatalListMenu.appendChildWidget(grid);
                this._horizonatalListMenu.appendChildWidget(button1);
                if(changeEvent){
                    self._sliderContainer.appendChildWidget(this._horizonatalListMenu);
                    Welcome._renderWelcomeText();
                }
            },

            _onBeforeRender: function(ev) {
                this._navbarContainer.appendChildWidget(Time._createTimeLabelContainer());
                this._navbarContainer.appendChildWidget(this._logoImage);
                this._navbarContainer.appendChildWidget(Welcome._createWelcomeLabelCustom());
                this._sliderContainer.appendChildWidget(this._horizonatalListMenu);
                this.appendChildWidget(this._playerContainer);
                this.appendChildWidget(this._navbarContainer);
                this.appendChildWidget(this._sliderContainer);
                Time._refreshTime();
            },

        });
    }
);

