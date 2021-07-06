$(function() {
    $('.slider .owl-carousel').owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        navText: [],
        dots: false,
        responsive: {
            0: {
                items: 1,
                dots: true,
                nav: false
            },
            481: {
                items: 1
            }
        }
    })
    
    $('.featured .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        navText: [],
        dots: false,
        responsive: {
            0: {
                items: 1,
            },
            480: {
                items: 2
            },
            680: {
                items: 3
            },
            1024: {
                items: 4
            }
        }
    })
})