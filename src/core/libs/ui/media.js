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
  var defaults;
    /* name space */
    Guerrilla.ui = (Guerrilla.ui) ? Guerrilla.ui: {}; 

    /* stored media query */
    window.media_matches;

    /* Defaults */
    defaults = {
      media:'(max-width:1024)',
      in:null,
      out:null,
      both:null,
    };

    Guerrilla.ui.media = function(options){
      var self = this,
          _core = new Guerrilla(),
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

        get_pixels:function(width, unit){
          var value;

          switch(unit){
            case "em":
              value = this.convert_fontsize(width);
              break;

            default:
              value = width;
          }

          return value;
        },

        covert_fontsize:function(value){
          var px, elem = document.createElement('div');

          elem.style.width = '1em';
          elem.style.position = 'absolute';

          document.body.appendChild(elem);

          px = value * elem.offsetWidth;

          document.body.removeChild(elem);

          return px;
        },

        add_listener:function(options){
          var self = this,
              query = window.media_matches(options.media),
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
        },

        media_listener:function(){
          var matches, media, medias, parts, _i, _len;

          medias = options.media.split(/\sand\s|,\s/);
          matches = true;

          for(_i = 0, _len = medias.length; _i < _len; i++){
            media = medias[_i];
            parts = media.match(/\((.*?)-(.*?):\s([\d\/]*)(\w*)\)/);

            if (!checkQuery(parts)) {
              matches = false;
            }
          }

          var opts = {media:options.media, matches:matches};
          return this.media_change(opts);
        }

      };

      return function(){
        if(window.media_matches){
          return self._methods.add_listener();
        
        }else{
          if(window.addEventListener){
            window.addEventListener("resize", self._methods.media_listener);
          }else{
            if(window.attachEvent){
              window.attachEvent("onresize", self._methods.media_listener);
            }
          }

          return self._methods.media_listener();
        }
      };
    };
  })
);
