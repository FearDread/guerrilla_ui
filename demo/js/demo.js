/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Demo Site Module                * 
* ---------------------------------------- */
$.GUI().create('App', function(G) {
    console.log('demo app :: ', G);

    G.on('navclick', function(args) {
        console.log('navclick args = ', args);

    });

    function initView() {
        var user, view;

        /*
        user = new G.Model({
            id: 1,
            firstName: 'Duke',
            lastName: 'Hazard'
        });
        */

        view = new G.View();

        // view.setModel(user);

        console.log('view = ', view);
    }

    function showPage() {
        var page = {};

        G.fire('navclick', page);
    }

    return {
        load: function(opts) {
            var nav;
            console.log('Demo App Loaded! ', G);

            initView();

            nav = G.query('.navbar-top');

            nav.click(showPage);

        },
        unload: function() {
            G.cleanup();
        }
    };

}).start('App');
