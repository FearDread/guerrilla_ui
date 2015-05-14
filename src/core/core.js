/* Core Object */
var Guerrilla = function(){
    
    return {
        _config:{
            debug:true,
            plugins:[
              'test'
            ]
        },

        _model:{},

        error:function(){
            if(this._config.debug){
                throw new TypeError('Error ::', arguments[0]);
            }
        },

        log:function(){
            var argc = [].slice.call(arguments);

            if(this._config.debug){
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
} 
