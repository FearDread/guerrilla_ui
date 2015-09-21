/* --------------------------------------- *
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

            // this.Broker = core._broker;

            // add utils object
            this.utils = utils;
             
            /* jQuery wrappers */
            // Ajax shorthand reference
            this.xhr = $.ajax;

            // each loop reference
            this.each = utils.each;

            // add Animation reference 
            this.Animation = $.Animation;

            // reference debug methods 
            this.log = function() {

                return core.debug.log(arguments);
            };

            this.warn = function() {

                return core.debug.warn(arguments);
            };

            /**
             * Animate method utalizing animate.css library
             *
            **/
            this.animate = function($el, anim, time) {
                if (time === undefined) {
                    time = 1500;
                }

                $el.show().addClass(anim);

                setTimeout(function() {
                    $el.removeClass(anim);
                }, time);
            };

            this.getLocation = function() {
                var win = core.config.win;

                return win && win.location;
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

                _ret.create = function(el) {
                    if (!utils.isStr(el)) {
                        this.log('Error :: Element must be type String.');
                        return false;
                    }

                    return document.createElement(el);
                };

                _ret.fontSize = function() {
                    return parseFloat(
                        window.getComputedStyle($el).fontSize
                    );
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
