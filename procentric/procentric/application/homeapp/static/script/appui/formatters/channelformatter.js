define(
    "homeapp/appui/formatters/channelformatter",
    [
        "homeapp/appui/services/lgservice",
        "antie/formatter",
        "antie/widgets/label",
        "antie/widgets/button",
        "antie/widgets/image",
        "antie/widgets/horizontallist"
    ],
    function(service, Formatter, Label, Button, Image, HorizontalList) {

        function createChannelButton(index, channel, onSelect, space) {
            var channelNumber = new Label(channel.number);
            channelNumber.addClass("channelNumber");
            var channelTitle = new Label(channel.name);
            channelTitle.addClass("channelTitle");
            var channelButton = new Button("channel-" + channel.number);
            channelButton.appendChildWidget(channelNumber);
            channelButton.appendChildWidget(new Image("channel-img-" + channel.id , channel.image));
            channelButton.appendChildWidget(channelTitle);
            channelButton.addClass("channel-space-" + space);
            channelButton.addEventListener('select', function (){
                onSelect(channel.number);
            });
            return channelButton;
        }

        function obtainChannelPerRow(channelRow) {
            var channelRow = 9;
            if(templateResponse.templateName === '4') {
                channelRow = 6;
            }
            if (window.innerWidth > 1900) {
                channelRow = 13;
            }
            return channelRow;
        }

        return Formatter.extend({
            format : function (iterator) {

                var item;
                var horizontalList = new HorizontalList("channel-row-"+iterator.getPointer());
                var contador = 0;
                var channelRow = obtainChannelPerRow(channelRow);
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
                    console.log(item, space);
                    horizontalList.appendChildWidget(createChannelButton(iterator.getPointer(), item, this._opts.onSelect, space));
                }
                return horizontalList;
            }
        });
    }
);