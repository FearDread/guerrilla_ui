/* Slider using GUI Extension */
$.GUI().create('slider', function(GUI){
  console.log('slider ... ', GUI);
  
    return {
        load:function(){
            GUI.log('working slider');
        },
        unload:function(){
        
        }
    }
});
