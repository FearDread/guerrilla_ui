// New GUI Core Object //
var GUI, config;

GUI = (function() {

    function GUI(sandbox) {
        var error;
        
        if (sandbox && !utils.isFunc(this.sandbox)) {
            throw new Error('Sandbox must be a function.');
        }

        this.sandbox = sandbox;

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
	    var plugin, tasks;

	    tasks = (function() {
	      var i = 0, length, ref, newRef, results;

	      results = [];
	      ref = this._plugins;
	      length = ref.length;

	      do {
		  plugin = ref[i];

		  if (typeof ((newRef = plugin.plugin) != null ? newRef[ev] : void 0) === "function") {
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
		      })(plugin));
		  }

	          i++;
	      } while (--length);

	      return results;

	    }).call(this);

	    return util.runSeries(tasks, cb, true);

	};

        /** 
         * Create new instance and apply to modules and plugins 
         *
         *
        **/
	GUI.prototype._instance = function(module, opts, callback) {
	    var Sandbox, instanecOpts, id, i = 0, key, length, mod, obj, options, ref, sb, val;

	    id = opts.instance || module;
	    options = opts.options;
	    mod = this._modules[module];

	    if (this._instances[module]) {
	      return callback(this._instances[module]);
	    }

	    instanceOpts = {};
	    ref = [mod.options, options];
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

	    return this._plugins('load', sb, (function(_this) {
	        return function(err) {
		    var instance;
		
		    instance = new module.creator(sb);
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

                    results = [];

                    for (module in this._modules) {
                        results.push(module);
                    }

                    return results;
                }).call(this);
            }

            action = (function(_this) {
                return function(module, next) {
                    return _this.start(module, _this._modules[module].options, next);
                };
            })(this);

            done = function(err) {
              var e, i, j, k, len, mdls, modErrors, x;
              if ((err != null ? err.length : void 0) > 0) {
                modErrors = {};
                for (i = j = 0, len = err.length; j < len; i = ++j) {
                  x = err[i];
                  if (x != null) {
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
            util.doForAll(mods, startAction, done, true);

            return this;
        };


    /* Public Methods */
    /* -------------- */
        /** 
         * Create new module
         *
         *
        **/
        GUI.prototype.create = function(module, creator, options) {
	    if (!options || options === null) {
	        options = {};
            }

	    if (!utils.isStr(module) || !utils.isFunc(creator) || !utils.isObj(options)) {
	        this.log.error("Unable to create module " + module);
		return this;
	    } 
	    if (this._modules[module]) {
	        this.log.warn("Module " + module + " was already created.");
	        return this;
	    }

	    this._modules[module] = {
	        id: module, 
	        creator: creator,
	        options: options,
	    };

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
            e = checkType("string", moduleId, "module ID") || checkType("object", opt, "second parameter") || (!this._modules[moduleId] ? "module doesn't exist" : void 0);
            if (e) {
              return this._startFail(e, cb);
            }
            id = opt.instanceId || moduleId;
            if (this._running[id] === true) {
              return this._startFail(new Error("module was already started"), cb);
            }
            initInst = (function(_this) {
              return function(err, instance, opt) {
                if (err) {
                  return _this._startFail(err, cb);
                }
                try {
                  if (util.hasArgs(instance.init, 2)) {
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
                  return _this._startFail(e, cb);
                }
              };
            })(this);
            return this.boot((function(_this) {
              return function(err) {
                if (err) {
                  return _this._startFail(err, cb);
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
        GUI.prototype.load = function(callback) {

        };

    return GUI;

})(this);
