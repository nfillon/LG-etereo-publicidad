define(
    'homeapp/appui/widgetgenerator',
    [
        'antie/widgets/button',
        'homeapp/appui/services/lgservice',
        'homeapp/appui/widgets/i18nlabel',
        'homeapp/appui/formatters/channelpreviewformatter',
        'antie/widgets/carousel',
        'homeapp/appui/i18n',
        'antie/datasource',
        'homeapp/appui/datasources/languages',
        'homeapp/appui/formatters/languagesformatter',
        'homeapp/appui/datasources/restaurantoptions',
        'homeapp/appui/formatters/restaurantformatter',
        'homeapp/appui/formatters/channelformatter',
        'antie/widgets/image',
        'antie/widgets/container',
        "homeapp/appui/welcomecomponent"
    ],
    function(Button, service, Labeli18n, ChannelPreviewFormatter, Carousel, i18n, DataSource,
             Languages, LanguagesFormatter, Restaurant, RestaurantFormatter, ChannelFormatter, Image, Container, Welcome) {
        'use strict';

        var hasMediaPlayer;
        var hasImage;
        var logEnable = false;

        return {
            _setConfig: function (containsMedia, containsImage) {
                hasMediaPlayer = containsMedia;
                hasImage = containsImage;
            },

            log: function (msg) {
                if(logEnable){
                    var logArea = document.getElementById('log_area');
                    logArea.style.display = 'block';
                    var now = new Date();
                    var timeFromStart = new Number((now.getTime()) / 1000);
                    logArea.innerHTML += ('[' + timeFromStart.toFixed(3) + '][' + now.toLocaleTimeString() + '] ' + JSON.stringify(msg) + '<br/>');
                }
            },

            _initWidgets: function (parent, widget) {
                var self = parent;
                switch (widget.type) {
                    case "TV":
                        return this._createTelevisionButton(self, widget.name);
                        break;
                    case "CHANNELGUIDE":
                        return this._createChannelGuideButton(self, widget.name);
                        break;
                   case "CHANNELGUIDEPREVIEW":
                        return this._createChannelGuideButtonWithPreview(self, widget.name);
                        break;
                    case "APP":
                        return this._createAppButton(self, widget.name, widget.appId);
                        break;
                    case "APPS":
                        return this._createTvAppsButton(self, widget.name);
                        break;
                    case "INFO":
                        return this._createHotelServiceButton(self, widget.name);
                        break;
                    case "EXPERIENCE":
                        return this._createExperienceButton(self, widget.name);
                        break;
                    case "ROOM-SERVICE":
                        return parent._createRoomServiceButton('Room Service');
                        break;
                    case "LANGUAGE":
                        return this._createLanguageButton(self, widget.name);
                        break;
                }
            },

            _createTelevisionButton: function(parent, name) {
                var self = parent;
                var image = '';
                function onSelectFn(ev) {
                    try {
                        if(hasMediaPlayer){
                            self._hcapStop();
                        }
                        hcap.volume.setVolumeLevel({
                            "level" : volume,
                            "onSuccess" : function() {
                                this.log("onSuccess");
                            },
                            "onFailure" : function(f) {
                                this.log("onFailure : errorMessage = " + f.errorMessage);
                            }
                        });
                        service.goToTv();
                    } catch (e) {
                        this.log(e);
                    }
                }
                if(templateResponse.templateName === '3'){
                    image = 'static/img/menu-options/television.png';
                }
                return this._generateWidgetComponent(self, name, image, onSelectFn);
            },

            _createChannelGuideButton: function (parent, name) {
                var self = parent;
                var generator = this;
                var image = '';
                function onSelectFn(ev) {
                    if(templateResponse.templateName === '4'){
                        self._infoContainer.appendChildWidget(
                            self.getCurrentApplication().addComponentContainer(
                                "infoContainer2","homeapp/appui/components/carouselcomponent",
                                generator._getCarouselConfig(self))
                        );
                    } else if(templateResponse.templateName === '3'){
                        self.getCurrentApplication().addComponentContainer(
                            "infoContainer3",
                            "homeapp/appui/components/carouselcomponent",
                            generator._getCarouselConfig(self)
                        );
                        self._sliderContainer.hide(ev);
                    } else if(templateResponse.templateName === '2'){
                        self.getCurrentApplication().addComponentContainer(
                            "modalcontainer",
                            "homeapp/appui/components/carouselcomponent",
                            generator._getCarouselConfig(self)
                        );
                    } else {
                        self.getCurrentApplication().pushComponent(
                            "modalcontainer",
                            "homeapp/appui/components/carouselcomponent",
                            generator._getCarouselConfig(self)
                        );
                    }
                }
                if(templateResponse.templateName === '3' || templateResponse.templateName === '2'){
                    image = 'static/img/menu-options/tvguide.png';
                }
                return this._generateWidgetComponent(self, name, image, onSelectFn);
            },

            _getCarouselConfig: function (parent) {
                var self = parent;
                function _onselectChannel(channel) {
                    if(hasMediaPlayer){
                        self._hcapStop();
                    }
                    service.goToChannel(channel);
                };

                return {
                    home: self, //parametro para poder volver
                    dataSource: templateResponse.channels,
                    formatter: new ChannelFormatter({ onSelect: _onselectChannel}),
                    orientation: Carousel.orientations.VERTICAL,
                    carouselId: 'channelGuideContainer2',
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

            _createChannelGuideButtonWithPreview: function (parent, name) {
                var generator = this;
                function carouselPreviewConfig(ev) {
                    parent._navbarContainer.hide(ev);
                    parent._sliderContainer.hide(ev);
                    generator._onSelectChannelGuideButtonWithPreview(parent);
                }

                var component = new Button('channelGuideButton');
                if(hasImage){
                    var container = new Container("widgetcontainer-"+name);
                    // container.appendChildWidget(new Image('iconimage','https://dummyimage.com/25x25/dbd8db/ffffff&text=' + name));
                    container.appendChildWidget(new Image('iconimage',this._mapImages(name)));
                    component.appendChildWidget(container);
                }
                component.appendChildWidget(new Labeli18n(name, name));
                component.addEventListener('select', function(ev){
                    carouselPreviewConfig(ev);
                });
                return component;
            },

            _onSelectChannelGuideButtonWithPreview: function(self) {
                var generator = this;
                if(hasMediaPlayer){
                    self._hcapStop();
                }
                self.setVideoSize(40,210,385,255);
                self.getCurrentApplication().pushComponent(
                    "modalcontainer",
                    "homeapp/appui/components/channelpreviewcomponent",
                    generator._getCarouselPreviewConfig(self)
                );
            },

            _getCarouselPreviewConfig: function (parent) {
                var self = parent;
                var generator = this;
                function _onselectChannel(channel) {
                    hcap.volume.setVolumeLevel({
                        "level" : volume,
                        "onSuccess" : function() {
                            this.log("onSuccess");
                        },
                        "onFailure" : function(f) {
                            this.log("onFailure : errorMessage = " + f.errorMessage);
                        }
                    });
                    //deberia usarse getvideosize antes para poder aplicarlo aca en cualquier resolucion.
                    self.setVideoSize(0,0,1280,720); //size defecto de pruebas
                    service.goToChannel(channel);
                };

                function _onFocusChannel(channel) {
                    document.getElementById('channelNameContainer').innerHTML = channel.name;
                    document.getElementById('channelNumberContainer').innerHTML = generator._generatePreviewTemplate(channel);
                    service.goToChannelPreview(channel.number);
                };

                return {
                    home: self, //parametro para poder volver
                    dataSource: templateResponse.channels,
                    formatter: new ChannelPreviewFormatter({ onSelectFn: _onselectChannel, onFocusFn: _onFocusChannel}),
                    orientation: Carousel.orientations.VERTICAL,
                    carouselId: 'channelGuideContainer2',
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

            _generatePreviewTemplate: function(channel) {
                var texthtml = "<div class='previewInfoContainer "  + (channel.id > 0 ? 'has-previewNumber' : 'hasnt-previewNumber') + "'>" +
                    (channel.id > 0 ? "<div class='previewNumber'>" + channel.number + "</div>" : '') +
                    "<div class='previewChannel' ><img id='img-"+ channel.image+"' src='"+ channel.image+"' class='previewChannelImg'>" +
                    "</div></div>";
                return texthtml;
            },

            _createAppButton: function(parent, name, appId) {
                var self = parent;
                var image = '';
                function onSelectFn(ev) {
                    try {
                        if(hasMediaPlayer){
                            self._hcapStop();
                        }
                        service.launchExternalApplication(appId, "{}");
                    } catch (e) {
                        this.log(e);
                    }
                }
                if(templateResponse.templateName === '3' || templateResponse.templateName === '2' ){
                    image = 'static/img/menu-options/cast.png';
                }
                return this._generateWidgetComponent(self, name, image, onSelectFn);
            },

            _generateWidgetComponent: function(parent, name, img, onSelectFn){
                var component = new Button();
                if(templateResponse.templateName === '2'){
                    component.appendChildWidget(parent._generateTemplateButton(name, img));
                    component.addEventListener("select", function(ev) {
                        onSelectFn(ev);
                    });
                    return component;
                }
                if(hasImage){
                    if(img){ //si no envio imagen como parametro se utiliza una generica
                        component.appendChildWidget(new Image(name+"_img", img));
                    } else {
                        var container = new Container("widgetcontainer-"+name);
                        // container.appendChildWidget(new Image('iconimage','https://dummyimage.com/25x25/dbd8db/ffffff&text=' + name));
                        container.appendChildWidget(new Image('iconimage',this._mapImages(name)));
                        component.appendChildWidget(container);
                    }

                }
                component.appendChildWidget(new Labeli18n(name,name));
                component.addEventListener("select", function(ev) {
                    onSelectFn(ev);
                });
                return component;
            },

            _mapImages: function(name) {
                if(name === 'television') {
                    return 'static/img/template6/ICONO_TV.png'
                }
                if(name === 'channelguide') {
                    return 'static/img/template6/ICONO_CONTROL.png'
                }
                if(name === 'guestcast') {
                    return 'static/img/template6/ICONO_CAST.png'
                }
                if(name === 'apps') {
                    return 'static/img/template6/ICONO_APPS.png'
                }
                if(name === 'mystay') {
                    return 'static/img/template6/ICONO_INFO.png'
                }
                if(name === 'hotelservice') {
                    return 'static/img/template6/ICONO_HOTELINFO.png'
                }
                if(name === 'language') {
                    return 'static/img/template6/ICONO_LANG.png'
                }
                console.log(name);
                if(name === 'experiences') {
                    return 'static/img/template6/ICONO_EXPERIENCES.png'
                }
            },

            _createTvAppsButton: function(parent, name) {
                var self= parent;
                var generator = this;
                var image = '';
                function onSelectFn(ev) {
                    if(templateResponse.templateName === '4'){
                        self._infoContainer.appendChildWidget(self.getCurrentApplication().addComponentContainer(
                            "infoContainer2",
                            "homeapp/appui/components/template4/appscomponent",
                            generator._getCarouselLanguageConfig(self)
                        ));
                    } else {
                        var container = 'modalcontainer';
                        if(templateResponse.templateName === '5' || templateResponse.templateName === '2'){
                            container = 'maincontainer';
                        }
                        self.getCurrentApplication().pushComponent(container,
                            "homeapp/appui/components/appscomponent", { home: self });
                    }
                    self._sliderContainer.hide(ev);
                    self._navbarContainer.hide(ev);
                }
                if(templateResponse.templateName === '3' || templateResponse.templateName === '2'){
                    image = 'static/img/menu-options/television.png';
                }
                return this._generateWidgetComponent(self, name, image, onSelectFn);
            },

            _createHotelServiceButton: function(parent, name) {
                var self = parent;
                var generator = this;
                var image = '';
                function onSelectFn(ev) {
                    generator._onSelectHotelInfo(self, ev);
                }
                if(templateResponse.templateName === '3' || templateResponse.templateName === '2'){
                    image = 'static/img/menu-options/info.png';
                }
                return this._generateWidgetComponent(self, name, image, onSelectFn);
            },

            _createExperienceButton: function(parent, name) {
                var self = parent;
                var generator = this;
                var image = '';//static/img/menu-options/experience.png';
                function onSelectFn(ev) {
                    generator._onSelectExperience(self, ev);
                }
                return this._generateWidgetComponent(self, name, image, onSelectFn);
            },

            _onSelectHotelInfo: function (self, ev) {
                if(hasMediaPlayer){
                    self._hcapStop();
                }
                if(templateResponse.templateName === '4'){
                    self._infoContainer.appendChildWidget(self.getCurrentApplication().addComponentContainer(
                        "infoContainer2",
                        "homeapp/appui/components/template4/hotelservicecomponent",
                        { home: self }
                    ));
                } else {
                    self.getCurrentApplication().pushComponent("maincontainer",
                        "homeapp/appui/components/hotelservicecomponent-fa", { home: self });
                }
                self._sliderContainer.hide(ev);
            },

            _onSelectExperience: function (self, ev) {
                if(hasMediaPlayer){
                    self._hcapStop();
                }

                self.getCurrentApplication().pushComponent("maincontainer",
                    "homeapp/appui/components/experiencecomponent", { home: self });

                //self._sliderContainer.hide(ev);
            },

            _createLanguageButton: function(parent, name) {
                var self = parent;
                var generator = this;
                var image = '';
                function onSelectFn(ev) {
                    if(templateResponse.templateName === '4'){
                        self._infoContainer.appendChildWidget(self.getCurrentApplication().addComponentContainer(
                            "infoContainer2",
                            "homeapp/appui/components/languagecomponent",
                            generator._getCarouselLanguageConfig(self)
                        ));
                    } else {
                        var container = 'modalcontainer';
                        if(templateResponse.templateName === '3' || templateResponse.templateName === '2'){
                            container = 'maincontainer';
                        }
                        self.getCurrentApplication().pushComponent(
                            container,
                            "homeapp/appui/components/languagecomponent",
                            generator._getCarouselLanguageConfig(self)
                        );
                    }
                }
                if(templateResponse.templateName === '3' || templateResponse.templateName === '2'){
                    image = 'static/img/menu-options/television.png';
                }
                return this._generateWidgetComponent(self, name, image, onSelectFn);
            },

            _getCarouselLanguageConfig: function (parent) {
                var self = parent;

                function _onselectLanguage() {
                    if(hasMediaPlayer){
                        self._hcapStop();
                    }
                    self.render(self.getCurrentApplication().getDevice());
                    if (templateResponse.templateName === '4'){
                        self._verticalListMenu.focus();
                    } else if (templateResponse.templateName === '5' || templateResponse.templateName === '1'){
                        Welcome._renderWelcomeTextWithStyle();
                        self._horizonatalListMenu.focus();
                    } else {
                        if(hasMediaPlayer){
                            self._hcapStart();
                        }
                        self._horizonatalListMenu.focus();
                    }
                };

                return {
                    home: self, //parametro para poder volver
                    description: i18n.translate("language_title"),
                    dataSource: new DataSource(null, new Languages(), 'loadData'),
                    formatter: new LanguagesFormatter({ onSelect: _onselectLanguage}),
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

            _createRestaurantButton: function(parent, name) {
                var self = parent;
                var generator = this;
                var image = '';
                function onSelectFn(ev) {
                    if(templateResponse.templateName === '4'){
                        self._infoContainer.appendChildWidget(self.getCurrentApplication().addComponentContainer(
                            "infoContainer2",
                            "homeapp/appui/components/languagecomponent",
                            generator._getCarouselRestaurantConfig(self)
                        ));
                    } else {
                        var container = 'modalcontainer';
                        if(templateResponse.templateName === '3' || templateResponse.templateName === '2'){
                            container = 'maincontainer';
                        }
                        self.getCurrentApplication().pushComponent(
                            container,
                            "homeapp/appui/components/languagecomponent",
                            generator._getCarouselRestaurantConfig(self)
                        );
                    }
                }
                if(templateResponse.templateName === '3' || templateResponse.templateName === '2'){
                    image = 'static/img/menu-options/television.png';
                }
                return this._generateWidgetComponent(self, name, image, onSelectFn);
            },

            _getCarouselRestaurantConfig: function (parent) {
                var self = parent;

                function _onselectRestaurant() {
                    if(hasMediaPlayer){
                        self._hcapStop();
                    }
                    self.getCurrentApplication().pushComponent(
                        "maincontainer",
                        "homeapp/appui/components/roomservicecomponent",
                        { home: self }
                    );
                };

                return {
                    home: self, //parametro para poder volver
                    description: 'Que desea hacer?',
                    dataSource: new DataSource(null, new Restaurant(), 'loadData'),
                    formatter: new RestaurantFormatter({ onSelect: _onselectRestaurant}),
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
        }

    }
);
