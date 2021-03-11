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

    const config = {
        type: 'carousel',
        startAt: 0,
        perView: 1
    }
    new Glide('.glide', config).mount()
    // CAROUSEL
    // let slidePosition = 0;
    // const slides = document.getElementsByClassName('carousel__item');
    // const totalSlides = slides.length;

    // document
    //     .getElementById('carousel__button--next')
    //     .addEventListener('click', () => moveToNextSlide())

    // document
    //     .getElementById('carousel__button--prev')
    //     .addEventListener('click', () => moveToPrevSlide())
    
    // function updateSlidePosition(){
    //     for(let slide of slides){
    //         slide.classList.remove('carousel__item--visible')
    //         slide.classList.add('carousel__item--hidden')
    //     }
        
    //     slides[slidePosition].classList.add('carousel__item--visible')
    // }
        
    // function moveToNextSlide(){
    //     slidePosition === totalSlides - 1 ? slidePosition = 0 : slidePosition++
        
    //     updateSlidePosition()
    // }
        
    // function moveToPrevSlide(){
    //     slidePosition === 0 ? slidePosition = totalSlides - 1 : slidePosition--
        
    //     updateSlidePosition()
    // }

})(window, document);
