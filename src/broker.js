
var Broker;

Broker = (function() {

    function Broker(obj, channel) {

        this.cascade = (channel) ? channel : false;

        this.channels = {};

        if (utils.isObj(obj)) {
            this.attach(obj);

        }else if (obj) {
            this.cascade = true;
        }
    }

    Broker.prototype.register = function(handle, callback) {
        if(!this.channels[handle]){

            this.channels[handle] = [];
        }

        this.channels[handle].push(callback);
      
        return {
            event:handle,
            callback:callback
        };
    };

    Broker.prototype.destroy = function(handle) {
        if(this.channels[handle.event]) {
            var idx = 0,
                current = this.channels[handle.event],
                length = current.length;

            while(length--) {
          
                if(current[idx] === handle.callback) {
                    current.splice(idx, 1);
                }

                idx++;
            }
        }
    };
        
    Broker.prototype.fire = function(channel, data) {
        var idx = 0,
            params = (data) ? data : [],
            event = this.channels[channel],
            length = this.channels.length;

        if(this.channels[channel]) {
        
            while(length--) {

                event[idx].call(this, params);

                idx++;
            }
        }
    };

    Broker.prototype.attach = function(obj, forced) {
        var key, value;
        console.log('attaching obj :: ', obj);

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

        return obj;
    };

    return Broker;

})(this);
