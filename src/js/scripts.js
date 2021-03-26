import Swiper, { Pagination, Autoplay } from 'swiper/core';
import axios from 'axios';

(function (window, document, undefined) {
    'use strict';

    // CarClub JS

    ////////////// ACTIVE SUBMENU

    const checkbox = document.getElementById('drop');
    const nav = document.getElementById('ccnav');

    checkbox.addEventListener('change', () => {
        nav.classList.toggle('is-active');
    });

    ////////////// STICKY HEADER

    const sticky = nav.offsetTop;

    window.addEventListener('scroll', () => {

        if ( window.pageYOffset >= sticky ) {

            nav.classList.add('sticky');
            nav.setAttribute('style', 'margin-top:-' + sticky + 'px');

        } else {

            nav.classList.remove('sticky');
            nav.removeAttribute('style');

        }

    });

    ////////////// COUNTER NUMBER

    const boxNumbers = document.getElementsByClassName('box-number');

    function animateValue(obj, start, end, duration) {

        let startTimestamp = null;

        const step = (timestamp) => {

            startTimestamp = startTimestamp ? timestamp : null;

            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);

    }

    if ( boxNumbers.length > 0 ) {

        for (let i = 0; i < boxNumbers.length; i++) {

            let numberValue = boxNumbers[i].getAttribute('data-number');

            animateValue(boxNumbers[i], 0, numberValue, 5000);

        }

    }

    ////////////// SLIDER

    Swiper.use([Pagination,Autoplay]);

    new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 5000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },

    });

    ////////////// ANIMATION ON ELEMENT

    const target = document.getElementsByClassName('animated');

    function handleIntersection(entries) {

        entries.map( entry => {
            if ( entry.isIntersecting ) {
                entry.target.classList.add('visible');
            }
            // else {
            //     entry.target.classList.remove('visible')
            // }
        });
    }

    // Check if the elements are in viewport

    const observer = new IntersectionObserver(handleIntersection);

    [].slice.call(target).forEach( el => {
        observer.observe(el);
    });


    ////////////// INSTERT RECAPTCHA SCRIPT TAG

    const recaptchaSiteKey = '6LcSiY0aAAAAACubiKkvXX2ALO39D-fvUvGAAiOA';

    function loadRecaptchaScript() {

        let script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=' + recaptchaSiteKey;
        document.getElementsByTagName('head')[0].appendChild(script);

    }

    ////////////// CONTACT US FORM HANDLER

    window.addEventListener('load', () => {

        const contactForm = document.getElementById('contact-form');

        if ( contactForm ) {

            loadRecaptchaScript();

            contactForm.addEventListener('submit', e => {

                e.preventDefault();

                let firstName = document.getElementById('firstName').value;
                let lastName = document.getElementById('lastName').value;
                let phone = document.getElementById('phone').value;
                let emailId = document.getElementById('emailId').value;
                let reasonNodePath = document.getElementById('reasonNodePath').value;
                let comments = document.getElementById('comments').value;
                let privacy = document.getElementById('privacy').checked;

                console.log( firstName, lastName, phone, emailId, reasonNodePath, comments, privacy );

                grecaptcha.ready( () => {

                    grecaptcha.execute( recaptchaSiteKey, { action: 'submit' } ).then( token => {

                        console.log('g-recaptcha-response --->', token);

                        let options = {
                            method: 'POST',
                            url: 'http://bsa-latam.icrossing.com:8080/batoforms/cc/v1/service/contactus',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: {
                                firstName: firstName,
                                lastName: lastName,
                                phone: phone,
                                emailId: emailId,
                                reasonNodePath: reasonNodePath,
                                comments: comments,
                                privacy: privacy,
                                recaptcha: true
                            }
                        };

                        axios.request(options)
                            .then( res => {
                                console.log(res.data);
                                window.location = "/gracias.html"
                            })
                            .catch( err => {
                                console.error(err);
                            });

                    });

                });

            });

        }

    });

    ////

})(window, document);
