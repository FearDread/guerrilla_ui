/* Utilities */
$.GUI().create('util', function(GUI){
    var Utils = {
        merge:function(){
            $.extend(arguments);
        },

    }

    return {
        load:function(){
            return Utils;
        },
        unload:function(){
            GUI.log('unload util');
            return true;
        }
    }
});
