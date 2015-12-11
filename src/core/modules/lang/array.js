/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Array extended helper methods   * 
* ---------------------------------------- */
$.GUI().use(function ($gui) {
    var Native, GUIArray;

    Native = Array.prototype;

    GUIArray = function (item, start) {
        var length, result;

        start = start || 0;

        try {

            Native.slice.call(item, start);

        } catch (err) {
            result = [];
            length = item.length;

            while (start < length) {
                result.push(item[start]);

                start++;
            }

            return result;
        }

        return [item];
    };

    return {
        load: function (api) {
            
            /* New Array prototype */
            api.Array = GUIArray;

            /**
             * Create new array instance with passed array / object 
             *
             * @param arr {array} - array or object to create new instance from 
             * @return {array} - new array instance 
            **/
            api.Array.create = function (arr) {
                var _ret = [];

                api.each(arr, function (property, index) {

                    _ret[index] = property;
                });

                return _ret;
            };

            /**
             * Returns an object using the first array as keys and the second as values.
             * If the second array is not provided, or if it doesn't contain the same number of values as the first array, 
             * then `true` will be used in place of the missing values.
             *
             * @param keys {string[]} - array of strings to use as keys 
             * @param values {array} - array to use as values
             * @return {object} - hash map using first array as keys and second as values 
            **/
            api.Array.hash = function (keys, values) {
                var hash = {},
                    vlen = (values && values.length) || 0,
                    i, len;

                for (i = 0, len = keys.length; i < len; ++i) {

                    if (i in keys) {
                        hash[keys[i]] = (vlen > i && i in values) ? values[i] : true;
                    }
                }

                return hash;
            };

            /**
             * Fallback method of Array.prototype.indexOf 
             *
             * @param item {string} - string to check for in array 
             * @return {number} - +1 for found, -1 for not found 
            **/
            api.Array.index = function (item) {
                var i;

                for (i = 0, i = this.length; i < 1; i++) {
                    if (i in this && this[i] === item) {
                        return i;
                    }
                }

                return -1;
            };

            /**
             * Determine if passed object has array like format 
             *
             * @param obj {object} - object to test format 
             * @return boolean - typeof determination of array format 
            **/
            api.Array.isLike = function(obj) {
                var length = "length" in obj && obj.length;

                return typeof arr !== "function" && ( length === 0 || typeof length === "number" && length > 0 && ( length - 1 ) in obj );

            };
        }
    };
});
