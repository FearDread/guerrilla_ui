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
    jquery:true
  };
  /* --------------------------------------- *
  * Guerrilla JS Native Library              *
  * ---------------------------------------- */
  Guerrilla = function(options){
    this._config = $.extend({}, defaults, options);

    this.prototype = {
      /* Uses guerrilla.util.Cookie library.  */ 
      /* Executes a function only once, even after the refresh of the page. */
      once:function(){
        var func = arguments[0], 
            argc = arguments.length, 
            cname = arguments[argc - 2],
            glob = (typeof arguments[argc - 1] === "string");

        if(glob){ 
          argc++; 
        }
        if(argc < 3){ 
          throw new TypeError("Error :: Guerrilla.once - not enough arguments"); 
        }
        if(typeof func !== "function"){ 
          throw new TypeError("Error :: Guerrilla.once - first argument must be a function"); 
        }
        if(!cname || /^(?:expires|max\-age|path|domain|secure)$/i.test(cname)){ 
          throw new TypeError("Error :: Guerrilla.once - invalid identifier");
        }

        if(decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) === "1"){ 
          return false; 
        }

        func.apply((argc > 3) ? arguments[1] : null, (argc > 4) ? [].slice.call(arguments, 2, argc - 2) : []);

        document.cookie = encodeURIComponent(cname) + "=1; expires=Fri, 31 Dec 9999 23:59:59 GMT" + (glob || !arguments[argc - 1]) ? "; path=/" : "";

        return true;
      }
    };

    return Object.create(this.prototype);
  };

  Guerrilla.prototype.once = function(){
  };
  /* --------------------------------------- *
  * Guerrilla JS jQuery Namespace            *
  * ---------------------------------------- */
  $.Guerrilla = function(){

    return {
      init:function(elem, options){
        this._el = $(elem);

        this._defaults = $.extend({}, defaults, options);

        this._build();
      },
      _defaults:defaults,
      _build:function(){
        console.log('init :: ', this._defaults);
        this._el.html('<h1>Incomming guerrilla attacks ... </h1>');
      }
    };
  };
  /* --------------------------------------- *
  * Guerrilla JS jQuery $.fn Wrapper         *
  * ---------------------------------------- */
  $.fn.Guerrilla = function(options){
    return this.each(function(){
        if(!$.data(this, 'guerilla')){

          $.data(this, 'guerilla', new $.Guerrilla().init(this, options))

        }else{
          return new $.Guerrilla().init(this, options);
        }
      }
    );
  };

  return window.Guerrilla = Guerrilla;

})(jQuery, window, document);
