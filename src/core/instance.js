/* Public API Using Guerrilla Core */
function _GUI_Instance(){
    return {
        create:function(core, module_selector){
            var proto;

            proto = Object.create({
                config:core.config,

                docElem:core.dom.elem,

                win:core.win,

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

                getPxValue:function(width, unit){
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
            });

            /* attach modules to GUI Instance */
            core._attach(proto);

            return proto; 
        }
    }
};
