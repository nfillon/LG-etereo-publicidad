define(
    'homeapp/appui/welcomecomponent',
    [
        "antie/widgets/label",
        "homeapp/appui/widgets/i18nlabel",
        "antie/widgets/container",
        "homeapp/appui/i18n"
    ],
    function(Label, Labeli18n, Container, I18n) {
        'use strict';

        return {

            _createWelcomeLabel: function() {
                var component = new Container("welcomeLabel");
                component.appendChildWidget(new Labeli18n("welcome", "welcome"));
                component.appendChildWidget(new Label("guestLabel", templateResponse.guest));
                return component;
            },

            _createWelcomeLabelCustom: function() {
                var component = new Container("welcomeLabel");
                var welcomeText = I18n.translate("hi") + ' ' + templateResponse.guest;
                component.appendChildWidget(new Label("guestLabel", welcomeText));
                component.appendChildWidget(new Label("guestRoomLabel", I18n.translateWithParams('welcometext', [templateResponse.guestRoom])));
                return component;
            },

            _renderWelcomeText: function(){
                var guestLabel = document.getElementById("guestLabel");
                guestLabel.innerText = I18n.translate("hi") + ' ' + templateResponse.guest + ' ';
                var guestRoomLabel = document.getElementById("guestRoomLabel");
                guestRoomLabel.innerText = I18n.translateWithParams('welcometext', [templateResponse.guestRoom]);
            },

            _createWelcomeLabelWithStyle: function() {
                var component = new Container("welcomeLabel");
                var greetingContainer = new Container("greetingContainer");
//                var greetingText = I18n.translate("welcome") + ' ';
                var greetingLabel = new Labeli18n('greetingLabel', 'welcome');//greetingText);

		var welcomeText = ' ' + templateResponse.guest + ' ';
//                var welcomeText = ' ';
                var welcomeLabel = new Label("guestLabel", welcomeText);
                greetingContainer.appendChildWidget(greetingLabel);
                greetingContainer.appendChildWidget(welcomeLabel);
                component.appendChildWidget(greetingContainer);
//                component.appendChildWidget(new Label("guestRoomLabel", I18n.translateWithParams('welcometext', [templateResponse.guestRoom])));
                component.appendChildWidget(new Labeli18n("guestRoomLabel", 'welcometext', false, [templateResponse.guestRoom]));

		return component;
            },


            _renderWelcomeTextWithStyle: function(){
                var greetingLabel = document.getElementById("greetingLabel");
                greetingLabel.innerText = I18n.translate("welcome") + ' ';
                // var guestLabel = document.getElementById("guestLabel");
                // guestLabel.innerText = templateResponse.guest + ' ';
                var guestRoomLabel = document.getElementById("guestRoomLabel");
                guestRoomLabel.innerText = I18n.translateWithParams('welcometext', [templateResponse.guestRoom]);
            },

        }

    }
);
