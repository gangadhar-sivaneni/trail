(function ($, Drupal, once) {
  Drupal.behaviors.addCheckboxGridClass = {
    attach: function (context, settings) {

      const currentPath = window.location.pathname.replace(/\/$/, '');
      once('link-bottom-strip', 'a.link_bottom_strip', context).forEach((link) => {
        const linkPath = new URL(link.href).pathname.replace(/\/$/, '');

        if (linkPath === currentPath) {
          link.classList.add('active');
        }
      });

     if (window.innerWidth >= 1199) {
        document.querySelectorAll('.nav-menu ')
          .forEach(item => {
            item.addEventListener('mouseenter', () => {
              document.body.classList.add('scroll_remoove');
            });

            item.addEventListener('mouseleave', () => {
              document.body.classList.remove('scroll_remoove');
            });
          });
      } else {
        document.body.classList.remove('scroll_remoove');
      }

    // Use 'once' to ensure event attached only once
    once('mainAccordionToggle', '.doctor-info__map .title_location', context).forEach(function (el) {

      $(el).on('click', function () {
        var target = $(this).attr('data-rel');

        // Remove active from all
        $('.title_location').removeClass('active');

        // Add active to clicked one
        $(this).addClass('active');

        // Show corresponding map_tab_colm
        $("#" + target).fadeIn('slow').siblings(".map_tab_colm").hide();

        return false;
      });

    });


  let attempts = 0;
  const maxAttempts = 20;

  const interval = setInterval(() => {
    attempts++;

    const widget = document.querySelector('eka-med-assist-widget');
    if (!widget || !widget.shadowRoot) return;

    const fixedBox = widget.shadowRoot.querySelector('.fixed.bottom-4');
    if (!fixedBox) return;

    fixedBox.classList.add('custom-chat-position');

    // if (!widget.shadowRoot.querySelector('#custom-chat-style')) {
    //   const style = document.createElement('style');
    //   style.id = 'custom-chat-style';
    //   style.innerHTML = `
    //     .custom-chat-position{
    //     left: 15px !important;
    //     }
    //     .custom-chat-position .text-card-foreground{
    //      min-width:100% !important;
    //     }
    //   `;
    //   widget.shadowRoot.appendChild(style);
    // }

    clearInterval(interval);
  }, 500);





      $('.investor_tab_ul li .investor_tab_link').on('click', function (e) {
        e.preventDefault(); // Default scroll ya jump behavior rokta hai
        var target = $(this).attr('data-rel');
        // Active class toggle
        $('.investor_tab_ul li .investor_tab_link').removeClass('active');
        $(this).addClass('active');
        // Show/Hide content boxes
        $("#" + target).fadeIn('slow').siblings(".investor_tab_output_box").hide();
        // URL hash update (without scroll)
        history.replaceState(null, null, '#' + target);

        return false;
      });
      // --------- Auto open tab from URL ---------
      if ($(window).width() > 990) {
        var hash = window.location.hash.substring(1); // e.g. "tab2"
        if (hash) {
          $('.investor_tab_ul li .investor_tab_link').removeClass('active');
          // Agar hash mil gaya toh usi tab ko active karo
          var $link = $('.investor_tab_ul li .investor_tab_link[data-rel="' + hash + '"]');
          if ($link.length) {
            $link.addClass('active');
            $("#" + hash).show().siblings(".investor_tab_output_box").hide();
          }
        } else {
          // Agar hash nahi hai — toh default first tab active rakho
          var $firstLink = $('.investor_tab_ul li .investor_tab_link').first();
          var firstTarget = $firstLink.attr('data-rel');
          $firstLink.addClass('active');
          $("#" + firstTarget).show().siblings(".investor_tab_output_box").hide();
        }
      }
      $(".investor_detail_box").each(function () {
        const $box = $(this);
        const $tabContainer = $box.find(".tab_menu_list_investor_list");
        const $tabs = $tabContainer.find(".investor_inner_tab_link");
        const $tabContents = $box.find(".tab_list_output_inner_investor");
        const $next = $tabContainer.find(".tab_icon_box_investor_next");
        const $back = $tabContainer.find(".tab_icon_box_investor_back");

        // --- FUNCTION: Show selected tab ---
        function showTab(index) {
          $tabs.removeClass("active");
          $tabContents.hide();

          const $currentTab = $tabs.eq(index);
          const target = $currentTab.attr("data-rel");

          $currentTab.addClass("active");
          $box.find("#" + target).fadeIn("slow");

          // Scroll active tab into view
          $currentTab[0].scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });

          updateButtons(index);
        }

        // --- FUNCTION: Update button states ---
        function updateButtons(index) {
          const total = $tabs.length;

          if (index === 0) {
            $back.css({ opacity: "0", pointerEvents: "none" });
          } else {
            $back.css({ opacity: "1", pointerEvents: "auto" });
          }

          if (index === total - 1) {
            $next.css({ opacity: "0", pointerEvents: "none" });
          } else {
            $next.css({ opacity: "1", pointerEvents: "auto" });
          }
        }

        // --- TAB click ---
        $tabs.on("click", function () {
          const index = $tabs.index(this);
          showTab(index);
        });

        // --- NEXT click ---
        $next.on("click", function () {
          const index = $tabs.index($tabs.filter(".active"));
          if (index < $tabs.length - 1) {
            showTab(index + 1);
          }
        });

        // --- BACK click ---
        $back.on("click", function () {
          const index = $tabs.index($tabs.filter(".active"));
          if (index > 0) {
            showTab(index - 1);
          }
        });

        // --- INIT first tab ---
        const initialIndex = $tabs.filter(".active").first().index() || 0;
        showTab(initialIndex);
      });

      $(once('investorAccordion', '.investor_mobile_title_wrapper', context)).on('click', function () {
        const $desc = $(this).closest('.investor_tab_output_box').find('.investor_detail_box');
        const $desc2 = $(this).closest('.investor_tab_output_box');
        const isVisible = $desc.is(':visible');

        $('.investor_detail_box').slideUp(200);
        $('.investor_tab_output_box').removeClass('active');
        $('.investor_mobile_title_wrapper').removeClass('active');

        if (!isVisible) {
          $desc.stop(true, true).slideDown(200);
          $desc2.addClass('active');
          $(this).addClass('active');

          // ✅ Get parent box ID
          const targetId = $desc2.attr('id');

          // ✅ Update URL hash without scrolling or reload
          if (targetId) {
            history.replaceState(null, null, '#' + targetId);
          }
        }
      });
      // Auto-open accordion from URL hash — only if screen ≤ 990px
      if ($(window).width() <= 990) {
        const hash = window.location.hash.substring(1);
        if (hash) {
          const $targetBox = $('#' + hash + '.investor_tab_output_box');
          if ($targetBox.length) {
            const $title = $targetBox.find('.investor_mobile_title_wrapper');
            const $desc = $targetBox.find('.investor_detail_box');

            $('.investor_detail_box').hide();
            $('.investor_tab_output_box').removeClass('active');
            $('.investor_mobile_title_wrapper').removeClass('active');

            $desc.stop(true, true).slideDown(200);
            $targetBox.addClass('active');
            $title.addClass('active');
          }
        }
      }
    }
  };
