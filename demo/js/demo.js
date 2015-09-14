/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Demo Site Module                * 
* ---------------------------------------- */
$.GUI().create('App', function(G) {
    console.log('Demo app :: ', G);

    G.add('navclick', function(args) {
        console.log('navclick args = ', args);
    }, this);

    function _load(opts) {
        G.add('scrollPage', function() {
            console.log('fired scroll page channel');
        });
        initView();

    }

    function bind() {

        G.query('.navbar-top').click(showPage);
        G.query('.btn').click(function(e) {
            G.fire('scrollPage');
        });
    }

    function initView() {
        var user, view;

        user = new G.Model({
            id: 1,
            firstName: 'Duke',
            lastName: 'Hazard'
        });

        view = new G.View();
        // view.setModel(user);

        console.log('model = ', user);
        console.log('view = ', view);

        bind();
    }

    function showPage(event) {
        var page, href, target;

        event.preventDefault();

        target = event.target;

        page = G.query(target);

        if (page && page.is('a')) {

            href = page.attr('href').split('#')[1];
        }

        console.log('href = ' + href);
        G.fire('navclick', {page:href});
    }

    return {
        load: _load,
        unload: function() {}
    };
}).start('App');
