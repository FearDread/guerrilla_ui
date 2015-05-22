
/* Stargaze library */

$.GUI().create('Stargaze', function(GUI){

    var Stargaze = function(canvas, options){

        var $canvas = GUI.query(canvas) || null,
            context = (canvas) ? canvas.getContext('2d') : null,
            defaults = {
                star: {
                    color: 'rgba(255, 255, 255, .7)',
                    width: 1
                },
                line: {
                    color: 'rgba(255, 255, 255, .7)',
                    width: 0.2
                },
                position: {
                    x: 0, 
                    y: 0 
                },
                width: GUI.win.innerWidth,
                height: GUI.win.innerHeight,
                velocity: 0.1,
                length: 100,
                distance: 100,
                radius: 150,
                stars: []
            },
            config = $.extend(true, {}, defaults, options);

        function Star (){
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.vx = (config.velocity - (Math.random() * 0.5));
            this.vy = (config.velocity - (Math.random() * 0.5));

            this.radius = Math.random() * config.star.width;
        }

        Star.prototype = {

            create: function(){
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                context.fill();
            },

            animate: function(){
                var i;

                for(i = 0; i < config.length; i++){
                    var star = config.stars[i];

                    if(star.y < 0 || star.y > canvas.height){
                        star.vx = star.vx;
                        star.vy = - star.vy;

                    }else if (star.x < 0 || star.x > canvas.width){
                        star.vx = - star.vx;
                        star.vy = star.vy;
                    }

                    star.x += star.vx;
                    star.y += star.vy;
                }
            },

            line:function(){
                var length = config.length,
                    iStar,
                    jStar,
                    i,
                    j;

                for(i = 0; i < length; i++){
                    for(j = 0; j < length; j++){
                        iStar = config.stars[i];
                        jStar = config.stars[j];

                        if (
                            (iStar.x - jStar.x) < config.distance &&
                            (iStar.y - jStar.y) < config.distance &&
                            (iStar.x - jStar.x) > - config.distance &&
                            (iStar.y - jStar.y) > - config.distance
                        ) {
                            if (
                                (iStar.x - config.position.x) < config.radius &&
                                (iStar.y - config.position.y) < config.radius &&
                                (iStar.x - config.position.x) > - config.radius &&
                                (iStar.y - config.position.y) > - config.radius
                            ) {
                                context.beginPath();
                                context.moveTo(iStar.x, iStar.y);
                                context.lineTo(jStar.x, jStar.y);
                                context.stroke();
                                context.closePath();
                            }
                        }
                    }
                }
            }
        };

        this.createStars = function(){
            var length = config.length,
                star, i;

            context.clearRect(0, 0, canvas.width, canvas.height);

            for(i = 0; i < length; i++){
                config.stars.push(new Star());

                star = config.stars[i];
                star.create();
            }

            star.line();
            star.animate();
        };

        this.setCanvas = function(){
            canvas.width = config.width;
            canvas.height = config.height;
        };

        this.setContext = function(){
            context.fillStyle = config.star.color;
            context.strokeStyle = config.line.color;
            context.lineWidth = config.line.width;
        };

        this.setInitialPosition = function(){
            if(!options || !options.hasOwnProperty('position')){
                config.position = {
                    x: canvas.width * 0.5,
                    y: canvas.height * 0.5
                };
            }
        };

        this.loop = function(callback){
            callback();

            GUI.win.requestAnimationFrame(function(){
                this.loop(callback);
            }.bind(this));
        };

        this.bind = function(){
            $(GUI.doc).on('mousemove', function(e){
                config.position.x = e.pageX - $canvas.offset().left;
                config.position.y = e.pageY - $canvas.offset().top;
            });
        };

        this.init = function(){
            this.setCanvas();
            this.setContext();
            this.setInitialPosition();
            this.loop(this.createStars);
            this.bind();
        };
    }

    return {
        fn:function(){
            var argc = arguments[0],
                $elem = argc[0],
                opts = argc[1];

            return new Stargaze($elem, opts).init();
        }
    }
});
