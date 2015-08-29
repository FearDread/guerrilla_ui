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
    }

    return {
        /** 
         * Create new module
         *
         *
        **/
        create: function(id, parent, opts) {

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
