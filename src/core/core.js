/* Core Object */
;var Guerrilla = (function($){
    if(typeof jQuery === 'undefined' || typeof $ === 'undefined'){
      console.log('Guerrilla UI Requires jQuery.');
      return;
    }
    var Sandbox = {
        create:function(core, module_selector){ 
            var CONTAINER = $('#' + module_selector);

            return { 
                log:function(){
                    core.log(arguments);
                },
                find:function(selector){
                
                },
                fire:function(evnt){
                  if(core.isObj(evnt) && evnt.type){
                      core.trigger(evnt);
                  }
                },
                listen:function(events){
                    if(core.isObj(events)){
                        core.register(events, module_selector);
                    }
                },
                ignore:function(events){
                    if(core.isArr(events)){
                      core.remove(events, module_selector);
                    }
                }
            }
        }
    },

    Core = (function(){
        var moduleData = {},
            debug = true;
    
        return {
            create:function(module, method){
                var temp;

                if(typeof module === 'string' && typeof method === 'function'){
                    temp = method(Sandbox.create(this, module));

                    if(temp.load && temp.unload && typeof temp.load === 'function'){
                        moduleData[module] = {
                            create:method,
                            instance:null
                        };

                        temp = null;
                    }else{
                        this.log('Missing module :: ', module);
                    }
                }
            },

            start:function(module){
                var mod = moduleData[module];

                if(mod){
                    mod.instance = mod.create(Sandbox.create(this, module));
                    mod.instance.load();
                }
            },

            startAll:function(){
              var module;

              for(module in moduleData){
                  if(moduleData.hasOwnProperty(module)){
                      this.start(module);
                  }
              }
            },

            stop:function(module){
                var data;

                if(data == moduleData[module] && data.instance){
                    data.instance.unload();
                    data.instance = null;
                
                }else{
                    this.log('Stop Failed');
                }
            },

            stopAll:function(){
            
            },

            error:function(){
                if(debug){
                    throw new TypeError('Error ::', arguments[0]);
                }
            },

            log:function(){
                var argc = [].slice.call(arguments);

                if(debug){
                    if(argc.length == 1){
                        console.log('Debug ::', argc[0]);

                    }else if(argc.length == 2){
                        console.log('Debug :: ' + argc[0], argc[1]);
                    }
                }
            },

            loadPlugins:function(){
                this._config.plugins.forEach(function(plugin){
                    $.fn[plugin] = function(opts){
                        return new plugin(this, opts).init();
                    }
                });
            },

            getPixels:function(width, unit){
                var value;

                switch(unit){
                    case "em":
                        value = this.convertToEm(width);
                        break;

                    case "pt":
                        value = this.convertToPt(width);
                        break;

                    default:
                        value = width;
                }

                return value;
            },

            getFontsize:function(elem){
                return parseFloat(
                    getComputedStyle(elem || document.documentElement).fontSize
                );
            },

            convertToEm:function(value){
                return value * this.getFontsize();
            },

            convertBase:function(){
                var pixels, 
                    elem = document.documentElement,
                    style = elem.getAttribute('style');

                elem.setAttribute('style', style + ';font-size:1em !important');

                base = this.get_fontsize();

                elem.setAttribute('style', style);

                return base;
            }
        }
    })(); 

    return Core;

})(jQuery); 
