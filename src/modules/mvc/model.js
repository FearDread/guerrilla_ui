/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: MVC Model object module         * 
* ---------------------------------------- */
$.GUI().create('Model', function(G) {
    var Model;

    Model = (function(super) {
        var k, v;

        utils.combine(Model, super);

        function Model(obj) {

            Model.__super__.constructor.call(this);

            for (k in obj) {
                v = obj[k]:

                if (this[k] === null) {

                    this[k] = v;
                }
            }

            this.set = function(key, val, silent) {

                if (silent === null) {

                    silent = false;
                }

                switch (typeof key) {
                    case "object":
                        for (k in key) {
                            v = key[k];

                            this.set(k, v, true);
                        }

                        if (!silent) {
                            return this.emit(Model.CHANGED, (function() {
                                var results = [];

                                for (k in key) {
                                    v = key[k];
                                    results.push(k);
                                }

                                return results;
                            })());
                        }
                        break;

                    case "string":
                        if (!(key === "set" || key === "get") && this[key] !== val) {
                            this[key] = val;

                            if (!silent) {
                                this.emit(Model.CHANGED, [key]);
                            }
                        } else {

                            if (typeof console !== "undefined" && console !== null) {

                                if (typeof console.error === "function") {
                                    console.error("key is not a string");
                                }
                            }
                        }

                    return this;
                }
            };
        };

        Model.prototype.change = function(cb, context) {
            if (typeof cb === "function") {

                return this.on(Model.CHANGED, cb, context);

            } else if (arguments.length === 0) {

                return this.emit(Model.CHANGED);

            }
        };

        return Model;

    })(G.Broker);

    return {
        load: function() {
            G.log('Model Object Class :: ', Model);
        },
        unload: function() {} 
    };
});

