require.config({
    baseUrl: 'http://oxfamamerica.org/static/js',
    paths: {
        'jquery'            : 'vendor/jquery-1.9.1.min',
        'sharrre'           : 'vendor/jquery.sharrre',
        'fitvids'           : 'vendor/jquery.fitvids',
        'flexslider'        : 'vendor/jquery.flexslider',
        'hammer'            : 'vendor/hammer',
        'infobox'           : 'vendor/infobox',
        'OAGeneral'         : 'build/oa.general',
        'OASearch'         : 'build/oa.search',
        'OATakeAction'      : 'build/oa.take-action',
        'gmaps'             : 'build/code.gmaps',
        'OASlideNav'        : 'build/oa.slide-nav',
        'OASlideshow'       : 'build/oa.slideshow',
        'OAMap'             : 'build/oa.map',
        'OALoadMore'        : 'build/oa.load-more',
        'OAYoutubeAPI'   : 'build/oa.youtubeapi'

    },
    shim: {
        'sharrre'        : ['jquery'],
        'fitvids'        : ['jquery'],
        'flexslider'     : ['jquery'],
        'infobox'        : {
            deps   : ['gmaps'],
            exports: 'InfoBox'
        },
        'gmaps': {
            exports: 'google.maps'
        },
        'hammer': {
            exports: 'Hammer'
        }
    }
});

require(['jquery', 'OAGeneral'], function($) {

    $(function(){

				// -- Search form submission --
        var $SearchForm = $('#Search');
        if ( $SearchForm.length ){
            require(['OASearch'], function($) { });
        }
				// -- Search form submission - end --

				// -- Take action form submission --
        var $TAForm = $('#taForm');
        if ( $TAForm.length ){
            require(['OATakeAction'], function($) { });
        }

        // -- SLIDESHOW --
        var $SlideNav = $('.js-cmpnt-slidenav-wrapper');
        if($SlideNav.length) {
            require(['OASlideNav'], function($) {
                $SlideNav.OASlideNav();
            });
        }

        // -- Content loader --
        var $LoadMore = $('.js-load-more');
        if($LoadMore.length) {
            require(['OALoadMore'], function($) {
                $LoadMore.OALoadMore();
            });
        }

        // -- SLIDESHOW --
        var $Slideshow = $('.cmpnt-carousel');
        if($Slideshow.length) {
            require(['OASlideshow'], function($) {
                $Slideshow.OASlideshow();
            });
        }


        // -- MAP --
        var $Map = $('.cmpnt-map-container');
        if($Map.length) {
            require(['OAMap'], function($) {
                $Map.OAMap({
                    pins: {
                        oa       : '/newsite2/assets/img/map/oa-pin.png',
                        emergency: '/newsite2/assets/img/map/emergency-pin.png'
                    },
                    zoom  : 2,
                    center: {
                        lat: 42.366884,
                        lon: -71.059602
                    }
                });
            });
        }


        // -- CAROUSEL --
        var $Carousel = $('#carousel'),
            $Slider   = $('#slider'),
            $Captions = $('#captions');
        // ------ Youtube iframe API

        if($Carousel.length) {
            require(['flexslider','OAYoutubeAPI'], function($) {
                // The slider being synced must be initialized first
                $Carousel.flexslider({
                    animation: "ease-in-out",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    itemWidth: 115,
                    itemMargin: 5,
                    asNavFor: '#slider'
                    //touch: true
                });

                $Slider.flexslider({
                    animation: "ease-in-out",
                    controlNav: false,
                    animationLoop: false,
                    slideshow: false,
                    directionNav: false,
                    video: true,
                    useCSS: false,
                    before:function(slider){
                        // JI 01/06/14: Stop all youtube videos in this slideshow
                        var x = myYT.players.length;
                        for(j=0;j<x;j++){
                           myYT.stopVideo(myYT.players[j]);
                        }
                    },   
                    after: function(slider){
                        // move the two sliders at once
                        $Captions.flexslider(slider.currentSlide);
                    }
                });

                $Captions.flexslider({
                    animation: "fade",
                    controlNav: false,
                    animationLoop: false,
                    directionNav: false,
                    slideshow: false
                });

            });
        }


        // -- FITVIDS --
        var $GalleyVid = $('.media-gallery');
        if($GalleyVid.length) {
            require(['fitvids'], function($) {
                $GalleyVid.fitVids(); // make videos responsive
            });
        }

        // -- SHARRRE --
        var $SharrreTwitter  = $('.twitter-count'),
            $SharrreFacebook = $('.facebook-count'),
            $SharrreGoogle   = $('.googleplus-count');

        if($SharrreTwitter.length || $SharrreFacebook.length || $SharrreGoogle.length) {
            require(['sharrre'], function($) {
                $SharrreTwitter.sharrre({
                    share: {
                        twitter: true
                    },
                    enableHover: false,
                    enableTracking: true,
                    buttons: { twitter: {via: 'OxfamAmerica'}},
                    click: function(api, options){
                        api.simulateClick();
                        api.openPopup('twitter');
                    }
                });

                $SharrreFacebook.sharrre({
                    share: {
                        facebook: true
                    },
                    enableHover: false,
                    enableTracking: true,
                    click: function(api, options){
                        api.simulateClick();
                        api.openPopup('facebook');
                    }
                });

                $SharrreGoogle.sharrre({
                    share: {
                        googlePlus: true
                    },
                    urlCurl: '/sharrre/',
                    enableHover: false,
                    enableTracking: true,
                    click: function(api, options){
                        api.simulateClick();
                        api.openPopup('googlePlus');
                    }
                });
            });
        }
    });
});
