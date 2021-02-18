(function ($, window, document, undefined) {
  "use strict";

  $(function () {
    // CarClub JS
    
    const checkbox = document.getElementById('drop');
    const icon = document.getElementsByClassName('ccnav__icon');
    
    checkbox.addEventListener('change', () => {
      checkbox.classList.toggle('is-active');
      console.log('test');
    });

  });

})(jQuery, window, document);
