/* --------------------------------------- *
* Gurilla JS                               *
* @author: Garrett Haptonstall (FearDread) *
* @license: The MIT License (MIT)           * 
* Copyright (c) 2015 Garrett Haptonstall   *
* ---------------------------------------- */
;(function($, window, document, undefined){

  var Guerilla, defaults;
  /* --------------------------------------- *
  * Gurilla JS Default Config                *
  * ---------------------------------------- */
  defaults = {
    name:'core',
    debug:true,
    jquery:true
  };
  /* --------------------------------------- *
  * Gurilla JS Native Library                *
  * ---------------------------------------- */
  Guerilla = function(options){
    this._config = $.extend({}, defaults, options);

    return this;
  };
  /* --------------------------------------- *
  * Gurilla JS jQuery Namespace              *
  * ---------------------------------------- */
  $.Guerilla = function(){

    return {
      init:function(elem, options){
        this._el = elem;
        this._defaults = $.extend({}, defaults, options);

        console.log('init :: ', this._defaults);
      },
      _defaults:defaults,
      _build:function(){

      }
    };
  };
  /* --------------------------------------- *
  * Gurilla JS jQuery $.fn Wrapper           *
  * ---------------------------------------- */
  $.fn.Guerilla = function(options){
    return this.each(function(){
        if(!$.data(this, 'guerilla')){
          $.data(this, 'guerilla', new $.Guerilla().init(this, options))
        }
      }
    );
  };

  return window.Guerilla = Guerilla;

})(jQuery, window, document);

