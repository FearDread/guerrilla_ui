/* --------------------------------------- *
* Guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @license: The MIT License (MIT)          * 
* Copyright (c) 2015 Garrett Haptonstall   *
* ---------------------------------------- */
;(function($, window, document, undefined){

  var Guerrilla, defaults;
  /* --------------------------------------- *
  * Guerrilla JS Default Config              *
  * ---------------------------------------- */
  defaults = {
    name:'core',
    debug:true,
    jquery:($) ? true : false 
  };
  /* --------------------------------------- *
  * Guerrilla JS Native Library              *
  * ---------------------------------------- */
  Guerrilla = function(options){
    /* config via constructor */
    this._config = this.extend({}, defaults, options);

    /* Private Methods */
    this._methods = {

      /* Cover for $.extend if jQuery not available */
      extend:function(){
        var i, key, 
            params = arguments,
            argc = params.length;

        for(i = 1; i < argc; i++){ 

          for(key in params[i]){
          
            if(params[i].hasOwnProperty(key)){
              params[0][key] = params[i][key];
            }
          }
        }

        return params[0];
      },

    };

    /* Public Methods */
    this.prototype = {

      /* Return private method extend if jQuery $.extend not available */
      extend:function(){
        return this._methods.extend();
      },

      /* Uses guerrilla.util.Cookie library.  */ 
      /* Executes a function only once, even after the refresh of the page. */
      once:function(){
        var params = arguments, 
            callback = params[0], 
            argc = params.length, 
            cname = params[argc - 2],
            glob = (typeof params[argc - 1] === "string");

        if(glob){ 
          argc++; 
        }
        if(argc < 3){ 
          throw new TypeError("Error :: guerrilla.core.once - not enough arguments"); 
        }
        if(typeof func !== "function"){ 
          throw new TypeError("Error :: guerrilla.core.once - first argument must be a function"); 
        }
        if(!cname || /^(?:expires|max\-age|path|domain|secure)$/i.test(cname)){ 
          throw new TypeError("Error :: guerrilla.core.once - invalid identifier");
        }

        if(decodeURIComponent(
          document.cookie.replace(
            new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) === "1"){ 

          return false; 
        }

        values = (argc > 3) ? params[1] : null, (argc > 4) ? [].slice.call(params, 2, argc - 2) : [];

        func.apply(values);

        document.cookie = encodeURIComponent(cname) + "=1; expires=Fri, 31 Dec 9999 23:59:59 GMT" + (glob || !arguments[argc - 1]) ? "; path=/" : "";

        return true;
      },

    };

    return Object.create(this.prototype);
  };

  return window.Guerrilla = Guerrilla;

})(jQuery, window, document);