$(document).ready(function () {
   if(window.matchMedia("(max-width: 767px)").matches){
 $(window).on("scroll load", function() {
    if ($(window).scrollTop() >= 1300) {
        $('.bottom_sticky_btn_proton').addClass('active');
    } else {
        $('.bottom_sticky_btn_proton').removeClass('active');
    }
});
  }
if(window.matchMedia("(min-width: 992px)").matches){
 $(window).on("scroll load", function() {
    if ($(window).scrollTop() >= 50) {
        $('.header_AIMS_proton').addClass('fixed-header');
    } else {
        $('.header_AIMS_proton').removeClass('fixed-header');
    }
});
}
$(".toggle_btn").click(function () {
    $(".AIMS_navbar_wrapper").toggleClass("active");
  });

$(".nav_link_AIMS_proton").click(function () {
    $(".AIMS_navbar_wrapper").removeClass("active");
});




  const offsetTop = 70;
  $(".nav_link_AIMS_proton").on("click", function (e) {
    e.preventDefault();
    const target = $(this).attr("href");
    $("html, body").animate(
      {
        scrollTop: $(target).offset().top - offsetTop,
      },
      800
    );
    $(".nav_link_AIMS_proton").removeClass("active");
    $(this).addClass("active");
  });

  $(window).on("scroll", function () {
    const scrollPos = $(window).scrollTop();
    let foundActive = false;

    $(".nav_link_AIMS_proton").each(function () {
      const target = $(this).attr("href");
      const section = $(target);

      if (section.length) {
        const sectionTop = section.offset().top - offsetTop - 1;
        const sectionBottom = sectionTop + section.outerHeight();
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          $(".nav_link_AIMS_proton").removeClass("active");
          $(this).addClass("active");
          foundActive = true;
        }
      }
    });
    if (!foundActive) {
      $(".nav_link_AIMS_proton").removeClass("active");
    }
  });



  $(".about_pcc_video_box").each(function () {
    const box = $(this);
    const video = box.find(".videoPlayer_apolo_proton").get(0);

    // Initial hide
    box.find(".video_wrapper_apolo_proton").hide();

    // --- Play from thumbnail ---
    box.find(".play_btn_video_box").on("click", function () {
      box.find(".video_thumbnail_apolo_proton").hide();
      box.find(".video_wrapper_apolo_proton").show();
      video.play();
      box.find(".play_control_apolo_proton").removeClass("active");
      box.find(".pause_control_apolo_proton").addClass("active");
    });

    // --- Play control ---
    box.find(".play_control_apolo_proton").on("click", function () {
      video.play();
      $(this).removeClass("active");
      box.find(".pause_control_apolo_proton").addClass("active");
    });

    // --- Pause control ---
    box.find(".pause_control_apolo_proton").on("click", function () {
      video.pause();
      $(this).removeClass("active");
      box.find(".play_control_apolo_proton").addClass("active");
    });

    // --- Update progress ---
    video.addEventListener("timeupdate", function () {
      const progress = (video.currentTime / video.duration) * 100;
      box.find(".progress-fill_apolo_proton").css("width", progress + "%");
    });

    // --- Click to seek ---
    box.find(".progress_bar_apolo_proton").on("click", function (e) {
      const bar = $(this);
      const offset = e.pageX - bar.offset().left;
      const percent = offset / bar.width();
      video.currentTime = percent * video.duration;
    });

    // --- Video ended ---
    video.addEventListener("ended", function () {
      box.find(".video_wrapper_apolo_proton").hide();
      box.find(".video_thumbnail_apolo_proton").show();
      video.currentTime = 0;
      box.find(".progress-fill_apolo_proton").css("width", "0%");
      box.find(".pause_control_apolo_proton").removeClass("active");
      box.find(".play_control_apolo_proton").addClass("active");
    });
  });

 function activateTab($el) {
  var target = $el.attr('data-rel');
  $('.why_choose_tab_title_list_box .why_choose_tab_title_list').removeClass('active');
  $el.addClass('active');
  $("#" + target).fadeIn('slow').siblings(".tab_output_apolo_proton").hide();
}

// Click event (mobile + desktop)
$('.why_choose_tab_title_list_box .why_choose_tab_title_list').on('click', function() {
  activateTab($(this));
  return false;
});

// Hover event (only for screens ≥ 992px)
if ($(window).width() >= 992) {
  $('.why_choose_tab_title_list_box .why_choose_tab_title_list').on('mouseenter', function() {
    activateTab($(this));
  });
}


      

    if(window.matchMedia("(max-width: 991px)").matches) {
     new Swiper(".why_choose_tab_output_wrapper", {
        slidesPerView: 1,
        spaceBetween: 10,
        autoHeight: true, 
        navigation: {
        nextEl: ".why_choose_AIMS_poroton_next",
        prevEl: ".why_choose_AIMS_poroton_back",
      },
        pagination: {
          el: ".why_choose_AIMS_poroton_pagination",
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
        },
      });
    }

    if(window.matchMedia("(max-width: 767px)").matches) {
     new Swiper(".what_we_except_slider", {
        slidesPerView: 1.2,
        spaceBetween: 10,
        // autoHeight: true, 
        navigation: {
        nextEl: ".what_we_except_next",
        prevEl: ".what_we_except_back",
      },
        pagination: {
          el: ".what_we_except_pagination",
          clickable: true,
        },
      });

      new Swiper(".caner_we_treat_slider", {
        slidesPerView: 1,
        grid: {
          rows: 4,
        },
        navigation: {
          nextEl: ".caner_we_treat_next",
          prevEl: ".caner_we_treat_back",
        },
        spaceBetween: 10,
        pagination: {
          el: ".caner_we_treat_pagination",
          clickable: true,
        },
      });


    }


 new Swiper(".pationt_stories_slider", {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
          nextEl: ".pationt_stories_next",
          prevEl: ".pationt_stories_back",
        },
        pagination: {
          el: ".pationt_stories_pagination",
          clickable: true,
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        },
      });

   if ($(".video_popup_btn").length) {
    $(".video_popup_btn").click(function(e) {
      e.preventDefault();

      var videoSrc = $(this).attr("href");
      var autoplaySrc = videoSrc.includes("?")
        ? videoSrc + "&autoplay=1"
        : videoSrc + "?autoplay=1";

      $(".video-popup-overlay iframe").attr("src", autoplaySrc);
      $(".video-popup-overlay").fadeIn();
      $("body").addClass("overflow-hidden");
    });

    $(".close-video-video_popup, .video-popup-overlay").click(function(e) {
      if ($(e.target).is(".video-popup-overlay, .close-video-video_popup")) {
        $(".video-popup-overlay").fadeOut(function() {
          $(".video-popup-overlay iframe").attr("src", "");
          $("body").removeClass("overflow-hidden");
        });
      }
    });
  }

  // ================================
