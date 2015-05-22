/* Utilities */

$.GUI().create('Util', function(GUI){
    var proto = {
        merge:function(){
            $.extend(arguments);
        },
        getPxValue:function(width, unit){
            var value;

            switch(unit){
                case "em":
                    value = core.convertToEm(width);
                    break;

                case "pt":
                    value = core.convertToPt(width);
                    break;

                default:
                    value = width;
            }

            return value;
        }
    }
    return {
        load:proto,
        unload:function(){}
    }
});
