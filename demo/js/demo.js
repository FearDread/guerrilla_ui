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

        gui.Router.config({ mode: 'hash'});

        gui.Router.add(/about/, function() {
            console.log('about');
        });

        mediaListener = new gui.Media({
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

        gui.query('.navbar-top').click(showPage);
        gui.query('.btn').click(function(e) {
            e.preventDefault();
            gui.fire('scrollPage');
        });
    }

    function initView() {
        var user, view;

        user = new gui.Model({
            id: 1,
            firstName: 'Duke',
            lastName: 'Hazard'
        });

        view = new gui.View();
        view.setModel(user);

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
            // gui.Router.navigate();
            gui.log('callback after fired navclick event.');
        });
    }

    return {
        load: _load,
    };
}).start('App');
