/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI jQuery namespace          * 
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
    function GUI(sandbox) {
        var error;

        this.Sandbox = sandbox;
        
        if (this.Sandbox !== null) {
            error = checkType('function', this.Sandbox, 'Sandbox');
        }
        if (error) {
            throw new Error(error);
        }

        this._modules = {};
        this._plugins = [];
        this._instances = {};
        this._sandboxes = {};
        this._running = {};

        // add broker to core object
        this._broker = new Broker(this);
        this.Broker = Broker;

        if (this.Sandbox === null) {

            this.Sandbox = function(core, instanceId, options, moduleId) {
            
                this.instanceId = instanceId;
                this.moduleId = moduleId;
                this.options = (options !== null) ? options : {}; 

                // attach new sandbox instance
                core._broker.install(this);

                return this;
            };
        }
    }

    // console log wrapper
    GUI.prototype.log = function() {
        this.log.history = [];
        this.log.history.push(arguments);

        if (console) {
            console.log([].slice.call(arguments));
        }

        if (this.debug) {
            console.log(this.log.history);
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
          this.log.error("could not register module '" + id + "': " + error);
          return this;
        }

        if (id in this._modules) {
          this.log.warn("module " + id + " was already registered");
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
                    if (utils.hasArgs(instance.init, 2)) {
                        return instance.init(opt, function(err) {

                            if (!err) {
                                _this._running[id] = true;
                            }

                            return cb(err);
                        });
                    } else {

                        instance.init(opt);
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

            this._runSandboxPlugins('destroy', this._sandboxes[id], (function(_this) {
                return function(err) {
                    if (utils.hasArgs(instance.destroy)) {

                        return instance.destroy(function(err2) {
                            delete _this._running[id];

                            return cb(err || err2);
                        });
                    } else {
                        if (typeof instance.destroy === "function") {
                            instance.destroy();
                        }

                        delete _this._running[id];

                        return cb(err);
                    }
                };
            })(this));
        }

        return this;
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
        this.log.error(ev);

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

        id = o.instanceId || moduleId;
        opt = o.options;
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

        Sandbox = typeof o.sandbox === 'function' ? o.sandbox : this.Sandbox;
        sb = new Sandbox(this, id, iOpts, moduleId);

        return this._runSandboxPlugins('init', sb, (function(_this) {
            return function(err) {
                var instance;
                instance = new module.creator(sb[0]);

                if (typeof instance.init !== "function") {
                    return cb(new Error("module has no 'init' method"));
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

    /* Old Core Methods */
    /********************/
    GUI.prototype.createOld = function(module, callback) {
        var GUI = this,
            argc = [].slice.call(arguments),
            func = argc.pop(),
            imports = (argc[0] && typeof argc[0] === 'string') ? argc : argc[0];

        if(!imports || imports === 'core'){
            imports = [];

            for(module in GUI.modules){

                if(GUI.modules.hasOwnProperty(module)){
                    imports.push(module);
                }
            }
        }

        var temp,
            idx = 0,
            length = imports.length;

        do {
            module = imports[idx];

            if(module){
                temp = func(new API().create(this, module));

                if(temp.load && temp.unload){
                    this._modules[module] = {
                        create:func,
                        instance:temp 
                    };
                } else if (temp.fn){
                    this.plugin(temp, module);
                }
            }
        
            idx++;
        } while(--length);

        return GUI;
    };

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

    return GUI;

})(this);
