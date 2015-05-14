/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI jQuery namespace          * 
* ---------------------------------------- */
;(function($, undefined){

    $.GUI = function(){
        var core = new Guerrilla(),
            argc = [].slice.call(arguments),
            sandbox = (argc[0] instanceof Object) ? argc[0] : null;

        this.prototype = $.extend(sandbox, core, {
            _super:function(){
              this.log('_super()');
              return false;
            },

            broker: new Broker(),

            media: new Media(),

            pop: new Pop()
        });

        $.fn.stargaze = function(opts){
          return new Stargaze(this[0], opts).init();
        }

        if(sandbox){

          if(sandbox.load){
            $(window).load(
              sandbox.load.call(this.prototype)
            );
          }

          if(sandbox.dom){
            $(document).ready(
              sandbox.dom.call(this.prototype)
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

})(jQuery);
