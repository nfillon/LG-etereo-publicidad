define(
    "homeapp/appui/components/experiencecomponent",
    [
        "antie/widgets/component",
        "antie/widgets/container",
        "antie/widgets/image",
        "antie/widgets/label",
        "antie/widgets/horizontallist",
        "antie/widgets/verticallist",
        "antie/widgets/button",
        "homeapp/appui/i18n",
    ],
    function(Component, Container, Image, Label, HorizontalList, VerticalList, Button, I18n) {

        return Component.extend({

            init: function init() {
                var self = this;

                init.base.call(this, "experienceComponent");

                this._createContainers();
                this._createLogoImage();
                this._createPageControl();

                this.addEventListener("beforerender", function(ev) {
                    self._onBeforeRender(ev);
                });

                this.addEventListener("beforeshow", function(ev) {
                    self.home = ev.args.home;
                    self._initCarrousel();
                    self._refreshDescriptions(I18n);
                });
            },

            _createContainers: function () {
                //header
                this._navbarContainer = new Container("navbarContainer");
                this._imageContainer = new Container("imageContainer");
                this._welcomeContainer = new Container("welcomeContainer");
                this._welcomeRow1Container = new Container("welcomeRow1Container");
                this._welcomeRow2Container = new Container("welcomeRow2Container");

                //body
                this._bodyContainer = new Container("bodyContainer");

                //slide
                this._sliderContainer = new Container("sliderContainer");
                this._thankYouMessageContainer = new Container("thankYouMessageContainer");
                this._thankYouMessageRow1Container = new Container("thankYouMessageRow1Container");
                this._thankYouMessageRow2Container = new Container("thankYouMessageRow2Container");
                this._thankYouMessageRow3Container = new Container("thankYouMessageRow3Container");
                this._carrouselControlContainer = new Container("carrouselControlContainer");
            },

            _createLogoImage: function() {
                // this._logoImage = new Image("logoImage", "static/img/logo-chico.png", undefined, 1);
                //this._logoImage = new Image("logoImage", "static/img/template5/LogotipoCP.png", undefined, 1);
                this._logoImage = new Image("logoImage", "static/img/etereo/logo.png", undefined, 1);
            },

            _createPageControl: function() {
                var that = this;

                this._pageControl = new VerticalList('pageControl');

                // CARROUSEL CONTROL

                this._carrouselControl = new HorizontalList("carrouselControl");

                this._carrouselControl.addEventListener("keydown", function(ev) {
                    if (ev.keyCode != 39 && ev.keyCode != 37) {
                        that._replayButton.focus();
                    }
                    that._stopCarrousel();
                });

                templateResponse.experience.images.forEach(function(experience, i) {
                    var component = new Button();
                    component.addEventListener("focus", function(ev) {
                        that._changeImage(i);
                    });
                    that._carrouselControl.appendChildWidget(component);
                });

                //NAVIGATION CONTROL

                this._replayButton = new Button("replayButton");
                this._replayButton.addEventListener("select", function(ev) {
                    that._initCarrousel();
                });
                this._replayButton.appendChildWidget(new Image("replayImage", "static/img/etereo/replay.png", undefined, 1));
                this._replayButton.appendChildWidget(new Label("replayLabel", "Reproducir nuevamente"));
                this._pageControl.appendChildWidget(this._replayButton);

                this._exitButton = new Button("exitButton");
                this._exitButton.addEventListener("select", function(ev) {
                    that.parentWidget.back();
                    that.home.focus();
                    //that.home._sliderContainer.show(ev);
                });
                this._exitButton.appendChildWidget(new Label("exitLabel", "Ir al menú"));
                this._pageControl.appendChildWidget(this._exitButton);
            },


            _goToTheNextImage: function(that) {
                var number = that.currentExperience + 1;
                if (number < templateResponse.experience.images.length) {
                    that._carrouselControl.focus();
                    that._carrouselControl.setActiveChildIndex(number);
                } else {
                    that._stopCarrousel();
                    that._replayButton.focus();
                }
            },

            _initCarrousel: function() {
                this.currentExperience = -1;
                this._goToTheNextImage(this); //LO HAGO ASI PARA QUE EL EFECTO DE REPEAT SEA INSTANTANEO
                this.changeImagePID = setInterval(this._goToTheNextImage, 3000, this);
                this.getCurrentApplication().getDevice().hideElement({ el: this._replayButton.outputElement });
                this.getCurrentApplication().getDevice().hideElement({ el: this._exitButton.outputElement });
            },

            _stopCarrousel: function() {
                clearInterval(this.changeImagePID);
                this.getCurrentApplication().getDevice().showElement({ el: this._replayButton.outputElement });
                this.getCurrentApplication().getDevice().showElement({ el: this._exitButton.outputElement });
            },

            _changeImage: function(number) {
                try {
                    var experienceComponent = document.getElementById('experienceComponent');
                    this.currentExperience = number;
                    var experience = templateResponse.experience.images[this.currentExperience];
                    experienceComponent.style.background =
                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 20%, transparent 40%), ' +
                        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 20%, transparent 40%), ' +
                        'url(\'' + experience.image_url + '\') no-repeat center center fixed';
                } catch (e) {
                    console.log(e);
                }
            },

            _refreshDescriptions: function(I18n) {
                const currentLanguage = I18n.getCurrentLanguageCode();
                templateResponse.experience.languages.forEach(function(language, i) {
                    if(language.language_code === currentLanguage) {
                        var felicidadesLabel = document.getElementById('felicidadesLabel');
                        felicidadesLabel.innerHTML = language.main_header;
                        var namesLabel = document.getElementById('namesLabel');
                        namesLabel.innerHTML = language.title;
                        var thankYouLabel1 = document.getElementById('thankYouLabel1');
                        thankYouLabel1.innerHTML = language.main_footer;
                        var thankYouLabel2 = document.getElementById('thankYouLabel2');
                        thankYouLabel2.innerHTML = language.footer_text1;
                        var thankYouLabel3 = document.getElementById('thankYouLabel3');
                        thankYouLabel3.innerHTML = language.footer_text2;
                    }
                });
            },

            _onBeforeRender: function(ev) {
                this._imageContainer.appendChildWidget(this._logoImage);
                this._navbarContainer.appendChildWidget(this._imageContainer);

                this._welcomeRow1Container.appendChildWidget(new Label("felicidadesLabel", ""));
                this._welcomeRow2Container.appendChildWidget(new Label("namesLabel", ""));
                this._welcomeContainer.appendChildWidget(this._welcomeRow1Container);
                this._welcomeContainer.appendChildWidget(this._welcomeRow2Container);
                this._navbarContainer.appendChildWidget(this._welcomeContainer);

                this._thankYouMessageRow1Container.appendChildWidget(new Label("thankYouLabel1", ""));
                this._thankYouMessageRow2Container.appendChildWidget(new Label("thankYouLabel2", ""));
                this._thankYouMessageRow3Container.appendChildWidget(new Label("thankYouLabel3", ""));
                this._thankYouMessageContainer.appendChildWidget(this._thankYouMessageRow1Container);
                this._thankYouMessageContainer.appendChildWidget(this._thankYouMessageRow2Container);
                this._thankYouMessageContainer.appendChildWidget(this._thankYouMessageRow3Container);
                this._sliderContainer.appendChildWidget(this._thankYouMessageContainer);

                this.appendChildWidget(this._navbarContainer);
                this.appendChildWidget(this._bodyContainer);
                this.appendChildWidget(this._sliderContainer);

                this._carrouselControlContainer.appendChildWidget(this._carrouselControl);
                this._pageControl.appendChildWidget(this._carrouselControlContainer);
                this.appendChildWidget(this._pageControl);
            },


        });

    }
);
