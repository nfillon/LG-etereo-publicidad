define(
    'homeapp/appui/timecomponent',
    [
        "antie/widgets/label",
        "antie/widgets/container",
        "homeapp/appui/widgetgenerator",
    ],
    function(Label, Container, WG) {
        'use strict';

        return {

            _setInterval: function() {
                setInterval(this._refreshTime, 1000);
            },

            _createTimeLabel: function() {
                return new Label("timeLabel", "");
            },

            _createTimeLabelContainer: function() {
                return new Container("timeLabel");
            },

            _refreshTime: function() {
                try {
                    var date = new Date();
                    var timeArea = document.getElementById('timeLabel');
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? '0'+minutes : minutes;
                    if(templateResponse.templateName === '3' || templateResponse.templateName === '1' || templateResponse.templateName === '5'){
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                        ];
                        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        var day = date.getDay();
                        var monthday = date.getUTCDate();
                        var month = date.getMonth();
                        var year = date.getFullYear();
                        timeArea.innerHTML = '<div class="hour">' + hours + ':' + minutes + ' ' + ampm + '</div>' +
                            '<div class="day"> ' + dayNames[day] + '</div>' +
                            '<div class="fullDate"> ' +
                            monthday +  '   ' + monthNames[month] +  '   ' + year + '</div>';
                    } else if(templateResponse.templateName === '4'){
                        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ];
                        var day = date.getDay();
                        var month = date.getMonth();
                        var year = date.getFullYear();
                        timeArea.innerHTML = monthNames[month] + ' ' + day + ' , ' + year + '    ' + hours + ':' + minutes + ' ' + ampm ;
                    // } else if(templateResponse.templateName === '5'){
                    //     const monthNames = ["January", "February", "March", "April", "May", "June",
                    //         "July", "August", "September", "October", "November", "December"
                    //     ];
                    //     const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    //     var day = date.getDay();
                    //     var monthday = date.getUTCDate();
                    //     var month = date.getMonth();
                    //     var year = date.getFullYear();
                    //     timeArea.innerHTML = '<div id="timeNow"><div id="timeNumber">' + hours + ':' + minutes + '</div><div>' + ampm + '</div></div><div> ' + dayNames[day] + ' | ' +
                    //         monthday +  '   ' + monthNames[month] +  '   ' + year + '</div>';
                    } else {
                        timeArea.innerHTML = hours + ':' + minutes + ' ' + ampm;
                    }
                } catch (e) {
                    WG.log(e)
                }
            },
        }

    }
);
