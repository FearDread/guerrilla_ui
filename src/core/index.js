/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI jQuery namespace          * 
* ---------------------------------------- */
;(function($, window, document, undefined){

  $.GUI = function(App, options){

    var Core = new Guerrilla();

    this.prototype = $.extend(Core, App, {
        _super:function(){
            console.log('called _super method');
        },

        broker: new Broker(),

        media: new Media(),

    });

    Core.loadPlugins();

    $.fn.stargaze = function(opts){
      return new Stargaze(this[0], opts).init();
    }

    if(App){
      if(App.load){
        $(window).load(
          App.load.call($.extend(this.prototype, $))
        );
      }

      if(App.ready){
        $(document).ready(
          App.ready.call($.extend(this.prototype, $))
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
