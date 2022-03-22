define(
  'homeapp/appui/modules/experiences/main',
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
          console.log('aca');
          self._initCarrousel();
          self._initClock();
        });
      },

      _createContainers: function () {
        //header
        this._navbarContainer = new Container("navbarContainer");
        this._imageContainer = new Container("imageContainer");
        this._welcomeContainer = new Container("welcomeContainer");
        this._welcomeRow1Container = new Container("welcomeRow1Container");
        this._welcomeRow2Container = new Container("welcomeRow2Container");
        this._timeContainer = new Container("timeContainer");

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
        this._logoImage = new Image("logoImage", "static/img/hotel_riazor/logo.png", undefined, 1);
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

        templateResponse.experiences.forEach(function(experience, i) {
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
        this._replayButton.appendChildWidget(new Image("replayImage", "static/img/hotel_riazor/replay.png", undefined, 1));
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

      _createTimeLabel: function() {
        return new Label("timeLabel", "");
      },

      _initClock: function() {
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
          console.log(e);
        }
      },

      _goToTheNextImage: function(that) {
        var number = that.currentExperience + 1;
        if (number < templateResponse.experiences.length) {
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
        this.changeImagePID = setInterval(this._goToTheNextImage, 6000, this);
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
          var experience = templateResponse.experiences[this.currentExperience];
          experienceComponent.style.background = 
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 20%, transparent 40%), ' +
              'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 20%, transparent 40%), ' + 
              'url(\'' + experience.img + '\') no-repeat center center fixed';
        } catch (e) {
          console.log(e);
        }
      },

      _onBeforeRender: function(ev) {
        this._imageContainer.appendChildWidget(this._logoImage);
        this._navbarContainer.appendChildWidget(this._imageContainer);
       
        this._welcomeRow1Container.appendChildWidget(new Label("felicidadesLabel", "¡Felicidades!"));
        this._welcomeRow2Container.appendChildWidget(new Label("namesLabel", "Ana y Luis"));
        this._welcomeContainer.appendChildWidget(this._welcomeRow1Container);
        this._welcomeContainer.appendChildWidget(this._welcomeRow2Container);
        this._navbarContainer.appendChildWidget(this._welcomeContainer);

        this._timeContainer.appendChildWidget(this._createTimeLabel());
        this._navbarContainer.appendChildWidget(this._timeContainer);

        this._thankYouMessageRow1Container.appendChildWidget(new Label("thankYouLabel1", "Gracias"));
        this._thankYouMessageRow2Container.appendChildWidget(new Label("thankYouLabel2", "Por compartir con nosotros su"));
        this._thankYouMessageRow3Container.appendChildWidget(new Label("thankYouLabel3", "experiencia Riazor"));
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

        this._refreshTime(I18n);
      },


    });

  }
);
