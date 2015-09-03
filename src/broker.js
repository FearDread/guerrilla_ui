/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Broker pub / sub implemntation  * 
* ---------------------------------------- */
var Broker;

Broker = (function() {

    function Broker(obj, cascade) {

        this.cascade = (cascade) ? true : false;

        this.channels = {};

        if (utils.isObj(obj)) {
            this.install(obj);

        } else if (obj === true) {
            this.cascade = true;
        }
    }

    Broker.prototype.bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    };

    Broker.prototype.on = function(channel, fn, context) {
        var subscription, _this = this;

        if (!context || context === null) {
            context = this;
        }

        if (!this.channels[channel]){
            this.channels[channel] = [];
        }

        subscription = {
            event: channel,
            context: context,
            callback: fn || function(){}
        };
      
        return {
            listen: function() {
                _this.channels[channel].push(subscription);
                return this;
            },
            ignore: function() {
                _this.off(channel);
                return this;
            }
        }.listen();
    };

    Broker.prototype.off = function(channel) {
        var index = 0, current, length;

        if (this.channels[channel.event]) {

            current = this.channels[channel.event];
            length = current.length;

            if (length > 0) {

                do {

                    if (current[idx] === channel.callback) {
                        current.splice(idx, 1);
                    }

                    index++;
                } while(--length);
            }
        }
    };
        
    Broker.prototype.fire = function(channel, data) {
        var index= 0, event,
            params = (data) ? data : [],
            length = this.channels.length;

        if (this.channels[channel]) {

            event = this.channels[channel];

            if (length > 0) {

                do {

                    event[index].call(this, params);
                    index++;

                } while(--length);
            }
        }
    };

    Broker.prototype.install = function(obj, forced) {
        var key, value;

        if (utils.isObj(obj)) {

            for (key in this) {

                value = this[key];
                if (forced) {
                    obj[key] = value;
                } else {

                    if (!obj[key]) {
                        obj[key] = value;
                    }
                }
            }
        }

        return this;
    };

    return Broker;

})(this);
