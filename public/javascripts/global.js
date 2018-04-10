$( document ).ready(() => {
    $( '.step-scroll' ).click(function(e) {
        // stop url
        e.preventDefault();

        // handle active
        $( '.nav-pills .nav-step' ).removeClass('active');
        $( this ).parent().addClass('active');

        // handle scrolling
        let element_id = $( this ).attr('href');
        document
        .getElementById(element_id)
        .scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});
