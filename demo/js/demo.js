/* --------------------------------------- *
* gui.errilla UI                             *
* @author: gui.rrett Haptonstall (FearDread) *
* @module: Demo Site Module                * 
* ---------------------------------------- */
$.GUI().create('App', function(gui) {
    console.log('Demo app :: ', gui);
    console.log('Demo context = ', this);

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

       new gui.ui.charm().init();
    }

    function bindEvents() {
        var scroll = function(e) {
            e.preventDefault();
            gui.fire('scrollPage');
        };

        gui.$('.navbar-top').click(showPage);

        gui.$('.btn').click(scroll);
    }

    function initView() {
        var user, view;

        user = new gui.model({
            id: 1,
            firstName: 'Duke',
            lastName: 'Hazard'
        });

        view = new gui.view(user);

        console.log('model = ', user);
        console.log('view = ', view);

        bindEvents();
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
