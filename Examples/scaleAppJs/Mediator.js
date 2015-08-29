

var Mediator,
  slice = [].slice;

Mediator = (function() {
  var _getTasks;

  function Mediator(obj, cascadeChannels) {
    this.cascadeChannels = cascadeChannels != null ? cascadeChannels : false;
    this.channels = {};
    if (obj instanceof Object) {
      this.installTo(obj);
    } else if (obj === true) {
      this.cascadeChannels = true;
    }
  }

  Mediator.prototype.on = function(channel, fn, context) {
    var base, i, id, k, len, results1, results2, subscription, that, v;
    if (context == null) {
      context = this;
    }
    if ((base = this.channels)[channel] == null) {
      base[channel] = [];
    }
    that = this;
    if (channel instanceof Array) {
      results1 = [];
      for (i = 0, len = channel.length; i < len; i++) {
        id = channel[i];
        results1.push(this.on(id, fn, context));
      }
      return results1;
    } else if (typeof channel === "object") {
      results2 = [];
      for (k in channel) {
        v = channel[k];
        results2.push(this.on(k, v, fn));
      }
      return results2;
    } else {
      if (typeof channel !== "string") {
        return false;
      }
      subscription = {
        context: context,
        callback: fn || function() {}
      };
      return {
        attach: function() {
          that.channels[channel].push(subscription);
          return this;
        },
        detach: function() {
          Mediator._rm(that, channel, subscription.callback);
          return this;
        },
        pipe: function() {
          that.pipe.apply(that, [channel].concat(slice.call(arguments)));
          return this;
        }
      }.attach();
    }
  };

  Mediator.prototype.off = function(ch, cb) {
    var id;
    switch (typeof ch) {
      case "string":
        if (typeof cb === "function") {
          Mediator._rm(this, ch, cb);
        }
        if (typeof cb === "undefined") {
          Mediator._rm(this, ch);
        }
        break;
      case "function":
        for (id in this.channels) {
          Mediator._rm(this, id, ch);
        }
        break;
      case "undefined":
        for (id in this.channels) {
          Mediator._rm(this, id);
        }
        break;
      case "object":
        for (id in this.channels) {
          Mediator._rm(this, id, null, ch);
        }
    }
    return this;
  };

  _getTasks = function(data, channel, originalChannel, ctx) {
    var i, len, results1, sub, subscribers;
    subscribers = ctx.channels[channel] || [];
    results1 = [];
    for (i = 0, len = subscribers.length; i < len; i++) {
      sub = subscribers[i];
      results1.push((function(sub) {
        return function(next) {
          var e;
          try {
            if (util.hasArgument(sub.callback, 3)) {
              return sub.callback.apply(sub.context, [data, originalChannel, next]);
            } else {
              return next(null, sub.callback.apply(sub.context, [data, originalChannel]));
            }
          } catch (_error) {
            e = _error;
            return next(e);
          }
        };
      })(sub));
    }
    return results1;
  };

  Mediator.prototype.emit = function(channel, data, cb, originalChannel) {
    var chnls, o, tasks;
    if (cb == null) {
      cb = (function() {});
    }
    if (originalChannel == null) {
      originalChannel = channel;
    }
    if (typeof data === "function") {
      cb = data;
      data = void 0;
    }
    if (typeof channel !== "string") {
      return false;
    }
    tasks = _getTasks(data, channel, originalChannel, this);
    util.runSeries(tasks, (function(errors, results) {
      var e, x;
      if (errors) {
        e = new Error(((function() {
          var i, len, results1;
          results1 = [];
          for (i = 0, len = errors.length; i < len; i++) {
            x = errors[i];
            if (x != null) {
              results1.push(x.message);
            }
          }
          return results1;
        })()).join('; '));
      }
      return cb(e);
    }), true);
    if (this.cascadeChannels && (chnls = channel.split('/')).length > 1) {
      if (this.emitOriginalChannels) {
        o = originalChannel;
      }
      this.emit(chnls.slice(0, -1).join('/'), data, cb, o);
    }
    return this;
  };

  Mediator.prototype.send = function(channel, data, cb) {
    var tasks;
    if (cb == null) {
      cb = function() {};
    }
    if (typeof data === "function") {
      cb = data;
      data = void 0;
    }
    if (typeof channel !== "string") {
      return false;
    }
    tasks = _getTasks(data, channel, channel, this);
    util.runFirst(tasks, (function(errors, result) {
      var e, x;
      if (errors) {
        e = new Error(((function() {
          var i, len, results1;
          results1 = [];
          for (i = 0, len = errors.length; i < len; i++) {
            x = errors[i];
            if (x != null) {
              results1.push(x.message);
            }
          }
          return results1;
        })()).join('; '));
        return cb(e);
      } else {
        return cb(null, result);
      }
    }), true);
    return this;
  };

  Mediator.prototype.installTo = function(obj, force) {
    var k, v;
    if (typeof obj === "object") {
      for (k in this) {
        v = this[k];
        if (force) {
          obj[k] = v;
        } else {
          if (obj[k] == null) {
            obj[k] = v;
          }
        }
      }
    }
    return this;
  };

  Mediator.prototype.pipe = function(src, target, mediator) {
    if (target instanceof Mediator) {
      mediator = target;
      target = src;
    }
    if (mediator == null) {
      return this.pipe(src, target, this);
    }
    if (mediator === this && src === target) {
      return this;
    }
    this.on(src, function() {
      return mediator.emit.apply(mediator, [target].concat(slice.call(arguments)));
    });
    return this;
  };

  Mediator._rm = function(o, ch, cb, ctxt) {
    var s;
    if (o.channels[ch] == null) {
      return;
    }
    return o.channels[ch] = (function() {
      var i, len, ref, results1;
      ref = o.channels[ch];
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        if ((cb != null ? s.callback !== cb : ctxt != null ? s.context !== ctxt : s.context !== o)) {
          results1.push(s);
        }
      }
      return results1;
    })();
  };

  return Mediator;

})();

// ---
// generated by coffee-script 1.9.2