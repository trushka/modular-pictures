$(document).ready(function() {
    function a() {
        return b
    }
    var b = 0;
    $(".modular-tabs .tabs-item li").on("click", function() {
        var a = $(this).data("tads");
        $(".modular-tabs .tabs-item li").removeClass("active"),
        $(".tabs-container .tabs-item").removeClass("active"),
        $(this).addClass("active"),
        $("." + a).addClass("active"),
        $(".tabs-work-slider").get(0).slick.setPosition(),
        b = 0,
        console.log(b),
        $(".tabs-container .tabs-item").removeClass("open"),
        $(".collapse").addClass("active"),
        $(".height-content").animate({
            height: 467
        }, 1e3, function() {}),
        $(this).find("span").text("открыть"),
        event.preventDefault();
        var c = $(this).data("tads")
          , d = $("." + c).offset().top - 100;
        $("body,html").animate({
            scrollTop: d
        }, 1e3)
    }),
    $(".collapse").on("click", function() {
        if (0 == a()) {
            b = 1,
            console.log(b);
            var c = $(this).prev()
              , d = $(this).data("collapse")
              , e = $("." + d).height() + 100;
            $(".tabs-item").removeClass("open"),
            $(this).parent().addClass("open"),
            $(this).addClass("active"),
            $(c).animate({
                height: e
            }, 1e3, function() {}),
            $(this).find("span").text("скрыть"),
            event.preventDefault();
            var f = $("." + d).offset().top - 100;
            $("body,html").animate({
                scrollTop: f
            }, 1e3)
        } else {
            b = 0,
            console.log(b);
            var c = $(this).prev()
              , d = $(this).data("collapse")
              , e = $("." + d).height();
            $(".tabs-item").removeClass("open"),
            $(this).parent().removeClass("open"),
            $(this).removeClass("active"),
            $(c).animate({
                height: 467
            }, 1e3, function() {}),
            $(this).find("span").text("открыть");
            var f = $("body").offset().top;
            $("body,html").animate({
                scrollTop: f
            }, 1e3)
        }
    }),
    $(".popular-slider").slick({
        infinite: !0,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: '<button class="slick-arrow next"><i class="icon-icon28"></i></button>',
        prevArrow: '<button class="slick-arrow prev"><i class="icon-icon23"></i></button>',
        responsive: [{
            breakpoint: 1280,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                nextArrow: '<button class="slick-arrow next"><i class="icon-icon28"></i></button>',
                prevArrow: '<button class="slick-arrow prev"><i class="icon-icon23"></i></button>'
            }
        }, {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                nextArrow: '<button class="slick-arrow next"><i class="icon-icon28"></i></button>',
                prevArrow: '<button class="slick-arrow prev"><i class="icon-icon23"></i></button>'
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                nextArrow: '<button class="slick-arrow next"><i class="icon-icon28"></i></button>',
                prevArrow: '<button class="slick-arrow prev"><i class="icon-icon23"></i></button>'
            }
        }]
    }),
    $(".our-work-items").slick({
        infinite: !0,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: '<button class="slick-arrow next"><i class="icon-icon25"></i></button>',
        prevArrow: '<button class="slick-arrow prev"><i class="icon-icon22"></i></button>',
        responsive: [{
            breakpoint: 1280,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                nextArrow: '<button class="slick-arrow next"><i class="icon-icon25"></i></button>',
                prevArrow: '<button class="slick-arrow prev"><i class="icon-icon22"></i></button>'
            }
        }, {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                nextArrow: '<button class="slick-arrow next"><i class="icon-icon25"></i></button>',
                prevArrow: '<button class="slick-arrow prev"><i class="icon-icon22"></i></button>'
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                nextArrow: '<button class="slick-arrow next"><i class="icon-icon25"></i></button>',
                prevArrow: '<button class="slick-arrow prev"><i class="icon-icon22"></i></button>'
            }
        }]
    }),
    $(".tabs-work-slider").slick({
        infinite: !0,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: '<button class="slick-arrow next"><i class="icon-icon25"></i></button>',
        prevArrow: '<button class="slick-arrow prev"><i class="icon-icon22"></i></button>',
        responsive: [{
            breakpoint: 1280,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                nextArrow: '<button class="slick-arrow next"><i class="icon-icon25"></i></button>',
                prevArrow: '<button class="slick-arrow prev"><i class="icon-icon22"></i></button>'
            }
        }, {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                nextArrow: '<button class="slick-arrow next"><i class="icon-icon25"></i></button>',
                prevArrow: '<button class="slick-arrow prev"><i class="icon-icon22"></i></button>'
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                nextArrow: '<button class="slick-arrow next"><i class="icon-icon25"></i></button>',
                prevArrow: '<button class="slick-arrow prev"><i class="icon-icon22"></i></button>'
            }
        }]
    }),
    $(window).width() >= 768 && ($(".stages-item .img").matchHeight({
        byRow: !1
    }),
    $(".stages-item .text").matchHeight({
        byRow: !1
    }),
    $(".our-work-item .img").matchHeight({
        byRow: !1
    }),
    $(".our-work-item .name").matchHeight({
        byRow: !1
    }),
    $(".our-work-item .text").matchHeight({
        byRow: !1
    }),
    $(".search-image-item").matchHeight({
        byRow: !1
    })),
    jcf.replaceAll(),
    $(".jcf-fake-input").text("Загрузить фотографии"),
    $(".slider-tabs").on("click", "a", function() {
        var a = $(this).data("tabs");
        $(".slider-tabs a").removeClass("active"),
        $(this).addClass("active"),
        $(".gallery-photo .tabs-item").removeClass("active"),
        $("." + a).addClass("active"),
        $(".interior-slider").get(0).slick.setPosition(),
        $(".ramu-slider").get(0).slick.setPosition(),
        $(".ramu-item .img").matchHeight({
            byRow: !1
        })
    }),
    $(".interior-slider").slick({
        infinite: !0,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: '<a href="javascript:void(0)" class="slick-arrow next"><i class="icon-icon25"></i></a>',
        prevArrow: '<a href="javascript:void(0)" class="slick-arrow prev"><i class="icon-icon22"></i></a>'
    }),
    new jQueryCollapse($(".filter-accordion"),{
        open: function() {
            this.slideDown(200)
        },
        close: function() {
            this.slideUp(200)
        }
    }),
    $(".shapes li a").on("click", function() {
        $(".shapes li a").removeClass("active"),
        $(this).addClass("active")
    }),
    $(".size li a").on("click", function() {
        $(".size li a").removeClass("active"),
        $(this).addClass("active")
    }),
    $(".modular-shapes li a").on("click", function() {
        $(".modular-shapes li a").removeClass("active"),
        $(this).addClass("active")
    }),
    $(".execution-item").on("click", function() {
        $(".execution-item").removeClass("active"),
        $(this).addClass("active")
    }),
    $(".execution-item .img").matchHeight({
        byRow: !1
    }),
    $(".effects-item").on("click", function() {
        $(".effects-item").removeClass("active"),
        $(this).addClass("active")
    }),
    $(".effects-item .img").matchHeight({
        byRow: !1
    }),
    $(".interior-item").on("click", function() {
        $(".interior-item").removeClass("active"),
        $(this).addClass("active")
    }),
    $(".ramu-item").on("click", function() {
        $(".ramu-item").removeClass("active"),
        $(this).addClass("active")
    }),
    $("#my-range").on("input", function() {}),
    $(".ramu-slider").slick({
        rows: 2,
        infinite: !0,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: '<a href="javascript:void(0)" class="slick-arrow next"><i class="icon-icon25"></i></a>',
        prevArrow: '<a href="javascript:void(0)" class="slick-arrow prev"><i class="icon-icon22"></i></a>'
    }),
    $(".ramu-item .img").matchHeight({
        byRow: !1
    }),
    $(".product-download .jcf-button-content").text("Загрузить"),
    $(".imageFile").change(function() {
        $(".product-download .jcf-extension-png .jcf-button-content").text("+ Х")
    }),
    $(".product-download .img").matchHeight({
        byRow: !1
    })
}),
$(window).resize(function() {
    $(".product-download .img").matchHeight({
        byRow: !1
    })
});
