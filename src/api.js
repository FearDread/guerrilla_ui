
var API = function(core, moduleId, options) {
    return {
        create: function(core, module_selector) {
            var proto;

            proto = Object.create({
                config:core.config,

                utils:utils,

                log: function() {
                    core.log(arguments);
                },

                elem: function(elem) {

                },

                query: function(selector) {

                }
            });

            /* attach modules to GUI Instance */
            core._broker.install(this);
            
            return Object.create(proto); 
        }
    };
};

