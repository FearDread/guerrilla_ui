/* --------------------------------------- *
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

        this.attach = function(imports) {
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

        initInst = (function($this) {
            return function(err, instance, opt) {
                if (err) {
                    return $this._fail(err, cb);
                }

                try {
                    if (utils.hasArgs(instance.load, 2)) {
                        return instance.load(opt, function(err) {

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

            }).call(this), ((function($this) {
                return function() {
                    return $this.stop.apply($this, arguments);
                };
            })(this)), id, true);

        } else if (instance === this._instances[id]) {

            // remove instance from instances cache
            delete this._instances[id];

            // disable any events registered by module
            this._broker.off(instance);

            // run unload method in stopped modules
            this._runSandboxPlugins('unload', this._sandboxes[id], (function($this) {
                return function(err) {
                    if (utils.hasArgs(instance.unload)) {

                        return instance.unload(function(err2) {
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
    GUI.prototype.plugin = function(plugin, module) {
        var $this = this;

        if (plugin.fn && utils.isFunc(plugin.fn)) { 

            $.fn[module.toLowerCase()] = function(options) {

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
