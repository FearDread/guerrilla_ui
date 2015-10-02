/* --------------------------------------- *
* Guerrilla UI                             *
* @module: MVC View object class           * 
* ---------------------------------------- */
$.GUI().use(function(gui) {
    var plugin, View;

    View = (function() {

        function View(model) {

            if (model) {
                return this.setModel(model);
            }
      
            this.setModel = function(obj) {
                this.model = obj;

                return this.model.change((function() {

                    return this.render();

                }), this);
            };

            this.render = function() {
                console.log('Render method called in View.');
            };
        }

        return View;

    })();

    return {

        load: function(api) {

            api.view = new View();
        },
        unload: function() {}
    };
});
