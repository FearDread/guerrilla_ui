/* Core Object */
;var Guerrilla = (function($){
    var _config = {},
        _GUI_config = _config || {};

    if(typeof jQuery === 'undefined' || typeof $ === 'undefined'){
      console.log('Guerrilla UI Requires jQuery.');
      return;
    }

    /* Public API */
    var Sandbox = {
        create:function(core, module_selector){ 
            var CONTAINER = core.dom.query('#' + module_selector);

            return { 
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
    },

    /* Private Core */
    Core = (function(){
        var events = [],
            moduleData = {},
            config = {
              debug:true
            };
    
        return {
            win:window,
            dom:{
                doc:document,
                elem:document.documentElement,
                query:function(selector, context){
                    var $el, 
                        _ret = {},
                        _this = this;

                    if(context && context.find){
                        $el = context.find(selector);

                    }else{
                        $el = $(selector);
                    }

                    _ret = $el.get();
                    _ret.length = $el.length;
                    _ret.query = function(sel){
                        return _this.query(sel, $el);
                    };

                    return _ret;
                },
                create:function(el){
                    return this.doc.createElement(el);
                },
                apply:function(el, attrs){
                    if(core.isObj(attrs)){
                        $(el).attr(attrs);
                    }
                },
                event:{
                    add:function(elem, evnt, func){
                        if(elem && evnt){
                            if(typeof evnt === 'function'){
                                func = evnt;
                                evnt = 'click';
                            }

                            $(elem).on(evnt, this, func);

                        }else{
                            this.log('Wrong Number of Arguments.');
                        }
                    },

                    remove:function(elem, evnt, func){
                        if(elem && evnt){
                            if(typeof evnt === 'function'){
                                func = evnt;
                                evnt = 'click';
                            }

                            $(elem).off(evnt, func);

                        }else{
                            this.log('Wrong Number of Arguments.');
                        }
                    }
                }
            },

            hitch:function(func){
                var argc = [].slice.call(arguments).splice(1);

                return function(){
                    var all = argc.concat([].slice.call(arguments));

                    return func.apply(this, all);
                }
            },

            create:function(module, func){
                var temp,
                    GUI = this;

                if(typeof module === 'string' && typeof func === 'function'){
                    temp = func(Sandbox.create(this, module)); 

                    if(temp.load && temp.unload){
    
                        if(typeof temp.load === 'function'){
                            moduleData[module] = {
                                create:func,
                                instance:null
                            };
    
                            temp = null;
                        }
                    }else{
                        this.log('Missing module :: ', module);
                    }
                }

                return GUI;
            },

            use:function(){
                var idx = 0,
                    GUI = this, 
                    argc = [].slice.call(arguments, 0),
                    func = argc.pop(),
                    module = (typeof argc[0] === 'string') ? argc[0] : null;

                if(module === 'core'){
                    GUI.create(module, func);
                    GUI.run();

                }else if(module instanceof Array){
                    
                    for(m in module){
                        if(typeof m == 'string'){
                            GUI.start(module);
                        }
                    }
                }

                return GUI;
            },

            start:function(module){
                var GUI = this, 
                    mod = moduleData[module];

                if(mod && typeof mod === 'object'){

                    if(!mod.loaded){
                        mod.instance = mod.create(Sandbox.create(this, module));
                        mod.instance.load();
                        mod.loaded = true;
                    }
                }

                return GUI;
            },

            stop:function(module){
                var data;

                if(data == moduleData[module] && data.instance){
                    data.instance.unload();
                    data.instance = null;
                
                }else{
                    this.log('Stop Failed');
                }
            },

            run:function(){
                var module;

                for(module in moduleData){
                    if(moduleData.hasOwnProperty(module)){
                        this.start(module);
                    }
                }
            },

            destroy:function(){
                var module;

                for(module in moduleData){
                    if(moduleData.hasOwnProperty(module)){
                        this.stop(module);
                    }
                }
            },

            error:function(){
                if(config.debug){
                    throw new TypeError('Error ::', arguments[0]);
                }
            },

            log:function(){
                var argc = [].slice.call(arguments);

                if(config.debug){
                    if(argc.length == 1){
                        console.log('Debug ::', argc[0]);

                    }else if(argc.length == 2){
                        console.log('Debug :: ' + argc[0], argc[1]);
                    }
                }
            },

            publish:function(handle, argc){
                if(events[handle]){
                    var idx = 0,
                        handler = events[handle],
                        length = handler.length;

                    while(length--){
                        handler[idx].call(this, argc);
                        idx++;
                    }
                }
            },

            subscribe:function(handle, callback){
                if(!events[handle]){
                    events[handle] = [];
                }

                events[handle].push(callback);
              
                return {
                  event:handle,
                  callback:callback
                }
            },

            unsubscribe:function(handle){
                if(events[handle.event]){
                    var idx = 0,
                        handler = events[handle.event],
                        length = handler.length;

                    while(length--){
                  
                        if(handler[idx] == handle.callback){
                            handler.splice(idx, 1);
                        }

                        idx++;
                    }
                }
            },

            trigger:function(event){
                var module;

                for(module in moduleData){
                    if(moduleData.hasOwnProperty(module)){
                        module = moduleData[module];

                        if(module.events && module.events[event.type]){
                            module.events[event.type].call(event.data);
                        }
                    }
                }
            },

            registerEvents:function(events, module){
                if(this.isObj(events) && module){

                    if(moduleData[module]){
                        moduleData[module].events = events;

                    }else{
                        this.log('Error');
                    }
                }else{
                    this.log('Error');
                }
            },

            removeEvents:function(events, module){
                var i = 0,
                    event;

                if(this.isArr(events) && module){
                    if(module = moduleData[module] && module.events){

                        while(event = events[i++]){
                            delete module.events[event];
                        }
                    }else{
                        this.log('Error');
                    }
                }else{
                    this.log('Error');
                }
            },

            loadPlugins:function(){
                config.plugins.forEach(function(plugin){
                    $.fn[plugin] = function(opts){
                        return new plugin(this, opts).init();
                    }
                });
            },

            isObj:function(obj){
                return $.isPlainObject(obj);
            },

            isArr:function(arr){
                return $.isArray(arr);
            },

            getFontsize:function(elem){
                return parseFloat(
                    getComputedStyle(elem || this.dom.elem).fontSize
                );
            },

            convertToEm:function(value){
                return value * this.getFontsize();
            },

            convertToPt:function(value){
            
            },

            convertBase:function(){
                var pixels, 
                    elem = this.dom.elem,
                    style = elem.getAttribute('style');

                elem.setAttribute('style', style + ';font-size:1em !important');

                base = this.getFontsize();

                elem.setAttribute('style', style);

                return base;
            }
        }
    })(); 

    return Core;

})(jQuery); 
