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

        get_pixels:function(width, unit){
          var value;

          switch(unit){
            case "em":
              value = this.convert_em(width);
              break;

            case "pt":
              value = this.convert_pt(width);
              break;

            default:
              value = width;
          }

          return value;
        },

        get_fontsize:function(elem){
          return parseFloat(
            getComputedStyle(elem || document.documentElement).fontSize;
          );
        },

        convert_em:function(value){
          return value * this.get_fontsize();
        },

        convert_base:function(){
          var pixels, 
              elem = document.documentElement,
              style = elem.getAttribute('style');

          elem.setAttribute('style', style + ';font-size:1em !important');

          base = this.get_fontsize();

          elem.setAttribute('style', style);

          return base;
        },
      
      };

      return Object.create(this.prototype);

    };
  })
);
