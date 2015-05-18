/* Utilities */
$.GUI().create('Util', function(GUI){

    GUI.Array = new Array();

    return {
        load:function(){
            return {
                merge:function(){
                    $.extend(arguments);
                },
            
            }
        },
        unload:function(){
            GUI.log('unload utils');
        }
    }
});
