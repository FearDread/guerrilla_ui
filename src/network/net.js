/* --------------------------------------- *
* Gurilla JS                               *
* @author: Garrett Haptonstall (FearDread) *
* @module: Guerrilla.network.Net           *
* @jquery: True                            *
* ---------------------------------------- */
var Net = (function($){

  if(!$){
    throw new TypeError('Missing jQuery');
  }

  this.prototype = {
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
  
  };

  return Object.create(this.prototype);

}).call(jQuery)
