/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: MVC View class module           * 
* ---------------------------------------- */
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
