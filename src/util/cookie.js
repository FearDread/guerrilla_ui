/* --------------------------------------- *
* Guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Guerrilla.util.Cookie           *
* ---------------------------------------- */
if(!Guerrilla.util){
  Guerrilla.util = {};
}
(function(factory){

  if(typeof define === 'function' && define.amd){
    define(['guerrilla'], factory);

  }else if(typeof exports === 'object'){
    module.exports = factory(require('guerrilla'));

  }else{
    factory(Guerrilla);
  }

}(function(){

    Guerrilla.util.cookie = function(){

      this._config = {};

      /* public API methids */
      this.prototype = {

        /* Takes a string and returns URI encoded string */
        encode:function(string){
          return encodeURIComponent(string);
        },

        /* Takes a string and returns URI decoded string */
        decode:function(string){
          return decodeURIComponent(string);
        },

        /* Check for existing cookie with key "cname" */
        has:function(cname){
          if(!cname){ 
            return false; 
          }

          return (

            new RegExp("(?:^|;\\s*)" + this.encode(cname).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")

          ).test(document.cookie);
        },

        /* return cookie with key "cname" */ 
        get:function(cname){
          if(!cname){ 
            return null; 
          }

          return this.decode(document.cookie.replace(

            new RegExp("(?:(?:^|.*;)\\s*" + this.encode(cname).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")

          ) || null;
        },

        /* create new cookie string and attach to document.cookie with key "cname" */
        set:function(cname, cvalue, copts){
          var core = new Guerrilla(), 
              params = arguments;

          console.log('core = ', core);
          if(params.length > 1 && (typeof cvalue) !== 'function'){
            options = core.extend({}, this._config, copts); 
          
          }

          return true;
        },
        
        /* remove (delete) cookie with key "cname", path "cpath" and domain "cdomain" */
        remove:function(cname, cpath, cdomain){
          if(!this.has(cname)){ 
            return false; 
          }

          document.cookie = this.encode(cname) 
          + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" 
          + (cdomain) ? "; domain=" + cdomain : "" 
          + (cpath) ? "; path=" + cpath : "";

          return true;
        },

        /* return a list of all strings attached to document.cookie */
        list:function(){
          var index = 0,
              regex = /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, 
              keys = document.cookie.replace(regex, '').split(/\s*(?:\=[^;]*)?;\s*/),
              length = keys.length;

          while(length--){
            keys[index] = this.decode(keys[index]); 

            index++;
          }

          return keys;
        },

        /* Executes a function only once, even after the refresh of the page. */
        once:function(){
          var values, 
              params = arguments, 
              callback = params[0], 
              argc = params.length, 
              cname = params[argc - 3],
              expires = params[argc - 1],
              glob = (typeof params[argc - 2] === "string");

          if(glob){ 
            argc++; 
          }

          if(argc < 3){ 
            throw new TypeError("guerrilla.core.once - not enough arguments"); 

          }else if(typeof func !== "function"){ 
            throw new TypeError("guerrilla.core.once - first argument must be a function"); 

          }else if(!cname || /^(?:expires|max\-age|path|domain|secure)$/i.test(cname)){ 
            throw new TypeError("guerrilla.core.once - invalid identifier");
          }

          if(this.has(cname)){
            return false;
          }

          values = (argc > 3) ? params[1] : null, (argc > 4) ? [].slice.call(params, 2, argc - 2) : [];

          func.apply(values);

          this.set(cname, 1, expires || 'Fri, 31 Dec 9999', '/', false);

          return true;
        }

      };

      return Object.create(this.prototype);

    };
  })
);
