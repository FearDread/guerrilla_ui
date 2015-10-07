/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Map, basic key value map store  * 
* ---------------------------------------- */
$.GUI().use(function(gui) {

    var Map = window.Map || window.MozMap || (Map = (function() {

        function Map() {
            this.keys = [];
            this.values = [];
        }

        Map.prototype.get = function(key) {
            var i, item, j, ref;

            ref = this.keys;

            for (i = j = 0; j < ref.length; i = ++j) {
                item = ref[i];

                if (item === key) {

                    return this.values[i];
                }
            }
        };

        Map.prototype.set = function(key, value) {
            var i, item, j, ref;

            ref = this.keys;

            for (i = j = 0; j < ref.length; i = ++j) {
                item = ref[i];

                if (item === key) {
                    this.values[i] = value;
                    return;
                }
            }

            this.keys.push(key);
            return this.values.push(value);
        };

        return Map;

    })());

    return {

        load: function(api) {

          api.dom.map = new Map();
        },
        unload: function() {}
    };
});
