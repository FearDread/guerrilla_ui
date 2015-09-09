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
            console.log('testing api arguments ..', arguments);

            // set sandbox vars
            this.id = instance;
            this.module = module;
            this.options = (options !== null) ? options : {}; 

            // add utils object
            this.utils = utils;

            // add MVC classes
            this.Model = Model;

            // attach new sandbox instance
            core._broker.install(this);

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

            // attach core modules //
            /* 
            for (var p in core._plugins) {
              var plugin = core._plugins[p];
            }
            */

            return this;
        }
    };
};
