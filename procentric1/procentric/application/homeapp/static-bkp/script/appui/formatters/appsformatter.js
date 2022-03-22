define(
    "homeapp/appui/formatters/appsformatter",
    [
        "antie/formatter",
        "antie/widgets/label",
        "antie/widgets/image",
        "antie/widgets/button",
        "homeapp/appui/i18n"
    ],
    function(Formatter, Label, Image, Button, I18n) {
        return Formatter.extend({
            format: function(iterator) {
                var currentLanguage = I18n.getCurrentLanguageCode();
                var item = iterator.next();
                var onSelectFn = this._opts.onSelect;
                var onFocusFn = this._opts.onFocus;
                var button = new Button("appOption" + iterator.getPointer());
                item.languages.forEach(function (language) {
                    if(language.language_code == currentLanguage ||
                        (language.language_code === 'en' && !button.content)){
                        button.removeChildWidgets();
                        if(templateResponse.templateName === '4') {
                            button.appendChildWidget(new Label(item.name));
                            button.addEventListener("focus", function(){
                                onFocusFn(item)
                            });
                        } else {
                            button = new Button("appOption" + iterator.getPointer());
                            button.appendChildWidget(new Image("app-img-" + item.name , item.image));
                            button.addEventListener("focus",onFocusFn);
                        }

                        button.addEventListener("select", function(){
                            onSelectFn(item.app_id);
                        });
                        button.content = language.description;
                        button.img = item.image;
                    }
                });
                return button;
            }
        });
    }
);
