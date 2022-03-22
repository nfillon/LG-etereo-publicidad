define(
    "homeapp/appui/formatters/restaurantformatter",
    [
        "homeapp/appui/i18n",
        "antie/formatter",
        "antie/widgets/label",
        "antie/widgets/button",
        "antie/widgets/image",
        "antie/widgets/container",
    ],
    function(i18n, Formatter, Label, Button, Image, Container) {

        return Formatter.extend({
            format : function (iterator) {
                var button, item;
                var onSelectFn = this._opts.onSelect;
                var onFocusFn = this._opts.onFocus;
                item = iterator.next();
                button = new Button("appOption" + iterator.getPointer());
                // var texto = i18n.translate(item.name);
                // button.appendChildWidget(new Label(item.id,item.name));
                button.appendChildWidget(new Image("app-img-" + item.id , item.image));
                button.addEventListener("focus",onFocusFn);
                button.addEventListener("select", function(){
                    onSelectFn(item.id);
                });
                button.content = item.description;
                button.img = item.image;
                return button;
            }
        });
    }
);