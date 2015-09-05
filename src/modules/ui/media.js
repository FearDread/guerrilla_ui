/* --------------------------------------- *
* Guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Guerrilla.ui GUI Core           *
* ---------------------------------------- */
$.GUI().create('Media', function(G){

    var Media = function(options){
        var self = this,
            breaks, media_change, add_listener, matches,
            hasMatch = GUI.win.media_matches !== undefined && !!GUI.win.media_matches('!').add_listener,

        proto = {

            media_change:function(query, options){
                if(query.matches){

                    if((typeof options.in) === 'function'){
                        options.in(query);
                    }
                }else{
            
                    if((typeof options.out) === 'function'){
                        options.out(query);
                    }
                }

                if((typeof options.both) === 'function'){

                    return options.both(query);
                }
            }, 

            add_listener:function(options){
                var self = this,
                    query = GUI.win.media_matches(options.media),
                    query_cb = function(){
                        return proto.media_change(query, options);
                    },
                    window_cb = function(){
                        var q = GUI.win.matches(options.media);

                        return proto.media_change(q, options);
                    };

                query.addListener(query_cb);

                GUI.win.addEventListener("orientationchange", window_cb, false);

                return proto.media_change(query, options);
            },

            check_query:function(parts){
                var constraint, dimension, matches, ratio, value, windowHeight, windowWidth;

                constraint = parts[1];
                dimension = parts[2];

                if(parts[4]){
                    value = GUI.Util.getPxValue(parseInt(parts[3], 10), parts[4]); 

                }else{
                    value = parts[3];
                }

                windowWidth = window.innerWidth || GUI.docElem.clientWidth;
                windowHeight = window.innerHeight || GUI.docElem.clientHeight;

                if(dimension === 'width'){
                    matches = constraint === "max" && value > windowWidth || constraint === "min" && value < windowWidth;

                }else if(dimension === 'height'){
                    matches = constraint === "max" && value > windowHeight || constraint === "min" && value < windowHeight;

                }else if(dimension === 'aspect-ratio'){
                    ratio = windowWidth / windowHeight;

                    matches = constraint === "max" && eval(ratio) < eval(value) || constraint === "min" && eval(ratio) > eval(value);
                }

                return matches;
            },

            media_listener:function(){
                var opts, matches, media, medias, parts, _i, _len;

                medias = (options.media) ? options.media.split(/\sand\s|,\s/) : null;

                if(medias){
                    matches = true;

                    for(_i = 0, _len = medias.length; _i < _len; _i++){
                        media = medias[_i];
                        parts = media.match(/\((.*?)-(.*?):\s([\d\/]*)(\w*)\)/);

                        if (!proto.check_query(parts)) {
                            matches = false;
                        }
                    }

                    opts = {media:options.media, matches:matches};

                    return proto.media_change(opts, options);
                }
            }
        };

        return function(){
            options = arguments[0] || {};

            if(GUI.win.media_matches){
                return proto.add_listener();
            
            }else{
                if(GUI.win.addEventListener){
                    GUI.win.addEventListener("resize", proto.media_listener);

                }else{

                    if(GUI.win.attachEvent){
                        GUI.win.attachEvent("onresize", proto.media_listener);
                    }
                }

                return proto.media_listener();
            }
        };
    };
  
    return {
        load: function() {
            var argc = arguments[0];

            return new Media(argc);
        },
        unload: function() {
            G.cleanup();
        }
    };
});
