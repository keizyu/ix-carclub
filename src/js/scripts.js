import Swiper, { Pagination, Autoplay } from 'swiper/core';
import Pristine from 'pristinejs';
import axios from 'axios';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';

(function (window, document, undefined) {
    'use strict';

    // CarClub JS

    ////////////// ACTIVE SUBMENU

    const checkbox = document.getElementById('burger');
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
            let timer = boxNumbers[i].getAttribute('data-timer');

            animateValue(boxNumbers[i], 0, numberValue, timer);

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


    // print year in footer
    const fullYear = new Date().getFullYear();
    document.getElementById('getFullYear').innerHTML = fullYear;

    // get Bing Map

    const mapContainer = document.getElementById('map');

    function getMap() {

        let map = new Microsoft.Maps.Map('#map', {
            credentials: 'Alqx3peKgY_8B05zrSse0rDrgzAF9hoQ7hIDk1r8MVx9BO_4Pnk7n8FfGXXWWIdO',
            center: new Microsoft.Maps.Location(9.994938,-84.170544),
            zoom: 15,
            mapTypeId: Microsoft.Maps.MapTypeId.grayscale,
            disableScrollWheelZoom: true
        });

        let center = map.getCenter();

        //Create custom Pushpin
        let pin = new Microsoft.Maps.Pushpin(center, {
            title: 'CarClub',
            subTitle: 'Firestone Costa Rica',
            icon: '/assets/img/marker.svg',
        });

        //Add the pushpin to the map
        map.entities.push(pin);

    }

    ////////////// RECAPTCHA

    const recaptchaSiteKey = {
        local: '6LcSiY0aAAAAACubiKkvXX2ALO39D-fvUvGAAiOA',
        lower: '6Le1_JIbAAAAAMQlU__Tg8jRRTOLhDgHKbGN1zB1',
        production: '6Lf4seMUAAAAAJyAHQ9h2MAfO1OqxKxAfpX1iWl0'
    };

    const host = window.location.hostname;

    const envSiteKey =  ( host === 'carclub.firestone.co.cr' ) ? recaptchaSiteKey.production : (

        ( host === 'cwh-int-cc.firestone.co.cr' || host === 'cwh-qa-cc.firestone.co.cr' || host === 'cwh-uat-cc.firestone.co.cr' ) ? recaptchaSiteKey.lower : recaptchaSiteKey.local

    );


    function loadRecaptchaScript() {

        let script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=' + envSiteKey;
        document.getElementsByTagName('head')[0].appendChild(script);

    }

    ////////////// ADOBE ANALYTICS

    const adobeAnalitycsLaunch = {
        development: 'launch-9cb07712fb00-development.min.js',
        staging: 'launch-94574e5b35d3-staging.min.js',
        production: 'launch-5a4d91ce7bec.min.js'
    };

    const analyticsEnvSiteKey = ( host === 'carclub.firestone.co.cr' ) ? adobeAnalitycsLaunch.production : (

        ( host === 'cwh-qa-cc.firestone.co.cr' || host === 'cwh-uat-cc.firestone.co.cr' ) ? adobeAnalitycsLaunch.staging : adobeAnalitycsLaunch.development

    );

    function loadAAScript() {

        let tag = document.createElement('script');
        tag.src = '//assets.adobedtm.com/299b6e905c1c/932274dd5c4b/' + analyticsEnvSiteKey;
        tag.async = true;
        document.getElementsByTagName('head')[0].appendChild(tag);

    }


    ////////////// ZONE

    function loadZoneDependant( provinciaSel,ciudadSel,barrioSel ) {

        let stateObject = {
            'San José': {
                'San José': ['El Carmen','Merced','Hospital','Catedral','Zapote','San Fco.De Dos Ríos','Uruca','Mata Redonda','Pavas','Hatillo','San Sebastián'],
                'Escazú': ['Escazú','San Antonio','San Rafael'],
                'Desamparados': ['Desamparados','San Miguel','San Juan De Dios','San Rafael Arriba','San Antonio','Frailes','Patarrá','San Cristóbal','Rosario','Damas','San Rafael Abajo','Gravilias'],
                'Puriscal': ['Santiago'],
                'Aserrí': ['Aserrí','Tarbaca','Vuelta De Jorco','San Gabriel','Legua','Monterrey','Salitrillos'],
                'Mora': ['Colón','Guayabo','Tabarcia','Piedras Negras','Picagres'],
                'Goicoechea': ['Guadalupe','San Francisco','Calle Blancos','Mata De Plátano','Ipís','Rancho Redondo'],
                'Santa Ana': ['Santa Ana','Salitral','Pozos','Uruca','Piedades','Brasil'],
                'Alajuelita': ['Alajuelita','San Josécito','San Antonio','Concepción','San Felipe'],
                'Vázquez de Coronado':['San Isidro','San Rafael','Dulce Nombre De Jesús','Patalillo','Cascajal'],
                'Acosta': ['San Ignacio','Guaitíl','Palmichal','Cangrejal','Sabanillas'],
                'Tibás': ['San Juan','Cinco Esquinas','Anselmo Llorente','Colima'],
                'Moravia': ['San Vicente','San Jerónimo','Trinidad'],
                'Montes De Oca': ['San Pedro','Sabanilla','Mercedes','San Rafael'],
                'Turrubares': ['San Pablo','San Pedro','San Juan De Mata','San Luis'],
                'Curridabat': ['Curridabat','Granadilla','Sánchez','Tirrases'],
                'Pérez Zeledón': ['San Isidro De El General','General']
            },
            'Alajuela': {
                'Alajuela': ['Alajuela','San José','Carrizal','San Antonio','Guácima','San Isidro','Sabanilla','San Rafael','Río Segundo','Desamparados','Turrúcares','Tambor','La Garita','Sarapiquí'],
                'San Ramón': ['San Ramón'],
                'Grecia': ['Grecia','San Isidro','San José','San Roque','Tacares','Río Cuarto','Puente De Piedra'],
                'Atenas': ['Atenas'],
                'Naranjo': ['Naranjo'],
                'Palmares': ['Palmares'],
                'Poas': ['San Pedro'],
                'Orotina': ['Orotina','Coyolar'],
                'San Carlos': ['Quesada'],
                'Alfaro Ruiz': ['Zarcero','Laguna','Tapezco','Zapote'],
                'Valverde Vega': ['Sarchí Norte','Sarchí Sur']
            },
            'Cartago': {
                'Cartago': ['Oriental','Occidental','Carmen','San Nicolás','Aguacaliente  O  San Fco.','Guadalupe O Arenilla','Corralillo','Tierra Blanca','Dulce Nombre','Llano Grande','Quebradilla'],
                'Paraíso': ['Paraíso','Santiago','Orosi','Cachí'],
                'La Unión': ['Tres Ríos','San Diego','San Juan','San Rafael','Concepción','Dulce Nombre','San Ramón','Jiménez','Juan Viñas','Tucurrique','Pejibaye'],
                'Turrialba': ['Turrialba'],
                'Alvarado': ['Pacayas','Cervantes','Capellades'],
                'Oreamuno': ['San Rafael','Cot','Potrero Cerrado'],
                'El Guarco': ['El Tejar','San Isidro']
            },
            'Heredia': {
                'Heredia': ['Heredia','Mercedes','San Francisco','Ulloa','Vara Blanca'],
                'Barva': ['Barva','San Pedro','San Pablo','San Roque','Santa Lucía','San José De La Montaña'],
                'Santo Domingo': ['Santo Domingo','San Vicente','San Miguel','Paracito','Santo Tomás','Santa Rosa','Tures','Pará'],
                'Santa Barbara': ['Santa Bárbara','San Pedro','San Juan','Jesús','Santo Domingo','Purabá'],
                'San Rafael': ['San Rafael','San Josécito','Santiago','Angeles','Concepción'],
                'San Isidro': ['San Isidro','San José','Concepción','San Francisco'],
                'Belén': ['San Antonio','Rivera','Asunción'],
                'Flores': ['San Joaquín','Barrantes','Llorente'],
                'San Pablo': ['San Pablo'],
            }
        };

        for (let state in stateObject) {
            provinciaSel.options[provinciaSel.options.length] = new Option(state, state);
        }

        provinciaSel.onchange = function () {
            ciudadSel.length = 1; // remove all options bar first
            barrioSel.length = 1; // remove all options bar first

            if (this.selectedIndex < 1) { return; } // done

            for (let county in stateObject[this.value]) {
                ciudadSel.options[ciudadSel.options.length] = new Option(county, county);
            }

        };

        provinciaSel.onchange(); // reset in case page is reloaded

        ciudadSel.onchange = function () {
            barrioSel.length = 1; // remove all options bar first
            if (this.selectedIndex < 1) { return; } // done

            let cities = stateObject[provinciaSel.value][this.value];
            for (let i = 0; i < cities.length; i++) {
                barrioSel.options[barrioSel.options.length] = new Option(cities[i], cities[i]);
            }
        };

    }


    window.addEventListener('load', () => {

        const contactForm = document.getElementById('contact-form');
        const scheduleForm = document.getElementById('schedule-form');

        // submit loader
        const submitbtn = document.getElementById('submitbtn');
        let loader = document.createElement('div');
        loader.className = 'loader';

        ////////////// CONTACT US FORM HANDLER

        if ( mapContainer ) {
            getMap();
        }

        loadAAScript();

        if ( contactForm ) {

            loadRecaptchaScript();

            let pristine = new Pristine(contactForm);

            contactForm.addEventListener('submit', e => {

                e.preventDefault();

                // check if the form is valid
                let isValid = pristine.validate();

                if ( isValid ) {

                    submitbtn.setAttribute('disabled', 'disabled');
                    submitbtn.innerHTML = '';
                    submitbtn.appendChild(loader);

                    let firstName = document.getElementById('firstName').value;
                    let lastName = document.getElementById('lastName').value;
                    let phone = document.getElementById('phone').value;
                    let emailId = document.getElementById('emailId').value;
                    let reasonNodePath = document.getElementById('reasonNodePath').value;
                    let comments = document.getElementById('comments').value;
                    let privacy = document.getElementById('privacy').checked;
                    let country = document.getElementsByTagName('html')[0].getAttribute('data-country');

                    grecaptcha.ready( () => {

                        grecaptcha.execute( envSiteKey, { action: 'submit' } ).then( token => {

                            let options = {
                                method: 'POST',
                                url: '/batoforms/cc/v1/service/contactus',
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

                                    if (parseInt(res.status) === 200 ) {
                                        window.location = '/gracias';
                                    }

                                })
                                .catch( err => {
                                    console.error(err);

                                    submitbtn.removeAttribute('disabled');
                                    submitbtn.innerHTML = 'Enviar';

                                    if ( parseInt(err.status) === 500 ) {
                                        window.alert(err.message);
                                    } else {
                                        window.alert('Hubo un error, por favor intente de nuevo más tarde');
                                    }

                                });

                        });

                    });


                }

            });


        }

        ////////////// SCHEDULE AN APPOINTMENT FORM HANDLER


        if (scheduleForm) {

            const provinciaSel = document.getElementById('provinciaSel'),
                ciudadSel = document.getElementById('ciudadSel'),
                barrioSel = document.getElementById('barrioSel');

            loadRecaptchaScript();
            loadZoneDependant( provinciaSel,ciudadSel,barrioSel );

            let pristine = new Pristine(scheduleForm);

            const dateEl = document.getElementById('date'),
                  timeEl = document.getElementById('time');

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

            const workshop = document.getElementById('serviceWorkshop'),
                  tallerServices = document.getElementById('tallerServices'),
                  movilServices = document.getElementById('movilServices');

            const zoneArr = document.querySelectorAll('#zone select');

            const movilServicesChksArr = document.querySelectorAll('div.movilServicesChksArr input[type=checkbox]'),
                  movilServicesChksError = document.getElementById('movilServicesChksError'),
                  movilServicesChksParent = document.getElementById('movilServicesChksParent');

            const tallerServicesChksArr = document.querySelectorAll('div.tallerServicesChksArr input[type=checkbox]'),
                  tallerServicesChksError = document.getElementById('tallerServicesChksError');


            // Show/hide taller or movil services checkboxes
            workshop.addEventListener('change', () => {

                if(workshop.value === 'taller') {

                    tallerServices.classList.add('selectedType');
                    movilServices.classList.remove('selectedType');
                    [].slice.call(zoneArr).map( el => el.removeAttribute('required') );
                    [].slice.call(tallerServicesChksArr).map( el => el.setAttribute('required', 'true') );
                    [].slice.call(movilServicesChksArr).map( el => el.removeAttribute('required') );

                } else if (workshop.value === 'movil') {

                    tallerServices.classList.remove('selectedType');
                    movilServices.classList.add('selectedType');
                    [].slice.call(zoneArr).map( el => el.setAttribute('required', 'true') );
                    [].slice.call(tallerServicesChksArr).map( el => el.removeAttribute('required') );
                    [].slice.call(movilServicesChksArr).map( el => el.setAttribute('required', 'true') );

                        provinciaSel.addEventListener('change', e => {

                            if ( e.target.value !== '' ) {
                                ciudadSel.removeAttribute('disabled');
                            } else {
                                ciudadSel.setAttribute('disabled','disabled');
                                barrioSel.setAttribute('disabled','disabled');
                            }

                        });

                        ciudadSel.addEventListener('change', e => {

                            if ( e.target.value !== '' ) {
                                barrioSel.removeAttribute('disabled');
                            } else {
                                barrioSel.setAttribute('disabled','disabled');
                            }

                        });

                } else {

                    tallerServices.classList.remove('selectedType');
                    movilServices.classList.remove('selectedType');
                    [].slice.call(zoneArr).map( el => el.removeAttribute('required') );
                    [].slice.call(tallerServicesChksArr).map( el => el.removeAttribute('required') );
                    [].slice.call(movilServicesChksArr).map( el => el.removeAttribute('required') );

                }

            });

            scheduleForm.addEventListener('submit', e => {

                e.preventDefault();

                // check if the form is valid
                let isValid = pristine.validate();

                let zoneValid;

                [].slice.call(zoneArr).map( el => {

                        if ( el.hasAttribute('required') && el.value === '' ) {

                            const mainDiv = el.parentNode.closest('.form-group');
                            // zoneError.setAttribute('style','display:block');
                            mainDiv.classList.remove('has-success');
                            mainDiv.classList.add('has-danger');

                            el.addEventListener('change', (e) => {

                                if (e.target.value === '') {

                                    mainDiv.classList.remove('has-success');
                                    mainDiv.classList.add('has-danger');

                                } else {

                                    mainDiv.classList.remove('has-danger');
                                    mainDiv.classList.add('has-success');

                                }

                            }, false);

                            zoneValid = false;

                        } else {

                            zoneValid = true;

                        }

                });


                // movil checkboxes validation
                const isMovilServicesRequired = [].slice.call(movilServicesChksArr).map( el => el.hasAttribute('required') );
                const isMovilServicesChecked = [].slice.call(movilServicesChksArr).filter(chk => chk.checked);
                let isMovilServicesValid;

                if ( isMovilServicesRequired[0] && isMovilServicesChecked.length < 1 ) {

                    movilServicesChksError.setAttribute('style','display:block');
                    movilServicesChksParent.classList.remove('has-success');
                    movilServicesChksParent.classList.add('has-danger');

                    isMovilServicesValid = false;

                } else {

                    isMovilServicesValid = true;

                }

                let checkboxArray = Array.from( movilServicesChksArr );

                function confirmMovilCheck() {

                    let isAnyChecked = [].slice.call(movilServicesChksArr).filter(chk => chk.checked);

                    if ( isAnyChecked.length > 0 ) {
                        movilServicesChksError.setAttribute('style','display:none');
                        movilServicesChksParent.classList.add('has-success');
                        movilServicesChksParent.classList.remove('has-danger');
                    } else {
                        movilServicesChksError.setAttribute('style','display:block');
                        movilServicesChksParent.classList.remove('has-success');
                        movilServicesChksParent.classList.add('has-danger');
                    }

                }

                checkboxArray.forEach( checkbox => {
                    checkbox.addEventListener('change', confirmMovilCheck);
                });


                // taller checkboxes validation
                const isTallerServicesRequired = [].slice.call(tallerServicesChksArr).map( el => el.hasAttribute('required') );
                const isTallerServicesChecked = [].slice.call(tallerServicesChksArr).filter(chk => chk.checked);
                let isTallerServicesValid;

                if ( isTallerServicesRequired[0] && isTallerServicesChecked.length < 1 ) {

                    tallerServicesChksError.setAttribute('style','display:block');
                    tallerServices.classList.remove('has-success');
                    tallerServices.classList.add('has-danger');

                    isTallerServicesValid = false;

                } else {

                    isTallerServicesValid = true;

                }

                let tallerCheckboxArray = Array.from( tallerServicesChksArr );

                function confirmTallerCheck() {
                    let isAnyChecked = [].slice.call(tallerServicesChksArr).filter(chk => chk.checked);

                    if ( isAnyChecked.length > 0 ) {
                        tallerServicesChksError.setAttribute('style','display:none');
                        tallerServices.classList.add('has-success');
                        tallerServices.classList.remove('has-danger');
                    } else {
                        tallerServicesChksError.setAttribute('style','display:block');
                        tallerServices.classList.remove('has-success');
                        tallerServices.classList.add('has-danger');
                    }

                }

                tallerCheckboxArray.forEach( checkbox => {
                    checkbox.addEventListener('change', confirmTallerCheck);
                });


                if ( isValid && zoneValid && isMovilServicesValid && isTallerServicesValid ) {

                    submitbtn.setAttribute('disabled', 'disabled');
                    submitbtn.innerHTML = '';
                    submitbtn.appendChild(loader);

                    let serviceWorkshop = (workshop.value === 'taller') ? 'Taller de CarClub Firestone' : (workshop.value === 'movil') ? 'Taller a Domicilio (CarClub Móvil)' : 'Undefined type of service';
                    let firstName = document.getElementById('firstName').value;
                    let lastName = document.getElementById('lastName').value;
                    let phone = document.getElementById('phone').value;
                    let emailId = document.getElementById('emailId').value;
                    let comments = document.getElementById('comments').value;
                    let privacy = document.getElementById('privacy').checked;
                    let date = document.getElementById('date').value;
                    let time = document.getElementById('time').value;
                    let zone = (workshop.value === 'movil') ? (provinciaSel.value + ', ' + ciudadSel.value + ', ' + barrioSel.value + '.') : '';
                    const textInputs = document.querySelectorAll('div.selectedType input[type=checkbox]:checked');
                    let typeOfService = [].slice.call(textInputs).map( el => el.value).join(', ');
                    let country = document.getElementsByTagName('html')[0].getAttribute('data-country');

                    grecaptcha.ready( () => {

                        grecaptcha.execute( envSiteKey, { action: 'submit' } ).then( token => {

                            let options = {
                                method: 'POST',
                                url: '/batoforms/cc/v1/service/appointment',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                data: {
                                    firstName: firstName,
                                    lastName: lastName,
                                    phone: phone,
                                    emailId: emailId,
                                    serviceWorkshop: serviceWorkshop,
                                    zone: zone,
                                    typeOfService: typeOfService,
                                    date: date,
                                    time: time,
                                    comments: comments,
                                    privacy: privacy,
                                    country: country,
                                    recaptchaResponse: token,
                                }
                            };

                            axios.request(options)
                                .then( res => {

                                    if (parseInt(res.status) === 200 ) {

                                        window.location = '/gracias';

                                    }

                                })
                                .catch( err => {

                                    console.error(err);
                                    submitbtn.removeAttribute('disabled');
                                    submitbtn.innerHTML = 'Enviar';

                                    if ( parseInt(err.status) === 500 ) {

                                        window.alert(err.message);

                                    } else {

                                        window.alert('Hubo un error, por favor intente de nuevo más tarde');

                                    }

                                });

                        });

                    });


                }

            });
        }

    });

})(window, document);
