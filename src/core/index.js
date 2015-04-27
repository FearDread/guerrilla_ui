/* --------------------------------------- *
* Guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @license: The MIT License (MIT)          * 
* Copyright (c) 2015 Garrett Haptonstall   *
* ---------------------------------------- */
;(function($, window, document, undefined){

  var Guerrilla, defaults;
  /* --------------------------------------- *
  * Guerrilla JS Default Config              *
  * ---------------------------------------- */
  defaults = {
    name:'core',
    debug:true,
    jquery:($) ? true : false 
  };
  /* --------------------------------------- *
  * Guerrilla JS Native Library              *
  * ---------------------------------------- */
  Guerrilla = function(options){
    /* Private Methods */
    this._methods = {
      /* Small console.log wrapper */
      log:function(msg){
        if(this._config.debug){
          console.log('Debug ::', msg);
        }
      },

      /* Small Throw wrapper */
      error:function(msg){
        if(this._config.debug){
          throw new TypeError('Error ::', msg);
        }
      },

      /* Cover for $.extend if jQuery not available */
      extend:function(){
        var i, key, 
            params = arguments,
            argc = params.length;

        if(argc === 0){
          this.error('Guerrilla.core.extend - missing arguments.');
        }
        for(i = 1; i < argc; i++){ 

          for(key in params[i]){
          
            if(params[i].hasOwnProperty(key)){
              params[0][key] = params[i][key];
            }
          }
        }

        return params[0];
      },

    };
    /* config via constructor */
    this._config = this._methods.extend({}, defaults, options);

    return {
      extend:function(){
        return this.extend();
      },
    
    }
  };

  return window.Guerrilla = Guerrilla;

})(jQuery, window, document);
