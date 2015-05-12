/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI jQuery namespace          * 
* ---------------------------------------- */
;(function($, window, document, undefined){

  $.GUI = function(App, options){
    var core = new Guerrilla();

    this.prototype = $.extend(App, core, this, {
        _super:function(){
            console.log('called _super method');
        },

        broker: new Broker(),

        media: new Media(),

        pop: new Pop()
    });

    $.fn.stargaze = function(opts){
      return new Stargaze(this[0], opts).init();
    }

    if(App){
      if(App.load){
        $(window).load(
          App.load.call(this.prototype)
        );
      }

      if(App.ready){
        $(document).ready(
          App.ready.call(this.prototype)
        );
      }
    }
    
    return Object.create(this.prototype);
  };

  $.fn.GUI = function(options){
    return this.each(function(){
      if(!$.data(this, 'guerrilla')){

        $.data(this, 'guerrilla', new $.GUI(this, options));

      }else{

        return new $.GUI(this, options);
      }
    });
  };

})(jQuery, window, document);
