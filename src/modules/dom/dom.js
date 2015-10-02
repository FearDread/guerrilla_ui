/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Dom, stored document reference  * 
* ---------------------------------------- */
$.GUI().use(function(gui) {

    return {
        
        load: function(api) {

            api.dom.doc = (document) ? document : undefined;
        }
    };
});
