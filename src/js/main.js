$(function() {
    // Search
    $( '.search' ).on( 'click', function( event ) {
        event.preventDefault()
        event.stopPropagation()
        $( this ).addClass( 'search--active' )
    })

    $( '.search__btn-img' ).on( 'click', function() {
        $( '.search' ).submit()
    })

    $( 'body' ).on( 'click', function () {
        $( '.search' ).removeClass( 'search--active' )
    })

    $( '.slider .owl-carousel' ).owlCarousel({
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
    
    $( '.featured .owl-carousel' ).owlCarousel({
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