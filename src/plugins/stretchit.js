
var Stretchit = function(container, images, options){

    this.options = $.extend({}, $.fn.backstretch.defaults, options || {});

    this.images = $.isArray(images) ? images : [images];

    $.each(this.images, function(){
           $('<img />')[0].src = this;
    });
    
    this.$container = $(container);
    this.isBody = container === document.body;
    this.$root = this.isBody ? supportsFixedPosition ? $(window) : $(document) : this.$container;

    var $existing = this.$container.children(".backstretch").first();

    this.$wrap = $existing.length ? $existing : $('<div class="backstretch"></div>').css(styles.wrap).appendTo(this.$container);
    
    if(!this.isBody) {
        var position = this.$container.css('position'), 
            zIndex = this.$container.css('zIndex');
        
        this.$container.css({
            position: position === 'static' ? 'relative' : position,
            zIndex: zIndex === 'auto' ? 0 : zIndex
            background: 'none'
        });
        
        this.$wrap.css({zIndex: -999998});
    }
    
    this.$wrap.css({
        position: this.isBody && supportsFixedPosition ? 'fixed' : 'absolute'
    });
    
    this.index = 0;
    this.show(this.index);
    
    $(window).on('resize.backstretch', $.proxy(this.resize, this)).on('orientationchange.backstretch', $.proxy(function () {
        if(this.isBody && window.pageYOffset === 0){
            window.scrollTo(0, 1);

            this.resize();
        }
    }, this));

    this.prototype = {
        resize:function(){
            try {
                var bgCSS = {left: 0, top: 0}
                  , rootWidth = this.isBody ? this.$root.width() : this.$root.innerWidth()
                  , bgWidth = rootWidth
                  , rootHeight = this.isBody ? ( window.innerHeight ? window.innerHeight : this.$root.height() ) : this.$root.innerHeight()
                  , bgHeight = bgWidth / this.$img.data('ratio')
                  , bgOffset;
        
                if(bgHeight >= rootHeight){
                    bgOffset = (bgHeight - rootHeight) / 2;

                    if(this.options.centeredY){
                        bgCSS.top = '-' + bgOffset + 'px';
                    }
                }else{
                    bgHeight = rootHeight;
                    bgWidth = bgHeight * this.$img.data('ratio');
                    bgOffset = (bgWidth - rootWidth) / 2;

                    if(this.options.centeredX) {
                        bgCSS.left = '-' + bgOffset + 'px';
                    }
                }
                
                this.$wrap.css({width: rootWidth, height: rootHeight})

                .find('img:not(.deleteable)').css({width: bgWidth, height: bgHeight}).css(bgCSS);

            }catch(err){

            }

        return this;
    }
    
    // Show the slide at a certain position
    , show: function (newIndex) {
        
        // Validate index
        if (Math.abs(newIndex) > this.images.length - 1) {
            return;
        }
        
        // Vars
        var self = this
        , oldImage = self.$wrap.find('img').addClass('deleteable')
        , evtOptions = { relatedTarget: self.$container[0] };
        
        // Trigger the "before" event
        self.$container.trigger($.Event('backstretch.before', evtOptions), [self, newIndex]);
        
        // Set the new index
        this.index = newIndex;
        
        // Pause the slideshow
        clearInterval(self.interval);
        
        // New image
        self.$img = $('<img />')
        .css(styles.img)
        .bind('load', function (e) {
              var imgWidth = this.width || $(e.target).width()
              , imgHeight = this.height || $(e.target).height();
              
              // Save the ratio
              $(this).data('ratio', imgWidth / imgHeight);
              
              // Show the image, then delete the old one
              // "speed" option has been deprecated, but we want backwards compatibilty
              $(this).fadeIn(self.options.speed || self.options.fade, function () {
                             oldImage.remove();
                             
                             // Resume the slideshow
                             if (!self.paused) {
                             self.cycle();
                             }
                             
                             // Trigger the "after" and "show" events
                             // "show" is being deprecated
                             $(['after', 'show']).each(function () {
                                                       self.$container.trigger($.Event('backstretch.' + this, evtOptions), [self, newIndex]);
                                                       });
                             });
              
              // Resize
              self.resize();
              })
        .appendTo(self.$wrap);
        
        // Hack for IE img onload event
        self.$img.attr('src', self.images[newIndex]);
        return self;
    }
    
    , next: function () {
        // Next slide
        return this.show(this.index < this.images.length - 1 ? this.index + 1 : 0);
    }
    
    , prev: function () {
        // Previous slide
        return this.show(this.index === 0 ? this.images.length - 1 : this.index - 1);
    }
    
    , pause: function () {
        // Pause the slideshow
        this.paused = true;
        return this;
    }
    
    , resume: function () {
        // Resume the slideshow
        this.paused = false;
        this.next();
        return this;
    }
    
    , cycle: function () {
        // Start/resume the slideshow
        if(this.images.length > 1) {
            // Clear the interval, just in case
            clearInterval(this.interval);
            
            this.interval = setInterval($.proxy(function () {
                                                // Check for paused slideshow
                                                if (!this.paused) {
                                                this.next();
                                                }
                                                }, this), this.options.duration);
        }
        return this;
    }
    
    , destroy: function (preserveBackground) {
        // Stop the resize events
        $(window).off('resize.backstretch orientationchange.backstretch');
        
        // Clear the interval
        clearInterval(this.interval);
        
        // Remove Backstretch
        if(!preserveBackground) {
            this.$wrap.remove();
        }
        this.$container.removeData('backstretch');
    }
};

};
$.fn.backstretch = function (images, options) {

    if (images === undefined || images.length === 0) {
        $.error("No images were supplied for Backstretch");
    }

    if ($(window).scrollTop() === 0 ) {
        window.scrollTo(0, 0);
    }
    
    return this.each(function () {
                     var $this = $(this)
                     , obj = $this.data('backstretch');
                     
                     if (obj) {
                     
                     if (typeof images == 'string' && typeof obj[images] == 'function') {
      
                     obj[images](options);
                     
                     return;
                     }
                   
                     options = $.extend(obj.options, options);
                     
                     obj.destroy(true);
                     }
                     
                     obj = new Backstretch(this, images, options);
                     $this.data('backstretch', obj);
                     });
};

