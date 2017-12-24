/* --------------------------------------- *
* Guerrilla UI                             *
* @module: Basic Router implementation     * 
* ---------------------------------------- */
$.GUI().use(function(gui) {

    function Router() {

        return {
            routes: [],
            mode: null,
            root: '/',

            /**
             * Sets needed properties for the router

             *
             * @param options {object} - the options to apply via router constructor
             * @return {this}
             **/
            config: function(options) {
                this.mode = options && options.mode && options.mode === 'history' && !!(history.pushState) ? 'history' : 'hash';
                this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';

                return this;
            },

            /**
            *
            **/
            getFragment: function() {
                var match, fragment = '';

                if(this.mode === 'history') {
                    fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
                    fragment = fragment.replace(/\?(.*)$/, '');
                    fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;

                } else {
                    match = window.location.href.match(/#(.*)$/);
                    fragment = match ? match[1] : '';
                }
                
                return this.clearSlashes(fragment);
            },

            /**
            *
            **/
            clearSlashes: function(path) {

                return path.toString().replace(/\/$/, '').replace(/^\//, '');
            },

            /**
            *
            **/
            add: function(re, handler) {
                if(utils.isFunc(re)) {
                    handler = re;
                    re = '';
                }

                this.routes.push({ re: re, handler: handler});

                return this;
            },

            /**
            *
            **/
            remove: function(param) {
                var i, route;

                for (i = 0; i < this.routes.length; i++) {
                    route = this.routes[i];

                    if(route.handler === param || route.re.toString() === param.toString()) {
                        this.routes.splice(i, 1); 

                        return this;
                    }
                }

                return this;
            },

            /**
            *
            **/
            flush: function() {
                this.routes = [];
                this.mode = null;
                this.root = '/';

                return this;
            },

            /**
            *
            **/
            check: function(f) {
                var i, match,
                    fragment = f || this.getFragment();

                for(i = 0; i < this.routes.length; i++) {
                    match = fragment.match(this.routes[i].re);

                    if(match) {
                        match.shift();
                        
                        this.routes[i].handler.apply({}, match);

                        return this;
                    }           
                }

                return this;
            },

            listen: function() {
                var self = this,
                    current = self.getFragment(),
                    fn = function() {
                        if(current !== self.getFragment()) {

                            current = self.getFragment();

                            self.check(current);
                        }
                    };

                clearInterval(this.interval);
                this.interval = setInterval(fn, 50);

                return this;
            },

            navigate: function(path) {
                path = path ? path : '';

                if(this.mode === 'history') {

                    history.pushState(null, null, this.root + this.clearSlashes(path));

                } else {

                    window.location.href.match(/#(.*)$/);
                    window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
                }

                return this;
            }
        };
    }

    function _load(api) {
        api.net.router = new Router();
    }

    return {
        load: _load
    };
});
