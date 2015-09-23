/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Cache, handle reading & writing * 
* to local storage                         * 
* ---------------------------------------- */
$.GUI().use(function(G) {

    var _storage = window.localStorage,
        _session = window.sessionStorage;

    function map(storage) {
        var store = {
            local: 'localStorage',
            session: 'sessionStorage'
        };

        return window[store[storage]];
    }

    return {

        load: function(api) {

            api.cellar = {

                _cached: {},

                _get: function(storage) {
                    var store = map(storage);
                    

                },

                storage: {

                },

                session: {
                  
                }
            };
        }
    };
});
