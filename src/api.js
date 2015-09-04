/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI Sandbox API               * 
* ---------------------------------------- */
var API = function() {

    return {
        create: function(core, instance, options, module) {

            this.id = instance;
            this.module = module;
            this.options = (options !== null) ? options : {}; 

            this.utils = utils;

            // attach new sandbox instance
            core._broker.install(this);

            return this;
        }
    };
};
