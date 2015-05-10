/* --------------------------------------- *
* Guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Guerrilla.ui GUI Core           *
* ---------------------------------------- */
(function(factory){

  if(typeof define === 'function' && define.amd){
    define(['guerrilla'], factory);

  }else if(typeof exports === 'object'){
    module.exports = factory(require('guerrilla'));

  }else{
    factory(Guerrilla);
  }

}(function(){
  var defaults = {

    };

    Guerrilla.ui = (Guerrilla.ui) ? Guerrilla.ui: {}; 

    Guerrilla.ui.gui = function(options){
      var _core = new Guerrilla();

      this._config = _core.extend({}, defaults, options);

      this.prototype = {

      
      };

      return Object.create(this.prototype);

    };
  })
);

(function ($, window) {
	$.fn.constellation = function (options) {
		return this.each(function () {
			var c = new Constellation(this, options);
			c.init();
		});
	};
})($, window);

if($(window).width() < 700){
	$('canvas').constellation({
		distance: 40
	});
}else{
	$('canvas').constellation();
}