// Hospitals Swiper
// ================================
const hospitalsSwiper = new Swiper('.hospitals-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    navigation: {
        nextEl: '.hospitals-swiper .swiper-button-next',
        prevEl: '.hospitals-swiper .swiper-button-prev',
    },
    breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
    },
});

// Directions Button Click
document.querySelectorAll('.hospitals-section .directions-btn').forEach(button => {
    button.addEventListener('click', function () {
        const card = this.closest('.hospital-card');
        const hospitalName = card.querySelector('.hospital-name').textContent;
        console.log('Get directions for:', hospitalName);
    });
});

// ================================
// Shared Helpers
// ================================
function getSlidesPerView(swiper) {
    const bp = swiper.currentBreakpoint;
    const bpParams = bp && swiper.params.breakpoints ? swiper.params.breakpoints[bp] : null;
    return bpParams && bpParams.slidesPerView ? bpParams.slidesPerView : swiper.params.slidesPerView;
}

function updateNavState(swiper, nextSel, prevSel, totalSlides) {
    const currentSpv = getSlidesPerView(swiper);
    const needsNav = totalSlides > currentSpv;

    const nextEl = document.querySelector(nextSel);
    const prevEl = document.querySelector(prevSel);
    if (!nextEl || !prevEl) return;

    if (!needsNav) {
        nextEl.classList.add('is-disabled');
        prevEl.classList.add('is-disabled');
        swiper.allowSlideNext = false;
        swiper.allowSlidePrev = false;
    } else {
        nextEl.classList.remove('is-disabled');
        prevEl.classList.remove('is-disabled');
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
    }
}

// ================================
// Testimonials Swiper
// ================================
const testimonialSlidesCount = document.querySelectorAll('.testimonial-swiper .swiper-slide').length;
const testimonialSwiper = new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: testimonialSlidesCount > 1,
    navigation: {
        nextEl: '.testimonial-next',
        prevEl: '.testimonial-prev',
    },
    breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 18 },
        992: { slidesPerView: 2, spaceBetween: 20 },
        1026: { slidesPerView: 3, spaceBetween: 20 },
    },
    on: {
        init(swiper) {
            updateNavState(swiper, '.testimonial-next', '.testimonial-prev', testimonialSlidesCount);
        },
        resize(swiper) {
            updateNavState(swiper, '.testimonial-next', '.testimonial-prev', testimonialSlidesCount);
        },
    },
});

