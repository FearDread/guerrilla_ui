/* --------------------------------------- *
* Guerrilla UI                             *
* @module: GUI Fog jQuery plugin           * 
* ---------------------------------------- */
$.GUI().create('Misty', function(G) {

    var particles = [];
    var particleCount = 30;
    var maxVelocity = 2;
    var targetFPS = 33;
    var canvasWidth = 400;
    var canvasHeight = 400;
    var imageObj = new Image();

    imageObj.onload = function() {
        particles.forEach(function(particle) {
                particle.setImage(imageObj);
        });
    };

    imageObj.src = "img/fog.png";

    function Particle(context) {

        this.x = 0;
        this.y = 0;

        this.xVelocity = 0;
        this.yVelocity = 0;

        this.radius = 5;
        this.context = context;

        this.draw = function() {

            if (this.image) {
                this.context.drawImage(this.image, this.x-128, this.y-128);         
                return;
            }

            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            this.context.fillStyle = "rgba(0, 255, 255, 0)";
            this.context.fill();
            this.context.closePath();
        };

        this.update = function() {
            this.x += this.xVelocity;
            this.y += this.yVelocity;

            if (this.x >= canvasWidth) {
                this.xVelocity = -this.xVelocity;
                this.x = canvasWidth;
            }

            else if (this.x <= 0) {
                this.xVelocity = -this.xVelocity;
                this.x = 0;
            }

            if (this.y >= canvasHeight) {
                this.yVelocity = -this.yVelocity;
                this.y = canvasHeight;
            }
            
            else if (this.y <= 0) {
                this.yVelocity = -this.yVelocity;
                this.y = 0;
            }
        };

        // A function to set the position of the particle.
        this.setPosition = function(x, y) {
            this.x = x;
            this.y = y;
        };

        // Function to set the velocity.
        this.setVelocity = function(x, y) {
            this.xVelocity = x;
            this.yVelocity = y;
        };
        
        this.setImage = function(image) {
            this.image = image;
        };
    }

    function generateRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    var context;

    function init() {
        var i, particle, canvas;
        
        canvas = document.getElementById('bg-canvas');

        if (canvas.getContext) {

            context = canvas.getContext('2d');

            for (i = 0; i < particleCount; i++) {
                particle = new Particle(context);
                
                particle.setPosition(generateRandom(0, canvasWidth), generateRandom(0, canvasHeight));
                
                particle.setVelocity(generateRandom(-maxVelocity, maxVelocity), generateRandom(-maxVelocity, maxVelocity));
                particles.push(particle);            
            }
        } else {
            gui.warn("Please use a modern browser");
        }
    }

    function draw() {
        context.clearRect(0,0,canvasWidth,canvasHeight);

        particles.forEach(function(particle) {
            particle.draw();
        });
    }

    function update() {
        particles.forEach(function(particle) {
            particle.update();
        });
    }

    return {
        fn: function() {

            init();

            if (context) {
                setInterval(function() {

                    update();

                    draw();

                }, 1000 / targetFPS);
            }
        },
    };
}).start('Misty');
