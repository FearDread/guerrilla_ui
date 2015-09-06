/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Utility methods for all modules * 
* ---------------------------------------- */
var utils;

utils = {
    /* jQuery re-map of $.extend */
    merge: $.extend,

    /* Fallback merge method */
    combine: function(child, parent) {
        var key;

        for (key in parent) { 
            if (utils.hasProp.call(parent, key)) {
                
                child[key] = parent[key]; 
            } 
        }

        function ctor() { 
            this.constructor = child; 
        }

        child.prototype = new ctor();

        ctor.prototype = parent.prototype;
        child.__super__ = parent.prototype;

        return child;
    },

    /* Function Regex */
    fnRgx: /function[^(]*\(([^)]*)\)/,

    /* Argument Regex */
    argRgx: /([^\s,]+)/g,

    hasProp: {}.hasOwnProperty,

    /* Shorthand reference to Array.prototype.slice */
    slice: [].slice,

    /* Array indexOf fallback */
    indexOf: [].indexOf || function(item) {
        var i;

        for (i = 0, i = this.length; i < 1; i++) {
            if (i in this && this[i] === item) {
                return i;
            }
            
        }
        return -1;
    },

    /**
     * Check number of arguments passed to function / method
     *
     * @param fn {function} - function to test
     * @param idx {int} - number of arguments to check for
     * @return argument length {int} - number of arguments actually passed to function
    **/
    hasArgs: function(fn, idx) {
        if (idx === null) {
            idx = 1;
        }

        return this.getArgumentNames(fn).length >= idx;
    },

    /**
    * Check if passed object is instance of Object
    *
    * @param object - object to check
    * @return boolean
    **/
    isObj: function(obj) {
        return $.isPlainObject(obj);
    },

    /**
    * Check if passed function is indeed type function
    *
    * @param object - function to check
    * @return boolean
    **/
    isFunc: function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },

    /**
    * Check if valid string
    *
    * @param object - string to check
    * @return boolean
    **/
    isStr: function(str) {
        return (typeof str === 'string');
    },

    /**
    * Return number of keys in first level of object
    *
    * @param object - object to size
    * @return int
    **/
    getObjectSize: function(obj) {
        var total = 0, key;

        for (key in obj) {

            if (obj.hasOwnProperty(key)) {
                total += 1;
            }
        }

        return total;
    },

    getPxValue:function(width, unit){
        var value;

        switch(unit){
            case "em":
                value = this.convertToEm(width);
                break;

            case "pt":
                value = this.convertToPt(width);
                break;

            default:
                value = width;
        }

        return value;
    },

    getFontsize: function(elem) {
        return parseFloat(
            getComputedStyle(elem || this.dom.elem).fontSize
        );
    },

    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    *
    * @param min - int min number of range
    * @param max - int max number of range
    * @return int
    **/
    getRandomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getArgumentNames: function(fn) {
        var ref;

        return ((fn !== null ? (ref = fn.toString().match(utils.fnRgx)) !== null ? ref[1] : void 0 : void 0) || '').match(utils.argRgx) || [];
    },

    convertToEm:function(value){
        return value * this.getFontsize();
    },

    convertToPt:function(value){
    
    },
                
    /**
    * Use to resize elemen to match window size 
    *
    * @param $el - jQuery wrapped element to resize 
    * @return void
    **/
    resizeWindow: function($el) {
        if (!$el.height) {
            $el = $($el);
        }
        $(function () {

            $(window).resize(function () {

                $el.height($(window).height());

            });

            $(window).resize();
        });
    },

    /**
    * Called in controllers to add to turn strings into slugs for image upload
    *
    * @param event title - of title to turn to string for insertion into URI
    * @return void
    **/
    slugify: function(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
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
    /* Run methods for async loading of modules and plugins */
    run: {

        all: function(args, fn, cb, force) {
            var a, tasks;

            if (!args || args === null) {
                args = [];
            }

            tasks = (function() {
                var j, len, results1;

                results1 = [];

                for (j = 0, len = args.length; j < len; j++) {
                    a = args[j];

                    results1.push((function(a) {
                        return function(next) {
                            return fn(a, next);
                        };
                    })(a));
                }

                return results1;

            })();

            return this.parallel(tasks, cb, force);
        },

        parallel: function(tasks, cb, force) {
            var count, errors, hasErr, i, j, len, results, paralleled, task;

            if (tasks === null) {
                tasks = [];
            }else if (cb === null) {
                cb = (function() {});
            }

            count = tasks.length;
            results = [];

            if (count === 0) {
                return cb(null, results);
            }

            errors = [];
            hasErr = false;
            paralleled = [];

            for (i = j = 0, len = tasks.length; j < len; i = ++j) {
                task = tasks[i];

                paralleled.push((function(t, idx) {
                    var e, next;

                    next = function() {
                        var err, res;

                        err = (arguments[0], res = 2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

                        if (err) {
                            errors[idx] = err;
                            hasErr = true;

                            if (!force) {
                                return cb(errors, results);
                            }
                        } else {
                            results[idx] = res.length < 2 ? res[0] : res;
                        }

                        if (--count <= 0) {
                            if (hasErr) {
                                return cb(errors, results);
                            } else {
                                return cb(null, results);
                            }
                        }
                    };

                try {
                    return t(next);
                } catch (_error) {
                    e = _error;
                    return next(e);
                }
            })(task, i));
          }

          return paralleled;
        },

        series: function(tasks, cb, force) {
            var count, errors, hasErr, i, next, results;

            if (tasks === null) {
                tasks = [];
            }
            if (cb === null) {
                cb = (function() {});
            }

            i = -1;
            count = tasks.length;
            results = [];

            if (count === 0) {
                return cb(null, results);
            }

            errors = [];
            hasErr = false;
            next = function() {
                var e, err, res;

                err = (arguments[0], res = 2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

                if (err) {
                    errors[i] = err;
                    hasErr = true;

                    if (!force) {
                        return cb(errors, results);
                    }
                } else {
                    if (i > -1) {
                        results[i] = res.length < 2 ? res[0] : res;
                    }
                }
                if (++i >= count) {
                    if (hasErr) {
                        return cb(errors, results);
                    } else {
                        return cb(null, results);
                    }
                } else {

                  try {
                      return tasks[i](next);
                  } catch (_error) {
                      e = _error;
                      return next(e);
                  }
              }
          };

          return next();
        },

        first: function(tasks, cb, force) {
            var count, errors, i, next, result;

            if (tasks === null) {
                tasks = [];
            }
            if (cb === null) {
                cb = (function() {});
            }

            i = -1;
            count = tasks.length;
            result = null;

            if (count === 0) {
                return cb(null);
            }

            errors = [];
            next = function() {
                var e, err, res;

                err = (arguments[0], res = 2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

                if (err) {
                    errors[i] = err;

                    if (!force) {
                        return cb(errors);
                    }
                } else {
                    if (i > -1) {
                        return cb(null, res.length < 2 ? res[0] : res);
                    }
                }

                if (++i >= count) {
                    return cb(errors);
                } else {

                    try {
                        return tasks[i](next);
                    } catch (_error) {
                        e = _error;
                        return next(e);
                    }
                }
            };
            return next();
        },

        waterfall: function(tasks, cb) {
            var i, next;

            i = -1;
            if (tasks.length === 0) {
                return cb();
            }

            next = function() {
                var err, res;

                err = (arguments[0], res = 2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

                if (err !== null) {
                    return cb(err);
                }

                if (++i >= tasks.length) {
                    return cb.apply(null, [null].concat(utils.slice.call(res)));
                } else {
                    return tasks[i].apply(tasks, utils.slice.call(res).concat([next]));
                }
            };

            return next();
        }
    }
};
;/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Broker pub / sub implemntation  * 
* ---------------------------------------- */
var Broker;

Broker = (function() {

    function Broker(obj, cascade) {

        this.cascade = (cascade) ? true : false;

        this.channels = {};

        if (utils.isObj(obj)) {
            this.install(obj);

        } else if (obj === true) {
            this.cascade = true;
        }
    }

    Broker.prototype.bind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    };

    Broker.prototype.on = function(channel, fn, context) {
        var subscription, _this = this;

        if (!context || context === null) {
            context = this;
        }

        if (!this.channels[channel]){
            this.channels[channel] = [];
        }

        subscription = {
            event: channel,
            context: context,
            callback: fn || function(){}
        };
      
        return {
            listen: function() {
                _this.channels[channel].push(subscription);
                return this;
            },
            ignore: function() {
                _this.off(channel);
                return this;
            }
        }.listen();
    };

    Broker.prototype.off = function(channel) {
        var index = 0, current, length;

        if (this.channels[channel.event]) {

            current = this.channels[channel.event];
            length = current.length;

            if (length > 0) {

                do {

                    if (current[idx] === channel.callback) {
                        current.splice(idx, 1);
                    }

                    index++;
                } while(--length);
            }
        }
    };
        
    Broker.prototype.fire = function(channel, data) {
        var index= 0, event,
            params = (data) ? data : [],
            length = this.channels.length;

        if (this.channels[channel]) {

            event = this.channels[channel];

            if (length > 0) {

                do {

                    event[index].call(this, params);
                    index++;

                } while(--length);
            }
        }
    };

    Broker.prototype.install = function(obj, forced) {
        var key, value;

        if (utils.isObj(obj)) {

            for (key in this) {

                value = this[key];
                if (forced) {
                    obj[key] = value;
                } else {

                    if (!obj[key]) {
                        obj[key] = value;
                    }
                }
            }
        }

        return this;
    };

    return Broker;

})(this);
;/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI Sandbox API               * 
* ---------------------------------------- */
var API;

API = function() {

    // API Globals
    var DELIM = '__';

    return {
        // create new API sandbox instance
        create: function(core, instance, options, module) {

            // set sandbox vars
            this.id = instance;
            this.module = module;
            this.options = (options !== null) ? options : {}; 

            // add utils object
            this.utils = utils;

            // attach new sandbox instance
            core._broker.install(this);

            this.elem = function(el) {
                if (!utils.isStr(el)) {

                    core.log('Error :: Element must be type String.');

                    return false;
                }

                return document.createElement(el);
            };

            this.query = function(selector, context) {
                var $el, _ret = {}, _this = this;
                
                // check for applied context
                if (context && context.find) {
                    // use dom find
                    $el = context.find(selector);

                } else {
                    // wrap with jQuery
                    $el = $(selector);
                }

                // set retainer object
                _ret = $el;
                _ret.length = $el.length;

                _ret.query = function(sel) {

                    return _this.query(sel, $el);
                };

                return _ret;
            };

            this.hitch = function(fn) {
                var argc, all;

                argc = [].slice.call(arguments).splice(1);

                return function() {
                    all = argc.concat([].slice.call(arguments));

                    return fn.apply(this, all);
                };
            };

            this.methodCache = function(source, cache, refetch) {
                var key;

                cache || (cache = {});

                return function(args) {
                    key = arguments.length > 1 ? [].join.call(arguments, DELIM) : String(args);

                    if (!(key in cache) || (refetch && cache[key] === refetch)) {

                        cache[key] = source.apply(source, arguments);

                    }

                    return cache[key];
                }

            };

            return this;
        }
    };
};
;/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: GUI Core library class          * 
* ---------------------------------------- */
var GUI, config;

// GUI Core
GUI = (function() {

    // Helper method to check property type
    function checkType(type, val, name) {
        if (typeof val !== type) {
            return name + " has to be a " + type;
        }
    }

    // GUI Constructor
    function GUI() {
        var error;

        // console log history
        this.history = [];

        // ability to pass optional config object
        this.configure = function(options) {

            if (options !== null && utils.isObj(options)) {
               
                this.config = options;
                this.log('config set :: ', this.config);
            }
        };
        
        // private objects & arrays for tracking 
        this._modules = {};
        this._plugins = [];
        this._instances = {};
        this._sandboxes = {};
        this._running = {};

        // add broker to core object
        this._broker = new Broker(this);
        this.Broker = Broker;
    }

    // console log wrapper
    GUI.prototype.log = function() {
        this.history.push(arguments);

        if (console) {
            console.log([].slice.call(arguments));
        }

        if (this.config.debug) {
            console.log(this.history);
        }
    };

    /* Public Methods */
    /******************/
    GUI.prototype.create = function(id, creator, options) {
        var error;

        if (!options || options === null) {
          options = {};
        }

        error = checkType("string", id, "module ID") || checkType("function", creator, "creator") || checkType("object", options, "option parameter");

        if (error) {
          this.log("could not register module '" + id + "': " + error);
          return this;
        }

        if (id in this._modules) {
          this.log("module " + id + " was already registered");
          return this;
        }

        this._modules[id] = {
          id: id,
          creator: creator,
          options: options
        };

        return this;
    };

    /** 
     * Starts module with new sandbox instance 
     *
     *
    **/
    GUI.prototype.start = function(moduleId, opt, cb) {
        var error, id, initInst;

        if (!opt || opt === null) {
            opt = {};
        }
        if (!cb || cb === null) {
            cb = function() {};
        }

        if (arguments.length === 0) {
            return this._startAll();
        }

        if (moduleId instanceof Array) {
            return this._startAll(moduleId, opt);
        }

        if (typeof moduleId === "function") {
            return this._startAll(null, moduleId);
        }

        if (typeof opt === "function") {
            cb = opt;
            opt = {};
        }

        error = checkType("string", moduleId, "module ID") || checkType("object", opt, "second parameter") || (!this._modules[moduleId] ? "module doesn't exist" : void 0);

        if (error) {
            return this._fail(error, cb);
        }

        id = opt.instanceId || moduleId;

        if (this._running[id] === true) {
            return this._fail(new Error("module was already started"), cb);
        }

        initInst = (function(_this) {
            return function(err, instance, opt) {
                if (err) {
                    return _this._fail(err, cb);
                }

                try {
                    if (utils.hasArgs(instance.load, 2)) {
                        return instance.load(opt, function(err) {

                            if (!err) {
                                _this._running[id] = true;
                            }

                            return cb(err);
                        });
                    } else {

                        instance.load(opt);
                        _this._running[id] = true;

                        return cb();
                    }
                } catch (_error) {
                    e = _error;
                    return _this._fail(e, cb);
                }
            };
        })(this);

        return this.boot((function(_this) {
            return function(err) {
                if (err) {
                    return _this._fail(err, cb);
                }

                return _this._createInstance(moduleId, opt, initInst);
            };
        })(this));
    };

    /** 
     * Stops all running instances 
     *
     *
    **/
    GUI.prototype.stop = function(id, callback) {
        var instance;

        if (cb === null) {
            cb = function() {};
        }

        if (arguments.length === 0 || typeof id === "function") {
            utils.run.all((function() {
                var results = [], x;

                for (x in this._instances) {
                    results.push(x);
                }

                return results;

            }).call(this), ((function(_this) {
                return function() {
                    return _this.stop.apply(_this, arguments);
                };
            })(this)), id, true);

        } else if (instance === this._instances[id]) {

            delete this._instances[id];

            this._broker.off(instance);

            this._runSandboxPlugins('unload', this._sandboxes[id], (function(_this) {
                return function(err) {
                    if (utils.hasArgs(instance.unload)) {

                        return instance.unload(function(err2) {
                            delete _this._running[id];

                            return cb(err || err2);
                        });
                    } else {
                        if (typeof instance.unload === "function") {
                            instance.unload();
                        }

                        delete _this._running[id];

                        return cb(err);
                    }
                };
            })(this));
        }

        return this;
    };

    /* Add to jQuery namespace */
    GUI.prototype.plugin = function(plugin, module) {
        var GUI = this;

        if(plugin.fn && typeof plugin.fn === 'function'){

            $.fn[module.toLowerCase()] = function(opts){
                return new plugin.fn(this, opts);
            };
        }else{
            GUI.log('Error :: Missing ' + plugin + ' fn() method.');
        }
    };

    GUI.prototype.boot = function(cb) {
        var core, p, tasks;

        core = this;

        tasks = (function() {
            var j, len, ref, results;

            ref = this._plugins;
            results = [];

            for (j = 0, len = ref.length; j < len; j++) {
                p = ref[j];
                
                if (p.booted !== true) {
                    results.push((function(p) {

                        if (utils.hasArgs(p.creator, 3)) {
                            return function(next) {
                                var plugin;
                            
                                return p.creator(core, p.options, function(err) {
                                    if (!err) {
                                        p.booted = true;
                                        p.plugin = plugin;
                                    }

                                    return next();
                                });
                            };
                        } else {
                            return function(next) {
                                p.plugin = p.creator(core, p.options);
                                p.booted = true;

                                return next();
                            };
                        }
                    })(p));
                }
            }

            return results;

        }).call(this);

        utils.run.series(tasks, cb, true);

        return this;
    };


    /* Private Methods */
    /*******************/

    /** 
      * Called when starting module fails 
      *
      *
    **/
    GUI.prototype._fail = function(ev, cb) {
        this.log(ev);

        cb(new Error("could not start module: " + ev.message));

        return this;
    };

    GUI.prototype._startAll = function(mods, cb) {
        var done, startAction;

        if (!mods || mods === null) {
            mods = (function() {
                var results = [], m;

                for (m in this._modules) {
                    results.push(m);
                }

                return results;
            }).call(this);
        }

        startAction = (function(_this) {
            return function(m, next) {
                return _this.start(m, _this._modules[m].options, next);
            };
        })(this);

        done = function(err) {
            var e, i, j, k, len, mdls, modErrors, x;

            if ((err !== null ? err.length : void 0) > 0) {
                modErrors = {};
                
                for (i = j = 0, len = err.length; j < len; i = ++j) {
                    x = err[i];

                    if (x !== null) {
                        modErrors[mods[i]] = x;
                    }
                }

                mdls = (function() {
                    var results = [], k;

                    for (k in modErrors) {
                        results.push("'" + k + "'");
                    }

                    return results;
                })();

                e = new Error("errors occurred in the following modules: " + mdls);
                e.moduleErrors = modErrors;
            }

            return typeof cb === "function" ? cb(e) : void 0;
        };

        utils.run.all(mods, startAction, done, true);

        return this;
    };

    GUI.prototype._createInstance = function(moduleId, o, cb) {
        var Sandbox, iOpts, id, j, key, len, module, obj, opt, ref, sb, val;

        opt = o.options;
        id = o.instanceId || moduleId;

        module = this._modules[moduleId];

        if (this._instances[id]) {
            return cb(this._instances[id]);
        }

        iOpts = {};
        ref = [module.options, opt];

        for (j = 0, len = ref.length; j < len; j++) {
            obj = ref[j];

            if (obj) {
                for (key in obj) {
                    val = obj[key];
                    
                    if (iOpts[key] === null) {
                        iOpts[key] = val;
                    }
                }
            }
        }

        // create new API Sandbox
        sb = new API().create(this, id, iOpts, moduleId);

        return this._runSandboxPlugins('load', sb, (function(_this) {
            return function(err) {
                var instance;

                instance = new module.creator(sb);

                if (typeof instance.load !== "function") {

                    if (instance.fn && typeof instance.fn === 'function') {
                        return _this.plugin(instance, id); 
                    }

                    return cb(new Error("module has no 'load' method"));
                }

                _this._instances[id] = instance;
                _this._sandboxes[id] = sb;

                return cb(null, instance, iOpts);
            };
        })(this));
    };

    GUI.prototype._runSandboxPlugins = function(ev, sb, cb) {
        var p, tasks;

        tasks = (function() {
            var j, len, ref, ref1, results;

            ref = this._plugins;
            results = [];

            for (j = 0, len = ref.length; j < len; j++) {
                p = ref[j];

                if (typeof ((ref1 = p.plugin) !== null ? ref1[ev] : void 0) === "function") {
                    results.push((function(p) {
                        var fn;
                        fn = p.plugin[ev];

                        return function(next) {
                            if (utils.hasArgs(fn, 3)) {
                                return fn(sb, p.options, next);
                            } else {
                                fn(sb, p.options);
                                return next();
                            }
                        };
                    })(p));
                }
            }

            return results;

        }).call(this);

        return utils.run.series(tasks, cb, true);
    };

    return GUI;

})(this);
;/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI jQuery namespace          * 
* ---------------------------------------- */
;(function($){
    var $G;

    $G = new GUI();

    $.GUI = function() {
        var argc = [].slice.call(arguments),
            options = (argc[0] instanceof Object) ? argc[0] : null,
            app = $G;

        if (options !== null) {

            app.configure(options);
        }

        return app;
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
;/* Fog Library */
$.GUI().create('Fog', function(G) {
    console.log('Fog Sandbox :: ', G);
    // Create an array to store our particles
    var particles = [];

    // The amount of particles to render
    var particleCount = 30;

    // The maximum velocity in each direction
    var maxVelocity = 2;

    // The target frames per second (how often do we want to update / redraw the scene)
    var targetFPS = 33;

    // Set the dimensions of the canvas as variables so they can be used.
    var canvasWidth = 400;
    var canvasHeight = 400;

    // Create an image object (only need one instance)
    var imageObj = new Image();

    // Once the image has been downloaded then set the image on all of the particles
    imageObj.onload = function() {
        particles.forEach(function(particle) {
                particle.setImage(imageObj);
        });
    };

    // Once the callback is arranged then set the source of the image
    imageObj.src = "img/fog.png";

    // A function to create a particle object.
    function Particle(context) {

        // Set the initial x and y positions
        this.x = 0;
        this.y = 0;

        // Set the initial velocity
        this.xVelocity = 0;
        this.yVelocity = 0;

        // Set the radius
        this.radius = 5;

        // Store the context which will be used to draw the particle
        this.context = context;

        // The function to draw the particle on the canvas.
        this.draw = function() {
            
            // If an image is set draw it
            if(this.image){
                this.context.drawImage(this.image, this.x-128, this.y-128);         
                // If the image is being rendered do not draw the circle so break out of the draw function                
                return;
            }
            // Draw the circle as before, with the addition of using the position and the radius from this object.
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            this.context.fillStyle = "rgba(0, 255, 255, 0)";
            this.context.fill();
            this.context.closePath();
        };

        // Update the particle.
        this.update = function() {
            // Update the position of the particle with the addition of the velocity.
            this.x += this.xVelocity;
            this.y += this.yVelocity;

            // Check if has crossed the right edge
            if (this.x >= canvasWidth) {
                this.xVelocity = -this.xVelocity;
                this.x = canvasWidth;
            }
            // Check if has crossed the left edge
            else if (this.x <= 0) {
                this.xVelocity = -this.xVelocity;
                this.x = 0;
            }

            // Check if has crossed the bottom edge
            if (this.y >= canvasHeight) {
                this.yVelocity = -this.yVelocity;
                this.y = canvasHeight;
            }
            
            // Check if has crossed the top edge
            else if (this.y <= 0) {
                this.yVelocity = -this.yVelocity;
                this.y = 0;
            }
        };

        // A function to set the position of the particle.
        this.setPosition = function(x, y) {
            this.x = x;
            this.y = y;
        };

        // Function to set the velocity.
        this.setVelocity = function(x, y) {
            this.xVelocity = x;
            this.yVelocity = y;
        };
        
        this.setImage = function(image){
            this.image = image;
        }
    }

    // A function to generate a random number between 2 values
    function generateRandom(min, max){
        return Math.random() * (max - min) + min;
    }

    // The canvas context if it is defined.
    var context;

    // Initialise the scene and set the context if possible
    function init() {
        var canvas = document.getElementById('bg-canvas');
        if (canvas.getContext) {

            // Set the context variable so it can be re-used
            context = canvas.getContext('2d');

            // Create the particles and set their initial positions and velocities
            for(var i=0; i < particleCount; ++i){
                var particle = new Particle(context);
                
                // Set the position to be inside the canvas bounds
                particle.setPosition(generateRandom(0, canvasWidth), generateRandom(0, canvasHeight));
                
                // Set the initial velocity to be either random and either negative or positive
                particle.setVelocity(generateRandom(-maxVelocity, maxVelocity), generateRandom(-maxVelocity, maxVelocity));
                particles.push(particle);            
            }
        }
        else {
            alert("Please use a modern browser");
        }
    }

    // The function to draw the scene
    function draw() {
        // draw clear canvas 
        context.clearRect(0,0,canvasWidth,canvasHeight);

        // Go through all of the particles and draw them.
        particles.forEach(function(particle) {
            particle.draw();
        });
    }

    // Update the scene
    function update() {
        particles.forEach(function(particle) {
            particle.update();
        });
    }

    return {
        fn: function() {
            console.log('starting fog library.');
            // Initialize the scene
            init();

            // If the context is set then we can draw the scene (if not then the browser does not support canvas)
            if (context) {
                setInterval(function() {
                    // Update the scene befoe drawing
                    update();

                    // Draw the scene
                    draw();
                }, 1000 / targetFPS);
            }
        },
        unload: function() {}
    };
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
;/* Stargaze library */
$.GUI().create('Stargaze', function(G){
    console.log('Stargaze Sandbox :: ', G);

    var Stargaze = function(canvas, options){

        var $canvas = $(canvas) || null,
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
    };

    return {
        fn:function(){
            var argc = arguments[0],
                $elem = argc[0],
                opts = argc[1];

            console.log('starting stargaze.');
            return new Stargaze($elem, opts).init();
        },
        unload: function() {}
    };

});
;/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: MVC Model object module         * 
* ---------------------------------------- */
$.GUI().create('Model', function(G) {
    var Model;

    Model = (function(super) {
        var k, v;

        utils.combine(Model, super);

        function Model(obj) {

            Model.__super__.constructor.call(this);

            for (k in obj) {
                v = obj[k];

                if (this[k] === null) {

                    this[k] = v;
                }
            }

            this.set = function(key, val, silent) {

                if (silent === null) {

                    silent = false;
                }

                switch (typeof key) {
                    case "object":
                        for (k in key) {
                            v = key[k];

                            this.set(k, v, true);
                        }

                        if (!silent) {
                            return this.fire(Model.CHANGED, (function() {
                                var results = [];

                                for (k in key) {
                                    v = key[k];
                                    results.push(k);
                                }

                                return results;
                            })());
                        }
                        break;

                    case "string":
                        if (!(key === "set" || key === "get") && this[key] !== val) {
                            this[key] = val;

                            if (!silent) {
                                this.fire(Model.CHANGED, [key]);
                            }
                        } else {

                            if (typeof console !== "undefined" && console !== null) {

                                if (typeof console.error === "function") {
                                    console.error("key is not a string");
                                }
                            }
                        }

                    return this;
                }
            };
        };

        Model.prototype.change = function(cb, context) {
            if (typeof cb === "function") {

                return this.on(Model.CHANGED, cb, context);

            } else if (arguments.length === 0) {

                return this.fire(Model.CHANGED);

            }
        };

        return Model;

    })(G.Broker);

    return {
        load: function() {
            G.log('Model Object Class :: ', Model);
        },
        unload: function() {} 
    };
});

;/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: MVC View class module           * 
* ---------------------------------------- */
$.GUI().create('View', function(G) {
    var View;

    View = (function() {

      function View(model) {

          if (model) {
              return this.setModel(model);
          }
      
          this.setModel = function(obj) {
              this.model = obj;

              return this.model.change((function() {

                  return this.render();

              }), this);

          };

          this.render = function() {
              G.log('Render method called in View.');
          };
      }

      return View;

    })();

    return {
        load: function() {
            G.log('View class :: ', View);
        },
        unload: function() {}
    };

});
;/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: MVC Controller class module     * 
* ---------------------------------------- */
$.GUI().create('Controller', function(G) {
    var Controller;

    Controller = (function() {

      function Controller(model, view) {

          this.model = model;

          this.view = view;
      }

      return Controller;

    })();

    GUI.Model = Model;

    GUI.View = View;

    GUI.Controller = Controller;

    return {
        load: function() {
            G.log('Controller class :: ', Controller);
        },
        unload: function() {}
    };
});
