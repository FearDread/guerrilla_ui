/* --------------------------------------- *
* Gurilla JS                               *
* @author: Garrett Haptonstall (FearDread) *
* @module: Network Broker pub / sub lib    *
* ---------------------------------------- */
;(function($, window, document, undefined){
  if(!$.Gurilla.network){
    $.Gurilla.network = {};
  }

  $.Gurilla.network.Broker = function(){
    var event_cache = [];

    return {
      fire = function(evnt){
      
      },

      register = function(evnt, callback){
      
      },

      unregister:function(handle){
      
      }
    }
  };
}).call(jQuery, window, document);
