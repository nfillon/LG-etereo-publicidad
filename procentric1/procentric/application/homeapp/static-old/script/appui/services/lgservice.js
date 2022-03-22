define(
    'homeapp/appui/services/lgservice',

    function () {
        'use strict';
        var tvservice = hcap;
        var media = tvservice.Media;

        return {
            getService: function(){
                return tvservice;
            },

            getMediaService: function(){
                return media;
            },

            onKeyDown: function(keyCode, onSuccesFn) {
                /// Guide, info, portal
                var exit_keys = [458, 457, 602];
                if (exit_keys.indexOf(keyCode) >= 0) {
                    tvservice.mode.setHcapMode({
                        mode: tvservice.mode.HCAP_MODE_1,
                        onSuccess: function () {
                            this.log("onsucces mode 1");
                            // onSuccesFn();
                        },
                        onFailure: function (f) {
                            this.log("onfailure" + f.errorMessage);
                        }
                    });
                }
            },

            launchExternalApplication: function(appId, parameters, onSuccesFn, onErrorFn) {
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
                        	        this.log("onErrortv : " + JSON.stringify(f, null,2));
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
                        this.log("onErrorMode : " + JSON.stringify(f, null,2));
                    }
                });
            },

            setBackgroundMode: function(onSuccesFn, onErrorFn) {
                tvservice.mode.setHcapMode({
                    mode: tvservice.mode.HCAP_MODE_0,
                    onSuccess: function() {
                        onSuccesFn();
                    },
                    onFailure: function (f) {
                        onErrorFn(f);
                    }
                });
            },

            goToTv: function (onSuccesFn, onErrorFn) {
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
                                this.log("onErrortv : " + JSON.stringify(f, null,2));
                            }
                        });
                    },
                    onFailure: function (f) {
                        this.log("onErrorMode : " + JSON.stringify(f, null,2));
                    }
                });
            },

            appVolumeChangeTo: function (newVolume) {
                tvservice.volume.getVolumeLevel({
                    "onSuccess" : function(s) {
                        volume = s.level;
                        tvservice.volume.setVolumeLevel({
                            "level" : newVolume,
                            "onSuccess" : function() {
                                this.log("onSuccess");
                            },
                            "onFailure" : function(f) {
                                this.log("onFailure : errorMessage = " + f.errorMessage);
                            }
                        });
                    },
                    "onFailure" : function(f) {
                        this.log("onFailure : errorMessage = " + f.errorMessage);
                    }
                });
            },

            goToChannel: function (channel, onSuccesFn) {
var that = this;
                tvservice.channel.requestChangeCurrentChannel({
                    channelType : tvservice.channel.ChannelType.RF,
//                    majorNumber : channel,
//                    minorNumber : 1,
                    logicalNumber : channel,
                    rfBroadcastType : tvservice.channel.RfBroadcastType.CABLE,
                    onSuccess : function() {
                        tvservice.mode.setHcapMode({
                            mode: tvservice.mode.HCAP_MODE_0,
                        });
                    },
                    onFailure: function(f) {
                        that.log(f);
                    }
                });
            },

            goToChannelPreview: function (channel) {
var that = this;		   
                tvservice.channel.requestChangeCurrentChannel({
                    channelType : tvservice.channel.ChannelType.RF,
//                    majorNumber : channel,
//                    minorNumber : 1,
                    logicalNumber : channel,
                    rfBroadcastType : tvservice.channel.RfBroadcastType.CABLE,
                    onSuccess : function() {
                    },
                    onFailure: function(f) {
                        that.log(f);
                    }
                });
            },

            initMedia: function(onSuccesFn, onErrorFn){
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
            },

            stopMedia: function(onSuccesFn, onErrorFn){
                this.log(media.getState());
                media.shutDown({
                    onSuccess: function() {
                        onSuccesFn();
                    },
                    onFailure: function() {
                        onErrorFn();
                    }
                });
            },

            setVideoSize: function(x,y,width,height){
                this.log("entre a setvideosize");
                tvservice.video.setVideoSize({
                    "x" : x,
                    "y" : y,
                    "width" : width,
                    "height" : height,
                    "onSuccess" : function() {
                        this.log("onSuccess");
                    },
                    "onFailure" : function(f) {
                        this.log("onFailure : errorMessage = " + f.errorMessage);
                    }
                });
            },
            getVideoSize: function(){
                this.log("entre a getvideosize");
                tvservice.video.getVideoSize({
                    "onSuccess" : function(s) {
                        this.log("onSuccess");
                        return s;
                    },
                    "onFailure" : function(f) {
                        this.log("onFailure : errorMessage = " + f.errorMessage);
                    }
                });
            },

            log: function (msg) {
                var logArea = document.getElementById('log_area');
                logArea.style.display = 'block';
                var now = new Date();
                var timeFromStart = new Number((now.getTime()) / 1000);
                logArea.innerHTML += ('[' + timeFromStart.toFixed(3) + '][' + now.toLocaleTimeString() + '] ' + JSON.stringify(msg) + '<br/>');
            },
        }
    }
);
