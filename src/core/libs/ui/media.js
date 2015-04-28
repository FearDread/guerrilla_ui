/* --------------------------------------- *
* Guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Guerrilla.ui GUI Core           *
* ---------------------------------------- */
(function(factory){

  if(typeof define === 'function' && define.amd){
    define(['guerrilla'], factory);

  }else if(typeof exports === 'object'){
    module.exports = factory(require('guerrilla'));

  }else{
    factory(Guerrilla);
  }

}(function(){

    /* name space */
    Guerrilla.ui = (Guerrilla.ui) ? Guerrilla.ui: {}; 

    /* Defaults */
    var defaults = {
      media:'(max-width:1024)',
      in:function(){

      },
      out:function(){
      
      },
      both:function(){
      
      }
    };

    Guerrilla.ui.media = function(options){
      var _core = new Guerrilla(),
          breaks, query_change, add_listener, matches;

      this._config = _core.extend({}, defaults, options);

      /* Private Methods */
      this._methods = {

        media_change:function(query, options){
          if(query.matches){

            if((typeof options.in) === 'function'){
              options.in(query);
            }
          }else{
          
            if((typeof options.out) === 'function'){
              options.out(query);
            }
          }
          if((typeof options.both) === 'function'){
            return options.both(query);
          }
        }, 

        add_listener:function(options){
          var query = window.matches(options.media),
              query_cb = function(){
                return self.media_change(query, options);
              },
              window_cb = function(){
                var q = window.matches(options.media);

                return self.media_change(q, options);
              };

          query.addListener(query_cb);

          window.addEventListener("orientationchange", window_cb, false);

          return this.query_change(query, options);
        }

      };

      return this._methods.add_listener(options);

    };
  })
);
