/* --------------------------------------- *
* Guerrilla UI                             *
* @module: MVC View object class           * 
* ---------------------------------------- */
$.GUI().use(function(gui) {
    var View;

    View = (function() {

        function View(model) {

            if (model) {
                this.setModel(model);
            }
        } 

        View.prototype.setModel = function(obj) {
            this.model = obj;

            return this.model.change((function() {

                return this.render();

            }), this);
        };

        View.prototype.render = function() {
            console.log('Render Template :: ', this);
        };

        return View;

    })();

    return {

        load: function(api) {

            api.view = View;
        },
        unload: function() {}
    };
});
