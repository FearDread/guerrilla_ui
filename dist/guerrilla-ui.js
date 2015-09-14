/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Utility methods for all modules * 
* ---------------------------------------- */
var utils;

utils = {
    /* jQuery re-map of $.extend */
    merge: $.extend,

    /**
     * Attach child object prototype to parent object prototype 
     *
     * @param child {object} - object to merge prototype 
     * @param parent {object} - parent object prototype 
     * @return child {object} - combined child & parent prototypes 
    **/
    extend: function(child, parent) {
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

    /* Shorthand reference to Object.prototype.hasOwnProperty */
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
    * Check typeof of passed value to name 
    *
    * @param type {string} - string type to check against 
    * @return boolean
    **/
    isType: function(type, val, name) {
        if (typeof val !== type) {
            return 'Error :: ' + name + " must be of type " + type;
        }
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
    * Check for retina display on device 
    *
    * @return boolean
    **/
    isRetina: function() {
      return (window.retina || window.devicePixelRatio > 1);
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

    /**
    * Returns list of argument names from function 
    *
    * @param fn {function} - the function to get arguments from 
    * @return {array}  
    **/
    getArgumentNames: function(fn) {
        var ref;

        return ((fn !== null ? (ref = fn.toString().match(utils.fnRgx)) !== null ? ref[1] : void 0 : void 0) || '').match(utils.argRgx) || [];
    },
                
    /**
    * Use to resize elemen to match window size 
    *
    * @param $el {object} - jQuery wrapped element to resize 
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

    /* Run methods for async loading of modules and plugins */
    run: {

        /**
        * Run all modules one after another 
        *
        * @param args {array} - arguments list 
        * @return void
        **/
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

        /**
        * Run all modules one after another 
        *
        * @param args {array} - arguments list 
        * @return void
        **/
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

        /**
        * Run all modules one after another 
        *
        * @param args {array} - arguments list 
        * @return void
        **/
        series: function(tasks, cb, force) {
            var count, errors, hasErr, i, next, results;

            if (!tasks || tasks === null) {
                tasks = [];
            }
            if (!cb || cb === null) {
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

        /**
        * Run all modules one after another 
        *
        * @param args {array} - arguments list 
        * @return void
        **/
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

        /**
        * Run all modules one after another 
        *
        * @param args {array} - arguments list 
        * @return void
        **/
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
    },

    /**
    * Copy an Array or Object and return new instance 
    *
    * @param data {various} - the array / object to clone (copy) 
    * @return copy {various} - the new array / object 
    **/
    clone: function(data) {
        var copy, k, v;

        if (data instanceof Array) {

            copy = (function() {
                var i, len, results;

                results = [];
                for (i = 0, len = data.length; i < len; i++) {
  
                    v = data[i];
                    results.push(v);
                }

                return results;

            })();

        } else {
            copy = {};

            for (k in data) {
                v = data[k];
                copy[k] = v;
            }
        }

        return copy;
    },

    convertToEm:function(value){
        return value * this.getFontsize();
    },

    convertToPt:function(value){
    
    },

    /**
    * Get computed fontsize from created element in pixels
    *
    * @return base {number} - computed fontsize
    **/
    convertBase:function(){
        var pixels, 
            elem = document.createElement(), 
            style = elem.getAttribute('style');

        elem.setAttribute('style', style + ';font-size:1em !important');

        base = this.getFontsize();

        elem.setAttribute('style', style);

        return base;
    },

    /**
    * Mix properties of two objects, optional to override property names 
    *
    * @param giv {object} - object to give properties
    * @param rec {object} - object to recieve givers properties
    * @param override {boolean} - optional arg to replace existing property keys
    * @return results {array} - new array of mixed object properties and values 
    **/
    mix: function(giv, rec, override) {
        var k, results, mixins, v;

        if (override === true) {
            results = [];

            for (k in giv) {
                v = giv[k];
                results.push(rec[k] = v);
            }

            return results;

        } else {
            mixins = [];

            for (k in giv) {
                v = giv[k];

                if (!rec.hasOwnProperty(k)) {
                    results.push(rec[k] = v);
                }
            }

            return results;
        }
    },

    /**
    * Mix various object / function combinations 
    *
    * @param input {various} - input class to give properties 
    * @param output {various} - receiving class to retain mixed properties 
    * @param override {boolean} - override property names with new values
    * @return {function} - mix 
    **/
    mixin: function(input, output, override) {
        if (!override || override === null) {
            override = false;
        }

        switch ((typeof output) + "-" + (typeof input)) {
            case "function-function":
                return this.mix(output.prototype, input.prototype, override);

            case "function-object":
                return this.mix(output.prototype, input, override);

            case "object-object":
                return this.mix(output, input, override);

            case "object-function":
                return this.mix(output, input.prototype, override);
        }
    },
    
    /**
    * Generate random unique identifier string
    *
    * @param length {number} - how long the random string should be
    * @return id {string} - unique identifier 
    **/
    unique: function(length) {
        var id = '';

        if (!length || length === null) {
            length = 8;
        }

        while (id.length < length) {
            id += Math.random().toString(36).substr(2);
        }

        return id.substr(0, length);
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

    Broker.prototype.add = function(channel, fn, context) {
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
                _this.remove(channel);
                return this;
            }
        }.listen();
    };

    Broker.prototype.remove = function(channel, cb) {
        var id;

        switch (typeof channel) {

            case "string":
                if (typeof cb === "function") {
                    Broker._delete(this, ch, cb);
                }

                if (typeof cb === "undefined") {
                    Broker._delete(this, ch);
                }
                break;

            case "function":
                for (id in this.channels) {
                    Broker._delete(this, id, ch);
                }
                break;

            case "undefined":
                for (id in this.channels) {
                    Broker._delete(this, id);
                }
                break;

            case "object":
                for (id in this.channels) {
                    Broker._delete(this, id, null, ch);
                }
        }

        return this;
    };
        
    Broker.prototype.fire = function(channel, data, cb, origin) {
        var o, e, x, chnls;

        if (!cb || cb === null) {
            cb = (function() {});
        }

        if (!origin || origin === null) {
            origin = channel;
        }

        if (data && utils.isFunc(data)) {
            return cb = data;
        }

        data = void 0;

        if (typeof channel !== "string") {
            return false;
        }

        tasks = this._setup(data, channel, origin, this);

        utils.run.series(tasks, (function(errors, series) {
            if (errors) {

                return e = new Error(((function() {
                    var i, len, results;

                    results = [];

                    for (i = 0, len = errors.length; i < len; i++) {
                        x = errors[i];

                        if (x !== null) {
                            results.push(x.message);
                        }
                    }

                    return results;

                })()).join('; '));
            }
        }, cb(e)), true);

        if (this.cascade && (chnls = channel.split('/')).length > 1) {

            if (this.fireOrigin) {
                o = origin;
            }

            this.fire(chnls.slice(0, -1).join('/'), data, cb, o);
        }

        return this;
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

    Broker.prototype._delete = function(obj, channel, cb, context) {
        var s;

        if (obj.channels[channel] == null) {

            return obj.channels[channel] = (function() {
                var i, len, ref, results;

                ref = obj.channels[ch];
                results = [];

                for (i = 0, len = ref.length; i < len; i++) {
                    s = ref[i];

                    if ((typeof cb !== "undefined" && cb !== null ? s.callback !== cb : typeof context !== "undefined" && context !== null ? s.context !== context : s.context !== obj)) {

                        results.push(s);
                    }
                }

                return results;

            })();
        }
    };

    Broker.prototype._setup = function(data, channel, origin, context) {
        var i, len, results = [], sub, subscribers;

        subscribers = context.channels[channel] || [];
        len = subscribers.length;

        do {
            sub = subscribers[i];

            results.push((function(sub) {

                return function(next) {
                    var e;

                    try {

                        if (utils.hasArgs(sub.callback, 3)) {

                            return sub.callback.apply(sub.context, [data, origin, next]);

                        } else {

                            return next(null, sub.callback.apply(sub.context, [data, origin]));
                        }
                    } catch (_error) {
                        e = _error;

                        return next(e);
                    }
                };
            })(sub));

            i++;
        } while(--len);

        return results;
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

            // attach new sandbox instance
            core._broker.install(this);

            // add utils object
            this.utils = utils;

            // Ajax shorthand reference
            this.xhr = $.ajax;

            // add Animation library
            this.Animation = $.Animation;

            // reference log function
            this.log = function() {
                return core.log(arguments);
            };

            // refrence to debug method, shows console history
            this.debug = function() {
                return core._debug();
            };

            // create new html element
            this.elem = function(el) {
                if (!utils.isStr(el)) {
                    core.log('Error :: Element must be type String.');
                    return false;
                }

                return document.createElement(el);
            };

            /**
             * Animate method utalizing animate.css library
             *
            **/
            this.animate = function($el, anim, time) {
                if (time === undefined) {
                    time = slider.opts.animationTime || 1500;
                }

                $el.show().addClass(anim);

                setTimeout(function() {
                    $el.removeClass(anim);
                }, time);
            };

            // find selector in dom with wrapped methods
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

            this.fnCache = function(source, cache, refetch) {
                var key;

                cache = cache || (cache = {});

                return function(args) {
                    key = arguments.length > 1 ? [].join.call(arguments, DELIM) : String(args);

                    if (!(key in cache) || (refetch && cache[key] === refetch)) {

                        cache[key] = source.apply(source, arguments);

                    }

                    return cache[key];
                };
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
var GUI;

/** 
 * @todo - add default config that will change behavior of GUI core 
 * @todo - add custom config logic to apply customization options 
 **/

// GUI Core
GUI = (function($) {

    // Make sure we have jQuery
    if (typeof $ === 'undefined' || $ === null) {
        throw new Error('Guerrilla UI requires jQuery library.');
    }

    // GUI Constructor
    function GUI() {

        // console log history
        this.history = [];

        // default config
        this.config = {
            name: 'Guerrilla UI',
            version: '0.1.3',
            animations: false,
            jquery: true 
        };

        // ability to pass optional config object
        this.configure = function(options) {

            if (options !== null && utils.isObj(options)) {
                // set custom config options
                this.config = utils.extend(this.config, options);
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
    };

    GUI.prototype._debug = function() {
        if (this.config.debug) {
            console.log(this.history);
        }
    };

    /* Public Methods */
    /******************/

    /** 
     * Create new GUI module 
     *
     * @param id {string} - module identifier
     * @param creator {function}  logic to execute inside module namespace
     * @param options {object} - optional object of extra parameters that will be passed to load() 
     * @return this {object}
    **/
    GUI.prototype.create = function(id, creator, options) {
        var error;

        if (!options || options === null) {
          options = {};
        }

        error = utils.isType("string", id, "module ID") || utils.isType("function", creator, "creator") || utils.isType("object", options, "option parameter");

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
     * Extend GUI core library and add to Sandbox API 
     *
     * @param plugin {string} - plugin identifier 
     * @param creator {function} - function containing plugin class logic 
     * @return this {object} 
    **/
    GUI.prototype.extend = function(plugin, creator, opts) {

        if (!opts || opts === null) {
            opts = {};
        }

        this._plugins.push({
            creator: plugin,
            options: opts
        });

        return this;
    };

    /** 
     * Starts module with new sandbox instance 
     *
     * @param moduleId {string} - module name or identifier
     * @param opt {object} - optional options object
     * @param cb {function} - callback function 
     * @return boot {function} - call boot method and create new sandbox instance 
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

        error = utils.isType("string", moduleId, "module ID") || utils.isType("object", opt, "second parameter") || (!this._modules[moduleId] ? "module doesn't exist" : void 0);

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
     * Loads plugin to Sandbox or Core classes 
     *
     * @param plugin {function} - method with plugin logic 
     * @param opt {object} - optional options object to be accessed in plugin 
     * @return this {object}
    **/
    GUI.prototype.use = function(plugin, opt) {
        var i, len, p;

        if (plugin instanceof Array) {

            for (i = 0, len = plugin.length; i < len; i++) {
                p = plugin[i];

                switch (typeof p) {
                    case "function":
                        this.use(p);
                        break;

                    case "object":
                        this.use(p.plugin, p.options);
                }
            }

      } else {
          // must be function
          if (!utils.isFunc(plugin)) {
              return this;
          }

          // add to _plugins array
          this._plugins.push({
              creator: plugin,
              options: opt
          });
      }

      return this;
    };

    /** 
     * Stops all running instances 
     *
     * @param id {string} - module identifier 
     * @param callback {function} - optional callback to run when module stopped
     * @return this {object}
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

            // remove instance from instances cache
            delete this._instances[id];

            // disable any events registered by module
            this._broker.off(instance);

            // run unload method in stopped modules
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

    /** 
     * Register jQuery plugins to $ nameSpace 
     *
     * @param plugin {object} - plugin object with all logic 
     * @param module {string} - identifier for jQuery plugin 
     * @return void
    **/
    GUI.prototype.plugin = function(plugin, module) {
        var _this = this;

        if(plugin.fn && typeof plugin.fn === 'function'){

            $.fn[module.toLowerCase()] = function(opts){
                return new plugin.fn(this, opts);
            };
        }else{
            GUI.log('Error :: Missing ' + plugin + ' fn() method.');
        }
    };

    /** 
     * Load single or all available core plugins 
     *
     * @param cb {function} - callback to execute after plugins loaded 
     * @return this {object} - return GUI object with tasks array
    **/
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
      * @param ev {string / object} - message or error object 
      * @param cb {function} - callback method to run with error string / object
      * @return this {object}
    **/
    GUI.prototype._fail = function(ev, cb) {
        this.log(ev);

        cb(new Error("could not start module: " + ev.message));

        return this;
    };

    /** 
      * Called when starting module fails 
      *
      * @param ev {string / object} - message or error object 
      * @param cb {function} - callback method to run with error string / object
      * @return this {object}
    **/
    GUI.prototype._startAll = function(mods, cb) {
        var done, startAction;

        // start all stored modules
        if (!mods || mods === null) {
            mods = (function() {
                var results = [], m;

                for (m in this._modules) {
                    results.push(m);
                }

                return results;
            }).call(this);
        }

        // self executing action
        startAction = (function(_this) {
            return function(m, next) {
                return _this.start(m, _this._modules[m].options, next);
            };
        })(this);

        // optional done callback for async loading 
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

                // store all available modules errors
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

        // run all modules in parallel formation
        utils.run.all(mods, startAction, done, true);

        return this;
    };

    /** 
      * Called when starting module fails 
      *
      * @param ev {string / object} - message or error object 
      * @param cb {function} - callback method to run with error string / object
      * @return this {object}
    **/
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
                    
                    if (!iOpts[key] || iOpts[key] === null) {
                        iOpts[key] = val;
                    }
                }
            }
        }

        // create new API Sandbox
        sb = new API().create(this, id, iOpts, moduleId);

        // add config object if avail
        if (this.config && this.config !== null) {
          sb.config = this.config;
        }

        // run sandboxed instance load method
        return this._runSandboxPlugins('load', sb, (function(_this) {
            return function(err) {
                var instance;

                instance = new module.creator(sb);

                if (typeof instance.load !== "function") {

                    // determine if module is jQuery plugin
                    if (instance.fn && typeof instance.fn === 'function') {
                        return _this.plugin(instance, id); 
                    }

                    return cb(new Error("module has no 'load' or 'fn' method"));
                }

                // store instance and sandbox
                _this._instances[id] = instance;
                _this._sandboxes[id] = sb;

                return cb(null, instance, iOpts);
            };
        })(this));
    };
    
    /** 
      * Called when starting module fails 
      *
      * @param ev {string / object} - message or error object 
      * @param cb {function} - callback method to run with error string / object
      * @return this {object}
    **/
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

})(jQuery);
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

        if (options && options !== null) {
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
;/* Stargaze library */
$.GUI().create('Stargaze', function(G){

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

            return new Stargaze($elem, opts).init();
        },
    };

}).start('Stargaze');
;/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: MVC Model object module         * 
* ---------------------------------------- */
$.GUI().use(function(G) {
    var plugin, Model;

    Model = (function(superClass) {

        utils.extend(Model, superClass);

        function Model(obj) {
            // call super class ctor
            Model.__super__.constructor.call(this);

            // combine model object with passed model
            this.combine(obj);

            /** 
             * Set property of current Model object
             *
             * @param key {object} {string} - the object or string to merge into Model class 
             * @param val {various} = value of key and can be any super type 
             * @param silent {boolean} - rather or not to fire model change event 
             * @return this {object} 
            **/
            this.set = function(key, val, silent) {
                var k;

                if (!silent || silent === null) {
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
                                var results = [], k;

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
        }

        /** 
         * Extend Model object with passed object properies 
         *
         * @param obj {object} - the object to merge into Model class 
         * @return this {object} 
        **/
        Model.prototype.combine = function(obj) {
            var k, v;

            for (k in obj) {
                v = obj[k];

                if (this[k] === null) {

                    this[k] = v;
                }
            }

            return this;
        };

        /** 
         * Handler that executes when Model object changes 
         *
         * @param cb {function} - callback method for event register 
         * @param context {object} - context to use when registering event 
         * @return {function} - executed pub / sub 
        **/
        Model.prototype.change = function(cb, context) {
            if (typeof cb === "function") {

                // register model change event
                return this.on(Model.CHANGED, cb, context);

            } else if (arguments.length === 0) {

                // publish model change event
                return this.fire(Model.CHANGED);
            }
        };

        return Model;

    })(G.Broker);

    return {
        load: function(sandbox) {
            sandbox.Model = Model;
        },
        unload: function(){}
    };
});
;/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: MVC View class module           * 
* ---------------------------------------- */
$.GUI().use(function(G) {
    var plugin, View;

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
                console.log('Render method called in View.');
            };
        }

        return View;

    })();

    return {
        load: function(sandbox) {
            sandbox.View = View;
        },
        unload: function(){}
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
            console.log('Controller class :: ', Controller);
        },
        unload: function() {}
    };
});
