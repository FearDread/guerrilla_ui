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
  $.Guerrilla = function(){

    return {
      init:function(elem, options){
        this._el = $(elem);

        this._config = $.extend({}, defaults, options);

        this._build();
      },

      _defaults:defaults,

      _build:function(){
        this._el.html('<h1>Incomming guerrilla attacks ... </h1>');

        console.log('init :: ', this._config);
      }
    }
  };
  /* --------------------------------------- *
  * guerrilla JS jQuery $.fn Wrapper         *
  * ---------------------------------------- */
  $.fn.Guerrilla = function(options){
    return this.each(function(){
      if(!$.data(this, 'guerilla')){

        $.data(this, 'guerilla', new $.Guerrilla().init(this, options))

      }else{
        return new $.Guerrilla().init(this, options);
      }
    });
  };

})(jQuery, window, document);
