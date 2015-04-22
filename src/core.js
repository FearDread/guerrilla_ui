/* --------------------------------------- *
* Gurilla JS                               *
* @author: Garrett Haptonstall (FearDread) *
* Gurilla Namespace Bootstrap              *
* ---------------------------------------- */
;(function($, window, document, undefined){

  var Guerilla, defaults;

  defaults = {
    name:'core',
    debug:true,
    jquery:true
  };

  Guerilla = function(options){
    this._config = $.extend({}, defaults, options);

    return this;
  };

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

