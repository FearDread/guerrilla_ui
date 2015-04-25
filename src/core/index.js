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
    /* Private Methods */
    this._methods = {
      /* Small console.log wrapper */
      log:function(msg){
        if(this._config.debug){
          console.log('Debug ::', msg);
        }
      },

      /* Small Throw wrapper */
      error:function(msg){
        if(this._config.debug){
          throw new TypeError('Error ::', msg);
        }
      },

      /* Cover for $.extend if jQuery not available */
      extend:function(){
        var i, key, 
            params = arguments,
            argc = params.length;

        if(argc === 0){
          this.error('Guerrilla.core.extend - missing arguments.');
        }
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
        var values, 
            params = arguments, 
            callback = params[0], 
            argc = params.length, 
            cname = params[argc - 2],
            glob = (typeof params[argc - 1] === "string");

        var gjs_cookie = new guerrilla.util.Cookie();

        if(glob){ 
          argc++; 
        }

        if(argc < 3){ 
          this.log("guerrilla.core.once - not enough arguments"); 
          return false;

        }else if(typeof func !== "function"){ 
          this.log("guerrilla.core.once - first argument must be a function"); 
          return false;

        }else if(!cname || /^(?:expires|max\-age|path|domain|secure)$/i.test(cname)){ 
          this.log("guerrilla.core.once - invalid identifier");
          return false;
        }

        if(gjs_cookie.has(cname)){
          return false;
        }

        values = (argc > 3) ? params[1] : null, (argc > 4) ? [].slice.call(params, 2, argc - 2) : [];

        func.apply(values);

        gjs_cookie.set(cname, 1, 'Fri, 31 Dec 9999', '/', false);

        return true;
      },

    };
    /* config via constructor */
    this._config = this._methods.extend({}, defaults, options);

    return Object.create(this.prototype);
  };

  return window.Guerrilla = Guerrilla;

})(jQuery, window, document);
