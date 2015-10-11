/* --------------------------------------- *
* gui.errilla UI                             *
* @author: gui.rrett Haptonstall (FearDread) *
* @module: Demo Site Module                * 
* ---------------------------------------- */
$.GUI().create('App', function(gui) {
    console.log('Demo app :: ', gui);
    var events;

    events = {
        scroll: function(e) {
            e.preventDefault();
            gui.fire('scrollPage');
        },
        navclick: function(data) {
            gui.log('nav handler event fired.');
            gui.log('data = ', data);
        },
        showPage: function(e) {
            e.preventDefault();
            var page, href, target;

            target = gui.$(e.target);

            if (target && target.is('a')) {
                href = target.attr('href').split('#')[1];
            }

            gui.fire('navclick', {page: href}, function() {
                gui.log('callback after fired navclick event.');
            });
        }
    };

    function _load(opts) {
        var mediaListener, charm;

        gui.add('scrollPage', function() {
            console.log('fired scroll page channel');
        });
        gui.add('navclick', events.navclick);

        initView();

        gui.net.router.config({ mode: 'history'});

        gui.net.router.add(/about/, function() {
            console.log('about');
        });

        mediaListener = new gui.ui.media({
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

        charm = new gui.ui.charm({
            offset: 80,
            callback: function() {
                console.log('charm loaded.');
            }
        });

        charm.init();
    }

    function bindEvents() {
        gui.$('.navbar-top').click(events.showPage);
        gui.$('.btn').click(events.scroll);
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

    return {
        load: function() {
            //jQuery to collapse the navbar on scroll
            $(window).scroll(function() {
                if ($(".navbar").offset().top > 50) {

                    $(".navbar-fixed-top").addClass("top-nav-collapse");
                } else {
                    $(".navbar-fixed-top").removeClass("top-nav-collapse");
                }
            });

            $('a.page-scroll').bind('click', function(e) {
                var $anchor = $(this);

                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top
                }, 1500, 'easeInOutExpo');
                
                e.preventDefault();
            });

            gui.timeout(function() {
                $('.preloader').fadeOut(300);

                _load();
            }, 1500);
        },
        unload: function() {}
    };
}).start('App');
