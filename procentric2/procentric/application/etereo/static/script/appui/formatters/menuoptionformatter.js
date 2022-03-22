define(
    "homeapp/appui/formatters/menuoptionformatter",
    [
        "antie/formatter",
        "antie/widgets/label",
        "antie/widgets/button",
        "antie/widgets/horizontallist"
    ],
    function(Formatter, Label, Button, HorizontalList) {
        return Formatter.extend({
            format: function(iterator) {
                var widget;
                var horizontalList = new HorizontalList("channel-row-"+iterator.getPointer());
                var contador = 0;
                var channelRow = 5;
                if(window.innerWidth > 1900){
                    channelRow = 5;
                }
                while (iterator.hasNext() && contador < channelRow){
                    widget = iterator.next();
                    horizontalList.appendChildWidget(this._opts.generator(this._opts.parent, widget));
                    contador ++;
                }
                return horizontalList;
            }
        });
    }
);
