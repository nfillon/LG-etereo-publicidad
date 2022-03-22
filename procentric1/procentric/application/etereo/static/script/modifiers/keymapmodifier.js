/**
 * @fileOverview Requirejs module containing base antie.devices.exit.netcast class
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'homeapp/modifiers/keymapmodifier',
    [
        'antie/devices/browserdevice',
        'antie/events/keyevent'
    ],
    function(Device, KeyEvent) {
        'use strict';

        Device.prototype.getKeyMap = function() {
            this._keyMap['602'] = 602;
            this._keyMap['458'] = 458;
            return this._keyMap;
        };

        KeyEvent.VK_PORTAL = 602;
        KeyEvent.VK_GUIDE = 458;

    }
);
