/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: GUI Core                        * 
* ---------------------------------------- */
var Binder;

Binder = (function (global, utils) {

    if (!Function.bind || !Object.defineProperty) {
        throw new Error('Prerequisite APIs not available.');
    }

    function AugmentedArray (callback, settings) {
        var methods = 'pop push reverse shift sort splice unshift'.split(' ');

        utils.each(methods, function eachArrayMethod(method) {

            this[method] = function augmentedMethod() {

                this.__dirty = true;

                var ret = __export({}, array[method].apply(this, arguments));
                delete this.__dirty;

                if (callback && settings.ready) {

                    callback(this);
                }

                return ret;

            }.bind(this);

        }.bind(this));

        var length = this.length;

        {}.defineProperty(this, 'length', {
            configurable: false, // don't allow it to be deleted
            enumerable: true,
            set: function (v) {
                if (this.__dirty) {
                    length = v;
                    return;
                }

                var newLength =  v * 1; // do a simple coersion

                if (length !== newLength) {
                    if (newLength > length) {

                        this.push.apply(this, new Array(newLength - length));
                    } else {

                        this.splice(newLength);
                    }

                    length = newLength;
                }

                return v;
            },
            get: function () {
                return length;
            },
        });

        return this;
    }

  function __export(target, object) {
    if (!(object instanceof Object)) {
      return object; // this is a primative
    }

    forEach(Object.getOwnPropertyNames(object), function (key) {
      var value = object[key];

      // ignore properties on the prototype (pretty sure there's a better way)
      if (Bind.prototype[key] || key === '__callback') {
        return;
      }

      if (typeof value === o && value !== null && value instanceof Array) {
        target[key] = [].map.call(value, function (value) {
          return value instanceof Object ?
            __export(target[key] || {}, value) :
            value;
        });
      } else if (typeof value === o && value !== null && !isArray(value)) {
        target[key] = __export(target[key] || {}, value);
      } else {
        target[key] = value;
      }
    });

    return target;
  }

    function Binder (obj, mapping) {
        if (!this || this === global) {
            return new Bind(obj, mapping);
        }

        var settings = {
            mapping: mapping || {},
            callbacks: {},
            deferred: [],
            ready: false,
            instance: this,
        };

        utils.extend(this, obj, settings);

        // allow object updates to happen now, otherwise we end up iterating the
        // setter & getter methods, which causes multiple callbacks to run
        settings.ready = true;

        // if there's deferred callbacks, let's hit them now the binding is set up
        if (settings.deferred.length) {
            utils.each(settings.deferred, function deferreds(fn) {
                fn();
            });
        }

        return this;
    }

    // returns a vanilla object - without setters & getters
    Binder.prototype.__export = function () {
        return __export({}, this);
    };

    return Binder;

})(this, utils);


