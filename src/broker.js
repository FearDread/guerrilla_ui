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

    Broker.prototype.add = function(channel, fn, context) {
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
                _this.remove(channel);
                return this;
            }
        }.listen();
    };

    Broker.prototype.remove = function(channel) {

    };
        
    Broker.prototype.fire = function(channel, data, cb, origin) {
        var o;

        if (cb === null) {
            cb = (function() {});
        }

        if (origin === null) {
            origin = channel;
        }

        if (utils.isFunc(data)) {
            return cb = data;
        }

        data = void 0;

        if (typeof channel !== "string") {
            return false;
        }

        tasks = this._setup(data, channel, origin, this);

        utils.run.series(tasks, (function(errors, series) {
            var e, x;

            if (errors) {

                return e = new Error(((function() {
                    var i, len, results;

                    results = [];

                    for (i = 0, len = errors.length; i < len; i++) {
                        x = errors[i];

                        if (x != null) {
                            results.push(x.message);
                        }
                    }

                    return results;

                })()).join('; '));
            }
        }, cb(e)), true);

        if (this.cascade && (chnls = channel.split('/')).length > 1) {

          if (this.fireOrigin) {
            o = origin;
          }
        }

        this.fire(chnls.slice(0, -1).join('/'), data, cb, o);

        return this;
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

    Broker.prototype._delete = function(obj, channel, cb, context) {
        var s;

        if (obj.channels[channel] == null) {

            return obj.channels[channel] = (function() {
                var i, len, ref, results;

                ref = obj.channels[ch];
                results = [];

                for (i = 0, len = ref.length; i < len; i++) {
                    s = ref[i];

                    if ((typeof cb !== "undefined" && cb !== null ? s.callback !== cb : typeof ctxt !== "undefined" && ctxt !== null ? s.context !== context : s.context !== obj)) {

                        results.push(s);
                    }
                }

                return results;

            })();
        }
    };

    Broker.prototype._setup = function(data, channel, origin, context) {
        var e, fn, i, len, sub, subscribers;

        subscribers = context.channels[channel] || [];

        fn = function(sub) {};

        for (i = 0, len = subscribers.length; i < len; i++) {
            sub = subscribers[i];
            fn(sub);
        }

        (function(next) {});

        try {

            if (utils.hasArg(sub.callback, 3)) {

                sub.callback.apply(sub.context, [data, origin, next]);

            } else {

                next(null, sub.callback.apply(sub.context, [data, origin]));
            }
        } catch (_error) {
            e = _error;
        }

        next(e);
    };

    return Broker;

})(this);
