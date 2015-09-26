/* --------------------------------------- *
* Guerrilla JS                             *
* @module: Dynamic media query callbacks   *
* ---------------------------------------- */
$.GUI().use(function(G) {

    return {
        
        load: function(api) {
            var Media;

            Media = function(options) {
                var _this = this.prototype, breaks, change, listen, matches, prototype,
                    hasMatch = window.mediaMatches !== undefined && !!window.mediaMatches('!').listen;

                api.log('Media options = ', options);

                prototype = {

                    /**
                     * Event handler that checks and fires callbacks based on passed media query 
                     *
                     * @param query {string} - the media query to execute on
                     * @param options {object} - options object with media callbacks 
                     * @return {function} - execute callbacks 
                    **/
                    change: function(query, options) {
                        if (query.matches) {

                            if (api.utils.isFunc(options.in)) {
                                options.in(query);
                            }
                        } else {
                    
                            if (api.utils.isFunc(options.out)) {
                                options.out(query);
                            }
                        }

                        if (api.utils.isFunc(options.both)) {
                            return options.both(query);
                        }
                    }, 

                    /**
                     * Add media listener to query and window orientation events 
                     *
                     * @param options {object} - options object with media queries 
                     * @return {function} - execute change event 
                    **/
                    listen: function(options) {
                        var query, query_cb, window_cb;

                        query = window.mediaMatches(options.media);

                        query_cb = function() {
                            return _this.change(query, options);
                        };

                        window_cb = function() {
                            return _this.change(window.matches(options.media), options);
                        };

                        query.addListener(query_cb);

                        window.addEventListener("orientationchange", window_cb, false);

                        return this.change(query, options);
                    },

                    /**
                     * Check media query parts dimentions and height / width 
                     *
                     * @param parts {object} the media query object to check 
                     * @return {string} - matched query string 
                    **/
                    check: function(parts) {
                        var constraint, dimension, matches, ratio, value, windowHeight, windowWidth;

                        constraint = parts[1];
                        dimension = parts[2];

                        if (parts[4]) {

                            value = api.utils.getPxValue(parseInt(parts[3], 10), parts[4]); 

                        } else {
                            value = parts[3];
                        }

                        windowWidth = window.innerWidth || document.documentElement.clientWidth;
                        windowHeight = window.innerHeight || document.documentElement.clientHeight;

                        if (dimension === 'width') {

                            matches = constraint === "max" && value > windowWidth || constraint === "min" && value < windowWidth;

                        } else if (dimension === 'height') {

                            matches = constraint === "max" && value > windowHeight || constraint === "min" && value < windowHeight;
                        } else if (dimension === 'aspect-ratio') {
                            ratio = windowWidth / windowHeight;
                            // matches = constraint === "max" && JSON.parse(ratio) < JSON.parse(value) || constraint === "min" && JSON.parse(ratio) > JSON.parse(value);
                            matches = constraint === "max" && JSON.parse(ratio) < JSON.parse(value) || constraint === "min" && JSON.parse(ratio) > JSON.parse(value);
                        }

                        return matches;
                    },

                    /**
                     * Attach event listener for changes in media / screen size 
                     *
                     * @return {object} - the added event object via change method 
                    **/
                    mediaListener: function() {
                        var opts, matches, media, medias, parts, _i, _len;

                        medias = (options.media) ? options.media.split(/\sand\s|,\s/) : null;

                        if (medias) {
                            matches = true;

                            for (_i = 0, _len = medias.length; _i < _len; _i++) {
                                media = medias[_i];
                                parts = media.match(/\((.*?)-(.*?):\s([\d\/]*)(\w*)\)/);

                                if (!this.check(parts)) {
                                    matches = false;
                                }
                            }

                            opts = {media: options.media, matches: matches};

                            return this.change(opts, options);
                        }
                    }
                };

                /* Return all needed event listeners */
                return function() {

                    if (window.mediaMatches) {

                        return prototype.listen();
                    
                    } else {
                        if (window.addEventListener) {
                            window.addEventListener("resize", prototype.mediaListener);

                        } else {

                            if (window.attachEvent) {
                                window.attachEvent("onresize", prototype.mediaListener);
                            }
                        }

                        return prototype.mediaListener();
                    }
                };
            };

            api.Media = Media;
        }
    };
});
