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

    // COUNTER NUMBER
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const one = document.getElementById("box-number-one");
    animateValue(one, 0, 100, 5000);

    const two = document.getElementById("box-number-two");
    animateValue(two, 0, 12, 2000);

    const three = document.getElementById("box-number-three");
    animateValue(three, 0, 80, 4000);

})(window, document);
