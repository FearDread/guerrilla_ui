/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: GUI Core library class          * 
* ---------------------------------------- */
var GUI, config;

// GUI Core
GUI = (function() {

    // Helper method to check property type
    function utils.isType(type, val, name) {
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