// ================================
// Oncology Swiper
// ================================
const oncologySlidesCount = document.querySelectorAll('.oncology-swiper .swiper-slide').length;
const oncologySwiper = new Swiper('.oncology-swiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: oncologySlidesCount > 1,
    navigation: {
        nextEl: '.oncology-next',
        prevEl: '.oncology-prev',
    },
    breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 18 },
        992: { slidesPerView: 3, spaceBetween: 20 },
    },
    on: {
        init(swiper) {
            updateNavState(swiper, '.oncology-next', '.oncology-prev', oncologySlidesCount);
        },
        resize(swiper) {
            updateNavState(swiper, '.oncology-next', '.oncology-prev', oncologySlidesCount);
        },
    },
});


        // ================================
        // blog swiper
        // ================================
        const blogSlidesCount = document.querySelectorAll('.blog-swiper .swiper-slide').length;
        const blogSwiper = new Swiper('.blog-swiper', {
            slidesPerView: 1,
            spaceBetween: 16,
            loop: blogSlidesCount > 1,
            navigation: {
                nextEl: '.blog-next',
                prevEl: '.blog-prev',
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 18 },
                992: { slidesPerView: 3, spaceBetween: 20 },
            },
            on: {
                init(swiper) {
                    updateNavState(swiper, '.blog-next', '.blog-prev', blogSlidesCount);
                },
                resize(swiper) {
                    updateNavState(swiper, '.blog-next', '.blog-prev', blogSlidesCount);
                },
            },
        });

// ================================
// Video Modal
// ================================
const modal = document.getElementById('videoModal');
const iframe = document.getElementById('videoFrame');
const closeModalBtn = document.getElementById('closeVideoModal');

function openVideo(videoUrl) {
    const hasQuery = videoUrl.includes("?");
    const params = ["autoplay=1", "playsinline=1", "rel=0", "modestbranding=1"];
    const autoplayUrl = `${videoUrl}${hasQuery ? "&" : "?"}${params.join("&")}`;

    iframe.src = autoplayUrl;
    modal.classList.add("active");
}

function closeVideo() {
    modal.classList.remove("active");
    iframe.src = "";
}

// Delegated click (loop mode safe)
['.testimonial-swiper', '.oncology-swiper'].forEach(selector => {
    const container = document.querySelector(selector);
    if (!container) return;

    container.addEventListener("click", (e) => {
        const card = e.target.closest("[data-video]");
        if (!card) return;

        const videoUrl = card.getAttribute("data-video");
        openVideo(videoUrl);
    });
});

// Close modal
closeModalBtn.addEventListener("click", closeVideo);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeVideo();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVideo();
});

});

})(jQuery, Drupal, once);


(function ($, Drupal, once) {
  Drupal.behaviors.mainAccordionToggle = {
    attach: function (context) {

      $(once('mainAccordionToggle', '.accordion-header', context))
        .on('click', function () {

          const $currentHeader = $(this);
          const $currentContent = $currentHeader.next('.accordion-content');
          const $currentArrow = $currentHeader.find('.arrow');

          //  Close all other accordions
          $('.accordion-content', context).not($currentContent).slideUp(300).removeClass('active');
          $('.accordion-header .arrow', context).not($currentArrow).css('transform', 'rotate(0deg)');

          //  Toggle current accordion
          if ($currentContent.hasClass('active')) {
            $currentContent.slideUp(300).removeClass('active');
            $currentArrow.css('transform', 'rotate(0deg)');
          } else {
            $currentContent.slideDown(300).addClass('active');
            $currentArrow.css('transform', 'rotate(0deg)');
          }
        });

    }
  };
})(jQuery, Drupal, once);

(function ($, Drupal, once) {
  Drupal.behaviors.innerAccordionToggle = {
    attach: function (context) {

      $(once('innerAccordionToggle', '.accordion-inner-box', context))
        .on('click', function () {

          const $currentBlock = $(this).closest('.accordion-block');
          const $currentList = $currentBlock.find('.grid-list-acc');

          // Close other inner accordions
          $('.accordion-block .grid-list-acc', context)
            .not($currentList)
            .removeClass('is-open');

          // Toggle current
          $currentList.toggleClass('is-open');
        });
    }
  };
})(jQuery, Drupal, once);

(function ($, Drupal, once) {
  Drupal.behaviors.requestCallbackPopup = {
    attach: function (context) {

      const popupEls = once(
        'requestCallbackPopup',
        '#windowload-request-callback-form',
        context
      );

      if (!popupEls.length) {
        return;
      }

      const $popup = $(popupEls);
      $popup.hide();

      setTimeout(function () {

        if (!$('#request-callback-overlay').length) {
          $('body').append('<div id="request-callback-overlay"></div>');
        }

        $popup.css({
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          display: 'block'
        });

        // Add close button once
        if (!$popup.find('.request-callback-close').length) {
          $popup.append(`
            <button type="button"
              class="request-callback-close ui-button ui-corner-all ui-widget ui-button-icon-only"
              title="Close">
              <span class="ui-button-icon ui-icon ui-icon-closethick"></span>
              <span class="ui-button-icon-space"></span>
            </button>
          `);
        }

      }, 20000);

      // ===============================
      // ✅ CLOSE HANDLERS (NO once())
      // ===============================

      $(document)
        .off('click.requestCallbackClose')
        .on(
          'click.requestCallbackClose',
          '.request-callback-close, .ui-dialog-titlebar-close, .close-button',
          function (e) {
            e.preventDefault();
            closePopup();
          }
        );

      $(document)
        .off('click.requestCallbackOverlay')
        .on('click.requestCallbackOverlay', '#request-callback-overlay', function () {
          closePopup();
        });

      $(document)
        .off('keydown.requestCallbackEsc')
        .on('keydown.requestCallbackEsc', function (e) {
          if (e.key === 'Escape') {
            closePopup();
          }
        });

      function closePopup() {
        $popup.fadeOut();
        $('#request-callback-overlay').remove();
      }
    }
  };
})
(jQuery, Drupal, once);

