/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: MVC View class module           * 
* ---------------------------------------- */
$.GUI().create('View', function(G) {
    var View;

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
              G.log('Render method called in View.');
          };
      }

      return View;

    })();

    return {
        load: function() {
            G.log('View class :: ', View);
        },
        unload: function() {}
    };

});
