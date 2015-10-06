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
