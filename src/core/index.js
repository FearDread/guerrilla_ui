/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI jQuery namespace          * 
* ---------------------------------------- */
;(function($){

    $.GUI = function(){
        var core = Guerrilla,
            argc = [].slice.call(arguments),
            app = (argc[0] instanceof Object) ? argc[0] : null;

        this.prototype = $.extend(app, core, {
            _loaded:false,
            _super:function(){
                this.log('_super()');

                if(!this._loaded){

                    core.startAll();
                    this._loaded = true;
                }else{

                    return true;
                }

              return false;
            },
            broker: new Broker(),

            //media: new Media(),

            pop: new Pop()

        });

        $.fn.stargaze = function(opts){
          return new Stargaze(this[0], opts).init();
        }

        if(app){

          if(app.load){
            $(window).load(
              app.load.call(this.prototype)
            );
          }

          if(app.dom){
            $(document).ready(
              app.dom.call(this.prototype)
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
