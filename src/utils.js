/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI jQuery namespace          * 
* ---------------------------------------- */
var utils;

utils = {
    /* jQuery re-map of $.extend */
    merge: $.extend,

    /* Function Regex */
    fnRgx: /function[^(]*\(([^)]*)\)/,

    /* Argument Regex */
    argRgx: /([^\s,]+)/g,

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

    bind: function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
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

        return (((fn !== null ? (ref = fn.toString().match(utils.fnRgx)) !== null) ? ref[1] : void 0 : void 0) || '').match(utils.argRgx) || [];
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
            var arg, tasks;

            if (args === null) {
                args = [];
            }

            tasks = (function() {
                var j, len, results = [];

                for (j = 0, len = args.length; j < len; j++) {
                    arg = args[j];

                    results.push((function(a) {
                        return function(next) {
                            return fn(a, next);
                        };
                    })(arg));
                }

                return results1;

            })();

            return this.run.parallel(tasks, cb, force);
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
