
  
/*
  You SHOULD NOT modify source code in this page because
  It is automatically generated from EcomSolid
  Try to edit page with the live editor.
  https://ecomsolid.com
*/

(function(jQuery, $) {
  
      try {
        const funcLib9 = function() {
          "use strict";

/* gtProductSwatches */
(function (jQuery) {
  var gtProductSwatches = function (element, options) {
    var defaults = {
      classCurrentValue: null,
      classItem: null,
      classInputIdHidden: null,
      classBtnSelect: null,
      classCurrentStatus: null,
    };

    this.settings = {};
    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }

      _this.setInitVariant();
      _this.event();
      _this.listen();
    };

    this.setInitVariant = function () {
      if (_productJson) {
        var storeVariant = window.SOLID.store.getState("variant" + _productJson.id);

        if (storeVariant && storeVariant.variant_init) {
          window.store.update("variant" + _productJson.id, storeVariant);
          return;
        }

        var $productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson");

        if ($productJson && $productJson.length) {
          var variantID = parseInt($productJson.attr("data-variant"));

          for (var i = 0; i < _productJson.variants.length; i++) {
            var currentVariant = _productJson.variants[i];

            if (currentVariant.id == variantID) {
              try {
                var newVariant = JSON.parse(JSON.stringify(currentVariant));

                // eslint-disable-next-line camelcase
                newVariant.variant_init = true;
                window.store.update("variant" + _productJson.id, newVariant);
              } catch (e) {
                console.log(e);
              }
              break;
            }
          }
        }
      }
    };

    this.event = function () {
      if (_productJson) {
        try {
          var variants = _productJson.variants;
          var $select = $element.find(_this.settings.classBtnSelect);

          $select.off("click.select").on("click.select", function () {
            var $el = jQuery(this);

            if (!$el.hasClass("gt_soldout")) {
              var name = $el.attr("data-name");
              // Update active
              var $selector = $element.find(_this.settings.classBtnSelect + '[data-name="' + name + '"]');

              if ($selector && $selector.length) {
                $selector.removeClass("gf_active");
                $selector.removeClass("gt_active");
              }
              $el.addClass("gf_active");
              $el.addClass("gt_active");
              var $actives = $element.find(_this.settings.classBtnSelect + ".gf_active," + _this.settings.classBtnSelect + ".gt_active");
              var values = [];
              var i;

              if ($actives && $actives.length) {
                for (i = 0; i < $actives.length; i++) {
                  var activeValue = jQuery($actives[i]).attr("data-value");

                  if (activeValue) {
                    values.push(activeValue);
                  }
                }
              }
              var currentVariant = {};

              if (values && values.length) {
                for (i = 0; i < variants.length; i++) {
                  var variant = variants[i];
                  var options = variant.options; // => []
                  // console.log(options, " vs ", values)

                  if (_this.compare(values, options)) {
                    currentVariant = variant;
                    break;
                  }
                }
              }
              // console.log("variants: ", variants);
              // console.log("$actives: ", $actives);
              // console.log("values: ", values);
              // console.log("currentVariant: ", currentVariant);
              if (!jQuery.isEmptyObject(currentVariant)) {
                window.store.update("variant" + _productJson.id, currentVariant);
              } else {
                // Sản phẩm không được định nghĩa
                window.store.update("variant" + _productJson.id, {
                  id: 0,
                  available: false,
                });
              }
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    };
    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        var options = _productJson.options;

        store.change("variant" + _productJson.id, function (variant) {
          if (variant && variant.variant_init) {
            return;
          }
          var $product = $element.closest("[keyword='product'], [data-keyword='product']");
          var $currentStatus = $product.find(_this.settings.classCurrentStatus);

          if ($currentStatus && $currentStatus.length) {
            if (!variant.available) {
              $currentStatus.show();
              var labelSoldOut = $currentStatus.attr("data-sold-out") || "Sold Out";

              $currentStatus.addClass(_this.settings.classCurrentStatus.replace(".", "") + "--inner");
              $currentStatus.html(labelSoldOut);
            } else {
              $currentStatus.addClass(_this.settings.classCurrentStatus.replace(".", "") + "--inner");
              $currentStatus.hide();
            }
          }

          if (variant.options && variant.options.length) {
            for (var i = 0; i < variant.options.length; i++) {
              var option = variant["option" + (i + 1)];

              if (option) {
                var name;

                if (options[i]) {
                  name = options[i];
                }
                if (!name || jQuery.isPlainObject(name)) {
                  name = options[i].name;
                }
                var $item = $element.find(_this.settings.classItem + '[data-name="' + name + '"]');

                if ($item && $item.length) {
                  if (_this.settings.classCurrentValue) {
                    var $currentValue = $item.find(_this.settings.classCurrentValue);

                    if ($currentValue && $currentValue.length) {
                      $currentValue.html(option);
                    }
                  }
                  var $selectActive = $item.find(_this.settings.classBtnSelect + '[data-value="' + option.replace(/"/g, "'") + '"]');
                  var $select = $item.find(_this.settings.classBtnSelect);

                  if ($select && $select.length && $selectActive && $selectActive.length) {
                    $select.removeClass("gf_active");
                    $select.removeClass("gt_active");
                    $selectActive.addClass("gf_active");
                    $selectActive.addClass("gt_active");
                  }
                }
              }
            }
          }
          if (!jQuery.isEmptyObject(variant)) {
            if ($product && $product.length) {
              var $input = $product.find(_this.settings.classInputIdHidden);

              if ($input && $input.length) {
                $input.attr("value", variant.id).val(variant.id);
                var currentURL = window.location.href;
                var variantURL = _this.updateUrlParameter(currentURL, "variant", variant.id);

                window.history.replaceState({}, "", variantURL);
              }
            }
          }
        });
      }
    };

    this.compare = function (array, array2) {
      array.sort();
      array2.sort();
      for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array2.length; j++) {
          var val1 = array[j];
          var val2 = array2[j];

          val1 = val1.replace(/"/gm, "'");
          val2 = val2.replace(/"/gm, "'");
          if (val1 != val2) {
            return false;
          }
        }
      }
      return true;
    };

    this.updateUrlParameter = function (url, key, value) {
      var parser = document.createElement("a");

      parser.href = url;
      var newUrl = parser.protocol + "//" + parser.host + parser.pathname;
      // has parameters ?

      if (parser.search && parser.search.indexOf("?") !== -1) {
        // parameter already exists
        if (parser.search.indexOf(key + "=") !== -1) {
          // paramters to array
          var params = parser.search.replace("?", "");

          params = params.split("&");
          params.forEach(function (param, i) {
            if (param.indexOf(key + "=") !== -1) {
              if (value !== null) { params[i] = key + "=" + value; } else { delete params[i]; }
            }
          });
          if (params.length > 0) { newUrl += "?" + params.join("&"); }
        } else if (value !== null) {
          newUrl += parser.search + "&" + key + "=" + value;
        } else {
          newUrl += parser.search;
        } // skip the value (remove)
      } else if (value !== null) {
        newUrl += "?" + key + "=" + value;
      } // no parameters, create it
      newUrl += parser.hash;
      return newUrl;
    };
    this.init();
  };

  jQuery.fn.gtProductSwatches = function (options) {
    return this.each(function () {
      var plugin = new gtProductSwatches(this, options, jQuery);

      jQuery(this).data("gtproductswatches", plugin);
    });
  };
})(jQuery);

        }
        funcLib9();
      } catch(e) {
        console.error("Error lib id: 9" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib22 = function() {
          'use strict';
/* gtByNow */
(function (jQuery) {
  var GtByNow = function (element, options) {
    var defaults = {
      classByNow: null,
      classText: null,
      openNewTab: false,
    };
    var $element = jQuery(element);
    var _this = this;

    this.settings = {};
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find('.ProductJson').text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }
      _this.event();
      _this.listen();
    };

    this.event = function () {
      if (!_this.settings.classByNow) {
        return;
      }

      $element.find(_this.settings.classByNow).off('click.addToCart.ByNow').on('click.addToCart.ByNow', byNowHandler);

      function byNowHandler(e) {
        var $buttonAddToCart = jQuery(this);

        e.preventDefault();
        e.stopImmediatePropagation();
        if (!$buttonAddToCart.data('isBuying')) {
          var $cacheButtonHtml = $buttonAddToCart.html();
          var heightBtnAddToCart = $buttonAddToCart.outerHeight();

          $buttonAddToCart.css('position', 'relative');
          $buttonAddToCart.css('height', heightBtnAddToCart + 'px');
          var $loading = jQuery(
            '<div class="atom-button-loading-circle-loader">' +
              '<div class="atom-button-loading-check-mark atom-button-loading-check-mark-draw"></div>' +
              '</div>'
          );
          var $styleLoading = jQuery('head').find('#gt_add-to-cart-animation--loading');

          if (!$styleLoading || !$styleLoading.length) {
            $styleLoading = jQuery(
              '<style type="text/css" id="gt_add-to-cart-animation--loading">\n' +
                '.atom-button-loading-circle-loader {\n' +
                '  position: absolute;\n' +
                '  left: calc(50% - 0.5em);\n' +
                '  top: calc(50% - 0.5em);\n' +
                '  border: 2px solid rgba(0, 0, 0, 0);\n' +
                '  border-left-color: currentColor;\n' +
                '  border-bottom-color: currentColor;\n' +
                '  animation: loader-spin 0.6s infinite linear;\n' +
                '  vertical-align: top;\n' +
                '  border-radius: 50%;\n' +
                '  width: 1em;\n' +
                '  height: 1em;\n' +
                '  border-width: calc(1em / 10);\n' +
                '}\n' +
                '\n' +
                '.load-complete {\n' +
                '  -webkit-animation: none;\n' +
                '  animation: none;\n' +
                '  border-color: currentColor;\n' +
                '  transition: border 500ms ease-out;\n' +
                '}\n' +
                '\n' +
                '.atom-button-loading-check-mark {\n' +
                '  display: none;\n' +
                '}\n' +
                '\n' +
                '.atom-button-loading-check-mark.atom-button-loading-check-mark-draw:after {\n' +
                '  animation-duration: 800ms;\n' +
                '  animation-timing-function: ease;\n' +
                '  animation-name: atom-button-loading-check-mark;\n' +
                '  transform: scaleX(-1) rotate(135deg);\n' +
                '}\n' +
                '\n' +
                '.atom-button-loading-check-mark:after {\n' +
                '  opacity: 1;\n' +
                '  transform-origin: left top;\n' +
                '  border-right: 2px solid #fff;\n' +
                '  border-top: 2px solid #fff;\n' +
                '  border-color: currentColor;\n' +
                "  content: '';\n" +
                '  position: absolute;\n' +
                '  border-width: calc(1em / 10);\n' +
                '  width: calc(1em / 4);\n' +
                '  height: calc(1em / 2);\n' +
                '  left: calc(1em / 4 - 1em / 10);\n' +
                '  top: calc(1em / 2 - 1em / 16);\n' +
                '}\n' +
                '\n' +
                '@keyframes loader-spin {\n' +
                '  0% {\n' +
                '    transform: rotate(0deg);\n' +
                '  }\n' +
                '\n' +
                '  100% {\n' +
                '    transform: rotate(360deg);\n' +
                '  }\n' +
                '}\n' +
                '\n' +
                '@keyframes atom-button-loading-check-mark {\n' +
                '  0% {\n' +
                '    height: 0px;\n' +
                '    width: 0px;\n' +
                '    opacity: 1;\n' +
                '  }\n' +
                '\n' +
                '  20% {\n' +
                '    height: 0px;\n' +
                '    width: calc(1em / 4);\n' +
                '    opacity: 1;\n' +
                '  }\n' +
                '\n' +
                '  40% {\n' +
                '    height: calc(1em / 2);\n' +
                '    width: calc(1em / 4);\n' +
                '    opacity: 1;\n' +
                '  }\n' +
                ' \n' +
                '  100% {\n' +
                '    height: calc(1em / 2);\n' +
                '    width: calc(1em / 4);\n' +
                '    opacity: 1;\n' +
                '  }\n' +
                '}\n' +
                '</style>'
            );
            jQuery('head').append($styleLoading);
          }

          $buttonAddToCart.html($loading);
          $buttonAddToCart.data('isBuying', true);
          var $form = $element.closest('form');

          window.gfTheme.addItemFromForm($form, function (item, form, error) {
            if (error) {
              console.log('Error gtByNow: ', error);
              $buttonAddToCart.css('position', '');
              $buttonAddToCart.css('height', '');
              $buttonAddToCart.html($cacheButtonHtml);
              $buttonAddToCart.data('isBuying', false);
            } else {
              var $loadingEl = $buttonAddToCart.find('.atom-button-loading-circle-loader');

              clearTimeout(window.timeoutLoading);
              /* display tick button */
              $loadingEl.addClass('load-complete');
              $loadingEl.find('.atom-button-loading-check-mark').css('display', 'block');
              /* remove tick button and display text*/
              window.timeoutLoading = setTimeout(function () {
                $buttonAddToCart.css('position', '');
                $buttonAddToCart.css('height', '');
                $buttonAddToCart.html($cacheButtonHtml);
                $buttonAddToCart.data('isBuying', false);
              }, 1000);

              var applyDiscount = window.store.get('discount');
              var url = window.location.href;
              var parser = document.createElement('a');

              parser.href = url;

              var checkoutURL = parser.protocol + '//' + parser.host + '/checkout';

              if (applyDiscount && applyDiscount.title) {
                checkoutURL += '?discount=' + applyDiscount.title;
              }

              if (_this.settings.openNewTab) {
                window.open(checkoutURL);
              } else {
                window.location.href = checkoutURL;
              }
            }
          });
        }
      }
    };

    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        var currentVariant = store.get('variant' + _productJson.id);

        if (!currentVariant.available) {
          $element.find(_this.settings.classByNow).attr('disabled', true);
        } else {
          $element.find(_this.settings.classByNow).attr('disabled', false);
        }

        store.change('variant' + _productJson.id, function (variant) {
          if (variant.available) {
            $element.removeClass('gf_soldout');
            $element.removeClass('gt_soldout');
            var textAddToCart = $element.attr('data-addtocart');

            if (_this.settings.classText) {
              $element.find(_this.settings.classText).html(textAddToCart);
            }

            if (_this.settings.classByNow) {
              $element.find(_this.settings.classByNow).attr('disabled', false);
            }
          } else {
            $element.addClass('gf_soldout');
            $element.addClass('gt_soldout');
            var text = $element.attr('data-soldout');

            if (_this.settings.classText) {
              $element.find(_this.settings.classText).html(text);
            }

            if (_this.settings.classByNow) {
              $element.find(_this.settings.classByNow).attr('disabled', true);
            }
          }
        });
      }
    };

    this.init();
  };

  jQuery.fn.gtByNow = function (options) {
    return this.each(function () {
      if (undefined == jQuery(this).data('gtbynow')) {
        var plugin = new GtByNow(this, options);

        jQuery(this).data('gtbynow', plugin);
      }
    });
  };
})(jQuery);

        }
        funcLib22();
      } catch(e) {
        console.error("Error lib id: 22" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib6 = function() {
          "use strict";

/* gtProductQuantity */
(function (jQuery) {
  var gtProductQuantity = function (element, options, $) {
    var defaults = {
      classMinus: null,
      classPlus: null,
      classInput: null,
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }
      _this.event();
      _this.listen();
    };

    this.event = function () {
      if (_this.settings.classMinus) {
        $element.find(_this.settings.classMinus).off("click.minus").on("click.minus", function () {
          if (!$element.hasClass("gt_soldout")) {
            var value = $element.find(_this.settings.classInput).val();

            value = parseInt(value) - 1;
            if (value <= 1) {
              value = 1;
            }
            $element.find(_this.settings.classInput).attr("value", value).val(value);

            window.store.update("quantity" + _productJson.id, value);
          }
        });
      }

      if (_this.settings.classPlus) {
        $element.find(_this.settings.classPlus).off("click.plus").on("click.plus", function () {
          if (!$element.hasClass("gt_soldout")) {
            var value = $element.find(_this.settings.classInput).val();

            value = parseInt(value) + 1;
            if (value <= 1) {
              value = 1;
            }
            $element.find(_this.settings.classInput).attr("value", value).val(value);

            window.store.update("quantity" + _productJson.id, value);
          }
        });
      }

      if (_this.settings.classInput) {
        $element.find(_this.settings.classInput).off("change.inputQuantity").on("change.inputQuantity", function () {
          var quantity = $(this).val();

          if (quantity == 0) {
            $(this).val(1);
            quantity = 1;
          }

          window.store.update("quantity" + _productJson.id, quantity);
        });
      }
    };

    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        store.change("variant" + _productJson.id, function (variant) {
          if (variant.available) {
            $element.removeClass("gf_soldout");
            $element.removeClass("gt_soldout");
            if (_this.settings.classInput) {
              $element.find(_this.settings.classInput).removeAttr("disabled");
            }
          } else {
            // Nếu là soldout update quantity về 1 và disable input thay đổi quantity
            $element.addClass("gf_soldout");
            $element.addClass("gt_soldout");
            window.store.update("quantity" + _productJson.id, 1);
            if (_this.settings.classInput) {
              jQuery(_this.settings.classInput).attr("value", 1).val(1);
              $element.find(_this.settings.classInput).attr("disabled", "disabled");
            }
          }
        });

        store.change("quantity" + _productJson.id, function (quantity) {
          $element.find(_this.settings.classInput).attr("value", quantity).val(quantity);
        });
      }
    };
    this.init();
  };

  jQuery.fn.gtProductQuantity = function (options) {
    return this.each(function () {
      var plugin = new gtProductQuantity(this, options, jQuery);

      jQuery(this).data("gtproductquantity", plugin);
    });
  };
})(jQuery);

        }
        funcLib6();
      } catch(e) {
        console.error("Error lib id: 6" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib5 = function() {
          "use strict";
/* gtProductImage */
(function (jQuery) {
  var GtProductImage = function (element, options, $) {
    var defaults = {
      classFeatureImage: null,
      classFeatureImages: null,
      carouselFeatureImage: null,
      classImages: null,
      carousel: null,
      owlCarousel: null,
      swiper: null,
      classWrapImage: null,
      initShowFeatureImage: false,
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _productJson;
    var _$carousel;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);

      var productJson = $element
        .closest("[keyword='product'], [data-keyword='product']")
        .find(".ProductJson")
        .text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }

      _$carousel = $element.find(_this.settings.carousel);

      if (_$carousel && _$carousel.length) {
        if (_this.settings.owlCarousel) {
          _$carousel.owlCarousel(_this.settings.owlCarousel);
          setTimeout(_this.updateCarousel, 200);
        } else if (_this.settings.swiper) {
          if (_$carousel[0].swiper) {
            _$carousel[0].swiper.destroy();
          }
          // eslint-disable-next-line no-new
          new Swiper(_$carousel[0], _this.settings.swiper);
        }
      }

      _this.event();
      _this.listen();
    };

    this.hasImageShopify = function (src) {
      if (!src || src == "") {
        return false;
      }
      if (src.indexOf("cdn.shopify.com/s/files/") != -1) {
        return true;
      } else if (src.indexOf("apps.shopifycdn.com/") != -1) {
        return true;
      }
      return false;
    };

    this.replaceImageToSize = function (src, expectImageSize) {
      if (expectImageSize == undefined || expectImageSize == null) {
        return src;
      }
      if (_this.hasImageShopify(src)) {
        var ignore = ["jfif"];
        var params = "";
        var splitParams = src.split("?");

        if (splitParams && splitParams.length && splitParams.length >= 2) {
          params = splitParams[1];
        }
        var arrImage = splitParams[0].split("/").pop();
        var slugName = arrImage.split(".");
        var strExtention = slugName.pop();

        if (ignore.indexOf(strExtention) !== -1) {
          return src;
        }
        var nameImages = slugName.join(".");
        var arrayNames = nameImages.split("_");

        if (arrayNames && arrayNames.length >= 2) {
          var sizeCurrent = arrayNames.pop();
          var reg = new RegExp(/(\d+)x(\d+)|(\d+)x|x(\d+)/, "gm");

          if (sizeCurrent && reg.test(sizeCurrent)) {
            var trimReg = sizeCurrent.replace(reg, "");

            if (trimReg == "") {
              nameImages = nameImages.split("_");
              nameImages.pop();
              nameImages = nameImages.join("_");
            }
          }
        }

        var srcImageSplit = src.split("?")[0].split("/");
        var smallSrc = "";

        for (var j = 0; j < srcImageSplit.length - 1; j++) {
          smallSrc += srcImageSplit[j] + "/";
        }

        if (expectImageSize) {
          src =
            smallSrc + nameImages + "_" + expectImageSize + "." + strExtention;
        } else {
          src = smallSrc + nameImages + "." + strExtention;
        }

        if (params) {
          src = src + "?" + params;
        }
      }
      return src;
    };

    this.event = function () {
      var variants = {};

      if (_productJson) {
        try {
          variants = _productJson.variants;
        } catch (e) {
          console.log(e);
        }
      }
      if (_this.settings.classImages) {
        $element
          .find(_this.settings.classImages)
          .off("click.selectImage")
          .on("click.selectImage", function () {
            var $img = jQuery(this);

            $element.find(_this.settings.classImages).removeClass("gf_active");
            $element.find(_this.settings.classImages).removeClass("gt_active");
            $img.addClass("gf_active");
            $img.addClass("gt_active");

            var $product = $element.closest("[keyword='product'], [data-keyword='product']");
            var imageId = $img.attr("data-id");

            if (_this.settings.classFeatureImage) {
              var src = $img.attr("src");

              src = _this.replaceImageToSize(src, "");
              $product.find(_this.settings.classFeatureImage).attr("src", src);
            }

            if (_this.settings.carouselFeatureImage) {
              for (
                var i = 0;
                i < $product.find(_this.settings.classFeatureImages).length;
                i++
              ) {
                var $imgItem = $product
                  .find(_this.settings.classFeatureImages)
                  .eq(i);

                if ($imgItem.attr("data-id") == imageId) {
                  var $featureImg = $product.find(
                    _this.settings.carouselFeatureImage
                  );

                  if (_this.settings.owlCarousel) {
                    $featureImg.trigger("to.owl.carousel", [i, 200, true]);
                  }
                  break;
                }
              }
            }

            if (!jQuery.isEmptyObject(variants)) {
              var id = $img.attr("data-id");

              for (var j = 0; j < variants.length; j++) {
                var variant = variants[j];

                if (
                  variant.featured_image &&
                  variant.featured_image.id &&
                  variant.featured_image.id == id
                ) {
                  window.store.update("variant" + _productJson.id, variant);
                  break;
                }
              }
            }
          });
      }
      if (_this.settings.classWrapImage) {
        $element
          .find(_this.settings.classWrapImage)
          .off("click.selectImage")
          .on("click.selectImage", function () {
            var $img = jQuery(this).find("img");

            $element
              .find(_this.settings.classWrapImage)
              .removeClass("gf_active");
            $element
              .find(_this.settings.classWrapImage)
              .removeClass("gt_active");

            $element
              .find(_this.settings.classWrapImage + " img")
              .removeClass("gf_active");
            $element
              .find(_this.settings.classWrapImage + " img")
              .removeClass("gt_active");

            $img.addClass("gf_active");
            $img.addClass("gt_active");
            jQuery(this).addClass("gf_active");
            jQuery(this).addClass("gt_active");

            var $product = $element.closest("[keyword='product'], [data-keyword='product']");
            var imageId = $img.attr("data-id");

            if (_this.settings.classFeatureImage) {
              var src = $img.attr("src");

              src = _this.replaceImageToSize(src, "");
              $product.find(_this.settings.classFeatureImage).attr("src", src);
            }

            if (_this.settings.carouselFeatureImage) {
              for (
                var i = 0;
                i < $product.find(_this.settings.classFeatureImages).length;
                i++
              ) {
                var $imgItem = $product
                  .find(_this.settings.classFeatureImages)
                  .eq(i);

                if ($imgItem.attr("data-id") == imageId) {
                  var $featureImg = $product.find(
                    _this.settings.carouselFeatureImage
                  );

                  if (_this.settings.owlCarousel) {
                    $featureImg.trigger("to.owl.carousel", [i, 200, true]);
                  }
                  break;
                }
              }
            }

            if (!jQuery.isEmptyObject(variants)) {
              var id = $img.attr("data-id");

              for (var j = 0; j < variants.length; j++) {
                var variant = variants[j];

                if (
                  variant.featured_image &&
                  variant.featured_image.id &&
                  variant.featured_image.id == id
                ) {
                  window.store.update("variant" + _productJson.id, variant);
                  break;
                }
              }
            }
          });
      }
    };
    this.listen = function () {
      if (_productJson && _productJson.id) {
        var storeKey = "variant" + _productJson.id;

        if (window._updateCarouselHandler && window.SOLID.__ES_STORE_FUNC__[storeKey] && window.SOLID.__ES_STORE_FUNC__[storeKey].length) {
          // unsubscribe old listener;
          window.SOLID.__ES_STORE_FUNC__[storeKey] = window.SOLID.__ES_STORE_FUNC__[storeKey].filter(function (f) { return f !== window._updateCarouselHandler; });
        }

        window._updateCarouselHandler = function (variant) {
          if (
            _this.settings.initShowFeatureImage &&
            variant &&
            variant.variant_init
          ) {
            return;
          }
          _this.updateCarousel(variant);
        };

        window.store.change(storeKey, window._updateCarouselHandler);
      }
    };

    this.updateCarousel = function (variant) {
      if (_this.settings.owlCarousel) {
        _$carousel.trigger("refresh.owl.carousel");
      }
      if (!_productJson) {
        return;
      }

      if (!variant) {
        variant = window.store.get("variant" + _productJson.id);
        if (
          _this.settings.initShowFeatureImage &&
          variant &&
          variant.variant_init
        ) {
          return;
        }
      }

      if (
        !variant ||
        !variant.featured_image ||
        !variant.featured_image.src ||
        !_this.settings.classImages
      ) {
        return;
      }

      var $carouselImages = $element.find(_this.settings.classImages);

      if (!$carouselImages || !$carouselImages.length) {
        return;
      }

      $carouselImages.each(function (index) {
        $(this).removeClass("gt_active");
        $(this).removeClass("gf_active");

        var id = $(this).attr("data-id");

        if (id == variant.featured_image.id && _this.settings.carousel) {
          if (_this.settings.owlCarousel) {
            _$carousel.trigger("to.owl.carousel", [index, 200, true]);
          } else if (_this.settings.swiper) {
            _$carousel[0].swiper.slideTo(index, 200, true);
          }
          $(this).addClass("gt_active");
          $(this).addClass("gf_active");
        }
      });
    };

    this.init();
  };

  jQuery.fn.gtProductImage = function (options) {
    return this.each(function () {
      var plugin = new GtProductImage(this, options, jQuery);

      jQuery(this).data("gtproductimage", plugin);
    });
  };
})(jQuery);

        }
        funcLib5();
      } catch(e) {
        console.error("Error lib id: 5" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib8 = function() {
          "use strict";

/* gtProductButton */
(function (jQuery) {
  jQuery.gtProductButton = function (element, options) {
    var defaults = {
      type: null, //  null or ajax
      classText: null,
      button: null,
      TextSuccessfully: null,
      classTextSuccessfully: null,
      mode: "production",
      // loadingType: "filled" // "outlined"
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      var productJson = $element
        .closest("[keyword='product'], [data-keyword='product']")
        .find(".ProductJson")
        .text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }
      _this.event();
      _this.listen();
    };
    this.event = function () {
      
      $element
        .find(_this.settings.classButton)
        .off("click.addtocart")
        .on("click.addtocart", addToCartHandler);

      function addToCartHandler(e) {
        var addons = window.SOLID.store.getState("addons");
        var cartDrawer;

        if (addons && addons.cart_drawer) {
          cartDrawer = addons.cart_drawer;
        }
        if (_this.settings.type == "ajax" || cartDrawer) {
          e.preventDefault();
          if (!$element.data("isBuying")) {
            var $product = $element.closest("[keyword='product'], [data-keyword='product']");
            var $buttonAddToCart = jQuery(this);
            var heightBtnAddToCart = $buttonAddToCart.outerHeight();

            $buttonAddToCart.css("position", "relative");
            $buttonAddToCart.css("height", heightBtnAddToCart + "px");
            var $loading = jQuery(
              '<div class="atom-button-loading-circle-loader"><div class="atom-button-loading-check-mark atom-button-loading-check-mark-draw"></div></div>'
            );
            var $styleLoading = jQuery("head").find("#gt_add-to-cart-animation--loading");

            if (!$styleLoading || !$styleLoading.length) {
              $styleLoading = jQuery(
                "<style type=\"text/css\" id=\"gt_add-to-cart-animation--loading\">\n" +
                ".atom-button-loading-circle-loader {\n" +
                "  position: absolute;\n" +
                "  left: calc(50% - 0.5em);\n" +
                "  top: calc(50% - 0.5em);\n" +
                "  border: 2px solid rgba(0, 0, 0, 0);\n" +
                "  border-left-color: currentColor;\n" +
                "  border-bottom-color: currentColor;\n" +
                "  animation: loader-spin 0.6s infinite linear;\n" +
                "  vertical-align: top;\n" +
                "  border-radius: 50%;\n" +
                "  width: 1em;\n" +
                "  height: 1em;\n" +
                "  border-width: calc(1em / 10);\n" +
                "}\n" +
                "\n" +
                ".load-complete {\n" +
                "  -webkit-animation: none;\n" +
                "  animation: none;\n" +
                "  border-color: currentColor;\n" +
                "  transition: border 500ms ease-out;\n" +
                "}\n" +
                "\n" +
                ".atom-button-loading-check-mark {\n" +
                "  display: none;\n" +
                "}\n" +
                "\n" +
                ".atom-button-loading-check-mark.atom-button-loading-check-mark-draw:after {\n" +
                "  animation-duration: 800ms;\n" +
                "  animation-timing-function: ease;\n" +
                "  animation-name: atom-button-loading-check-mark;\n" +
                "  transform: scaleX(-1) rotate(135deg);\n" +
                "}\n" +
                "\n" +
                ".atom-button-loading-check-mark:after {\n" +
                "  opacity: 1;\n" +
                "  transform-origin: left top;\n" +
                "  border-right: 2px solid #fff;\n" +
                "  border-top: 2px solid #fff;\n" +
                "  border-color: currentColor;\n" +
                "  content: '';\n" +
                "  position: absolute;\n" +
                "  border-width: calc(1em / 10);\n" +
                "  width: calc(1em / 4);\n" +
                "  height: calc(1em / 2);\n" +
                "  left: calc(1em / 4 - 1em / 10);\n" +
                "  top: calc(1em / 2 - 1em / 16);\n" +
                "}\n" +
                "\n" +
                "@keyframes loader-spin {\n" +
                "  0% {\n" +
                "    transform: rotate(0deg);\n" +
                "  }\n" +
                "\n" +
                "  100% {\n" +
                "    transform: rotate(360deg);\n" +
                "  }\n" +
                "}\n" +
                "\n" +
                "@keyframes atom-button-loading-check-mark {\n" +
                "  0% {\n" +
                "    height: 0px;\n" +
                "    width: 0px;\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                "\n" +
                "  20% {\n" +
                "    height: 0px;\n" +
                "    width: calc(1em / 4);\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                "\n" +
                "  40% {\n" +
                "    height: calc(1em / 2);\n" +
                "    width: calc(1em / 4);\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                " \n" +
                "  100% {\n" +
                "    height: calc(1em / 2);\n" +
                "    width: calc(1em / 4);\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                "}\n" +
                "</style>"
              );
              jQuery("head").append($styleLoading);
            }
            var $cacheButtonHtml = $buttonAddToCart.html();

            $buttonAddToCart.html($loading);
            $element.data("isBuying", true);
            var $form = $element.closest("form");

            window.gfTheme.addItemFromForm($form, function (item, form, error) {
              window.store.update("addToCart", item);
              if (error) {
                try {
                  var responseText = JSON.parse(error.responseText);

                  if (responseText && responseText.description) {
                    // eslint-disable-next-line no-alert
                    alert(responseText.description);
                  }
                } catch (e) {
                  console.log(e);
                }
                $buttonAddToCart.css("position", "");
                $buttonAddToCart.css("height", "");
                $buttonAddToCart.html($cacheButtonHtml);
                $element.data("isBuying", false);
              } else {
                if (
                  _this.settings.classTextSuccessfully &&
                  _this.settings.TextSuccessfully
                ) {
                  $product
                    .find(_this.settings.classTextSuccessfully)
                    .text(_this.settings.TextSuccessfully);
                } else {
                  var $loadingEl = $buttonAddToCart.find(
                    ".atom-button-loading-circle-loader"
                  );

                  clearTimeout(window.timeoutLoading);
                  /* display tick button */
                  $loadingEl.addClass("load-complete");
                  $loadingEl
                    .find(".atom-button-loading-check-mark")
                    .css("display", "block");
                  /* remove tick button and display text*/
                  window.timeoutLoading = setTimeout(function () {
                    $buttonAddToCart.css("position", "");
                    $buttonAddToCart.css("height", "");
                    $buttonAddToCart.html($cacheButtonHtml);
                    $element.data("isBuying", false);
                  }, 2000);
                }
                if (cartDrawer) {
                  // mo cart drawer thi cartPopup = "cart_drawer"
                  window.SOLID.store.dispatch("openCartPopup", "cart_drawer");
                }
              }
            }, true);
          }
          return false;
        }
      }
    };
    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        var currentVariant = store.get("variant" + _productJson.id);

        if (!currentVariant.available) {
          $element.find(_this.settings.classButton).attr("disabled", true);
        } else {
          $element.find(_this.settings.classButton).attr("disabled", false);
        }

        store.change("variant" + _productJson.id, function (variant) {
          if (variant.available) {
            $element.removeClass("gf_soldout");
            $element.removeClass("gt_soldout");
            var textAddToCart = $element.attr("data-addtocart");

            if (_this.settings.classText) {
              $element.find(_this.settings.classText).html(textAddToCart);
            }

            if (_this.settings.classButton) {
              $element.find(_this.settings.classButton).attr("disabled", false);
            }
          } else {
            $element.addClass("gf_soldout");
            $element.addClass("gt_soldout");
            var text = $element.attr("data-soldout");

            if (_this.settings.classText) {
              $element.find(_this.settings.classText).html(text);
            }

            if (_this.settings.classButton && _this.settings.mode === "production") {
              $element.find(_this.settings.classButton).attr("disabled", true);
            }
          }
        });
      }
    };
    this.init();
  };

  jQuery.fn.gtProductButton = function (options) {
    return this.each(function () {
      var plugin = new jQuery.gtProductButton(this, options, jQuery);

      jQuery(this).data("gtproductbutton", plugin);
    });
  };
})(jQuery);

        }
        funcLib8();
      } catch(e) {
        console.error("Error lib id: 8" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib10 = function() {
          "use strict";

var gtAnimations = {
  loopSlideUp: function (attrCSS, val, duration, last, element, callback) {
    var deg = val / duration;

    deg = Math.round(deg * 1000) / 1000;
    var max = val;
    var run = setInterval(function () {
      max = max - deg;
      if (val >= 0) {
        if (max <= 0) {
          max = 0;
        }
      } else if (max >= 0) {
        max = 0;
      }
      element.style[attrCSS] = max + "px";
      if ((val >= 0 && max <= 0) || (val <= 0 && max >= 0)) {
        clearInterval(run);
        if (last) {
          setTimeout(function () {
            element.style.removeProperty("overflow");
            element.style.removeProperty("padding-top");
            element.style.removeProperty("padding-bottom");
            element.style.removeProperty("border-top");
            element.style.removeProperty("border-bottom");
            element.style.removeProperty("margin-top");
            element.style.removeProperty("margin-bottom");
            element.style.removeProperty("height");
          }, 0);

          if (callback) {
            return callback();
          }
        }
      }
    }, 1);
  },
  SlideUp: function (element, duration, callback) {
    if (!element) {
      if (callback) {
        return callback();
      }
      return;
    }
    if (!duration) { duration = 500; }
    var compStyles = window.getComputedStyle(element, null);
    var height = parseInt(compStyles.height) || 0;
    var marginTop = parseInt(compStyles.marginTop) || 0;
    var marginBottom = parseInt(compStyles.marginBottom) || 0;
    var borderTop = parseInt(compStyles.borderTop) || 0;
    var borderBottom = parseInt(compStyles.borderBottom) || 0;
    var paddingTop = parseInt(compStyles.paddingTop) || 0;
    var paddingBottom = parseInt(compStyles.paddingBottom) || 0;

    element.style.overflow = "hidden";
    element.style.height = height + "px";
    element.style.paddingTop = paddingTop + "px";
    element.style.paddingBottom = paddingBottom + "px";
    element.style.borderTop = borderTop + "px";
    element.style.borderBottom = borderBottom + "px";
    element.style.marginTop = marginTop + "px";
    element.style.marginBottom = marginBottom + "px";

    var attrs = [{
      attr: "paddingTop",
      val: paddingTop,
    },
    {
      attr: "paddingBottom",
      val: paddingBottom,
    },
    {
      attr: "borderTop",
      val: borderTop,
    },
    {
      attr: "borderBottom",
      val: borderBottom,
    },
    {
      attr: "marginTop",
      val: marginTop,
    },
    {
      attr: "marginBottom",
      val: marginBottom,
    },
    {
      attr: "height",
      val: height,
    },
    ];

    for (var i = 0; i < attrs.length; i++) {
      var item = attrs[i];
      var last = false;

      if (i == attrs.length - 1) {
        last = true;
      }
      this.loopSlideUp(item.attr, item.val, duration, last, element, callback);
    }
  },
  loopSlideDown: function (attrCSS, val, duration, last, element, callback) {
    var deg = val / duration;

    deg = Math.round(deg * 1000) / 1000;
    var min = 0;
    var run = setInterval(function () {
      min = min + deg;

      if (val >= 0) {
        if (min >= val) {
          min = val;
        }
      } else if (min <= val) {
        min = val;
      }
      element.style[attrCSS] = min + "px";
      if ((val >= 0 && min >= val) || (val <= 0 && min <= val)) {
        clearInterval(run);
        if (last) {
          setTimeout(function () {
            element.style.removeProperty("overflow");
            element.style.removeProperty("padding-top");
            element.style.removeProperty("padding-bottom");
            element.style.removeProperty("border-top");
            element.style.removeProperty("border-bottom");
            element.style.removeProperty("margin-top");
            element.style.removeProperty("margin-bottom");
            element.style.removeProperty("height");
          }, 0);
          if (callback) {
            return callback();
          }
        }
      }
    }, 1);
  },
  SlideDown: function (element, duration, callback) {
    if (!element) {
      if (callback) {
        return callback();
      }
      return;
    }
    if (!duration) { duration = 500; }
    var compStyles = window.getComputedStyle(element, null);
    var height = parseInt(compStyles.height) || 0;
    var marginTop = parseInt(compStyles.marginTop) || 0;
    var marginBottom = parseInt(compStyles.marginBottom) || 0;
    var borderTop = parseInt(compStyles.borderTop) || 0;
    var borderBottom = parseInt(compStyles.borderBottom) || 0;
    var paddingTop = parseInt(compStyles.paddingTop) || 0;
    var paddingBottom = parseInt(compStyles.paddingBottom) || 0;

    element.style.overflow = "hidden";
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.borderTop = 0;
    element.style.borderBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    var attrs = [{
      attr: "paddingTop",
      val: paddingTop,
    },
    {
      attr: "paddingBottom",
      val: paddingBottom,
    },
    {
      attr: "borderTop",
      val: borderTop,
    },
    {
      attr: "borderBottom",
      val: borderBottom,
    },
    {
      attr: "marginTop",
      val: marginTop,
    },
    {
      attr: "marginBottom",
      val: marginBottom,
    },
    {
      attr: "height",
      val: height,
    },
    ];

    for (var i = 0; i < attrs.length; i++) {
      var item = attrs[i];
      var last = false;

      if (i == attrs.length - 1) {
        last = true;
      }
      this.loopSlideDown(item.attr, item.val, duration, last, element, callback);
    }
  },
};

window.gtAnimations = gtAnimations;

        }
        funcLib10();
      } catch(e) {
        console.error("Error lib id: 10" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib11 = function() {
          "use strict";

/* gtProductSaved */
(function (jQuery) {
  var gtProductSaved = function (element, options) {
    var defaults = {
      classTextPercent: null,
      classTextNumber: null,
      dataFormat: "",
      dataFormatKey: "",
      customCurrencyFormat: null,
      roundPercent: 0,
      roundNoZeroes: false,
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }

      _this.Init();
      _this.listen();
    };

    this.Init = function () {
      if (_productJson) {
        var variant = window.store.get("variant" + _productJson.id);
        if (variant && variant.id) {
          _this.setPriceWithVariant(variant);
        }
      }
    };

    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        store.change("variant" + _productJson.id, function (variant) {
          _this.setPriceWithVariant(variant);
        });

        store.change("quantity" + _productJson.id, function () {
          _this.Init();
        });
      }

      store.change("dataCurrency", function () {
        _this.Init();
      });
    };

    this.setPriceWithVariant = function (variant) {
      if (variant.compare_at_price && variant.price && variant.compare_at_price > variant.price) {
        $element.addClass("gf_active");
        $element.addClass("gt_active");

        // Giá giảm theo %
        if (_this.settings.classTextPercent) {
          var $number = $element.find(_this.settings.classTextPercent);
          var number = _this.getPercentDiscount(variant.price, variant.compare_at_price);

          $number.html(number);
        }

        // Giá giảm theo sổ tiền
        if (_this.settings.classTextNumber) {
          var $price = $element.find(_this.settings.classTextNumber);
          var diff = variant.compare_at_price - variant.price;

          diff = _this.formatMoneyPlugin(diff);
          $price.html(diff);
        }
      } else {
        $element.removeClass("gf_active");
        $element.removeClass("gt_active");
      }
    };

    // Get price with quantity
    this.getPriceWithQuantity = function (price) {
      if (_productJson) {
        var quantityProduct = window.store.get("quantity" + _productJson.id);

        quantityProduct = Number(quantityProduct);
        if (!quantityProduct || isNaN(quantityProduct)) {
          quantityProduct = 1;
        }
        price = Number(price) * quantityProduct;
      }
      return price;
    };

    // Format price
    this.formatMoneyPlugin = function (price) {
      price = _this.getPriceWithQuantity(price);
      var dataCurrency = window.store.get("dataCurrency");
      var format = __GemSettings.money;

      if (!dataCurrency) {
        // default shopify format
        price = Shopify.formatMoney(price, format);
      } else {
        // ES addon auto currency converter
        var notApplyRoundDecimal = true; // no apply round decimal for save money

        price = Shopify.gemFormatMoney(price, dataCurrency.currency, dataCurrency.data, _this.settings.customCurrencyFormating, notApplyRoundDecimal);
      }

      if (_this.settings.dataFormat && _this.settings.dataFormatKey) {
        price = _this.settings.dataFormat.replace(_this.settings.dataFormatKey, price);
      }

      return price;
    };

    // Lấy phần trăm giảm giá
    this.getPercentDiscount = function (price, comparePrice) {
      price = parseFloat(price);
      comparePrice = parseFloat(comparePrice);
      var diff = comparePrice - price;

      diff = diff / comparePrice;
      diff = diff * 100;
      if(_this.settings.roundNoZeroes) {
        diff = _this.roundTo(diff, _this.settings.roundPercent);
      } else {
        diff = diff.toFixed(_this.settings.roundPercent);
      }
      diff += "%";

      if (_this.settings.dataFormat && _this.settings.dataFormatKey) {
        diff = _this.settings.dataFormat.replace(_this.settings.dataFormatKey, diff);
      }

      return diff;
    };

    this.roundTo = function(n, digits) {
      if (digits === undefined) {
        digits = 0;
      }
    
      var multiplicator = Math.pow(10, digits);
      n = parseFloat((n * multiplicator).toFixed(11));
      var test =(Math.round(n) / multiplicator);
      return +(test.toFixed(digits));
    }

    this.init();
  };

  jQuery.fn.gtProductSaved = function (options) {
    return this.each(function () {
      var plugin = new gtProductSaved(this, options, jQuery);

      jQuery(this).data("gtproductsaved", plugin);
    });
  };
})(jQuery);

        }
        funcLib11();
      } catch(e) {
        console.error("Error lib id: 11" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib106 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ({

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductQuantityV2
 */
var GtProductQuantityV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params settings class and element
     */
    function GtProductQuantityV2(params) {
        this.$element = $(params.$element);
        this.classInput = params.settings.classInput;
        this.classPlus = params.settings.classPlus;
        this.classMinus = params.settings.classMinus;
        this.mode = params.settings.mode || "production";
        this.init();
    }
    /* private methods */
    /**
     * init: function khoi tao lib
     */
    GtProductQuantityV2.prototype.init = function () {
        var productJson = this.$element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.event();
        this.listen();
    };
    /**
     * event: thêm sự kiện click cho các variants
     */
    GtProductQuantityV2.prototype.event = function () {
        var _this = this;
        if (this._productJson) {
            if (this.classMinus) {
                this.$element
                    .find(this.classMinus)
                    .off("click.minus")
                    .on("click.minus", function () {
                    if (!_this.$element.hasClass("gt_soldout")) {
                        var value = _this.$element.find(_this.classInput).val();
                        value = parseInt(value) - 1;
                        if (value <= 1) {
                            value = 1;
                        }
                        _this.$element.find(_this.classInput).attr("value", value).val(value);
                        window.SOLID.store.dispatch("quantity" + _this._productJson.id, value);
                    }
                });
            }
            if (this.classPlus) {
                this.$element
                    .find(this.classPlus)
                    .off("click.plus")
                    .on("click.plus", function () {
                    if (!_this.$element.hasClass("gt_soldout")) {
                        var value = _this.$element.find(_this.classInput).val();
                        value = parseInt(value) + 1;
                        if (value <= 1) {
                            value = 1;
                        }
                        _this.$element.find(_this.classInput).attr("value", value).val(value);
                        window.SOLID.store.dispatch("quantity" + _this._productJson.id, value);
                    }
                });
            }
            if (this.classInput) {
                var $input = this.$element.find(this.classInput);
                if (this.mode !== "production") {
                    var quantityStore = window.SOLID.store.getState("quantity" + this._productJson.id) || 1;
                    $input.val(quantityStore);
                }
                $input.off("change.inputQuantity").on("change.inputQuantity", function (e) {
                    var $target = $(e.currentTarget);
                    var quantity = $target.val();
                    if (quantity == 0) {
                        $target.val(1);
                        quantity = 1;
                    }
                    window.SOLID.store.dispatch("quantity" + _this._productJson.id, quantity);
                });
            }
        }
    };
    /**
     * listen: lắng nghe khi có variant active thay đổi
     */
    GtProductQuantityV2.prototype.listen = function () {
        var _this = this;
        var store = window.SOLID.store;
        if (this._productJson) {
            store.subscribe("variant" + this._productJson.id, function (variant) {
                _this.updateDataCacheAttr(variant.id);
                if (variant.available) {
                    _this.$element.removeClass("gf_soldout");
                    _this.$element.removeClass("gt_soldout");
                    if (_this.classInput) {
                        _this.$element.find(_this.classInput).removeAttr("disabled");
                    }
                }
                else {
                    // Nếu là soldout update quantity về 1 và disable input thay đổi quantity
                    _this.$element.addClass("gf_soldout");
                    _this.$element.addClass("gt_soldout");
                    window.SOLID.store.dispatch("quantity" + _this._productJson.id, 1);
                    if (_this.classInput) {
                        jQuery(_this.classInput).attr("value", 1).val(1);
                        _this.$element.find(_this.classInput).attr("disabled", "disabled");
                    }
                }
            });
            store.subscribe("quantity" + this._productJson.id, function (quantity) {
                _this.$element.find(_this.classInput).attr("value", quantity).val(quantity);
            });
        }
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductQuantityV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    return GtProductQuantityV2;
}());
/**
 * gtProductQuantity
 * @param params setting lib product quantity
 * @returns gtProductQuantity
 */
window.SOLID.library.gtProductQuantityV2 = function (params) {
    return new GtProductQuantityV2(params);
};
exports.default = {};


/***/ })

/******/ });
});
        }
        funcLib106();
      } catch(e) {
        console.error("Error lib id: 106" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib4 = function() {
          "use strict";

/* gtProductImageFeature */
(function (jQuery) {
  var gtProductFeatureImage = function (element, options) {
    var defaults = {
      classFeatureImage: null,
      classImages: null,
      carousel: null,
      owlCarousel: null,
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);

      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }

      if ($element.find(_this.settings.carousel) && $element.find(_this.settings.carousel).length) {
        $element.find(_this.settings.carousel).owlCarousel(_this.settings.owlCarousel);
      }

      _this.event();
      _this.listen();
    };
    this.event = function () {

    };
    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        store.change("variant" + _productJson.id, function (variant) {
          if (variant && variant.variant_init) {
            return;
          }
          if (variant.featured_image && variant.featured_image.src) {
            var src = variant.featured_image.src;

            if (_this.settings.classFeatureImage) {
              $element.find(_this.settings.classFeatureImage).attr("src", src);
            }
            if (_this.settings.carousel) {
              for (var i = 0; i < $element.find(_this.settings.classImages).length; i++) {
                var $img = $element.find(_this.settings.classImages).eq(i);
                var id = $img.attr("data-id");

                if (id == variant.featured_image.id) {
                  if (_this.settings.carousel) {
                    $element.find(_this.settings.carousel).trigger("to.owl.carousel", [i, 200, true]);
                  }
                  break;
                }
              }
            }
          }
        });
      }
    };

    this.init();
  };

  jQuery.fn.gtProductFeatureImage = function (options) {
    return this.each(function () {
      var plugin = new gtProductFeatureImage(this, options, jQuery);

      jQuery(this).data("gtproductfeatureimage", plugin);
    });
  };
})(jQuery);

        }
        funcLib4();
      } catch(e) {
        console.error("Error lib id: 4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib17 = function() {
          "use strict";
/* gfProductZoomImage */
(function (jQuery) {
  var GfProductZoomImage = function (element, options, $) {
    var defaults = {
      classHoverItem: null,
      scale: 1.5,
      htmlZoom: '<div class="gt_product-zoom"></div>',
      classSection: null,
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _url;
    var _$html;

    this.init = function () {
      const checkDevice = _this.getDeviceType();
      if (checkDevice !== "desktop") {
        return;
      }
      this.settings = jQuery.extend({}, defaults, options);
      var $itemHover = $element.closest(_this.settings.classHoverItem);

      if ($itemHover && $itemHover.length > 0) {
        var classElement = $itemHover.attr("class");
        // gt_product-image--feature gt_product-image
        var res = classElement.split(" ");

        if (_this.settings.classSection != null) {
          var cssClassName = "css-" + _this.settings.classSection;
          var css = '<style type="text/css" class="' + cssClassName + '">';

          css += _this.settings.classSection + " ." + res.join(".") + "{position:relative;overflow:hidden}";
          css += _this.settings.classSection + " .gt_product-img-box div.gt_product-zoom{display: none;position:absolute;top:0;left:0;width:100%;height:100%;background-color: #fff;background-repeat:no-repeat;background-position:center;background-size:cover;transition:transform .5s ease-out}";
          css += "</style>";
          if (!jQuery(cssClassName) || jQuery(cssClassName).length == 0) {
            jQuery("body").append(css);
          }
        }

        var $html = jQuery(_this.settings.htmlZoom);

        _$html = $html;
        if (!$itemHover.find(".gt_product-zoom") || $itemHover.find(".gt_product-zoom").length == 0) {
          $itemHover.append(_$html);
        }

        _this.event();
      }
    };

    this.event = function () {
      $element.closest(_this.settings.classHoverItem)
        .on("mouseover", function () {
          if (_this.settings.scale !== 1) {
            _url = $element.attr("src");
            _$html.css({
              display: "block", 
              "width": "100%",
              "height": "100%",
              "top": "0%",
              "left": "0%",
              "z-index": "9",
              "background-repeat": "no-repeat",
              "background-color": "#fff",
              "background-position": "center",
              "background-size": "cover",
              "transition": "transform .5s ease-out",
              "position": "absolute",
              "background-image": "url(" + _url + ")",
              transform: "scale(" + _this.settings.scale + ")",
            });
            $element.css("opacity", 0);
          }
        })
        .on("mouseout", function () {
          if (_this.settings.scale !== 1) {
            _$html.css({
              transform: "scale(1)",
              display: "none",
              "z-index": "-1",
            });
            $element.css("opacity", 1);
          }
        })
        .on("mousemove", function (e) {
          if (_this.settings.scale !== 1) {
            var $this = $(this);

            _$html.css({
              "transform-origin": ((e.pageX - $this.offset().left) / $this.width()) * 100 + "% " + ((e.pageY - $this.offset().top) / $this.height()) * 100 + "%",
              display: "block",
            });
            $element.css("opacity", 0);
          }
        });
    };

    this.getDeviceType = function() {
      var userAgent = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        return "tablet";
      }
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|OperaM(obi|ini)/.test(userAgent)) {
        return "mobile";
      }
      return "desktop";
    }

    this.init();
  };

  jQuery.fn.gfProductZoomImage = function (options) {
    return this.each(function () {
      if (undefined == jQuery(this).data("gfproductZoomImage")) {
        var plugin = new GfProductZoomImage(this, options, jQuery);

        jQuery(this).data("gfproductzoomimage", plugin);
      }
    });
  };
})(jQuery);

        }
        funcLib17();
      } catch(e) {
        console.error("Error lib id: 17" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib14 = function() {
          "use strict";

(function (jQuery) {
  var gtParallax = function (element, options) {
    // Khai bao cac tham so mac dinh trong biet *default*
    var defaults = {
      classBackgroundImage: null,
    };

    this.settings = {};
    var $element = jQuery(element);
    var _this = this;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      // Init parallax no transtion
      _this.refreshDrag();

      // Event scroll
      _this.parallaxIt();
    };
    this.parallaxIt = function () {
      var $fwindow = jQuery(window);
      var yPos = 0;
      var xPos = "50%";

      $fwindow.on("scroll.gtparallax resize.gtparallax", function () {
        _this.calcBackground(xPos, yPos);
      });
      jQuery("body").on("scroll.gtparallax resize.gtparallax", function () {
        _this.calcBackground(xPos, yPos);
      });
    };

    this.refreshDrag = function () {
      var yPos = 0;
      var xPos = "50%";
      _this.calcBackground(xPos, yPos);
    };

    this.calcBackground = function (xPos, yPos) {
      var $fwindow = jQuery(window);
      var $image = $element.find(_this.settings.classBackgroundImage);
      var speed = _this.settings.speed || 0.2;

      if ($fwindow.width() >= 992 && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if (speed == 1) {
          $image.css({
            backgroundPosition: xPos + " " + yPos + "vh",
            "background-attachment": "fixed",
            "-webkit-backface-visibility": "hidden",
            transition: "all 0.15s",
          });
        } else {
          $image.css({
            backgroundPosition: xPos + " " + yPos + "vh",
            "background-attachment": "fixed",
            "-webkit-backface-visibility": "hidden",
            transition: "all 0.15s",
          });
        }
      } else {
        $image.css({
          "backgroundPosition": "",
          "background-attachment": "",
          "-webkit-backface-visibility": "",
        });
      }
    };
    
    this.init();
  };

  jQuery.fn.gtParallax = function (options) {
    return this.each(function () {
      var plugin = new gtParallax(this, options);

      jQuery(this).data("gtparallax", plugin);
    });
  };
})(jQuery);

        }
        funcLib14();
      } catch(e) {
        console.error("Error lib id: 14" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib107 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductImagesV2
 */
var GtProductImagesV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params setting truyen vao thu vien
     */
    function GtProductImagesV2(params) {
        this.$element = $(params.$element);
        this.settings = __assign(__assign({}, this.settings), params.settings);
        this.init();
    }
    /**
     * init ham khoi tao thu vien
     */
    GtProductImagesV2.prototype.init = function () {
        var productJson = this.$element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.findElementId();
        this.clearActiveImage();
        this.initSwiperSlide();
        this.setCurrentVariant();
        this.event();
        this.listen();
    };
    GtProductImagesV2.prototype.findElementId = function () {
        var _a;
        this.elementId = this.$element.attr("data-atom-id") || ((_a = this.$element.attr("class")) === null || _a === void 0 ? void 0 : _a.replaceAll(" ", "-")) || "undefined";
    };
    /**
     * Khởi tạo thư viện swiper slide
     */
    GtProductImagesV2.prototype.initSwiperSlide = function () {
        var _this_1 = this;
        var _a, _b, _c, _d, _e, _f;
        var carousel = this.$element.find(this.settings.classSwiperContainer);
        var productImagesSwiper;
        if (carousel && carousel.length) {
            this.$carousel = carousel[0];
            if (this.$carousel.swiper) {
                this.$carousel.swiper.destroy();
            }
            var extraSwiperProductListSetting = ((_b = (_a = window.SOLID.extraSettings) === null || _a === void 0 ? void 0 : _a[this.elementId]) === null || _b === void 0 ? void 0 : _b.swiperSetting) || {};
            var swiperProductListSetting = __assign(__assign({}, this.settings.swiperSetting), extraSwiperProductListSetting);
            productImagesSwiper = new window.Swiper(this.$carousel, swiperProductListSetting);
        }
        var $featureCarousel = this.$element.find(this.settings.classFeatureSwiperContainer);
        if (this.settings.featureSwiperSetting && $featureCarousel && $featureCarousel.length) {
            if ($featureCarousel && $featureCarousel.length) {
                if (productImagesSwiper) {
                    this.settings.featureSwiperSetting.thumbs = {
                        swiper: productImagesSwiper,
                    };
                }
                var cacheEventImageReady_1 = (_d = (_c = this.settings.featureSwiperSetting) === null || _c === void 0 ? void 0 : _c.once) === null || _d === void 0 ? void 0 : _d.imagesReady;
                this.settings.featureSwiperSetting.once = {
                    imagesReady: function () {
                        if (cacheEventImageReady_1) {
                            cacheEventImageReady_1();
                        }
                        _this_1.activeProductImageByFeatureImage($featureCarousel);
                    },
                };
                this.$featureCarousel = $featureCarousel[0];
                // neu co roi thi destroy
                if (this.$featureCarousel.swiper) {
                    this.$featureCarousel.swiper.destroy();
                }
                // khoi tao swiper
                var extraSwiperFeatureSetting = ((_f = (_e = window.SOLID.extraSettings) === null || _e === void 0 ? void 0 : _e[this.elementId]) === null || _f === void 0 ? void 0 : _f.featureSwiperSetting) || {};
                var swiperFeatureSetting = __assign(__assign({}, this.settings.featureSwiperSetting), extraSwiperFeatureSetting);
                var featureSwiper = new window.Swiper(this.$featureCarousel, swiperFeatureSetting);
                // them su kien change slide cho product img swiper
                this.eventFeatureSwiper(featureSwiper, $featureCarousel);
            }
        }
        else {
            if (carousel && carousel.length) {
                var imageId = this.$element.find(this.settings.classFeatureImage).attr("data-id");
                this.activeImage(imageId);
            }
            // if(this.settings.initShowFeatureImage) {
            // }
        }
    };
    /**
     * onProductImageSlideChange: sự kiện thay đổi slide của swiper cho product imgs
     * @param swiper swiper can them su kien
     * @param $carousel carousel can them su kien
     */
    GtProductImagesV2.prototype.eventFeatureSwiper = function (swiper, $carousel) {
        var _this_1 = this;
        swiper.on("slideChangeTransitionEnd", function () {
            _this_1.activeProductImageByFeatureImage($carousel);
        });
    };
    /**
     * activeProductImageByFeatureImage: thay đổi slide active ở imageList theo feature image swiper
     * @param $carousel $featureCarousel
     */
    GtProductImagesV2.prototype.activeProductImageByFeatureImage = function ($carousel) {
        var $imageActive = $carousel.find(".swiper-slide.swiper-slide-active img");
        var imageId = $imageActive.attr("data-id");
        this.updateStoreVariantByImageID(imageId);
        this.activeImage(imageId);
    };
    /**
     * Lấy dữ liệu gtCurrentVariant ID đã được cache
     */
    GtProductImagesV2.prototype.setCurrentVariant = function () {
        var _this_1 = this;
        if (this._productJson) {
            var variantIDCache = this.getVariantIDCacheByDom();
            if (variantIDCache) {
                this._variantID = variantIDCache;
                var storeVariant = window.SOLID.store.getState("variant" + this._productJson.id);
                if (storeVariant && storeVariant.id == this._variantID && storeVariant.variant_init) {
                    return;
                }
                else {
                    var variantData = this._productJson.variants.find(function (item) {
                        return Number(item.id) === Number(_this_1._variantID);
                    });
                    if (variantData) {
                        try {
                            var newVariant = JSON.parse(JSON.stringify(variantData));
                            // eslint-disable-next-line camelcase
                            newVariant.variant_init = true;
                            window.SOLID.store.dispatch("variant" + this._productJson.id, newVariant);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        }
    };
    /**
     * event
     */
    GtProductImagesV2.prototype.event = function () {
        // Click to image item in slide image
        if (this.settings.classSwiperItemsImage) {
            var $carouseItemImages_1 = this.$element.find(this.settings.classSwiperItemsImage);
            var _this_2 = this;
            $carouseItemImages_1.off("click.selectImage").on("click.selectImage", function () {
                var $img = jQuery(this);
                var imageId = $img.attr("data-id");
                var imageUrl = $img.attr("src");
                $carouseItemImages_1.removeClass("gt_active");
                $img.addClass("gt_active");
                _this_2.updateFeatureImage(imageUrl, imageId);
                _this_2.updateStoreVariantByImageID(imageId);
            });
        }
        // Click to feature arrow
        if (this.settings.classFeatureArrow) {
            var $featureArrow = this.$element.find(this.settings.classFeatureArrow);
            var _this_3 = this;
            if ($featureArrow && $featureArrow.length) {
                $featureArrow.off("click.imageArrow").on("click.imageArrow", function () {
                    var isLeftArrow = $(this).hasClass("gt_product-img-nav--left");
                    var $currentActiveImage = $(_this_3.$carousel).find(".swiper-slide img.gt_active");
                    if (!$currentActiveImage || !$currentActiveImage.length) {
                        return;
                    }
                    var index = $currentActiveImage.closest(".swiper-slide").attr("aria-label").split(" / ");
                    var currentIndex = parseInt(index[0]);
                    var total = parseInt(index[1]);
                    if (isLeftArrow) {
                        currentIndex = currentIndex == 1 ? total : currentIndex - 1;
                    }
                    else {
                        currentIndex = currentIndex == total ? 1 : currentIndex + 1;
                    }
                    var newIndex = currentIndex + " / " + total;
                    var $newActiveImage = $(_this_3.$carousel).find(".swiper-slide[aria-label='" + newIndex + "'] img");
                    if ($newActiveImage && $newActiveImage.length) {
                        $newActiveImage.trigger("click");
                        _this_3.$carousel.swiper.slideTo(currentIndex - 1, 200, true);
                    }
                });
            }
        }
    };
    /**
     * listen
     */
    GtProductImagesV2.prototype.listen = function () {
        var _this_1 = this;
        var store = window.SOLID.store;
        if (this._productJson && this._productJson.id) {
            store.subscribe("variant" + this._productJson.id, function (variant) {
                if (variant &&
                    variant.variant_init &&
                    (_this_1.settings.initShowFeatureImage || _this_1.settings.initShow3DModel || _this_1.settings.initShowExVideo || _this_1.settings.initShowOtherVideo)) {
                    return;
                }
                _this_1.updateDataCacheAttr(variant.id);
                _this_1.updateImage(variant);
            });
        }
    };
    /**
     * getVariantIDCacheByDom
     * @returns current variant id
     */
    GtProductImagesV2.prototype.getVariantIDCacheByDom = function () {
        var variantID = this.$element.attr("data-variant-id") || "";
        return variantID;
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductImagesV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    /**
     * Cập nhật new variant
     * @param imageId id của image đang được active
     */
    GtProductImagesV2.prototype.updateStoreVariantByImageID = function (imageId) {
        var variants = [];
        if (this._productJson) {
            try {
                variants = this._productJson.variants;
            }
            catch (e) {
                console.log(e);
            }
        }
        if (variants.length) {
            var beforeActiveVariant_1 = window.SOLID.store.getState("variant" + this._productJson.id);
            // check variant hiện tại có feature image là imageid cần check hay không
            var beforeVariantHasImageId = variants.find(function (item) { var _a, _b; return String(item.id) === String(beforeActiveVariant_1 === null || beforeActiveVariant_1 === void 0 ? void 0 : beforeActiveVariant_1.id) && (((_a = item === null || item === void 0 ? void 0 : item.featured_media) === null || _a === void 0 ? void 0 : _a.id) == imageId || ((_b = item === null || item === void 0 ? void 0 : item.featured_image) === null || _b === void 0 ? void 0 : _b.id) == imageId); });
            if (beforeVariantHasImageId) {
                return;
            }
            // find variant with image id
            var currentVariant = variants.find(function (item) { return item.featured_image && item.featured_image.id && item.featured_image.id == imageId; });
            if (!currentVariant) {
                // nếu không tìm thấy theo imageId thì tìm theo mediaId
                currentVariant = variants.find(function (item) { return item.featured_media && item.featured_media.id == imageId; });
            }
            if (String(currentVariant === null || currentVariant === void 0 ? void 0 : currentVariant.id) === String(beforeActiveVariant_1 === null || beforeActiveVariant_1 === void 0 ? void 0 : beforeActiveVariant_1.id)) {
                return;
            }
            if (currentVariant) {
                window.SOLID.store.dispatch("variant" + this._productJson.id, currentVariant);
            }
        }
    };
    /**
     * Cập nhật ảnh của feature image theo ảnh đang được active trong slider image
     * @param url link ảnh đang được active trong slide images
     * @param imageId id cua feature image active
     * @param mediaId id cua feature media active
     */
    GtProductImagesV2.prototype.updateFeatureImage = function (url, imageId, mediaId) {
        if (!this.settings.featureSwiperSetting) {
            url = this.replaceImageToSize(url, "");
            if (this.settings.classFeatureImage) {
                this.$element.find(this.settings.classFeatureImage).attr("src", url);
            }
        }
        else {
            var $carouselFeatureImages = this.$element.find(this.settings.classFeatureSwiperItemsImage);
            var $carouselFeatureImageActive = this.$element.find(this.settings.classFeatureSwiperItemsImage + "[data-id=\"" + imageId + "\"]");
            if ($carouselFeatureImages && $carouselFeatureImageActive && $carouselFeatureImages.length && $carouselFeatureImageActive.length) {
                var indexActive = $carouselFeatureImages.index($carouselFeatureImageActive);
                this.$featureCarousel.swiper.slideTo(indexActive, 200, true);
            }
            else {
                // nếu không tìm thấy imageId thì tìm theo mediaId
                var $carouselFeatureMediaActive = this.$element.find(this.settings.classFeatureSwiperItemsImage + "[data-id=\"" + mediaId + "\"]");
                if ($carouselFeatureImages && $carouselFeatureMediaActive && $carouselFeatureImages.length && $carouselFeatureMediaActive.length) {
                    var indexActive = $carouselFeatureImages.index($carouselFeatureMediaActive);
                    this.$featureCarousel.swiper.slideTo(indexActive, 200, true);
                }
            }
        }
    };
    /**
     * Cập nhật lại trạng thái active của slide và feature image với variant tương ứng
     * @param variant dữ liệu của variant đang select
     */
    GtProductImagesV2.prototype.updateImage = function (variant) {
        var _a, _b;
        if (!this._productJson)
            return;
        if (!variant)
            variant = window.SOLID.store.getState("variant" + this._productJson.id);
        if (!variant || !variant.featured_image || !variant.featured_image.src || !this.settings.classSwiperItemsImage) {
            return;
        }
        this.updateFeatureImage(variant.featured_image.src, variant.featured_image.id, (_a = variant.featured_media) === null || _a === void 0 ? void 0 : _a.id);
        this.activeImage(variant.featured_image.id, (_b = variant.featured_media) === null || _b === void 0 ? void 0 : _b.id);
    };
    /**
     * active and scroll to image active
     * @param imageId  featured_image id current variant selected
     * @param mediaId  featured_media id current variant selected
     */
    GtProductImagesV2.prototype.activeImage = function (imageId, mediaId) {
        var $carouselImages = this.$element.find(this.settings.classSwiperItemsImage);
        var _this = this;
        var isFindActiveImage = false;
        $carouselImages.each(function (index) {
            $(this).removeClass("gt_active");
            $(this).removeClass("gf_active");
            var id = $(this).attr("data-id");
            if (id == imageId && _this.settings.swiperSetting) {
                _this.$carousel.swiper.slideTo(index, 200, true);
                $(this).addClass("gt_active");
                $(this).addClass("gf_active");
                isFindActiveImage = true;
            }
        });
        // support với media nếu không tìm thấy imageId
        if (!isFindActiveImage) {
            $carouselImages.each(function (index) {
                $(this).removeClass("gt_active");
                $(this).removeClass("gf_active");
                var id = $(this).attr("data-id");
                if (id == mediaId && _this.settings.swiperSetting) {
                    _this.$carousel.swiper.slideTo(index, 200, true);
                    $(this).addClass("gt_active");
                    $(this).addClass("gf_active");
                }
            });
        }
    };
    /**
     * clearActiveImage
     */
    GtProductImagesV2.prototype.clearActiveImage = function () {
        var $carouselImages = this.$element.find(this.settings.classSwiperItemsImage);
        $carouselImages.each(function () {
            $(this).removeClass("gt_active");
            $(this).removeClass("gf_active");
        });
    };
    /**
     * Kiểm tra xem có phải link ảnh trên shopify app hay ko
     * @param url link ảnh
     * @returns true or false
     */
    GtProductImagesV2.prototype.hasImageShopify = function (url) {
        if (!url || url == "") {
            return false;
        }
        if (url.indexOf("cdn.shopify.com/s/files/") != -1) {
            return true;
        }
        else if (url.indexOf("apps.shopifycdn.com/") != -1) {
            return true;
        }
        return false;
    };
    /**
     * replaceImageToSize
     * @param url link image
     * @param expectImageSize expectImageSize
     * @returns string
     */
    GtProductImagesV2.prototype.replaceImageToSize = function (url, expectImageSize) {
        if (expectImageSize == undefined || expectImageSize == null) {
            return url;
        }
        if (this.hasImageShopify(url)) {
            var ignore = ["jfif"];
            var params = "";
            var splitParams = url.split("?");
            if (splitParams && splitParams.length && splitParams.length >= 2) {
                params = splitParams[1];
            }
            var arrImage = splitParams[0].split("/").pop();
            var slugName = arrImage.split(".");
            var strExtention = slugName.pop();
            if (ignore.indexOf(strExtention) !== -1) {
                return url;
            }
            var nameImage = slugName.join(".");
            var arrayNames = nameImage.split("_");
            if (arrayNames && arrayNames.length >= 2) {
                var sizeCurrent = arrayNames.pop();
                var reg = new RegExp(/(\d+)x(\d+)|(\d+)x|x(\d+)/, "gm");
                if (sizeCurrent && reg.test(sizeCurrent)) {
                    var trimReg = sizeCurrent.replace(reg, "");
                    if (trimReg == "") {
                        var nameImages = nameImage.split("_");
                        nameImages.pop();
                        nameImage = nameImages.join("_");
                    }
                }
            }
            var srcImageSplit = url.split("?")[0].split("/");
            var smallSrc = "";
            for (var j = 0; j < srcImageSplit.length - 1; j++) {
                smallSrc += srcImageSplit[j] + "/";
            }
            if (expectImageSize) {
                url = smallSrc + nameImage + "_" + expectImageSize + "." + strExtention;
            }
            else {
                url = smallSrc + nameImage + "." + strExtention;
            }
            if (params) {
                url = url + "?" + params;
            }
        }
        return url;
    };
    return GtProductImagesV2;
}());
/**
 * gtProductImagesV2
 * @param params setting lib product gtProductImagesV2
 * @returns gtProductImagesV2
 */
window.SOLID.library.gtProductImagesV2 = function (params) {
    return new GtProductImagesV2(params);
};
exports.default = {};


/***/ })

/******/ });
});

        }
        funcLib107();
      } catch(e) {
        console.error("Error lib id: 107" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib108 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductSaveV2
 */
var GtProductSaveV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params setting truyen vao thu vien
     */
    function GtProductSaveV2(params) {
        this.$element = $(params.$element);
        this.settings = {
            roundNoZeroes: false,
            roundPercent: 0,
            classTextPercent: "",
            classTextNumber: "",
            dataFormat: "",
            dataFormatKey: "",
            customCurrencyFormat: "",
        };
        this.settings = __assign(__assign({}, this.settings), params.settings);
        this.init();
    }
    /**
     * init ham khoi tao thu vien
     */
    GtProductSaveV2.prototype.init = function () {
        var productJson = this.$element
            .closest("[keyword='product'], [data-keyword='product']")
            .find(".ProductJson")
            .text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.setCurrentVariant();
        this.listen();
    };
    /**
     * Lấy dữ liệu gtCurrentVariant ID đã được cache
     */
    GtProductSaveV2.prototype.setCurrentVariant = function () {
        var _this = this;
        if (this._productJson) {
            var variantIDCache = this.getVariantIDCacheByDom();
            if (variantIDCache) {
                this._variantID = Number(variantIDCache);
                var storeVariant = window.SOLID.store.getState("variant" + this._productJson.id);
                if (storeVariant &&
                    storeVariant.id == this._variantID &&
                    storeVariant.variant_init) {
                    this.setPriceWithVariant(storeVariant);
                    return;
                }
                else {
                    var variantData = this._productJson.variants.find(function (item) { return item.id === _this._variantID; });
                    if (variantData) {
                        try {
                            var newVariant = JSON.parse(JSON.stringify(variantData));
                            this.setPriceWithVariant(newVariant);
                            // eslint-disable-next-line camelcase
                            newVariant.variant_init = true;
                            window.SOLID.store.dispatch("variant" + this._productJson.id, newVariant);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        }
    };
    /**
     * listen
     */
    GtProductSaveV2.prototype.listen = function () {
        var _this = this;
        var store = window.SOLID.store;
        if (this._productJson && this._productJson.id) {
            store.subscribe("variant" + this._productJson.id, function (variant) {
                if (variant && variant.variant_init) {
                    return;
                }
                _this.updateDataCacheAttr(variant.id);
                _this.setPriceWithVariant(variant);
            });
            store.subscribe("quantity" + this._productJson.id, function () {
                var variant = window.store.get("variant" + _this._productJson.id);
                if (variant && variant.id) {
                    _this.setPriceWithVariant(variant);
                }
            });
            store.subscribe("dataCurrency", function () {
                var variant = window.store.get("variant" + _this._productJson.id);
                if (variant && variant.id) {
                    _this.setPriceWithVariant(variant);
                }
            });
        }
    };
    /**
     * getVariantIDCacheByDom
     * @returns current variant id
     */
    GtProductSaveV2.prototype.getVariantIDCacheByDom = function () {
        var variantID = this.$element.attr("data-variant-id") || "";
        return variantID;
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductSaveV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    /**
     * setPriceWithVariant
     * @param variant variant
     */
    GtProductSaveV2.prototype.setPriceWithVariant = function (variant) {
        if (variant.compare_at_price &&
            variant.price &&
            variant.compare_at_price > variant.price) {
            this.$element.addClass("gt_active");
            // Giá giảm theo %
            if (this.settings.classTextPercent) {
                var $number = this.$element.find(this.settings.classTextPercent);
                var number = this.getPercentDiscount(variant.price, variant.compare_at_price);
                $number.html(number);
            }
            // Giá giảm theo sổ tiền
            if (this.settings.classTextNumber) {
                var $price = this.$element.find(this.settings.classTextNumber);
                var diff = variant.compare_at_price - variant.price;
                var diffFormat = this.formatMoneyPlugin(diff);
                $price.html(diffFormat);
            }
        }
        else {
            this.$element.removeClass("gt_active");
        }
    };
    /**
     * Format Money
     * @param price price
     * @returns Format Money
     */
    GtProductSaveV2.prototype.formatMoneyPlugin = function (price) {
        price = this.getPriceWithQuantity(price);
        var dataCurrency = window.store.get("dataCurrency");
        var format = window.__GemSettings.money;
        var priceFormat = price.toString();
        if (!dataCurrency) {
            // default shopify format
            priceFormat = window.Shopify.formatMoney(price, format);
        }
        else {
            // ES addon auto currency converter
            var notApplyRoundDecimal = true; // no apply round decimal for save money
            priceFormat = window.Shopify.gemFormatMoney(price, dataCurrency.currency, dataCurrency.data, this.settings.customCurrencyFormat, notApplyRoundDecimal);
        }
        if (this.settings.dataFormat && this.settings.dataFormatKey) {
            priceFormat = this.settings.dataFormat.replace(this.settings.dataFormatKey, priceFormat);
        }
        return priceFormat;
    };
    /**
     * getPriceWithQuantity
     * @param price price
     * @returns price
     */
    GtProductSaveV2.prototype.getPriceWithQuantity = function (price) {
        if (this._productJson) {
            var quantityProduct = window.store.get("quantity" + this._productJson.id);
            quantityProduct = Number(quantityProduct);
            if (!quantityProduct || isNaN(quantityProduct)) {
                quantityProduct = 1;
            }
            price = Number(price) * quantityProduct;
        }
        return price;
    };
    /**
     * trả về phần trăm giảm giá
     * @param price giá bán
     * @param comparePrice giá gốc
     * @returns trăm giảm giá
     */
    GtProductSaveV2.prototype.getPercentDiscount = function (price, comparePrice) {
        var diff = comparePrice - price;
        diff = diff / comparePrice;
        diff = diff * 100;
        var diffString = diff.toString();
        if (this.settings.roundNoZeroes) {
            diffString = this.roundTo(diff, this.settings.roundPercent);
        }
        else {
            diffString = diff.toFixed(this.settings.roundPercent);
        }
        diffString += "%";
        if (this.settings.dataFormat && this.settings.dataFormatKey) {
            diffString = this.settings.dataFormat.replace(this.settings.dataFormatKey, diffString);
        }
        return diffString;
    };
    /**
     * Làm tròn số tới hàng thập phân thứ n bỏ O ở cuối string nếu có
     * @param n giá trị cần làm tròn
     * @param digits Làm tròn số tới hàng thập phân thứ
     * @returns string
     */
    GtProductSaveV2.prototype.roundTo = function (n, digits) {
        if (digits === undefined) {
            digits = 0;
        }
        var multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        var test = Math.round(n) / multiplicator;
        return test.toFixed(digits);
    };
    return GtProductSaveV2;
}());
/**
 * gtProductSaveV2
 * @param params setting lib product gtProductSaveV2
 * @returns gtProductSaveV2
 */
window.SOLID.library.gtProductSaveV2 = function (params) {
    return new GtProductSaveV2(params);
};
exports.default = {};


/***/ })

/******/ });
});
        }
        funcLib108();
      } catch(e) {
        console.error("Error lib id: 108" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib105 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ({

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductSwatchesV2
 */
var GtProductSwatchesV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params settings class and element
     */
    function GtProductSwatchesV2(params) {
        this.$element = $(params.$element);
        this.classCurrentValue = params.settings.classCurrentValue;
        this.classItem = params.settings.classItem;
        this.classInputIdHidden = params.settings.classInputIdHidden;
        this.classBtnSelect = params.settings.classBtnSelect;
        this.classCurrentStatus = params.settings.classCurrentStatus;
        this.init();
    }
    /* private methods */
    /**
     * init: function khoi tao lib
     */
    GtProductSwatchesV2.prototype.init = function () {
        var productJson = this.$element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.setCurrentVariant();
        this.event();
        this.listen();
    };
    /**
     * setInitVariant: tim ra variant dang active
     */
    GtProductSwatchesV2.prototype.setCurrentVariant = function () {
        if (this._productJson) {
            var storeVariant = window.SOLID.store.getState("variant" + this._productJson.id);
            if (storeVariant && storeVariant.variant_init) {
                window.SOLID.store.dispatch("variant" + this._productJson.id, storeVariant);
                return;
            }
            // const $productJson = this.$element.closest("[keyword='product']").find(".ProductJson");
            // if ($productJson && $productJson.length) {
            // const variantID: number = parseInt($productJson.attr("data-variant"));
            var variantIDCache = this.getVariantIDCacheByDom();
            if (variantIDCache) {
                for (var i = 0; i < this._productJson.variants.length; i++) {
                    var currentVariant = this._productJson.variants[i];
                    if (currentVariant.id == variantIDCache) {
                        try {
                            var newVariant = JSON.parse(JSON.stringify(currentVariant));
                            // eslint-disable-next-line camelcase
                            newVariant.variant_init = true;
                            window.SOLID.store.dispatch("variant" + this._productJson.id, newVariant);
                        }
                        catch (e) {
                            console.log(e);
                        }
                        break;
                    }
                }
            }
            // }
        }
    };
    /**
     * event: thêm sự kiện click cho các variants
     */
    GtProductSwatchesV2.prototype.event = function () {
        if (this._productJson) {
            try {
                var variants_1 = this._productJson.variants;
                var $select = this.$element.find(this.classBtnSelect);
                var _this_1 = this;
                $select.off("click.select").on("click.select", function () {
                    var $el = jQuery(this);
                    if (!$el.hasClass("gt_soldout")) {
                        var name_1 = $el.attr("data-name");
                        // Update active
                        var $selector = _this_1.$element.find(_this_1.classBtnSelect + "[data-name=\"" + name_1 + "\"]");
                        if ($selector && $selector.length) {
                            $selector.removeClass("gf_active");
                            $selector.removeClass("gt_active");
                        }
                        $el.addClass("gf_active");
                        $el.addClass("gt_active");
                        var $actives = _this_1.$element.find(_this_1.classBtnSelect + ".gf_active," + _this_1.classBtnSelect + ".gt_active");
                        var values = [];
                        var i = void 0;
                        if ($actives && $actives.length) {
                            for (i = 0; i < $actives.length; i++) {
                                var activeValue = jQuery($actives[i]).attr("data-value");
                                if (activeValue) {
                                    values.push(activeValue);
                                }
                            }
                        }
                        var currentVariant = {};
                        if (values && values.length) {
                            for (i = 0; i < variants_1.length; i++) {
                                var variant = variants_1[i];
                                var options = variant.options; // => []
                                // console.log(options, " vs ", values)
                                if (_this_1.compare(values, options)) {
                                    currentVariant = variant;
                                    break;
                                }
                            }
                        }
                        if (!jQuery.isEmptyObject(currentVariant)) {
                            window.SOLID.store.dispatch("variant" + _this_1._productJson.id, currentVariant);
                        }
                        else {
                            // Sản phẩm không được định nghĩa
                            window.SOLID.store.dispatch("variant" + _this_1._productJson.id, {
                                id: 0,
                                available: false,
                            });
                        }
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    /**
     * listen: lắng nghe khi có variant active thay đổi
     */
    GtProductSwatchesV2.prototype.listen = function () {
        var _this_1 = this;
        var store = window.SOLID.store;
        if (this._productJson) {
            var options_1 = this._productJson.options;
            store.subscribe("variant" + this._productJson.id, function (variant) {
                if (variant && variant.variant_init) {
                    return;
                }
                _this_1.updateDataCacheAttr(variant.id);
                var $product = _this_1.$element.closest("[keyword='product'], [data-keyword='product']");
                var $currentStatus = $product.find(_this_1.classCurrentStatus);
                if ($currentStatus && $currentStatus.length) {
                    if (!variant.available) {
                        $currentStatus.show();
                        var labelSoldOut = $currentStatus.attr("data-sold-out") || "Sold Out";
                        $currentStatus.addClass(_this_1.classCurrentStatus.replace(".", "") + "--inner");
                        $currentStatus.html(labelSoldOut);
                    }
                    else {
                        $currentStatus.addClass(_this_1.classCurrentStatus.replace(".", "") + "--inner");
                        $currentStatus.hide();
                    }
                }
                if (variant.options && variant.options.length) {
                    for (var i = 0; i < variant.options.length; i++) {
                        var option = variant["option" + (i + 1)];
                        if (option) {
                            var name_2 = void 0;
                            if (options_1[i]) {
                                name_2 = options_1[i];
                            }
                            if (!name_2 || jQuery.isPlainObject(name_2)) {
                                name_2 = options_1[i].name;
                            }
                            var $item = _this_1.$element.find(_this_1.classItem + "[data-name=\"" + name_2 + "\"]");
                            if ($item && $item.length) {
                                var $select = $item.find(_this_1.classBtnSelect);
                                var $selectActive = $item.find(_this_1.classBtnSelect + "[data-value=\"" + option.replace(/"/g, "\\\"") + "\"]");
                                if (_this_1.classCurrentValue) {
                                    var $currentValue = $item.find(_this_1.classCurrentValue);
                                    if ($currentValue && $currentValue.length) {
                                        var $contentSelectActive = $selectActive.html();
                                        $currentValue.html($contentSelectActive);
                                        $currentValue.attr("data-value", option);
                                    }
                                }
                                if ($select && $select.length && $selectActive && $selectActive.length) {
                                    $select.removeClass("gf_active");
                                    $select.removeClass("gt_active");
                                    $selectActive.addClass("gf_active");
                                    $selectActive.addClass("gt_active");
                                }
                            }
                        }
                    }
                }
                if (!jQuery.isEmptyObject(variant)) {
                    if ($product && $product.length) {
                        var $input = $product.find(_this_1.classInputIdHidden);
                        if ($input && $input.length) {
                            $input.attr("value", variant.id).val(variant.id);
                            var currentURL = window.location.href;
                            var variantURL = _this_1.updateUrlParameter(currentURL, "variant", variant.id);
                            window.history.replaceState({}, "", variantURL);
                        }
                    }
                }
            });
        }
    };
    /**
     * getVariantIDCacheByDom
     * @returns current variant id
     */
    GtProductSwatchesV2.prototype.getVariantIDCacheByDom = function () {
        var variantID = this.$element.attr("data-variant-id") || "";
        return variantID;
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductSwatchesV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    /**
     * compare: compare 2 array
     * @param array array1
     * @param array2 array 2
     * @returns boolean
     */
    GtProductSwatchesV2.prototype.compare = function (array, array2) {
        array.sort();
        array2.sort();
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array2.length; j++) {
                var val1 = array[j];
                var val2 = array2[j];
                val1 = val1.replace(/"/gm, "'");
                val2 = val2.replace(/"/gm, "'");
                if (val1 != val2) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * updateUrlParameter: update params
     * @param url current url window.location.href
     * @param key "variant"
     * @param value variant id
     * @returns string
     */
    GtProductSwatchesV2.prototype.updateUrlParameter = function (url, key, value) {
        var parser = document.createElement("a");
        parser.href = url;
        var newUrl = parser.protocol + "//" + parser.host + parser.pathname;
        // has parameters ?
        if (parser.search && parser.search.indexOf("?") !== -1) {
            // parameter already exists
            if (parser.search.indexOf(key + "=") !== -1) {
                // paramters to array
                var params_1 = parser.search.replace("?", "");
                params_1 = params_1.split("&");
                params_1.forEach(function (param, i) {
                    if (param.indexOf(key + "=") !== -1) {
                        if (value !== null) {
                            params_1[i] = key + "=" + value;
                        }
                        else {
                            delete params_1[i];
                        }
                    }
                });
                if (params_1.length > 0) {
                    newUrl += "?" + params_1.join("&");
                }
            }
            else if (value !== null) {
                newUrl += parser.search + "&" + key + "=" + value;
            }
            else {
                newUrl += parser.search;
            } // skip the value (remove)
        }
        else if (value !== null) {
            newUrl += "?" + key + "=" + value;
        } // no parameters, create it
        newUrl += parser.hash;
        return newUrl;
    };
    return GtProductSwatchesV2;
}());
/**
 * gtProductSwatchesV2
 * @param params setting lib product swatches
 * @returns gtProductSwatchesV2
 */
window.SOLID.library.gtProductSwatchesV2 = function (params) {
    return new GtProductSwatchesV2(params);
};
exports.default = {};


/***/ })

/******/ });
});
        }
        funcLib105();
      } catch(e) {
        console.error("Error lib id: 105" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib7 = function() {
          "use strict";

/* gtProductPrice */
(function (jQuery) {
  var gtProductPrice = function (element, options) {
    var defaults = {
      classCurrentPrice: null,
      classComparePrice: null,
      syncQuantityPrice: true, // if syncQuantityPrice is true, change quantity trigger change price
      syncQuantityComparePrice: true,
      replacePriceForCurrentPrice: true,
      replacePriceForComparePrice: true,
      hideZeroPrice: false,
    };

    this.settings = {};

    var $element = jQuery(element).parent();
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);

      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
          _this.Init();
          _this.listen();
        }
      } catch (e) {
        console.log(e);
      }
    };

    this.Init = function () {
      var $currentPrice = $element.find(_this.settings.classCurrentPrice);
      var $comparePrice = $element.find(_this.settings.classComparePrice);
      var priceDefaults = $currentPrice.attr("data-currentprice");
      if (_this.settings.classCurrentPrice && _this.settings.replacePriceForCurrentPrice) {
        var price = _this.formatMoneyForSpecificPriceType(priceDefaults, "price");
        $currentPrice.html(price);
      }
      if (_this.settings.classComparePrice && _this.settings.replacePriceForComparePrice) {
        var $comparePrice = $element.find(_this.settings.classComparePrice);
        if ($comparePrice && $comparePrice.length) {
          var comparePriceDefaults = $comparePrice.attr("data-currentprice");
          var comparePrice = _this.formatMoneyForSpecificPriceType(comparePriceDefaults, "comparePrice");
          // so sanh comparePrice với price, chỉ hiển thị comparePrice khi comparePrice > price
          if (comparePrice && (!_this.settings.classCurrentPrice || parseFloat(comparePriceDefaults) > parseFloat(priceDefaults))) {
            $comparePrice.addClass("gf_active");
            $comparePrice.addClass("gt_active");
            $comparePrice.html(comparePrice);
          }
        }
      }
      if (_this.settings.hideZeroPrice) {
        if (parseFloat(priceDefaults)>0) {
          $currentPrice.show();
        } else {
          $currentPrice.hide();
          $comparePrice.hide();
        }
      }
    };

    this.listen = function () {
      var store = window.store;
      if (_productJson) {
        store.change("variant" + _productJson.id, function (variant) {
          var price = variant.price;
          price = _this.formatMoneyForSpecificPriceType(price, "price");
          var $currentPrice = $element.find(_this.settings.classCurrentPrice);
          var $comparePrice = $element.find(_this.settings.classComparePrice);
          if (_this.settings.classCurrentPrice && _this.settings.replacePriceForCurrentPrice) {
            // Trong trường hợp khi code section/addon muốn thay đổi giá trị và ko muốn tự update lại giá theo store thì thêm class dontChangePrice vào classCurrentPrice
            // VD: Tính năng Price Display Logic = Only each trong Bundle Section 9169
            if ($currentPrice && $currentPrice.length && !$currentPrice.hasClass("dontChangePrice")) {
              $currentPrice.attr("data-currentprice", variant.price);
              $currentPrice.html(price);
            }
          }

          if (_this.settings.classComparePrice && _this.settings.replacePriceForComparePrice) {
            if ($comparePrice && $comparePrice.length) {
              if (variant.compare_at_price && variant.compare_at_price - variant.price > 0) {
                var comparePrice = variant.compare_at_price;
                comparePrice = _this.formatMoneyForSpecificPriceType(comparePrice, "comparePrice");
                $comparePrice.addClass("gf_active");
                $comparePrice.addClass("gt_active");
                $comparePrice.html(comparePrice);
                $comparePrice.attr("data-currentprice", variant.compare_at_price);
              } else {
                $comparePrice.removeClass("gf_active");
                $comparePrice.removeClass("gt_active");
              }
            }
          }

          if (_this.settings.hideZeroPrice) {
            if (parseFloat($currentPrice.attr("data-currentprice"))>0) {
              $currentPrice.show();
            } else {
              $currentPrice.hide();
              $comparePrice.hide();
            }
          }
        });

        store.change("quantity" + _productJson.id, function () {
          _this.Init();
        });
      }

      store.change("dataCurrency", function () {
        _this.Init();
      });
    };

    // Get price with quantity
    this.getPriceWithQuantity = function (price) {
      if (_productJson) {
        var quantityProduct = window.store.get("quantity" + _productJson.id);
        quantityProduct = Number(quantityProduct);
        if (!quantityProduct || isNaN(quantityProduct)) {
          quantityProduct = 1;
        }
        price = Number(price) * quantityProduct;
      }
      return price;
    };

    // Format price
    this.formatMoneyForSpecificPriceType = function (price, type) {
      if ((type === "price" && _this.settings.syncQuantityPrice) || (type === "comparePrice" && _this.settings.syncQuantityComparePrice)) {
        price = _this.getPriceWithQuantity(price);
      } else {
        price = Number(price);
      }
      var dataCurrency = window.store.get("dataCurrency");
      var format = __GemSettings.money;
      if (dataCurrency) {
        price = Shopify.gemFormatMoney(price, dataCurrency.currency, dataCurrency.data);
      } else {
        price = Shopify.formatMoney(price, format);
      }
      return price;
    };
    this.init();
  };

  jQuery.fn.gtProductPrice = function (options) {
    return this.each(function () {
      var plugin = new gtProductPrice(this, options, jQuery);
      jQuery(this).data("gtproductprice", plugin);
    });
  };
})(jQuery);

        }
        funcLib7();
      } catch(e) {
        console.error("Error lib id: 7" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionNX61mg2YBEXmbDT = function() {
          
        }
        funcESSectionNX61mg2YBEXmbDT()
      } catch(e) {
        console.error("Error ESSection Id: NX61mg2YBEXmbDT" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_box = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_box";
  var id = "NX61mg2YBEXmbDT_box";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_box",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function checkRemoteDefaultInput() {
      if (isExistAtomVariant()) {
        var $inputVariantDefault = $element.find(".gt_variant-input--default");
        if ($inputVariantDefault && $inputVariantDefault.length) {
          $($inputVariantDefault[0]).remove()
        }
      }

      if (isExistAtomQuantity()) {
        var $inputQuantityDefault = $element.find(".gt_quantity-input--default");
        if ($inputQuantityDefault && $inputQuantityDefault.length) {
          $($inputQuantityDefault[0]).remove()
        }
      }
    }

    function isExistAtomVariant() {
      var $atomProduct = $element.find(".gt_variant--input")
      if ($atomProduct && $atomProduct.length) {
        return true
      }
      return false
    }

    function isExistAtomQuantity() {
      var $atomQuantity = $element.find(".gt_quantity--input")
      if ($atomQuantity && $atomQuantity.length) {
        return true
      }
      return false
    }
    /* init block script */
    addInteraction();
    checkRemoteDefaultInput();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_box()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_box" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_boxImage = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_boxImage";
  var id = "NX61mg2YBEXmbDT_boxImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_boxImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_boxImage()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_boxImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productImageList = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productImageList";
  var id = "NX61mg2YBEXmbDT_productImageList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var mode = "production";
    var checkWindowWidth = $(window).width();
    var widthSliderCurrent;
    var sizeIconDotsCurrent;
    var imageListPositionCurrent;
    var $imgSlide = $element.find(".gt_product-carousel-box");
    var $imgBox = $element.find(".gt_product-img-box");
    var $imgBoxInner = $element.find(".gt_product-img--inner");
    var $imgSlideItem = $element.find(".gt_product-carousel--item");
    var $productImgInner = $element.find(".gt_product-image--thumb");
    var $controlNext = $element.find(".gt_product--swiper .gt_control-next");
    var $controlPrev = $element.find(".gt_product--swiper .gt_control-prev");
    var dynamicDotsOnOff = "false" === "true";
    var slidesPerView_lg = "4";
    var slidesPerView_md = "4.3";
    var slidesPerView_sm = "5";
    var slidesPerView_xs = "5";
    var spaceBetween_lg = parseInt("17") || 1;
    var spaceBetween_md = parseInt("32") || 1;
    var spaceBetween_sm = parseInt("32") || 1;
    var spaceBetween_xs = parseInt("10") || 1;
    var widthActive = "false" === "true";
    var widthSlider = "100%";
    var widthSlider_lg = "100%";
    var widthSlider_md = "100%";
    var widthSlider_sm = "100%";
    var widthSlider_xs = "100%";
    var sizeIconDots_sm = "20px";
    var sizeIconDots_xs = "15px";
    var imageRadio = "portrait";
    var hideDisplayProductImageAdvanced = "false" === "true";
    let initShowFeatureImage = false;
    let initShow3DModel = false;
    let initShowExVideo = false;
    let initShowOtherVideo = false;
    if (hideDisplayProductImageAdvanced) {
      initShowFeatureImage = "selectedVariantAvailable" === "featureImage";
    } else {
      initShowFeatureImage = "featureImageAdvanced" === "featureImageAdvanced";
      initShow3DModel = "featureImageAdvanced" === "3DModel";
      initShowExVideo = "featureImageAdvanced" === "exVideo";
      initShowOtherVideo = "featureImageAdvanced" === "otherVideo";
    }
    var imageListPosition = "bottom";
    var imageListPosition_lg = "bottom";
    var imageListPosition_md = "bottom";
    var imageListPosition_sm = "bottom";
    var imageListPosition_xs = "bottom";
    var imageListActive = "false" === "true";
    var spaceBetween_sm = "32";
    var spaceBetween_xs = "10";
    var scaleZoomImageActive = "false" === "true";
    var mySwiper;
    var mySwiperFeature;
    var spacingSmall = "16px";
    var displayTypeThumb = "thumb" === "thumb";
    var displayTypeCenter = "thumb" === "center";
    var allowDragSlider = "false" === "true";
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var featuredImage = $(elementClassName).find(".gt_product-img--inner img");
      var itemImage = $(elementClassName).find(".gt_product-carousel-box img");
      var widthFeaturedImage = featuredImage.width();
      var heightFeaturedImage = featuredImage.height();
      var widthItemImage = itemImage.width();
      var heightItemImage = itemImage.height();
      featuredImage.attr("width", widthFeaturedImage);
      featuredImage.attr("height", heightFeaturedImage);
      itemImage.attr("width", widthItemImage);
      itemImage.attr("height", heightItemImage);
    }

    function checkEnableEffectZoomImage() {
      if (scaleZoomImageActive) {
        var productImageFeature = $element.find(".gt_product-image--feature");
        if (productImageFeature && productImageFeature.length) {
          $element.find(".gt_product-image--scale").gfProductZoomImage({
            classHoverItem: ".gt_product-img-box",
            scale: "1.5",
            classSection: ".gt_atom-NX61mg2YBEXmbDT_productImageList",
          });
        }
      }
    }

    function listen() {
      listenElementResizeEvent();
      listenWindowResizeEvent();
    }

    function listenElementResizeEvent() {
      let observer = new ResizeObserver(() => {
        if (mySwiper) {
          mySwiper.update()
        }
      })
      observer.observe($element[0]);
    }

    function listenWindowResizeEvent() {
      var delayResize = 0;
      $(window).off("resize.checkSwitchScreensNX61mg2YBEXmbDT_productImageList").on("resize.checkSwitchScreensNX61mg2YBEXmbDT_productImageList", function() {
        clearTimeout(delayResize);
        delayResize = setTimeout(function() {
          const windowWidthCurrent = $(window).width();
          if (windowWidthCurrent !== checkWindowWidth) {
            checkWindowWidth = windowWidthCurrent;
            widthSliderCurrent = 0;
            sizeIconDotsCurrent = 0;
            if (checkWindowWidth <= 576) {
              widthSliderCurrent = widthSlider_xs;
              sizeIconDotsCurrent = sizeIconDots_xs;
            } else if (checkWindowWidth <= 992) {
              widthSliderCurrent = widthSlider_sm;
              sizeIconDotsCurrent = sizeIconDots_sm;
            } else if (checkWindowWidth <= 1200) {
              widthSliderCurrent = widthSlider_md;
            } else {
              widthSliderCurrent = widthSlider;
            }
            if (widthActive) {
              $element.css("cssText", "width: " + widthSliderCurrent + " !important;");
              mySwiper.update();
            }
            var $paginationItem = $element.find(".gt_control-pagination-item");
            var $paginationItemIcon = $element.find(".gt_control-pagination-item .gt_icon");
            $paginationItemIcon.css("cssText", "width: " + sizeIconDotsCurrent + " !important; height: " + sizeIconDotsCurrent + "!important;");
            $paginationItem.css("cssText", "width: calc(8px + " + sizeIconDotsCurrent + ") !important; height: calc(8px + " + sizeIconDotsCurrent + ") !important;");

            checkImageListPosition();
            calculatorImageSlideHeight();
            checkImageListActive();
            initSlider();
          }
        }, 100)
      });
      if ($element.find(".swiper-slide").length == 1) {
        $element.find('.swiper-wrapper').addClass("gt_disabled");
        $element.find('.gt_control-pagination').addClass("gt_disabled");
      }
    }

    function autoRotateModel() {
      var model = $element.find(".gt_product-media--feature .gt_product-model");
      model.attr("auto-rotate", true);
    }

    function initSlider() {
      if (mySwiper) {
        mySwiper.destroy();
        checkDimensions();
      }
      var $swiperContainer = $element.find(".gt_product--swiper-NX61mg2YBEXmbDT_productImageList");
      if (!$swiperContainer || !$swiperContainer.length) {
        return;
      }
      if ($swiperContainer[0].swiper) {
        $swiperContainer[0].swiper.destroy();
      }
      if (mySwiperFeature) {
        mySwiperFeature.destroy();
      }
      if ($swiperContainer.find(".swiper-slide").length == 1) {
        $swiperContainer.addClass("gt_disabled");
      }
      var $swiperContainerFeature = $element.find(".gt_product-feature--swiper-NX61mg2YBEXmbDT_productImageList");
      if (!$swiperContainerFeature || !$swiperContainerFeature.length) {
        return;
      }
      if ($swiperContainerFeature[0].swiper) {
        $swiperContainerFeature[0].swiper.destroy();
      }
      if ($swiperContainerFeature.find(".swiper-slide").length == 1) {
        $swiperContainerFeature.find(".swiper-wrapper").addClass("gt_disabled");
        $swiperContainerFeature.find(".gt_control-pagination").addClass("gt_disabled");
      }
      let gtProductImageParams = {
        $element: $element,
        settings: {
          classSwiperItems: ".gt_product--swiper-NX61mg2YBEXmbDT_productImageList .gt_product-carousel--item",
          classSwiperItemsImage: ".gt_product--swiper-NX61mg2YBEXmbDT_productImageList .gt_product-carousel--item img",
          classSwiperContainer: ".gt_product--swiper-NX61mg2YBEXmbDT_productImageList",
          initShowFeatureImage: initShowFeatureImage,
          initShow3DModel: initShow3DModel,
          initShowExVideo: initShowExVideo,
          initShowOtherVideo: initShowOtherVideo,
          swiperSetting: getDataSwiperSettings(),
          //featureimageswiper
          featureSwiperSetting: getDataSwiperSettingsFeature(),
          classFeatureSwiperContainer: ".gt_product-feature--swiper-NX61mg2YBEXmbDT_productImageList",
          classFeatureSwiperItemsImage: ".gt_product-feature--swiper-NX61mg2YBEXmbDT_productImageList .gt_product-image--feature",
        }
      }
      window.SOLID.library.gtProductImagesV2(gtProductImageParams);
      mySwiper = $swiperContainer[0].swiper;
      mySwiperFeature = $swiperContainerFeature[0].swiper;
    }

    function getDataSwiperSettings() {
      let direction = 'horizontal';
      if (displayTypeThumb) {
        if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
          direction = "vertical";
        }
      }

      let loop = false;
      let centeredSlides = false;
      let freeMode = true;
      if (displayTypeCenter && checkWindowWidth > 992) {
        loop = true;
        centeredSlides = true;
        freeMode = false;
      }
      return {
        mousewheel: false,
        loop: loop,
        centeredSlides: centeredSlides,
        slidesPerView: 3,
        spaceBetween: 16,
        freeMode: freeMode,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        navigation: {
          nextEl: ".gt_product--swiper-NX61mg2YBEXmbDT_productImageList .gt_control-next",
          prevEl: ".gt_product--swiper-NX61mg2YBEXmbDT_productImageList .gt_control-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: slidesPerView_xs,
            spaceBetween: spaceBetween_xs,
            direction: direction,
            mousewheel: false,
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          577: {
            slidesPerView: slidesPerView_sm,
            spaceBetween: spaceBetween_sm,
            direction: direction,
            mousewheel: false,
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          993: {
            slidesPerView: slidesPerView_md,
            spaceBetween: spaceBetween_md,
            direction: direction,
            mousewhel: true,
          },
          1201: {
            slidesPerView: slidesPerView_lg,
            spaceBetween: spaceBetween_lg,
            direction: direction,
            mousewhel: true,
          }
        },
        on: {
          init: function() {
            window.SOLID.store.dispatch("trigger-lazyload", true);
          },
          imagesReady: function() {
            if (displayTypeCenter && checkWindowWidth > 992) {
              setTimeout(() => {
                var $swiperWrapperHide = $element.find(".gt_swiper_wrapper-type-center");
                if ($swiperWrapperHide && $swiperWrapperHide.length) {
                  $swiperWrapperHide.removeClass("gt_swiper_wrapper-type-center");
                }
              }, 100)
            }
          }
        },
      }
    }

    function getDataSwiperSettingsFeature() {
      let allowTouchMove = false;
      var productImageFeature = $element.find(".gt_product-image--feature");
      if (allowDragSlider && !productImageFeature.hasClass("gt_product-media--model") || displayTypeCenter) {
        allowTouchMove = true;
      }
      return {
        allowTouchMove: allowTouchMove,
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: {
          nextEl: ".gt_product-feature--swiper-NX61mg2YBEXmbDT_productImageList .gt_product-img-nav--right",
          prevEl: ".gt_product-feature--swiper-NX61mg2YBEXmbDT_productImageList .gt_product-img-nav--left",
        },
        pagination: {
          el: "#gt_control-pagination-NX61mg2YBEXmbDT_productImageList",
          type: 'bullets',
          clickable: true,
          renderBullet: function(index, classname) {
            return `<div class="gt_control-pagination-item ` + classname + ` ">
            <span data-optimize-type="icon"  data-attribute="iconDots,"  data-section-id="NX61mg2YBEXmbDT_productImageList"  class="gt_icon"><svg height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 22C13.05 22 13.5 21.55 13.5 21V3C13.5 2.45 13.05 2 12.5 2C11.95 2 11.5 2.45 11.5 3V21C11.5 21.55 11.95 22 12.5 22ZM8.5 18C9.05 18 9.5 17.55 9.5 17V7C9.5 6.45 9.05 6 8.5 6C7.95 6 7.5 6.45 7.5 7V17C7.5 17.55 7.95 18 8.5 18ZM5.5 13C5.5 13.55 5.05 14 4.5 14C3.95 14 3.5 13.55 3.5 13V11C3.5 10.45 3.95 10 4.5 10C5.05 10 5.5 10.45 5.5 11V13ZM16.5 18C17.05 18 17.5 17.55 17.5 17V7C17.5 6.45 17.05 6 16.5 6C15.95 6 15.5 6.45 15.5 7V17C15.5 17.55 15.95 18 16.5 18ZM19.5 13V11C19.5 10.45 19.95 10 20.5 10C21.05 10 21.5 10.45 21.5 11V13C21.5 13.55 21.05 14 20.5 14C19.95 14 19.5 13.55 19.5 13Z" fill="currentColor"/> </svg></span>
          </div>`;
          }
        },
        breakpoints: {
          0: {
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          577: {
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          }
        },
      }
    }

    function changeSliderActive(value) {
      if (value && value.sliderIndex !== NaN) {
        if (loop) {
          mySwiper.slideToLoop(value.sliderIndex, 500, true);
        } else {
          mySwiper.slideTo(value.sliderIndex, 500, true);
        }
      }
    }

    function isImgSliderBottom() {
      const $productImage = $element.find(".gt_product-image-list--bottom");
      if ($productImage && $productImage.length) {
        return true;
      }
      return false;
    }

    function checkImageListActive() {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        if (imageListActive) {
          slidesPerView_xs = "5";
          spaceBetween_xs = "10";
        } else if (!imageListActive) {
          slidesPerView_xs = 1;
          spaceBetween_xs = 0;
        }
      } else if (checkWindowWidth <= 992) {
        if (imageListActive) {
          slidesPerView_sm = "5";
          spaceBetween_sm = "32"
        } else if (!imageListActive) {
          slidesPerView_sm = 1;
          spaceBetween_sm = 0;
        }
      }
    }

    function calculatorImageSlideHeight() {
      var delay = setTimeout(function() {
        checkWindowWidth = $(window).width();
        if (!isImgSliderBottom()) {
          $imgBox = $element.find(".gt_product-img-box");
          var imgBoxHeight = $imgBox && $imgBox.length && $imgBox[0].offsetHeight;
          $imgSlide.css("height", imgBoxHeight);
          mySwiper.update();
        } else {
          $imgSlide.css("height", "");
        }
      }, 500);
    }

    function optimizeSizeIconDots(value) {
      mySwiper.pagination.render();
      var $paginationItem = $element.find(".gt_control-pagination-item");
      var $paginationItemIcon = $element.find(".gt_control-pagination-item .gt_icon");
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        sizeIconDots_xs = value;
      } else if (checkWindowWidth <= 992) {
        sizeIconDots_sm = value;
      }
      $paginationItemIcon.css("cssText", "width: " + value + " !important; height: " + value + "!important;");
      $paginationItem.css("cssText", "width: calc(8px + " + value + ") !important; height: calc(8px + " + value + ") !important;");
      mySwiper.pagination.update();
    }

    function optimizeSlidePerView(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        slidesPerView_xs = value;
      } else if (checkWindowWidth <= 992) {
        slidesPerView_sm = value;
      } else if (checkWindowWidth <= 1200) {
        slidesPerView_md = value;
      } else {
        slidesPerView_lg = value;
      }
      initSlider();
    }

    function optimizeWidthSlider(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        widthSlider_xs = value;
      } else if (checkWindowWidth <= 992) {
        widthSlider_sm = value;
      } else if (checkWindowWidth <= 1200) {
        widthSlider_md = value;
      } else {
        widthSlider_lg = widthSlider = value;
      }
      $element.css("cssText", "width: " + value + " !important;");
      mySwiper.update();
      calculatorImageSlideHeight();
    }

    function optimizeWidthActive(value) {
      widthActive = value;
      if (!value) {
        $element.css("cssText", "width: null");
      } else {
        checkWindowWidth = $(window).width();
        widthSliderCurrent = 0;
        if (checkWindowWidth <= 576) {
          widthSliderCurrent = widthSlider_xs;
        } else if (checkWindowWidth <= 992) {
          widthSliderCurrent = widthSlider_sm;
        } else if (checkWindowWidth <= 1200) {
          widthSliderCurrent = widthSlider_md;
        } else {
          widthSliderCurrent = widthSlider;
        }
        $element.css("cssText", "width: " + widthSliderCurrent + " !important;");
        initSlider();
        mySwiper.update();
      }
    }

    function checkImageListPosition({
      isInit
    } = {}) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        imageListPositionCurrent = imageListPosition_xs;
        spacingSmall = "10px";
      } else if (checkWindowWidth <= 992) {
        imageListPositionCurrent = imageListPosition_sm;
        spacingSmall = "16px";
      } else if (checkWindowWidth <= 1200) {
        imageListPositionCurrent = imageListPosition_md;
        spacingSmall = "16px";
      } else {
        imageListPositionCurrent = imageListPosition;
        spacingSmall = "16px";
      }
      $element.find("#gt_product-image-list-id").attr("class", "gt_product-image-list--" + imageListPositionCurrent);
      //showimage
      var $swiperWrapperHide = $element.find(".gt-carousel--hide-default");
      var $productImageList = $element.find("#gt_product-image-list-id");
      if ($swiperWrapperHide && $swiperWrapperHide.length) {
        $swiperWrapperHide.removeClass("gt-carousel--hide-default");
        $productImageList.css("height", "auto");
      }
      if (imageListPositionCurrent !== "bottom") {
        var $productImageListWrapper = $element.find(".gt_product-carousel-box");
        var $productImageBox = $element.find(".gt_product-image--inner");
        $productImageListWrapper.css("height", $productImageBox.outerHeight());
      }
      //css
      if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
        $controlNext.css({
          "height": "auto",
          "width": "100%"
        });
        $controlPrev.css({
          "height": "auto",
          "width": "100%"
        });
      }
      if (imageListPositionCurrent === "left") {
        $productImgInner.css("flex-direction", "row-reverse");
        $imgSlide.css({
          "padding-left": "0",
          "padding-right": spacingSmall
        });
      } else if (imageListPositionCurrent === "right") {
        $productImgInner.css("flex-direction", "row");
        $imgSlide.css({
          "padding-right": "0",
          "padding-left": spacingSmall
        });
      } else {
        $productImgInner.css("flex-direction", "column");
        $imgSlide.css("padding", "");
        $controlNext.css({
          "height": "100%",
          "width": "auto"
        });
        $controlPrev.css({
          "height": "100%",
          "width": "auto"
        });
      }
      if (!isInit) {
        initSlider();
        mySwiper.update();
      }
    }

    function optimizeImageListPosition(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        imageListPosition_xs = imageListPositionCurrent = value;
      } else if (checkWindowWidth <= 992) {
        imageListPosition_sm = imageListPositionCurrent = value;
      } else if (checkWindowWidth <= 1200) {
        imageListPosition_md = imageListPositionCurrent = value;
      } else {
        imageListPosition_lg = imageListPositionCurrent = imageListPosition = value;
      }
      if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
        $controlNext.css({
          "height": "auto",
          "width": "100%"
        });
        $controlPrev.css({
          "height": "auto",
          "width": "100%"
        });
      }
      if (imageListPositionCurrent === "left") {
        $productImgInner.css("flex-direction", "row-reverse");
        $imgSlide.css({
          "padding-left": "0",
          "padding-right": spacingSmall
        });
      } else if (imageListPositionCurrent === "right") {
        $productImgInner.css("flex-direction", "row");
        $imgSlide.css({
          "padding-right": "0",
          "padding-left": spacingSmall
        });
      } else {
        $productImgInner.css("flex-direction", "column");
        $imgSlide.css("padding", "");
        $controlNext.css({
          "height": "100%",
          "width": "auto"
        });
        $controlPrev.css({
          "height": "100%",
          "width": "auto"
        });
      }
      $element.find("#gt_product-image-list-id").attr("class", "gt_product-image-list--" + value);
      initSlider();
      mySwiper.update();
      calculatorImageSlideHeight();
    }

    function optimizeImageRadio(imageRadio) {
      checkWindowWidth = $(window).width();
      imageRadio = value;
      if (imageRadio === "square") {
        $imgBoxInner.css("padding-top", "calc(100%)");
      } else if (imageRadio === "landscape") {
        $imgBoxInner.css("padding-top", "calc(100% * 3 / 4)");
      } else if (imageRadio === "portrait") {
        $imgBoxInner.css("padding-top", "calc(100% * 4 / 3)");
      }
      if (isImgSliderBottom() || checkWindowWidth < 992) {
        if (imageRadio === "square") {
          $imgSlideItem.css("padding-top", "calc(100%)");
        } else if (imageRadio === "landscape") {
          $imgSlideItem.css("padding-top", "calc(100% * 3 / 4)");
        } else if (imageRadio === "portrait") {
          $imgSlideItem.css("padding-top", "calc(100% * 4 / 3)");
        }
      }
      calculatorImageSlideHeight();
    }

    function optimizeImageRadioActive(value) {
      if (!value) {
        $imgBoxInner.css("padding-top", "");
        $imgSlideItem.css("padding-top", "");
      } else {
        optimizeImageRadio(imageRadio);
      }
      calculatorImageSlideHeight();
    }

    function optimizeDynamicDotsOnOff(value) {
      dynamicDotsOnOff = value;
      initSlider();
      var paginationEl = mySwiperFeature.pagination.el;
      if (value) {
        paginationEl.style.cssText = paginationEl.style.cssText + "margin: 0px auto; transform: translateX(0px); justify-content: unset;";
      } else {
        paginationEl.style.cssText = paginationEl.style.cssText + "justify-content: center;";
        paginationEl.classList.remove("swiper-pagination-bullets-dynamic");
      }
      mySwiperFeature.pagination.update();
      mySwiperFeature.update();
    }

    function getMySwiper() {
      return mySwiper;
    }

    function getMySwiperFeature() {
      return mySwiperFeature;
    }
    /* init block script */
    checkDimensions();
    checkImageListPosition({
      isInit: true
    });
    checkImageListActive();
    initSlider();
    calculatorImageSlideHeight();
    checkEnableEffectZoomImage();
    autoRotateModel();
    listen();
    /* store subscribe block script */
    store.subscribe("optimize-NX61mg2YBEXmbDT_productImageList-sizeIconDots", optimizeSizeIconDots);
    store.subscribe("optimal-NX61mg2YBEXmbDT_productImageList-slidesPerView", optimizeSlidePerView);
    store.subscribe("optimal-NX61mg2YBEXmbDT_productImageList-widthSlider", optimizeWidthSlider);
    store.subscribe("optimal-NX61mg2YBEXmbDT_productImageList-widthActive", optimizeWidthActive);
    store.subscribe("optimal-NX61mg2YBEXmbDT_productImageList-imageRadio", optimizeImageRadio);
    store.subscribe("optimal-NX61mg2YBEXmbDT_productImageList-imageRadioActive", optimizeImageRadioActive);
    store.subscribe("optimal-NX61mg2YBEXmbDT_productImageList-dynamicDotsOnOff", optimizeDynamicDotsOnOff);
    store.subscribe("optimal-NX61mg2YBEXmbDT_productImageList-imageListPosition", optimizeImageListPosition);
    store.subscribe("trigger-slider-NX61mg2YBEXmbDT_productImageList", changeSliderActive);

    function destroy() {
      store.unsubscribe("optimize-NX61mg2YBEXmbDT_productImageList-sizeIconDots", optimizeSizeIconDots);
      store.unsubscribe("optimal-NX61mg2YBEXmbDT_productImageList-slidesPerView", optimizeSlidePerView);
      store.unsubscribe("optimal-NX61mg2YBEXmbDT_productImageList-widthSlider", optimizeWidthSlider);
      store.unsubscribe("optimal-NX61mg2YBEXmbDT_productImageList-widthActive", optimizeWidthActive);
      store.unsubscribe("optimal-NX61mg2YBEXmbDT_productImageList-imageRadio", optimizeImageRadio);
      store.unsubscribe("optimal-NX61mg2YBEXmbDT_productImageList-imageRadioActive", optimizeImageRadioActive);
      store.unsubscribe("optimal-NX61mg2YBEXmbDT_productImageList-dynamicDotsOnOff", optimizeDynamicDotsOnOff);
      store.unsubscribe("optimal-NX61mg2YBEXmbDT_productImageList-imageListPosition", optimizeImageListPosition);
      store.unsubscribe("trigger-slider-NX61mg2YBEXmbDT_productImageList", changeSliderActive);
    }
    /* events block script */
    /* destroy block script */
    
    /* public func block script */
    return {
      initSlider,
      getMySwiper,
      getMySwiperFeature,
      checkImageListPosition,
      calculatorImageSlideHeight,
      checkImageListActive
    };
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      var publicFunc = script($target, indexEl);
      window.SOLID.public = window.SOLID.public || {};
      window.SOLID.public["atom" + "_" + id + "_" + indexEl] = publicFunc;
      if (publicFunc) {
        store.dispatch("public_function_atom_" + id, publicFunc);
      }
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productImageList()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productImageList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productTagSale = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productTagSale";
  var id = "NX61mg2YBEXmbDT_productTagSale";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const roundPercent = Number("0");
    const removeZeros = "true" === "true";
    /* store get state block script */
    /* methods block script */
    /* init block script */
    window.SOLID.library.gtProductSaveV2({
      $element: $element,
      settings: {
        classTextPercent: ".gt_product-tag-sale--value--percent",
        classTextNumber: ".gt_product-tag-sale--value--number",
        dataFormat: "[!Profit!] OFF",
        dataFormatKey: "[!Profit!]",
        customCurrencyFormating: "shortPrefix",
        roundPercent: roundPercent,
        roundNoZeroes: removeZeros
      }
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productTagSale()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productTagSale" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_boxInfo = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_boxInfo";
  var id = "NX61mg2YBEXmbDT_boxInfo";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_boxInfo",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_boxInfo()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_boxInfo" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productTitle = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productTitle";
  var id = "NX61mg2YBEXmbDT_productTitle";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NX61mg2YBEXmbDT_productTitle",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "NX61mg2YBEXmbDT_productTitle",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productTitle()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productTitle" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_boxPrice = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_boxPrice";
  var id = "NX61mg2YBEXmbDT_boxPrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_boxPrice",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_boxPrice()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_boxPrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productPrice = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productPrice";
  var id = "NX61mg2YBEXmbDT_productPrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!price!]"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NX61mg2YBEXmbDT_productPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "NX61mg2YBEXmbDT_productPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-price-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-price-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    };
    $element.gtProductPrice({
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityPrice: syncQuantityandPrice,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productPrice()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productPrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productComparePrice = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productComparePrice";
  var id = "NX61mg2YBEXmbDT_productComparePrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NX61mg2YBEXmbDT_productComparePrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "NX61mg2YBEXmbDT_productComparePrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    $element.gtProductPrice({
      classComparePrice: ".gt_product-price--compare",
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityComparePrice: syncQuantityandPrice,
      replacePriceForCurrentPrice: false,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productComparePrice()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productComparePrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productIntro = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productIntro";
  var id = "NX61mg2YBEXmbDT_productIntro";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NX61mg2YBEXmbDT_productIntro",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "NX61mg2YBEXmbDT_productIntro",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productIntro()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productIntro" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productSKU = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productSKU";
  var id = "NX61mg2YBEXmbDT_productSKU";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const labelSKU = `SKU:`;
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var $fakeDiv = document.createElement("div");
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NX61mg2YBEXmbDT_productSKU",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block",
        };
        var settingsText = {
          elementId: "NX61mg2YBEXmbDT_productSKU",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text",
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover",
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function listenVariantChange() {
      window.store.change("variant" + _productJson.id, function(newVariant) {
        if (!newVariant || !newVariant.sku) {
          $element.find(".gt_variant-sku").empty().addClass("gt_hide");
          $element.find(".gt_label-sku").empty().addClass("gt_hide");
        } else {
          $element.find(".gt_variant-sku").text(newVariant.sku).removeClass("gt_hide");
          $element.find(".gt_label-sku").html(decodeEntities(labelSKU)).removeClass("gt_hide");
        }
      });
    }

    function decodeEntities(str) {
      if (str && typeof str === "string") {
        //stripscript/htmltags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, "");
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, "");
        $fakeDiv.innerHTML = str;
        str = $fakeDiv.textContent;
        $fakeDiv.textContent = "";
      }

      return str;
    }
    /* init block script */
    addInteraction();

    /*variantchange*/
    if ("production" === "production") {
      var productJsonText = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();
      var _productJson = null;
      try {
        if (productJsonText) {
          _productJson = JSON.parse(productJsonText);
          listenVariantChange();
        }
      } catch (e) {
        console.log(e);
      }
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productSKU()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productSKU" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productVendor = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productVendor";
  var id = "NX61mg2YBEXmbDT_productVendor";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NX61mg2YBEXmbDT_productVendor",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "NX61mg2YBEXmbDT_productVendor",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productVendor()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productVendor" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_featureList = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_featureList";
  var id = "NX61mg2YBEXmbDT_featureList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_featureList",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_featureList()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_featureList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_featureListItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_featureListItem_0";
  var id = "NX61mg2YBEXmbDT_featureListItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_featureListItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_featureListItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_featureListItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_icon_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_icon_0";
  var id = "NX61mg2YBEXmbDT_icon_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_icon_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_icon_0()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_icon_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_message_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_message_0";
  var id = "NX61mg2YBEXmbDT_message_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NX61mg2YBEXmbDT_message_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "NX61mg2YBEXmbDT_message_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_message_0()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_message_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_featureListItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_featureListItem_1";
  var id = "NX61mg2YBEXmbDT_featureListItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_featureListItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_featureListItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_featureListItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_icon_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_icon_1";
  var id = "NX61mg2YBEXmbDT_icon_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_icon_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_icon_1()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_icon_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_message_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_message_1";
  var id = "NX61mg2YBEXmbDT_message_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NX61mg2YBEXmbDT_message_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "NX61mg2YBEXmbDT_message_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_message_1()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_message_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_featureListItem_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_featureListItem_2";
  var id = "NX61mg2YBEXmbDT_featureListItem_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_featureListItem_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_featureListItem_2()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_featureListItem_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_icon_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_icon_2";
  var id = "NX61mg2YBEXmbDT_icon_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_icon_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_icon_2()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_icon_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_message_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_message_2";
  var id = "NX61mg2YBEXmbDT_message_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NX61mg2YBEXmbDT_message_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "NX61mg2YBEXmbDT_message_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_message_2()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_message_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_line1 = function() {
          
        }
        funcESAtomNX61mg2YBEXmbDT_line1()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_line1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productVariant = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productVariant";
  var id = "NX61mg2YBEXmbDT_productVariant";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var $variantChecked = $element.find(".gt_product-variant--checked");
    var $variantOptions = $element.find(".gt_product-variant-options");
    var mode = "production";
    var animationActive = 'false';
    var timeoutTooltip = null;
    /* store get state block script */
    /* methods block script */
    function animation() {
      if (animationActive === "true") {
        var interactionScrollIntoView =
          '""';
        window.SOLID.library.animation({
          elementId: id,
          $doms: $elements,
          interactionScrollIntoView: {
            value: JSON.parse(interactionScrollIntoView),
            previewAttr: "interactionScrollIntoView",
          },
          animationType: "block",
          mode: mode,
        });
      }
    }

    function initSwatches() {
      window.SOLID.library.gtProductSwatchesV2({
        $element: $element,
        settings: {
          classCurrentValue: ".gt_product-variant-option--selected .gt_product-variant-option--selected-text",
          classItem: ".gt_variant--select-item",
          classInputIdHidden: ".gt_variant--input",
          classBtnSelect: ".gt_product-variant--btn-select",
        }
      });
    }

    function openSelectDropdown() {
      $variantChecked.removeClass("gt_active");
      var $options = $(this).siblings(".gt_product-variant-options");
      if ($options.hasClass("gt_active")) {
        $options.css("top", "");
        $options.removeClass("gt_active");
        $(this).removeClass("gt_active");
        clearEventShowTooltip();
        $(document).off("mousedown.outsideClickVariantSelect");
      } else {
        $variantOptions.removeClass("gt_active");
        $options.addClass("gt_active");
        $(this).addClass("gt_active");
        var optionsOuterHeight = $options.outerHeight();
        var selectInputHeight = $variantChecked.outerHeight();
        var positionOptions = $options.offset().top - $(document).scrollTop() + optionsOuterHeight;
        var windowHeight = $(window).outerHeight();
        if (positionOptions > windowHeight) {
          const currentTopOptions = $options.css("top");
          const newTop = "calc( " + currentTopOptions + " - " + optionsOuterHeight + "px" + " - " + (Number(selectInputHeight) + 10) + "px" + " )";
          $options.css("top", newTop);
        }
        clearTimeout(timeoutTooltip);
        timeoutTooltip = setTimeout(() => {
          eventShowTooltipSelectType();
        }, 300)
        //addeventclickoutsidetoclose
        const $currentTargetOptions = $(this);
        $(document).off("mousedown.outsideClickVariantSelect").on("mousedown.outsideClickVariantSelect", function(event) {
          if ($options && $options.length && $currentTargetOptions && $currentTargetOptions.length) {
            const $optionsPure = $options[0];
            if ($optionsPure && !$optionsPure.contains(event.target) && !$currentTargetOptions[0].contains(event.target)) {
              $options.css("top", "");
              $options.removeClass("gt_active");
              $currentTargetOptions.removeClass("gt_active");
              clearEventShowTooltip();
              $(document).off("mousedown.outsideClickVariantSelect");
            }
          }
        });
      }
    }

    function onClickSelectDropDown() {
      $variantChecked.removeClass("gt_active");
      $variantOptions.removeClass("gt_active");
      var value = $(this).attr("data-value");
      var $variantCheckedCurrent = $(this).closest(
        ".gt_product-variant--select-box"
      );
      var $valueVariantChecked = $variantCheckedCurrent.find(
        ".gt_product-variant-option--selected .gt_product-variant-option--selected-text"
      );
      var $contentOptionSelect = $(this).html();
      $valueVariantChecked.attr("data-value", value);
      $valueVariantChecked.html($contentOptionSelect);
      //closetooltip
      const $tooltip = $element.find(".gt_product-variant-tooltip");
      $tooltip.css("display", "none");
      clearEventShowTooltip();
    }

    function hideAtomWhenNoVariant() {
      $element.css("display", "");
      var isHide = true;
      var $variantItems = $element.find(".gt_product-variant--item")
      for (var i = 0; i < $variantItems.length; i++) {
        var $item = $($variantItems[i]);
        var display = $item.css("display");
        if (display !== "none") {
          isHide = false;
          break;
        }
      }
      if (isHide) {
        $element.css("display", "none");
      }
    }

    function eventShowTooltipSelectType() {
      const $selectItems = $element.find(".gt_variant--select-item");
      for (var i = 0; i < $selectItems.length; i++) {
        const $selectItem = $($selectItems[i]);
        const $selectOptions = $selectItem.find(".gt_product-variant-option");
        const $tooltip = $selectItem.find(".gt_product-variant-tooltip");
        $selectOptions.off("mouseenter").on("mouseenter", function() {
          //checkoverflow
          const $contentValue = $(this).find(".gt_product-variant-option--txt");
          const cachedDisplayContentValue = $contentValue.css("display");
          $contentValue.css({
            display: "inline",
            overflow: "unset",
            whiteSpace: "nowrap"
          });
          const realWidth = $contentValue.outerWidth();
          $contentValue.css({
            display: cachedDisplayContentValue,
            overflow: "",
            whiteSpace: ""
          });
          //
          const selectOptionTop = this.getBoundingClientRect().top;
          const selectItemTop = $selectItem[0].getBoundingClientRect().top;
          const selectOptionHeight = $(this).outerHeight();
          const selectOptionWidth = $(this).outerWidth();
          const contentSelect = $contentValue.html();
          if (realWidth > selectOptionWidth) {
            $tooltip.find(".gt_product-variant-tooltip-name").html(contentSelect);
            $tooltip.css({
              display: "block",
              top: selectOptionTop - selectItemTop - selectOptionHeight,
              zIndex: 10
            });
            $tooltip.find(".gt_product-variant-tooltip-arrow").css({
              left: selectOptionWidth / 2 + "px",
            })
          }
        });
        $selectOptions.off("mouseleave").on("mouseleave", function() {
          $tooltip.css({
            display: "none"
          })
        });
      }
    }

    function clearEventShowTooltip() {
      const $selectitems = $element.find(".gt_variant--select-item");
      for (var i = 0; i < $selectitems.length; i++) {
        const $selectitem = $($selectitems[i]);
        const $selectoptions = $selectitem.find(".gt_product-variant-option");
        $selectoptions.off("mouseenter");
        $selectoptions.off("mouseleave");
      }
    }
    /* init block script */
    hideAtomWhenNoVariant();
    initSwatches();
    animation();
    /* store subscribe block script */
    /* events block script */
    var $elements_1 = $element.find(".gt_product-variant--checked");
    $elements_1.off("click.openSelect").on("click.openSelect", openSelectDropdown);
    var $elements_2 = $element.find(".gt_product-variant-option");
    $elements_2.off("click.selectItem").on("click.selectItem", onClickSelectDropDown);
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productVariant()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productVariant" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productQuantity = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productQuantity";
  var id = "NX61mg2YBEXmbDT_productQuantity";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var style = "vertical";
    var mode = "production";
    var interactionScrollIntoViewActive = "false";
    /* store get state block script */
    /* methods block script */
    function animation() {
      if (interactionScrollIntoViewActive === "true") {
        var interactionScrollIntoView =
          '""';
        var $container = $element.find(".gt_product-quantity");
        window.SOLID.library.animation({
          elementId: id,
          $doms: $container,
          interactionScrollIntoView: {
            value: JSON.parse(interactionScrollIntoView),
            previewAttr: "interactionScrollIntoView",
          },
          animationType: "block",
          mode: mode,
        });
      }
    }

    function initLibrary() {
      var params = {
        $element: $element,
        settings: {
          classInput: "input[name='quantity']",
          classPlus: ".gt_quantity_plus",
          classMinus: ".gt_quantity_minus",
          mode: mode,
        }
      };
      if (style === "horizontal") {
        params = {
          $element: $element,
          settings: {
            classInput: "input[name='quantity']",
            classPlus: ".gt_product-quantity--plus",
            classMinus: ".gt_product-quantity--minus",
            mode: mode,
          }
        };
      }
      window.SOLID.library.gtProductQuantityV2(params);
    }

    function validateInput() {
      var inputQuantity = $element.find("input[name='quantity']");
      inputQuantity.keyup(function() {
        var value = parseInt(this.value);
        if (isNaN(value)) {
          value = 1;
        }
        inputQuantity.attr("value", value).val(value);
      })
    }
    /* init block script */
    initLibrary();
    animation();
    validateInput();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productQuantity()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productQuantity" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_line2 = function() {
          
        }
        funcESAtomNX61mg2YBEXmbDT_line2()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_line2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productButtonAddToCart = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productButtonAddToCart";
  var id = "NX61mg2YBEXmbDT_productButtonAddToCart";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var scrollIntoViewActive = 'false' == 'true';
    var animationActive = 'false' == 'true';
    var animationHoverActive = 'false' == 'true';
    var scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var mode = 'production';
    var previewSoldOut = 'false';
    var actions = '[{"control":{"attribute":"pickProductButton","id":"pickProductButton","isButtonAddToCard":true,"type":"pickproduct"},"event":"click","id":1},{"control":{"attribute":"pickLinkButton","id":"pickLinkButton","newTab":false,"reference":"html","title":"Pick Link","type":"picklink","value":"/cart"},"event":"click","id":2}]';
    
    var activeButtonFixContent = "false" === "true";
    var buttonFixContent = "Buy [!quantity!] items";
    var disableListenSoldOut = "false" === "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_productButtonAddToCart",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        };
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover",
          };
        }
        window.SOLID.library.animation(settings);
      }
    }

    function eventChangeTextInIframe() {
      
    }

    function eventListenSoldOut() {
      if (mode !== "production") {
        if (previewSoldOut === "false") {
          window.SOLID.library.gtBuyProductListenSoldOut({
            $element: $($element)[0],
            options: {
              isButtonAddToCard: true,
              textAddToCard: "Add To Cart",
              textSoldOut: "Not available",
            },
            mode: "dev"
          });
        }
      } else {
        window.SOLID.library.gtBuyProductListenSoldOut({
          $element: $($element)[0],
          options: {
            isButtonAddToCard: true,
            textAddToCard: "Add To Cart",
            textSoldOut: "Not available",
          },
        });
      }
    }

    function addActionEvent() {
      // function customEvent(actions,id,key)
      if (mode === "production") {
        $($element).customEvent(
          JSON.parse(actions),
          'NX61mg2YBEXmbDT_productButtonAddToCart' + '_' + indexEl
        );
      }
      /*Listenifisbuttonaddtocard*/
      store.subscribe(
        "loading-buy-now-NX61mg2YBEXmbDT_productButtonAddToCart" + "_" + indexEl,
        function(isDisplay) {
          const $loadingEl = $($element).find(
            ".atom-button-loading-circle-loader"
          );
          const $textEl = $($element).find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              store.dispatch("loading-buy-now-NX61mg2YBEXmbDT_productButtonAddToCart", "");
              store.dispatch("loading-buy-now-NX61mg2YBEXmbDT_productButtonAddToCart" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl
                .find(".atom-button-loading-check-mark")
                .css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl
                  .find(".atom-button-loading-check-mark")
                  .removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                store.dispatch("loading-buy-now-NX61mg2YBEXmbDT_productButtonAddToCart", "");
                store.dispatch("loading-buy-now-NX61mg2YBEXmbDT_productButtonAddToCart" + "_" + indexEl, "");
              }, 3000);
            }
          }
        }
      );
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    if (activeButtonFixContent) {
      initFixContent();
    }
    addInteraction();
    addActionEvent();
    if (!disableListenSoldOut) {
      eventListenSoldOut();
    }
    eventChangeTextInIframe();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
    /* public func block script */
    return {
      eventListenSoldOut,
    };
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    var public = script($target, indexEl);
    window.SOLID.public = window.SOLID.public || {};
    window.SOLID.public["atom" + "_" + id + "_" + indexEl] = public;
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productButtonAddToCart()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productButtonAddToCart" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productButtonBuyItNow = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productButtonBuyItNow";
  var id = "NX61mg2YBEXmbDT_productButtonBuyItNow";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var scrollIntoViewActive = 'false' == 'true';
    var animationActive = 'false' == 'true';
    var animationHoverActive = 'false' == 'true';
    var scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var mode = 'production';
    var previewSoldOut = 'false';
    var actions = '[{"control":{"attribute":"pickProductButton","id":"pickProductButton","isButtonAddToCard":true,"type":"pickproduct"},"event":"click","id":1},{"control":{"attribute":"pickLinkButton","id":"pickLinkButton","newTab":false,"reference":"html","title":"Pick Link","type":"picklink","value":"/checkout"},"event":"click","id":2}]';
    
    var activeButtonFixContent = "false" === "true";
    var buttonFixContent = "Buy [!quantity!] items";
    var disableListenSoldOut = "false" === "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_productButtonBuyItNow",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        };
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover",
          };
        }
        window.SOLID.library.animation(settings);
      }
    }

    function eventChangeTextInIframe() {
      
    }

    function eventListenSoldOut() {
      if (mode !== "production") {
        if (previewSoldOut === "false") {
          window.SOLID.library.gtBuyProductListenSoldOut({
            $element: $($element)[0],
            options: {
              isButtonAddToCard: true,
              textAddToCard: "Buy It Now",
              textSoldOut: "Sold out",
            },
            mode: "dev"
          });
        }
      } else {
        window.SOLID.library.gtBuyProductListenSoldOut({
          $element: $($element)[0],
          options: {
            isButtonAddToCard: true,
            textAddToCard: "Buy It Now",
            textSoldOut: "Sold out",
          },
        });
      }
    }

    function addActionEvent() {
      // function customEvent(actions,id,key)
      if (mode === "production") {
        $($element).customEvent(
          JSON.parse(actions),
          'NX61mg2YBEXmbDT_productButtonBuyItNow' + '_' + indexEl
        );
      }
      /*Listenifisbuttonaddtocard*/
      store.subscribe(
        "loading-buy-now-NX61mg2YBEXmbDT_productButtonBuyItNow" + "_" + indexEl,
        function(isDisplay) {
          const $loadingEl = $($element).find(
            ".atom-button-loading-circle-loader"
          );
          const $textEl = $($element).find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              store.dispatch("loading-buy-now-NX61mg2YBEXmbDT_productButtonBuyItNow", "");
              store.dispatch("loading-buy-now-NX61mg2YBEXmbDT_productButtonBuyItNow" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl
                .find(".atom-button-loading-check-mark")
                .css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl
                  .find(".atom-button-loading-check-mark")
                  .removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                store.dispatch("loading-buy-now-NX61mg2YBEXmbDT_productButtonBuyItNow", "");
                store.dispatch("loading-buy-now-NX61mg2YBEXmbDT_productButtonBuyItNow" + "_" + indexEl, "");
              }, 3000);
            }
          }
        }
      );
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    if (activeButtonFixContent) {
      initFixContent();
    }
    addInteraction();
    addActionEvent();
    if (!disableListenSoldOut) {
      eventListenSoldOut();
    }
    eventChangeTextInIframe();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
    /* public func block script */
    return {
      eventListenSoldOut,
    };
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    var public = script($target, indexEl);
    window.SOLID.public = window.SOLID.public || {};
    window.SOLID.public["atom" + "_" + id + "_" + indexEl] = public;
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productButtonBuyItNow()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productButtonBuyItNow" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_image = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_image";
  var id = "NX61mg2YBEXmbDT_image";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "NX61mg2YBEXmbDT_image",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_image()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_image" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomNX61mg2YBEXmbDT_productDescription = function() {
          (function() {
  var elementClassName = ".gt_atom-NX61mg2YBEXmbDT_productDescription";
  var id = "NX61mg2YBEXmbDT_productDescription";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const turnOffDescription = "false" === "true";
    const heightSettingDes = "120px";
    /* store get state block script */
    /* methods block script */
    function initView() {
      //resetcss
      if (!turnOffDescription) {
        $element.find(".gt_description").css("height", "");
        $element.find(".gt_btn-view-more").css({
          padding: "",
          position: ""
        });
      }
      var heightCurrentBoxDes = 0;
      if ($element.hasClass("gt_product-desciption--tab")) {
        heightCurrentBoxDes = $element.parents(".gt_active-content").find(".gt_box-desc").height();
      } else {
        heightCurrentBoxDes = $element.find(".gt_box-desc").height();
      }
      $element.find(".gt_description").removeClass("open");
      if (heightCurrentBoxDes <= parseInt(heightSettingDes) && !turnOffDescription) {
        $element.find(".gt_btn-view-more").addClass("gt_hidden");
        $element.find(".gt_description").css("height", "auto");
      } else {
        $element.find(".gt_btn-view-more").removeClass("gt_hidden");
        $element.find(".gt_description").css("height", "");
      }
      //setheightwhenturnoffdescription
      if (turnOffDescription) {
        $element.find(".gt_description").css("height", "auto");
        $element.find(".gt_btn-view-more").css({
          padding: "0px",
          position: "relative"
        });
      }
    }

    function toggleDes() {
      $element.find(".gt_description").toggleClass("open");
    }
    
    function checkAtomExist() {	
      if ($element.find(".gt_description").length < 1) {	
        $element.hide();	
      }	
    }
    
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "NX61mg2YBEXmbDT_productDescription",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "NX61mg2YBEXmbDT_productDescription",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    initView();
    /* store subscribe block script */
    /* events block script */
    var $elements_1 = $element.find("#toggleDes");
    $elements_1.off("click").on("click", toggleDes);
    /* destroy block script */
    
    /* public func block script */
    return {
      initView,
    };
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      var publicFunc = script($target, indexEl);
      window.SOLID.public = window.SOLID.public || {};
      window.SOLID.public["atom" + "_" + id + "_" + indexEl] = publicFunc;
      if (publicFunc) {
        store.dispatch("public_function_atom_" + id, publicFunc);
      }
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomNX61mg2YBEXmbDT_productDescription()
      } catch(e) {
        console.error("Error ESAtom Id: NX61mg2YBEXmbDT_productDescription" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectiona1j9LYwKnkAH03w = function() {
          
        }
        funcESSectiona1j9LYwKnkAH03w()
      } catch(e) {
        console.error("Error ESSection Id: a1j9LYwKnkAH03w" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_bannerBox = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_bannerBox";
  var id = "a1j9LYwKnkAH03w_bannerBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "a1j9LYwKnkAH03w_bannerBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_bannerBox()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_bannerBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_headingText = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_headingText";
  var id = "a1j9LYwKnkAH03w_headingText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "a1j9LYwKnkAH03w_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "a1j9LYwKnkAH03w_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_headingText()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_headingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_messageText = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_messageText";
  var id = "a1j9LYwKnkAH03w_messageText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "a1j9LYwKnkAH03w_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "a1j9LYwKnkAH03w_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_messageText()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_messageText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_bannerImage = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_bannerImage";
  var id = "a1j9LYwKnkAH03w_bannerImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "a1j9LYwKnkAH03w_bannerImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_bannerImage()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_bannerImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_imageBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_imageBefore";
  var id = "a1j9LYwKnkAH03w_imageBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "a1j9LYwKnkAH03w_imageBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_imageBefore()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_imageBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_uploadImageBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_uploadImageBefore";
  var id = "a1j9LYwKnkAH03w_uploadImageBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "a1j9LYwKnkAH03w_uploadImageBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_uploadImageBefore()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_uploadImageBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_labelBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_labelBefore";
  var id = "a1j9LYwKnkAH03w_labelBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "a1j9LYwKnkAH03w_labelBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_labelBefore()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_labelBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_textBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_textBefore";
  var id = "a1j9LYwKnkAH03w_textBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "a1j9LYwKnkAH03w_textBefore",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "a1j9LYwKnkAH03w_textBefore",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_textBefore()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_textBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_imageAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_imageAfter";
  var id = "a1j9LYwKnkAH03w_imageAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "a1j9LYwKnkAH03w_imageAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_imageAfter()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_imageAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_uploadImageAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_uploadImageAfter";
  var id = "a1j9LYwKnkAH03w_uploadImageAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "a1j9LYwKnkAH03w_uploadImageAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_uploadImageAfter()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_uploadImageAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_labelAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_labelAfter";
  var id = "a1j9LYwKnkAH03w_labelAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "a1j9LYwKnkAH03w_labelAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_labelAfter()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_labelAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_textAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_textAfter";
  var id = "a1j9LYwKnkAH03w_textAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "a1j9LYwKnkAH03w_textAfter",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "a1j9LYwKnkAH03w_textAfter",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_textAfter()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_textAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtoma1j9LYwKnkAH03w_buttonText = function() {
          (function() {
  var elementClassName = ".gt_atom-a1j9LYwKnkAH03w_buttonText";
  var id = "a1j9LYwKnkAH03w_buttonText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const isProduction = "production" === "production";
    let actions = `[]`
    const isCustomActions = "false" == "true"
    const openNewTab = "false" == "true"
    const linkButton = "";
    const activeButtonFixContent = "false" === "true";
    const buttonFixContent = "Buy [!quantity!] items"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "a1j9LYwKnkAH03w_buttonText",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function addAction() {
      if (!isCustomActions) {
        if (linkButton != "") {
          actionsObj = [{
            "id": 1,
            "event": "click",
            "control": {
              "id": "1",
              "attribute": "1",
              "title": "Pick Link",
              "desc": "",
              "reference": "html",
              "type": "picklink",
              "value": linkButton,
              "newTab": openNewTab
            }
          }]
        } else {
          actionsObj = []
        }
        actions = JSON.stringify(actionsObj);
      }
      if (isProduction) {
        $element.customEvent(JSON.parse(actions), id + "_" + indexEl);
        /*Listenifisbuttonaddtocard*/

        window.SOLID.store.subscribe("loading-buy-now-a1j9LYwKnkAH03w_buttonText" + "_" + indexEl, function(isDisplay) {
          const $loadingEl = $element.find(".atom-button-loading-circle-loader");
          const $textEl = $element.find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              window.SOLID.store.dispatch("loading-buy-now-a1j9LYwKnkAH03w_buttonText" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                window.SOLID.store.dispatch("loading-buy-now-a1j9LYwKnkAH03w_buttonText" + "_" + indexEl, "");
              }, 3000);
            }
          }
        });
      }
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    addAction();
    if (activeButtonFixContent) {
      initFixContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtoma1j9LYwKnkAH03w_buttonText()
      } catch(e) {
        console.error("Error ESAtom Id: a1j9LYwKnkAH03w_buttonText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionsQ574GgbZpuK3lL = function() {
          
        }
        funcESSectionsQ574GgbZpuK3lL()
      } catch(e) {
        console.error("Error ESSection Id: sQ574GgbZpuK3lL" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_boxCover = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_boxCover";
  var id = "sQ574GgbZpuK3lL_boxCover";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_boxCover",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_boxCover()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_boxCover" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_boxHeading = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_boxHeading";
  var id = "sQ574GgbZpuK3lL_boxHeading";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_boxHeading",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_boxHeading()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_boxHeading" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_heading = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_heading";
  var id = "sQ574GgbZpuK3lL_heading";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_heading",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_heading",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_heading()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_heading" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_message = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_message";
  var id = "sQ574GgbZpuK3lL_message";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_message",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_message",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_message()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_message" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_boxContent = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_boxContent";
  var id = "sQ574GgbZpuK3lL_boxContent";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_boxContent",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_boxContent()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_boxContent" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_boxItem = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_boxItem";
  var id = "sQ574GgbZpuK3lL_boxItem";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_boxItem",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_boxItem()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_boxItem" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_title1 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_title1";
  var id = "sQ574GgbZpuK3lL_title1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_title1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_title1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_title1()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_title1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_boxList1 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_boxList1";
  var id = "sQ574GgbZpuK3lL_boxList1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_boxList1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_boxList1()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_boxList1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item1_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item1_0";
  var id = "sQ574GgbZpuK3lL_item1_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item1_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item1_0()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item1_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon1_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon1_0";
  var id = "sQ574GgbZpuK3lL_icon1_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon1_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon1_0()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon1_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text1_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text1_0";
  var id = "sQ574GgbZpuK3lL_text1_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text1_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text1_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text1_0()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text1_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item1_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item1_1";
  var id = "sQ574GgbZpuK3lL_item1_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item1_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item1_1()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item1_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon1_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon1_1";
  var id = "sQ574GgbZpuK3lL_icon1_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon1_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon1_1()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon1_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text1_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text1_1";
  var id = "sQ574GgbZpuK3lL_text1_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text1_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text1_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text1_1()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text1_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item1_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item1_2";
  var id = "sQ574GgbZpuK3lL_item1_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item1_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item1_2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item1_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon1_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon1_2";
  var id = "sQ574GgbZpuK3lL_icon1_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon1_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon1_2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon1_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text1_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text1_2";
  var id = "sQ574GgbZpuK3lL_text1_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text1_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text1_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text1_2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text1_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item1_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item1_3";
  var id = "sQ574GgbZpuK3lL_item1_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item1_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item1_3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item1_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon1_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon1_3";
  var id = "sQ574GgbZpuK3lL_icon1_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon1_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon1_3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon1_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text1_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text1_3";
  var id = "sQ574GgbZpuK3lL_text1_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text1_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text1_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text1_3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text1_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item1_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item1_4";
  var id = "sQ574GgbZpuK3lL_item1_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item1_4",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item1_4()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item1_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon1_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon1_4";
  var id = "sQ574GgbZpuK3lL_icon1_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon1_4",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon1_4()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon1_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text1_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text1_4";
  var id = "sQ574GgbZpuK3lL_text1_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text1_4",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text1_4",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text1_4()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text1_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_boxItem2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_boxItem2";
  var id = "sQ574GgbZpuK3lL_boxItem2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_boxItem2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_boxItem2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_boxItem2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_title2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_title2";
  var id = "sQ574GgbZpuK3lL_title2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_title2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_title2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_title2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_title2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_boxList2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_boxList2";
  var id = "sQ574GgbZpuK3lL_boxList2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_boxList2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_boxList2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_boxList2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item2_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item2_0";
  var id = "sQ574GgbZpuK3lL_item2_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item2_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item2_0()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item2_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon2_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon2_0";
  var id = "sQ574GgbZpuK3lL_icon2_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon2_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon2_0()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon2_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text2_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text2_0";
  var id = "sQ574GgbZpuK3lL_text2_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text2_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text2_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text2_0()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text2_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item2_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item2_1";
  var id = "sQ574GgbZpuK3lL_item2_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item2_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item2_1()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item2_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon2_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon2_1";
  var id = "sQ574GgbZpuK3lL_icon2_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon2_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon2_1()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon2_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text2_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text2_1";
  var id = "sQ574GgbZpuK3lL_text2_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text2_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text2_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text2_1()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text2_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item2_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item2_2";
  var id = "sQ574GgbZpuK3lL_item2_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item2_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item2_2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item2_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon2_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon2_2";
  var id = "sQ574GgbZpuK3lL_icon2_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon2_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon2_2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon2_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text2_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text2_2";
  var id = "sQ574GgbZpuK3lL_text2_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text2_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text2_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text2_2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text2_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item2_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item2_3";
  var id = "sQ574GgbZpuK3lL_item2_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item2_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item2_3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item2_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon2_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon2_3";
  var id = "sQ574GgbZpuK3lL_icon2_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon2_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon2_3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon2_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text2_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text2_3";
  var id = "sQ574GgbZpuK3lL_text2_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text2_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text2_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text2_3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text2_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item2_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item2_4";
  var id = "sQ574GgbZpuK3lL_item2_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item2_4",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item2_4()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item2_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon2_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon2_4";
  var id = "sQ574GgbZpuK3lL_icon2_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon2_4",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon2_4()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon2_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text2_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text2_4";
  var id = "sQ574GgbZpuK3lL_text2_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text2_4",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text2_4",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text2_4()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text2_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_boxItem3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_boxItem3";
  var id = "sQ574GgbZpuK3lL_boxItem3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_boxItem3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_boxItem3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_boxItem3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_title3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_title3";
  var id = "sQ574GgbZpuK3lL_title3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_title3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_title3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_title3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_title3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_boxList3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_boxList3";
  var id = "sQ574GgbZpuK3lL_boxList3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_boxList3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_boxList3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_boxList3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item3_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item3_0";
  var id = "sQ574GgbZpuK3lL_item3_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item3_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item3_0()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item3_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon3_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon3_0";
  var id = "sQ574GgbZpuK3lL_icon3_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon3_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon3_0()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon3_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text3_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text3_0";
  var id = "sQ574GgbZpuK3lL_text3_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text3_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text3_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text3_0()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text3_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item3_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item3_1";
  var id = "sQ574GgbZpuK3lL_item3_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item3_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item3_1()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item3_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon3_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon3_1";
  var id = "sQ574GgbZpuK3lL_icon3_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon3_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon3_1()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon3_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text3_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text3_1";
  var id = "sQ574GgbZpuK3lL_text3_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text3_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text3_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text3_1()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text3_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item3_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item3_2";
  var id = "sQ574GgbZpuK3lL_item3_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item3_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item3_2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item3_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon3_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon3_2";
  var id = "sQ574GgbZpuK3lL_icon3_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon3_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon3_2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon3_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text3_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text3_2";
  var id = "sQ574GgbZpuK3lL_text3_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text3_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text3_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text3_2()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text3_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item3_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item3_3";
  var id = "sQ574GgbZpuK3lL_item3_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item3_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item3_3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item3_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon3_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon3_3";
  var id = "sQ574GgbZpuK3lL_icon3_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon3_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon3_3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon3_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text3_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text3_3";
  var id = "sQ574GgbZpuK3lL_text3_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text3_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text3_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text3_3()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text3_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_item3_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_item3_4";
  var id = "sQ574GgbZpuK3lL_item3_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_item3_4",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_item3_4()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_item3_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_icon3_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_icon3_4";
  var id = "sQ574GgbZpuK3lL_icon3_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_icon3_4",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_icon3_4()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_icon3_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_text3_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_text3_4";
  var id = "sQ574GgbZpuK3lL_text3_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "sQ574GgbZpuK3lL_text3_4",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "sQ574GgbZpuK3lL_text3_4",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_text3_4()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_text3_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_boxFooter = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_boxFooter";
  var id = "sQ574GgbZpuK3lL_boxFooter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_boxFooter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_boxFooter()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_boxFooter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomsQ574GgbZpuK3lL_button = function() {
          (function() {
  var elementClassName = ".gt_atom-sQ574GgbZpuK3lL_button";
  var id = "sQ574GgbZpuK3lL_button";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const isProduction = "production" === "production";
    let actions = `[]`
    const isCustomActions = "false" == "true"
    const openNewTab = "false" == "true"
    const linkButton = "";
    const activeButtonFixContent = "false" === "true";
    const buttonFixContent = "Buy [!quantity!] items"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "sQ574GgbZpuK3lL_button",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function addAction() {
      if (!isCustomActions) {
        if (linkButton != "") {
          actionsObj = [{
            "id": 1,
            "event": "click",
            "control": {
              "id": "1",
              "attribute": "1",
              "title": "Pick Link",
              "desc": "",
              "reference": "html",
              "type": "picklink",
              "value": linkButton,
              "newTab": openNewTab
            }
          }]
        } else {
          actionsObj = []
        }
        actions = JSON.stringify(actionsObj);
      }
      if (isProduction) {
        $element.customEvent(JSON.parse(actions), id + "_" + indexEl);
        /*Listenifisbuttonaddtocard*/

        window.SOLID.store.subscribe("loading-buy-now-sQ574GgbZpuK3lL_button" + "_" + indexEl, function(isDisplay) {
          const $loadingEl = $element.find(".atom-button-loading-circle-loader");
          const $textEl = $element.find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              window.SOLID.store.dispatch("loading-buy-now-sQ574GgbZpuK3lL_button" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                window.SOLID.store.dispatch("loading-buy-now-sQ574GgbZpuK3lL_button" + "_" + indexEl, "");
              }, 3000);
            }
          }
        });
      }
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    addAction();
    if (activeButtonFixContent) {
      initFixContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomsQ574GgbZpuK3lL_button()
      } catch(e) {
        console.error("Error ESAtom Id: sQ574GgbZpuK3lL_button" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionQHNCICt732mMRtd = function() {
          (function() {
  var elementClassName = ".gt_section-QHNCICt732mMRtd";
  var id = "QHNCICt732mMRtd";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    /* store get state block script */
    /* methods block script */
    function triggerRenderAtom() {
      $(".gt_faq--question").off("click").on("click", faqAccordion);
    }

    function faqAccordion() {
      var $itemThis = $(this);
      var $subFaq = $itemThis.siblings();
      if ($subFaq.length > 0) {
        var time = 50;
        if ($itemThis.hasClass("gt_active")) {
          window.gtAnimations.SlideUp($subFaq[0], time, function() {
            $itemThis.removeClass("gt_active");
            $subFaq.removeClass("gt_active-ans");
          });
        } else {
          var $itemActive = $element.find(".gt_faq--question.gt_active");
          if ($itemActive && $itemActive.length) {
            for (let i = 0; i < $itemActive.length; i++) {
              var $faqAnswersActive = $($itemActive[i]).siblings();
              window.gtAnimations.SlideUp($faqAnswersActive[0], time, function() {
                $($itemActive[i]).removeClass("gt_active");
                $faqAnswersActive.removeClass("gt_active-ans");
              });
            }
          }
          $itemThis.addClass("gt_active");
          $subFaq.addClass("gt_active-ans");
          window.gtAnimations.SlideDown($subFaq[0], time);
        }
      }
    }
    /* init block script */
    /* store subscribe block script */
    store.subscribe("render-html-QHNCICt732mMRtd-faqListItem", triggerRenderAtom);

    function destroy() {
      store.unsubscribe("render-html-QHNCICt732mMRtd-faqListItem", triggerRenderAtom);
    }
    /* events block script */
    var $elements_1 = $element.find(".gt_faq--question");
    $elements_1.off("click").on("click", faqAccordion);
    /* destroy block script */
    store.subscribe("component-" + id + "-destroy", function() {
      destroy();
      store.unsubscribe("component-" + id + "-destroy");
    });
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESSectionQHNCICt732mMRtd()
      } catch(e) {
        console.error("Error ESSection Id: QHNCICt732mMRtd" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_bannerBox = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_bannerBox";
  var id = "QHNCICt732mMRtd_bannerBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_bannerBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_bannerBox()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_bannerBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_bannerContent = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_bannerContent";
  var id = "QHNCICt732mMRtd_bannerContent";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_bannerContent",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_bannerContent()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_bannerContent" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_sectionName = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_sectionName";
  var id = "QHNCICt732mMRtd_sectionName";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "QHNCICt732mMRtd_sectionName",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "QHNCICt732mMRtd_sectionName",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_sectionName()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_sectionName" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_descriptionSection = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_descriptionSection";
  var id = "QHNCICt732mMRtd_descriptionSection";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "QHNCICt732mMRtd_descriptionSection",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "QHNCICt732mMRtd_descriptionSection",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_descriptionSection()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_descriptionSection" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_faqList = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_faqList";
  var id = "QHNCICt732mMRtd_faqList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_faqList",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_faqList()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_faqList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_faqListItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_faqListItem_0";
  var id = "QHNCICt732mMRtd_faqListItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_faqListItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_faqListItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_faqListItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_faqAuestion_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_faqAuestion_0";
  var id = "QHNCICt732mMRtd_faqAuestion_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_faqAuestion_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_faqAuestion_0()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_faqAuestion_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_faqTitle_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_faqTitle_0";
  var id = "QHNCICt732mMRtd_faqTitle_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "QHNCICt732mMRtd_faqTitle_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "QHNCICt732mMRtd_faqTitle_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_faqTitle_0()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_faqTitle_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_iconOpen_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_iconOpen_0";
  var id = "QHNCICt732mMRtd_iconOpen_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_iconOpen_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_iconOpen_0()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_iconOpen_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_iconClose_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_iconClose_0";
  var id = "QHNCICt732mMRtd_iconClose_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_iconClose_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_iconClose_0()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_iconClose_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_faqAnswers_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_faqAnswers_0";
  var id = "QHNCICt732mMRtd_faqAnswers_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_faqAnswers_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_faqAnswers_0()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_faqAnswers_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_faqContent_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_faqContent_0";
  var id = "QHNCICt732mMRtd_faqContent_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "QHNCICt732mMRtd_faqContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "QHNCICt732mMRtd_faqContent_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_faqContent_0()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_faqContent_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_faqListItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_faqListItem_1";
  var id = "QHNCICt732mMRtd_faqListItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_faqListItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_faqListItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_faqListItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_faqAuestion_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_faqAuestion_1";
  var id = "QHNCICt732mMRtd_faqAuestion_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_faqAuestion_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_faqAuestion_1()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_faqAuestion_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_faqTitle_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_faqTitle_1";
  var id = "QHNCICt732mMRtd_faqTitle_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "QHNCICt732mMRtd_faqTitle_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "QHNCICt732mMRtd_faqTitle_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_faqTitle_1()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_faqTitle_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_iconOpen_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_iconOpen_1";
  var id = "QHNCICt732mMRtd_iconOpen_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_iconOpen_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_iconOpen_1()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_iconOpen_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_iconClose_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_iconClose_1";
  var id = "QHNCICt732mMRtd_iconClose_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_iconClose_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_iconClose_1()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_iconClose_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_faqAnswers_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_faqAnswers_1";
  var id = "QHNCICt732mMRtd_faqAnswers_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_faqAnswers_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_faqAnswers_1()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_faqAnswers_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_faqContent_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_faqContent_1";
  var id = "QHNCICt732mMRtd_faqContent_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "QHNCICt732mMRtd_faqContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "QHNCICt732mMRtd_faqContent_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_faqContent_1()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_faqContent_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_sectionButton = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_sectionButton";
  var id = "QHNCICt732mMRtd_sectionButton";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const isProduction = "production" === "production";
    let actions = `[]`
    const isCustomActions = "false" == "true"
    const openNewTab = "false" == "true"
    const linkButton = "";
    const activeButtonFixContent = "false" === "true";
    const buttonFixContent = "Buy [!quantity!] items"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_sectionButton",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function addAction() {
      if (!isCustomActions) {
        if (linkButton != "") {
          actionsObj = [{
            "id": 1,
            "event": "click",
            "control": {
              "id": "1",
              "attribute": "1",
              "title": "Pick Link",
              "desc": "",
              "reference": "html",
              "type": "picklink",
              "value": linkButton,
              "newTab": openNewTab
            }
          }]
        } else {
          actionsObj = []
        }
        actions = JSON.stringify(actionsObj);
      }
      if (isProduction) {
        $element.customEvent(JSON.parse(actions), id + "_" + indexEl);
        /*Listenifisbuttonaddtocard*/

        window.SOLID.store.subscribe("loading-buy-now-QHNCICt732mMRtd_sectionButton" + "_" + indexEl, function(isDisplay) {
          const $loadingEl = $element.find(".atom-button-loading-circle-loader");
          const $textEl = $element.find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              window.SOLID.store.dispatch("loading-buy-now-QHNCICt732mMRtd_sectionButton" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                window.SOLID.store.dispatch("loading-buy-now-QHNCICt732mMRtd_sectionButton" + "_" + indexEl, "");
              }, 3000);
            }
          }
        });
      }
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    addAction();
    if (activeButtonFixContent) {
      initFixContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_sectionButton()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_sectionButton" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_bannerImage = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_bannerImage";
  var id = "QHNCICt732mMRtd_bannerImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_bannerImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_bannerImage()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_bannerImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_uploadImage = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_uploadImage";
  var id = "QHNCICt732mMRtd_uploadImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_uploadImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_uploadImage()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_uploadImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQHNCICt732mMRtd_buttonWithImage = function() {
          (function() {
  var elementClassName = ".gt_atom-QHNCICt732mMRtd_buttonWithImage";
  var id = "QHNCICt732mMRtd_buttonWithImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const isProduction = "production" === "production";
    let actions = `[]`
    const isCustomActions = "false" == "true"
    const openNewTab = "false" == "true"
    const linkButton = "";
    const activeButtonFixContent = "false" === "true";
    const buttonFixContent = "Buy [!quantity!] items"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "QHNCICt732mMRtd_buttonWithImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function addAction() {
      if (!isCustomActions) {
        if (linkButton != "") {
          actionsObj = [{
            "id": 1,
            "event": "click",
            "control": {
              "id": "1",
              "attribute": "1",
              "title": "Pick Link",
              "desc": "",
              "reference": "html",
              "type": "picklink",
              "value": linkButton,
              "newTab": openNewTab
            }
          }]
        } else {
          actionsObj = []
        }
        actions = JSON.stringify(actionsObj);
      }
      if (isProduction) {
        $element.customEvent(JSON.parse(actions), id + "_" + indexEl);
        /*Listenifisbuttonaddtocard*/

        window.SOLID.store.subscribe("loading-buy-now-QHNCICt732mMRtd_buttonWithImage" + "_" + indexEl, function(isDisplay) {
          const $loadingEl = $element.find(".atom-button-loading-circle-loader");
          const $textEl = $element.find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              window.SOLID.store.dispatch("loading-buy-now-QHNCICt732mMRtd_buttonWithImage" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                window.SOLID.store.dispatch("loading-buy-now-QHNCICt732mMRtd_buttonWithImage" + "_" + indexEl, "");
              }, 3000);
            }
          }
        });
      }
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    addAction();
    if (activeButtonFixContent) {
      initFixContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomQHNCICt732mMRtd_buttonWithImage()
      } catch(e) {
        console.error("Error ESAtom Id: QHNCICt732mMRtd_buttonWithImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionb8Qkkkqa7b4GTep = function() {
          
        }
        funcESSectionb8Qkkkqa7b4GTep()
      } catch(e) {
        console.error("Error ESSection Id: b8Qkkkqa7b4GTep" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSection423xhRkuFUakVwS = function() {
          
        }
        funcESSection423xhRkuFUakVwS()
      } catch(e) {
        console.error("Error ESSection Id: 423xhRkuFUakVwS" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_bannerBox = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_bannerBox";
  var id = "423xhRkuFUakVwS_bannerBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_bannerBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_bannerBox()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_bannerBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_bannerImageMobile = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_bannerImageMobile";
  var id = "423xhRkuFUakVwS_bannerImageMobile";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_bannerImageMobile",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_bannerImageMobile()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_bannerImageMobile" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_bannerContent = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_bannerContent";
  var id = "423xhRkuFUakVwS_bannerContent";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_bannerContent",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_bannerContent()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_bannerContent" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_bannerContentInner = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_bannerContentInner";
  var id = "423xhRkuFUakVwS_bannerContentInner";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_bannerContentInner",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_bannerContentInner()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_bannerContentInner" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_headingText = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_headingText";
  var id = "423xhRkuFUakVwS_headingText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "423xhRkuFUakVwS_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "423xhRkuFUakVwS_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_headingText()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_headingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_messageText = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_messageText";
  var id = "423xhRkuFUakVwS_messageText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "423xhRkuFUakVwS_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "423xhRkuFUakVwS_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_messageText()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_messageText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_featherList = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_featherList";
  var id = "423xhRkuFUakVwS_featherList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_featherList",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_featherList()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_featherList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_featherListItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_featherListItem_0";
  var id = "423xhRkuFUakVwS_featherListItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_featherListItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_featherListItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_featherListItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_icon_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_icon_0";
  var id = "423xhRkuFUakVwS_icon_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_icon_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_icon_0()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_icon_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_message_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_message_0";
  var id = "423xhRkuFUakVwS_message_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "423xhRkuFUakVwS_message_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "423xhRkuFUakVwS_message_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_message_0()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_message_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_featherListItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_featherListItem_1";
  var id = "423xhRkuFUakVwS_featherListItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_featherListItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_featherListItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_featherListItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_icon_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_icon_1";
  var id = "423xhRkuFUakVwS_icon_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_icon_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_icon_1()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_icon_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_message_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_message_1";
  var id = "423xhRkuFUakVwS_message_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "423xhRkuFUakVwS_message_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "423xhRkuFUakVwS_message_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_message_1()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_message_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_featherListItem_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_featherListItem_2";
  var id = "423xhRkuFUakVwS_featherListItem_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_featherListItem_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_featherListItem_2()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_featherListItem_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_icon_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_icon_2";
  var id = "423xhRkuFUakVwS_icon_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_icon_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_icon_2()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_icon_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_message_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_message_2";
  var id = "423xhRkuFUakVwS_message_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "423xhRkuFUakVwS_message_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "423xhRkuFUakVwS_message_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_message_2()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_message_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_featherListItem_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_featherListItem_3";
  var id = "423xhRkuFUakVwS_featherListItem_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_featherListItem_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_featherListItem_3()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_featherListItem_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_icon_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_icon_3";
  var id = "423xhRkuFUakVwS_icon_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_icon_3",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_icon_3()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_icon_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_message_3 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_message_3";
  var id = "423xhRkuFUakVwS_message_3";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "423xhRkuFUakVwS_message_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "423xhRkuFUakVwS_message_3",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_message_3()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_message_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_featherListItem_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_featherListItem_4";
  var id = "423xhRkuFUakVwS_featherListItem_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_featherListItem_4",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_featherListItem_4()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_featherListItem_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_icon_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_icon_4";
  var id = "423xhRkuFUakVwS_icon_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_icon_4",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_icon_4()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_icon_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_message_4 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_message_4";
  var id = "423xhRkuFUakVwS_message_4";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "423xhRkuFUakVwS_message_4",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "423xhRkuFUakVwS_message_4",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_message_4()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_message_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_featherListItem_5 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_featherListItem_5";
  var id = "423xhRkuFUakVwS_featherListItem_5";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_featherListItem_5",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_featherListItem_5()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_featherListItem_5" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_icon_5 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_icon_5";
  var id = "423xhRkuFUakVwS_icon_5";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_icon_5",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_icon_5()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_icon_5" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_message_5 = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_message_5";
  var id = "423xhRkuFUakVwS_message_5";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "423xhRkuFUakVwS_message_5",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "423xhRkuFUakVwS_message_5",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_message_5()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_message_5" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_bannerContentAction = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_bannerContentAction";
  var id = "423xhRkuFUakVwS_bannerContentAction";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_bannerContentAction",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_bannerContentAction()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_bannerContentAction" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_buttonText = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_buttonText";
  var id = "423xhRkuFUakVwS_buttonText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const isProduction = "production" === "production";
    let actions = `[{"control":{"attribute":"1","desc":"","id":"1","isChooseVariantControl":true,"reference":"html","shopify":["all_products[productHandle]","collections.all.products"],"title":"Product","type":"pickproduct","value":{"handle":"np-superior-care-white-dog-adult","id":6993995759797,"quantity":1,"title":"NP%20Superior%20Care%20White%20Dog%20Adult%20(One-Time%20Purchase)","variantId":41070872297653}},"event":"click","id":1}]`
    const isCustomActions = "false" == "true"
    const openNewTab = "false" == "true"
    const linkButton = "#gt_section-NX61mg2YBEXmbDT";
    const activeButtonFixContent = "false" === "true";
    const buttonFixContent = "Buy [!quantity!] items"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_buttonText",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function addAction() {
      if (!isCustomActions) {
        if (linkButton != "") {
          actionsObj = [{
            "id": 1,
            "event": "click",
            "control": {
              "id": "1",
              "attribute": "1",
              "title": "Pick Link",
              "desc": "",
              "reference": "html",
              "type": "picklink",
              "value": linkButton,
              "newTab": openNewTab
            }
          }]
        } else {
          actionsObj = []
        }
        actions = JSON.stringify(actionsObj);
      }
      if (isProduction) {
        $element.customEvent(JSON.parse(actions), id + "_" + indexEl);
        /*Listenifisbuttonaddtocard*/

        window.SOLID.store.subscribe("loading-buy-now-423xhRkuFUakVwS_buttonText" + "_" + indexEl, function(isDisplay) {
          const $loadingEl = $element.find(".atom-button-loading-circle-loader");
          const $textEl = $element.find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              window.SOLID.store.dispatch("loading-buy-now-423xhRkuFUakVwS_buttonText" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                window.SOLID.store.dispatch("loading-buy-now-423xhRkuFUakVwS_buttonText" + "_" + indexEl, "");
              }, 3000);
            }
          }
        });
      }
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    addAction();
    if (activeButtonFixContent) {
      initFixContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_buttonText()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_buttonText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_rating = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_rating";
  var id = "423xhRkuFUakVwS_rating";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_rating",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    function destroy() {}
    /* events block script */
    /* destroy block script */
    store.subscribe("component-" + id + "-destroy", function() {
      destroy();
      store.unsubscribe("component-" + id + "-destroy");
    });
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_rating()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_rating" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_guaranteeText = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_guaranteeText";
  var id = "423xhRkuFUakVwS_guaranteeText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "423xhRkuFUakVwS_guaranteeText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "423xhRkuFUakVwS_guaranteeText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_guaranteeText()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_guaranteeText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom423xhRkuFUakVwS_bannerImagePC = function() {
          (function() {
  var elementClassName = ".gt_atom-423xhRkuFUakVwS_bannerImagePC";
  var id = "423xhRkuFUakVwS_bannerImagePC";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "423xhRkuFUakVwS_bannerImagePC",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom423xhRkuFUakVwS_bannerImagePC()
      } catch(e) {
        console.error("Error ESAtom Id: 423xhRkuFUakVwS_bannerImagePC" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionU1wYmCSPlPXKMr8 = function() {
          
        }
        funcESSectionU1wYmCSPlPXKMr8()
      } catch(e) {
        console.error("Error ESSection Id: U1wYmCSPlPXKMr8" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_sectionName = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_sectionName";
  var id = "U1wYmCSPlPXKMr8_sectionName";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "U1wYmCSPlPXKMr8_sectionName",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "U1wYmCSPlPXKMr8_sectionName",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_sectionName()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_sectionName" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_bannerSlider = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_bannerSlider";
  var id = "U1wYmCSPlPXKMr8_bannerSlider";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var loop = "false" === "true";
    var autoplay = "false" === "true";
    var centeredSlides = "false" === "true";
    var slideAutoHeight = "false" === "true";
    var mode = "production";
    var checkWindowWidth = $(window).width();
    var widthSliderCurrent;
    var slidesPerView_lg = "3";
    var slidesPerView_md = "3";
    var slidesPerView_sm = "2";
    var slidesPerView_xs = "1";
    var slidesPerColumn_lg = "1";
    var slidesPerColumn_md = "1";
    var slidesPerColumn_sm = "1";
    var slidesPerColumn_xs = "1";
    var spaceBetween_lg = parseInt("49") || 1;
    var spaceBetween_md = parseInt("15px") || 1;
    var spaceBetween_sm = parseInt("30px") || 1;
    var spaceBetween_xs = parseInt("30px") || 1;
    var widthActive = "false" === "true";
    var widthSlider = "100%";
    var widthSlider_lg = "100%";
    var widthSlider_md = "100%";
    var widthSlider_sm = "100%";
    var widthSlider_xs = "100%";
    var autoPlayTime = parseInt("3") || 3;
    var mySwiper;
    var objectSetting;

    var dotsPagination = "dots" === "dots";
    var customPagination = "dots" === "custom";
    /* store get state block script */
    /* methods block script */
    function initSlider() {
      var $swiperContainer = $element.find(".gt_slider");
      if (!$swiperContainer || !$swiperContainer.length) {
        return;
      }
      if (dotsPagination) {
        if (slideAutoHeight) {
          var slideAutoHeight1 = slideAutoHeight;
        } else {
          var slideAutoHeight1 = false;
        }
        objectSetting = {
          autoHeight: slideAutoHeight1,
          speed: 800,
          loop: loop,
          centeredSlides: centeredSlides,
          touchStartPreventDefault: mode === "dev" ? false : true,
          slidesPerView: 1,
          autoplay: autoplay ? {
            delay: autoPlayTime * 1000,
            disableOnInteraction: false,
          } : false,
          navigation: {
            nextEl: "#gt_control-next-U1wYmCSPlPXKMr8_bannerSlider",
            prevEl: "#gt_control-prev-U1wYmCSPlPXKMr8_bannerSlider",
          },
          pagination: {
            el: "#gt_control-pagination-U1wYmCSPlPXKMr8_bannerSlider",
            type: 'custom',
            clickable: true,
            renderCustom: function(swiper, current, total) {
              var customPaginationHtml = "";
              for (var i = 0; i < total; i++) {
                if (i == (current - 1)) {
                  customPaginationHtml += `<div class="gt_control-pagination-item swiper-pagination-bullet swiper-pagination-bullet-active">
                        <span data-optimize-type="icon"  data-attribute="iconDotsActive,"  data-section-id="U1wYmCSPlPXKMr8_bannerSlider"  class="gt_icon"><svg width="100%" height="100%" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="20" height="8" rx="4" fill="currentColor"/>
</svg>
</span> </div> `;
                } else {
                  customPaginationHtml += `<div class="gt_control-pagination-item swiper-pagination-bullet">
                        <span data-optimize-type="icon"  data-attribute="iconDots,"  data-section-id="U1wYmCSPlPXKMr8_bannerSlider"  class="gt_icon"><svg height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 22C13.05 22 13.5 21.55 13.5 21V3C13.5 2.45 13.05 2 12.5 2C11.95 2 11.5 2.45 11.5 3V21C11.5 21.55 11.95 22 12.5 22ZM8.5 18C9.05 18 9.5 17.55 9.5 17V7C9.5 6.45 9.05 6 8.5 6C7.95 6 7.5 6.45 7.5 7V17C7.5 17.55 7.95 18 8.5 18ZM5.5 13C5.5 13.55 5.05 14 4.5 14C3.95 14 3.5 13.55 3.5 13V11C3.5 10.45 3.95 10 4.5 10C5.05 10 5.5 10.45 5.5 11V13ZM16.5 18C17.05 18 17.5 17.55 17.5 17V7C17.5 6.45 17.05 6 16.5 6C15.95 6 15.5 6.45 15.5 7V17C15.5 17.55 15.95 18 16.5 18ZM19.5 13V11C19.5 10.45 19.95 10 20.5 10C21.05 10 21.5 10.45 21.5 11V13C21.5 13.55 21.05 14 20.5 14C19.95 14 19.5 13.55 19.5 13Z" fill="currentColor"/> </svg></span>
                        </div>`;
                }
              }
              return customPaginationHtml;
            }
          },
          breakpoints: {
            0: {
              slidesPerView: slidesPerView_xs,
              spaceBetween: spaceBetween_xs,
              slidesPerColumn: slidesPerColumn_xs,
              slidesPerColumnFill: 'row',
            },
            577: {
              slidesPerView: slidesPerView_sm,
              spaceBetween: spaceBetween_sm,
              slidesPerColumn: slidesPerColumn_sm,
              slidesPerColumnFill: 'row',
            },
            993: {
              slidesPerView: slidesPerView_md,
              spaceBetween: spaceBetween_md,
              slidesPerColumn: slidesPerColumn_md,
              slidesPerColumnFill: 'row',
            },
            1201: {
              slidesPerView: slidesPerView_lg,
              spaceBetween: spaceBetween_lg,
              slidesPerColumn: slidesPerColumn_lg,
              slidesPerColumnFill: 'row',
            },
          },
          on: {
            init: function() {
              const $images = $swiperContainer.find(".gt_lazyload").not(".gt_lazyloaded");
              if ($images && $images.length && window.SOLID.library && window.SOLID.library.gtLazyload) {
                for (var i = 0; i < $images.length; i++) {
                  window.SOLID.library.gtLazyload($images[i]);
                }
              }
            }
          }
        }
      } else if (customPagination) {
        if (slideAutoHeight) {
          var slideAutoHeight2 = slideAutoHeight;
        } else {
          var slideAutoHeight2 = false;
        }
        objectSetting = {
          autoHeight: slideAutoHeight2,
          speed: 800,
          loop: loop,
          centeredSlides: centeredSlides,
          touchStartPreventDefault: mode === "dev" ? false : true,
          slidesPerView: 1,
          autoplay: autoplay ? {
            delay: autoPlayTime * 1000,
            disableOnInteraction: false,
          } : false,
          navigation: {
            nextEl: "#gt_control-next-U1wYmCSPlPXKMr8_bannerSlider",
            prevEl: "#gt_control-prev-U1wYmCSPlPXKMr8_bannerSlider",
          },

          pagination: {
            el: "#gt_control-pagination-U1wYmCSPlPXKMr8_bannerSlider",
            clickable: true,
            renderBullet: function(index, className) {
              index = index + 1;
              if (index < 10) {
                index = "0" + index;
              }
              return '<span class="' + className + '">' + index + '.' + "</span>";
            }
          },
          breakpoints: {
            0: {
              slidesPerView: slidesPerView_xs,
              spaceBetween: spaceBetween_xs,
              slidesPerColumn: slidesPerColumn_xs,
              slidesPerColumnFill: 'row',
            },
            577: {
              slidesPerView: slidesPerView_sm,
              spaceBetween: spaceBetween_sm,
              slidesPerColumn: slidesPerColumn_sm,
              slidesPerColumnFill: 'row',
            },
            993: {
              slidesPerView: slidesPerView_md,
              spaceBetween: spaceBetween_md,
              slidesPerColumn: slidesPerColumn_md,
              slidesPerColumnFill: 'row',
            },
            1201: {
              slidesPerView: slidesPerView_lg,
              spaceBetween: spaceBetween_lg,
              slidesPerColumn: slidesPerColumn_lg,
              slidesPerColumnFill: 'row',
            },
          },
          on: {
            init: function() {
              const $images = $swiperContainer.find(".gt_lazyload").not(".gt_lazyloaded");
              if ($images && $images.length && window.SOLID.library && window.SOLID.library.gtLazyload) {
                for (var i = 0; i < $images.length; i++) {
                  window.SOLID.library.gtLazyload($images[i]);
                }
              }
            }
          }
        }
      }

      $swiperContainer.find(".swiper-wrapper").children().addClass("swiper-slide");

      if ($swiperContainer.find(".swiper-slide").length == 1) {
        $swiperContainer.find(".swiper-wrapper").addClass("gt_disabled");
        $element.find(".gt_control").addClass("gt_disabled");
      }

      if ($swiperContainer[0].swiper) {
        mySwiper = $swiperContainer[0].swiper;
        mySwiper.destroy();
      }
      mySwiper = new Swiper($swiperContainer[0], objectSetting);
    }

    function changeSliderActive(value) {
      if (value && value.sliderIndex !== NaN) {
        if (loop) {
          mySwiper.slideToLoop(value.sliderIndex, 500, true);
        } else {
          mySwiper.slideTo(value.sliderIndex, 500, true);
        }
      }
    }

    function optimizeSlidePerView(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        slidesPerView_xs = value;
      } else if (checkWindowWidth <= 992) {
        slidesPerView_sm = value;
      } else if (checkWindowWidth <= 1200) {
        slidesPerView_md = value;
      } else {
        slidesPerView_lg = value;
      }
      initSlider();
    }

    function optimizeWidthSlider(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        widthSlider_xs = value;
      } else if (checkWindowWidth <= 992) {
        widthSlider_sm = value;
      } else if (checkWindowWidth <= 1200) {
        widthSlider_md = value;
      } else {
        widthSlider_lg = widthSlider = value;
      }
      $element.css("cssText", "width: " + value + " !important;");
      mySwiper.update();
    }

    function optimizeWidthActive(value) {
      widthActive = value;
      if (!value) {
        $element.css("cssText", "width: null");
      } else {
        checkWindowWidth = $(window).width();
        widthSliderCurrent = 0;
        if (checkWindowWidth <= 576) {
          widthSliderCurrent = widthSlider_xs;
        } else if (checkWindowWidth <= 992) {
          widthSliderCurrent = widthSlider_sm;
        } else if (checkWindowWidth <= 1200) {
          widthSliderCurrent = widthSlider_md;
        } else {
          widthSliderCurrent = widthSlider;
        }
        $element.css("cssText", "width: " + widthSliderCurrent + " !important;");
      }
    }

    function listen() {
      let observer = new ResizeObserver(() => {
        if (mySwiper) {
          mySwiper.update()
        }
      })
      observer.observe($element[0]);
    }
    /* init block script */
    listen();
    //eslint-disable-next-lineno-undef
    if (mode !== "production") {
      autoplay = false;
    }
    initSlider();
    var delay = 0;

    /* store subscribe block script */
    store.subscribe("optimal-U1wYmCSPlPXKMr8_bannerSlider-slidesPerView", optimizeSlidePerView);
    store.subscribe("optimal-U1wYmCSPlPXKMr8_bannerSlider-widthSlider", optimizeWidthSlider);
    store.subscribe("optimal-U1wYmCSPlPXKMr8_bannerSlider-widthActive", optimizeWidthActive);
    store.subscribe("trigger-slider-U1wYmCSPlPXKMr8_bannerSlider", changeSliderActive);

    function destroy() {
      store.unsubscribe("optimal-U1wYmCSPlPXKMr8_bannerSlider-slidesPerView", optimizeSlidePerView);
      store.unsubscribe("optimal-U1wYmCSPlPXKMr8_bannerSlider-widthSlider", optimizeWidthSlider);
      store.unsubscribe("optimal-U1wYmCSPlPXKMr8_bannerSlider-widthActive", optimizeWidthActive);
      store.unsubscribe("trigger-slider-U1wYmCSPlPXKMr8_bannerSlider", changeSliderActive);
    }
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_bannerSlider()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_bannerSlider" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_sliderItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_sliderItem_0";
  var id = "U1wYmCSPlPXKMr8_sliderItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_sliderItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_sliderItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_sliderItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_messageText_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_messageText_0";
  var id = "U1wYmCSPlPXKMr8_messageText_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "U1wYmCSPlPXKMr8_messageText_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "U1wYmCSPlPXKMr8_messageText_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_messageText_0()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_messageText_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_boxReview_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_boxReview_0";
  var id = "U1wYmCSPlPXKMr8_boxReview_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_boxReview_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_boxReview_0()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_boxReview_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_customerAvatar_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_customerAvatar_0";
  var id = "U1wYmCSPlPXKMr8_customerAvatar_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_customerAvatar_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_customerAvatar_0()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_customerAvatar_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_boxCustomer_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_boxCustomer_0";
  var id = "U1wYmCSPlPXKMr8_boxCustomer_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_boxCustomer_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_boxCustomer_0()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_boxCustomer_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_customerName_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_customerName_0";
  var id = "U1wYmCSPlPXKMr8_customerName_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "U1wYmCSPlPXKMr8_customerName_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "U1wYmCSPlPXKMr8_customerName_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_customerName_0()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_customerName_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_ratingBenefit_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_ratingBenefit_0";
  var id = "U1wYmCSPlPXKMr8_ratingBenefit_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_ratingBenefit_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    function destroy() {}
    /* events block script */
    /* destroy block script */
    store.subscribe("component-" + id + "-destroy", function() {
      destroy();
      store.unsubscribe("component-" + id + "-destroy");
    });
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_ratingBenefit_0()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_ratingBenefit_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_iconAbsolute_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_iconAbsolute_0";
  var id = "U1wYmCSPlPXKMr8_iconAbsolute_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_iconAbsolute_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_iconAbsolute_0()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_iconAbsolute_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_iconBackground_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_iconBackground_0";
  var id = "U1wYmCSPlPXKMr8_iconBackground_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_iconBackground_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_iconBackground_0()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_iconBackground_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_sliderItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_sliderItem_1";
  var id = "U1wYmCSPlPXKMr8_sliderItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_sliderItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_sliderItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_sliderItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_messageText_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_messageText_1";
  var id = "U1wYmCSPlPXKMr8_messageText_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "U1wYmCSPlPXKMr8_messageText_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "U1wYmCSPlPXKMr8_messageText_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_messageText_1()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_messageText_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_boxReview_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_boxReview_1";
  var id = "U1wYmCSPlPXKMr8_boxReview_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_boxReview_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_boxReview_1()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_boxReview_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_customerAvatar_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_customerAvatar_1";
  var id = "U1wYmCSPlPXKMr8_customerAvatar_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_customerAvatar_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_customerAvatar_1()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_customerAvatar_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_boxCustomer_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_boxCustomer_1";
  var id = "U1wYmCSPlPXKMr8_boxCustomer_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_boxCustomer_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_boxCustomer_1()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_boxCustomer_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_customerName_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_customerName_1";
  var id = "U1wYmCSPlPXKMr8_customerName_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "U1wYmCSPlPXKMr8_customerName_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "U1wYmCSPlPXKMr8_customerName_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_customerName_1()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_customerName_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_ratingBenefit_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_ratingBenefit_1";
  var id = "U1wYmCSPlPXKMr8_ratingBenefit_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_ratingBenefit_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    function destroy() {}
    /* events block script */
    /* destroy block script */
    store.subscribe("component-" + id + "-destroy", function() {
      destroy();
      store.unsubscribe("component-" + id + "-destroy");
    });
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_ratingBenefit_1()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_ratingBenefit_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_iconAbsolute_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_iconAbsolute_1";
  var id = "U1wYmCSPlPXKMr8_iconAbsolute_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_iconAbsolute_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_iconAbsolute_1()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_iconAbsolute_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_iconBackground_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_iconBackground_1";
  var id = "U1wYmCSPlPXKMr8_iconBackground_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_iconBackground_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_iconBackground_1()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_iconBackground_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_sliderItem_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_sliderItem_2";
  var id = "U1wYmCSPlPXKMr8_sliderItem_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_sliderItem_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_sliderItem_2()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_sliderItem_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_messageText_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_messageText_2";
  var id = "U1wYmCSPlPXKMr8_messageText_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "U1wYmCSPlPXKMr8_messageText_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "U1wYmCSPlPXKMr8_messageText_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_messageText_2()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_messageText_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_boxReview_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_boxReview_2";
  var id = "U1wYmCSPlPXKMr8_boxReview_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_boxReview_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_boxReview_2()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_boxReview_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_customerAvatar_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_customerAvatar_2";
  var id = "U1wYmCSPlPXKMr8_customerAvatar_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_customerAvatar_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_customerAvatar_2()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_customerAvatar_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_boxCustomer_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_boxCustomer_2";
  var id = "U1wYmCSPlPXKMr8_boxCustomer_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_boxCustomer_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_boxCustomer_2()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_boxCustomer_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_customerName_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_customerName_2";
  var id = "U1wYmCSPlPXKMr8_customerName_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "U1wYmCSPlPXKMr8_customerName_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "U1wYmCSPlPXKMr8_customerName_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_customerName_2()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_customerName_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_ratingBenefit_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_ratingBenefit_2";
  var id = "U1wYmCSPlPXKMr8_ratingBenefit_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_ratingBenefit_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    function destroy() {}
    /* events block script */
    /* destroy block script */
    store.subscribe("component-" + id + "-destroy", function() {
      destroy();
      store.unsubscribe("component-" + id + "-destroy");
    });
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_ratingBenefit_2()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_ratingBenefit_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_iconAbsolute_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_iconAbsolute_2";
  var id = "U1wYmCSPlPXKMr8_iconAbsolute_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_iconAbsolute_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_iconAbsolute_2()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_iconAbsolute_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomU1wYmCSPlPXKMr8_iconBackground_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-U1wYmCSPlPXKMr8_iconBackground_2";
  var id = "U1wYmCSPlPXKMr8_iconBackground_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "U1wYmCSPlPXKMr8_iconBackground_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomU1wYmCSPlPXKMr8_iconBackground_2()
      } catch(e) {
        console.error("Error ESAtom Id: U1wYmCSPlPXKMr8_iconBackground_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionB0nDroUYLV1pZzB = function() {
          
        }
        funcESSectionB0nDroUYLV1pZzB()
      } catch(e) {
        console.error("Error ESSection Id: B0nDroUYLV1pZzB" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_bannerBox = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_bannerBox";
  var id = "B0nDroUYLV1pZzB_bannerBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "B0nDroUYLV1pZzB_bannerBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_bannerBox()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_bannerBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_headingText = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_headingText";
  var id = "B0nDroUYLV1pZzB_headingText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "B0nDroUYLV1pZzB_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "B0nDroUYLV1pZzB_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_headingText()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_headingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_messageText = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_messageText";
  var id = "B0nDroUYLV1pZzB_messageText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "B0nDroUYLV1pZzB_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "B0nDroUYLV1pZzB_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_messageText()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_messageText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_bannerImage = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_bannerImage";
  var id = "B0nDroUYLV1pZzB_bannerImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "B0nDroUYLV1pZzB_bannerImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_bannerImage()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_bannerImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_imageBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_imageBefore";
  var id = "B0nDroUYLV1pZzB_imageBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "B0nDroUYLV1pZzB_imageBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_imageBefore()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_imageBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_uploadImageBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_uploadImageBefore";
  var id = "B0nDroUYLV1pZzB_uploadImageBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "B0nDroUYLV1pZzB_uploadImageBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_uploadImageBefore()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_uploadImageBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_labelBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_labelBefore";
  var id = "B0nDroUYLV1pZzB_labelBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "B0nDroUYLV1pZzB_labelBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_labelBefore()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_labelBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_textBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_textBefore";
  var id = "B0nDroUYLV1pZzB_textBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "B0nDroUYLV1pZzB_textBefore",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "B0nDroUYLV1pZzB_textBefore",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_textBefore()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_textBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_imageAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_imageAfter";
  var id = "B0nDroUYLV1pZzB_imageAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "B0nDroUYLV1pZzB_imageAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_imageAfter()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_imageAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_uploadImageAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_uploadImageAfter";
  var id = "B0nDroUYLV1pZzB_uploadImageAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "B0nDroUYLV1pZzB_uploadImageAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_uploadImageAfter()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_uploadImageAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_labelAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_labelAfter";
  var id = "B0nDroUYLV1pZzB_labelAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "B0nDroUYLV1pZzB_labelAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_labelAfter()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_labelAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_textAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_textAfter";
  var id = "B0nDroUYLV1pZzB_textAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "B0nDroUYLV1pZzB_textAfter",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "B0nDroUYLV1pZzB_textAfter",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_textAfter()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_textAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomB0nDroUYLV1pZzB_buttonText = function() {
          (function() {
  var elementClassName = ".gt_atom-B0nDroUYLV1pZzB_buttonText";
  var id = "B0nDroUYLV1pZzB_buttonText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const isProduction = "production" === "production";
    let actions = `[]`
    const isCustomActions = "false" == "true"
    const openNewTab = "false" == "true"
    const linkButton = "";
    const activeButtonFixContent = "false" === "true";
    const buttonFixContent = "Buy [!quantity!] items"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "B0nDroUYLV1pZzB_buttonText",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function addAction() {
      if (!isCustomActions) {
        if (linkButton != "") {
          actionsObj = [{
            "id": 1,
            "event": "click",
            "control": {
              "id": "1",
              "attribute": "1",
              "title": "Pick Link",
              "desc": "",
              "reference": "html",
              "type": "picklink",
              "value": linkButton,
              "newTab": openNewTab
            }
          }]
        } else {
          actionsObj = []
        }
        actions = JSON.stringify(actionsObj);
      }
      if (isProduction) {
        $element.customEvent(JSON.parse(actions), id + "_" + indexEl);
        /*Listenifisbuttonaddtocard*/

        window.SOLID.store.subscribe("loading-buy-now-B0nDroUYLV1pZzB_buttonText" + "_" + indexEl, function(isDisplay) {
          const $loadingEl = $element.find(".atom-button-loading-circle-loader");
          const $textEl = $element.find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              window.SOLID.store.dispatch("loading-buy-now-B0nDroUYLV1pZzB_buttonText" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                window.SOLID.store.dispatch("loading-buy-now-B0nDroUYLV1pZzB_buttonText" + "_" + indexEl, "");
              }, 3000);
            }
          }
        });
      }
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    addAction();
    if (activeButtonFixContent) {
      initFixContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomB0nDroUYLV1pZzB_buttonText()
      } catch(e) {
        console.error("Error ESAtom Id: B0nDroUYLV1pZzB_buttonText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionbmTpeD71dOVMAZS = function() {
          
        }
        funcESSectionbmTpeD71dOVMAZS()
      } catch(e) {
        console.error("Error ESSection Id: bmTpeD71dOVMAZS" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionorEMtYq7qiRmqdz = function() {
          
        }
        funcESSectionorEMtYq7qiRmqdz()
      } catch(e) {
        console.error("Error ESSection Id: orEMtYq7qiRmqdz" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_bannerBox = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_bannerBox";
  var id = "orEMtYq7qiRmqdz_bannerBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "orEMtYq7qiRmqdz_bannerBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_bannerBox()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_bannerBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_headingText = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_headingText";
  var id = "orEMtYq7qiRmqdz_headingText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "orEMtYq7qiRmqdz_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "orEMtYq7qiRmqdz_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_headingText()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_headingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_messageText = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_messageText";
  var id = "orEMtYq7qiRmqdz_messageText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "orEMtYq7qiRmqdz_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "orEMtYq7qiRmqdz_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_messageText()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_messageText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_bannerImage = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_bannerImage";
  var id = "orEMtYq7qiRmqdz_bannerImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "orEMtYq7qiRmqdz_bannerImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_bannerImage()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_bannerImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_imageBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_imageBefore";
  var id = "orEMtYq7qiRmqdz_imageBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "orEMtYq7qiRmqdz_imageBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_imageBefore()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_imageBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_uploadImageBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_uploadImageBefore";
  var id = "orEMtYq7qiRmqdz_uploadImageBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "orEMtYq7qiRmqdz_uploadImageBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_uploadImageBefore()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_uploadImageBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_labelBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_labelBefore";
  var id = "orEMtYq7qiRmqdz_labelBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "orEMtYq7qiRmqdz_labelBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_labelBefore()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_labelBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_textBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_textBefore";
  var id = "orEMtYq7qiRmqdz_textBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "orEMtYq7qiRmqdz_textBefore",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "orEMtYq7qiRmqdz_textBefore",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_textBefore()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_textBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_imageAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_imageAfter";
  var id = "orEMtYq7qiRmqdz_imageAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "orEMtYq7qiRmqdz_imageAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_imageAfter()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_imageAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_uploadImageAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_uploadImageAfter";
  var id = "orEMtYq7qiRmqdz_uploadImageAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "orEMtYq7qiRmqdz_uploadImageAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_uploadImageAfter()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_uploadImageAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_labelAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_labelAfter";
  var id = "orEMtYq7qiRmqdz_labelAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "orEMtYq7qiRmqdz_labelAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_labelAfter()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_labelAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_textAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_textAfter";
  var id = "orEMtYq7qiRmqdz_textAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "orEMtYq7qiRmqdz_textAfter",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "orEMtYq7qiRmqdz_textAfter",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_textAfter()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_textAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomorEMtYq7qiRmqdz_buttonText = function() {
          (function() {
  var elementClassName = ".gt_atom-orEMtYq7qiRmqdz_buttonText";
  var id = "orEMtYq7qiRmqdz_buttonText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const isProduction = "production" === "production";
    let actions = `[]`
    const isCustomActions = "false" == "true"
    const openNewTab = "false" == "true"
    const linkButton = "";
    const activeButtonFixContent = "false" === "true";
    const buttonFixContent = "Buy [!quantity!] items"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "orEMtYq7qiRmqdz_buttonText",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function addAction() {
      if (!isCustomActions) {
        if (linkButton != "") {
          actionsObj = [{
            "id": 1,
            "event": "click",
            "control": {
              "id": "1",
              "attribute": "1",
              "title": "Pick Link",
              "desc": "",
              "reference": "html",
              "type": "picklink",
              "value": linkButton,
              "newTab": openNewTab
            }
          }]
        } else {
          actionsObj = []
        }
        actions = JSON.stringify(actionsObj);
      }
      if (isProduction) {
        $element.customEvent(JSON.parse(actions), id + "_" + indexEl);
        /*Listenifisbuttonaddtocard*/

        window.SOLID.store.subscribe("loading-buy-now-orEMtYq7qiRmqdz_buttonText" + "_" + indexEl, function(isDisplay) {
          const $loadingEl = $element.find(".atom-button-loading-circle-loader");
          const $textEl = $element.find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              window.SOLID.store.dispatch("loading-buy-now-orEMtYq7qiRmqdz_buttonText" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                window.SOLID.store.dispatch("loading-buy-now-orEMtYq7qiRmqdz_buttonText" + "_" + indexEl, "");
              }, 3000);
            }
          }
        });
      }
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    addAction();
    if (activeButtonFixContent) {
      initFixContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomorEMtYq7qiRmqdz_buttonText()
      } catch(e) {
        console.error("Error ESAtom Id: orEMtYq7qiRmqdz_buttonText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSection6GxVTt4JEV2LL3L = function() {
          
        }
        funcESSection6GxVTt4JEV2LL3L()
      } catch(e) {
        console.error("Error ESSection Id: 6GxVTt4JEV2LL3L" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_bannerBox = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_bannerBox";
  var id = "6GxVTt4JEV2LL3L_bannerBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6GxVTt4JEV2LL3L_bannerBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_bannerBox()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_bannerBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_headingText = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_headingText";
  var id = "6GxVTt4JEV2LL3L_headingText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "6GxVTt4JEV2LL3L_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "6GxVTt4JEV2LL3L_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_headingText()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_headingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_messageText = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_messageText";
  var id = "6GxVTt4JEV2LL3L_messageText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "6GxVTt4JEV2LL3L_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "6GxVTt4JEV2LL3L_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_messageText()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_messageText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_bannerImage = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_bannerImage";
  var id = "6GxVTt4JEV2LL3L_bannerImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6GxVTt4JEV2LL3L_bannerImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_bannerImage()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_bannerImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_imageBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_imageBefore";
  var id = "6GxVTt4JEV2LL3L_imageBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6GxVTt4JEV2LL3L_imageBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_imageBefore()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_imageBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_uploadImageBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_uploadImageBefore";
  var id = "6GxVTt4JEV2LL3L_uploadImageBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6GxVTt4JEV2LL3L_uploadImageBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_uploadImageBefore()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_uploadImageBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_labelBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_labelBefore";
  var id = "6GxVTt4JEV2LL3L_labelBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6GxVTt4JEV2LL3L_labelBefore",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_labelBefore()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_labelBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_textBefore = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_textBefore";
  var id = "6GxVTt4JEV2LL3L_textBefore";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "6GxVTt4JEV2LL3L_textBefore",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "6GxVTt4JEV2LL3L_textBefore",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_textBefore()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_textBefore" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_imageAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_imageAfter";
  var id = "6GxVTt4JEV2LL3L_imageAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6GxVTt4JEV2LL3L_imageAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_imageAfter()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_imageAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_uploadImageAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_uploadImageAfter";
  var id = "6GxVTt4JEV2LL3L_uploadImageAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6GxVTt4JEV2LL3L_uploadImageAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_uploadImageAfter()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_uploadImageAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_labelAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_labelAfter";
  var id = "6GxVTt4JEV2LL3L_labelAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6GxVTt4JEV2LL3L_labelAfter",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_labelAfter()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_labelAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_textAfter = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_textAfter";
  var id = "6GxVTt4JEV2LL3L_textAfter";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "6GxVTt4JEV2LL3L_textAfter",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "6GxVTt4JEV2LL3L_textAfter",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_textAfter()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_textAfter" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6GxVTt4JEV2LL3L_buttonText = function() {
          (function() {
  var elementClassName = ".gt_atom-6GxVTt4JEV2LL3L_buttonText";
  var id = "6GxVTt4JEV2LL3L_buttonText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const isProduction = "production" === "production";
    let actions = `[]`
    const isCustomActions = "false" == "true"
    const openNewTab = "false" == "true"
    const linkButton = "";
    const activeButtonFixContent = "false" === "true";
    const buttonFixContent = "Buy [!quantity!] items"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6GxVTt4JEV2LL3L_buttonText",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function addAction() {
      if (!isCustomActions) {
        if (linkButton != "") {
          actionsObj = [{
            "id": 1,
            "event": "click",
            "control": {
              "id": "1",
              "attribute": "1",
              "title": "Pick Link",
              "desc": "",
              "reference": "html",
              "type": "picklink",
              "value": linkButton,
              "newTab": openNewTab
            }
          }]
        } else {
          actionsObj = []
        }
        actions = JSON.stringify(actionsObj);
      }
      if (isProduction) {
        $element.customEvent(JSON.parse(actions), id + "_" + indexEl);
        /*Listenifisbuttonaddtocard*/

        window.SOLID.store.subscribe("loading-buy-now-6GxVTt4JEV2LL3L_buttonText" + "_" + indexEl, function(isDisplay) {
          const $loadingEl = $element.find(".atom-button-loading-circle-loader");
          const $textEl = $element.find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              window.SOLID.store.dispatch("loading-buy-now-6GxVTt4JEV2LL3L_buttonText" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                window.SOLID.store.dispatch("loading-buy-now-6GxVTt4JEV2LL3L_buttonText" + "_" + indexEl, "");
              }, 3000);
            }
          }
        });
      }
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    addAction();
    if (activeButtonFixContent) {
      initFixContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6GxVTt4JEV2LL3L_buttonText()
      } catch(e) {
        console.error("Error ESAtom Id: 6GxVTt4JEV2LL3L_buttonText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectioncUX1t9euMZSZODO = function() {
          
        }
        funcESSectioncUX1t9euMZSZODO()
      } catch(e) {
        console.error("Error ESSection Id: cUX1t9euMZSZODO" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectioncblJRuoDcvkRFOG = function() {
          var $section = jQuery(".gt_section-cblJRuoDcvkRFOG");
if (!$section || !$section.length) {
  return;
}
var $item = $section.find(".gt_body .gt_item");
var time = 15;
var windowSize = $(window).width();


function initialize() {
  windowSize = $(window).width();
  var featureType =
    windowSize < 576
      ? "collapse"
      : windowSize < 992
      ? "collapse"
      : "showAll";

  if (windowSize >= 992 || featureType === "showAll") {
    var allIconCloses = $section.find(".gt_icon-close");
    var allIconOpens = $section.find(".gt_icon-open");

    allIconCloses.hide();
    allIconOpens.hide();


    $item.off("click.openCollapse");

    return;
  }
  windowSize = $(window).width();
  if (windowSize < 992) {
    // FOR MOBILE ONLY
    var itemActiveOnOff = "true";
    var itemActivePosition = "1";
    var tab = [{"data":{"heading":"<b>MicroZeoGen</b>","subHeading":"A natural mineral, dynamically\nmicronized clinoptilolite actively stimulates intestinal microflora and nutrient absorption. Due to special microstructure, it can help remove toxins from the body and strengthen the immune system.","sectionIcon":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/FarViiUawt-microzeogen-png_200x.png?v=1632233842","name":"FarViiUawt-microzeogen-png.png","type":"image"}},"settings":[{"atom":"text","attribute":"heading","desc":"","id":"heading","index":0,"reference":"html","settings":{"customFontSize":true,"textColor":"#1D1D1B","textSize_lg":"21px","textSize_md":"21px","textSize_sm":"21px","textSize_xs":"21px","textValue":"<b>MicroZeoGen</b>"},"title":"Heading Name","type":"input","value":"<b>Effective Vibrations</b>"},{"atom":"text","attribute":"subHeading","desc":"","id":"subHeading","index":0,"reference":"html","settings":{"customFontSize":true,"textSize":"16px","textSize_xs":"16px","textValue":"A natural mineral, dynamically\nmicronized clinoptilolite actively stimulates intestinal microflora and nutrient absorption. Due to special microstructure, it can help remove toxins from the body and strengthen the immune system."},"title":"Sub Heading","type":"input","value":"Solid Brush technology with up to 35,000 vibrations cleans your teeth effectively and gently."},{"attribute":"sectionIcon","id":"sectionIcon","index":0,"reference":"html","title":"Upload Icon","type":"iconuploader","value":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/FarViiUawt-microzeogen-png_200x.png?v=1632233842","name":"FarViiUawt-microzeogen-png.png","type":"image"}}],"title":"Feature 1"},{"data":{"heading":"<b>No Wheat</b>","subHeading":"All feeds from this line are formulated without any wheat. This helps to reduce risks of allergy, skin irritation and various infections.  It also prevents any possible feed contaminations that\nare usually caused by wheat.","sectionIcon":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/PffpiKnEhW-no_wheat-removebg-preview-png_200x.png?v=1632313432","name":"PffpiKnEhW-no_wheat-removebg-preview-png.png","type":"image"}},"settings":[{"atom":"text","attribute":"heading","desc":"","id":"heading","index":1,"reference":"html","settings":{"customFontSize":true,"textColor":"#1D1D1B","textSize_lg":"21px","textSize_md":"21px","textSize_sm":"21px","textSize_xs":"21px","textValue":"<b>No Wheat</b>"},"title":"Heading Name","type":"input","value":"<b>High-Quality Triple-Bristles</b>"},{"atom":"text","attribute":"subHeading","desc":"","id":"subHeading","index":1,"reference":"html","settings":{"customFontSize":true,"textSize":"16px","textSize_xs":"16px","textValue":"All feeds from this line are formulated without any wheat. This helps to reduce risks of allergy, skin irritation and various infections.  It also prevents any possible feed contaminations that\nare usually caused by wheat."},"title":"Sub Heading","type":"input","value":"Have triple-twisted bristles which pamper your teeth with their special surface."},{"attribute":"sectionIcon","id":"sectionIcon","index":1,"reference":"html","title":"Upload Icon","type":"iconuploader","value":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/PffpiKnEhW-no_wheat-removebg-preview-png_200x.png?v=1632313432","name":"PffpiKnEhW-no_wheat-removebg-preview-png.png","type":"image"}}],"title":"Feature 2"},{"data":{"heading":"<b>Natural Antioxidants</b>","subHeading":"Natural antioxidants  - vitamin E\nand rosemary  extract can help to protect cells against the negative impact of free radicals in a \nthe completely natural way.","sectionIcon":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/hzkzcfQPLR-screenshot_20-removebg-preview-png_200x.png?v=1632313861","name":"hzkzcfQPLR-screenshot_20-removebg-preview-png.png","type":"image"}},"settings":[{"atom":"text","attribute":"heading","desc":"","id":"heading","index":2,"reference":"html","settings":{"customFontSize":true,"textColor":"#1D1D1B","textSize_lg":"21px","textSize_md":"21px","textSize_sm":"21px","textSize_xs":"21px","textValue":"<b>Natural Antioxidants</b>"},"title":"Heading Name","type":"input","value":"<b>Long-Lasting Charge</b>"},{"atom":"text","attribute":"subHeading","desc":"","id":"subHeading","index":2,"reference":"html","settings":{"customFontSize":true,"textSize":"16px","textSize_xs":"16px","textValue":"Natural antioxidants  - vitamin E\nand rosemary  extract can help to protect cells against the negative impact of free radicals in a \nthe completely natural way."},"title":"Sub Heading","type":"input","value":"Our rechargeable li-ion battery lasts over 25 days."},{"attribute":"sectionIcon","id":"sectionIcon","index":2,"reference":"html","title":"Upload Icon","type":"iconuploader","value":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/hzkzcfQPLR-screenshot_20-removebg-preview-png_200x.png?v=1632313861","name":"hzkzcfQPLR-screenshot_20-removebg-preview-png.png","type":"image"}}],"title":"Feature 3"},{"data":{"heading":"<b>100% Sustainable Krill</b>","subHeading":"Antarctic krill, a unique and 100% sustainable source of Omega-3, serves your pet's body with scientifically proven benefits. Omega-3 from krill is more effectively absorbed than from usual fish oils by 2,5 times.","sectionIcon":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/LHBJOBocAQ-screenshot_33-removebg-preview-png_200x.png?v=1632313446","name":"LHBJOBocAQ-screenshot_33-removebg-preview-png.png","type":"image"}},"settings":[{"atom":"text","attribute":"heading","desc":"","id":"heading","index":3,"reference":"html","settings":{"customFontSize":true,"textColor":"#1D1D1B","textSize_lg":"21px","textSize_md":"21px","textSize_sm":"21px","textSize_xs":"21px","textValue":"<b>100% Sustainable Krill</b>"},"title":"Heading Name","type":"input","value":"<b>Timed Brushing</b>"},{"atom":"text","attribute":"subHeading","desc":"","id":"subHeading","index":3,"reference":"html","settings":{"customFontSize":true,"textSize":"16px","textSize_xs":"16px","textValue":"Antarctic krill, a unique and 100% sustainable source of Omega-3, serves your pet's body with scientifically proven benefits. Omega-3 from krill is more effectively absorbed than from usual fish oils by 2,5 times."},"title":"Sub Heading","type":"input","value":"2-minute timer with 30 second alerts keeps your brushing honest."},{"attribute":"sectionIcon","id":"sectionIcon","index":3,"reference":"html","title":"Upload Icon","type":"iconuploader","value":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/LHBJOBocAQ-screenshot_33-removebg-preview-png_200x.png?v=1632313446","name":"LHBJOBocAQ-screenshot_33-removebg-preview-png.png","type":"image"}}],"title":"Feature 4"},{"data":{"heading":"<b>Decreases Risk of Allergy</b>","subHeading":"By using only top quality, natural & healthy ingredients without any wheat or additives, our feed \nimmensely decreases the risk of allergies.","sectionIcon":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/YIMdGRUAVX-screenshot_25-removebg-preview-png_200x.png?v=1632314047","name":"YIMdGRUAVX-screenshot_25-removebg-preview-png.png","type":"image"}},"settings":[{"atom":"text","attribute":"heading","desc":"","id":"heading","index":4,"reference":"html","settings":{"customFontSize":true,"textColor":"#1D1D1B","textSize_lg":"21px","textSize_md":"21px","textSize_sm":"21px","textSize_xs":"21px","textValue":"<b>Decreases Risk of Allergy</b>"},"title":"Heading Name","type":"input","value":"<b>Waterproof & Shower-Safe</b>"},{"atom":"text","attribute":"subHeading","desc":"","id":"subHeading","index":4,"reference":"html","settings":{"customFontSize":true,"textSize":"16px","textSize_xs":"16px","textValue":"By using only top quality, natural & healthy ingredients without any wheat or additives, our feed \nimmensely decreases the risk of allergies."},"title":"Sub Heading","type":"input","value":"It is completely safe to use your Solid Brush  in the shower."},{"attribute":"sectionIcon","id":"sectionIcon","index":4,"reference":"html","title":"Upload Icon","type":"iconuploader","value":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/YIMdGRUAVX-screenshot_25-removebg-preview-png_200x.png?v=1632314047","name":"YIMdGRUAVX-screenshot_25-removebg-preview-png.png","type":"image"}}],"title":"Feature 5"},{"data":{"heading":"<b>Gluten Free</b>","subHeading":"A diet that consists of ingredients  with no gluten helps to avoid disorders of the digestive \nthe system, various allergic reactions  & makes your pooch less prone to diseases.","sectionIcon":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/YpthgNKbDz-screenshot_26-removebg-preview-png_200x.png?v=1632314058","name":"YpthgNKbDz-screenshot_26-removebg-preview-png.png","type":"image"}},"settings":[{"atom":"text","attribute":"heading","desc":"","id":"heading","index":5,"reference":"html","settings":{"customFontSize":true,"textColor":"#1D1D1B","textSize_lg":"21px","textSize_md":"21px","textSize_sm":"21px","textSize_xs":"21px","textValue":"<b>Gluten Free</b>"},"title":"Heading Name","type":"input","value":"<b>ADA Accepted</b>"},{"atom":"text","attribute":"subHeading","desc":"","id":"subHeading","index":5,"reference":"html","settings":{"customFontSize":true,"textSize":"16px","textSize_xs":"16px","textValue":"A diet that consists of ingredients  with no gluten helps to avoid disorders of the digestive \nthe system, various allergic reactions  & makes your pooch less prone to diseases."},"title":"Sub Heading","type":"input","value":" Our electric toothbrush meet the American Dental Association’s requirements for safety and efficacy of dental products."},{"attribute":"sectionIcon","id":"sectionIcon","index":5,"reference":"html","title":"Upload Icon","type":"iconuploader","value":{"content":"https://cdn.shopify.com/s/files/1/0597/1551/8645/t/4/assets/YpthgNKbDz-screenshot_26-removebg-preview-png_200x.png?v=1632314058","name":"YpthgNKbDz-screenshot_26-removebg-preview-png.png","type":"image"}}],"title":"Feature 6"}];
    var $list = $section.find(".gt_item");

    for (var i = 0; i < tab.length; i++) {
      var $itemActive = $($list[i]);
      var $contentActive = $itemActive.find(".gt_list-content");
      var $iconOpenActive = $itemActive.find(".gt_icon-open");
      var $iconCloseActive = $itemActive.find(".gt_icon-close");
      if (itemActiveOnOff == "true" && itemActivePosition == i + 1) {
        $contentActive.addClass("gt_active");
        $iconOpenActive.css("display", "none");
        $iconCloseActive.css("display", "block");
      } else {
        $contentActive.removeClass("gt_active");
        $iconOpenActive.css("display", "block");
        $iconCloseActive.css("display", "none");
      }
    }

    $item.off("click.openCollapse").on("click.openCollapse", function (event) {
      var $content = $(this).find(".gt_list-content");
      var $iconClose = $(this).find(".gt_icon-close");
      var $iconOpen = $(this).find(".gt_icon-open");

      if ($content.hasClass("gt_active")) {
        window.gtAnimations.SlideUp($content[0], time, function () {
          $content.removeClass("gt_active");
          $iconOpen.css("display", "block");
          $iconClose.css("display", "none");
        });
      } else {
        $content.addClass("gt_active");
        $iconOpen.css("display", "none");
        $iconClose.css("display", "block");
        window.gtAnimations.SlideDown($content[0], time);
      }
    });
  }
}

initialize();
$(window).off("resize.checkSwitchScreenscblJRuoDcvkRFOG").on("resize.checkSwitchScreenscblJRuoDcvkRFOG", function() {
  if ($(window).width() == windowSize) {
    return;
  }

  initialize();
});

        }
        funcESSectioncblJRuoDcvkRFOG()
      } catch(e) {
        console.error("Error ESSection Id: cblJRuoDcvkRFOG" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_heading_0 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_heading_0");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_heading_0",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_heading_0()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_heading_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_subHeading_0 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_subHeading_0");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_subHeading_0",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_subHeading_0()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_subHeading_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_heading_1 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_heading_1");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_heading_1",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_heading_1()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_heading_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_subHeading_1 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_subHeading_1");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_subHeading_1",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_subHeading_1()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_subHeading_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_heading_2 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_heading_2");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_heading_2",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_heading_2()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_heading_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_subHeading_2 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_subHeading_2");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_subHeading_2",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_subHeading_2()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_subHeading_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_heading_3 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_heading_3");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_heading_3",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_heading_3()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_heading_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_subHeading_3 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_subHeading_3");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_subHeading_3",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_subHeading_3()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_subHeading_3" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_heading_4 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_heading_4");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_heading_4",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_heading_4()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_heading_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_subHeading_4 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_subHeading_4");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_subHeading_4",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_subHeading_4()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_subHeading_4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_heading_5 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_heading_5");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_heading_5",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_heading_5()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_heading_5" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_subHeading_5 = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_subHeading_5");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_subHeading_5",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_subHeading_5()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_subHeading_5" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_headingText = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_headingText");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_headingText",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_headingText()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_headingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_subHeadingText = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_subHeadingText");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_subHeadingText",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_subHeadingText()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_subHeadingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_buttonText1 = function() {
          /* Init Actions */
var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_buttonText1");
if (!$atoms || !$atoms.length) {
  return;
}
/* Variables */
const interactionHover = {"name":"none","duration":"1.5","delay":0,"iterationCount":1};
const interactionNormal = {"name":"none","duration":"1.5","delay":0,"iterationCount":"infinite"};
const interactionWhilePress = {"name":"none","duration":"1.5","delay":0,"iterationCount":1};
const interactionScrollIntoView = "";
// animation
window.SOLID.library.animation({
  elementId: "cblJRuoDcvkRFOG_buttonText1",
  $doms: $atoms,
  interactionNormal: {
    value: interactionNormal,
    previewAttr: "interactionButton"
  },
  interactionHover: {
    value: interactionHover,
    previewAttr: "interactionButtonHover"
  },
  interactionWhilePress: {
    value: interactionWhilePress,
    previewAttr: "interactionButtonWhitePress"
  },
  interactionScrollIntoView: {
    value: interactionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  animationType: "block",
  mode: "production",
})

for (let i = 0; i < $atoms.length; i++) {
  const $atom = $atoms[i];
  // function customEvent(actions, id, key)
  
    $($atom).customEvent([], "cblJRuoDcvkRFOG_buttonText1" + "_" + i);
  

  /* Listen if is button add to card */

  window.SOLID.store.subscribe("loading-buy-now-cblJRuoDcvkRFOG_buttonText1" + "_" + i, function (isDisplay) {
    const $loadingEl = $($atom).find(".atom-button-loading-circle-loader");
    const $textEl = $($atom).find(".gt_button-content-text");
    if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
      let timeout = undefined;
      if (isDisplay === true) {
        /* display loading button */
        clearTimeout(timeout);
        $loadingEl.css("display", "inline-block");
        $textEl.css("visibility", "hidden");
      } else if (isDisplay === "stop") {
        /* stop loading */
        $loadingEl.removeAttr("style");
        $textEl.removeAttr("style");
        window.SOLID.store.dispatch("loading-buy-now-cblJRuoDcvkRFOG_buttonText1", "");
        window.SOLID.store.dispatch("loading-buy-now-cblJRuoDcvkRFOG_buttonText1" + "_" + i, "");
      } else if (isDisplay === false){
        clearTimeout(timeout);
        /* display tick button */
        $loadingEl.addClass("load-complete");
        $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
        /* remove tick button and display text*/
        timeout = setTimeout(function() {
          $loadingEl.removeClass("load-complete");
          $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
          $loadingEl.removeAttr("style");
          $textEl.removeAttr("style");
          window.SOLID.store.dispatch("loading-buy-now-cblJRuoDcvkRFOG_buttonText1", "");
          window.SOLID.store.dispatch("loading-buy-now-cblJRuoDcvkRFOG_buttonText1" + "_" + i, "");
        }, 3000);
      }
    }
  });
}

        }
        funcESAtomcblJRuoDcvkRFOG_buttonText1()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_buttonText1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomcblJRuoDcvkRFOG_smallText = function() {
          var $atoms = jQuery(".gt_atom-cblJRuoDcvkRFOG_smallText");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "cblJRuoDcvkRFOG_smallText",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomcblJRuoDcvkRFOG_smallText()
      } catch(e) {
        console.error("Error ESAtom Id: cblJRuoDcvkRFOG_smallText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionGQveViZCesLrR7t = function() {
          
        }
        funcESSectionGQveViZCesLrR7t()
      } catch(e) {
        console.error("Error ESSection Id: GQveViZCesLrR7t" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_bannerSlider = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_bannerSlider";
  var id = "GQveViZCesLrR7t_bannerSlider";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var loop = "true" === "true";
    var autoplay = "true" === "true";
    var centeredSlides = "false" === "true";
    var slideAutoHeight = "false" === "true";
    var mode = "production";
    var checkWindowWidth = $(window).width();
    var widthSliderCurrent;
    var slidesPerView_lg = "1";
    var slidesPerView_md = "1";
    var slidesPerView_sm = "1";
    var slidesPerView_xs = "1";
    var slidesPerColumn_lg = "1";
    var slidesPerColumn_md = "1";
    var slidesPerColumn_sm = "1";
    var slidesPerColumn_xs = "1";
    var spaceBetween_lg = parseInt("20") || 1;
    var spaceBetween_md = parseInt("20") || 1;
    var spaceBetween_sm = parseInt("15") || 1;
    var spaceBetween_xs = parseInt("10") || 1;
    var widthActive = "false" === "true";
    var widthSlider = "100%";
    var widthSlider_lg = "100%";
    var widthSlider_md = "100%";
    var widthSlider_sm = "100%";
    var widthSlider_xs = "100%";
    var autoPlayTime = parseInt("3") || 3;
    var mySwiper;
    var objectSetting;

    var dotsPagination = "dots" === "dots";
    var customPagination = "dots" === "custom";
    /* store get state block script */
    /* methods block script */
    function initSlider() {
      var $swiperContainer = $element.find(".gt_slider");
      if (!$swiperContainer || !$swiperContainer.length) {
        return;
      }
      if (dotsPagination) {
        if (slideAutoHeight) {
          var slideAutoHeight1 = slideAutoHeight;
        } else {
          var slideAutoHeight1 = false;
        }
        objectSetting = {
          autoHeight: slideAutoHeight1,
          speed: 800,
          loop: loop,
          centeredSlides: centeredSlides,
          touchStartPreventDefault: mode === "dev" ? false : true,
          slidesPerView: 1,
          autoplay: autoplay ? {
            delay: autoPlayTime * 1000,
            disableOnInteraction: false,
          } : false,
          navigation: {
            nextEl: "#gt_control-next-GQveViZCesLrR7t_bannerSlider",
            prevEl: "#gt_control-prev-GQveViZCesLrR7t_bannerSlider",
          },
          pagination: {
            el: "#gt_control-pagination-GQveViZCesLrR7t_bannerSlider",
            type: 'custom',
            clickable: true,
            renderCustom: function(swiper, current, total) {
              var customPaginationHtml = "";
              for (var i = 0; i < total; i++) {
                if (i == (current - 1)) {
                  customPaginationHtml += `<div class="gt_control-pagination-item swiper-pagination-bullet swiper-pagination-bullet-active">
                        <span data-optimize-type="icon"  data-attribute="iconDotsActive,"  data-section-id="GQveViZCesLrR7t_bannerSlider"  class="gt_icon"><svg width="100%" height="100%" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="20" height="8" rx="4" fill="currentColor"/>
</svg>
</span> </div> `;
                } else {
                  customPaginationHtml += `<div class="gt_control-pagination-item swiper-pagination-bullet">
                        <span data-optimize-type="icon"  data-attribute="iconDots,"  data-section-id="GQveViZCesLrR7t_bannerSlider"  class="gt_icon"><svg height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 22C13.05 22 13.5 21.55 13.5 21V3C13.5 2.45 13.05 2 12.5 2C11.95 2 11.5 2.45 11.5 3V21C11.5 21.55 11.95 22 12.5 22ZM8.5 18C9.05 18 9.5 17.55 9.5 17V7C9.5 6.45 9.05 6 8.5 6C7.95 6 7.5 6.45 7.5 7V17C7.5 17.55 7.95 18 8.5 18ZM5.5 13C5.5 13.55 5.05 14 4.5 14C3.95 14 3.5 13.55 3.5 13V11C3.5 10.45 3.95 10 4.5 10C5.05 10 5.5 10.45 5.5 11V13ZM16.5 18C17.05 18 17.5 17.55 17.5 17V7C17.5 6.45 17.05 6 16.5 6C15.95 6 15.5 6.45 15.5 7V17C15.5 17.55 15.95 18 16.5 18ZM19.5 13V11C19.5 10.45 19.95 10 20.5 10C21.05 10 21.5 10.45 21.5 11V13C21.5 13.55 21.05 14 20.5 14C19.95 14 19.5 13.55 19.5 13Z" fill="currentColor"/> </svg></span>
                        </div>`;
                }
              }
              return customPaginationHtml;
            }
          },
          breakpoints: {
            0: {
              slidesPerView: slidesPerView_xs,
              spaceBetween: spaceBetween_xs,
              slidesPerColumn: slidesPerColumn_xs,
              slidesPerColumnFill: 'row',
            },
            577: {
              slidesPerView: slidesPerView_sm,
              spaceBetween: spaceBetween_sm,
              slidesPerColumn: slidesPerColumn_sm,
              slidesPerColumnFill: 'row',
            },
            993: {
              slidesPerView: slidesPerView_md,
              spaceBetween: spaceBetween_md,
              slidesPerColumn: slidesPerColumn_md,
              slidesPerColumnFill: 'row',
            },
            1201: {
              slidesPerView: slidesPerView_lg,
              spaceBetween: spaceBetween_lg,
              slidesPerColumn: slidesPerColumn_lg,
              slidesPerColumnFill: 'row',
            },
          },
          on: {
            init: function() {
              const $images = $swiperContainer.find(".gt_lazyload").not(".gt_lazyloaded");
              if ($images && $images.length && window.SOLID.library && window.SOLID.library.gtLazyload) {
                for (var i = 0; i < $images.length; i++) {
                  window.SOLID.library.gtLazyload($images[i]);
                }
              }
            }
          }
        }
      } else if (customPagination) {
        if (slideAutoHeight) {
          var slideAutoHeight2 = slideAutoHeight;
        } else {
          var slideAutoHeight2 = false;
        }
        objectSetting = {
          autoHeight: slideAutoHeight2,
          speed: 800,
          loop: loop,
          centeredSlides: centeredSlides,
          touchStartPreventDefault: mode === "dev" ? false : true,
          slidesPerView: 1,
          autoplay: autoplay ? {
            delay: autoPlayTime * 1000,
            disableOnInteraction: false,
          } : false,
          navigation: {
            nextEl: "#gt_control-next-GQveViZCesLrR7t_bannerSlider",
            prevEl: "#gt_control-prev-GQveViZCesLrR7t_bannerSlider",
          },

          pagination: {
            el: "#gt_control-pagination-GQveViZCesLrR7t_bannerSlider",
            clickable: true,
            renderBullet: function(index, className) {
              index = index + 1;
              if (index < 10) {
                index = "0" + index;
              }
              return '<span class="' + className + '">' + index + '.' + "</span>";
            }
          },
          breakpoints: {
            0: {
              slidesPerView: slidesPerView_xs,
              spaceBetween: spaceBetween_xs,
              slidesPerColumn: slidesPerColumn_xs,
              slidesPerColumnFill: 'row',
            },
            577: {
              slidesPerView: slidesPerView_sm,
              spaceBetween: spaceBetween_sm,
              slidesPerColumn: slidesPerColumn_sm,
              slidesPerColumnFill: 'row',
            },
            993: {
              slidesPerView: slidesPerView_md,
              spaceBetween: spaceBetween_md,
              slidesPerColumn: slidesPerColumn_md,
              slidesPerColumnFill: 'row',
            },
            1201: {
              slidesPerView: slidesPerView_lg,
              spaceBetween: spaceBetween_lg,
              slidesPerColumn: slidesPerColumn_lg,
              slidesPerColumnFill: 'row',
            },
          },
          on: {
            init: function() {
              const $images = $swiperContainer.find(".gt_lazyload").not(".gt_lazyloaded");
              if ($images && $images.length && window.SOLID.library && window.SOLID.library.gtLazyload) {
                for (var i = 0; i < $images.length; i++) {
                  window.SOLID.library.gtLazyload($images[i]);
                }
              }
            }
          }
        }
      }

      $swiperContainer.find(".swiper-wrapper").children().addClass("swiper-slide");

      if ($swiperContainer.find(".swiper-slide").length == 1) {
        $swiperContainer.find(".swiper-wrapper").addClass("gt_disabled");
        $element.find(".gt_control").addClass("gt_disabled");
      }

      if ($swiperContainer[0].swiper) {
        mySwiper = $swiperContainer[0].swiper;
        mySwiper.destroy();
      }
      mySwiper = new Swiper($swiperContainer[0], objectSetting);
    }

    function changeSliderActive(value) {
      if (value && value.sliderIndex !== NaN) {
        if (loop) {
          mySwiper.slideToLoop(value.sliderIndex, 500, true);
        } else {
          mySwiper.slideTo(value.sliderIndex, 500, true);
        }
      }
    }

    function optimizeSlidePerView(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        slidesPerView_xs = value;
      } else if (checkWindowWidth <= 992) {
        slidesPerView_sm = value;
      } else if (checkWindowWidth <= 1200) {
        slidesPerView_md = value;
      } else {
        slidesPerView_lg = value;
      }
      initSlider();
    }

    function optimizeWidthSlider(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        widthSlider_xs = value;
      } else if (checkWindowWidth <= 992) {
        widthSlider_sm = value;
      } else if (checkWindowWidth <= 1200) {
        widthSlider_md = value;
      } else {
        widthSlider_lg = widthSlider = value;
      }
      $element.css("cssText", "width: " + value + " !important;");
      mySwiper.update();
    }

    function optimizeWidthActive(value) {
      widthActive = value;
      if (!value) {
        $element.css("cssText", "width: null");
      } else {
        checkWindowWidth = $(window).width();
        widthSliderCurrent = 0;
        if (checkWindowWidth <= 576) {
          widthSliderCurrent = widthSlider_xs;
        } else if (checkWindowWidth <= 992) {
          widthSliderCurrent = widthSlider_sm;
        } else if (checkWindowWidth <= 1200) {
          widthSliderCurrent = widthSlider_md;
        } else {
          widthSliderCurrent = widthSlider;
        }
        $element.css("cssText", "width: " + widthSliderCurrent + " !important;");
      }
    }

    function listen() {
      let observer = new ResizeObserver(() => {
        if (mySwiper) {
          mySwiper.update()
        }
      })
      observer.observe($element[0]);
    }
    /* init block script */
    listen();
    //eslint-disable-next-lineno-undef
    if (mode !== "production") {
      autoplay = false;
    }
    initSlider();
    var delay = 0;

    /* store subscribe block script */
    store.subscribe("optimal-GQveViZCesLrR7t_bannerSlider-slidesPerView", optimizeSlidePerView);
    store.subscribe("optimal-GQveViZCesLrR7t_bannerSlider-widthSlider", optimizeWidthSlider);
    store.subscribe("optimal-GQveViZCesLrR7t_bannerSlider-widthActive", optimizeWidthActive);
    store.subscribe("trigger-slider-GQveViZCesLrR7t_bannerSlider", changeSliderActive);

    function destroy() {
      store.unsubscribe("optimal-GQveViZCesLrR7t_bannerSlider-slidesPerView", optimizeSlidePerView);
      store.unsubscribe("optimal-GQveViZCesLrR7t_bannerSlider-widthSlider", optimizeWidthSlider);
      store.unsubscribe("optimal-GQveViZCesLrR7t_bannerSlider-widthActive", optimizeWidthActive);
      store.unsubscribe("trigger-slider-GQveViZCesLrR7t_bannerSlider", changeSliderActive);
    }
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_bannerSlider()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_bannerSlider" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_sliderItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_sliderItem_0";
  var id = "GQveViZCesLrR7t_sliderItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "GQveViZCesLrR7t_sliderItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_sliderItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_sliderItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_boxContent_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_boxContent_0";
  var id = "GQveViZCesLrR7t_boxContent_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "GQveViZCesLrR7t_boxContent_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_boxContent_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_boxContent_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_headingText_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_headingText_0";
  var id = "GQveViZCesLrR7t_headingText_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "GQveViZCesLrR7t_headingText_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "GQveViZCesLrR7t_headingText_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_headingText_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_headingText_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_messageText_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_messageText_0";
  var id = "GQveViZCesLrR7t_messageText_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "GQveViZCesLrR7t_messageText_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "GQveViZCesLrR7t_messageText_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_messageText_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_messageText_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_boxReview_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_boxReview_0";
  var id = "GQveViZCesLrR7t_boxReview_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "GQveViZCesLrR7t_boxReview_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_boxReview_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_boxReview_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_ratingBenefit_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_ratingBenefit_0";
  var id = "GQveViZCesLrR7t_ratingBenefit_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "GQveViZCesLrR7t_ratingBenefit_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    function destroy() {}
    /* events block script */
    /* destroy block script */
    store.subscribe("component-" + id + "-destroy", function() {
      destroy();
      store.unsubscribe("component-" + id + "-destroy");
    });
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_ratingBenefit_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_ratingBenefit_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_customerAvatar_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_customerAvatar_0";
  var id = "GQveViZCesLrR7t_customerAvatar_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function checkDimensions() {
      var widthImage = $(elementClassName).find("img").width();
      var heightImage = $(elementClassName).find("img").height();
      $(elementClassName).find("img").attr('width', widthImage);
      $(elementClassName).find("img").attr('height', heightImage);
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "GQveViZCesLrR7t_customerAvatar_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    checkDimensions();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_customerAvatar_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_customerAvatar_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_customerName_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_customerName_0";
  var id = "GQveViZCesLrR7t_customerName_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "GQveViZCesLrR7t_customerName_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "GQveViZCesLrR7t_customerName_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_customerName_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_customerName_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_boxVerified_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_boxVerified_0";
  var id = "GQveViZCesLrR7t_boxVerified_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "GQveViZCesLrR7t_boxVerified_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_boxVerified_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_boxVerified_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_verifiedText_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_verifiedText_0";
  var id = "GQveViZCesLrR7t_verifiedText_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "GQveViZCesLrR7t_verifiedText_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "GQveViZCesLrR7t_verifiedText_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_verifiedText_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_verifiedText_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_iconVerified_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_iconVerified_0";
  var id = "GQveViZCesLrR7t_iconVerified_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "GQveViZCesLrR7t_iconVerified_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_iconVerified_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_iconVerified_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomGQveViZCesLrR7t_timePost_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-GQveViZCesLrR7t_timePost_0";
  var id = "GQveViZCesLrR7t_timePost_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "GQveViZCesLrR7t_timePost_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "GQveViZCesLrR7t_timePost_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomGQveViZCesLrR7t_timePost_0()
      } catch(e) {
        console.error("Error ESAtom Id: GQveViZCesLrR7t_timePost_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
})(window.esQuery || jQuery, window.esQuery || jQuery);

    
  
/*
  You SHOULD NOT modify source code in this page because
  It is automatically generated from EcomSolid
  Try to edit page with the live editor.
  https://ecomsolid.com
*/

    (function(jQuery, $) {
      
      try {
        const funcESWidgetNEatW2Lz7vi62KG = function() {
          

        }
        funcESWidgetNEatW2Lz7vi62KG()
      } catch(e) {
        console.error("Error ESWidget Id: NEatW2Lz7vi62KG" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESWidgetIioF2S72LayKxAb = function() {
          

        }
        funcESWidgetIioF2S72LayKxAb()
      } catch(e) {
        console.error("Error ESWidget Id: IioF2S72LayKxAb" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESWidgetJZ08qmpqYQORPXg = function() {
          
        }
        funcESWidgetJZ08qmpqYQORPXg()
      } catch(e) {
        console.error("Error ESWidget Id: JZ08qmpqYQORPXg" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
    try {
      function triggerDToStore() {
        window.SOLID = window.SOLID || {};
        var discounts = window.SOLID.discounts || [];
        if (window.store && window.store.update) {
          window.store.update("discounts", discounts)
        }
      }
      triggerDToStore()
    } catch(e) {
      console.log("=============================== START ERROR =================================")
      console.log(e)
      console.log("===============================  END ERROR  =================================")
    }
  
    })(window.esQuery || jQuery, window.esQuery || jQuery);
  
    
  