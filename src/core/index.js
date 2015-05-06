/* --------------------------------------- * 
* * Guerrilla JS                           *
* @author: Garrett Haptonstall (FearDread) *
* @license: The MIT License (MIT)          * 
* Copyright (c) 2015 Garrett Haptonstall   *
* ---------------------------------------- */
;(function($, window, document, undefined){
  if((typeof $) == 'undefined' || (typeof jQuery) == 'undefined'){
    console.log('Error :: Guerrilla JS Library requires jQuery');
    return;
  }

  var Guerrilla,
      defaults = {
        name:'core',
        debug:true,
        jquery:($) ? true : false 
      };

  /* --------------------------------------- *
  * Guerrilla JS Native Library              *
  * ---------------------------------------- */
  Guerrilla = function(options){

    this.prototype = {

      log:function(msg){
        if(this._config.debug){
          console.log('Debug ::', msg);
        }
      },

      error:function(msg){
        if(this._config.debug){
          throw new TypeError('Error ::', msg);
        }
      },

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

    this._config = this.prototype.extend({}, defaults, options);

    return Object.create(this.prototype); 
  };

  return window.Guerrilla = Guerrilla;

})(jQuery, window, document);
