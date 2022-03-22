define(
    "homeapp/appui/formatters/languagesformatter",
    [
        "homeapp/appui/i18n",
        "antie/formatter",
        "antie/widgets/label",
        "antie/widgets/button",
    ],
    function(i18n, Formatter, Label, Button) {

        return Formatter.extend({
            format : function (iterator) {
                var button, item;
                item = iterator.next();
                button = new Button("language" + item.id);
                var texto = i18n.translate(item.id);
                button.appendChildWidget(new Label(texto,texto));

                function _changeLanguage() {
                    i18n.setCurrentLanguageCode(item.id);
                }

                button.addEventListener("focus", _changeLanguage);
                button.addEventListener("select",this._opts.onSelect);
                return button;
            }
        });
    }
);