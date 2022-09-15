
  
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
        const funcESSectionA5hJoarD8Xs8Eg4 = function() {
          
        }
        funcESSectionA5hJoarD8Xs8Eg4()
      } catch(e) {
        console.error("Error ESSection Id: A5hJoarD8Xs8Eg4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESElement51728 = function() {
          var $elementProduct = $(".gt_element-51728");

var $price = $elementProduct.find(".gt_product-price");
if ($price && $price.length > 0) {
  $price.gtProductPrice({
    classCurrentPrice: ".gt_product-price--current",
    classComparePrice: ".gt_product-price--compare"
  });
}

var $featureImage = $elementProduct.find(".gt_product-image");
if ($featureImage && $featureImage.length > 0) {
  $featureImage.gtProductFeatureImage({
    classFeatureImage: ".gt_product-image--front, .gt_product-image--back",
    classImages: null,
    carousel: null,
    owlCarousel: null,
  });
}

var $swatches = $elementProduct.find(".gt_product_variants");
if ($swatches && $swatches.length > 0) {
  $swatches.gtProductSwatches({
    classCurrentValue: ".gt_product-variant-option--selected span",
    classCurrentStatus: ".gt_product-sold-out-tag",
    classItem: ".gt_product-variant-option",
    classInputIdHidden: ".gt_swatches--input",
    classBtnSelect: ".gt_swatches--select",
  });
}

var $saved = $elementProduct.find(".gt_product-sale-tag");
if ($saved && $saved.length > 0) {
  $saved.gtProductSaved({
    classTextPercent: ".gt_product-sale-tag--value--percent",
    classTextNumber: ".gt_product-sale-tag--value--number",
    dataFormat: "[!Profit!] off",
    dataFormatKey: "[!Profit!]",
    customCurrencyFormating: "shortPrefix"
  });
}

var $variantChecked = $elementProduct.find(".gt_product-variant--checked");
var $variantOptions = $elementProduct.find(".gt_product-variant-options");
var $variantOption = $elementProduct.find(".gt_product-variant-option");

$variantChecked.off("click.selectItem51728").on("click.selectItem51728", function() {
  var $options = $(this).siblings(".gt_product-variant-options");
  if($options.hasClass("gt_active")) {
    $options.removeClass("gt_active");
    $(this).removeClass("gt_active");
  } else {
    $variantOptions.removeClass("gt_active");
    $options.addClass("gt_active");
    $(this).addClass("gt_active");
  }
});

$variantOption.off("click.selectItem51728").on("click.selectItem51728", function() {
  $variantChecked.removeClass('gt_active');
  $variantOptions.removeClass('gt_active');
  var value = $(this).attr("data-value");
  var $variantCheckedCurrent =  $(this).closest(".gt_product-variant-box");
  $variantCheckedCurrent.find(".gt_product-variant--checked .gt_product-variant-option--selected span").html(value);
});

        }
        funcESElement51728()
      } catch(e) {
        console.error("Error ESElement Id: 51728" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom51728_productTitle = function() {
          var $atoms = jQuery(".gt_atom-51728_productTitle");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "51728_productTitle",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtom51728_productTitle()
      } catch(e) {
        console.error("Error ESAtom Id: 51728_productTitle" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom51728_productVendor = function() {
          var $atoms = jQuery(".gt_atom-51728_productVendor");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "51728_productVendor",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtom51728_productVendor()
      } catch(e) {
        console.error("Error ESAtom Id: 51728_productVendor" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom51728_productButtonBuy = function() {
          function main() {
  /* Init Actions */
  var $atoms = jQuery(".gt_atom-51728_productButtonBuy");
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
    elementId: "51728_productButtonBuy",
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
    
      $($atom).customEvent([{"control":{"attribute":"pickProductButton","id":"pickProductButton","type":"pickproduct","isButtonAddToCard":true},"event":"click","id":1},{"control":{"attribute":"pickLinkButton","id":"pickLinkButton","newTab":false,"reference":"html","title":"Pick Link","type":"picklink","value":"/cart"},"event":"click","id":2}], "51728_productButtonBuy" + "_" + i);
    

    /* Listen if is button add to card */

    window.SOLID.store.subscribe("loading-buy-now-51728_productButtonBuy" + "_" + i, function (isDisplay) {
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
          window.SOLID.store.dispatch("loading-buy-now-51728_productButtonBuy", "");
          window.SOLID.store.dispatch("loading-buy-now-51728_productButtonBuy" + "_" + i, "");
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
            window.SOLID.store.dispatch("loading-buy-now-51728_productButtonBuy", "");
            window.SOLID.store.dispatch("loading-buy-now-51728_productButtonBuy" + "_" + i, "");
          }, 3000);
        }
      }
    });
  }
  for (let i = 0; i < $atoms.length; i++) {
    const $atom = $atoms[i];
    
        window.SOLID.library.gtBuyProductListenSoldOut({
          $element: $atom,
          options: {
            isButtonAddToCard: true, 
            textAddToCard: "Add To Cart", 
            textSoldOut: "Sold out"
          }
        })
    
    
  }
}

main();

window.SOLID.store.subscribe("run-script-51728_productButtonBuy", () => {
  main();
});

        }
        funcESAtom51728_productButtonBuy()
      } catch(e) {
        console.error("Error ESAtom Id: 51728_productButtonBuy" )
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
  
    
  