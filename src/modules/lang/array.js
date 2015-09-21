/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Array helper methods extending  * 
* the base utils object                    * 
* ---------------------------------------- */
$.GUI().use(function(G) {

    return {
        load: function(api) {

            api.Array = [];

            /**
             * Fallback method of Array.prototype.indexOf 
             *
             * @param item {string} - string to check for in array 
             * @return {number} - +1 for found, -1 for not found 
            **/
            api.Array.index = function(item) {
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