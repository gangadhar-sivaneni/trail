(function ($, Drupal) {
  Drupal.behaviors.myCustomBehavior = {
    attach: function (context, settings) {
      $(document).ready(function() {
      function showTab(index) {
        $(".tab_btn_button_aims, .tab_content_aims").removeClass("active");
        $(".tab_btn_button_aims").eq(index).addClass("active");
        $(".tab_content_aims").eq(index).addClass("active");
        $(".tab_btn_button_aims").eq(index)[0].scrollIntoView({
          behavior: "smooth",
          inline: "center",
           block: "nearest"
        });
        updateButtons(index);
      }

      function updateButtons(index) {
        $(".prev_tab_btn_aims").prop("disabled", index === 0);
        $(".next_tab_btn_aims").prop("disabled", index === $(".tab_btn_button_aims").length - 1);
      }

      $(".tab_btn_button_aims").click(function() {
        let index = $(this).index();
        showTab(index);
      });

      $(".next_tab_btn_aims").click(function() {
        let index = $(".tab_btn_button_aims.active").index();
        if (index < $(".tab_btn_button_aims").length - 1) {
          showTab(index + 1);
        }
        console('');
      });

      $(".prev_tab_btn_aims").click(function() {
        let index = $(".tab_btn_button_aims.active").index();
        if (index > 0) {
          showTab(index - 1);
        }
        console('');
      });
      updateButtons(0);
    });
    }
  };
})(jQuery, Drupal);