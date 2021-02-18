(function ($, window, document, undefined) {
  "use strict";

  $(function () {
    // CarClub JS
    
    const checkbox = document.getElementById('drop');
    const nav = document.getElementById('ccnav');
    
    checkbox.addEventListener('change', () => {
      nav.classList.toggle('is-active');
      console.log('test');
    });

  });

})(jQuery, window, document);
