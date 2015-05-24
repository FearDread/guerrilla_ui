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

            script:function(url, data, callback){

                $.ajax({url:url, type:'script', data:data,
                    success:function(resp){
                        GUI.log('script resp = ', resp);

                        if(resp && resp.status == 200){
                            Model.create(url, resp);
                            callback(resp);
                        }
                
                    },
                    error:function(error){
                        GUI.log('Error :: ', error);
                    }
                })
        
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
