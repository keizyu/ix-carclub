(function ($, window, document, undefined) {
  "use strict";

  $(function () {
    // CarClub JS
    
    const checkbox = document.getElementById('drop');
    const icon = document.getElementsByClassName('ccnav__icon');
    
    checkbox.addEventListener('change', function(){
      checkbox.classList.toggle('is-active');
    });

  });

})(jQuery, window, document);
