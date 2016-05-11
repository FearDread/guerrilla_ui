/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Utility methods for all modules * 
* ---------------------------------------- */
var utils;

utils = {

    /** 
     *
     *
    **/
    each: function (subject, fn) {
        var length, i;

        for (i = 0; i < length; i++) {

            fn(subject[i], i, subject);
        }

    },

    /** 
     *
     *
    **/
    merge: function () {
        var i, key;

        for (i = 1; i < arguments.length; i++) {
            
            for (key in arguments[i]) {

                if (arguments[i].hasOwnProperty(key)) {

                    arguments[0][key] = arguments[i][key];
                }

            }

        }

        return arguments[0];
    },

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

        ctor.prototype = parent.prototype;

        child.prototype = new ctor();
        child.__super__ = parent.prototype;

        return child;
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

    /* Function Regex */
    fnRgx: /function[^(]*\(([^)]*)\)/,

    /* Argument Regex */
    argRgx: /([^\s,]+)/g,
    
    /* Array.prototype.slice */
    slice: Array.prototype.slice,

    /* Shorthand reference to Object.prototype.hasOwnProperty */
    hasProp: Object.prototype.hasOwnProperty,

    /**
     * Check number of arguments passed to function / method
     *
     * @param fn {function} - function to test
     * @param idx {int} - number of arguments to check for
     * @return argument length {int} - number of arguments actually passed to function
    **/
    hasArgs: function(fn, idx) {
        if (!idx || idx === null) {
            idx = 1;
        }

        return this.args(fn).length >= idx;
    },

    /**
    * Check if passed object is empty 
    *
    * @param obj {object} - object to check
    * @return boolean
    **/
    isEmpty: $.isEmptyObject,

    /**
    * Check if passed object is empty 
    *
    * @param obj {object} - object to check
    * @return boolean
    **/
    isPlain: $.isPlainObject,

    /**
    * Check if passed object is instance of Object
    *
    * @param obj {object} - object to check
    * @return boolean
    **/
    isObj: function(obj) {
        return $.isPlainObject(obj);
    },

    /**
    * Check if passed value is Array 
    *
    * @param arr {array} - array to check
    * @return boolean
    **/
    isArr: function(arr) {
        return $.isArray(arr); 
    },

    /**
    * Check if passed function is indeed type function
    *
    * @param obj {object} - function to check
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
    * Check if user agent is mobile device 
    *
    * @param agent {string} - user agent
    * @return {boolean} 
    **/
    isMobile: function(agent) {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
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

            if (this.hasProp.call(key)) {
                total += 1;
            }
        }

        return total;
    },

    /**
    * Convert passed unit to its equiv value in pixles 
    *
    * @param width {number} - size of the element to convert 
    * @param unit {string} - the unit to convert to pixels
    * @return {number} 
    **/
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

    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    *
    * @param min - int min number of range
    * @param max - int max number of range
    * @return int
    **/
    rand: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
    * Returns list of argument names from function 
    *
    * @param fn {function} - the function to get arguments from 
    * @return {array}  
    **/
    args: function(fn) {
        var ref;

        return ((fn !== null ? (ref = fn.toString().match(utils.fnRgx)) !== null ? ref[1] : void 0 : void 0) || '').match(utils.argRgx) || [];
    },
                
    /**
    * Use to resize elemen to match window size 
    *
    * @param $el {object} - jQuery wrapped element to resize 
    * @return void
    **/
    resize: function($el) {
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

    /**
    * Compute passed value to em 
    *
    * @return {number} - computed em value 
    **/
    convertToEm:function(value){
        return value * this.getFontsize();
    },

    /**
    * Compute passed value to point 
    *
    * @return {number} - computed point value 
    **/
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
* @module: Task Runner Utility methods for *
* all modules                              * 
* ---------------------------------------- */

var GRun, utils = utils || {};

utils.run = {};

/**
* Run all modules one after another 
*
* @param args {array} - arguments list 
* @return void
**/
utils.run.all = function (args, fn, cb, force) {
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
};

/**
* Run asynchronous tasks in parallel 
*
* @param args {array} - arguments list 
* @return void
**/
utils.run.parallel = function (tasks, cb, force) {
    var count, errors, hasErr, i, j, len, results, paralleled, task;

    if (!tasks || tasks === null) {

        tasks = [];

    }else if (!cb || cb === null) {

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

                err = arguments[0];
                res = (2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

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
};

/**
* Run asynchronous tasks one after another 
*
* @param args {array} - arguments list 
* @return void
**/
utils.run.series = function (tasks, cb, force) {
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

        err = arguments[0];
        res = (2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

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
};

/**
* Run first task, which does not return an error 
*
* @param tasks {array} - tasks list 
* @param cb {function} - callback method
* @param force {boolean} - optional force errors
* @return {function} execute 
**/
utils.run.first = function (tasks, cb, force) {
    var count, errors, i, next, result;

    if (!tasks || tasks === null) {
        tasks = [];
    }
    if (!cb || cb === null) {
        cb = (function() {});
    }

    i = -1;

    count = tasks.length;
    result = null;

    if (!count || count === 0) {
        return cb(null);
    }

    errors = [];

    next = function() {
        var e, err, res;

        err = arguments[0];
        res = (2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

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
};

/**
* Run asynchronous tasks one after another
* and pass the argument
*
* @param args {array} - arguments list 
* @return void
**/
utils.run.waterfall = function (tasks, cb) {
    var i, next;

    i = -1;

    if (tasks.length === 0) {
        return cb();
    }

    next = function() {
        var err, res;

        err = arguments[0];
        res = (2 <= arguments.length) ? utils.slice.call(arguments, 1) : [];

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
};
;/* --------------------------------------- *
* Guerrilla UI                             *
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
        var subscription, $this = this;

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
                $this.channels[channel].push(subscription);
                return this;
            },
            ignore: function() {
                $this.remove(channel);
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

    Broker.prototype.fire = function(channel, data, cb) {
        var tasks;

        if (!cb || cb === null) {
            cb = function() {};
        }

        if (typeof data === "function") {
            cb = data;
            data = void 0;
        }

        if (typeof channel !== "string") {
            return false;
        }

        tasks = this._setup(data, channel, channel, this);

        utils.run.first(tasks, (function(errors, result) {
            var e, x;

            if (errors) {

                e = new Error(((function() {
                    var i, len, results1;

                    results1 = [];

                    for (i = 0, len = errors.length; i < len; i++) {
                        x = errors[i];

                        if (x !== null) {
                            results1.push(x.message);
                        }
                    }

                    return results1;

                })()).join('; '));

                return cb(e);

            } else {

                return cb(null, result);
            }
        }), true);

        return this;
    };
        
    Broker.prototype.emit = function(channel, data, cb, origin) {
        var o, e, x, chnls;

        if (!cb || cb === null) {
            cb = (function() {});
        }

        if (!origin || origin === null) {
            origin = channel;
        }

        if (data && utils.isFunc(data)) {
            cb = data;
        }

        data = void 0;

        if (typeof channel !== "string") {
            return false;
        }

        tasks = this._setup(data, channel, origin, this);

        utils.run.series(tasks, (function(errors, series) {
            if (errors) {

                e = new Error(((function() {
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

                return e;
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

        if (obj.channels[channel] === null) {

            obj.channels[channel] = (function() {
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

            return obj.channels[channel];
        }
    };

    Broker.prototype._setup = function(data, channel, origin, context) {
        var i = 0, len, results = [], sub, subscribers;

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

    Broker.prototype.pipe = function(src, target, broker) {
        if (target instanceof Broker) {
            mediator = target;
            target = src;
        }

        if (broker === null) {
            return this.pipe(src, target, this);
        }

        if (broker === this && src === target) {
            return this;
        }

        this.add(src, function() {

            return broker.fire.apply(broker, [target].concat(slice.call(arguments)));
        });

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
        create: function(gui, instance, options, module) {

            /* Sandbox identefiers */ 
            this.id = instance;
            this.module = module;
            this.options = (options !== null) ? options : {}; 

            /* Attach Broker methods to sandbox api */ 
            gui._broker.install(this);
            this.broker = gui._broker;

            /* Add utils object to sandbox api */
            this.utils = utils;
             
            /* jQuery wrappers */
            this.xhr = $.ajax;
            this.data = $.data;
            this.deferred = $.Deferred;
            this.animation = $.Animation;

            /* Module Namespaces */ 
            this.ui = {};
            this.dom = {};
            this.net = {};

            /**
             * Search DOM for selector and wrap with both native and jQuery helper methods 
             *
             * @param selector {string} - the element to scan DOM for
             * @param context {object} - optional context object to be applied to returned object wrapper
             * @return {object} - GUI and jQuery wrapped element DOM object 
            **/
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

                _ret.create = function(el) {
                    if (!utils.isStr(el)) {
                        this.warn('Error :: Element must be type String.');
                        return false;
                    }

                    return document.createElement(el);
                };

                _ret.size = function() {
                    return parseFloat(
                        window.getComputedStyle($el).fontSize
                    );
                };

                return _ret;
            };

            /**
             * Assign $ as shorthand query method 
            **/
            this.$ = this.query;

            /**
             * Reference utils / jQuery each method 
            **/
            this.each = $.each;

            /**
             * Shorthand timeout method 
             *
             * @return {function} 
            **/
            this.timeout = function(fn, ms) {
                return window.setTimeout(fn, ms);
            };

            /**
             * Shorthand timeout method 
             *
             * @return {function} 
            **/
            this.interval = window.setInterval;

            /**
             * Reference GUI core log method 
             *
             * @return {function} 
            **/
            this.log = function() {
                return gui.debug.log(arguments);
            };

            /**
             * Reference GUI core warn method 
             *
             * @return {function}
            **/
            this.warn = function() {
                return gui.debug.warn(arguments);
            };

            /**
             * Get location with stored reference to window object 
             *
             * @return {object} - specific window reference location 
            **/
            this.getLocation = function() {
                var win = gui.config.win;

                return win && win.location;
            };

            /**
             * Take function and apply new context when executed 
             * 
             * @param fn {function} - the function to swap contexts 
             * @return {function} - executes fn 
            **/
            this.hitch = function(fn) {
                var argc, all;

                argc = [].slice.call(arguments).splice(1);

                return function() {
                    all = argc.concat([].slice.call(arguments));

                    return fn.apply(this, all);
                };
            };

            /**
             * Cache the results of a function call 
             * 
             * @param source {function} - the function to execute and store 
             * @param cache {object} - optional store to keep cached results 
             * @param refetch {string} - optional key to update in cache
             * @return {object} - the stored results 
            **/
            this.memoize = function(source, cache, refetch) {
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
* @module: GUI Core                        * 
* ---------------------------------------- *
var GUI;

/** 
 * @todo - add two way / single data binding logic feature
 * @todo - add default config that will change behavior of GUI core 
 * @tood - load modules via dependency injection, built framework should only contain core objects
 * @todo - allow async dependency loading to keep framework light - loads modules / plugins only when called via dependency array
 **/

// GUI Core
GUI = (function ($) {

    // Make sure we have jQuery
    if (typeof $ === 'undefined' || $ === null) {
        throw new Error('Guerrilla UI requires jQuery library.');
    }

    // GUI Constructor
    function GUI() {
	var $this = this;

        // default config
        this.config = {
            name: 'Guerrilla UI',
            /* Logging verbosity */
            logLevel: 0,
            /* Single page app or Multiple page site */
            mode: 'multi',
            /* GUI library version */
            version: '0.4.7',
            jquery: true,
            animations: false
        };

        this.injector = Injector;
        this.binder = new Binder();

        // ability to pass optional config object
        this.configure = function (options) {

            if (options !== null && utils.isObj(options)) {
		
                // set custom config options
                this.config = utils.merge(this.config, options);

                // set logging verbosity
                this.debug.level = this.config.logLevel || 0;
            }
        };
        
        // private objects & arrays for tracking 
        this._modules = {};
        this._plugins = [];
        this._instances = {};
        this._sandboxes = {};
        this._running = {};
        this._dependencies = {};

        // add broker to core object
        this._broker = new Broker(this);
        this.Broker = Broker;

        this.attach = function (imports) {
            console.log('dynamic asyn module loading.');
            console.log('imports = ', imports);
        };
    }

    // console log wrapper
    GUI.prototype.debug = {
        level: 0,
        history: [],
        timeout: 5000,

        /**
         * Adds a warning message to the console.
         *
         * @param {String} out the message
        **/
        warn: function(out) {
            if (this.level < 2) {

                [].unshift.call(arguments, 'WARN:');

                if (typeof window !== undefined && window.console && console.warn) {

                    this._logger("warn", [].slice.call(arguments));

                } else if (window.console && console.log) {

                    this._logger("log", [].slice.call(arguments));

                } else if (window.opera && window.opera.postError) {

                    window.opera.postError("WARNING: " + out);

                }
            }
        },
        
        /**
         * Adds a message to the console.
         *
         * @param {String} out the message
        **/
        log: function(out) {
            if (this.level < 1) {
                if (window.console && console.log) {

                    [].unshift.call(arguments, 'Debug:');

                    this._logger("log", [].slice.call(arguments));

                } else if (window.opera && window.opera.postError) {

                    window.opera.postError("DEBUG: " + out);

                }
            }
        },

        _logger: function(type, arr) {

            this.history.push({type:arr});

            if (console.log.apply) {

                console[type].apply(console, arr);

            } else {

                console[type](arr);
            }
        },
        
        _stackTrace: function() {

            this.log(this.history);
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
          this.debug.warn("could not register module '" + id + "': " + error);
          return this;
        }

        if (id in this._modules) {
          this.debug.log("module " + id + " was already registered");
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

        initInst = (function ($this) {
            return function (err, instance, opt) {
                if (err) {
                    return $this._fail(err, cb);
                }

                try {
                    if (utils.hasArgs(instance.load, 2)) {
                        return instance.load(opt, function (err) {

                            if (!err) {
                                $this._running[id] = true;
                            }

                            return cb(err);
                        });
                    } else {

                        instance.load(opt);
                        $this._running[id] = true;

                        return cb();
                    }
                } catch (_error) {
                    e = _error;

                    return $this._fail(e, cb);
                }
            };
        })(this);

        return this.boot((function ($this) {

            return function (err) {

                if (err) {
                    return $this._fail(err, cb);
                }

                return $this._createInstance(moduleId, opt, initInst);
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
    GUI.prototype.use = function (plugin, opt) {
        var i, len, p;

        if (utils.isArr(plugin)) {

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
    GUI.prototype.stop = function (id, callback) {
        var instance;

        if (cb === null) {
            cb = function () {};
        }

        if (arguments.length === 0 || typeof id === "function") {
            utils.run.all((function () {
                var results = [], x;

                for (x in this._instances) {
                    results.push(x);
                }

                return results;

            }).call(this), ((function ($this) {
                return function () {
                    return $this.stop.apply($this, arguments);
                };
            })(this)), id, true);

        } else if (instance === this._instances[id]) {

            // remove instance from instances cache
            delete this._instances[id];

            // disable any events registered by module
            this._broker.off(instance);

            // run unload method in stopped modules
            this._runSandboxPlugins('unload', this._sandboxes[id], (function ($this) {
                return function (err) {
                    if (utils.hasArgs(instance.unload)) {

                        return instance.unload(function (err2) {
                            delete $this._running[id];

                            return cb(err || err2);
                        });
                    } else {

                        if (typeof instance.unload === "function") {
                            instance.unload();
                        }

                        delete $this._running[id];

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
     * @return {function} - initialized jQuery plugin 
    **/
    GUI.prototype.plugin = function (plugin, module) {
        var $this = this;

        if (plugin.fn && utils.isFunc(plugin.fn)) { 

            $.fn[module.toLowerCase()] = function (options) {

                return new plugin.fn(this, options);
            };
        } else {

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
      * @param ev {object} - message or error object 
      * @param cb {function} - callback method to run with error string / object
      * @return this {object}
    **/
    GUI.prototype._fail = function(ev, cb) {
        this.debug.warn(ev);

        cb(new Error("could not start module: " + ev.message));

        return this;
    };

    /** 
      * Called when starting module fails 
      *
      * @param mods {function} - method with array of all modules to start 
      * @param cb {function} - callback method to run once modules started 
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
        startAction = (function($this) {
            return function(m, next) {
                return $this.start(m, $this._modules[m].options, next);
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
      * Create new sandbox instance and attach to module 
      *
      * @param moduleId {string} - the module to create sandbox instance for 
      * @param o {object} - options object 
      * @param cb {function} - callback method to run once instance created
      * @return {function} - run sandboxed instances
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
        return this._runSandboxPlugins('load', sb, (function($this) {
            return function(err) {
                var instance;

                instance = new module.creator(sb);

                if (typeof instance.load !== "function") {

                    // determine if module is jQuery plugin
                    if (instance.fn && typeof instance.fn === 'function') {
                        return $this.plugin(instance, id); 
                    }

                    return cb(new Error("module has no 'load' or 'fn' method"));
                }

                // store instance and sandbox
                $this._instances[id] = instance;
                $this._sandboxes[id] = sb;

                return cb(null, instance, iOpts);
            };
        })(this));
    };
    
    /** 
      * Sets up needed tasks for module initializations 
      *
      * @param ev {string} - check module for load / unload methods 
      * @param sb {object} - the sandbox instance 
      * @param cb {function} - callback method to run once instances initialized
      * @return {function} - utils.run.seris
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
* @module: $.GUI jQuery namespace          * 
* ---------------------------------------- */
;(function($) {
    var $G;

    $G = new GUI();

    $.GUI = function() {
        var argc = [].slice.call(arguments),
            options = argc[0] || null;
            app = $G;

        if (options && options !== null) {

            if (utils.isArr(options)) {

                app.injector.register(arguments);

            } else if (utils.isObj(options)) {
                
                app.configure(options);
            }
        }

        return app;
    };

    $.fn.GUI = function(options) {
        return this.each(function() {
            if (!$.data(this, 'guerrilla')) {

                $.data(this, 'guerrilla', new $.GUI().create(this, options));
            } else {
                return new $.GUI().create(this, options);
            }
        });
    };

})(jQuery);
;/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Map, basic key value map store  * 
* ---------------------------------------- */
$.GUI().use(function(gui) {

    var Map = this.Map || this.MozMap || (Map = (function() {

        function Map() {
            this.keys = [];
            this.values = [];
        }

        Map.prototype.get = function(key) {
            var i, item, j, ref;

            ref = this.keys;

            for (i = j = 0; j < ref.length; i = ++j) {
                item = ref[i];

                if (item === key) {

                    return this.values[i];
                }
            }
        };

        Map.prototype.set = function(key, value) {
            var i, item, j, ref;

            ref = this.keys;

            for (i = j = 0; j < ref.length; i = ++j) {
                item = ref[i];

                if (item === key) {
                    this.values[i] = value;
                    return;
                }
            }

            this.keys.push(key);
            return this.values.push(value);
        };

        return Map;

    })());

    return {

        load: function(api) {

          api.dom.map = new Map();
        },
        unload: function() {}
    };
});
;/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Event, dom & element events api * 
* ---------------------------------------- */
$.GUI().use(function(gui) {

    /**
     * A custom event handler for dom elements
    **/
    Event = (function() {

        function Event() {}

        /**
         * Determine current mobile device for passed user agent 
         *
         * @param agent {string} - the user agent currently in use
         * @return {boolean}
        **/
        Event.prototype.isMobile = function(agent) {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
        };

        /**
         * Create new event handler
         *
         * @param event {string} - name of the event
         * @param bubble {boolean} - whether or not to bubble the event in stack
         * @param cancel {boolean} - boolean value to determine event cancellation
         * @param detail {object} - optional data object
         * @return event {object} - new event
        **/
        Event.prototype.create = function(event, bubble, cancel, detail) {
            var customEvent;

            if (!bubble || bubble === null) {
                bubble = false;
            }

            if (!cancel || cancel === null) {
                cancel = false;
            }

            if (!detail || detail === null) {
                detail = null;
            }

            if (document.createEvent !== null) {

                customEvent = document.createEvent('CustomEvent');
                customEvent.initCustomEvent(event, bubble, cancel, detail);

            } else if (document.createEventObject !== null) {

                customEvent = document.createEventObject();
                customEvent.eventType = event;

            } else {

                customEvent.eventName = event;
            }

            return customEvent;
        };

        /**
         * Trigger specified event for given element
         *
         * @param elem {object} - the element with event handler
         * @param event {string} - name of the event to fire
         * @return {function} - calls event handler 
        **/
        Event.prototype.fire = function(elem, event) {
            if (elem.dispatchEvent && elem.dispatchEvent !== null) {

                return elem.dispatchEvent(event);

            } else if (event in (elem !== null)) {

                return elem[event]();

            } else if (("on" + event) in (elem !== null)) {

                return elem["on" + event]();
            }
        };

        Event.prototype.add = function(elem, event, fn) {
            var newEvent;

            if (elem.addEventListener !== null) {

                return elem.addEventListener(event, fn, false);

            } else if (elem.attachEvent !== null) {

                return elem.attachEvent("on" + event, fn);

            } else {
                newEvent = elem[event] = fn;

                return newEvent;
            }
        };

        Event.prototype.remove = function(elem, event, fn) {
            if (elem.removeEventListener !== null) {

                return elem.removeEventListener(event, fn, false);

            } else if (elem.detachEvent !== null) {

                return elem.detachEvent("on" + event, fn);

            } else {

                return delete elem[event];
            }
        };

        Event.prototype.innerHeight = function() {
            if ('innerHeight' in window) {

                return window.innerHeight;

            } else {

                return document.documentElement.clientHeight;
            }
        };

        return Event;

    })();

    return {
        
        load: function(api) {

            api.dom.Event = new Event();
        },
        unload: function() {}
    };
});
;/* --------------------------------------- *
* Guerrilla UI                             *
* @module: MVC Model object class          * 
* ----------------------------y------------ */
$.GUI().use(function(gui) {

    Model = (function(superClass) {

        // extend model prototype with superClass properties
        utils.extend(Model, superClass);

        function Model(obj) {

            // call super class ctor
            Model.__super__.constructor.call(this);

            // combine model object with passed model
            utils.merge(this, obj);

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
        Model.prototype.extend = function(obj) {
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
                return this.add(Model.CHANGED, cb, context);

            } else if (arguments.length === 0) {

                // publish model change event
                return this.fire(Model.CHANGED);
            }
        };

        /** 
         * Fire the Modal change event  
         *
         * @return {function} 
        **/
        Model.prototype.notify = function() {

            return this.change();
        };

        /** 
         * Retreive property of current model object 
         *
         * @param key {string} - property to search model object for
         * @return {various} - whateve value the found property holds 
        **/
        Model.prototype.get = function(key) {

            return this[key];
        };

        Model.prototype.toJSON = function() {
            var json = {}, key, value;

            for (key in this) {

                if (!utils.hasProp.call(this, key)) {

                    continue;
                }

                value = this[key];
                json[key] = value;
            }

            return json;
        };

        /* The model change event identifier */
        Model.CHANGED = "changed";

        return Model;

    })(gui.Broker);

    return {
        load: function(api) {

           api.model = Model;
        },
        unload: function() {}
    };
});
;/* --------------------------------------- *
* Guerrilla UI                             *
* @module: MVC View object class           * 
* ---------------------------------------- */
$.GUI().use(function(gui) {
    var View;

    View = (function() {

        function View(model) {

            if (model) {
                this.setModel(model);
            }
        } 

        View.prototype.setModel = function(obj) {
            this.model = obj;

            return this.model.change((function() {

                return this.render();

            }), this);
        };

        View.prototype.render = function() {
            console.log('Render Template :: ', this);
        };

        return View;

    })();

    return {

        load: function(api) {

            api.view = View;
        },
        unload: function() {}
    };
});
;/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: MVC Controller class module     * 
* ---------------------------------------- */
$.GUI().create('Controller', function(gui) {
    var Controller;

    Controller = (function() {

      function Controller(model, view) {

          this.model = model;

          this.view = view;
      }

      return Controller;

    })();

    return {
        load: function(api) {

          api.controller = Controller;
        },
        unload: function() {}
    };
});
;/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Basic Router implementation     * 
* ---------------------------------------- */
$.GUI().use(function(gui) {

    function Router() {

        return {
            routes: [],
            mode: null,
            root: '/',

            /**
             * Sets needed properties for the router

             *
             * @param options {object} - the options to apply via router constructor
             * @return {this}
             **/
            config: function(options) {
                this.mode = options && options.mode && options.mode === 'history' && !!(history.pushState) ? 'history' : 'hash';
                this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';

                return this;
            },

            /**
            *
            **/
            getFragment: function() {
                var match, fragment = '';

                if(this.mode === 'history') {
                    fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
                    fragment = fragment.replace(/\?(.*)$/, '');
                    fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;

                } else {
                    match = window.location.href.match(/#(.*)$/);
                    fragment = match ? match[1] : '';
                }
                
                return this.clearSlashes(fragment);
            },

            /**
            *
            **/
            clearSlashes: function(path) {

                return path.toString().replace(/\/$/, '').replace(/^\//, '');
            },

            /**
            *
            **/
            add: function(re, handler) {
                if(utils.isFunc(re)) {
                    handler = re;
                    re = '';
                }

                this.routes.push({ re: re, handler: handler});

                return this;
            },

            /**
            *
            **/
            remove: function(param) {
                var i, route;

                for (i = 0; i < this.routes.length; i++) {
                    route = this.routes[i];

                    if(route.handler === param || route.re.toString() === param.toString()) {
                        this.routes.splice(i, 1); 

                        return this;
                    }
                }

                return this;
            },

            /**
            *
            **/
            flush: function() {
                this.routes = [];
                this.mode = null;
                this.root = '/';

                return this;
            },

            /**
            *
            **/
            check: function(f) {
                var i, match,
                    fragment = f || this.getFragment();

                for(i = 0; i < this.routes.length; i++) {
                    match = fragment.match(this.routes[i].re);

                    if(match) {
                        match.shift();
                        
                        this.routes[i].handler.apply({}, match);

                        return this;
                    }           
                }

                return this;
            },

            listen: function() {
                var self = this,
                    current = self.getFragment(),
                    fn = function() {
                        if(current !== self.getFragment()) {

                            current = self.getFragment();

                            self.check(current);
                        }
                    };

                clearInterval(this.interval);
                this.interval = setInterval(fn, 50);

                return this;
            },

            navigate: function(path) {
                path = path ? path : '';

                if(this.mode === 'history') {

                    history.pushState(null, null, this.root + this.clearSlashes(path));

                } else {

                    window.location.href.match(/#(.*)$/);
                    window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
                }

                return this;
            }
        };
    }

    function _load(api) {
        api.net.router = new Router();
    }

    return {
        load: _load
    };
});
;/* --------------------------------------- *
* Guerrilla JS                             *
* @module: Dynamic media query callbacks   *
* ---------------------------------------- */
$.GUI().use(function(G) {

    return {
        
        load: function(api) {
            var Media;

            Media = function(options) {
                var _this = this.prototype, breaks, change, listen, matches, prototype,
                    hasMatch = window.mediaMatches !== undefined && !!window.mediaMatches('!').listen;

                prototype = {

                    /**
                     * Event handler that checks and fires callbacks based on passed media query 
                     *
                     * @param query {string} - the media query to execute on
                     * @param options {object} - options object with media callbacks 
                     * @return {function} - execute callbacks 
                    **/
                    change: function(query, options) {
                        if (query.matches) {

                            if (api.utils.isFunc(options.in)) {
                                options.in(query);
                            }
                        } else {
                    
                            if (api.utils.isFunc(options.out)) {
                                options.out(query);
                            }
                        }

                        if (api.utils.isFunc(options.both)) {
                            return options.both(query);
                        }
                    }, 

                    /**
                     * Add media listener to query and window orientation events 
                     *
                     * @param options {object} - options object with media queries 
                     * @return {function} - execute change event 
                    **/
                    listen: function(options) {
                        var _this = this, query, query_cb, window_cb;

                        query = window.mediaMatches(options.media);

                        query_cb = function() {
                            return _this.change(query, options);
                        };

                        window_cb = function() {
                            return _this.change(window.matches(options.media), options);
                        };

                        query.addListener(query_cb);

                        window.addEventListener("orientationchange", window_cb, false);

                        return this.change(query, options);
                    },

                    /**
                     * Check media query parts dimentions and height / width 
                     *
                     * @param parts {object} the media query object to check 
                     * @return {string} - matched query string 
                    **/
                    check: function(parts) {
                        var constraint, dimension, matches, ratio, value, windowHeight, windowWidth;

                        constraint = parts[1];
                        dimension = parts[2];

                        if (parts[4]) {

                            value = api.utils.getPxValue(parseInt(parts[3], 10), parts[4]); 

                        } else {
                            value = parts[3];
                        }

                        windowWidth = window.innerWidth || document.documentElement.clientWidth;
                        windowHeight = window.innerHeight || document.documentElement.clientHeight;

                        if (dimension === 'width') {

                            matches = constraint === "max" && value > windowWidth || constraint === "min" && value < windowWidth;

                        } else if (dimension === 'height') {

                            matches = constraint === "max" && value > windowHeight || constraint === "min" && value < windowHeight;
                        } else if (dimension === 'aspect-ratio') {
                            ratio = windowWidth / windowHeight;
                            // matches = constraint === "max" && JSON.parse(ratio) < JSON.parse(value) || constraint === "min" && JSON.parse(ratio) > JSON.parse(value);
                            matches = constraint === "max" && JSON.parse(ratio) < JSON.parse(value) || constraint === "min" && JSON.parse(ratio) > JSON.parse(value);
                        }

                        return matches;
                    },

                    /**
                     * Attach event listener for changes in media / screen size 
                     *
                     * @return {object} - the added event object via change method 
                    **/
                    mediaListener: function() {
                        var opts, matches, media, medias, parts, _i, _len;

                        medias = (options.media) ? options.media.split(/\sand\s|,\s/) : null;

                        if (medias) {
                            matches = true;

                            for (_i = 0, _len = medias.length; _i < _len; _i++) {
                                media = medias[_i];
                                parts = media.match(/\((.*?)-(.*?):\s([\d\/]*)(\w*)\)/);

                                if (!prototype.check(parts)) {
                                    matches = false;
                                }
                            }

                            opts = {media: options.media, matches: matches};

                            return prototype.change(opts, options);
                        }
                    }
                };

                /* Return all needed event listeners */
                return function() {

                    if (window.mediaMatches) {

                        return prototype.listen();
                    
                    } else {
                        if (window.addEventListener) {
                            window.addEventListener("resize", prototype.mediaListener);

                        } else {

                            if (window.attachEvent) {
                                window.attachEvent("onresize", prototype.mediaListener);
                            }
                        }

                        return prototype.mediaListener();
                    }
                };
            };

            // Add to sandbox ui namespace
            api.ui.media = Media;
        }
    };
});
;
$.GUI().use(function(gui) {

    return {
        load: function(api) {

            jQuery.easing.jswing = jQuery.easing.swing;

            api.utils.extend(jQuery.easing, {
                def: 'easeOutQuad',

                swing: function (x, t, b, c, d) {
                    return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
                },

                easeInQuad: function (x, t, b, c, d) {
                    return c*(t/=d)*t + b;
                },

                easeOutQuad: function (x, t, b, c, d) {
                    return -c *(t/=d)*(t-2) + b;
                },

                easeInOutQuad: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) {
                        return c/2*t*t + b;
                    }
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                },

                easeInCubic: function (x, t, b, c, d) {
                    return c*(t/=d)*t*t + b;
                },

                easeOutCubic: function (x, t, b, c, d) {
                    return c*((t=t/d-1)*t*t + 1) + b;
                },

                easeInOutCubic: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) {
                        return c/2*t*t*t + b;
                    }
                    return c/2*((t-=2)*t*t + 2) + b;
                },

                easeInQuart: function (x, t, b, c, d) {
                    return c*(t/=d)*t*t*t + b;
                },

                easeOutQuart: function (x, t, b, c, d) {
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },

                easeInOutQuart: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) {
                        return c/2*t*t*t*t + b;
                    }
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                },

                easeInQuint: function (x, t, b, c, d) {
                    return c*(t/=d)*t*t*t*t + b;
                },

                easeOutQuint: function (x, t, b, c, d) {
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },

                easeInOutQuint: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) {
                        return c/2*t*t*t*t*t + b;
                    }
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                },

                easeInSine: function (x, t, b, c, d) {
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },

                easeOutSine: function (x, t, b, c, d) {
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },

                easeInOutSine: function (x, t, b, c, d) {
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                },

                easeInExpo: function (x, t, b, c, d) {
                    return (t===0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },

                easeOutExpo: function (x, t, b, c, d) {
                    return (t===d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },

                easeInOutExpo: function (x, t, b, c, d) {
                    if (t===0) return b;
                    if (t===d) return b+c;

                    if ((t/=d/2) < 1) {
                        return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    }
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },

                easeInCirc: function (x, t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },

                easeOutCirc: function (x, t, b, c, d) {
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },

                easeInOutCirc: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) {
                        return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    }
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                },

                easeInElastic: function (x, t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;

                    if (t===0) return b;
                    if ((t/=d)===1) return b+c;  
                    if (!p) p=d*0.3;

                    if (a < Math.abs(c)) { 
                        a=c; s=p/4; 
                    } else {
                        s = p/(2*Math.PI) * Math.asin (c/a);
                    }
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },

                easeOutElastic: function (x, t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;

                    if (t===0) return b;  
                    if ((t/=d)===1) return b+c;  
                    if (!p) p=d*0.3;
                    if (a < Math.abs(c)) { 
                        s=p/4; 
                        a=c; 
                    } else {
                        s = p/(2*Math.PI) * Math.asin (c/a);
                    }
                    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                },

                easeInOutElastic: function (x, t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;

                    if (t===0) return b;  
                    if ((t/=d/2)===2) return b+c;  
                    if (!p) p=d*(0.3*1.5);

                    if (a < Math.abs(c)) { 
                        s=p/4; 
                        a=c; 
                    } else {
                        s = p/(2*Math.PI) * Math.asin (c/a);
                    }
                    if (t < 1) return -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;

                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
                },

                easeInBack: function (x, t, b, c, d, s) {
                    if (s === undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },

                easeOutBack: function (x, t, b, c, d, s) {
                    if (s === undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },

                easeInOutBack: function (x, t, b, c, d, s) {
                    if (s === undefined) s = 1.70158; 
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                },

                easeInBounce: function (x, t, b, c, d) {
                    return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
                },
                easeOutBounce: function (x, t, b, c, d) {
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
                    }
                },
                easeInOutBounce: function (x, t, b, c, d) {
                    if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * 0.5 + b;
                    return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
                }
            });

        },
        unload: function() {}
    };
});
;/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Charm, timed animations based   * 
* on scrolling and page location           *
* ---------------------------------------- */
$.GUI().use(function(gui) {

    return {

        load: function(api) {
            var Charm;

            Charm = (function() {

                function Charm(options) {

                    if (!options || options === null) {
                        options = {};
                    }

                    this.start = api.broker.bind(this.start, this);
                    this.scrollHandler = api.broker.bind(this.scrollHandler, this);
                    this.scrollCallback = api.broker.bind(this.scrollCallback, this);
                    this.resetAnimation = api.broker.bind(this.resetAnimation, this);

                    this.config = this.extend(options, this.defaults);
                    this.charmEvent = this.Event.create(this.config.boxClass);

                    this.scrolled = true;
                    this.animationNameCache = api.dom.map;
                }

                Charm.prototype.defaults = {
                    boxClass: 'charm',
                    animateClass: 'animated',
                    offset: 0,
                    mobile: true,
                    live: true,
                    callback: null,
                    scrollContainer: null
                };

                Charm.prototype.extend = function(custom, defaults) {
                    var key, value;

                    for (key in defaults) {

                        value = defaults[key];

                        if (custom[key] !== null) {
                            custom[key] = value;
                        }
                    }

                    return custom;
                };

                Charm.prototype.vendors = ["moz", "webkit"];

                Charm.prototype.Event = api.dom.Event;
                
                Charm.prototype.disabled = function() {
                    return !this.config.mobile && this.Event.isMobile(navigator.userAgent);
                };

                Charm.prototype.init = function() {
                    var ref;

                    this.element = document.documentElement;

                    if ((ref = document.readyState) === "interactive" || ref === "complete") {

                        this.start();

                    } else {

                        this.Event.add(document, 'DOMContentLoaded', this.start);
                    }

                    this.finished = [];

                    return this.finished;
                };

                Charm.prototype.start = function() {
                    var _this = this, box, j, length, _ref;

                    this.stopped = false;

                    this.boxes = (function() {
                        var i = 0, length, _ref, results = [];

                        _ref = this.element.querySelectorAll("." + this.config.boxClass);

                        length = _ref.length;

                        if (length > 0) {

                            do {
                                box = _ref[i];

                                results.push(box);

                                i++;
                            } while (--length);
                        }

                        return results;

                    }).call(this);

                    this.all = (function() {
                        var j, len, ref, results;

                        ref = this.boxes;
                        results = [];

                        for (j = 0, len = ref.length; j < len; j++) {
                          box = ref[j];
                          results.push(box);
                        }

                        return results;

                    }).call(this);

                    if(this.boxes.length){

                        if(this.disabled()){

                            this.resetStyle();

                        }else{
                            ref = this.boxes;

                            for(j = 0, length = ref.length; j < length; j++){
                                box = ref[j];
                                this.applyStyle(box, true);
                            }
                        }
                    }

                    if (!this.disabled()) {
                        this.Event.add(window, 'scroll', this.scrollHandler);
                        this.Event.add(window, 'resize', this.scrollHandler);

                        this.interval = window.setInterval(this.scrollCallback, 50);
                    }

                    if (this.config.live) {

                        return new MutationObserver((function(_this) {
                            return function(records) {
                                var i = 0, length, node, record, results = [];

                                for (length = records.length; i < length; i++) {
                                    record = records[i];

                                    results.push((function() {
                                        var l, len2, ref1, results1;

                                        ref1 = record.addedNodes || [];
                                        results1 = [];

                                        for(l = 0, len2 = ref1.length; l < len2; l++){
                                            node = ref1[l];
                                            results1.push(this.doSync(node));
                                        }

                                        return results1;

                                    }).call(_this));
                                }

                                return results;
                            };
                        })(this)).observe(document.body, {
                            childList: true,
                            subtree: true
                        });
                    }
                };

                Charm.prototype.stop = function() {
                    this.stopped = true;

                    this.Event.remove(window, 'scroll', this.scrollHandler);
                    this.Event.remove(window, 'resize', this.scrollHandler);

                    if (this.interval !== null) {
                        return window.clearInterval(this.interval);
                    }
                };

                /**
                 * Check for MutationObserver support
                 *
                 * @param element {object} - dom element object
                 * @return sync {function} - attempt to sync with dom element
                **/
                Charm.prototype.sync = function(element) {
                    if (MutationObserver.notSupported) {
                        return this.doSync(this.element);
                    }
                };

                Charm.prototype.doSync = function(element) {
                    var box, i = 0, length, ref, results = [];

                    if (element === null) {
                        element = this.element;
                    }

                    if (element.nodeType !== 1) {
                        return;
                    }

                    element = element.parentNode || element;
                    ref = element.querySelectorAll("." + this.config.boxClass);

                    for (length = ref.length; i < length; i++) {
                        box = ref[i];

                        if (api.Array.index.call(this.all, box) < 0) {
                            this.boxes.push(box);
                            this.all.push(box);

                            if (this.stopped || this.disabled()) {
                                this.resetStyle();
                            } else {
                                this.applyStyle(box, true);
                            }

                            results.push(this.scrolled = true);

                        } else {

                            results.push(void 0);
                        }
                    }

                    return results;
                };

                /**
                 * Add needed show events to reset animations 
                 *
                 * @param box {object} - the box element with animation props 
                 * @return box {object} - updated box element with added events 
                **/
                Charm.prototype.show = function(box) {
                    this.applyStyle(box);

                    box.className = box.className + " " + this.config.animateClass;

                    if (this.config.callback !== null) {
                        this.config.callback(box);
                    }

                    this.Event.fire(box, this.charmEvent);

                    this.Event.add(box, 'animationend', this.resetAnimation);
                    this.Event.add(box, 'oanimationend', this.resetAnimation);
                    this.Event.add(box, 'webkitAnimationEnd', this.resetAnimation);
                    this.Event.add(box, 'MSAnimationEnd', this.resetAnimation);

                    return box;
                };

                Charm.prototype.applyStyle = function(box, hidden) {
                    var delay, duration, iteration;

                    duration = box.getAttribute('data-charm-duration');
                    delay = box.getAttribute('data-charm-delay');
                    iteration = box.getAttribute('data-charm-iteration');

                    return this.animate((function(_this) {

                        return function() {
                            return _this.customStyle(box, hidden, duration, delay, iteration);
                        };
                    })(this));
                };

                Charm.prototype.animate = (function() {
                    if ('requestAnimationFrame' in window) {
                        return function(callback) {
                            return window.requestAnimationFrame(callback);
                        };

                    } else {
                        return function(callback) {
                            return callback();
                        };
                    }
                })();

                Charm.prototype.resetStyle = function() {
                    var box, i = 0, length, ref, results = [];

                    ref = this.boxes;

                    for (length = ref.length; i < length; i++) {
                        box = ref[i];
                        results.push(box.style.visibility = 'visible');
                    }

                    return results;
                };

                Charm.prototype.resetAnimation = function(e) {
                    var target;

                    if (e.type.toLowerCase().indexOf('animationend') >= 0) {
                        target = e.target || e.srcElement;

                        target.className = target.className.replace(this.config.animateClass, '').trim();

                        return target.className;
                    }
                };

                Charm.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
                    if (hidden) {
                        this.cacheAnimationName(box);
                    }

                    box.style.visibility = hidden ? 'hidden' : 'visible';

                    if (duration) {
                        this.vendorSet(box.style, {
                            animationDuration: duration
                        });
                    }

                    if (delay) {
                        this.vendorSet(box.style, {
                            animationDelay: delay
                        });
                    }

                    if (iteration) {
                        this.vendorSet(box.style, {
                            animationIterationCount: iteration
                        });
                    }

                    this.vendorSet(box.style, {
                        animationName: hidden ? 'none' : this.cachedAnimationName(box)
                    });

                    return box;
                };

                Charm.prototype.vendorSet = function(elem, properties) {
                    var name, results = [], value, vendor;

                    for (name in properties) {
                        value = properties[name];
                        elem["" + name] = value;

                        results.push((function() {
                            var i, ref, results1;

                            ref = this.vendors;
                            results1 = [];

                            for (i = 0; i < ref.length; i++) {

                                vendor = ref[i];
                                results1.push(elem["" + vendor + (name.charAt(0).toUpperCase()) + (name.substr(1))] = value);
                            }

                            return results1;

                        }).call(this));
                    }

                    return results;
                };

                Charm.prototype.vendorCSS = function(elem, property) {
                    var i = 0, length, ref, result, style, vendor;

                    style = window.getComputedStyle(elem);
                    result = style.getPropertyCSSValue(property);

                    ref = this.vendors;

                    for (length = ref.length; i < len; i++) {
                        vendor = ref[i];
                        result = result || style.getPropertyCSSValue("-" + vendor + "-" + property);
                    }

                    return result;
                };

                Charm.prototype.animationName = function(box) {
                    var animationName;

                    try {

                        animationName = this.vendorCSS(box, 'animation-name').cssText;

                    } catch (_error) {

                        animationName = window.getComputedStyle(box).getPropertyValue('animation-name');
                    }

                    if (animationName === 'none') {

                        return '';

                    } else {

                        return animationName;
                    }
                };

                Charm.prototype.cacheAnimationName = function(box) {
                    return this.animationNameCache.set(box, this.animationName(box));
                };

                Charm.prototype.cachedAnimationName = function(box) {
                    return this.animationNameCache.get(box);
                };

                Charm.prototype.scrollHandler = function() {
                    this.scrolled = true;

                    return this.scrolled;
                };

                Charm.prototype.scrollCallback = function() {
                    var box;

                    if (this.scrolled) {
                        this.scrolled = false;
                        this.boxes = (function() {
                            var j, len, ref, results;

                            ref = this.boxes;
                            results = [];

                            for (j = 0, len = ref.length; j < len; j++) {
                                box = ref[j];

                                if (!(box)) {
                                    continue;
                                }

                                if (this.isVisible(box)) {
                                    this.show(box);
                                    continue;
                                }

                                results.push(box);
                            }

                            return results;

                        }).call(this);

                        if (!(this.boxes.length || this.config.live)) {
                            return this.stop();
                        }
                    }
                };

                Charm.prototype.offsetTop = function(element) {
                    var top;

                    while (element.offsetTop === void 0) {

                        element = element.parentNode;
                    }

                    top = element.offsetTop;

                    while (element == element.offsetParent) {

                        top += element.offsetTop;
                    }

                    return top;
                };

                Charm.prototype.isVisible = function(box) {
                    var bottom, offset, top, viewBottom, viewTop;

                    offset = box.getAttribute('data-charm-offset') || this.config.offset;

                    viewTop = window.pageYOffset;
                    viewBottom = viewTop + Math.min(this.element.clientHeight, this.Event.innerHeight()) - offset;

                    top = this.offsetTop(box);
                    bottom = top + box.clientHeight;

                    return top <= viewBottom && bottom >= viewTop;
                };

                return Charm;

            })();

            api.ui.charm = Charm;
        },
        unload: function() {}
    };
});
;/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Cellar, handle local & session  * 
* storage api's                            *
* ---------------------------------------- */
$.GUI().use(function(gui) {

    /* Private methods */
    /**
     * Check for browser compatibility of passed storage object
     *
     * @param storage {string} - the storage object to check
     * @return {boolean}
    **/
    function checkStorage(storage) {
        var gui = 'guerrilla';

        try {

            if (window === 'undefined' || !window[storage]) {
                return false;
            }

            window[storage].setItem(gui, gui);
            window[storage].removeItem(gui);

            return true;

        } catch(e) {

            return false;
        }
    }

    /**
     * Remove all items from a storage
     *
     * @param storage {string} - the storage object to remove all items from 
     * @return {void}
    **/
    function _removeAll(storage) {
        var i, keys = _keys(storage);

        for (i in keys) {
            _remove(storage, keys[i]);
        }
    }

    /**
     * Return array of keys from passed storage object  
     *
     * @param store {string} - the storage object to get keys from 
     * @return {array} - keys 
    **/
    function _keys(store) {
        var i, keys = [], obj = {}, length, storage, argc;

        argc = arguments;
        length = argc.length;

        storage = window[store];
        // If more than 1 argument, get value from storage to retrieve keys
        // Else, use storage to retrieve keys
        if (length > 1) {

            obj = _get.apply(this, argc);
        } else {
            obj = storage;
        }

        for (i in obj) {
           keys.push(i);
        }

        return keys;
    }

    return {

        load: function(api) {

            if (checkStorage('localStorage') === false || checkStorage('sessionStorage') === false) {

                api.warn('Sorry but this browser does not support storage objects.');

                return false;
            }

            /**
             * Get value from passed storage object and key 
             *
             * @param store {string} - the storage object to search
             * @param sname {string} - the key to check for and return value of
             * @return {object} - value of passed key
            **/
            function _get(store){
                var i, length, sname, storage, argc, vi, _ret, tmp, j; 

                argc = arguments;
                length = argc.length;

                storage = window[store];
                sname = argc[1];

                if (length < 2) throw new Error('Minimum 2 arguments must be given');

                else if (api.utils.isArr(sname)) {
                    // If second argument is an array, return an object with value of storage for each item in this array
                    _ret = {};

                    for (i in a1) {
                        vi = sname[i];

                        try {
                            _ret[vi] = JSON.parse(storage.getItem(vi));

                        } catch(e) {
                            _ret[vi] = storage.getItem(vi);
                        }
                    }

                    return _ret;

                } else if (length === 2) {
                    // If only 2 arguments, return value directly
                    try {

                        return JSON.parse(storage.getItem(sname));

                    } catch(e) {
                        return storage.getItem(sname);
                    }
                } else {
                    // If more than 2 arguments, parse storage to retrieve final value to return it
                    // Get first level
                    try {

                        _ret = JSON.parse(storage.getItem(sname));

                    } catch(e) {
                        throw new ReferenceError(sname + ' is not defined in this storage');
                    }

                    // Parse next levels
                    for (i = 2; i < length - 1; i++) {
                        _ret = _ret[argc[i]];

                        if (_ret === undefined) throw new ReferenceError(api.utils.slice.call(argc, 1, i + 1).join('.') + ' is not defined in this storage');
                    }
                    // If last argument is an array, return an object with value for each item in this array
                    // Else return value normally
                    if(api.utils.isArr(argc[i])) {
                        tmp = _ret;
                        _ret = {};

                        for (j in argc[i]) {

                            _ret[argc[i][j]] = tmp[argc[i][j]];
                        }

                        return _ret;

                    } else {
                        return _ret[argc[i]];
                    }
                }
            }

            /**
             * Set value to passed storage object and key 
             *
             * @param store {string} - the storage object to search
             * @param sname {string} - the key to store data value under 
             * @param data {object} - optional data object or string to store
             * @return {object} - cellar data 
            **/
            function _set(store) {
                var i, length, argc, sname, data, vi, to_cellar = {}, tmp;

                argc = arguments;
                length = argc.length;

                storage = window[store];

                sname = argc[1];
                data = argc[2];

                if (length < 2 || !api.Object.isPlain(sname) && length < 3) throw new Error('Minimum 3 arguments must be given or second parameter must be an object');

                else if(api.Object.isPlain(sname)) {
                    // If first argument is an object, set values of storage for each property of this object
                    for (i in sname) {
                        vi = sname[i];

                        if (!api.Object.isPlain(vi)) {
                          
                            storage.setItem(i, vi);
                        } else {
                            storage.setItem(i, JSON.stringify(vi));
                        }
                    }

                    return sname;

                } else if (length === 3) {
                    // If only 3 arguments, set value of storage directly
                    if (api.utils.isObj(data)) {
                      
                        storage.setItem(sname, JSON.stringify(data));
                    } else {
                      
                        storage.setItem(sname, data);
                    }

                    return data;

                } else {
                    // If more than 3 arguments, parse storage to retrieve final node and set value
                    // Get first level
                    try {
                        tmp = storage.getItem(sname);

                        if (tmp !== null) {
                            to_cellar = JSON.parse(tmp);
                        }
                    } catch(e) {}
                    
                    tmp = to_cellar;
                    // Parse next levels and set value
                    for(i = 2; i < length - 2; i++) {
                        vi = argc[i];

                        if (!tmp[vi] || !api.Object.isPlain(tmp[vi])) {

                          tmp[vi] = {};
                        }

                        tmp = tmp[vi];
                    }

                    tmp[argc[i]] = argc[i + 1];
                    storage.setItem(sname, JSON.stringify(to_cellar));

                    return to_cellar;
                }
            }

            /**
             * Check wether or not a value is set in passed storage object
             *
             * @param store {string} - the storage object to check
             * @param snamem {string} - the key to search storage object for
             * @return {boolean}
             *
            **/
            function _isSet(store) {
                var i, value, length, argc, storage, sname;

                argc = arguments;
                length = argc.length;

                sname = argc[1];
                storage = window[store];

                if (length < 2) throw new Error('Minimum 2 arguments must be given');

                if (api.utils.isArr(sname)) {
                    // If first argument is an array, test each item of this array and return true only if all items exist
                    for(i = 0; i < sname.length; i++) {

                        if (!_isSet(storage, sname[i])) {

                            return false;
                        }
                    }

                    return true;
                } else {
                    // For other case, try to get value and test it
                    try {
                        value = _get.apply(this, arguments);

                        // Convert result to an object (if last argument is an array, _get return already an object) and test each item
                        if (!api.utils.isArr(argc[length - 1])) {
                          
                          value = {'totest': value};
                        }

                        for (i in value) {
                            if (!(value[i] !== undefined && value[i] !== null)) {
                                return false;
                            }
                        }

                        return true;

                    } catch(e) {
                        return false;
                    }
                }
            }

            /**
             * Check to see if passed storage is empty
             *
             * @param store {string} - the storage object to check
             * @param sname {string} - the key to search storage object for
             * @return {boolean}
            **/
            function _isEmpty(store) {
                var i, value, length, argc, storage, sname;

                argc = arguments; 
                length = argc.length;

                storage = window[store];
                sname = argc[1];

                if (length === 1) {
                    // If only one argument, test if storage is empty
                    return (_keys(storage).length === 0);

                } else if (api.utils.isArr(sname)) {

                    // If first argument is an array, test each item of this array and return true only if all items are empty
                    for(i = 0; i < sname.length; i++){

                        if(!_isEmpty(storage, sname[i])) {

                            return false;
                        }
                    }

                    return true;

                } else {

                    // If more than 1 argument, try to get value and test it
                    try {
                        value = _get.apply(this, arguments);
                        // Convert result to an object (if last argument is an array, _get return already an object) and test each item
                        if(!api.utils.isArr(argc[length - 1])) value = {'totest': value};

                        for (i in value) {

                            if (!(
                                (api.Object.isPlain(value[i]) && api.Object.isEmpty(value[i])) ||

                                (api.utils.isArr(value[i]) && !value[i].length) ||

                                (!value[i])
                            )) return false;
                        }

                        return true;

                    } catch(e) {

                        return true;
                    }
                }
            }

            /**
             * Remove items from a storage 
             *
             * @param store {string} - the storage object to use
             * @param sname {string} - the key to remove from storage object
             * @return {boolean}
            **/
            function _remove(store) {
                var i, j, length, storage, argc, sname, to_cellar, tmp;

                argc = arguments;
                length = argc.length;

                storage = window[store];
                sname = argc[1];

                if (length < 2) throw new Error('Minimum 2 arguments must be given');

                else if (api.utils.isArr(sname)) {
                    // If first argument is an array, remove values from storage for each item of this array
                    for(i in sname){
                        storage.removeItem(sname[i]);
                    }

                    return true;

                } else if (length === 2) {
                    // If only 2 arguments, remove value from storage directly
                    storage.removeItem(a1);

                    return true;

                } else {
                    // If more than 2 arguments, parse storage to retrieve final node and remove value
                    // Get first level
                    try {

                        to_cellar = tmp = JSON.parse(storage.getItem(sname));

                    } catch(e) {
                        throw new ReferenceError(sname + ' is not defined in this storage');
                    }

                    // Parse next levels and remove value
                    for (i = 2; i < length - 1; i++) {
                        tmp = tmp[argc[i]];

                        if (tmp === undefined) throw new ReferenceError(api.utils.slice.call(argc, 1, i).join('.') + ' is not defined in this storage');
                    }

                    // If last argument is an array,remove value for each item in this array
                    // Else remove value normally
                    if (api.utils.isArr(argc[i])) {

                        for(j in argc[i]) {

                            delete tmp[argc[i][j]];
                        }
                    } else {
                        delete tmp[argc[i]];
                    }

                    storage.setItem(sname, JSON.stringify(to_store));

                    return true;
                }
            }

            /* Public methods */
            api.cellar = {
                _type: '',
                _cached: {},
                ls: window.localStorage,
                ws: window.sessionStorage,

               /**
                * Method to directly call specified function with arguments
                *
                * @param fn {function} - the function to execute
                * @param args {array} - optional arguments array to be applied to function
                * @return {function} execute
                **/
                _call: function(fn, args) {
                    var type, argc, sname;

                    type = [this._type];
                    argc = api.utils.slice.call(args);

                    sname = argc[0];

                    if (api.utils.isStr(sname) && api.Array.index('.') !== -1) {

                        argc.shift();

                        [].unshift.apply(argc, sname.split('.'));
                    }

                    [].push.apply(type, argc);

                    return fn.apply(this, type);
                },

                /* get data from cellar */
                get: function() {
                    return this._call(_get, arguments);
                },

                /* store data in cellar */
                set: function() {
                    var length, argc, sname;

                    agrc = arguments;
                    length = argc.length;

                    sname = argc[0];

                    if (length < 1 || !api.Object.isPlain(sname) && length < 2) {
                        throw new Error('Minimum 2 arguments must be given or first parameter must be an object');
                    }

                    return this._call(_set, argc);
                },
                
                /* return array of keys from s cellar */
                keys: function() {
                    return this._call(_keys, arguments);
                },

                /* remove item from cellar */
                remove: function() {
                    if (arguments.length < 1) {
                      throw new Error('Minimum 1 argument must be given');
                    }

                    return this._call(_remove, arguments);
                },

                /* remove all items from cellar */
                removeAll: function() {
                    return _removeAll(this._type, reinit);
                },

                /* check if cellar is empty */
                isEmpty: function() {
                    return this._call(_isEmpty, arguments);
                },
                
                /* check if value is stored in cellar */
                isSet: function() {
                    if (arguments.length < 1) {
                      throw new Error('Minimum 1 argument must be given');
                    }

                    return this._call(_isSet, arguments);
                }
            };
        }
    };
});
;/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Custom cookie api object        *
* ---------------------------------------- */
$.GUI().use(function(G) {

    function _load(api) {

        api.cookie = {

            has:function(cname){
                if (!cname) { 
                    return false; 
                }

                return (

                    new RegExp("(?:^|;\\s*)" + api.Lang.encode(cname).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")

                ).test(document.cookie);
            },

            get: function(cname) {
                if (!cname) { 
                    return null; 
                }

                return api.Lang.decode(document.cookie.replace(

                    new RegExp("(?:(?:^|.*;)\\s*" + api.Lang.encode(cname).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")

                ) || null;
            },

            set: function(cname, cvalue, opts) {
                var params = arguments;

                if (params.length > 1 && !api.utils.isFunc(cval)) {
                    options = api.utils.merge({}, opts); 
              
                    if ((typeof options.expires) === 'number') {
                        var days = options.expires, 
                            time = options.expires = new Date();

                        time.setMilliseconds(
                            time.getMilliseconds() + days * 864e+5
                        );
                    }
                }

                document.cookie = [
                    api.Lang.encode(cname), '=', api.Lang.encode(cvalue),
                    (options.expires) ? '; expires=' + options.expires.toUTCString() : '',
                    (options.path) ? '; path=' + options.path : '', 
                    (options.domain) ? '; domain=' + options.domain : '',
                    (options.secure) ? '; secure=' + options.secure : '' 
                ].join('');

                G.log('set cookie ::', document.cookie);

                return true;
            },
            
            remove: function(cname, cpath, cdomain){
                if (!this.has(cname)) { 
                    return false; 
                }

                document.cookie = api.Lang.encode(cname) +
                    "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
                    (cdomain) ? "; domain=" + cdomain : "" +
                    (cpath) ? "; path=" + cpath : "";

                return true;
            },

            list: function() {
                var index = 0,
                    regex = /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, 
                    keys = document.cookie.replace(regex, '').split(/\s*(?:\=[^;]*)?;\s*/),
                    length = keys.length;

                while(--length){
                    keys[index] = api.Lang.decode(keys[index]); 

                    index++;
                }

                return keys;
            },

            once:function(){
                var values, 
                    params = arguments, 
                    callback = params[0], 
                    argc = params.length, 
                    cname = params[argc - 3],
                    expires = params[argc - 1],
                    glob = (typeof params[argc - 2] === "string");

                if(glob){ 
                    argc++; 
                }

                if(argc < 3){ 
                    throw new TypeError("guerrilla.core.once - not enough arguments"); 

                }else if(!api.utils.isFunc(func)) { 
                    throw new TypeError("guerrilla.core.once - first argument must be a function"); 

                }else if(!cname || /^(?:expires|max\-age|path|domain|secure)$/i.test(cname)){ 
                    throw new TypeError("guerrilla.core.once - invalid identifier");
                }

                if(this.has(cname)){
                    return false;
                }

                values = (argc > 3) ? params[1] : null || (argc > 4) ? [].slice.call(params, 2, argc - 2) : [];

                func.apply(values);

                this.set(cname, 1, expires || 'Fri, 31 Dec 9999', '/', false);

                return true;
            }
        };
    }

    return {
        load: _load
    };
});
