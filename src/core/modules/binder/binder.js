/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: GUI Core                        * 
* ---------------------------------------- */
var Binder;


Binder = (function (global, utils) {

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


