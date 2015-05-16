/* Public API Using Guerrilla Core */
GUI._instance = (function(){
    var SB = {
        create:function(core, module_selector){
            var CONTAINER = core.dom.query('#' + module_selector);

            return { 
                version:core.config.version,
                log:function(){
                    core.log(arguments);
                },

                event:core.dom.event,

                create:function(elem){
                    return core.dom.create(elem);
                },

                find:function(selector){
                    return core.dom.query(selector);
                },

                fire:function(evnt, argc){
                    return core.publish(evnt, argc);
                },

                scribe:function(handle, func){
                    core.subscribe(handle, func);
                },

                unscribe:function(handle){
                    core.unsubscribe(handle);
                },

                getInPixels:function(width, unit){
                    var value;

                    switch(unit){
                        case "em":
                            value = core.convertToEm(width);
                            break;

                        case "pt":
                            value = core.convertToPt(width);
                            break;

                        default:
                            value = width;
                    }

                    return value;
                },

                notify:function(evnt){
                    return core.trigger(evnt);
                },

                listen:function(events){
                    core.registerEvents(events, module_selector);
                },

                ignore:function(events){
                    core.removeEvents(events, module_selector);
                }
            }
        }
    }

    return SB; 

})();
