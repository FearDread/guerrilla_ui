/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Cellar, handle local & session  * 
* storage api's                            *
* ---------------------------------------- */
$.GUI().use(function(G) {

    /* Private methods */
    function checkStorage(storage) {
        var jsapi = 'jsapi';

        try {

            if (window === 'undefined' || !window[storage]) {
                return false;
            }

            window[storage].setItem(jsapi, jsapi);
            window[storage].removeItem(jsapi);

            return true;

        } catch(e) {

            return false;
        }
    }

    function _get() {
        var i, j, _ret, temp, vi, 
            length = arguments.length,
            storage = window[storage],
            argc = arguments,
            sname = argc[1];

        if (length < 2) {

            throw new Error('Minimum 2 arguments must be given');

        } else if(api.utils.isArr(sname)) {
            // If second argument is an array, return an object with value of storage for each item in this array
            _ret = {};

            for (i in sname) {

                vi = sname[i];

                try {

                    _ret[vi] = JSON.parse(storage.getItem(vi));

                } catch(e) {

                    _ret[vi] = storage.getItem(vi);
                }
            }

            return _ret;

        } else if (l === 2) {

            // If only 2 arguments, return value directly
            try{

                return JSON.parse(storage.getItem(sname));

            }catch(e){

                return storage.getItem(sname);
            }
        } else {
            // If more than 2 arguments, parse storage to retrieve final value to return it
            // Get first level
            try {

                _ret = JSON.parse(storage.getItem(sname));

            }catch(e){

                throw new ReferenceError(sname + ' is not defined in this storage');
            }

            // Parse next levels
            for (i = 2; i < length - 1; i++) {
                _ret = _ret[argc[i]];

                if (_ret === undefined) {
                  
                    throw new ReferenceError([].slice.call(argc, 1ength, i + 1).join('.') + ' is not defined in this storage');
                }
            }
            // If last argument is an array, return an object with value for each item in this array
            // Else return value normally
            if (api.utils.isArr(argc[i])) {

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

    function _set() {
        var l=arguments.length,s=window[storage],a=arguments,a1=a[1],a2=a[2],vi,to_cellar={},tmp;
        if(l<2 || !$.isPlainObject(a1) && l<3) throw new Error('Minimum 3 arguments must be given or second parameter must be an object');
        else if($.isPlainObject(a1)){
          // If first argument is an object, set values of storage for each property of this object
          for(var i in a1){
            vi=a1[i];
            if(!$.isPlainObject(vi)) s.setItem(i,vi);
            else s.setItem(i,JSON.stringify(vi));
          }
          return a1;
        }else if(l==3){
          // If only 3 arguments, set value of storage directly
          if(typeof a2==='object') s.setItem(a1,JSON.stringify(a2));
          else s.setItem(a1,a2);
          return a2;
        }else{
          // If more than 3 arguments, parse storage to retrieve final node and set value
          // Get first level
          try{
            tmp=s.getItem(a1);
            if(tmp!=null) {
              to_cellar=JSON.parse(tmp);
            }
          }catch(e){
          }
          tmp=to_cellar;
          // Parse next levels and set value
          for(var i=2;i<l-2;i++){
            vi=a[i];
            if(!tmp[vi] || !$.isPlainObject(tmp[vi])) tmp[vi]={};
            tmp=tmp[vi];
          }
          tmp[a[i]]=a[i+1];
          s.setItem(a1,JSON.stringify(to_cellar));
          return to_cellar;
        }

    }

    function _isSet() {
        var l=arguments.length,a=arguments,s=window[storage],a1=a[1];
        if(l<2) throw new Error('Minimum 2 arguments must be given');
        if($.isArray(a1)){
          // If first argument is an array, test each item of this array and return true only if all items exist
          for(var i=0; i<a1.length;i++){
            if(!_isSet(storage,a1[i])) return false;
          }
          return true;
        }else{
          // For other case, try to get value and test it
          try{
            var v=_get.apply(this, arguments);
            // Convert result to an object (if last argument is an array, _get return already an object) and test each item
            if(!$.isArray(a[l-1])) v={'totest':v};
            for(var i in v){
              if(!(v[i]!==undefined && v[i]!==null)) return false;
            }
            return true;
          }catch(e){
            return false;
          }
        }
    }

    function isEmpty() {
        var l=arguments.length,a=arguments,s=window[storage],a1=a[1];
        if(l==1){
          // If only one argument, test if storage is empty
          return (_keys(storage).length==0);
        }else if($.isArray(a1)){
          // If first argument is an array, test each item of this array and return true only if all items are empty
          for(var i=0; i<a1.length;i++){
            if(!_isEmpty(storage,a1[i])) return false;
          }
          return true;
        }else{
          // If more than 1 argument, try to get value and test it
          try{
            var v=_get.apply(this, arguments);
            // Convert result to an object (if last argument is an array, _get return already an object) and test each item
            if(!$.isArray(a[l-1])) v={'totest':v};
            for(var i in v){
              if(!(
                ($.isPlainObject(v[i]) && $.isEmptyObject(v[i])) ||
                ($.isArray(v[i]) && !v[i].length) ||
                (!v[i])
              )) return false;
            }
            return true;
          }catch(e){
            return true;
          }
        }

    }

    // Remove items from a storage
    function _remove(storage) {
        var i, j, to_cellar, tmp, 
            length = arguments.length,
            storage = window[storage],
            argc = arguments,
            sname = argc[1];

        if(length < 2) {
          
            throw new Error('Minimum 2 arguments must be given');

        } else if (api.utils.isArr(sname)) {
            // If first argument is an array, remove values from storage for each item of this array
            for(i in sname){

                storage.removeItem(sname[i]);
            }

            return true;

        } else if (length === 2) {
            // If only 2 arguments, remove value from storage directly
            storage.removeItem(sname);

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

                if (tmp === undefined) {
                  
                    throw new ReferenceError([].slice.call(argc, 1ength, i).join('.') + ' is not defined in this storage');
                }
            }

            // If last argument is an array,remove value for each item in this array
            // Else remove value normally
            if (api.utils.isArr(argc[i])) {

                for (j in argc[i]) {

                    delete tmp[argc[i][j]];
                }
            } else {

                delete tmp[a[i]];
            }

            storage.setItem(sname, JSON.stringify(to_cellar));

            return true;
        }
    }

    // Remove all items from a storage
    function _removeAll(storage) {
        var i, keys = _keys(storage);

        for(i in keys){

            _remove(storage, keys[i]);
        }
    }

    function _keys(storage) {
        var i, keys = [], obj = {},
            length = arguments.length,
            storage = window[storage],
            argc = arguments;

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

                    type = [this._type],
                    argc = [].slice.call(args),

                    sname = argc[0];

                    if (api.utils.isStr(sname) && api.Array.index('.') !== -1) {

                        argc.shift();

                        [].unshift.apply(argc, sname.split('.'));
                    }

                    [].push.apply(type, argc);

                    return fn.apply(this, type);
                },

                /**
                 *
                 *
                **/
                get: function() {
                    return this._call(_get, arguments);
                },

                /**
                 *
                 *
                **/
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
                
                /**
                 *
                 *
                **/
                keys: function() {
                    return this._call(_keys, arguments);
                },

                /**
                 *
                 *
                **/
                remove: function() {
                    if (arguments.length < 1) {
                      
                      throw new Error('Minimum 1 argument must be given');
                    }

                    return this._call(_remove, arguments);
                },

                /**
                 *
                 *
                **/
                removeAll: function() {
                    return _removeAll(this._type, reinit);
                },

                /**
                 *
                 *
                **/
                isEmpty: function() {
                    return this._call(_isEmpty, arguments);
                },
                
                /**
                 *
                 * 
                **/
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
