define(
  'homeapp/appui/app',
  [
    'antie/application',
    'antie/widgets/container'
  ],
  function(Application, Container) {

    return Application.extend({
      init: function init (appDiv, styleDir, imgDir, callback) {
log('8');
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
log('9');
        this._setRootContainer();
log('10');

        // Create maincontainer and add simple component to it
        var mainComponent = "homeapp/appui/components/template" + templateResponse.templateName + '/home';
        this.addComponentContainer("maincontainer", mainComponent);
        this.addComponentContainer("modalcontainer");
log('11');
        this.getDevice().loadStyleSheet('static/style/template' + templateResponse.templateName + '.css');
log('12');
      }
    });
  }
);
