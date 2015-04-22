/* --------------------------------------- *
* Gurilla JS                               *
* @author: Garrett Haptonstall (FearDread) *
* @module: Network library $.AJAX exension *
* ---------------------------------------- */
;(function($){
  if(!$.Gurilla.network){
    $.Gurilla.network = {};
  }

  $.Gurilla.network.Net = function(){
    return {
      post:function(opts){
      
      },

      get:function(opts){
      
      },

      put:function(opts){
      
      },

      script:function(opts){
        $.ajax({
          url:opts.url,
          dataType:'script',
          success:(opts.callback) ? opts.callback : function(result){
            console.log('Debug :: Script Loaded :: ', result);
          }
        });
      },

      delete:function(opts){
      
      }
    }
  };
}).call(jQuery);
