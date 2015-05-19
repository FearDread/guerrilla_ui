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
;/* Core Object */
var GuerrillaUI = function(){
    var _GUI = this,
        _GUI_config = {
            debug:true,
            version:'0.0.1'
        },
        events = [];

    if(!(_GUI instanceof GuerrillaUI)){
        _GUI = new GuerrillaUI();
    }

    return {
        win:window,
        modules:{},
        config:_GUI_config,
        create:function(){
            var idx,
                GUI = this,
                argc = [].slice.call(arguments),
                func = argc.pop(),
                imports = (argc[0] && typeof argc[0] === 'string') ? argc : argc[0];

            if(!imports || imports === 'core'){
                imports = [];

                for(module in GUI.modules){

                    if(GUI.modules.hasOwnProperty(module)){
                        imports.push(module);
                    }
                }
            }

            var temp,
                idx = 0,
                length = imports.length;

            do {
                module = imports[idx];

                if(module){
                    temp = func(new _GUI_Instance().create(this, module));

                    if(temp.load && temp.unload){
                        this.modules[module] = {
                            create:func,
                            instance:temp 
                        }
                    }else if(temp.fn){
                        this._plugin(temp);
                    }
                }
            
                idx++;
            } while(--length);

            return GUI;
        },
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

                _ret = $el;
                _ret.length = $el.length;
                _ret.query = function(sel){
                    return _this.query(sel, $el);
                };

                return _ret;
            },
            create:function(el){
                return this.doc.createElement(el);
            },
            attr:function($el, attrs){
                if(Core.isObj(attrs)){
                    $(el).attr(attrs);
                }
            },
            event:{
                on:function($elem, evnt, func){
                    if($elem && evnt){
                        if(typeof evnt === 'function'){
                            func = evnt;
                            evnt = 'click';
                        }

                        $elem.on(evnt, this, func);
                    }else{
                        GUI.log('Wrong Number of Arguments.');
                    }
                },

                off:function($elem, evnt, func){
                    if($elem && evnt){
                        if(typeof evnt === 'function'){
                            func = evnt;
                            evnt = 'click';
                        }

                        $elem.off(evnt, func);
                    }else{
                        this.log('Wrong Number of Arguments.');
                    }
                }
            }
        },

        _attach:function(instance){
            var i, mod;

            for(i in this.modules){

                if(this.modules.hasOwnProperty(i)){
                    mod = this.modules[i];

                    instance[i] = mod.instance.load;
                }
            }

            return instance;
        },

        _plugin:function(plugin){
            var GUI = this;

            if(plugin.fn && typeof plugin.fn === 'function'){

                $.fn[module.toLowerCase()] = function(opts){
                    return new plugin.fn(this, opts);
                } 
            }else{
                GUI.log('Error :: Missing ' + plugin + ' fn() method.');
            }
        },

        _cache:function(){
        
        },

        hitch:function(func){
            var argc = [].slice.call(arguments).splice(1);

            return function(){
                var all = argc.concat([].slice.call(arguments));

                return func.apply(this, all);
            }
        },

        load:function(){
            var idx = 0,
                GUI = this, 
                argc = [].slice.call(arguments, 0),
                func = argc.pop(),
                module = (typeof argc[0] === 'string') ? argc[0] : null;

            if(module === 'core'){
                GUI.create(module, func);
                GUI.start(module);

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
            var mod = this.modules[module],
                GUI = this;

            if(mod && typeof mod === 'object'){
                GUI[mod] = mod;

                if(!mod.isLoaded){
                    mod.instance = mod.create(new _GUI_Instance().create(this, module));
                    mod.instance.load();

                    mod.isLoaded = true;
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

            for(module in this.modules){
                if(this.modules.hasOwnProperty(module)){
                    console.log('mod = ', module);
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

        clobber:function(){
        
        },

        error:function(){
            if(this.config.debug){
                throw new TypeError('Error ::', arguments[0]);
            }
        },

        log:function(){
            var argc = arguments[0];

            if(this.config.debug){
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
},
/* Initialize Core object */
GUI = new GuerrillaUI();

;/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI jQuery namespace          * 
* ---------------------------------------- */
;(function($){

    $.GUI = function(){
        var argc = [].slice.call(arguments),
            app = (argc[0] instanceof Object) ? argc[0] : null,
            proto = $.extend(app, GUI);

        return Object.create(proto);
    };

    $.fn.GUI = function(options){
        return this.each(function(){
            if(!$.data(this, 'guerrilla')){

                $.data(this, 'guerrilla', new $.GUI().create(this, options));
            }else{
                return new $.GUI().create(this, options);
            }
        });
    };

})(jQuery);