(function ($, Drupal, once) {
  Drupal.behaviors.requestCallbackDefaultRadio = {
    attach: function (context) {

      const popupEls = once(
        'requestCallbackDefaultRadio',
        '#windowload-request-callback-form',
        context
      );

      if (!popupEls.length) {
        return;
      }

      const $popup = $(popupEls);

      const $healthCheck = $popup.find(
        'input[name="request_type"][value="health_check"]'
      );

      if ($healthCheck.length) {
        $healthCheck.prop('checked', true);
      }

    }
  };
})(jQuery, Drupal, once);

/* Doctor page OTP modificatio start */
(function (Drupal, once) {
  Drupal.behaviors.requestAppointmentOtpFlow = {
    attach(context) {

      once('otp-flow', 'form.doctorr-request-form', context).forEach(function (form) {

        const submitBtn     = form.querySelector('.request-appointment-submit-btn');
        const otpContainer  = form.querySelector('#otp-input-container');
        const otpStageInput = form.querySelector('input[name="otp_stage"]');
        const phoneInput    = form.querySelector('input[name="phone"]');
        const nameInput     = form.querySelector('input[name="name"]');
        const msgContainer  = form.querySelector('.doc-msg-container');

        if (!submitBtn || !otpStageInput || !nameInput || !phoneInput || !msgContainer) {
          return;
        }

        let otpInput = null;

        phoneInput.setAttribute('readonly', 'readonly');
        phoneInput.classList.add('is-locked');

        if (otpContainer) otpContainer.style.display = 'none';

        msgContainer.innerHTML = '';
        msgContainer.style.display = 'none';

        function showMessage(html) {
          msgContainer.innerHTML = html;
          msgContainer.style.display = 'block';
        }

        function clearMessage() {
          msgContainer.innerHTML = '';
          msgContainer.style.display = 'none';
        }

        nameInput.addEventListener('blur', function () {
          if (nameInput.value.trim() === '') {
            showMessage('<div class="request-error">Name field is required.</div>');
          }
        });

      function handleMobileBlocked() {
        if (
          phoneInput.hasAttribute('readonly') &&
          otpStageInput.value === '0' &&
          nameInput.value.trim().length < 2
        ) {
          showMessage('<div class="request-error">Name field is required.</div>');
          nameInput.focus();
        }
      }

        phoneInput.addEventListener('click', handleMobileBlocked);
        phoneInput.addEventListener('focus', handleMobileBlocked);
        nameInput.addEventListener('input', function () {
          if (nameInput.value.trim().length >= 2) {
            phoneInput.removeAttribute('readonly');
            phoneInput.classList.remove('is-locked');
            clearMessage();
          } else {
            phoneInput.setAttribute('readonly', 'readonly');
            phoneInput.classList.add('is-locked');
            phoneInput.value = '';
            clearMessage();
          }
        });

          phoneInput.addEventListener('input', function () {

            if (phoneInput.hasAttribute('readonly')) return;

            let mobile = phoneInput.value.replace(/\D/g, '');
            phoneInput.value = mobile;

            if (mobile.length === 10) {
              clearMessage();
            } else if (mobile.length > 0 && mobile.length !== 10) {
              showMessage('<div class="request-error">Please enter a valid 10-digit mobile number.</div>');
            } else {
              clearMessage();
            }
          });

        form.addEventListener('submit', function (e) {
          if (otpStageInput.value === '0') {
            e.preventDefault();
            return false;
          }
        });
        submitBtn.addEventListener('click', function (e) {

          if (otpStageInput.value === '0') {

            e.preventDefault();
            e.stopImmediatePropagation();

            if (nameInput.value.trim().length < 2) {
              showMessage('<div class="request-error">Name field is required.</div>');
              nameInput.focus();
              return false;
            }

            if (!/^\d{10}$/.test(phoneInput.value.trim())) {
              showMessage('<div class="request-error">Please enter a valid 10-digit mobile number.</div>');
              phoneInput.focus();
              return false;
            }

            const sendOtpBtn = form.querySelector('[data-drupal-selector="edit-send-otp"]');
            sendOtpBtn?.click();

            otpStageInput.value = '1';
            otpContainer.style.display = 'block';

            otpInput = otpContainer.querySelector('input[name="otp"]');
            otpInput?.focus();
              otpInput?.addEventListener('input', function () {

                let otp = otpInput.value.replace(/\D/g, '');
                otpInput.value = otp;

                if (otp.length === 6) {
                  clearMessage();
                } else if (otp.length > 0 && otp.length !== 6) {
                  showMessage('<div class="request-error">Please enter a valid 6-digit OTP.</div>');
                } else {
                  clearMessage();
                }
              });


            return false;
          }

          if (otpStageInput.value === '1') {

            otpInput = otpContainer.querySelector('input[name="otp"]');

            if (!otpInput || !/^\d{6}$/.test(otpInput.value.trim())) {
              e.preventDefault();
              showMessage('<div class="request-error">Please enter a valid 6-digit OTP.</div>');
              otpInput?.focus();
              return false;
            }

          }
        });

      });
    }
  };
})(Drupal, once);
/* Doctor page OTP modificatio end */


