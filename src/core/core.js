/* Core Object */
;var Guerrilla = (function($){

    if(typeof jQuery === 'undefined' || typeof $ === 'undefined'){
      console.log('Guerrilla UI Requires jQuery.');
      return;
    }

    var Sandbox = {
        create:function(core, module_selector){ 
            var CONTAINER = core.dom.query('#' + module_selector);

            return { 
                dom:core.dom,

                log:function(){
                    core.log(arguments);
                },

                find:function(selector){
                    return CONTAINER.query(selector);
                },

                publish:function(evnt, argc){
                    if(typeof evnt === 'string'){
                        core.publish(evnt, argc);
                    }
                },

                scribe:function(handle, func){
                    if(typeof handle === 'string'){
                        core.subscribe(handle, func);
                    }
                },

                unscribe:function(handle){
                    if(typeof handle === 'object'){
                        core.unsubscribe(handle);
                    }
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
                    if(core.isObj(evnt) && evnt.type){
                        core.trigger(evnt);
                    }
                },

                listen:function(events){
                    if(core.isObj(events)){
                        core.registerEvents(events, module_selector);
                    }
                },

                ignore:function(events){
                    if(core.isArr(events)){
                        core.removeEvents(events, module_selector);
                    }
                }
            }
        }
    },

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

            create:function(module, func){
                var temp;

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
            },

            use:function(module, func){
                var temp;

                if(moduleData[module]){
                    temp = func(Sandbox.create(this, moduleData[module]));

                }
                return this.create(module, func);
            },

            start:function(module){
                var mod = moduleData[module];

                if(mod){
                    mod.instance = mod.create(Sandbox.create(this, module));
                    mod.instance.load();
                }
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
