import Swiper, { Pagination, Autoplay } from 'swiper/core';
import Pristine from 'pristinejs';
import axios from 'axios';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';

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


    ////////////// RECAPTCHA

    const recaptchaSiteKey = {
        local: '6LcSiY0aAAAAACubiKkvXX2ALO39D-fvUvGAAiOA',
        lower: '6LctO5AaAAAAAHvJwNg5ACfXnC30xBpse04JfWQ_',
        production: 'PROD KEY'
    };

    const host = window.location.hostname;

    const envSiteKey =  ( host === 'carclub.firestone.co.cr' ) ? recaptchaSiteKey.production : (

        ( host === 'cwh-int-cc.firestone.co.cr' || host === 'cwh-qa-cc.firestone.co.cr' || host === 'cwh-uat-cc.firestone.co.cr' ) ? recaptchaSiteKey.lower : recaptchaSiteKey.local

    );

    console.log('recaptchaSiteKey ----->', envSiteKey);

    function loadRecaptchaScript() {

        let script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=' + envSiteKey;
        document.getElementsByTagName('head')[0].appendChild(script);

    }


    window.addEventListener('load', () => {

        const contactForm = document.getElementById('contact-form');
        const scheduleForm = document.getElementById('schedule-form');

        ////////////// CONTACT US FORM HANDLER

        if ( contactForm ) {

            loadRecaptchaScript();

            let pristine = new Pristine(contactForm);

            contactForm.addEventListener('submit', e => {

                e.preventDefault();

                // check if the form is valid
                let isValid = pristine.validate();

                if ( isValid ) {

                    let firstName = document.getElementById('firstName').value;
                    let lastName = document.getElementById('lastName').value;
                    let phone = document.getElementById('phone').value;
                    let emailId = document.getElementById('emailId').value;
                    let reasonNodePath = document.getElementById('reasonNodePath').value;
                    let comments = document.getElementById('comments').value;
                    let privacy = document.getElementById('privacy').checked;
                    let country = document.getElementsByTagName('html')[0].getAttribute('data-country');

                    // console.log( firstName, lastName, phone, emailId, reasonNodePath, comments, privacy );

                    grecaptcha.ready( () => {

                        grecaptcha.execute( envSiteKey, { action: 'submit' } ).then( token => {

                            console.log('g-recaptcha-response --->', token);

                            let options = {
                                method: 'POST',
                                url: 'https://ix-dev.firestonetire.com/batoforms/cc/v1/service/contactus',
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
                                    recaptchaResponse: token,
                                    country: country
                                }
                            };

                            axios.request(options)
                                .then( res => {
                                    // console.log(res.data);

                                    if (parseInt(res.status) === 200 ) {
                                        window.location = '/gracias.html';
                                    }

                                })
                                .catch( err => {
                                    console.error(err);

                                    if ( parseInt(err.status) === 500 ) {
                                        alert(err.message)
                                    } else {
                                        alert("Hubo un error, por favor intente de nuevo más tarde")
                                    }

                                });

                        });

                    });


                }

            });


        }

        ////////////// SCHEDULE AN APPOINTMENT FORM HANDLER

        if (scheduleForm) {

            loadRecaptchaScript();

            let pristine = new Pristine(scheduleForm);

            const dateEl = document.getElementById('date');
            const timeEl = document.getElementById('time');

            flatpickr( dateEl, {
                dateFormat: 'D j F, Y',
                locale: Spanish,
                monthSelectorType: 'static',
                minDate: new Date().fp_incr(1),
                disable: [ d => {
                    // disable sundays and enable only current year
                    const currentYear = new Date().getFullYear();
                    return ( d.getDay() === 0 || d.getFullYear() > currentYear );
                }]
            });

            flatpickr( timeEl, {
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
                minTime: '08:00',
                maxTime: '17:00'
            });

            scheduleForm.addEventListener('submit', e => {

                e.preventDefault();

                // check if the form is valid
                let isValid = pristine.validate();

                let serviceWorkshop = document.getElementById('serviceWorkshop').value;
                let firstName = document.getElementById('firstName').value;
                let lastName = document.getElementById('lastName').value;
                let phone = document.getElementById('phone').value;
                let emailId = document.getElementById('emailId').value;
                let comments = document.getElementById('comments').value;
                let privacy = document.getElementById('privacy').checked;
                let date = document.getElementById('date').value;
                let time = document.getElementById('time').value;

                console.log('DATA ---->: ', serviceWorkshop,firstName,lastName,phone,emailId,comments,date,time,privacy);

                const textInputs = document.querySelectorAll('div.typeOfService input[type=checkbox]:checked');

                // comma separated list checkboxes values
                let typeOfService = [].slice.call(textInputs).map( el => el.value).join(', ');

                console.log('comma separated list checkboxes values --->', typeOfService);

            });
        }

    });


})(window, document);
