/* --------------------------------------- *
* Gurilla JS                               *
* @author: Garrett Haptonstall (FearDread) *
* @module: Network Broker pub / sub lib    *
* ---------------------------------------- */
;(function($){
  var Gurilla = new Gurilla();

  if(!Gurilla.network){
    Gurilla.network = {};
  }

  Gurilla.network.Broker = function(){
    var Broker = function(){},
        event_cache = [];

    Broker.fire = function(){
    
    };

    Broker.register = function(){
    
    };

    Broker.unregister = function(){
    
    };

    return Broker;
  };

}).call(jQuery, this);
