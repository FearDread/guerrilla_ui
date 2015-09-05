/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: MVC Controller class module     * 
* ---------------------------------------- */
$.GUI().create('Controller', function(G) {
    var Controller;

    Controller = (function() {

      function Controller(model, view) {

          this.model = model;

          this.view = view;
      }

      return Controller;

    })();

    GUI.Model = Model;

    GUI.View = View;

    GUI.Controller = Controller;

    return {
        load: function() {
            G.log('Controller class :: ', Controller);
        },
        unload: function() {}
    };
});
