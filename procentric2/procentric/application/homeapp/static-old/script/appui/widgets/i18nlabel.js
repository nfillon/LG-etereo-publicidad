define(
    'homeapp/appui/widgets/i18nlabel',
    ['antie/widgets/label',
        "homeapp/appui/i18n"],
    function(AntieLabel, i18n) {
        'use strict';

        var Label = AntieLabel.extend({

            init: function init(id, text, enableHTML, params) {
                // The current API states that if only one parameter is passed to
                // use that value as the text and auto generate an internal id
                if(arguments.length === 1) {
                    this._params = [ ];
		    this._text = id
                    init.base.call(this, id);
                } else {
                    this._params = params || [ ];
		    this._text = text;
                    init.base.call(this, id, text);
                }

                this._truncationMode = Label.TRUNCATION_MODE_NONE;
                this._maxLines = 0;
                this._enableHTML = enableHTML || false;
                this._width = 0;
                this.addClass('label');
            },

            //Se redefine el render del label para poder aplicar i18n
            render: function render (device) {
                var s = this.getTextAsRendered(device);

s = s == 'guestRoomLabel' ? 'welcometext' : s;
s = s == 'greetingLabel' ? 'welcome' : s;

                if (!this.outputElement) {
                    this.outputElement = device.createLabel(this.id, this.getClasses(), s, this._enableHTML);
                } else {
			console.log(this, this._params);
                    device.setElementContent(this.outputElement, (this._params.length > 0 ? i18n.translateWithParams(s, this._params) : i18n.translate(s)), this._enableHTML);
                }


                return this.outputElement;
            },
        });
        return Label;
    }
);
