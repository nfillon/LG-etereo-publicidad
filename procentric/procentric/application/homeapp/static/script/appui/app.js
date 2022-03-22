define(
  'homeapp/appui/app',
  [
    'antie/application',
    'antie/widgets/container'
  ],
  function(Application, Container) {

    return Application.extend({
      init: function init (appDiv, styleDir, imgDir, callback) {
        init.base.call(this, appDiv, styleDir, imgDir, callback);

        var self = this;

        // Sets the root widget of the application to be an empty container
        this._setRootContainer = function() {
          var container = new Container();
          container.outputElement = appDiv;
          self.setRootWidget(container);
        };
      },

      run: function() {
        // Called from run() as we need the framework to be ready beforehand.
        this._setRootContainer();

        // Create maincontainer and add simple component to it
        var mainComponent = "homeapp/appui/components/template" + templateResponse.templateName + '/home';
        this.addComponentContainer("maincontainer", mainComponent);
        this.addComponentContainer("modalcontainer");
        this.getDevice().loadStyleSheet('static/style/template' + templateResponse.templateName + '.css');
      }
    });
  }
);
