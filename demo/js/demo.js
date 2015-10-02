/* --------------------------------------- *
* gui.errilla UI                             *
* @author: gui.rrett Haptonstall (FearDread) *
* @module: Demo Site Module                * 
* ---------------------------------------- */
$.GUI().create('App', function(gui) {
    console.log('Demo app :: ', gui);

    var navHandler = function(data) {
        gui.log('nav handler event fired.');
        gui.log('data = ', data);
    };

    gui.add('navclick', navHandler); 

    function _load(opts) {
        var mediaListener;

        gui.add('scrollPage', function() {
            console.log('fired scroll page channel');
        });

        initView();

        gui.net.router.config({ mode: 'hash'});

        gui.net.router.add(/about/, function() {
            console.log('about');
        });

        mediaListener = gui.ui.media({
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
        });

        mediaListener();
    }

    function bind() {
        var scroll = function(e) {
            e.preventDefault();
            gui.fire('scrollPage');
        };

        gui.$('.navbar-top').click(showPage);

        gui.$('.btn').click(scroll);
    }

    function initView() {
        var user, view;

        user = gui.model.extend({
            id: 1,
            firstName: 'Duke',
            lastName: 'Hazard'
        });

        view = gui.view.setModel(user);

        console.log('model = ', user);
        console.log('view = ', view);

        // view.fire('change');

        bind();
    }

    function showPage(e) {
        var page, href, target;
        e.preventDefault();

        target = event.target;
        page = gui.$(target);

        if (page && page.is('a')) {

            href = page.attr('href').split('#')[1];
        }

        gui.fire('navclick', {page:href}, function() {
            // gui.net.router.navigate();
            gui.log('callback after fired navclick event.');
        });
    }

    return {
        load: _load,
    };
}).start('App');
