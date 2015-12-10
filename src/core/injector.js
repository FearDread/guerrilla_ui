

/* jshint ignore:start*/
var Injector, funcRegx = /^function\s*[^\(]*\(\s*([^\)]*)\)/; 

Injector = {
    /* Injector dependencies */
    dependencies: {},

    /* register new dependency to apply to sandbox */
    register: function (key, value) {
        this.dependencies[key] = value;
    },

    /* resolve each dependency and apply to sandbox */
    resolve: function () {
        var $this = this, func, deps, scope, args = []; 

        if(typeof arguments[0] === 'string') {
            deps = arguments[0].replace(/ /g, '').split(',');
            func = arguments[1];
            scope = arguments[2] || {};

        } else {
            func = arguments[0];
            deps = func.toString().match(funcRegx)[1].replace(/ /g, '').split(',');
            scope = arguments[1] || {};
        }

        return function() {
            var argc, dep;

            argc = Array.prototype.slice.call(arguments, 0);

            for(var i=0; i<deps.length; i++) {
                dep = deps[i];
                args.push($this.dependencies[dep] && dep != '' ? $this.dependencies[dep] : argc.shift());
            }

            func.apply(scope || {}, args);
        } 
    }
};
