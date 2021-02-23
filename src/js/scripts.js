(function (window, document, undefined) {
    'use strict';

    // CarClub JS

    const checkbox = document.getElementById('drop');
    const nav = document.getElementById('ccnav');
    const sticky = nav.offsetTop;

    checkbox.addEventListener('change', () => {
        nav.classList.toggle('is-active');
    });

    window.addEventListener('scroll', () => {

        if ( window.pageYOffset >= sticky ) {

            nav.classList.add('sticky');
            nav.setAttribute('style', 'margin-top:-' + sticky + 'px');

        } else {

            nav.classList.remove('sticky');
            nav.removeAttribute('style');

        }

    });


})(window, document);
