define(
    "homeapp/appui/formatters/channelpreviewformatter",
    [
        "antie/formatter",
        "antie/widgets/button",
        "antie/widgets/image",
        "antie/widgets/horizontallist"
    ],
    function(Formatter, Button, Image, HorizontalList) {

        function createChannelButton(index, channel, options, space) {
            var onFocusFn = options.onFocusFn;
            var onSelectFn = options.onSelectFn;
            var channelButton = new Button("channel-" + channel.number);
            channelButton.appendChildWidget(new Image("channel-img-" + channel.id , channel.image));
            channelButton.addClass("channel-space-" + space);
            channelButton.addEventListener("focus", function (){
                onFocusFn(channel);
            });
            channelButton.addEventListener("select", function (){
                onSelectFn(channel.number);
            });
            return channelButton;
        }

        return Formatter.extend({
            format : function (iterator) {
                var item;
                var horizontalList = new HorizontalList("channel-row-"+iterator.getPointer());
                var contador = 0;
                var channelRow = 5;
                while (iterator.hasNext() && contador < channelRow){
                    item = iterator.next();
                    var space = 1;
                    if (item.name.toLowerCase() == 'guestcast') {
                        if (GUESTCAST_BUTTON_SPACE) {
                            space = GUESTCAST_BUTTON_SPACE;
                            contador += GUESTCAST_BUTTON_SPACE;

                        } else {
                            space = channelRow - contador;
                            contador = channelRow;
                        }
                    } else {
                        contador ++;
                    }
                    horizontalList.appendChildWidget(createChannelButton(iterator.getPointer(), item, this._opts, space));
                }
                horizontalList.addEventListener('keydown', function(e){
                    if(e.keyCode === 37 && currentChannelIndex > 0){
                        currentChannelIndex--;
                    }
                    if(e.keyCode === 39 && currentChannelIndex < 4) {
                        currentChannelIndex++;
                    }
                });
                return horizontalList;
            }
        });
    }
);
