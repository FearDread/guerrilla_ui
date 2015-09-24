/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Cellar, handle local & session  * 
* storage api's                            *
* ---------------------------------------- */
$.GUI().use(function(G) {

    /* Private methods */
    /**
     * Check for browser compatibility of passed storage object
     *
     * @param storage {string} - the storage object to check
     * @return {boolean}
    **/
    function checkStorage(storage) {
        var gui = 'guerrilla';

        try {

            if (window === 'undefined' || !window[storage]) {
                return false;
            }

            window[storage].setItem(gui, gui);
            window[storage].removeItem(gui);

            return true;

        } catch(e) {

            return false;
        }
    }

    /**
     * Remove all items from a storage
     *
     * @param storage {string} - the storage object to remove all items from 
     * @return {void}
    **/
    function _removeAll(storage) {
        var i, keys = _keys(storage);

        for (i in keys) {
            _remove(storage, keys[i]);
        }
    }

    /**
     * Return array of keys from passed storage object  
     *
     * @param store {string} - the storage object to get keys from 
     * @return {array} - keys 
    **/
    function _keys(store) {
        var i, keys = [], obj = {}, length, storage, argc;

        argc = arguments;
        length = argc.length;

        storage = window[store];
        // If more than 1 argument, get value from storage to retrieve keys
        // Else, use storage to retrieve keys
        if (length > 1) {

            obj = _get.apply(this, argc);
        } else {
            obj = storage;
        }

        for (i in obj) {
           keys.push(i);
        }

        return keys;
    }

    return {

        load: function(api) {

            if (checkStorage('localStorage') === false ||
                checkStorage('sessionStorage') === false) {

                throw new Error('Sorry but this browser cannot use storage objects.');
            }

            /**
             * Get value from passed storage object and key 
             *
             * @param store {string} - the storage object to search
             * @param sname {string} - the key to check for and return value of
             * @return {object} - value of passed key
            **/
            function _get(store){
                var i, length, sname, storage, argc, vi, _ret, tmp, j; 

                argc = arguments;
                length = argc.length;

                storage = window[store];
                sname = argc[1];

                if (length < 2) throw new Error('Minimum 2 arguments must be given');

                else if (api.utils.isArr(sname)) {
                    // If second argument is an array, return an object with value of storage for each item in this array
                    _ret = {};

                    for (i in a1) {
                        vi = sname[i];

                        try {
                            _ret[vi] = JSON.parse(storage.getItem(vi));

                        } catch(e) {
                            _ret[vi] = storage.getItem(vi);
                        }
                    }

                    return _ret;

                } else if (length === 2) {
                    // If only 2 arguments, return value directly
                    try {

                        return JSON.parse(storage.getItem(sname));

                    } catch(e) {
                        return storage.getItem(sname);
                    }
                } else {
                    // If more than 2 arguments, parse storage to retrieve final value to return it
                    // Get first level
                    try {

                        _ret = JSON.parse(storage.getItem(sname));

                    } catch(e) {
                        throw new ReferenceError(sname + ' is not defined in this storage');
                    }

                    // Parse next levels
                    for (i = 2; i < length - 1; i++) {
                        _ret = _ret[argc[i]];

                        if (_ret === undefined) throw new ReferenceError(api.utils.slice.call(argc, 1, i + 1).join('.') + ' is not defined in this storage');
                    }
                    // If last argument is an array, return an object with value for each item in this array
                    // Else return value normally
                    if(api.utils.isArr(argc[i])) {
                        tmp = _ret;
                        _ret = {};

                        for (j in argc[i]) {

                            _ret[argc[i][j]] = tmp[argc[i][j]];
                        }

                        return _ret;

                    } else {
                        return _ret[argc[i]];
                    }
                }
            }

            /**
             * Set value to passed storage object and key 
             *
             * @param store {string} - the storage object to search
             * @param sname {string} - the key to store data value under 
             * @param data {object} - optional data object or string to store
             * @return {object} - cellar data 
            **/
            function _set(store) {
                var i, length, argc, sname, data, vi, to_cellar = {}, tmp;

                argc = arguments;
                length = argc.length;

                storage = window[store];

                sname = argc[1];
                data = argc[2];

                if (length < 2 || !api.Object.isPlain(sname) && length < 3) throw new Error('Minimum 3 arguments must be given or second parameter must be an object');

                else if(api.Object.isPlain(sname)) {
                    // If first argument is an object, set values of storage for each property of this object
                    for (i in sname) {
                        vi = sname[i];

                        if (!api.Object.isPlain(vi)) {
                          
                            storage.setItem(i, vi);
                        } else {
                            storage.setItem(i, JSON.stringify(vi));
                        }
                    }

                    return sname;

                } else if (length === 3) {
                    // If only 3 arguments, set value of storage directly
                    if (api.utils.isObj(data)) {
                      
                        storage.setItem(sname, JSON.stringify(data));
                    } else {
                      
                        storage.setItem(sname, data);
                    }

                    return data;

                } else {
                    // If more than 3 arguments, parse storage to retrieve final node and set value
                    // Get first level
                    try {
                        tmp = storage.getItem(sname);

                        if (tmp !== null) {
                            to_cellar = JSON.parse(tmp);
                        }
                    } catch(e) {}
                    
                    tmp = to_cellar;
                    // Parse next levels and set value
                    for(i = 2; i < length - 2; i++) {
                        vi = argc[i];

                        if (!tmp[vi] || !api.Object.isPlain(tmp[vi])) {

                          tmp[vi] = {};
                        }

                        tmp = tmp[vi];
                    }

                    tmp[argc[i]] = argc[i + 1];
                    storage.setItem(sname, JSON.stringify(to_cellar));

                    return to_cellar;
                }
            }

            /**
             * Check wether or not a value is set in passed storage object
             *
             * @param store {string} - the storage object to check
             * @param snamem {string} - the key to search storage object for
             * @return {boolean}
             *
            **/
            function _isSet(store) {
                var i, value, length, argc, storage, sname;

                argc = arguments;
                length = argc.length;

                sname = argc[1];
                storage = window[store];

                if (length < 2) throw new Error('Minimum 2 arguments must be given');

                if (api.utils.isArr(sname)) {
                    // If first argument is an array, test each item of this array and return true only if all items exist
                    for(i = 0; i < sname.length; i++) {

                        if (!_isSet(storage, sname[i])) {

                            return false;
                        }
                    }

                    return true;
                } else {
                    // For other case, try to get value and test it
                    try {
                        value = _get.apply(this, arguments);

                        // Convert result to an object (if last argument is an array, _get return already an object) and test each item
                        if (!api.utils.isArr(argc[length - 1])) {
                          
                          value = {'totest': value};
                        }

                        for (i in value) {
                            if (!(value[i] !== undefined && value[i] !== null)) {
                                return false;
                            }
                        }

                        return true;

                    } catch(e) {
                        return false;
                    }
                }
            }

            /**
             * Check to see if passed storage is empty
             *
             * @param store {string} - the storage object to check
             * @param sname {string} - the key to search storage object for
             * @return {boolean}
            **/
            function _isEmpty(store) {
                var i, value, length, argc, storage, sname;

                argc = arguments; 
                length = argc.length;

                storage = window[store];
                sname = argc[1];

                if (length === 1) {
                    // If only one argument, test if storage is empty
                    return (_keys(storage).length === 0);

                } else if (api.utils.isArr(sname)) {

                    // If first argument is an array, test each item of this array and return true only if all items are empty
                    for(i = 0; i < sname.length; i++){

                        if(!_isEmpty(storage, sname[i])) {

                            return false;
                        }
                    }

                    return true;

                } else {

                    // If more than 1 argument, try to get value and test it
                    try {
                        value = _get.apply(this, arguments);
                        // Convert result to an object (if last argument is an array, _get return already an object) and test each item
                        if(!api.utils.isArr(argc[length - 1])) value = {'totest': value};

                        for (i in value) {

                            if (!(
                                (api.Object.isPlain(value[i]) && api.Object.isEmpty(value[i])) ||

                                (api.utils.isArr(value[i]) && !value[i].length) ||

                                (!value[i])
                            )) return false;
                        }

                        return true;

                    } catch(e) {

                        return true;
                    }
                }
            }

            /**
             * Remove items from a storage 
             *
             * @param store {string} - the storage object to use
             * @param sname {string} - the key to remove from storage object
             * @return {boolean}
            **/
            function _remove(store) {
                var i, j, length, storage, argc, sname, to_cellar, tmp;

                argc = arguments;
                length = argc.length;

                storage = window[store];
                sname = argc[1];

                if (length < 2) throw new Error('Minimum 2 arguments must be given');

                else if (api.utils.isArr(sname)) {
                    // If first argument is an array, remove values from storage for each item of this array
                    for(i in sname){
                        storage.removeItem(sname[i]);
                    }

                    return true;

                } else if (length === 2) {
                    // If only 2 arguments, remove value from storage directly
                    storage.removeItem(a1);

                    return true;

                } else {
                    // If more than 2 arguments, parse storage to retrieve final node and remove value
                    // Get first level
                    try {

                        to_cellar = tmp = JSON.parse(storage.getItem(sname));

                    } catch(e) {
                        throw new ReferenceError(sname + ' is not defined in this storage');
                    }

                    // Parse next levels and remove value
                    for (i = 2; i < length - 1; i++) {
                        tmp = tmp[argc[i]];

                        if (tmp === undefined) throw new ReferenceError(api.utils.slice.call(argc, 1, i).join('.') + ' is not defined in this storage');
                    }

                    // If last argument is an array,remove value for each item in this array
                    // Else remove value normally
                    if (api.utils.isArr(argc[i])) {

                        for(j in argc[i]) {

                            delete tmp[argc[i][j]];
                        }
                    } else {
                        delete tmp[argc[i]];
                    }

                    storage.setItem(sname, JSON.stringify(to_store));

                    return true;
                }
            }

            /* Public methods */
            api.cellar = {
                _type: '',
                _cached: {},
                ls: window.localStorage,
                ws: window.sessionStorage,

               /**
                * Method to directly call specified function with arguments
                *
                * @param fn {function} - the function to execute
                * @param args {array} - optional arguments array to be applied to function
                * @return {function} execute
                **/
                _call: function(fn, args) {
                    var type, argc, sname;

                    type = [this._type];
                    argc = api.utils.slice.call(args);

                    sname = argc[0];

                    if (api.utils.isStr(sname) && api.Array.index('.') !== -1) {

                        argc.shift();

                        [].unshift.apply(argc, sname.split('.'));
                    }

                    [].push.apply(type, argc);

                    return fn.apply(this, type);
                },

                /* get data from cellar */
                get: function() {
                    return this._call(_get, arguments);
                },

                /* store data in cellar */
                set: function() {
                    var length, argc, sname;

                    agrc = arguments;
                    length = argc.length;

                    sname = argc[0];

                    if (length < 1 || !api.Object.isPlain(sname) && length < 2) {
                        throw new Error('Minimum 2 arguments must be given or first parameter must be an object');
                    }

                    return this._call(_set, argc);
                },
                
                /* return array of keys from s cellar */
                keys: function() {
                    return this._call(_keys, arguments);
                },

                /* remove item from cellar */
                remove: function() {
                    if (arguments.length < 1) {
                      throw new Error('Minimum 1 argument must be given');
                    }

                    return this._call(_remove, arguments);
                },

                /* remove all items from cellar */
                removeAll: function() {
                    return _removeAll(this._type, reinit);
                },

                /* check if cellar is empty */
                isEmpty: function() {
                    return this._call(_isEmpty, arguments);
                },
                
                /* check if value is stored in cellar */
                isSet: function() {
                    if (arguments.length < 1) {
                      throw new Error('Minimum 1 argument must be given');
                    }

                    return this._call(_isSet, arguments);
                }
            };
        }
    };
});
