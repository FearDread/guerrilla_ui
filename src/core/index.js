/* --------------------------------------- *
* guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.Guerrilla jQuery namespace    * 
* ---------------------------------------- */
;(function($, window, document, undefined){
  var _core = {
    _config:{
      debug:true,
    },

    _model:{},

    log:function(){
      var args = arguments;
      if(this._config.debug){
        if(args.length == 1){
          console.log('Debug ::', args[0]);
        }else if(args.length == 2){
          console.log('Debug :: ' + args[0], args[1]);
        }
      }
    },

    error:function(msg){
      if(this._config.debug){
        throw new TypeError('Error ::', msg);
      }
    },
  
  };
  /* --------------------------------------- *
  * guerrilla JS jQuery Namespace            *
  * ---------------------------------------- */
  $.GUI = function(app){
    console.log('init gui :: ', app);

    this.prototype = $.extend(_core, app);

    this.prototype.broker = new Broker();

    if(app){
      if(app.load){
        $(window).load(
          app.load.call(this.prototype)
        );
      }

      if(app.ready){
        $(document).ready(
          app.load.call(this.prototype)
        );
      }
    }
    
    return Object.create(this.prototype);
  };
  /* --------------------------------------- *
  * guerrilla JS jQuery $.fn Wrapper         *
  * ---------------------------------------- */
  $.fn.GUI = function(opts){
    return this.each(function(){
      if(!$.data(this, 'guerrilla')){

        $.data(this, 'guerrilla', new $.GUI(this));

      }else{

        return new $.GUI(this);
      }
    });
  };

})(jQuery, window, document);