//  ADD THIS AT VERY END (LAST LINE)
(function (Drupal) {
  Drupal.AjaxCommands.prototype.delayedRedirect = function (ajax, response, status) {
    setTimeout(function () {
      window.location.href = response.url;
    }, response.delay || 5000);
  };
})(Drupal);




(function (Drupal, once) {
  Drupal.behaviors.fixIOSBottomBar = {
    attach: function (context, settings) {

      once('fix-ios-bottom-bar', 'body', context).forEach(function () {

        const bar = document.querySelector('.grid-cta');

        if (!bar) return;

        const isIOS =
          /iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (isIOS) {
          bar.style.bottom = '-1px';
          const setHeight = () => {
            document.documentElement.style.setProperty(
              '--app-height',
              `${window.innerHeight}px`
            );
          };

          setHeight();

          window.addEventListener('resize', setHeight);
          window.addEventListener('orientationchange', setHeight);
          setTimeout(() => {
            bar.style.display = 'none';
            bar.offsetHeight;
            bar.style.display = 'block';
          }, 100);
        }

      });



// const heroWrapper = document.querySelector(".hero_wrapper");
// const targetDiv = document.querySelector(".grid-cta__items");

// function handleStickyBanner() {
//   if (window.innerWidth >= 992) {
//     const heroBottom = heroWrapper.getBoundingClientRect().bottom;

//     if (heroBottom <= 192) {
//       targetDiv.classList.add("sticky_cta_banner");
//     } else {
//       targetDiv.classList.remove("sticky_cta_banner");
//     }
//   } else {
//     targetDiv.classList.remove("sticky_cta_banner");
//   }
// }

// window.addEventListener("scroll", handleStickyBanner);
// window.addEventListener("resize", handleStickyBanner);

// handleStickyBanner();


const targetDiv = document.querySelector(".grid-cta__items");

window.addEventListener("scroll", () => {
  if (window.innerWidth <= 992) {
    targetDiv.classList.remove("sticky_cta_banner2");
    return;
  }

  if (window.scrollY >= 300) {
    targetDiv.classList.add("sticky_cta_banner2");
  } else {
    targetDiv.classList.remove("sticky_cta_banner2");
  }
});

//       document.addEventListener("DOMContentLoaded", function () {
//   setTimeout(() => {
//     const widget = document.querySelector("eka-medassist-widget");

//     if (widget?.shadowRoot) {
//       const btn = widget.shadowRoot.querySelector("#medassist-open-btn");

//       if (btn && window.innerWidth <= 767) {
//         btn.style.setProperty(
//           "bottom",
//           "calc(34px + env(safe-area-inset-bottom))",
//           "important"
//         );
//       }
//     }
//   }, 1000);
// });

    }
  };
})(Drupal, once);


// (function ($, Drupal) {
//   Drupal.behaviors.menuToggleAlert = {
//     attach: function (context, settings) {
//       $(document)
//         .off('click.menuToggleAlert')
//         .on('click.menuToggleAlert', '#menuToggle', function () {
//           $('header').toggleClass('zindexIncrease');
//         });
//     }
//   };
// })(jQuery, Drupal);

