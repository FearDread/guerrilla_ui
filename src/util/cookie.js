/* --------------------------------------- *
* Guerrilla JS                               *
* @author: Garrett Haptonstall (FearDread) *
* @module: Util library Cookie wrapper     *
* ---------------------------------------- */
Guerrilla.util.Cookie = (function(){

  return {

    encode:function(string){
      return encodeURIComponent(string);
    },

    decode:function(string){
      return decodeURIComponent(string);
    },

    has:function(cname){
      if(!cname){ 
        return false; 
      }

      return (
        new RegExp("(?:^|;\\s*)" + this.encode(cname).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")
      ).test(document.cookie);
    },

    get:function(cname){
       if(!cname){ 
         return null; 
       }

       return this.decode(document.cookie.replace(

           new RegExp("(?:(?:^|.*;)\\s*" + this.encode(cname).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"

         ), "$1")) || null;
    },

    set:function(cname, cvalue, expires, cdomain, is_secure){
      if(!cname || /^(?:expires|max\-age|path|domain|secure)$/i.test(cname)){
        return false; 
      }

      if(expires){
        switch(expires.constructor){
          case Number:
            expires = expires === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            expires = "; expires=" + expires;
            break;
          case Date:
            expires = "; expires=" + expires.toUTCString();
            break;
        }
      }

      document.cookie = this.encode(cname) + "=" + this.encode(cvalue) + expires 
      + (cdomain) ? "; domain=" + cdomain : "" 
      + (sPath) ? "; path=" + sPath : ""
      + (is_secure) ? "; secure" : "";

      return true;
    },
    
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
    }

  }

}).call(this);
