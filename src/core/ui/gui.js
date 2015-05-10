/* --------------------------------------- *
* Guerrilla JS                             *
* @author: Garrett Haptonstall (FearDread) *
* @module: Guerrilla.ui GUI Core           *
* ---------------------------------------- */
(function(factory){

  if(typeof define === 'function' && define.amd){
    define(['guerrilla'], factory);

  }else if(typeof exports === 'object'){
    module.exports = factory(require('guerrilla'));

  }else{
    factory(Guerrilla);
  }

}(function(){
  var defaults = {

    };

    Guerrilla.ui = (Guerrilla.ui) ? Guerrilla.ui: {}; 

    Guerrilla.ui.gui = function(options){
      var _core = new Guerrilla();

      this._config = _core.extend({}, defaults, options);

      this.prototype = {

        get_pixels:function(width, unit){
          var value;

          switch(unit){
            case "em":
              value = this.convert_em(width);
              break;

            case "pt":
              value = this.convert_pt(width);
              break;

            default:
              value = width;
          }

          return value;
        },

        get_fontsize:function(elem){
          return parseFloat(
            getComputedStyle(elem || document.documentElement).fontSize;
          );
        },

        convert_em:function(value){
          return value * this.get_fontsize();
        },

        convert_base:function(){
          var pixels, 
              elem = document.documentElement,
              style = elem.getAttribute('style');

          elem.setAttribute('style', style + ';font-size:1em !important');

          base = this.get_fontsize();

          elem.setAttribute('style', style);

          return base;
        },
      
      };

      return Object.create(this.prototype);

    };
  })
);

(function ($, window) {
	function Constellation (canvas, options) {
		var $canvas = $(canvas),
			context = canvas.getContext('2d'),
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
				width: window.innerWidth,
				height: window.innerHeight,
				velocity: 0.1,
				length: 100,
				distance: 100,
				radius: 150,
				stars: []
			},
			config = $.extend(true, {}, defaults, options);

		function Star () {
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
				for (i = 0; i < config.length; i++) {
					var star = config.stars[i];

					if (star.y < 0 || star.y > canvas.height) {
						star.vx = star.vx;
						star.vy = - star.vy;
					} else if (star.x < 0 || star.x > canvas.width) {
						star.vx = - star.vx;
						star.vy = star.vy;
					}

					star.x += star.vx;
					star.y += star.vy;
				}
			},

			line: function(){
				var length = config.length,
					iStar,
					jStar,
					i,
					j;

				for (i = 0; i < length; i++) {
					for (j = 0; j < length; j++) {
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

		this.createStars = function () {
			var length = config.length,
				star,
				i;

			context.clearRect(0, 0, canvas.width, canvas.height);
			for (i = 0; i < length; i++) {
				config.stars.push(new Star());
				star = config.stars[i];

				star.create();
			}

			star.line();
			star.animate();
		};

		this.setCanvas = function () {
			canvas.width = config.width;
			canvas.height = config.height;
		};

		this.setContext = function () {
			context.fillStyle = config.star.color;
			context.strokeStyle = config.line.color;
			context.lineWidth = config.line.width;
		};

		this.setInitialPosition = function () {
			if (!options || !options.hasOwnProperty('position')) {
				config.position = {
					x: canvas.width * 0.5,
					y: canvas.height * 0.5
				};
			}
		};

		this.loop = function (callback) {
			callback();

			window.requestAnimationFrame(function () {
				this.loop(callback);
			}.bind(this));
		};

		this.bind = function () {
			/*$canvas.on('mousemove', function(e){
				config.position.x = e.pageX - $canvas.offset().left;
				config.position.y = e.pageY - $canvas.offset().top;
			});*/
			$(document).on('mousemove', function(e){
				config.position.x = e.pageX - $canvas.offset().left;
				config.position.y = e.pageY - $canvas.offset().top;
			});
		};

		this.init = function () {
			this.setCanvas();
			this.setContext();
			this.setInitialPosition();
			this.loop(this.createStars);
			this.bind();
		};
	}

	$.fn.constellation = function (options) {
		return this.each(function () {
			var c = new Constellation(this, options);
			c.init();
		});
	};
})($, window);

if($(window).width() < 700){
	$('canvas').constellation({
		distance: 40
	});
}else{
	$('canvas').constellation();
}
