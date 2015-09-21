/* --------------------------------------- *
* Guerrilla UI                             *
* @module: MVC Model object class          * 
* ---------------------------------------- */
$.GUI().use(function(G) {
    var plugin;

    Model = (function(superClass) {

        // extend model object with superClass properties
        utils.extend(Model, superClass);

        function Model(obj) {
            // call super class ctor
            Model.__super__.constructor.call(this);

            // combine model object with passed model
            this.combine(obj);

            /** 
             * Set property of current Model object
             *
             * @param key {object} {string} - the object or string to merge into Model class 
             * @param val {various} = value of key and can be any super type 
             * @param silent {boolean} - rather or not to fire model change event 
             * @return this {object} 
            **/
            this.set = function(key, val, silent) {
                var k;

                if (!silent || silent === null) {
                    silent = false;
                }

                switch (typeof key) {

                    case "object":

                        for (k in key) {

                            v = key[k];
                            this.set(k, v, true);
                        }

                        if (!silent) {
                            return this.fire(Model.CHANGED, (function() {
                                var results = [], k;

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
                                this.fire(Model.CHANGED, [key]);
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
        }

        /** 
         * Extend Model object with passed object properies 
         *
         * @param obj {object} - the object to merge into Model class 
         * @return this {object} 
        **/
        Model.prototype.combine = function(obj) {
            var k, v;

            for (k in obj) {
                v = obj[k];

                if (this[k] === null) {

                    this[k] = v;
                }
            }

            return this;
        };

        /** 
         * Handler that executes when Model object changes 
         *
         * @param cb {function} - callback method for event register 
         * @param context {object} - context to use when registering event 
         * @return {function} - executed pub / sub 
        **/
        Model.prototype.change = function(cb, context) {
            if (typeof cb === "function") {

                // register model change event
                return this.on(Model.CHANGED, cb, context);

            } else if (arguments.length === 0) {

                // publish model change event
                return this.fire(Model.CHANGED);
            }
        };

        return Model;

    })(G.Broker);

    return {
        load: function(api) {
            // extend api
            api.Model = Model;
        }
    };
});
