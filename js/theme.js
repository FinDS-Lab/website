/*
 Theme Name: Labflox
 Theme URI: https://themewar.com/html/labflox/
 Author: themewar
 Author URI: 
 Description: Labflox - Laboratory & Research Responsive HTML Template
 Version: 1.0
 License:
 License URI:
*/
 
/*=======================================================================
 [Table of contents]
 =========================================================================
 1. Init Obj
 2. All Carousel
 3. Skills
 4. Stretch Column
 5. Fun Fact Count
 6. Back To Top
 7. All PopUP
 8. Sticky Header
 9. Mobile Menu
 10. Preloader
 11. Count Down
 12. Select
 13. Price Slider
 14. Product Sub Category
 16. Google Map
 17. Contact Form Submission
 18. All Filter & Suffle
*/

(function ($) {
    'use strict';
    
    var $serviceSlider = $('.serviceSlider'),
        $testiMonialAuthors = $('.testiMonialAuthors'),
        $testiMonialContentSlider = $('.testiMonialContentSlider'),
        $researchSlider = $('.researchSlider'),
        $testimonialAuthorSlider = $('.testimonialAuthorSlider'),
        $testimonialSlider = $('.testimonialSlider'),
        $serviceSlider2 = $('.serviceSlider2'),
        $gallerySliderThumb = $('.gallerySliderThumb'),
        $gallerySLider = $('.gallerySLider'),
        $popup_video = $('.popup_video'),
        $testimonialSlider02 = $('.testimonialSlider02'),
        $popup_img = $('.popup_img'),
        $labGallerySlider = $('.labGallerySlider');
        
    if($popup_video.length > 0){
        $popup_video.lightcase({
            transition: 'elastic',
            showSequenceInfo: false,
            slideshow: false,
            swipe: true,
            showTitle: false,
            showCaption: false,
            controls: true
        });
    }
    
    if($popup_img.length > 0){
        $popup_img.lightcase({
            transition: 'elastic',
            showSequenceInfo: false,
            slideshow: true,
            swipe: true,
            showTitle: false,
            controls: true
        });
    }
    
    /*--------------------------------------------------------
    / 4. Revolution
    /---------------------------------------------------------*/

    if($('.slider_01').length > 0){
        var revapi2 = jQuery('#rev_slider_1').show().revolution({
            delay: 6000,
            responsiveLevels: [1200, 1140, 778, 480],
            gridwidth: [1140, 920, 700, 380],
            jsFileLocation: "js/",
            sliderLayout: "auto",
            minHeight: '973',
            navigation: {
                keyboardNavigation: "off",
                keyboard_direction: "horizontal",
                mouseScrollNavigation: "off",
                onHoverStop: "off",
                arrows: {
                    style: "custom",
                    enable: true,
                    hide_onmobile: true,
                    hide_under: 600,
                    hide_onleave: true,
                    tmp: '',
                    left: {
                        h_align: "left",
                        v_align: "center",
                        h_offset: 30,
                        v_offset: 0
                    },
                    right: {
                        h_align: "right",
                        v_align: "center",
                        h_offset: 30,
                        v_offset: 0
                    }
                },
                bullets: {
                    enable: false
                }
            },
            parallax: {
                type: 'mouse+scroll',
                origo: 'slidercenter',
                speed: 400,
                levels: [5,10,15,20,25,30,35,40,
                         45,46,47,48,49,50,51,55],
                disable_onmobile: 'on'
            }
        });
    }
        
    if($('.slider_02').length > 0){
        var revapi2 = jQuery('#rev_slider_2').show().revolution({
            delay: 6000,
            responsiveLevels: [1200, 1140, 778, 480],
            gridwidth: [1140, 920, 700, 380],
            jsFileLocation: "js/",
            sliderLayout: "auto",
            minHeight: '856',
            navigation: {
                keyboardNavigation: "off",
                keyboard_direction: "horizontal",
                mouseScrollNavigation: "off",
                onHoverStop: "off",
                arrows: {
                    style: "custom",
                    enable: true,
                    hide_onmobile: true,
                    hide_under: 600,
                    hide_onleave: true,
                    tmp: '',
                    left: {
                        h_align: "left",
                        v_align: "center",
                        h_offset: 30,
                        v_offset: 0
                    },
                    right: {
                        h_align: "right",
                        v_align: "center",
                        h_offset: 30,
                        v_offset: 0
                    }
                },
                bullets: {
                    enable: false
                }
            },
            parallax: {
                type: 'mouse+scroll',
                origo: 'slidercenter',
                speed: 400,
                levels: [5,10,15,20,25,30,35,40,
                         45,46,47,48,49,50,51,55],
                disable_onmobile: 'on'
            }
        });
    }

    if($('.slider_03').length > 0){
        var revapi2 = jQuery('#rev_slider_3').show().revolution({
            delay: 6000,
            responsiveLevels: [1200, 1140, 778, 480],
            gridwidth: [1140, 920, 700, 380],
            jsFileLocation: "js/",
            sliderLayout: "auto",
            minHeight: '868',
            navigation: {
                keyboardNavigation: "off",
                keyboard_direction: "horizontal",
                mouseScrollNavigation: "off",
                onHoverStop: "off",
                arrows: {
                    style: "custom",
                    enable: true,
                    hide_onmobile: true,
                    hide_under: 600,
                    hide_onleave: true,
                    tmp: '',
                    left: {
                        h_align: "left",
                        v_align: "center",
                        h_offset: 30,
                        v_offset: 0
                    },
                    right: {
                        h_align: "right",
                        v_align: "center",
                        h_offset: 30,
                        v_offset: 0
                    }
                },
                bullets: {
                    enable: false
                }
            },
            parallax: {
                type: 'mouse+scroll',
                origo: 'slidercenter',
                speed: 400,
                levels: [5,10,15,20,25,30,35,40,
                         45,46,47,48,49,50,51,55],
                disable_onmobile: 'on'
            }
        });
    }
    
    
    if($serviceSlider.length > 0){
        var $serviceSlider_obj = $serviceSlider.owlCarousel({
            margin: 28,
            loop: true,
            nav: true,
            navText: ['<i class="fa fa-caret-left"></i>', '<i class="fa fa-caret-right"></i>'],
            dots: false,
            responsiveClass:true,
            responsive:{
                0:{
                    items: 1
                },
                768:{
                    items: 2
                },
                992:{
                    items: 3
                },
                1200:{
                    items: 2
                },
                1900:{
                    items: 3
                }
            }
        });
    }
    
    if($labGallerySlider.length > 0){
        var $labGallerySlider_obj = $labGallerySlider.owlCarousel({
            margin: 0,
            loop: true,
            nav: true,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            dots: false,
            items: 1
        });
    }
    
    if($researchSlider.length > 0){
        var $researchSlider_obj = $researchSlider.owlCarousel({
            margin: 28,
            loop: true,
            autoplay: true,
            autoplayTimeout: 4000,
            autoplaySpeed: 1500,
            nav: false,
            dots: false,
            responsiveClass:true,
            responsive:{
                0:{
                    items: 1
                },
                768:{
                    items: 2
                },
                1023:{
                    items: 3
                },
                1200:{
                    items: 4
                },
                1600:{
                    items: 5
                }
            }
        });
    }
    
    if($serviceSlider2.length > 0){
        var $serviceSlider2_obj = $serviceSlider2.owlCarousel({
            margin: 0,
            loop: true,
            autoplay: true,
            nav: false,
            dots: false,
            responsiveClass:true,
            autoplayTimeout: 5000,
            autoplaySpeed: 1500,
            responsive:{
                0:{
                    items: 1
                },
                768:{
                    items: 2
                },
                992:{
                    items: 3
                },
                1200:{
                    items: 3
                }
            }
        });
    }
    
    if($testimonialSlider02.length > 0){
        var $testimonialSlider02_obj = $testimonialSlider02.owlCarousel({
            margin: 30,
            loop: true,
            autoplay: true,
            nav: false,
            autoplayTimeout: 5000,
            autoplaySpeed: 1500,
            dots: false,
            responsiveClass:true,
            responsive:{
                0:{
                    items: 1
                },
                768:{
                    items: 2
                },
                1023:{
                    items: 2
                },
                1200:{
                    items: 3
                }
            }
        });
    }
    
    
    $('.skillOne').appear();
    $(document.body).on('appear', '.skillOne', function(e, $affected) {
        $affected.each(function() {
            var $this = $(this);
            if(!$this.hasClass('appeared')){
                var point = $this.attr('data-values');
                var decs = point * 100;
                var size = $this.attr('data-sizes');
                var thickness = $this.attr('data-thicknesss');
                var fill = $this.attr('data-fills');
                var emptyFill = $this.attr('data-emptyfills');
                var lineCap = $this.attr('data-linecaps');

                $this.circleProgress({
                    value: point,
                    startAngle: -Math.PI / 4 * 0,
                    fill: fill,
                    emptyFill: emptyFill,
                    lineCap: lineCap,
                    thickness: thickness,
                    animation: {duration: 1800},
                    size: size
                }).on('circle-animation-progress', function (event, progress) {
                    $this.find('strong').html(parseInt(decs * progress) + '<span>%</span>');
                });
                $this.addClass('appeared');
            }
        });
    });
    
    $testiMonialContentSlider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        asNavFor: '.testiMonialAuthors',
        autoplay: false,
        dots: true
    });
    $testiMonialAuthors.slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.testiMonialContentSlider',
        dots: false,
        arrows: false,
        variableWidth: true,
        autoplay: false,
        infinite: true,
        centerMode: true,
        centerPadding: '0',
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 3
                }
            }
        ]
    });
    
    
     
    $testimonialSlider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        asNavFor: '.testimonialAuthorSlider',
        autoplay: false,
        dots: false
    });
    $testimonialAuthorSlider.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.testimonialSlider',
        dots: false,
        arrows: false,
        variableWidth: true,
        autoplay: false,
        infinite: true,
        centerMode: true,
        centerPadding: '0',
        focusOnSelect: true
    });
    $('.prevTestim').click(function(e){
        e.preventDefault();
        $testimonialSlider.slick('slickPrev');
        $testimonialAuthorSlider.slick('slickPrev');
    });
    $('.nextTestim').click(function(e){
        e.preventDefault();
        $testimonialSlider.slick('slickNext');
        $testimonialAuthorSlider.slick('slickNext');
    });
    
    
    if($gallerySliderThumb.length > 0){
        $gallerySLider.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            asNavFor: '.gallerySliderThumb',
            autoplay: false,
            dots: false
        });
        $gallerySliderThumb.slick({
            asNavFor: '.gallerySLider',
            vertical: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            dots: false,
            arrows: false,
            //infinite: true,
            centerMode: true,
            centerPadding: '0',
            verticalSwiping: true,
            responsive:[{
                breakpoint: 767,
                settings: {
                    vertical: false,
                    verticalSwiping: false
                }
            }]
        });  
    }
    
    $('.counters').appear();
    $(document.body).on('appear', '.counters', function(e, $affected) {
        $affected.each(function() {
            var $this = $(this);
            if(!$this.hasClass('appeared')){
                var numbers = $this.attr('data-count');
                var suffix = $this.attr('data-suffix');
                var format = $this.attr('data-format');
                jQuery({Counter: 0}).animate({Counter: numbers}, {
                    duration: 3000,
                    easing: 'swing',
                    step: function () {
                        if(format == 'separator'){
                            var num = Math.ceil(this.Counter).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }else if(format == 'decimal'){
                            var num = this.Counter.toFixed(1);
                        }else if(format == 'leadingzero'){
                            var num = Math.ceil(this.Counter).toString();
                            num = (num < 10 ? '0'+num : num);
                        }else{
                            var num = Math.ceil(this.Counter).toString();
                        }
                        $this.html(num+''+suffix);
                    }
                });
                $this.addClass('appeared');
            }
        });
    });
    
    $('.spParent').appear();
    $(document.body).on('appear', '.spParent', function(e, $affected) {
        $affected.each(function() {
            var $this = $(this);
            if(!$this.hasClass('appeared')){
                var datacount = $this.attr("data-parcent");
                $(".spInner", $this).animate({'width': datacount + '%'}, 2000);
                
                $this.find('.spInner span').each(function () {
                    var $counter = $(this);
                    $({Counter: 0}).animate({Counter: datacount}, {
                        duration: 2000,
                        easing: 'swing',
                        step: function () {
                            $counter.html(Math.ceil(this.Counter) + '%');
                        }
                    });
                });
                
                $this.addClass('appeared');
            }
        });
    });
    
    /*--------------------------------------------------------
    / 6. Back To Top
    /---------------------------------------------------------*/
    var back = $("#backtotop"),
        body = $("body, html");
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > $(window).height()) {
            back.css({bottom: '30px', opacity: '1', visibility: 'visible'});
        } else {
            back.css({bottom: '-30px', opacity: '0', visibility: 'hidden'});
        }
    });
    body.on("click", "#backtotop", function (e) {
        e.preventDefault();
        body.animate({scrollTop: 0}, 800);
        return false;
    });
    
    function tw_stretch() {
        var i = $(window).width();
        $(".row .tw-stretch-element-inside-column").each(function() {
            var $this = $(this),
                row = $this.closest(".row"),
                cols = $this.closest('[class^="col-"]'),
                colsheight = $this.closest('[class^="col-"]').height(),
                rect = this.getBoundingClientRect(),
                l = row[0].getBoundingClientRect(),
                s = cols[0].getBoundingClientRect(),
                r = rect.left,
                d = i - rect.right,
                c = l.left + (parseFloat(row.css("padding-left")) || 0),
                u = i - l.right + (parseFloat(row.css("padding-right")) || 0),
                p = s.left,
                f = i - s.right,
                styles = {
                    "margin-left": 0,
                    "margin-right": 0
                };
            if (Math.round(c) === Math.round(p)) {
                var h = parseFloat($this.css("margin-left") || 0);
                styles["margin-left"] = h - r;
            }
            if (Math.round(u) === Math.round(f)) {
                var w = parseFloat($this.css("margin-right") || 0);
                styles["margin-right"] = w - d;
            }
            $this.css(styles);
        });
    }
    tw_stretch();
    
    $('.stShare > a').on('click', function(){
        if($(this).parent().siblings('.stAllSoc').hasClass('showit')){
            $(this).parent().siblings(".stAllSoc").removeClass('showit');
        }else{
            $(this).parent().siblings(".stAllSoc").addClass('showit');
        }
    });
    
    $('.singleTeam').on('mouseleave', function(){
        if($('.stAllSoc', this).hasClass('showit')){
            $('.stAllSoc', this).removeClass('showit');
        }
    });
    
    $('.menuBtn').on('click', function(e){
        e.preventDefault();
        $(this).parent().siblings('.mainMenu').slideToggle();
        $(this).toggleClass('active');
    });
    
    $('.mainMenu ul li.menu-item-has-children > a').on('click', function(e){
        e.preventDefault();
        var $this = $(this);
        if($(window).width() < 1200){
            $this.siblings('ul').slideToggle();
            $this.parent('li.menu-item-has-children').toggleClass('active');
        }
    });

    // Preloader js
    $(window).on("load", function () {
        var preload = $(".preloader");
        if (preload.length > 0) {
            preload.delay(800).fadeOut("slow");
        }
    });
    
    /*--------------------------------------------------------
    / 13. Sticky Header
    /---------------------------------------------------------*/
    if($(".isSticky").length > 0){
        var header_height = $(".isSticky").height();
        $(window).on('scroll', function(){
            if($(window).scrollTop() > 300){
                $(".isSticky").addClass('fixedHeader animated slideInDown');
            }else{
                $(".isSticky").removeClass('fixedHeader animated slideInDown');
            }
        });
    }

    // Date Picker
    const picker = new Litepicker({ 
        element: document.getElementById('litepicker'),
    });


     /*----------------------------------------------------------
    / Contact Form Submission
   /----------------------------------------------------------*/
   $('#contact_form').on('submit', function (e) {
        e.preventDefault();
        var $this = $(this);
    
        $('button[type="submit"]', this).attr('disabled', 'disabled').val('Processing...');
        var form_data = $this.serialize();
        var required = 0;
        $(".required", this).each(function () {
            if ($(this).val() === ''){
                $(this).addClass('reqError');
                required += 1;
            } else{
                if ($(this).hasClass('reqError'))
                {
                    $(this).removeClass('reqError');
                    if (required > 0)
                    {
                        required -= 1;
                    }
                }
            }
        });
        if (required === 0) {
            $.ajax({
                type: 'POST',
                url: 'ajax/mail.php',
                data: {form_data: form_data},
                success: function (data) {
                    $('button[type="submit"]', $this).removeAttr('disabled').val('Message');
    
                    $('.con_message', $this).fadeIn().html('<strong>Congratulations!</strong> Your query successfully sent to site admin.').removeClass('alert-warning').addClass('alert-success');
                    setTimeout(function () {
                        $('.con_message', $this).fadeOut().html('').removeClass('alert-success alert-warning');
                    }, 5000);
                }
            });
        } else {
            $('button[type="submit"]', $this).removeAttr('disabled').val('Message');
            $('.con_message', $this).fadeIn().html('<strong>Opps!</strong> Errpr found. Please fix those and re submit.').removeClass('alert-success').addClass('alert-warning');
            setTimeout(function () {
                $('.con_message', $this).fadeOut().html('').removeClass('alert-success alert-warning');
            }, 5000);
        }
    });
    $(".required").on('keyup', function () {
        $(this).removeClass('reqError');
    });
    

    
    
})(jQuery);