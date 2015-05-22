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

                create:function(elem){
                    return core.dom.create(elem);
                },

                query:function(selector){
                    return core.dom.query(selector);
                },

                isObj:core.isObj,

                isArr:core.isArr,

                merge:core.merge,

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
        DELIM = '__';
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
                if(_GUI.isObj(attrs)){
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

        _cache:function(source, cache, refetch){
            cache || (cache = {});

            return function(arg){
                var key = arguments.length > 1 ? [].join.call(arguments, DELIM) : String(arg);
                    
                if(!(key in cache) || (refetch && cache[key] == refetch)){
                    cache[key] = source.apply(source, arguments);
                }
                    
                return cache[key];
            }
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

            if(mod && this.isObj(mod)){
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

        /* module specific event trigger */
        trigger:function(event){
            var module;

            for(module in this.modules){
                if(this.modules.hasOwnProperty(module)){
                    module = this.modules[module];

                    if(module.events && module.events[event.type]){
                        module.events[event.type].call(event.data);
                    }
                }
            }
        },

        registerEvents:function(events, module){
            if(this.isObj(events) && module){

                if(this.modules[module]){
                    this.modules[module].events = events;

                }else{
                    this.log('Module not found.');
                }

            }else{
                this.log('Missing Arguments');
            }
        },

        removeEvents:function(events, module){
            var i = 0,
                event;

            if(this.isArr(events) && module){
                if(module = this.modules[module] && module.events){

                    while(event = events[i++]){
                        delete module.events[event];
                    }
                }else{
                    this.log('Module not found.');
                }

            }else{
                this.log('Missing Arguments');
            }
        },

        merge:function(){
            return $.extend(arguments);
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
;/* --------------------------------------- *
* Guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Guerrilla.ui GUI Core           *
* ---------------------------------------- */
$.GUI().create('Media', function(GUI){

    var Media = function(options){
        var self = this,
            breaks, media_change, add_listener, matches,
            hasMatch = GUI.win.media_matches !== undefined && !!GUI.win.media_matches('!').add_listener,

        proto = {

            media_change:function(query, options){
                if(query.matches){

                    if((typeof options.in) === 'function'){
                        options.in(query);
                    }
                }else{
            
                    if((typeof options.out) === 'function'){
                        options.out(query);
                    }
                }

                if((typeof options.both) === 'function'){

                    return options.both(query);
                }
            }, 

            add_listener:function(options){
                var self = this,
                    query = GUI.win.media_matches(options.media),
                    query_cb = function(){
                        return proto.media_change(query, options);
                    },
                    window_cb = function(){
                        var q = GUI.win.matches(options.media);

                        return proto.media_change(q, options);
                    };

                query.addListener(query_cb);

                GUI.win.addEventListener("orientationchange", window_cb, false);

                return proto.media_change(query, options);
            },

            check_query:function(parts){
                var constraint, dimension, matches, ratio, value, windowHeight, windowWidth;

                constraint = parts[1];
                dimension = parts[2];

                if(parts[4]){
                    value = GUI.getPxValue(parseInt(parts[3], 10), parts[4]); 

                }else{
                    value = parts[3];
                }

                windowWidth = window.innerWidth || GUI.docElem.clientWidth;
                windowHeight = window.innerHeight || GUI.docElem.clientHeight;

                if(dimension === 'width'){
                    matches = constraint === "max" && value > windowWidth || constraint === "min" && value < windowWidth;

                }else if(dimension === 'height'){
                    matches = constraint === "max" && value > windowHeight || constraint === "min" && value < windowHeight;

                }else if(dimension === 'aspect-ratio'){
                    ratio = windowWidth / windowHeight;

                    matches = constraint === "max" && eval(ratio) < eval(value) || constraint === "min" && eval(ratio) > eval(value);
                }

                return matches;
            },

            media_listener:function(){
                var opts, matches, media, medias, parts, _i, _len;

                medias = (options.media) ? options.media.split(/\sand\s|,\s/) : null;

                if(medias){
                    matches = true;

                    for(_i = 0, _len = medias.length; _i < _len; _i++){
                        media = medias[_i];
                        parts = media.match(/\((.*?)-(.*?):\s([\d\/]*)(\w*)\)/);

                        if (!proto.check_query(parts)) {
                            matches = false;
                        }
                    }

                    opts = {media:options.media, matches:matches};

                    return proto.media_change(opts, options);
                }
            }
        };

        return function(){
            var win = GUI.win;

            options = arguments[0] || {};

            if(GUI.win.media_matches){
                return proto.add_listener();
            
            }else{
                if(GUI.win.addEventListener){
                    GUI.win.addEventListener("resize", proto.media_listener);

                }else{

                    if(GUI.win.attachEvent){
                        GUI.win.attachEvent("onresize", proto.media_listener);
                    }
                }

                return proto.media_listener();
            }
        } 
    };
  
    return {
        load:function(){
            var argc = arguments[0],
                media = new Media();

            return media(argc);
        },
        unload:function(){
            GUI.cleanup();
        }
    }
});
;/* Slider using GUI Extension */
$.GUI().create('Slider', function(GUI){
  
    return {
        load:function(){

        },
        unload:function(){
        
        }
    }
});
;
/* Stargaze library */

$.GUI().create('Stargaze', function(GUI){

    var Stargaze = function(canvas, options){

        var $canvas = GUI.find(canvas) || null,
            context = (canvas) ? canvas.getContext('2d') : null,
            defaults = {
                star: {
                    color: 'rgba(255, 255, 255, .7)',
                    width: 1
                },
                line: {
                    color: 'rgba(255, 255, 255, .7)',
                    width: 0.2
                },
                position: {
                    x: 0, 
                    y: 0 
                },
                width: window.innerWidth,
                height: window.innerHeight,
                velocity: 0.1,
                length: 100,
                distance: 100,
                radius: 150,
                stars: []
            },
            config = $.extend(true, {}, defaults, options);

        function Star (){
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.vx = (config.velocity - (Math.random() * 0.5));
            this.vy = (config.velocity - (Math.random() * 0.5));

            this.radius = Math.random() * config.star.width;
        }

        Star.prototype = {

            create: function(){
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                context.fill();
            },

            animate: function(){
                var i;

                for(i = 0; i < config.length; i++){
                    var star = config.stars[i];

                    if(star.y < 0 || star.y > canvas.height){
                        star.vx = star.vx;
                        star.vy = - star.vy;

                    }else if (star.x < 0 || star.x > canvas.width){
                        star.vx = - star.vx;
                        star.vy = star.vy;
                    }

                    star.x += star.vx;
                    star.y += star.vy;
                }
            },

            line:function(){
                var length = config.length,
                    iStar,
                    jStar,
                    i,
                    j;

                for(i = 0; i < length; i++){
                    for(j = 0; j < length; j++){
                        iStar = config.stars[i];
                        jStar = config.stars[j];

                        if (
                            (iStar.x - jStar.x) < config.distance &&
                            (iStar.y - jStar.y) < config.distance &&
                            (iStar.x - jStar.x) > - config.distance &&
                            (iStar.y - jStar.y) > - config.distance
                        ) {
                            if (
                                (iStar.x - config.position.x) < config.radius &&
                                (iStar.y - config.position.y) < config.radius &&
                                (iStar.x - config.position.x) > - config.radius &&
                                (iStar.y - config.position.y) > - config.radius
                            ) {
                                context.beginPath();
                                context.moveTo(iStar.x, iStar.y);
                                context.lineTo(jStar.x, jStar.y);
                                context.stroke();
                                context.closePath();
                            }
                        }
                    }
                }
            }
        };

        this.createStars = function(){
            var length = config.length,
                star, i;

            context.clearRect(0, 0, canvas.width, canvas.height);

            for(i = 0; i < length; i++){
                config.stars.push(new Star());

                star = config.stars[i];
                star.create();
            }

            star.line();
            star.animate();
        };

        this.setCanvas = function(){
            canvas.width = config.width;
            canvas.height = config.height;
        };

        this.setContext = function(){
            context.fillStyle = config.star.color;
            context.strokeStyle = config.line.color;
            context.lineWidth = config.line.width;
        };

        this.setInitialPosition = function(){
            if(!options || !options.hasOwnProperty('position')){
                config.position = {
                    x: canvas.width * 0.5,
                    y: canvas.height * 0.5
                };
            }
        };

        this.loop = function(callback){
            callback();

            window.requestAnimationFrame(function(){
                this.loop(callback);
            }.bind(this));
        };

        this.bind = function(){
            $(document).on('mousemove', function(e){
                config.position.x = e.pageX - $canvas.offset().left;
                config.position.y = e.pageY - $canvas.offset().top;
            });
        };

        this.init = function(){
            this.setCanvas();
            this.setContext();
            this.setInitialPosition();
            this.loop(this.createStars);
            this.bind();
        };
    }

    return {
        fn:function(){
            var argc = arguments[0],
                $elem = argc[0],
                opts = argc[1];

            return new Stargaze($elem, opts).init();
        }
    }
});
