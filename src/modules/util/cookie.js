/* --------------------------------------- *
* Guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Guerrilla.util.Cookie           *
* ---------------------------------------- */
$.GUI().use(function(G) {

    function _load(api) {

        api.cookie = {

            has:function(cname){
                if (!cname) { 
                    return false; 
                }

                return (

                    new RegExp("(?:^|;\\s*)" + api.Lang.encode(cname).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")

                ).test(document.cookie);
            },

            get: function(cname) {
                if (!cname) { 
                    return null; 
                }

                return api.Lang.decode(document.cookie.replace(

                    new RegExp("(?:(?:^|.*;)\\s*" + api.Lang.encode(cname).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")

                ) || null;
            },

            set: function(cname, cvalue, opts) {
                var params = arguments;

                if (params.length > 1 && !api.utils.isFunc(cval)) {
                    options = api.utils.merge({}, opts); 
              
                    if ((typeof options.expires) === 'number') {
                        var days = options.expires, 
                            time = options.expires = new Date();

                        time.setMilliseconds(
                            time.getMilliseconds() + days * 864e+5
                        );
                    }
                }

                document.cookie = [
                    api.Lang.encode(cname), '=', api.Lang.encode(cvalue),
                    (options.expires) ? '; expires=' + options.expires.toUTCString() : '',
                    (options.path) ? '; path=' + options.path : '', 
                    (options.domain) ? '; domain=' + options.domain : '',
                    (options.secure) ? '; secure=' + options.secure : '' 
                ].join('');

                G.log('set cookie ::', document.cookie);

                return true;
            },
            
            remove: function(cname, cpath, cdomain){
                if (!this.has(cname)) { 
                    return false; 
                }

                document.cookie = api.Lang.encode(cname) +
                    "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
                    (cdomain) ? "; domain=" + cdomain : "" +
                    (cpath) ? "; path=" + cpath : "";

                return true;
            },

            list: function() {
                var index = 0,
                    regex = /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, 
                    keys = document.cookie.replace(regex, '').split(/\s*(?:\=[^;]*)?;\s*/),
                    length = keys.length;

                while(--length){
                    keys[index] = api.Lang.decode(keys[index]); 

                    index++;
                }

                return keys;
            },

            once:function(){
                var values, 
                    params = arguments, 
                    callback = params[0], 
                    argc = params.length, 
                    cname = params[argc - 3],
                    expires = params[argc - 1],
                    glob = (typeof params[argc - 2] === "string");

                if(glob){ 
                    argc++; 
                }

                if(argc < 3){ 
                    throw new TypeError("guerrilla.core.once - not enough arguments"); 

                }else if(!api.utils.isFunc(func)) { 
                    throw new TypeError("guerrilla.core.once - first argument must be a function"); 

                }else if(!cname || /^(?:expires|max\-age|path|domain|secure)$/i.test(cname)){ 
                    throw new TypeError("guerrilla.core.once - invalid identifier");
                }

                if(this.has(cname)){
                    return false;
                }

                values = (argc > 3) ? params[1] : null || (argc > 4) ? [].slice.call(params, 2, argc - 2) : [];

                func.apply(values);

                this.set(cname, 1, expires || 'Fri, 31 Dec 9999', '/', false);

                return true;
            }
        };
    }

    return {
        load: _load
    };
});
