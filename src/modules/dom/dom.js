
$.GUI().use(function(gui) {


    return {
        
        load: function(api) {

            api.dom.event = Event;
        }
    };
});
