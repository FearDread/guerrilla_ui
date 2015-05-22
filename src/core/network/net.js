/* Net module with ajax helper functions */
/* step: stores all returned ajax data in Model Class */
$.GUI().create('Net', function(GUI){

    var Model = GUI.Model,
        Net = {

        post:function(){

        },

        get:function(){
        
        },

        put:function(){
        
        },

        del:function(){
        
        },

        script:function(){
        
        }
    };

    function _unload(){
        GUI.log('Resetting Module Class');
        GUI.Model.reset();
    }

    return {
        load:Net,
        unload:_unload
    }

});
