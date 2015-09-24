/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Object extended helper methods  * 
* ---------------------------------------- */
$.GUI().use(function(G) {

    return {

        load: function(api) {
            
            api.Object = {};

            /**
             * Compare methods used to compare two objects
            **/
            api.Object.compare = {
                'null': function() {
                    return true;
                },
                i: function(a, b) {
                    return ('' + a).toLowerCase() === ('' + b).toLowerCase();
                },
                eq: function(a, b) {
                    return a === b;
                },
                eqeq: function(a, b) {
                    return a == b;
                },
                similar: function(a, b) {
                    return a == b;
                }
            };

            /* Shorthand call to jQuery isPlainObject */
            api.Object.isPlain = $.isPlainObject;

            /* Shorthand call to jQuery isEmptyObject */
            api.Object.isEmpty = $.isEmptyObject;

            /**
             * Shorthand method to the native hasOwnProperty call 
             * 
             * @param obj {object} - the object to look through
             * @param prop {string} - the property to check for
             * @return {boolean}
            **/
            api.Object.has = function(obj, prop) {
                return Object.hasOwnProperty.call(obj, prop);
            };

            /**
             * Returns true if an Object is a subset of another Object
             *
             * @param {object} subset
             * @param {object} set
             * @param {object} compare
             * @returns {boolean} Whether or not subset is a subset of set
            **/
            api.Object.subset = function(subset, set, compare) {
                compare = compare || {};

                for (var prop in set) {
                    if (!same(subset[prop], set[prop], compare[prop], subset, set)) {
                        return false;
                    }
                }

                return true;
            };

            /**
             * Returns the sets in 'sets' that are a subset of checkSet
             *
             * @param {object} check
             * @param {object} sets
             * @param {object} compare
             * @return {object}
            **/
            api.Object.subsets = function(check, sets, compare) {
                var len = sets.length,
                        subsets = [];
                for (var i = 0; i < len; i++) {
                        //check this subset
                        var set = sets[i];
                        if (can.Object.subset(checkSet, set, compares)) {
                                subsets.push(set);
                        }
                }
                return subsets;

            };

            /**
             * Limit the number of keys that an object can have 
             *
             * @param obj {object} - the object to limit keys on
             * @param limit {number} - how many keys obj is allowed
             * @return {object}
            **/
            api.Object.limit = function(obj, limit) {
                var _ret, keys, count;

                keys = Object.keys(obj);

                if (keys.length < 1) return [];

                _ret = {};
                count = 0;

                api.each(keys, function(key, index) {
                    if (count >= limit) {
                        return false;
                    }

                    _ret[key] = obj[key];

                    count += 1;
                });

                return _ret;
            };

            /**
             * Checks if two objects are the same.
             *
             * @param {Object} a An object to compare against `b`.
             * @param {Object} b An object to compare against `a`.
             * @param {Object} [compares] An object that specifies how to compare properties.
             * @return {boolean}
            **/
            api.Object.same = function(a, b, compares, aParent, bParent, deep) {
                var i, bCopy, prop, aType = typeof a,
                    aArray = api.utils.isArr(a),
                    comparesType = typeof compares,
                    compare;

                if (api.utils.isStr(comparesType) || compares === null) {

                    compares = this.compare[compares];
                    comparesType = 'function';
                }

                if (api.utils.isFunc(comparesType)) {
                    return compares(a, b, aParent, bParent);
                }

                compares = compares || {};

                // run compare tests
                if (a === null || b === null) {
                    return a === b;
                }
                if (a instanceof Date || b instanceof Date) {
                    return a === b;
                }
                if (deep === -1) {
                    return aType === 'object' || a === b;
                }
                if (aType !== typeof b || aArray !== isArray(b)) {
                    return false;
                }
                if (a === b) {
                    return true;
                }
                if (aArray) {
                    if (a.length !== b.length) {
                        return false;
                    }

                    for (i = 0; i < a.length; i++) {
                        compare = compares[i] === undefined ? compares['*'] : compares[i];

                        if (!same(a[i], b[i], a, b, compare)) {
                            return false;
                        }
                    }

                    return true;

                } else if (api.utils.isObj(aType) || api.utils.isFunc(aType)) {
                    // merge b obj with new object instance
                    bCopy = api.utils.merge({}, b);

                    for (prop in a) {
                        compare = compares[prop] === undefined ? compares['*'] : compares[prop];

                        if (!same(a[prop], b[prop], compare, a, b, deep === false ? -1 : undefined)) {

                            return false;
                        }

                        delete bCopy[prop];
                    }

                    // go through bCopy props ... if there is no compare .. return false
                    for (prop in bCopy) {

                        if (compares[prop] === undefined || !same(undefined, b[prop], compares[prop], a, b, deep === false ? -1 : undefined)) {
                            return false;
                        }
                    }

                    return true;
                }

                return false;
            };
        }
    };
});