(function ($, Drupal, once) {
  // Behavior for the main submit button loader
  Drupal.behaviors.freeCostEstimateAjaxLoader = {
    attach: function (context) {
      once('free-cost-estimate-loader-style', 'body', context).forEach(function () {
        const style = document.createElement('style');
        style.textContent = `
          .ask-query-form .is-aq-loading {
            pointer-events: none;
          }
          .ask-query-form .aq-button-loader {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-left: 8px;
            border: 2px solid rgba(255, 255, 255, 0.45);
            border-top-color: #fff;
            border-radius: 50%;
            vertical-align: middle;
            animation: aqButtonSpin 0.7s linear infinite;
          }
          .ask-query-form .submit-buttonss .aq-button-loader {
            margin-left: 8px;
          }
          .ask-query-form .otp-buttons + .aq-button-loader {
            border-color: rgba(0, 0, 0, 0.25);
            border-top-color: #111;
          }
          @keyframes aqButtonSpin {
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);

        $(document)
          .off('ajaxComplete.freeCostEstimateLoader ajaxError.freeCostEstimateLoader')
          .on('ajaxComplete.freeCostEstimateLoader ajaxError.freeCostEstimateLoader', function () {
            clearLoader();
          });

        document.removeEventListener('click', handleLoaderClick, true);
        document.addEventListener('click', handleLoaderClick, true);
      });

      function handleLoaderClick(event) {
        const button = event.target.closest(
          '.ask-query-form .submit-buttonss'
        );

        if (!button || button.disabled || button.classList.contains('is-aq-loading')) {
          return;
        }

        showLoader(button);
      }

      function showLoader(button) {
        clearLoader();
        button.classList.add('is-aq-loading');
        button.setAttribute('aria-busy', 'true');
        const loader = '<span class="aq-button-loader" aria-hidden="true"></span>';

        if (button.matches('button.submit-buttonss')) {
          button.insertAdjacentHTML('beforeend', loader);
        }
        else {
          button.insertAdjacentHTML('afterend', loader);
        }
      }

      function clearLoader() {
        document.querySelectorAll('.ask-query-form .is-aq-loading').forEach(function (button) {
          button.classList.remove('is-aq-loading');
          button.removeAttribute('aria-busy');
        });
        document.querySelectorAll('.ask-query-form .aq-button-loader').forEach(function (loader) {
          loader.remove();
        });
      }
    }
  };

  // NEW: Behavior specifically for Resend OTP button loader
  Drupal.behaviors.resendOtpLoader = {
    attach: function (context) {
      // Add loader styles if not already present
      once('resend-otp-loader-style', 'body', context).forEach(function () {
        const style = document.createElement('style');
        style.textContent = `
          .ask-query-form .resend-otp-containers .is-loading {
            pointer-events: none;
            opacity: 0.7;
          }
          .ask-query-form .resend-otp-loader {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-left: 8px;
            border: 2px solid rgba(0, 0, 0, 0.2);
            border-top-color: #333;
            border-radius: 50%;
            vertical-align: middle;
            animation: resendOtpSpin 0.7s linear infinite;
          }
          @keyframes resendOtpSpin {
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);

        // Listen for AJAX start on resend button
        $(document)
          .off('ajaxStart.resendOtpLoader')
          .on('ajaxStart.resendOtpLoader', function () {
            // Check if resend button triggered the AJAX
            const activeElement = document.activeElement;
            if (activeElement && activeElement.id === 'edit-resendotp') {
              showResendLoader(activeElement);
            }
          })
          .off('ajaxComplete.resendOtpLoader ajaxError.resendOtpLoader')
          .on('ajaxComplete.resendOtpLoader ajaxError.resendOtpLoader', function () {
            clearResendLoader();
          });
      });
    }
  };

  // Helper function to show resend loader
  function showResendLoader(button) {
    clearResendLoader();
    button.classList.add('is-loading');
    button.setAttribute('aria-busy', 'true');
    const loader = '<span class="resend-otp-loader" aria-hidden="true"></span>';
    button.insertAdjacentHTML('afterend', loader);
  }

  // Helper function to clear resend loader
  function clearResendLoader() {
    document.querySelectorAll('.ask-query-form .resend-otp-containers .is-loading').forEach(function (button) {
      button.classList.remove('is-loading');
      button.removeAttribute('aria-busy');
    });
    document.querySelectorAll('.ask-query-form .resend-otp-loader').forEach(function (loader) {
      loader.remove();
    });
  }

  // Auto-dismiss OTP messages after 30 seconds
  Drupal.behaviors.otpMessageAutoDismiss = {
    attach: function (context) {
      once('otp-message-dismiss', '.ask-query-form .msg-containers .success-messages, .ask-query-form .msg-containers .erroor-msgcontainer', context).forEach(function (message) {
        const $message = $(message);
        
        if ($message.data('otp-timeout-id')) {
          clearTimeout($message.data('otp-timeout-id'));
        }
        
        const timeoutId = setTimeout(function () {
          const container = message.closest('.msg-containers');
          if (container) {
            $(container).fadeOut('slow', function () {
              $(this).html('').css('display', 'none');
            });
          }
        }, 30000);
        
        $message.data('otp-timeout-id', timeoutId);
      });
    }
  };
})(jQuery, Drupal, once);


(function (Drupal, once) {
  Drupal.behaviors.logoLeftHeader = {
    attach(context) {
      once('logo-left-header', '.header-region__wrap', context).forEach((headerWrap) => {
        if (headerWrap.querySelector('.menu.logo-left')) {
          headerWrap.classList.add('has-logo-left');
        } else {
          headerWrap.classList.remove('has-logo-left');
        }
      });
    }
  };
})(Drupal, once);



(function (Drupal, once) {
  Drupal.behaviors.removeOverlayedHeader = {
    attach(context) {
      once('remove-overlayed-header', 'body', context).forEach(() => {
        if (document.querySelector('.region-delhi')) {
          const header = document.querySelector('[data-drupal-selector="header-main"]');

          if (header) {
            header.classList.remove('overlayed-header');
          }
        }
      });
    }
  };
})(Drupal, once);


(function (Drupal, once) {
  // Flag Delhi pages on <body> so header CSS can target Delhi only,
  // regardless of page type (node, view, etc.) - mirrors the same
  // first-path-segment check used in block--AIMS-gtranslate.html.twig.
  Drupal.behaviors.flagDelhiPage = {
    attach(context) {
      once('flag-delhi-page', 'body', context).forEach((body) => {
        const region = window.location.pathname.split('/').filter(Boolean)[0] || '';

        body.classList.toggle('is-delhi-page', region.toLowerCase() === 'delhi');
      });
    }
  };
})(Drupal, once);


