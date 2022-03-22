define(
    'homeapp/appui/widgets/i18nlabel',
    ['antie/widgets/label',
        "homeapp/appui/i18n"],
    function(AntieLabel, i18n) {
        'use strict';

        var Label = AntieLabel.extend({
            //Se redefine el render del label para poder aplicar i18n
            render: function render (device) {
                var s = this.getTextAsRendered(device);

                if (!this.outputElement) {
                    this.outputElement = device.createLabel(this.id, this.getClasses(), s, this._enableHTML);
                } else {
                    device.setElementContent(this.outputElement, i18n.translate(s), this._enableHTML);
                }

                return this.outputElement;
            },
        });
        return Label;
    }
);