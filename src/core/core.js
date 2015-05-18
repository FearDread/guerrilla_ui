/* Core Object */

var Guerrilla = function(){
    var _GUI = this,
        _GUI_config = {
            debug:true,
            version:'0.0.1'
        },
        events = [];

    if(!(_GUI instanceof Guerrilla)){
        _GUI = new Guerrilla();
    }

    return {
        modules:{},
        config:_GUI_config,
        create:function(){
            var idx,
                argc = [].slice.call(arguments),
                func = argc.pop(),
                imports = (argc[0] && typeof argc[0] === 'string') ? argc : argc[0];

            if(!imports || imports === 'core'){
                imports = [];

                for(module in this){

                    if(this.hasOwnProperty(module)){
                        imports.push(module);
                    }
                
                }
            
            }

            var temp;
            for(idx = 0; idx < imports.length; idx++){

                module = imports[idx];
                temp = func(new Instance().create(this, module));

                if(temp.load && temp.unload){
                    this.modules[module] = {
                        create:func,
                        instance:temp 
                    }
                }
            }
        },
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
                        this.log('Wrong Number of Arguments.');
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

        _attach:function(){

        },

        hitch:function(func){
            var argc = [].slice.call(arguments).splice(1);

            return function(){
                var all = argc.concat([].slice.call(arguments));

                return func.apply(this, all);
            }
        },

        use:function(){
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
                G = this;

            if(mod && typeof mod === 'object'){
                G[mod] = mod;

                if(!mod.isLoaded){
                    mod.instance = mod.create(new Instance().create(this, module));
                    mod.instance.load();

                    mod.isLoaded = true;
                }
            }

            return G;
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

        plugins:function(){
            var GUI = this;

            GUI.plugins.forEach(function(plugin){
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
        },

        init:function(opts){
            if(opts){
                this.config.pluginOpts = opts;
            }
            return this;
        }
    }
};

Guerrilla = new Guerrilla();

