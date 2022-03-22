define(
    "homeapp/appui/formatters/menubarformatter",
    [
        "antie/formatter",
        "antie/widgets/label",
        "antie/widgets/button",
        "homeapp/appui/i18n"
    ],
    function(Formatter, Label, Button, I18n) {
        function generateStlyeClass(item) {
            return '' +
                '.bg-' + item.id + '{' +
                '      position: relative;' +
                '    overflow: hidden;' +
                '    width: 100%;' +
                '    height: 100%;' +
                '    background: url(' + item.image + ') no-repeat !important;' +
                '    -webkit-background-size: cover !important;' +
                '    -moz-background-size: cover !important;' +
                '    -o-background-size: cover !important;' +
                '    background-size: cover !important;' +
                '}';
        }

        return Formatter.extend({
            format: function(iterator) {
                var item = iterator.next();
                var button = new Button("menubarOption" + iterator.getPointer());
                var currentLanguage = I18n.getCurrentLanguageCode();
                var onFocusFn;
                var onSelectFn;
                var onFocus = this._opts.onSelect;
                if(item.childs){
                    onFocusFn = this._opts.onFocusChilds;
                    onSelectFn = this._opts.onSelectChilds;
                }
                item.hotel_info_languages.forEach(function (language) {
                    if(language.language_code == currentLanguage ||
                        (language.language_code === 'en' && !button.content)){
                        button.removeChildWidgets();
                        button.appendChildWidget(new Label(language.name));
                        if(item.childs){
                            button.childs = item.childs;
                            button.addEventListener("focus", function (){
                                onFocusFn(language);
                            });
                            button.addEventListener("select", function (){
                                onSelectFn(language);
                            })
                        } else {
                            button.addEventListener("focus", onFocus);
                        }
                        button.content = language.description;
                        button.background = 'bg-'+item.id;
                        button.cssClass = generateStlyeClass(item);
                    }
                });
                return button;
            }
        });
    }
);
