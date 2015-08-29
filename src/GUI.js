// New GUI Core Object //
var GUI, config;

GUI = (function() {

    function GUI(sandbox) {
        var error;
        
        this.sandbox = sandbox;

        this._modules = {};
        this._plugins = [];
        this._instances = {};
        this._sandboxes = {};

        // add broker to core object
        this._broker = new Broker(this);

        if (this.sandbox === null || !this.sandbox) {

            if (!utils.isFunc(this.sandbox)) {

                throw new Error('Sandbox must be a function.');
            }

            this.sandbox = function(core, instance, opts, module) {
            
                this.instance = instance;
                this.module = module;
                this.options = (opts) ? opts : {}; 
		
		// attach new sandbox instance
                core._broker.attach(this);

                return this;
            };

	    this.prototype._instance = function(module, opts, callback) {

            };
        }

        /** 
         * Create new module
         *
         *
        **/
        this.prototype.log = {
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
	this.prototype._fail = function(ev, callback) {
            this.log.error(ev);

	    callback(new Error("could not start module: " + ev.message));

	    return this;
        };

        /** 
         * Run all modules with optional options obj 
         *
         *
        **/
	this.prototype._run = function(ev, sandbox, callback) {
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
		              if (util.has(fn, 3)) {
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

	}

        /** 
         * Create new instance and apply to modules and plugins 
         *
         *
        **/
	this.prototype._instance = function(module, opts, callback) {
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

	    Sandbox = (utils.isFunc(opts.sandbox) ? opts.sandbox : this.sandbox;
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
    }

    /* Public Methods */
    /* -------------- */
    return {
        /** 
         * Create new module
         *
         *
        **/
        create: function(module, creator, options) {
	    if (!options || options === null) {
	        options = {};
            }

	    if (!utils.isStr(id) || !utils.isFunc(creator) || !utils.isObj(options) {
	        this.log.error("Unable to create module " + module);
		return this;
	    } 
	    if (module in this._modules) {
	        this.log.warn("Module " + module + " was already created.");
	        return this;
	    }

	    this._modules[module] = {
	        id: module, 
	        creator: creator,
	        options: options,
	    };

	    return this;
        },
       
        /** 
         * Starts module with new sandbox instance 
         *
         *
        **/
        start: function(module, opts, callback) {

        },

        /** 
         * Stops all running instances 
         *
         *
        **/
        stop: function(id, callback) {

        },
        
        /** 
         * Register new plugin 
         *
         *
        **/
        use: function(plugin, opts) {

        },

        /** 
         * Load all available plugins 
         *
         *
        **/
        load: function(callback) {

        }
    };

})(this);