(function (Drupal, once) {
  // Delhi desktop only: the helpline links moved to their own row above the
  // nav, but search + language switcher should stay on the nav row like every
  // other region. Move them into the nav on desktop, move them back on
  // mobile so the original phone-call cluster is untouched below 1056px.
  Drupal.behaviors.delhiDesktopUtilityMove = {
    attach(context) {
      once('delhi-desktop-utility-move', 'body.is-delhi-page', context).forEach(() => {
        const headerWrap = document.querySelector('.header-region__wrap');
        const nav = headerWrap && headerWrap.querySelector('[data-drupal-selector="menu-main"]');
        const translateContent = headerWrap && headerWrap.querySelector('.translate .translate__content');

        if (!headerWrap || !nav || !translateContent) return;

        const searchEl = translateContent.querySelector('.search');
        const gtranslateEl = translateContent.querySelector('.gtranslate_wrapper');

        if (!searchEl && !gtranslateEl) return;

        const searchPlaceholder = searchEl ? document.createComment('search-placeholder') : null;
        const gtranslatePlaceholder = gtranslateEl ? document.createComment('gtranslate-placeholder') : null;

        if (searchEl && searchPlaceholder) searchEl.after(searchPlaceholder);
        if (gtranslateEl && gtranslatePlaceholder) gtranslateEl.after(gtranslatePlaceholder);

        let utilityBar = null;

        function moveToNav() {
          if (!utilityBar) {
            utilityBar = document.createElement('div');
            utilityBar.className = 'nav-desktop-utility';
            // Appended to the header wrap (not the nav) so its position
            // doesn't depend on the nav element's own box/overflow/stacking.
            headerWrap.appendChild(utilityBar);
          }
          if (searchEl) utilityBar.appendChild(searchEl);
          if (gtranslateEl) utilityBar.appendChild(gtranslateEl);
        }

        function moveBack() {
          if (searchEl && searchPlaceholder) searchPlaceholder.replaceWith(searchEl);
          if (gtranslateEl && gtranslatePlaceholder) gtranslatePlaceholder.replaceWith(gtranslateEl);
        }

        const mq = window.matchMedia('(min-width: 1056px)');

        function handleChange(e) {
          if (e.matches) {
            moveToNav();
          } else {
            moveBack();
          }
        }

        handleChange(mq);
        mq.addEventListener('change', handleChange);
      });
    }
  };
})(Drupal, once);


(function (Drupal, once) {
  // gtranslate is loaded from a third-party CDN (gtranslate.settings.enable_cdn)
  // with no retry/error-handling of its own (see GTranslateBlock.php's
  // get_script_code()) - a slow/blocked/failed fetch leaves .gtranslate_wrapper
  // permanently empty until the visitor refreshes. This retries the same CDN
  // script (by cloning Drupal's own injected <script> tag, so
  // window.gtranslateSettings/orig-url/orig-domain stay exactly what the
  // server intended) a few times before giving up.
  Drupal.behaviors.gtranslateCdnRetry = {
    attach(context) {
      once('gtranslate-cdn-retry', '.gtranslate_wrapper', context).forEach((wrapper) => {
        const maxAttempts = 3;
        const timeoutMs = 6000;
        let attempts = 1;
        let settled = false;

        function isInitialized() {
          return wrapper.querySelector('.lang-select-wrapper, select.gt_selector') !== null;
        }

        function watch(scriptEl) {
          const timer = setTimeout(() => {
            if (!settled && !isInitialized()) retry(scriptEl);
          }, timeoutMs);

          scriptEl.addEventListener('load', () => {
            clearTimeout(timer);
            // dropdown.js needs a moment after load to build the DOM.
            setTimeout(() => {
              if (isInitialized()) {
                settled = true;
              } else if (!settled) {
                retry(scriptEl);
              }
            }, 500);
          });

          scriptEl.addEventListener('error', () => {
            clearTimeout(timer);
            if (!settled) retry(scriptEl);
          });
        }

        function retry(scriptEl) {
          if (settled || attempts >= maxAttempts) return;
          attempts += 1;
          const clone = scriptEl.cloneNode();
          watch(clone);
          document.body.appendChild(clone);
        }

        const existing = Array.from(
          document.querySelectorAll('script[src*="cdn.gtranslate.net"]'),
        ).pop();

        if (existing) watch(existing);
      });
    }
  };
})(Drupal, once);


(function (Drupal, once) {
  // onlyShowLanguageCodeInSelected (main.es6) wraps the raw .gt_selector
  // <select> the CDN script builds into the pretty EN pill - but it only
  // runs inside a Drupal.attachBehaviors() pass, and nothing re-triggers
  // that once the CDN script (or its retry above) creates .gt_selector
  // asynchronously, after the page's first pass already ran. Without this,
  // a late-arriving .gt_selector is created but never wrapped, leaving the
  // raw unstyled <select> on screen for that page view.
  Drupal.behaviors.gtranslateAttachOnReady = {
    attach(context) {
      once('gtranslate-attach-on-ready', '.gtranslate_wrapper', context).forEach((wrapper) => {
        if (wrapper.querySelector('.gt_selector')) {
          Drupal.attachBehaviors(wrapper);
          return;
        }

        const observer = new MutationObserver(() => {
          if (wrapper.querySelector('.gt_selector')) {
            observer.disconnect();
            Drupal.attachBehaviors(wrapper);
          }
        });

        observer.observe(wrapper, { childList: true, subtree: true });
      });
    }
  };
})(Drupal, once);

(function (Drupal) {
  Drupal.behaviors.backBtnLevel3 = {
    attach(context) {
      if (window.innerWidth > 1056) return;

      context.querySelectorAll('.back-btn-3').forEach((backBtn) => {
        if (backBtn.dataset.backBtn3Attached) return;
        backBtn.dataset.backBtn3Attached = 'true';

        backBtn.addEventListener('click', () => {
          const menuContent = backBtn.closest('.menu-inner-content');

          menuContent
            ?.querySelectorAll('.menu-level-3.active')
            .forEach((menu) => {
              menu.classList.remove('active');
            });

          menuContent
            ?.querySelectorAll('.menu-level-2 .menu__item.active')
            .forEach((item) => {
              item.classList.remove('active');
            });
        });
      });
    },
  };
})(Drupal);