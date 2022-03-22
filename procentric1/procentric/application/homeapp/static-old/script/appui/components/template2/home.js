define(
    "homeapp/appui/components/template2/home",
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
        "antie/widgets/horizontallist",
        "antie/datasource",
        "antie/widgets/carousel",
        "homeapp/appui/formatters/menuoptionformatter"
    ],
    function (i18n, WG, Time, Welcome, service, Component, Container, Image, Button, Label, Labeli18n,
              HorizontalList, DataSource, Carousel, MenuOptionFormatter) {

        return Component.extend({
            init: function init () {
                var self = this;
                // It is important to call the constructor of the superclass
                init.base.call(this, "home-2-component");

                WG._setConfig(false, true);
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
                    Time._setInterval();
                });

                this.addEventListener('keydown', function(e){

                    try {
                        service.onKeyDown(e.keyCode);
                    } catch (e) {
                        WG.log(e);
                    }
                })
            },

            _createContainers: function() {
                this._navbarContainer = new Container("navbarContainer");
                this._headerContainer = new Container("headerContainer");
                this._sliderContainer = new Container("sliderContainer");
            },

            _createLogoImage: function() {
                this._logoImage = new Image("logoImage", "static/img/logo-chico.png", {width:200, height:200}, 1);
            },

            _createHorizontalListMenu: function() {
                this.appendChildWidget(this.getCurrentApplication().addComponentContainer("sliderContainer","homeapp/appui/components/carouselmenucomponent",
                    this._getCarouselMenuConfig()));
            },

            _getCarouselMenuConfig: function () {
                var self = this;
                function generateButton(parent,widget) {
                    return WG._initWidgets(parent, widget);
                }
                return {
                    dataSource: templateResponse.menuOptions,
                    formatter: new MenuOptionFormatter({ parent: self, generator: generateButton}),
                    orientation: Carousel.orientations.VERTICAL,
                    carouselId: 'sliderContainer',
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

            _generateTemplateButton: function(name, image){
                var btnGuideContainer = new Container(name +'guideButtonContainer');
                var iconImage = new Image('iconimage','https://dummyimage.com/40x40/dbd8db/ffffff&text=' + image);
                var innerLabel = new Labeli18n('inner-label-' + name, name);
                var outerLabel = new Labeli18n('label-' + name, name);
                var bgImage = new Button("guideButton");
                bgImage.appendChildWidget(iconImage);
                bgImage.appendChildWidget(innerLabel);
                btnGuideContainer.appendChildWidget(bgImage);
                btnGuideContainer.appendChildWidget(outerLabel);
                return btnGuideContainer;
            },

            _onBeforeRender: function(ev) {
                this._headerContainer.appendChildWidget(Time._createTimeLabel());
                this._navbarContainer.appendChildWidget(this._logoImage);
                this._headerContainer.appendChildWidget(Welcome._createWelcomeLabel());
                this.appendChildWidget(this._headerContainer);
                this.appendChildWidget(this._navbarContainer);
                this.appendChildWidget(this._sliderContainer);
                Time._refreshTime();
            },

        });
    }
);