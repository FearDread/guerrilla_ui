/* --------------------------------------- *
* Guerrilla UI                             *
* @module: WeakMap, basic key value map store  * 
* ---------------------------------------- */
$.GUI().use(function(gui) {

    var WeakMap = this.WeakMap || this.MozWeakMap || (WeakMap = (function() {

        function WeakMap() {
            this.keys = [];
            this.values = [];
        }

        WeakMap.prototype.get = function(key) {
            var i, item, j, ref;

            ref = this.keys;

            for (i = j = 0; j < ref.length; i = ++j) {
                item = ref[i];

                if (item === key) {

                    return this.values[i];
                }
            }
        };

        WeakMap.prototype.set = function(key, value) {
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

        return WeakMap;

    })());

    return {

        load: function(api) {

          api.dom.map = new WeakMap();
        },
        unload: function() {}
    };
});