$.backstretch = function (images, options) {
    // Return the instance
    return $('body')
    .backstretch(images, options)
    .data('backstretch');
};

$.expr[':'].backstretch = function(elem) {
    return $(elem).data('backstretch') !== undefined;
};

$.fn.backstretch.defaults = {
centeredX: true
    , centeredY: true
    , duration: 5000
    , fade: 0
};

var styles = {
wrap: {
left: 0
    , top: 0
    , overflow: 'hidden'
    , margin: 0
    , padding: 0
    , height: '100%'
    , width: '100%'
    , zIndex: -999999
}
    , img: {
    position: 'absolute'
        , display: 'none'
        , margin: 0
        , padding: 0
        , border: 'none'
        , width: 'auto'
        , height: 'auto'
        , maxHeight: 'none'
        , maxWidth: 'none'
        , zIndex: -999999
    }
};


/* PUBLIC METHODS
 * ========================= */

var supportsFixedPosition = (function () {
                             var ua = navigator.userAgent
                             , platform = navigator.platform
                             // Rendering engine is Webkit, and capture major version
                             , wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ )
                             , wkversion = !!wkmatch && wkmatch[ 1 ]
                             , ffmatch = ua.match( /Fennec\/([0-9]+)/ )
                             , ffversion = !!ffmatch && ffmatch[ 1 ]
                             , operammobilematch = ua.match( /Opera Mobi\/([0-9]+)/ )
                             , omversion = !!operammobilematch && operammobilematch[ 1 ]
                             , iematch = ua.match( /MSIE ([0-9]+)/ )
                             , ieversion = !!iematch && iematch[ 1 ];
                             
                             return !(
                                      // iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
                                      ((platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ) && wkversion && wkversion < 534) ||
                                      
                                      // Opera Mini
                                      (window.operamini && ({}).toString.call( window.operamini ) === "[object OperaMini]") ||
                                      (operammobilematch && omversion < 7458) ||
                                      
                                      //Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
                                      (ua.indexOf( "Android" ) > -1 && wkversion && wkversion < 533) ||
                                      
                                      // Firefox Mobile before 6.0 -
                                      (ffversion && ffversion < 6) ||
                                      
                                      // WebOS less than 3
                                      ("palmGetResource" in window && wkversion && wkversion < 534) ||
                                      
                                      // MeeGo
                                      (ua.indexOf( "MeeGo" ) > -1 && ua.indexOf( "NokiaBrowser/8.5.0" ) > -1) ||
                                      
                                      // IE6
                                      (ieversion && ieversion <= 6)
                                      );
                             }());

