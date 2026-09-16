(function ($, Drupal) {
  Drupal.behaviors.seoBotHider = {
    attach: function (context, settings) {
      // Define common search engine crawler patterns
      const crawlerList = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i;

      // Detect User Agent
      if (crawlerList.test(navigator.userAgent)) {
        // Execute only once per page load
        $(document, context).once('seoBotHider').each(function () {
          const popup = document.getElementById('popup');
          if (popup) {
            // Remove popup visually and from layout
            popup.style.display = 'none';
            popup.style.visibility = 'hidden';
            popup.classList.remove('show');
            
            // Unlock body if it was frozen by a modal open class
            document.body.classList.remove('modal-open');
          }
        });
      }
    }
  };
})(jQuery, Drupal);