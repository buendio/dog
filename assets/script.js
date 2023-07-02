document.addEventListener("DOMContentLoaded", () => {
  $(".search").on("click", function () {
    $(".header__search").toggleClass("active")
    $("body").toggleClass("scroll")
  })
  $(".close-search").on("click", function () {
    $(".header__search").toggleClass("active")
    $("body").toggleClass("scroll")
  })
  ////////////////////////////////////////////////////
  //  $('.menu-btn').on('click', function(){
  //     $('.menu-hide').toggleClass('active');
  //     $('body').toggleClass('scroll');
  //  });
  //  $('.close-menu').on('click', function(){
  //     $('.menu-hide').toggleClass('active');
  //     $('body').toggleClass('scroll');
  //  });
  ////////////////////////////////////////////////////
  // $('.menuSvg').on('click',function(){
  //    if(!$(this).parent().hasClass('active'))
  //    {
  //       $(this).parent().next().slideDown();
  //        $('.menu-list__wrap.active').next().slideUp();
  //        $('.menu-list__wrap.active').removeClass('active');
  //       $(this).parent().addClass('active');
  //    }
  //    else
  //    {
  //       $(this).parent().removeClass('active');
  //       $(this).parent().next().slideUp();
  //    }
  // });
  //////////////////////////////////////////////////////
  if ($(".product-grid--js").length) {
    // $('.product-grid--js').slick({
    //    slidesToShow: 4,
    //    slidesToScroll: 1,
    //    prevArrow:
    //            `<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="prev" role="button">
    //                <svg width="16" height="29" viewBox="0 0 16 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                   <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5848 1.44067L14.1965 0.000976562L0 13.6905L0.36158 14.0654L0 14.4404L14.1965 28.1299L15.5848 26.6902L2.49242 14.0654L15.5848 1.44067Z" fill="#005A68"/>
    //                </svg>
    //            </button>`,
    //    nextArrow:
    //            `<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="next" role="button">
    //                <svg width="16" height="29" viewBox="0 0 16 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                   <path fill-rule="evenodd" clip-rule="evenodd" d="M0.000189781 1.85766L1.38846 0.417969L15.585 14.1075L15.2234 14.4824L15.585 14.8574L1.38846 28.5469L0.000189781 27.1072L13.0925 14.4824L0.000189781 1.85766Z" fill="#005A68"/>
    //                </svg>
    //            </button>`,
    //    dots: false,
    //    rtl: true,
    //    responsive: [
    //       {
    //         breakpoint: 890,
    //         settings: {
    //           slidesToShow: 2.5,
    //           arrows: false,
    //           rtl: true
    //         }
    //       },
    //       {
    //         breakpoint: 750,
    //         settings: {
    //           slidesToShow: 1.5,
    //           rtl: true,
    //           arrows: false,
    //         }
    //       }
    //     ]
    // })
  }

  //////////////////////////////////////////////////////
  if ($(".reviews-items").length) {
    // $('.reviews-items').slick({
    //    slidesToShow: 3,
    //    slidesToScroll: 1,
    //    prevArrow:
    //            `<button type="button" data-role="none" class="slick-prev slick-arrow" aria-label="prev" role="button">
    //                <svg width="16" height="29" viewBox="0 0 16 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                   <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5848 1.44067L14.1965 0.000976562L0 13.6905L0.36158 14.0654L0 14.4404L14.1965 28.1299L15.5848 26.6902L2.49242 14.0654L15.5848 1.44067Z" fill="#005A68"/>
    //                </svg>
    //            </button>`,
    //    nextArrow:
    //            `<button type="button" data-role="none" class="slick-next slick-arrow" aria-label="next" role="button">
    //                <svg width="16" height="29" viewBox="0 0 16 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                   <path fill-rule="evenodd" clip-rule="evenodd" d="M0.000189781 1.85766L1.38846 0.417969L15.585 14.1075L15.2234 14.4824L15.585 14.8574L1.38846 28.5469L0.000189781 27.1072L13.0925 14.4824L0.000189781 1.85766Z" fill="#005A68"/>
    //                </svg>
    //            </button>`,
    //    dots: false,
    //    rtl: true,
    //    responsive: [
    //       {
    //         breakpoint: 890,
    //         settings: {
    //           slidesToShow: 2,
    //           arrows: false,
    //           rtl: true
    //         }
    //       },
    //       {
    //         breakpoint: 750,
    //         settings: {
    //           slidesToShow: 1,
    //           rtl: true,
    //           arrows: false,
    //         }
    //       }
    //     ]
    // })
  }
  //////////////////////////////////////////////////////////////////
  if ($(".section-fotos").length) {
    $(".section-fotos").slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      arrows: false,
      dots: false,
      responsive: [
        {
          breakpoint: 890,
          settings: {
            slidesToShow: 1.5,
            arrows: false,
            centerMode: true,
          },
        },
        {
          breakpoint: 750,
          settings: {
            slidesToShow: 1,
            arrows: false,
          },
        },
      ],
    })
  }
  //////////////////////////////////
  // Make all the columns of the same height
  function setEqualHeight(columns) {
    var tallestcolumn = 0

    columns.each(function () {
      currentHeight = $(this).height()
      if (currentHeight > tallestcolumn) {
        tallestcolumn = currentHeight
      }
    })

    columns.height(tallestcolumn)
  }
  setEqualHeight($(".grid__item"))
  setEqualHeight($(".is--href-replaced"))
  setEqualHeight($(".t4s-product--height"))
  setEqualHeight($(".reviews-item .reviews-item__body"))
  setEqualHeight($(".results-item a"))
  setEqualHeight($(".t4s-post-inner"))

  if (document.querySelector(".globoRecommendationsBottom")) {
    var target = document.querySelector(".globoRecommendationsBottom")

    //  observer
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
    }

    // callback function
    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          console.log("A child node has been added or removed.")
          setEqualHeight($("#globoRecommendationsFooter .gowl-item"))
        } else if (mutation.type === "attributes") {
          console.log("The " + mutation.attributeName + " attribute was modified.")
        }
      }
    }

    //
    const observer = new MutationObserver(callback)

    //
    observer.observe(target, config)
  }
  if (document.querySelector(".ratWr")) {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelectorAll(".ratWr")

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true }

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          // console.log('A child node has been added or removed.');

          document.querySelectorAll(".stamped-fa-star").forEach((e) => {
            e.style.color = "#f88927"
          })
        } else if (mutation.type === "attributes") {
          console.log(`The ${mutation.attributeName} attribute was modified.`)
        }
      }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback)
    targetNode.forEach((e) => {
      observer.observe(e, config)
    })
    // Start observing the target node for configured mutations
  }
}) // end DOMContentLoaded
