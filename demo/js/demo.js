/* --------------------------------------- *
* Guerrilla UI                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Demo Site Module                * 
* ---------------------------------------- */
$.GUI().create('App', function(G) {
    console.log('Demo app :: ', G);

    var navHandler = function(data) {

        G.log('nav handler event fired.');
        G.log('data = ', data);
    };

    G.add('navclick', navHandler); 

    function _load(opts) {
        var mediaListener;

        G.add('scrollPage', function() {
            console.log('fired scroll page channel');
        });

        initView();

        G.Router.config({ mode: 'hash'});

        G.Router.add(/about/, function() {
            console.log('about');
        });

        mediaListener = new G.Media({
            media:'(max-width: 1024)',
            in: function() {
                console.log('media in');
            },
            out: function() {
                console.log('media out');
            },
            both: function() {
                console.log('media both');
            }
        }).call();
    }

    function bind() {

        G.query('.navbar-top').click(showPage);
        G.query('.btn').click(function(e) {
            e.preventDefault();
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
        view.setModel(user);

        console.log('model = ', user);
        console.log('view = ', view);

        // view.fire('change');

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

        G.fire('navclick', {page:href}, function() {

            // G.Router.navigate();
            G.log('callback after fired navclick event.');
        });
    }

    return {
        load: _load,
    };
}).start('App');
