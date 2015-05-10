/* Core Object */
var Guerrilla = {
  _config:{
    debug:true,
  },

  _model:{},

  error:function(){
    if(this._config.debug){
      throw new TypeError('Error ::', arguments[0]);
    }
  },

  log:function(){
    if(this._config.debug){

      if(arguments.length == 1){
        console.log('Debug ::', arguments[0]);

      }else if(arguments.length == 2){

        console.log('Debug :: ' + arguments[0], arguments[1]);
      }
    }
  },

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
      getComputedStyle(elem || document.documentElement).fontSize
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
  }

}
