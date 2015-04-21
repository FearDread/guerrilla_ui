/* --------------------------------------- *
* Gurilla JS                               *
* @author: Garrett Haptonstall (FearDread) *
*                                          *
* ---------------------------------------- */
;(function($, window, undefined){
  var Gurilla = {
    init:function(opts, elem){
      this.defaults = $.extend({}, this.defaults, opts);

      this.elem = elem;
      this.$elem = $(elem);

      this._build();
    
      return this;
    },
    defaults:{
      debug:true,
      config:{},
      modules:['gui','network'],
    },
    _build:function(){
    
      this.$elem.html();
    },
    _methods:{
    
    },
  };

  /* Public Methods */
  Gurilla.prototype = {
    loadModule:function(module){
      this.modules.each(function(mod){
      
      });
    }
  };

  if(typeof Object.create !== 'function'){
    Object.create = function(obj){
      function func(){}

      func.prototype = obj;

      return new func();
    };
  }

  $.fn.Gurilla = function(options){
    if(this.length){
      return this.each(function(){
        var Gurilla = Object.create(Gurilla);

        Gurilla.init(options, this); 
  
        $.data(this, 'gurilla', Gurilla);
      });
    }
  };

})(jQuery, window);
