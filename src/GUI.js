/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI jQuery namespace          * 
* ---------------------------------------- */
var GUI, config;

GUI = (function() {

    function GUI(sandbox) {
        var error;
        
        if (sandbox && !utils.isFunc(this.sandbox)) {
            throw new Error('Sandbox must be a function.');
        }

        this.sandbox = sandbox;
        console.log('sandbox = ', this.sandbox);

        this._modules = {};
        this._plugins = [];
        this._instances = {};
        this._sandboxes = {};
        this._running = {};

        // add broker to core object
        this._broker = new Broker(this);

        if (this.sandbox === null || !this.sandbox) {

            this.sandbox = function(core, instance, opts, module) {
            
                this.instance = instance;
                this.module = module;
                this.options = (opts) ? opts : {}; 

                // attach utils methods to sandbox insatnce
                core._broker.attach(utils);
                // attach new sandbox instance
                core._broker.attach(this);

                console.log('hmmm :', this);
                return this;
            };
        }
    }

    /** 
     * Logging 
    **/
    GUI.prototype.log = {
        log: function() {},
        info: function() {},
        warn: function() {},
        error: function() {},
        enable: function() {}
    };

    /* Private Methods */
    /** 
      * Called when starting module fails 
      *
      *
    **/
    GUI.prototype._fail = function(ev, callback) {
        console.log('failing?', ev);
        this.log.error(ev);

        callback(new Error("could not start module: " + ev.message));

        return this;
    };

    /** 
      * Run all modules with optional options obj 
      *
      *
    **/
    GUI.prototype._run = function(ev, sandbox, callback) {
        var p, tasks;

        tasks = (function() {
            var i = 0, length, ref, newRef, results;

            results = [];
            ref = this._plugins;
            length = ref.length;

            if (length > 0){
                do {
                    p = ref[i];

                    if (typeof ((newRef = p.plugin) !== null ? newRef[ev] : void 0) === "function") {
                        results.push((function(p) {
                            var fn;

                            fn = p.plugin[ev];

                            return function(next) {
                                if (utils.hasArgs(fn, 3)) {
                                    return fn(sandbox, p.options, next);
                                } else {
                                    fn(sandbox, p.options);
                                    return next();
                                }
                            };
                        })(p));
                    }

                    i++;
                } while (--length);
            }

            console.log('results = ', results);
            return results;

        }).call(this);

        console.log('wtf ', tasks);
        return utils.run.series(tasks, callback, true);
    };

    /** 
      * Create new instance and apply to modules and plugins 
      *
      *
    **/
    GUI.prototype._instance = function(module, opts, callback) {
        var Sandbox, instanceOpts, id, i = 0, key, length, mod, obj, options, ref, sb, val;

        id = opts.instance || module;
        options = opts.options;
        console.log('module = ', module);
        mod = this._modules[module];
        console.log('wtf mods ', this._modules);
        console.log('mod = ', mod);

        if (this._instances[id]) {
            return callback(this._instances[id]);
        }

        instanceOpts = {};
        ref = [module.options, options];
        length = ref.length;

        do {
            obj = ref[i];

            if (obj) {
                for (key in obj) {
                    val = obj[key];
                        
                    if (instanceOpts[key] === null) {
                        instanceOpts[key] = val;
                    }
                }
            }

            i++;
        } while (--length);

        Sandbox = (utils.isFunc(opts.sandbox)) ? opts.sandbox : this.sandbox;
        sb = new Sandbox(this, id, instanceOpts, module);

        return this._run('load', sb, (function(_this) {
            return function(err) {
                var instance;
                
                instance = new mod.creator(sb);
                if (typeof instance.load !== "function") {
                    return callback(new Error("Module has no 'load' method"));
                }

                _this._instances[id] = instance;
                _this._sandboxes[id] = sb;

                return callback(null, instance, instanceOpts);
            };
        })(this));
    };

    GUI.prototype._startAll = function(modules, callback) {
        var done, module, action;

        if (!modules) {
            modules = (function() {
                var results;
                console.log(this._modules);

                results = [];

                for (module in this._modules) {
                    results.push(module);
                }

                return results;
            }).call(this);
        }
        console.log('mods = ', modules);

        action = (function(_this) {
            return function(module, next) {
                return _this.start(module, _this._modules[module].options, next);
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
                    var results;
                    results = [];

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
        console.log('running all :: ', modules);
        utils.run.all(modules, action, done, true);

        return this;
    };


    /* Public Methods */
    /* -------------- */
    GUI.prototype.create = function(module, callback) {
        var idx,
            GUI = this,
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
                temp = func(new instance().create(this, module));

                if(temp.load && temp.unload){
                    this._modules[module] = {
                        create:func,
                        instance:temp 
                    }
                }else if(temp.fn){
                    // this._plugin(temp);
                }
            }
        
            idx++;
        } while(--length);

        return GUI;
    };

    function instance() {
        return {
            create:function(core, module_selector){
                var proto;

                proto = Object.create(utils);
                /*
                proto = Object.create({
                    config:core.config,

                    elem:core.dom.elem,

                    win:core.win,

                    doc:core.dom.doc,

                    log:function(){
                        core.log(arguments);
                    },

                    event:core.dom.event,

                    el:function(elem){
                        return core.dom.create(elem);
                    },

                    query:function(selector){
                        return core.dom.query(selector);
                    },

                    isObj:core.isObj,

                    isArr:core.isArr,

                    emit:function(evnt, argc){
                        return core.publish(evnt, argc);
                    },

                    scribe:function(handle, func){
                        core.subscribe(handle, func);
                    },

                    unscribe:function(handle){
                        core.unsubscribe(handle);
                    },

                    listen:function(events){
                        core.registerEvents(events, module_selector);
                    },

                    ignore:function(events){
                        core.removeEvents(events, module_selector);
                    }
                });
                /* attach modules to GUI Instance */
                // core._attach(proto);
                console.log('omg :', proto);
                return proto; 
            }
        };
    };
    /** 
     * Create new module
     *
     *
    **/
    GUI.prototype.register = function(module, creator, options) {
        console.log('gui this = ', this);
        if (utils.isFunc(options)) {
            creator = options;
        }
        if (!options || options === null) {
            options = {};
        }

        if (!utils.isStr(module) || !utils.isFunc(creator) || !utils.isObj(options)) {
            console.log('wtf');
            this.log.error("Unable to create module " + module);
            return this;
        } 
        if (this._modules[module]) {
            console.log('wtf 2');
            this.log.warn("Module " + module + " was already created.");
            return this;
        }

        this._modules[module] = {
            id: module, 
            creator: creator,
            options: options,
        };

        console.log('modules = ', this._modules);

        return this;
    };
   
    /** 
     * Starts module with new sandbox instance 
     *
     *
    **/
    GUI.prototype.start = function(module, opts, callback) {
        var event, id, init;

        if (!opts) {
            opts = {};
        }
        if (!callback) {
            callback = function () {};
        }

        if (arguments.length === 0) {
            console.log('starting all modules :: ', this._modules);
            return this._startAll();
        }
        if (module instanceof Array) {
            return this._startAll(module, opts);
        }
        if (typeof module === "function") {
            return this._startAll(null, module);
        }
        if (typeof opts === "function") {
            callback = opts;
            opts = {};
        }

        /*
        e = utils.isStr(module) || utils.isObj(opts) || (!this._modules[module] ? 'module does not exist.' : void 0);

        if (e) {
          return this._fail(e, callback);
        }
        */

        id = opts.instanceId || module;
        console.log('starting id = ', id);

        if (this._running[id] === true) {
            return this._fail(new Error("module was already started"), cb);
        }

        init = (function(_this) {
            return function(err, instance, opt) {
                if (err) {
                    return _this._fail(err, callback);
                }

                try {
                    if (utils.hasArgs(instance.load, 2)) {
                        console.log('instance = ', instance);
                        return instance.load(opt, function(err) {

                            if (!err) {
                                _this._running[id] = true;
                            }

                            return callback(err);
                        });
                    } else {
                        instance.load(opt);
                        _this._running[id] = true;
                        
                        return callback();
                    }
                } catch (_error) {
                    e = _error;
                    return _this._fail(e, callback);
                }
            };
        })(this);

        return this.boot((function(_this) {
            return function(err) {
                if (err) {
                    return _this._fail(err, cb);
                }
                console.log('creating instance with ' + id);
                return _this._instance(id, opts, init);
            };

        })(this));
    };

    /** 
     * Stops all running instances 
     *
     *
    **/
    GUI.prototype.stop = function(id, callback) {

    };
    
    /** 
     * Register new plugin 
     *
     *
    **/
    GUI.prototype.use = function(plugin, opts) {

    };

    /** 
     * Load all available plugins 
     *
     *
    **/
    GUI.prototype.boot = function(callback) {
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
                        if (util.hasArgument(p.creator, 3)) {
                            return function(next) {
                                var plugin;

                                return plugin = p.creator(core, p.options, function(err) {
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

        utils.run.series(tasks, callback, true);

        return this;
    };

    return GUI;

})(this);
