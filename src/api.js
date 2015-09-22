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
            this.data = $.data;
            this.Deferred = $.Deferred;
            this.Animation = $.Animation;

            // each loop reference
            this.each = utils.each;

            // reference debug methods 
            this.log = function() {
                return core.debug.log(arguments);
            };

            this.warn = function() {
                return core.debug.warn(arguments);
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
             * Get location with stored reference to window object 
             *
             * @return {object} - window ref
            **/
            this.getLocation = function() {
                var win = core.config.win;

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
