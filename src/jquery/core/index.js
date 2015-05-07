/* --------------------------------------- *
* guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.Guerrilla jQuery namespace    * 
* ---------------------------------------- */
;(function($, window, document, undefined){
  var defaults = {};
  /* --------------------------------------- *
  * guerrilla JS jQuery Namespace            *
  * ---------------------------------------- */
  $.Guerrilla = function(context, options){
    this._config = $.extend({}, defaults, options);
    console.log('init guerrilla namespace ... ');

    this.prototype = {
      log:function(msg){
        if(this._config.debug){
          console.log('Debug ::', msg);
        }
      },

      error:function(msg){
        if(this._config.debug){
          throw new TypeError('Error ::', msg);
        }
      },
    
    };

    this.plugin = {
      init:function(elem, opts){
        this._el = $(elem);

        this._build();
      },
      _defaults:defaults,
      _build:function(){
        this._el.html('<h1>Incomming guerrilla attacks ... </h1>');

        console.log('init :: ', this._defaults);
      }
    };

    return this.plugin.init(context, options);
  };
  /* --------------------------------------- *
  * guerrilla JS jQuery $.fn Wrapper         *
  * ---------------------------------------- */
  $.fn.Guerrilla = function(options){
    return this.each(function(){
      if(!$.data(this, 'guerilla')){

        $.data(this, 'guerilla', new $.Guerrilla(this, options));

      }else{
        return new $.Guerrilla(this, options);
      }
    });
  };

})(jQuery, window, document);
