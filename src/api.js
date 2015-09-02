/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: $.GUI jQuery namespace          * 
* ---------------------------------------- */
;(function($){
    var api = {
        version: '0.0.1',
        GUI: GUI,
        modules: []
    };

    $.GUI = function() {
        var argc = [].slice.call(arguments),
            sandbox = (argc[0] instanceof Object) ? argc[0] : null,
            proto = new GUI(sandbox);

        return proto;
        // return Object.create(proto);
    };

    $.fn.GUI = function(options){
        return this.each(function(){
            if(!$.data(this, 'guerrilla')){

                $.data(this, 'guerrilla', new $.GUI().create(this, options));
            }else{
                return new $.GUI().create(this, options);
            }
        });
    };

})(jQuery);
