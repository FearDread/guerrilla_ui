/* Public API Using Guerrilla Core */
function _GUI_Instance(){
    return {
        create:function(core, module_selector){
            var proto;

            proto = Object.create({
                config:core.config,

                elem:core.dom.elem,

                win:core.win,

                doc:core.dom.doc,

                log:function(){
                    core.log(arguments);
                },

                event:core.dom.event,

                el:function(elem){
                    return core.dom.create(elem);
                },

                query:function(selector){
                    return core.dom.query(selector);
                },

                isObj:core.isObj,

                isArr:core.isArr,

                emit:function(evnt, argc){
                    return core.publish(evnt, argc);
                },

                scribe:function(handle, func){
                    core.subscribe(handle, func);
                },

                unscribe:function(handle){
                    core.unsubscribe(handle);
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
