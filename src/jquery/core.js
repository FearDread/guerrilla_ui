/* --------------------------------------- *
* guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @license: The MIT License (MIT)          * 
* Copyright (c) 2015 Garrett Haptonstall   *
* ---------------------------------------- */
;(function($, window, document, undefined){
  /* --------------------------------------- *
  * guerrilla JS jQuery Namespace            *
  * ---------------------------------------- */
  $.guerrilla = function(){

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
  * guerrilla JS jQuery $.fn Wrapper         *
  * ---------------------------------------- */
  $.fn.guerrilla = function(options){
    return this.each(function(){
        if(!$.data(this, 'guerilla')){

          $.data(this, 'guerilla', new $.guerrilla().init(this, options))

        }else{
          return new $.guerrilla().init(this, options);
        }
      }
    );
  };

})(jQuery, window, document);
