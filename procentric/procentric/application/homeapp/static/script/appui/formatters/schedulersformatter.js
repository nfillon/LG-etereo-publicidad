define(
    "homeapp/appui/formatters/schedulersformatter",
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
                var onselect = this._opts.onSelect;
                item = iterator.next();
                button = new Button("scheduler" + item.id);
                button.appendChildWidget(new Label(item.id,item.description));

                function onSelect(){
                    onselect(item.description);
                }
                button.addEventListener("select",onSelect);
                return button;
            }
        });
    }
);