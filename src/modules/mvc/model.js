/* --------------------------------------- *
* Guerrilla UI                             *
* @module: MVC Model object class          * 
* ---------------------------------------- */
$.GUI().use(function(gui) {

    Model = (function(superClass) {

        // extend model object with superClass properties
        utils.extend(Model, superClass);

        function Model(obj) {

            // call super class ctor
            Model.__super__.constructor.call(this);

            // combine model object with passed model
            utils.merge(this, obj);

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
        Model.prototype.extend = function(obj) {
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
                return this.add(Model.CHANGED, cb, context);

            } else if (arguments.length === 0) {

                // publish model change event
                return this.fire(Model.CHANGED);
            }
        };

        /** 
         * Fire the Modal change event  
         *
         * @return {function} 
        **/
        Model.prototype.notify = function() {

            return this.change();
        };

        /** 
         * Retreive property of current model object 
         *
         * @param key {string} - property to search model object for
         * @return {various} - whateve value the found property holds 
        **/
        Model.prototype.get = function(key) {

            return this[key];
        };

        Model.prototype.toJSON = function() {
            var json = {}, key, value;

            for (key in this) {

                if (!utils.hasProp.call(this, key)) {

                    continue;
                }

                value = this[key];
                json[key] = value;
            }

            return json;
        };

        /* The model change event identifier */
        Model.CHANGED = "changed";

        return Model;

    })(G.Broker);

    return {
        load: function(api) {

           api.model = Model;
        },
        unload: function() {}
    };
});
