/* --------------------------------------- *
* Guerrilla UI                             *
* @module: $.GUI jQuery namespace          * 
* ---------------------------------------- */
;(function($) {
    var $G;

    $G = new GUI();

    $.GUI = function() {
        var argc = [].slice.call(arguments),
            options = argc[0] || null;
            app = $G;

        if (options && options !== null) {

            if (utils.isArr(options)) {

                app.injector.register(arguments);

            } else if (utils.isObj(options)) {
                
                app.configure(options);
            }
        }

        return app;
    };

    $.fn.GUI = function(options) {
        return this.each(function() {
            if (!$.data(this, 'guerrilla')) {

                $.data(this, 'guerrilla', new $.GUI().create(this, options));
            } else {
                return new $.GUI().create(this, options);
            }
        });
    };

})(jQuery);
