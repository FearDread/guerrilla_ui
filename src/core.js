/* --------------------------------------- *
* Gurilla JS                               *
* @author: Garrett Haptonstall (FearDread) *
*                                          *
* ---------------------------------------- */
;(function($, window, document, undefined){

  var Guerilla, defaults;

  Guerilla = function(){
    return {};
  };

  $.Guerilla = function(){
    return {
      init:function(elem, options){
        this._el = elem;
        this._defaults = $.extend({}, defaults, options);

        console.log('init :: ', this._defaults);
      },
      _build:{

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
