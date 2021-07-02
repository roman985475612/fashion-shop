$(function() {
    $('.owl-carousel').owlCarousel({
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
})