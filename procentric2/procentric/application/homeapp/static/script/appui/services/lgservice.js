define(
    'homeapp/appui/services/lgservice',

    function () {
            'use strict';
        var tvservice = hcap;
        var media = tvservice.Media;
        var logEnable = false;

        var instance = {};
        instance.getService = getService;
        instance.getMediaService = getMediaService;
        instance.getHcapModeForHome = getHcapModeForHome;
        instance.onKeyDown = onKeyDown;
        instance.launchExternalApplication = launchExternalApplication;
        instance.setBackgroundMode = setBackgroundMode;
        instance.goToTv = goToTv;
        instance.appVolumeChangeTo = appVolumeChangeTo;
        instance.goToChannel = goToChannel;
        instance.goToChannelPreview = goToChannelPreview;
        instance.initMedia = initMedia;
        instance.stopMedia = stopMedia;
        instance.setVideoSize = setVideoSize;
        instance.getVideoSize = getVideoSize;
        instance.log = log;

        return instance;

        function getService(){
            return tvservice;
        }

        function getMediaService() {
            return media;
        }

        function getHcapModeForHome(event, WG, that) {
            hcap.mode.getHcapMode({
                "onSuccess" : function(s) {
                    log('onSuccesHcapHome');
                    if(s.mode === 258){
                        log("onSuccess : current hcap mode = " + s.mode);
                        if(event.keyCode === 458){ //keycode del boton channel/guide
                            WG._onSelectChannelGuideButtonWithPreview(that);
                        } else if(event.keyCode === 457){ //keycode del boton info
                            // WG._onSelectHotelInfo(that, event);
                            launchExternalApplication("com.nimbus.app","{}");
                        }
                    } else {
                        appVolumeChangeTo(0);
                        onKeyDown(event.keyCode);
                    }
                },
                "onFailure" : function(f) {
                    log("onFailure : errorMessage = " + f.errorMessage);
                }
            });
        }

        function onKeyDown(keyCode, onSuccesFn) {
            /// Guide, info, portal
            var exit_keys = [458, 457, 602];
            if (exit_keys.indexOf(keyCode) >= 0) {
                tvservice.mode.setHcapMode({
                    mode: tvservice.mode.HCAP_MODE_1,
                    onSuccess: function () {
                        log("onsucces mode 1");
                        // onSuccesFn();
                    },
                    onFailure: function (f) {
                        log("onfailure" + f.errorMessage);
                    }
                });
            }
        }
/*
        function launchExternalApplication(appId, parameters, onSuccesFn, onErrorFn) {
            tvservice.mode.setHcapMode({
                mode: tvservice.mode.HCAP_MODE_0,
                onSuccess: function() {
                    tvservice.application.launchApplication({
                        id: appId,
                        parameters: parameters,
                        onSuccess: function () {
                            onSuccesFn();
                        },
                        onFailure: function (f) {
                            onErrorFn(f);
                        }
                    });
                },
                onFailure: function (f) {
                    log("onErrorMode : " + JSON.stringify(f, null,2));
                }
            });
        }
*/
	function launchExternalApplication(appId, parameters, onSuccesFn, onErrorFn) {
            tvservice.mode.setHcapMode({
                mode: tvservice.mode.HCAP_MODE_0,
                onSuccess: function() {
                    if (appId == 'com.nimbus.app') {
                        tvservice.externalinput.setCurrentExternalInput({
                            type: tvservice.externalinput.ExternalInputType.HDMI,
                            index: 1,
                            onSuccess: function() {
                                onSuccesFn();
                            },
                            onFailure: function(f) {
                                log("onErrortv : " + JSON.stringify(f, null,2));
                            }
                        });
                    } else {
                        tvservice.application.launchApplication({
                            id: appId,
                            parameters: parameters,
                            onSuccess: function () {
                                onSuccesFn();
                            },
                            onFailure: function (f) {
                                onErrorFn(f);
			    }
                        });
                    }
                },
                onFailure: function (f) {
                    log("onErrorMode : " + JSON.stringify(f, null,2));
                }
            });
        }

        function setBackgroundMode(onSuccesFn, onErrorFn) {
            tvservice.mode.setHcapMode({
                mode: tvservice.mode.HCAP_MODE_0,
                onSuccess: function() {
                    onSuccesFn();
                },
                onFailure: function (f) {
                    onErrorFn(f);
                }
            });
        }

        function goToTv(onSuccesFn, onErrorFn) {
            tvservice.mode.setHcapMode({
                mode: tvservice.mode.HCAP_MODE_0,
                onSuccess: function() {
                    tvservice.externalinput.setCurrentExternalInput({
                        type: tvservice.externalinput.ExternalInputType.TV,
                        index: 0,
                        onSuccess: function() {
                            onSuccesFn();
                        },
                        onFailure: function(f) {
                            log("onErrortv : " + JSON.stringify(f, null,2));
                        }
                    });
                },
                onFailure: function (f) {
                    log("onErrorMode : " + JSON.stringify(f, null,2));
                }
            });
        }

        function appVolumeChangeTo(newVolume) {
            tvservice.volume.getVolumeLevel({
                "onSuccess" : function(s) {
                    volume = s.level;
                    if (volume !== newVolume){
                        tvservice.volume.setVolumeLevel({
                            "level" : newVolume,
                            "onSuccess" : function() {
                                log("onSuccess");
                            },
                            "onFailure" : function(f) {
                                log("onFailure : errorMessage = " + f.errorMessage);
                            }
                        });
                    }
                },
                "onFailure" : function(f) {
                    log("onFailure : errorMessage = " + f.errorMessage);
                }
            });
        }

        function goToChannel(channel, onSuccesFn) {
            tvservice.channel.requestChangeCurrentChannel({
                channelType : tvservice.channel.ChannelType.RF,
                //majorNumber : channel,
                //minorNumber : 1,
                logicalNumber : channel,
                rfBroadcastType : tvservice.channel.RfBroadcastType.CABLE,
                onSuccess : function() {
                    tvservice.mode.setHcapMode({
                        mode: tvservice.mode.HCAP_MODE_0,
                    });
                },
                onFailure: function(f) {
                    log(f);
                }
            });
        }

        function goToChannelPreview(channel) {
            tvservice.channel.requestChangeCurrentChannel({
                channelType : tvservice.channel.ChannelType.RF,
                //majorNumber : channel,
                //minorNumber : 1,
                logicalNumber : channel,
                rfBroadcastType : tvservice.channel.RfBroadcastType.CABLE,
                onSuccess : function() {
                },
                onFailure: function(f) {
                    log(f);
                }
            });
        }

        function initMedia(onSuccesFn, onErrorFn) {
            media.startUp({
                onSuccess: function() {
                    this.log("onsucces initmedia");
                    media.createMedia();
                    onSuccesFn();
                },
                onFailure: function() {
                    onErrorFn();
                }
            });
        }

        function stopMedia(onSuccesFn, onErrorFn) {
            log(media.getState());
            media.shutDown({
                onSuccess: function() {
                    onSuccesFn();
                },
                onFailure: function() {
                    onErrorFn();
                }
            });
        }

        function setVideoSize(x,y,width,height) {
            tvservice.video.setVideoSize({
                "x" : x,
                "y" : y,
                "width" : width,
                "height" : height,
                "onSuccess" : function() {
                    // log("onSuccess");
                },
                "onFailure" : function(f) {
                    log("onFailure : errorMessage = " + f.errorMessage);
                }
            });
        }

        function getVideoSize() {
            tvservice.video.getVideoSize({
                "onSuccess" : function(s) {
                    // log("onSuccess");
                    return s;
                },
                "onFailure" : function(f) {
                    log("onFailure : errorMessage = " + f.errorMessage);
                }
            });
        }

        function log(msg) {
            if (logEnable) {
                var logArea = document.getElementById('log_area');
                logArea.style.display = 'block';
                var now = new Date();
                var timeFromStart = new Number((now.getTime()) / 1000);
                logArea.innerHTML += ('[' + timeFromStart.toFixed(3) + '][' + now.toLocaleTimeString() + '] ' + JSON.stringify(msg) + '<br/>');
            }
        }
    }
);
